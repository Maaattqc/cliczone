import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requete invalide" },
        { status: 400 }
      );
    }

    const { action } = body as { action?: string };

    // Undo: revert all file changes via git
    if (action === "undo") {
      try {
        execSync("git checkout .", { cwd: process.cwd(), timeout: 10000, stdio: "pipe" });
        return NextResponse.json({ success: true, message: "Modifications annulees" });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur git";
        return NextResponse.json(
          { error: `Impossible d'annuler : ${errorMsg}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Action inconnue. Utilisez /api/chat/stream pour les messages." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
