/**
 * Local bulk certificate generator
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/generateCertificates.ts \
 *     --event "Hackathon" \
 *     --winners '[{"userID":"SCSE-001","type":"winner","position":1},{"userID":"SCSE-002","type":"runner_up","position":2}]'
 *
 * Winners JSON is optional — omit it to generate participation certs only.
 */

import "dotenv/config";
import { generateCertificatesForEvent, WinnerEntry } from "../src/lib/certificateEngine";

async function main() {
  const args = process.argv.slice(2);
  const eventIdx   = args.indexOf("--event");
  const winnersIdx = args.indexOf("--winners");

  if (eventIdx === -1 || !args[eventIdx + 1]) {
    console.error("Usage: ts-node scripts/generateCertificates.ts --event <eventName> [--winners <json>]");
    process.exit(1);
  }

  const eventName = args[eventIdx + 1];
  let winners: WinnerEntry[] = [];

  if (winnersIdx !== -1 && args[winnersIdx + 1]) {
    try {
      winners = JSON.parse(args[winnersIdx + 1]);
    } catch {
      console.error("Invalid JSON for --winners");
      process.exit(1);
    }
  }

  console.log(`\nGenerating certificates for: ${eventName}`);
  console.log(`Winners provided: ${winners.length}`);
  console.log("─".repeat(50));

  const result = await generateCertificatesForEvent(eventName, winners);

  console.log(`\n✔ Generated : ${result.success}`);
  console.log(`⊘ Skipped   : ${result.skipped} (already exist)`);
  console.log(`✕ Failed    : ${result.failed}`);
  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach(e => console.log("  -", e));
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
