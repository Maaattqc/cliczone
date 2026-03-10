import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Modification en attente d'approbation (pas encore écrite sur disque)
let pendingModification: {
  filePath: string;
  originalContent: string;
  newContent: string;
  search: string;
  replace: string;
} | null = null;

// Dossiers à ignorer lors du scan
const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  ".turbo",
  "coverage",
  "__pycache__",
  "DevChatbot",
]);

// Extensions de fichiers source supportées
const SOURCE_EXTENSIONS = new Set([
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".vue",
  ".svelte",
  ".astro",
  ".css",
  ".scss",
  ".html",
]);

const SYSTEM_PROMPT = `Tu es un assistant de développement. Tu modifies le code source en temps réel via Hot Reload.

RÈGLE ABSOLUE : Ta réponse ENTIÈRE doit être UN SEUL objet JSON valide. AUCUN texte avant, après, ou autour. Pas de markdown. Pas d'explication. JUSTE le JSON.

Format modification :
{"type":"modify","file":"chemin/relatif.tsx","search":"code EXACT existant","replace":"nouveau code","description":"résumé court","css_preview":"sélecteur { prop: val !important; }"}

Le champ "css_preview" est OBLIGATOIRE pour les modifications visuelles (couleurs, tailles, spacing, fonts, bordures, arrondis, ombres, opacité, padding, margin, largeur, hauteur). Il contient du CSS pur qui reproduit visuellement le changement demandé, avec des sélecteurs suffisamment spécifiques et !important pour overrider les styles existants.
Si la modification n'est PAS purement visuelle (changement de texte, de logique, de structure HTML, ajout/suppression d'éléments), mets "css_preview" à null.

Format pour demander un fichier que tu n'as pas encore vu :
{"type":"need_file","file":"chemin/relatif.tsx"}

Format texte :
{"type":"text","message":"réponse"}

Règles pour "search" :
- Copie EXACTE caractère par caractère du code existant (indentation, guillemets, sauts de ligne)
- Inclus assez de contexte pour que ce soit unique dans le fichier
- UN seul fichier à la fois
- Garde le style existant du projet
- Si tu ne connais pas le contenu d'un fichier, utilise "need_file" pour le demander AVANT de tenter une modification

RAPPEL : Réponds UNIQUEMENT avec le JSON. Rien d'autre.`;

/**
 * Scanne récursivement un répertoire et retourne tous les fichiers source.
 * Fonctionne avec n'importe quel projet (Next.js, Vite, Vue, Svelte, etc.)
 */
function scanProject(rootDir: string): { filePath: string; size: number }[] {
  const results: { filePath: string; size: number }[] = [];

  function walk(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (SOURCE_EXTENSIONS.has(ext)) {
            const rel = path.relative(rootDir, fullPath).replace(/\\/g, "/");
            // Exclure les fichiers du chatbot lui-même
            if (rel.includes("DevChatbot") || rel.includes("api/chat")) continue;
            const stat = fs.statSync(fullPath);
            results.push({ filePath: rel, size: stat.size });
          }
        }
      }
    } catch {
      // skip inaccessible dirs
    }
  }

  walk(rootDir);
  return results;
}

/**
 * Détecte automatiquement le dossier source du projet.
 * Supporte: src/, app/, pages/, components/, lib/, etc.
 */
function detectSourceDir(rootDir: string): string {
  // Vérifie les dossiers source courants
  for (const dir of ["src", "app", "pages"]) {
    if (fs.existsSync(path.join(rootDir, dir))) {
      return rootDir; // scan depuis la racine, le walk ignore node_modules etc.
    }
  }
  return rootDir;
}

/**
 * Détecte les fichiers "clés" du projet automatiquement :
 * - Layout / page d'accueil
 * - Fichier d'entrée (App, main, index)
 * - Config (tailwind, next.config, vite.config)
 */
