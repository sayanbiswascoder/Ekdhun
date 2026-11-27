
import { NextResponse } from "next/server";

// GET /api/search?query=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  let response: Response | null = null;
  let lastError: unknown = null;

  // Retry YouTube request once if it fails
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

      console.error("YouTube HTTP status:", response.status);

      if (response.status !== 429 && response.status < 500) {
        break;
      }

      response = null;
    } catch (error) {
      lastError = error;
      response = null;

      console.error(
        `YouTube attempt ${attempt + 1} failed:`,
        error
      );
    }

    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Always return a response when YouTube fails
  if (!response?.ok) {
    console.error("YouTube search unavailable:", lastError);

    return NextResponse.json(
      { error: "YouTube search temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const html = await response.text();

    // Extract ytInitialData
    const match = html.match(/var ytInitialData = (\{.+?\});/s);

    if (!match) {
      return NextResponse.json(
        { error: "Failed to extract YouTube search data" },
        { status: 502 }
      );
    }

    const data = JSON.parse(match[1]);

    const contents =
      data.contents?.twoColumnSearchResultsRenderer
        ?.primaryContents?.sectionListRenderer
        ?.contents?.[0]?.itemSectionRenderer?.contents || [];

    const results = [];

    for (const item of contents) {
      if (!item.videoRenderer) continue;

      const vr = item.videoRenderer;

      results.push({
        id: vr.videoId,
        title: vr.title?.runs?.[0]?.text || "",
        thumbnail:
          vr.thumbnail?.thumbnails?.[
            vr.thumbnail.thumbnails.length - 1
          ]?.url || "",
      });

      if (results.length >= 10) break;
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("YouTube parsing error:", error);

    return NextResponse.json(
      { error: "Failed to process YouTube search results" },
      { status: 500 }
    );
  }
}
