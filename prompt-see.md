Mon chatbot IA est déjà intégré dans l'app. Maintenant je veux qu'il 
soit conscient de l'état de l'app en temps réel — exactement comme 
un MCP server le fait dans une app WinForms C#.

## Ce que le chatbot doit voir automatiquement

À chaque message envoyé, capturer et envoyer ce contexte à Claude :

### 1. Navigation / Page active
- URL courante (window.location.pathname)
- Titre de la page active (document.title)
- Onglet actif si tabs présents (chercher .active, [aria-selected="true"], .tab-active)
- Breadcrumb si présent

### 2. Formulaires visibles à l'écran
- Tous les <form> visibles dans le viewport
- Pour chaque form : son id, ses champs (name, type, value actuelle, placeholder, required)
- Valeur courante de chaque input/select/textarea
- Champs en erreur (aria-invalid, .error, .is-invalid)

### 3. Tableaux / Listes de données
- Tous les <table> visibles
- Headers des colonnes
- Nombre de lignes
- Ligne sélectionnée si applicable (.selected, .active, [aria-selected])
- Données de la ligne sélectionnée

### 4. État React exposé (window.__APP_STATE__)
Créer un hook useAppStateExpose() qui met à jour window.__APP_STATE__ 
automatiquement quand le state change :
- Page/module courant
- Enregistrement sélectionné (commande, client, produit, etc.)
- Filtres actifs
- Permissions/rôle de l'utilisateur connecté
- Modals/drawers ouverts

### 5. Élément actif / focus
- Quel input a le focus (document.activeElement)
- Quel bouton/lien est hover si possible

### 6. Erreurs visibles
- Messages d'erreur dans le DOM (.error-message, .alert-danger, [role="alert"])
- Console errors des 5 dernières secondes (intercepter console.error)

### 7. Screenshot du viewport (optionnel mais puissant)
Utiliser html2canvas pour capturer une image du viewport courant
et l'envoyer en base64 à Claude pour qu'il voie visuellement l'écran.
Ajouter un toggle "Partager mon écran" dans le chat UI.

## Fichiers à créer/modifier

### Nouveau fichier : /components/DevChatbot/useAppContext.ts
Hook qui collecte tout le contexte de l'app :
```typescript
export function useAppContext() {
  const collectContext = useCallback(() => {
    return {
      navigation: {
        route: window.location.pathname,
        title: document.title,
        activeTab: getActiveTab(),
      },
      forms: getVisibleForms(),
      tables: getVisibleTables(),
      appState: window.__APP_STATE__ || {},
      activeElement: getActiveElement(),
      errors: getVisibleErrors(),
      timestamp: new Date().toISOString()
    }
  }, [])
  
  return { collectContext }
}
```

### Nouveau fichier : /components/DevChatbot/contextCollectors.ts
Fonctions pures de collecte DOM :

- getActiveTab() → string | null
- getVisibleForms() → FormSnapshot[]
- getVisibleTables() → TableSnapshot[]  
- getActiveElement() → ElementSnapshot | null
- getVisibleErrors() → string[]
- captureScreenshot() → Promise<string> (base64, optionnel)

### Modifier : /components/DevChatbot/ChatPanel.tsx
Avant chaque envoi de message, appeler collectContext() et inclure 
dans le body de la requête API :
```typescript
const { collectContext } = useAppContext()

const sendMessage = async (userMessage: string) => {
  const context = collectContext()
  
  await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: userMessage,
      appContext: context  // ← Claude voit l'écran
    })
  })
}
```

### Modifier : /app/api/chat/route.ts (Next.js) ou équivalent
Inclure le contexte dans le system prompt envoyé à Claude :
```typescript
const systemPrompt = `
Tu es l'assistant IA intégré dans cette application web.

CONTEXTE ACTUEL DE L'APPLICATION :
- Page active : ${appContext.navigation.route}
- Onglet actif : ${appContext.navigation.activeTab}

FORMULAIRES VISIBLES :
${JSON.stringify(appContext.forms, null, 2)}

TABLEAUX VISIBLES :
${JSON.stringify(appContext.tables, null, 2)}

ÉTAT DE L'APP :
${JSON.stringify(appContext.appState, null, 2)}

ERREURS VISIBLES :
${appContext.errors.join(', ') || 'Aucune'}

ÉLÉMENT ACTIF : ${appContext.activeElement?.name || 'Aucun'}

Tu peux donc :
- Savoir exactement sur quel écran l'utilisateur est
- Voir les valeurs actuelles des champs
- Modifier l'UI en conséquence
- Aider avec les erreurs visibles

Réponds en JSON selon le schéma UI ou { "type": "text", "message": "..." }
`
```

### Nouveau fichier : /hooks/useAppStateExpose.ts
À placer dans le layout principal — expose le state React globalement :
```typescript
export function useAppStateExpose(state: AppState) {
  useEffect(() => {
    window.__APP_STATE__ = {
      currentModule: state.currentModule,
      selectedRecord: state.selectedRecord,
      currentUser: state.currentUser,
      filters: state.activeFilters,
      openModals: state.openModals,
    }
  }, [state])
}

// Dans le layout principal :
// useAppStateExpose(yourGlobalState)
```

## Comportement attendu après intégration

Scénario 1 — L'user est sur la page Commandes, commande #456 sélectionnée :
> User: "Pourquoi cette commande est en retard ?"
> Claude sait : page=commandes, selectedRecord={id:456, statut:'En retard', client:'Acier Beco'}
> Claude répond avec contexte précis

Scénario 2 — L'user a un formulaire avec des erreurs :
> User: "Aide-moi à corriger"  
> Claude voit : errors=["Le champ Email est invalide", "Date requise"]
> Claude guide précisément

Scénario 3 — L'user est dans un tableau :
> User: "Génère un formulaire pour modifier cette ligne"
> Claude voit la ligne sélectionnée avec toutes ses valeurs
> Claude génère un formulaire pré-rempli avec les bonnes valeurs

## Sécurité
- Ne jamais envoyer de mots de passe (filtrer les input[type=password])
- Ne pas envoyer les tokens JWT visibles dans le state
- Ajouter une liste noire de champs sensibles : ['password', 'token', 'secret', 'credit_card']
- Tronquer les valeurs longues à 200 caractères

## Optionnel — html2canvas pour screenshot
```bash
npm install html2canvas
```

Ajouter un bouton "📷 Partager mon écran" dans le chat qui :
1. Capture le viewport en base64
2. L'envoie à Claude comme image
3. Claude voit visuellement ce que l'user voit

## Commence par
1. Créer useAppContext.ts et contextCollectors.ts
2. Modifier ChatPanel.tsx pour collecter le contexte avant envoi
3. Modifier l'API route pour injecter le contexte dans le system prompt
4. Créer useAppStateExpose.ts et me dire où l'ajouter dans mon layout
5. Tester avec ce scénario : je suis sur n'importe quelle page, 
   je tape "sur quelle page suis-je ?" et le bot doit répondre correctement