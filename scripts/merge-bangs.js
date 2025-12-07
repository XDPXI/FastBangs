import fs from "fs";

// Load raw bangs
const ddgRaw = JSON.parse(fs.readFileSync("ddg_bangs.json", "utf8"));
const kagiRaw = JSON.parse(fs.readFileSync("kagi_bangs.json", "utf8"));

// Normalize DDG bangs -> your format, skip entries without URL
const ddg = ddgRaw
    .filter(b => b.url) // only keep entries with URL
    .map(b => ({
        c: b.category || "Search",
        d: b.domain || "",
        r: 0,
        s: b.name || b.t,
        sc: "Search Engine",
        t: b.t,
        u: b.url.replace("{{{s}}}", "{{{s}}}")
    }));

// Normalize Kagi bangs -> your format, skip entries without URL
const kagi = kagiRaw
    .filter(b => b.u) // only keep entries with URL
    .map(b => ({
        c: b.c || "Search",
        d: b.d || "",
        r: 0,
        s: b.s,
        sc: b.sc || "Search Engine",
        t: b.t,
        u: b.u.replace("{query}", "{{{s}}}")
    }));

// Load existing bangs to preserve custom ones
const original = fs.readFileSync("src/bangs.ts", "utf8");

const customMatches = original.match(/export const bangs = \[(.[\s\S]*)\];/);
let custom = [];

if (customMatches) {
    const jsonish = customMatches[1]
        .trim()
        .replace(/^\s*\/\/.*$/gm, "") // remove comments
        .replace(/(\w+):/g, '"$1":') // quote keys
        .replace(/'/g, '"'); // ensure JSON

    try {
        custom = JSON.parse(`[${jsonish}]`);
    } catch (e) {
        console.error("Failed to parse existing bangs; keeping file as-is.");
    }
}

// Combine and deduplicate
const combined = [
    ...custom,
    ...ddg,
    ...kagi
];

const unique = Object.values(
    combined.reduce((acc, item) => {
        acc[item.t] = item;
        return acc;
    }, {})
);

// Write output
const output = `export const bangs = ${JSON.stringify(unique, null, 4)};\n`;
fs.writeFileSync("src/bangs.ts", output);
console.log("Updated src/bangs.ts");