import { NextRequest } from "next/server";
import { query } from "@anthropic-ai/claude-agent-sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Formatte le contexte applicatif en texte lisible pour le system prompt.
 */
function buildContextBlock(appContext: Record<string, unknown> | undefined): string {
  if (!appContext) return "";

  const nav = appContext.navigation as { route?: string; title?: string; activeTab?: string | null } | undefined;
  const forms = appContext.forms as { id: string; fields: { name: string; type: string; value: string; placeholder: string; required: boolean; hasError: boolean }[] }[] | undefined;
  const tables = appContext.tables as { id: string; headers: string[]; rowCount: number; selectedRow: Record<string, string> | null }[] | undefined;
  const buttons = appContext.buttons as { text: string; type: string | null; id: string; className: string; disabled: boolean }[] | undefined;
  const errors = appContext.errors as string[] | undefined;
  const activeElement = appContext.activeElement as { tag: string; id: string; name: string; type: string } | null | undefined;
  const appState = appContext.appState as Record<string, unknown> | undefined;

  let block = "\n\nCONTEXTE ACTUEL DE L'APPLICATION :";

  if (nav) {
    block += `\n- Page : ${nav.route || "inconnue"}`;
    block += `\n- Titre : ${nav.title || "sans titre"}`;
    if (nav.activeTab) block += `\n- Onglet actif : ${nav.activeTab}`;
  }

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

  if (tables && tables.length > 0) {
    block += `\n- Tables visibles : ${tables.length}`;
    for (const table of tables) {
      block += `\n  - ${table.id} : ${table.headers.join(", ")} (${table.rowCount} lignes)`;
      if (table.selectedRow) {
        block += `\n    Ligne sélectionnee : ${JSON.stringify(table.selectedRow)}`;
      }
    }
  }

  if (buttons && buttons.length > 0) {
    block += `\n- Boutons/liens visibles dans le viewport : ${buttons.length}`;
    for (const btn of buttons.slice(0, 30)) {
      const dis = btn.disabled ? " [disabled]" : "";
      const id = btn.id ? ` #${btn.id}` : "";
      block += `\n  - "${btn.text}"${id}${dis}`;
    }
    if (buttons.length > 30) block += `\n  - ... et ${buttons.length - 30} autres`;
  }

  if (errors && errors.length > 0) {
    block += `\n- Erreurs visibles : ${errors.join(" | ")}`;
  } else {
    block += "\n- Erreurs : Aucune";
  }

  if (activeElement) {
    block += `\n- Element actif : <${activeElement.tag}> id="${activeElement.id}" name="${activeElement.name}"`;
  }

  const inspected = appContext.inspectedElement as {
    tag: string; id: string; classes: string[]; textContent: string;
    attributes: Record<string, string>;
    boundingRect: { x: number; y: number; width: number; height: number };
    computedStyles: Record<string, string>;
    parentTag: string; childCount: number; cssSelector: string;
    nearestHref?: string; siblingTexts?: string[]; sourceHint?: string;
  } | null | undefined;

  if (inspected) {
    const dims = `${inspected.boundingRect.width}x${inspected.boundingRect.height}px at (${inspected.boundingRect.x}, ${inspected.boundingRect.y})`;
    const styles = inspected.computedStyles;
    const styleStr = `color: ${styles.color}, background: ${styles.backgroundColor}, font: ${styles.fontSize} ${styles.fontWeight}`;
    block += `\n\nELEMENT INSPECTE PAR L'UTILISATEUR :`;
    block += `\n- Contenu texte : "${inspected.textContent.slice(0, 150)}"`;
    if (inspected.nearestHref) block += `\n- Lien (href) : "${inspected.nearestHref}"`;
    block += `\n- Selecteur CSS : ${inspected.cssSelector}`;
    block += `\n- Tag : <${inspected.tag}>`;
    block += `\n- Classes : ${inspected.classes.map(c => "." + c).join(" ") || "(aucune)"}`;
    if (inspected.id) block += `\n- ID : #${inspected.id}`;
    block += `\n- Dimensions : ${dims}`;
    block += `\n- Styles calcules : ${styleStr}`;
    block += `\n- Display : ${styles.display}, Position : ${styles.position}`;
    block += `\n- Padding : ${styles.padding}, Margin : ${styles.margin}`;
    block += `\n- Border : ${styles.border}, Border-radius : ${styles.borderRadius}`;
    if (Object.keys(inspected.attributes).length > 0) {
      block += `\n- Attributs : ${JSON.stringify(inspected.attributes)}`;
    }
    block += `\n- Parent : ${inspected.parentTag}, Enfants : ${inspected.childCount}`;
    if (inspected.siblingTexts && inspected.siblingTexts.length > 0) {
      block += `\n- Elements voisins : ${inspected.siblingTexts.map(t => `"${t}"`).join(", ")}`;
    }
    if (inspected.sourceHint) block += `\n- Indice source : ${inspected.sourceHint}`;
    block += `\nIMPORTANT : Pour retrouver cet element dans le code source, cherche par son CONTENU TEXTE ("${inspected.textContent.slice(0, 50)}") et son href (${inspected.nearestHref || "aucun"}), PAS par ses classes CSS (qui sont souvent generees par des composants UI).`;
  }

  if (appState && Object.keys(appState).length > 0) {
    block += `\n- Etat applicatif : ${JSON.stringify(appState)}`;
  }

  block += `\n- Timestamp : ${appContext.timestamp || "N/A"}`;

  return block;
}

