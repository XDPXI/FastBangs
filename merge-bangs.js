import fs from "fs";

// Helpers

function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
}

function safeRead(path) {
    try {
        return fs.readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

// Load raw sources

const ddgRaw = loadJSON("ddg_bangs.json");
const kagiRaw = loadJSON("kagi_bangs.json");
const original = safeRead("src/bang.ts");

// Parse custom bangs from existing file

let custom = [];
{
    const match = original.match(/export const bangs\s*=\s*(\[[\s\S]*?\]);/);

    if (match) {
        try {
            custom = JSON.parse(match[1]);
        } catch (err) {
            console.error("Failed to parse existing bangs; keeping only DDG + Kagi.");
        }
    } else {
        console.warn("No existing bangs found in src/bang.ts");
    }
}

// Normalize DDG

const ddg = ddgRaw
    .filter(b => b.url)
    .map(b => ({
        c: b.category || "Search",
        d: b.domain || "",
        r: 0,
        s: b.name || b.t,
        sc: "Search Engine",
        t: b.t,
        u: b.url.replace("{{{s}}}", "{{{s}}}")
    }));

// Normalize Kagi

const kagi = kagiRaw
    .filter(b => b.u)
    .map(b => ({
        c: b.c || "Search",
        d: b.d || "",
        r: 0,
        s: b.s,
        sc: b.sc || "Search Engine",
        t: b.t,
        u: b.u.replace("{query}", "{{{s}}}")
    }));

// Merge and dedup

const merged = [...custom, ...ddg, ...kagi];

const deduped = Object.values(
    merged.reduce((acc, item) => {
        acc[item.t] = item;
        return acc;
    }, {})
);

// Write output

const output = `export const bangs = ${JSON.stringify(deduped, null, 4)};\n`;

fs.writeFileSync("src/bang.ts", output);

console.log(`Updated src/bang.ts with ${deduped.length} bangs.`);
