// Public security fixes: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
// Prevent site builds and tests from running under older, vulnerable Node.js runtimes.
const fixedMinimums = new Map([[22, [23, 4]], [24, [22, 1]], [26, [12, 1]]]);
const raw = process.versions.node;
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(raw);
const [major, minor, patch] = match ? match.slice(1).map(Number) : [0, 0, 0];
const minimum = fixedMinimums.get(major);
const patched = !!minimum && (minor > minimum[0] || (minor === minimum[0] && patch >= minimum[1]));
if (!patched) {
  console.error(`Unsupported or potentially vulnerable Node.js v${raw}. Use v22.23.4+, v24.22.1+ or v26.12.1+ within a supported major release.`);
  process.exit(1);
}
