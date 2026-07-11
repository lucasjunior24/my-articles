const IPIFY_URL = "https://api.ipify.org?format=json";
const LOCAL_DEV_FALLBACK = "local-dev";

/**
 * Generates a simple hash from a string (IP address).
 * Uses a basic DJB2 hash algorithm.
 */
function hashIP(ip: string): string {
  let hash = 5381;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) + hash + ip.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Fetches the public IP address of the user via ipify.org.
 * Falls back to "local-dev" in case of any error.
 */
export async function getIPHash(): Promise<string> {
  try {
    const response = await fetch(IPIFY_URL);
    const data = (await response.json()) as { ip: string };
    return hashIP(data.ip);
  } catch {
    return hashIP(LOCAL_DEV_FALLBACK);
  }
}
