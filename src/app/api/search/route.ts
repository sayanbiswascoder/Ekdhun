import { NextResponse } from 'next/server';

// GET /api/search?query=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }
  try {
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

let response: Response | null = null;
let lastError: unknown;

for (let attempt = 0; attempt < 2; attempt++) {
  try {
    response = await fetch(youtubeUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });

    if (response.ok) break;

    console.error("YouTube response:", response.status);

    if (response.status < 500 && response.status !== 429) break;
  } catch (error) {
    lastError = error;
    console.error(`YouTube attempt ${attempt + 1} failed:`, error);
  }

  if (attempt === 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

if (!response?.ok) {
  console.error("YouTube search failed:", lastError);

  return NextResponse.json(
    { error: "YouTube search temporarily unavailable" },
    { status: 503 }
  );
}
  } catch (e) {
    console.error('Search error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
