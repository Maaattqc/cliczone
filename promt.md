# Chatbot Éditeur Live — Documentation

## Ce que le chatbot fait

L'utilisateur décrit un changement d'interface en langage naturel dans un petit widget de chat.
Le chatbot **modifie directement les fichiers source** du projet. Next.js Hot Reload met à jour la page en temps réel.
L'utilisateur voit le résultat visuellement, puis **approuve** (le code reste) ou **rejette** (le fichier est restauré).

## Architecture

### 1. Widget bulle flottante
- Bouton rond fixe en bas à droite (`ChatBubble.tsx`)
- Au clic, ouvre un petit panneau de chat (360px, pas plein écran)
- Injecté une seule fois dans `src/app/layout.tsx`
- Fonctionne sur toutes les pages

### 2. Flow de modification
1. L'utilisateur décrit un changement dans le chat
2. L'API route lit **tous les fichiers source** du projet (src/)
3. Les fichiers sont envoyés à Claude via l'API Anthropic
4. Claude répond en JSON avec un `search/replace` (code exact à remplacer)
5. L'API **écrit le fichier modifié** sur le disque + garde un backup en mémoire
6. Next.js Hot Reload détecte le changement → la page se met à jour
7. Le chat affiche la description + boutons **Approuver / Rejeter**
8. Approuver → le backup est supprimé, le code modifié reste permanent
9. Rejeter → le fichier original est restauré depuis le backup

### 3. API Route (`src/app/api/chat/route.ts`)
- Endpoint : POST `/api/chat`
- Lit les fichiers .tsx/.ts de src/ (exclut DevChatbot et api/chat)
- Envoie tout le code source dans le system prompt à Claude
- Claude répond en JSON strict (pas de texte autour)
- Parsing robuste : essaie JSON direct, puis nettoyage markdown, puis regex
- Applique le search/replace sur le fichier ciblé
- Stocke le backup en mémoire (variable module-level)
- Actions `approve` et `reject` pour gérer le backup
- Sécurité : seuls les fichiers dans src/ peuvent être modifiés
- Modèle : `claude-sonnet-4-20250514`
- Clé API : `ANTHROPIC_API_KEY` dans `.env.local`

### 4. System prompt
Le system prompt demande à Claude de répondre UNIQUEMENT en JSON :
```json
// Pour modifier du code :
{"type":"modify","file":"src/chemin.tsx","search":"code EXACT existant","replace":"nouveau code","description":"résumé"}

// Pour une réponse texte :
{"type":"text","message":"réponse"}
```
Le champ `search` doit être une copie exacte caractère par caractère du code existant.

### 5. Rate limiting
- Maximum 50 messages par session (useState)
- Avertissement à 40 messages
- Bloqué à 50
- Une seule modification à la fois (doit approuver/rejeter avant la suivante)

## Fichiers du chatbot

```
src/app/api/chat/route.ts          — API route (lecture fichiers, appel Claude, écriture fichiers, backup/undo)
src/components/DevChatbot/index.tsx      — Export principal (client component)
src/components/DevChatbot/ChatBubble.tsx — Bouton bulle flottante
src/components/DevChatbot/ChatPanel.tsx  — Widget de chat avec approve/reject
src/app/layout.tsx                       — Import <DevChatbot /> (déjà ajouté)
```

Le fichier `UIRenderer.tsx` n'est plus utilisé (l'ancienne approche avec canvas/preview a été remplacée par l'édition directe des fichiers).

## Stack utilisée
- Next.js App Router + TypeScript
- Tailwind CSS
- API Anthropic (claude-sonnet-4-20250514)
- Node.js `fs` pour lire/écrire les fichiers source
- useState uniquement (pas de localStorage, pas de Context/Redux)
- Fetch natif pour les appels API

## Style du widget
- Thème sombre (background #0f1117, surface #1e2433)
- Bulle flottante bleue (#3b5bdb)
- Messages utilisateur : bleu / Messages assistant : gris foncé
- Messages de modification : bordure verte
- Boutons Approuver (vert) / Rejeter (rouge) inline dans le chat

## Variable d'environnement

Dans `.env.local` :
```
ANTHROPIC_API_KEY=ta-clé-api-ici
```

Obtenir une clé : https://console.anthropic.com/settings/keys
Les crédits API sont séparés de l'abonnement Claude Pro.