function detectKeyFiles(allFiles: { filePath: string; size: number }[]): string[] {
  const keyPatterns = [
    // Pages d'accueil / layout (tous frameworks)
    /^(src\/)?(app\/)?layout\.[tjx]+$/,
    /^(src\/)?(app\/)?page\.[tjx]+$/,
    /^(src\/)?App\.[tjx]+$/,
    /^(src\/)?main\.[tjx]+$/,
    /^(src\/)?index\.[tjx]+$/,
    // Pages router Next.js
    /^(src\/)?pages\/index\.[tjx]+$/,
    /^(src\/)?pages\/_app\.[tjx]+$/,
    // Layout / navigation (noms communs)
    /\/(layout|navbar|nav|header|footer|sidebar)\.[tjx]+$/i,
    // Fichiers d'entrée Vue/Svelte
    /^(src\/)?App\.vue$/,
    /^(src\/)?App\.svelte$/,
  ];

  const keyFiles: string[] = [];

  for (const file of allFiles) {
    for (const pattern of keyPatterns) {
      if (pattern.test(file.filePath)) {
        keyFiles.push(file.filePath);
        break;
      }
    }
  }

  // Limiter à ~15K tokens (~60KB) pour rester sous le rate limit
  const MAX_KEY_BYTES = 60_000;
  let totalBytes = 0;
  const limited: string[] = [];

  for (const f of keyFiles) {
    const file = allFiles.find((af) => af.filePath === f);
    if (file && totalBytes + file.size < MAX_KEY_BYTES) {
      limited.push(f);
      totalBytes += file.size;
    }
  }

  return limited;
}

/**
 * Détermine quels fichiers sont pertinents pour la requête de l'utilisateur.
 * Analyse les mots-clés dans le dernier message.
 */
function findRelevantFiles(
  userMessage: string,
  allFiles: { filePath: string; size: number }[]
): string[] {
  const msg = userMessage.toLowerCase();
  const relevant: string[] = [];

  // Mapping mots-clés → patterns de fichiers
  const keywordMap: [RegExp, RegExp][] = [
    [/nav(bar|igation)?|menu|header/i, /nav|header|menu/i],
    [/footer|pied de page/i, /footer/i],
    [/bouton|button|btn/i, /button|btn/i],
    [/accueil|home|page principale/i, /page\.[tjx]|index\.[tjx]/i],
    [/layout|mise en page/i, /layout/i],
    [/sidebar|barre lat/i, /sidebar/i],
    [/formulaire|form/i, /form/i],
    [/table|tableau/i, /table/i],
    [/card|carte/i, /card/i],
    [/modal|dialog/i, /modal|dialog/i],
    [/input|champ/i, /input/i],
    [/badge/i, /badge/i],
    [/tab|onglet/i, /tab/i],
    [/select|dropdown/i, /select/i],
    [/blog/i, /blog/i],
    [/contact/i, /contact/i],
    [/login|auth|connexion/i, /login|auth|sign/i],
    [/profil|profile|compte/i, /profil|profile|account/i],
    [/search|recherche/i, /search/i],
    [/style|css|couleur|color|thème|theme/i, /\.css$|\.scss$|global/i],
  ];

  for (const [keyword, filePattern] of keywordMap) {
    if (keyword.test(msg)) {
      for (const file of allFiles) {
        if (filePattern.test(file.filePath) && !relevant.includes(file.filePath)) {
          relevant.push(file.filePath);
        }
      }
    }
  }

  return relevant;
}

/**
 * Formatte le contexte applicatif en texte lisible pour le system prompt.
 */
function buildContextBlock(appContext: Record<string, unknown> | undefined): string {
  if (!appContext) return "";

  const nav = appContext.navigation as { route?: string; title?: string; activeTab?: string | null } | undefined;
  const forms = appContext.forms as { id: string; fields: { name: string; type: string; value: string; placeholder: string; required: boolean; hasError: boolean }[] }[] | undefined;
  const tables = appContext.tables as { id: string; headers: string[]; rowCount: number; selectedRow: Record<string, string> | null }[] | undefined;
  const errors = appContext.errors as string[] | undefined;
  const activeElement = appContext.activeElement as { tag: string; id: string; name: string; type: string } | null | undefined;
  const appState = appContext.appState as Record<string, unknown> | undefined;

  let block = "\n\nCONTEXTE ACTUEL DE L'APPLICATION :";

  // Navigation
  if (nav) {
    block += `\n- Page : ${nav.route || "inconnue"}`;
    block += `\n- Titre : ${nav.title || "sans titre"}`;
    if (nav.activeTab) block += `\n- Onglet actif : ${nav.activeTab}`;
  }

  // Forms
  if (forms && forms.length > 0) {
    block += `\n- Formulaires visibles : ${forms.length}`;
    for (const form of forms) {
      block += `\n  - ${form.id} (${form.fields.length} champs)`;
      for (const field of form.fields) {
        const val = field.value ? ` = "${field.value}"` : "";
        const req = field.required ? " [requis]" : "";
        const err = field.hasError ? " [ERREUR]" : "";
        block += `\n    - ${field.name || field.placeholder || "sans nom"} (${field.type})${val}${req}${err}`;
      }
    }
  } else {
    block += "\n- Formulaires : Aucun";
  }

  // Tables
  if (tables && tables.length > 0) {
    block += `\n- Tables visibles : ${tables.length}`;
    for (const table of tables) {
      block += `\n  - ${table.id} : ${table.headers.join(", ")} (${table.rowCount} lignes)`;
      if (table.selectedRow) {
        block += `\n    Ligne sélectionnée : ${JSON.stringify(table.selectedRow)}`;
      }
    }
  }

  // Errors
  if (errors && errors.length > 0) {
    block += `\n- Erreurs visibles : ${errors.join(" | ")}`;
  } else {
    block += "\n- Erreurs : Aucune";
  }

  // Active element
  if (activeElement) {
    block += `\n- Élément actif : <${activeElement.tag}> id="${activeElement.id}" name="${activeElement.name}"`;
  }

  // App state
  if (appState && Object.keys(appState).length > 0) {
    block += `\n- État applicatif : ${JSON.stringify(appState)}`;
  }

  block += `\n- Timestamp : ${appContext.timestamp || "N/A"}`;

  return block;
}

