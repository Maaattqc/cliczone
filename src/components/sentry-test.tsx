"use client";

// TODO: Supprimer ce composant après vérification Sentry
export function SentryTest() {
  return (
    <button
      className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm z-50"
      onClick={() => {
        throw new Error("Sentry test error — delete me");
      }}
    >
      Test Sentry Error
    </button>
  );
}
