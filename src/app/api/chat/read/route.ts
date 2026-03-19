import { NextRequest, NextResponse } from "next/server";

const ALFRED_READ_URL = "https://mathieu-fournier.net/alfred/api/read";
const ALFRED_SECRET = "alfred-apply-secret-2026";

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ALFRED_READ_URL}?file=${encodeURIComponent(file)}`, {
      headers: { "X-Alfred-Secret": ALFRED_SECRET },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Read failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
