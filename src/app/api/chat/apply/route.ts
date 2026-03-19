import { NextRequest, NextResponse } from "next/server";

const ALFRED_APPLY_URL = "https://mathieu-fournier.net/alfred/api/apply";
const ALFRED_SECRET = "alfred-apply-secret-2026";

export async function POST(req: NextRequest) {
  try {
    const { file, fullContent, description } = await req.json();

    if (!file || !fullContent) {
      return NextResponse.json(
        { error: "Missing file or fullContent" },
        { status: 400 }
      );
    }

    const res = await fetch(ALFRED_APPLY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Alfred-Secret": ALFRED_SECRET,
      },
      body: JSON.stringify({ file, fullContent, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Apply failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
