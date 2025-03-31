import { serve } from "bun";
import { MongoClient } from "mongodb";
import maxmind from "maxmind";
import config from "./config/config";

// ✅ Initialize MongoDB connection
const client = new MongoClient(config.db || "mongodb://localhost/Analytics");
await client.connect();
const db = client.db("Analytics");
const trackCollection = db.collection("tracks");

// ✅ Load GeoLite2 Database
const geoDb = await maxmind.open("./geoip.mmdb");

// ✅ Function to get device type from User-Agent
function getDeviceType(userAgent: string): "desktop" | "mobile" | "tablet" {
  if (/Mobi|Android/i.test(userAgent)) return "mobile";
  else if (/Tablet|iPad/i.test(userAgent)) return "tablet";
  return "desktop";
}

// ✅ Get country from IP
function getCountryFromIP(ip: string) {
  if (!ip || ip === "unknown") return "Unknown";
  const lookup = geoDb.get(ip);
  return lookup?.country?.names?.en || "Unknown";
}

// ✅ Start Bun server
serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // ✅ Track Route: POST /track/:unique
    if (req.method === "POST" && url.pathname.startsWith("/")) {
      try {
        const unique = url.pathname.split("/")[1];

        // ✅ Extract Headers
        const headers: Record<string, string> = {};
        req.headers.forEach((value, key) => {
          headers[key] = value;
        });

        const data = await req.json();

        const ip = headers["x-forwarded-for"] || headers["x-real-ip"] || "unknown";
        const country = getCountryFromIP(ip);

        const trackData = {
          unique_key: unique,
          url: data?.url || "unknown",
          referrer: data?.referrer || headers.referer || "direct",
          userAgent: data?.userAgent || headers["user-agent"] || "unknown",
          ip,
          loadTime: data?.loadTime || 0,
          session_id: data?.session_id || "unknown-session",
          deviceType: data?.deviceType || getDeviceType(headers["user-agent"] || ""),
          country,
          timestamp: new Date(),
        };

        await trackCollection.insertOne(trackData);

        return new Response(JSON.stringify({ message: "Tracking data stored" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error("❌ Tracking Error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    return new Response("Bun Analytics API", { status: 200 });
  },
});