function buildSystemPrompt(
  projectRoot: string,
  userMessage: string,
  appContext?: Record<string, unknown>
): string {
  const allFiles = scanProject(projectRoot);
  const keyFiles = detectKeyFiles(allFiles);
  const relevantFiles = findRelevantFiles(userMessage, allFiles);

  // Fusionner key + relevant sans doublons
  const filesToInclude = [...new Set([...keyFiles, ...relevantFiles])];

  // Limiter la taille totale (~60KB)
  const MAX_BYTES = 60_000;
  let totalBytes = 0;
  const finalFiles: string[] = [];

  for (const f of filesToInclude) {
    const file = allFiles.find((af) => af.filePath === f);
    if (file && totalBytes + file.size < MAX_BYTES) {
      finalFiles.push(f);
      totalBytes += file.size;
    }
  }

  let prompt = SYSTEM_PROMPT;
  prompt +=
    "\n\nTOUS LES FICHIERS DU PROJET :\n" +
    allFiles.map((f) => f.filePath).join("\n");
  prompt += "\n\nCONTENU DES FICHIERS CHARGÉS :\n\n";

  for (const file of finalFiles) {
    try {
      const content = fs.readFileSync(
        path.join(projectRoot, file),
        "utf-8"
      );
      prompt += `=== ${file} ===\n${content}\n=== FIN ===\n\n`;
    } catch {
      // skip
    }
  }

  prompt += `\nFichiers chargés : ${finalFiles.join(", ")}`;
  prompt += `\nSi tu dois modifier un fichier non chargé, utilise "need_file" pour le demander.`;

  // Inject live app context
  if (appContext) {
    prompt += buildContextBlock(appContext);
    prompt += "\n\nTu as accès au contexte live de l'app (page courante, formulaires, erreurs, etc.). Utilise-le pour répondre avec précision aux questions de l'utilisateur sur l'état de l'interface.";
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY non configurée" },
      { status: 500 }
    );
  }

  try {
    const { messages, action, appContext } = await req.json();

    // Handle approve — NOW we write the file
    if (action === "approve") {
      if (pendingModification) {
        fs.writeFileSync(
          pendingModification.filePath,
          pendingModification.newContent,
          "utf-8"
        );
        pendingModification = null;
      }
      return NextResponse.json({ success: true });
    }

    // Handle reject — just discard, nothing was written
    if (action === "reject") {
      pendingModification = null;
      return NextResponse.json({ success: true });
    }

    // Block if a modification is pending approval
    if (pendingModification) {
      return NextResponse.json({
        response: JSON.stringify({
          type: "text",
          message:
            "Une modification est en attente. Approuvez ou rejetez-la avant d'en demander une nouvelle.",
        }),
        hasModification: false,
      });
    }

    const projectRoot = process.cwd();
    const lastUserMessage =
      messages[messages.length - 1]?.content || "";
    const systemPrompt = buildSystemPrompt(projectRoot, lastUserMessage, appContext);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Anthropic error:", response.status, errBody);
      if (response.status === 429) {
        return NextResponse.json({
          response: JSON.stringify({
            type: "text",
            message:
              "Rate limit atteint. Attendez quelques secondes avant de réessayer.",
          }),
          hasModification: false,
        });
      }
      return NextResponse.json(
        { error: `Erreur API Anthropic: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse response — extract JSON robustly
    let parsed = extractJSON(text);
    if (!parsed) {
      return NextResponse.json({
        response: JSON.stringify({ type: "text", message: text }),
        hasModification: false,
      });
    }

    // Handle "need_file" — Claude needs a file it doesn't have
    if (parsed.type === "need_file" && parsed.file) {
      try {
        const content = fs.readFileSync(
          path.join(projectRoot, parsed.file),
          "utf-8"
        );

        const augmentedMessages = [
          ...messages,
          { role: "assistant", content: JSON.stringify(parsed) },
          {
            role: "user",
            content: `Voici le contenu de ${parsed.file} :\n\n${content}`,
          },
        ];

        const retryResponse = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 4096,
              system: systemPrompt,
              messages: augmentedMessages.map(
                (m: { role: string; content: string }) => ({
                  role: m.role,
                  content: m.content,
                })
              ),
            }),
          }
        );

        if (!retryResponse.ok) {
          return NextResponse.json({
            response: JSON.stringify({
              type: "text",
              message: "Erreur lors du chargement du fichier. Réessayez.",
            }),
            hasModification: false,
          });
        }

        const retryData = await retryResponse.json();
        const retryText = retryData.content?.[0]?.text || "";
        parsed = extractJSON(retryText);
        if (!parsed) {
          return NextResponse.json({
            response: JSON.stringify({ type: "text", message: retryText }),
            hasModification: false,
          });
        }
      } catch {
        return NextResponse.json({
          response: JSON.stringify({
            type: "text",
            message: `Fichier introuvable : ${parsed?.file}`,
          }),
          hasModification: false,
        });
      }
    }

    // Handle code modification
    if (
      parsed.type === "modify" &&
      parsed.file &&
      parsed.search &&
      parsed.replace
    ) {
      const filePath = path.join(projectRoot, parsed.file);

      // Sécurité : bloquer les fichiers sensibles
      const blocked = [
        "node_modules",
        ".env",
        ".git",
        "package-lock",
        "yarn.lock",
        "pnpm-lock",
      ];
      if (blocked.some((b) => parsed.file.includes(b))) {
        return NextResponse.json({
          response: JSON.stringify({
            type: "text",
            message: "Ce fichier ne peut pas être modifié pour des raisons de sécurité.",
          }),
          hasModification: false,
        });
      }

      let currentContent: string;
      try {
        currentContent = fs.readFileSync(filePath, "utf-8");
      } catch {
        return NextResponse.json({
          response: JSON.stringify({
            type: "text",
            message: `Fichier introuvable : ${parsed.file}`,
          }),
          hasModification: false,
        });
      }

      if (!currentContent.includes(parsed.search)) {
        return NextResponse.json({
          response: JSON.stringify({
            type: "text",
            message:
              "Le code à remplacer n'a pas été trouvé dans le fichier. Réessayez.",
          }),
          hasModification: false,
        });
      }

      // Store pending modification — do NOT write yet
      const newContent = currentContent.replace(parsed.search, parsed.replace);
      pendingModification = {
        filePath,
        originalContent: currentContent,
        newContent,
        search: parsed.search,
        replace: parsed.replace,
      };

      return NextResponse.json({
        response: JSON.stringify({
          type: "modify",
          description: parsed.description,
          file: parsed.file,
          search: parsed.search,
          replace: parsed.replace,
          css_preview: parsed.css_preview || null,
        }),
        hasModification: true,
      });
    }

    // Handle text response
    if (parsed.type === "text") {
      return NextResponse.json({
        response: JSON.stringify(parsed),
        hasModification: false,
      });
    }

    return NextResponse.json({
      response: JSON.stringify({ type: "text", message: text }),
      hasModification: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}

/** Extract JSON from Claude's response, handling markdown and text around it */
function extractJSON(text: string): Record<string, string> | null {
  // Try direct parse
  try {
    return JSON.parse(text.trim());
  } catch {}

  // Try removing markdown
  try {
    return JSON.parse(
      text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
    );
  } catch {}

  // Try regex extraction
  const match = text.match(
    /\{[\s\S]*"type"\s*:\s*"(modify|text|need_file)"[\s\S]*\}/
  );
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}
