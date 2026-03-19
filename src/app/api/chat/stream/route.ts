import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function buildContextBlock(appContext: Record<string, unknown> | undefined): string {
  if (!appContext) return "";

  const nav = appContext.navigation as { route?: string; title?: string; activeTab?: string | null } | undefined;
  const forms = appContext.forms as { id: string; fields: { name: string; type: string; value: string; placeholder: string; required: boolean; hasError: boolean }[] }[] | undefined;
  const buttons = appContext.buttons as { text: string; type: string | null; id: string; className: string; disabled: boolean }[] | undefined;
  const errors = appContext.errors as string[] | undefined;

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
    }
  }

  if (buttons && buttons.length > 0) {
    block += `\n- Boutons visibles : ${buttons.slice(0, 10).map(b => `"${b.text}"`).join(", ")}`;
  }

  if (errors && errors.length > 0) {
    block += `\n- Erreurs : ${errors.join(" | ")}`;
  }

  const inspected = appContext.inspectedElement as {
    tag: string; id: string; classes: string[]; textContent: string;
    cssSelector: string; nearestHref?: string; sourceHint?: string;
    computedStyles: Record<string, string>;
  } | null | undefined;

  if (inspected) {
    block += `\n\nELEMENT INSPECTE :`;
    block += `\n- Contenu : "${inspected.textContent.slice(0, 150)}"`;
    block += `\n- Selecteur CSS : ${inspected.cssSelector}`;
    block += `\n- Tag : <${inspected.tag}>`;
    block += `\n- Classes : ${inspected.classes.map(c => "." + c).join(" ") || "(aucune)"}`;
    if (inspected.nearestHref) block += `\n- Lien : "${inspected.nearestHref}"`;
    if (inspected.sourceHint) block += `\n- Indice source : ${inspected.sourceHint}`;
  }

  return block;
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

  const client = new Anthropic({ apiKey });

  const systemPrompt = `Tu es un assistant de développement intégré dans ClicZone, une plateforme SaaS de micro-outils basés sur les données publiques du Québec.
Tu aides l'utilisateur à comprendre et améliorer l'application.
Réponds en français. Sois concis et pratique.

IMPORTANT — MODIFICATIONS DE FICHIERS :
Quand tu veux modifier du texte dans un fichier, utilise le format SEARCH/REPLACE :

<code_change>
{
  "file": "src/app/page.tsx",
  "description": "Description courte du changement",
  "oldText": "texte EXACT à remplacer (copie exacte depuis le fichier source)",
  "newText": "nouveau texte de remplacement"
}
</code_change>

Règles CRITIQUES :
- Utilise TOUJOURS oldText/newText — JAMAIS fullContent
- oldText doit être le texte EXACT qui apparaît dans le fichier (copie mot pour mot)
- newText doit contenir seulement le texte modifié, pas tout le fichier
- Si tu ne vois pas le texte exact dans le contexte fourni, indique quel fichier tu dois lire
- Le chemin est relatif à la racine (ex: src/app/page.tsx)
- Explique le changement AVANT le bloc code_change
- Pour les textes visibles (titres, boutons, descriptions), tu peux les voir dans le contexte de l'élément inspecté
${buildContextBlock(appContext)}`;

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
        send({ type: "system", session_id: "direct-api" });

        const response = await client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of response) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            send({ type: "text_delta", content: chunk.delta.text });
          }
        }

        const finalMessage = await response.finalMessage();
        send({
          type: "result",
          subtype: "success",
          cost_usd: 0,
          num_turns: 1,
          files_modified: false,
          usage: finalMessage.usage,
        });

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