function buildAppContextPrompt(appContext: Record<string, unknown> | undefined): string {
  if (!appContext) return "";
  return `Tu es un assistant de developpement integre dans une application web live.
Tu modifies le code source directement et les changements s'appliquent en temps reel via Hot Reload.
L'utilisateur voit immediatement le resultat de tes modifications.

REGLES :
- Tu peux lire les fichiers avec Read, chercher avec Grep/Glob, et modifier avec Edit/Write.
- Privilegue Edit pour les modifications partielles, Write pour les nouveaux fichiers.
- Ne modifie JAMAIS les fichiers dans node_modules, .env, .git, ou les fichiers du chatbot (DevChatbot/, api/chat/).
- Reponds en francais.
- Si l'utilisateur pose une question sans demander de modification, reponds simplement en texte.
- Si l'utilisateur a inspecte un element, utilise le selecteur CSS et le contenu texte pour le retrouver dans le code.

CONTEXTE LIVE DE L'APPLICATION WEB :${buildContextBlock(appContext)}`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY non configuree" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { prompt: string; appContext?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Corps de requete invalide" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt, appContext } = body;
  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: "Prompt vide" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const abortController = new AbortController();

  // Listen for client disconnect
  req.signal.addEventListener("abort", () => {
    abortController.abort();
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream may be closed
        }
      };

      try {
        const appendPrompt = buildAppContextPrompt(appContext);

        const messages = query({
          prompt,
          options: {
            allowedTools: ["Read", "Glob", "Grep", "Edit", "Write", "Bash"],
            maxTurns: 10,
            systemPrompt: {
              type: "preset" as const,
              preset: "claude_code" as const,
              append: appendPrompt,
            },
            cwd: process.cwd(),
            permissionMode: "bypassPermissions" as const,
            allowDangerouslySkipPermissions: true,
            abortController,
            includePartialMessages: true,
            persistSession: false,
          },
        });

        let filesModified = false;

        for await (const message of messages) {
          // System init message
          if (message.type === "system") {
            send({ type: "system", session_id: (message as Record<string, unknown>).session_id });
            continue;
          }

          // Assistant message (contains text blocks + tool_use blocks)
          if (message.type === "assistant") {
            const msg = message as { type: string; message?: { content?: Array<Record<string, unknown>> } };
            const content = msg.message?.content;
            if (!content) continue;

            for (const block of content) {
              if ("text" in block && block.text) {
                send({ type: "text", content: block.text });
              }
              if ("name" in block) {
                const toolName = block.name as string;
                const toolInput = block.input as Record<string, unknown> | undefined;

                send({
                  type: "tool_use",
                  tool: toolName,
                  input: toolInput,
                });

                // Track file modifications
                if (["Edit", "Write"].includes(toolName)) {
                  filesModified = true;
                  send({
                    type: "file_changed",
                    tool: toolName,
                    file: toolInput?.file_path || toolInput?.filePath || "",
                  });
                }
              }
            }
            continue;
          }

          // Streaming partial tokens
          if (message.type === "stream_event") {
            const evt = message as { type: string; event?: Record<string, unknown> };
            // Forward partial text deltas
            if (evt.event?.type === "content_block_delta") {
              const delta = (evt.event as Record<string, unknown>).delta as Record<string, unknown> | undefined;
              if (delta?.type === "text_delta" && delta.text) {
                send({ type: "text_delta", content: delta.text });
              }
            }
            continue;
          }

          // Result (final)
          if (message.type === "result") {
            const result = message as unknown as Record<string, unknown>;
            send({
              type: "result",
              subtype: result.subtype,
              cost_usd: result.total_cost_usd,
              num_turns: result.num_turns,
              duration_ms: result.duration_ms,
              usage: result.usage,
              files_modified: filesModified,
            });
            continue;
          }

          // Tool result messages
          if (message.type === "user") {
            const userMsg = message as { type: string; message?: { content?: Array<Record<string, unknown>> } };
            const content = userMsg.message?.content;
            if (!content) continue;

            for (const block of content) {
              if ("tool_use_id" in block) {
                send({
                  type: "tool_result",
                  tool_use_id: block.tool_use_id,
                  content: typeof block.content === "string"
                    ? block.content?.toString().slice(0, 500)
                    : "[result]",
                });
              }
            }
            continue;
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        send({ type: "error", message: errorMessage });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
