// app/api/game/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    // Get access token
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
    }

    // Extract search param from URL
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search");

    // Build IGDB query
    let query = "fields name, release_dates.human, url, cover.url, rating, age_ratings.rating_category, age_ratings.synopsis; limit 20;";
    if (searchTerm) {
      query = `search "${searchTerm}"; fields name, url, cover.url, release_dates.human, rating, age_ratings.rating_category, age_ratings.synopsis; limit 20; where version_parent = null;`;
    }

    // Call IGDB
    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
      body: query,
    });

    if (!igdbRes.ok) {
      const errorText = await igdbRes.text();
      console.error("IGDB request failed:", errorText);
      return NextResponse.json({ error: "Failed to fetch games from IGDB" }, { status: igdbRes.status });
    }

    const games = await igdbRes.json();
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}