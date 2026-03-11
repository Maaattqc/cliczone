# Plan : Intégrer Claude Code (headless) dans l'éditeur live

## Contexte

Le chatbot actuel fait tout en 1 appel API avec un format JSON custom. On veut la vraie logique Claude Code : multi-step, exploration de fichiers, planification, tools natifs.

**Approche choisie** : SDK Agent (`@anthropic-ai/claude-agent-sdk`) qui expose la logique de `claude -p` depuis TypeScript, sans spawner de process.

---

## Architecture cible

```
ChatPanel.tsx (React)
  ↕ SSE (Server-Sent Events)
/api/chat/stream/route.ts (Next.js API Route)
  ↕
@anthropic-ai/claude-agent-sdk  →  query({ prompt, options })
  → Claude Code lit des fichiers (Read tool)
  → Claude Code réfléchit
  → Claude Code propose des modifications (Edit tool)
  → Auto-execute + Undo
```

---

## Fichiers à modifier/créer

| Fichier | Action | Statut |
|---------|--------|--------|
| `package.json` | Modifier — ajouter `@anthropic-ai/claude-agent-sdk` | FAIT |
| `src/app/api/chat/stream/route.ts` | **CRÉER** — endpoint SSE avec le SDK agent | FAIT |
| `src/app/api/chat/route.ts` | Modifier — garder seulement undo, supprimer l'ancien appel API | FAIT |
| `src/components/DevChatbot/AgentSteps.tsx` | **CRÉER** — composant UI pour les étapes agent | FAIT |
| `src/components/DevChatbot/ChatPanel.tsx` | Modifier — remplacer fetch par EventSource SSE | **À FAIRE** |

---

## Étape 1 : SDK installé ✅

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Étape 2 : Endpoint SSE (`src/app/api/chat/stream/route.ts`) ✅

- Reçoit `{ prompt, appContext }` en POST
- Lance `query()` du SDK avec les tools autorisés
- Stream chaque événement au client via SSE
- Options : `maxTurns: 10`, `bypassPermissions`, `includePartialMessages: true`
- System prompt : preset `claude_code` + append du contexte app live

## Étape 3 : Route simplifiée (`route.ts`) ✅

- Garde uniquement le handler `undo` (git checkout .)
- Tout le reste (SYSTEM_PROMPT, extractJSON, fuzzyFindMatch, pendingActions, etc.) supprimé

## Étape 4 : Composant AgentSteps ✅

- Affiche les étapes de l'agent (Read, Edit, Write, Grep, Bash, text, error)
- Diffs affichés pour Edit/Write
- Étapes Read/Grep/Glob collapsées par défaut

## Étape 5 : Frontend SSE (ChatPanel.tsx) — À FAIRE

- Remplacer `fetch("/api/chat")` par `fetch("/api/chat/stream")` + ReadableStream
- Afficher les étapes en temps réel avec `AgentSteps`
- Ajouter bouton "Annuler" (git checkout .) après chaque session agent
- Supprimer l'ancien flow approve/reject (plus nécessaire — auto-execute)

---

## Options SDK clés

| Option | Valeur | Pourquoi |
|--------|--------|----------|
| `allowedTools` | `["Read", "Glob", "Grep", "Edit", "Write", "Bash"]` | Claude Code peut lire ET écrire |
| `maxTurns` | `10` | Limite le nombre d'étapes agent |
| `permissionMode` | `"bypassPermissions"` | Auto-execute (pas de confirmation) |
| `includePartialMessages` | `true` | Stream les tokens un par un |
| `systemPrompt` | `{ type: "preset", preset: "claude_code", append: contextApp }` | Prompt natif Claude Code + contexte app |

---

## Résumé des changements

| Avant | Après |
|-------|-------|
| 1 appel API → JSON custom | Boucle agent SDK multi-step |
| `SYSTEM_PROMPT` custom 60 lignes | Prompt natif Claude Code + append contexte app |
| `extractJSON()` parsing fragile | Stream JSON structuré natif |
| `fuzzyFindMatch()` custom | Claude Code gère nativement (Read + Edit tools) |
| 60KB de fichiers dans le prompt | Claude Code lit à la demande (Read tool) |
| 1 fichier modifié par interaction | Multi-fichiers naturellement |
| Approve → write | Auto-execute + Undo |
