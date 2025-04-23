/**
 * this script checks localization keys, if there any defferences
 * use to run:
 * node compareLocales.js
 * then enter file name (example: en or en.json)
 */

import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

// Отримати __dirname в ES-модулі
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, "src", "locales");

async function readJsonFile(filepath) {
    try {
        const content = await fs.readFile(filepath, "utf8");
        return JSON.parse(content);
    } catch (e) {
        console.error(`File reading errpr ${filepath}:`, e.message);
        return null;
    }
}

function flatten(obj, prefix = "") {
    const result = {};
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null) {
            Object.assign(result, flatten(value, newKey));
        } else {
            result[newKey] = value;
        }
    }
    return result;
}

function compareKeys(base, target) {
    const missing = [];
    const extra = [];

    for (const key of Object.keys(base)) {
        if (!(key in target)) {
            missing.push(key);
        }
    }

    for (const key of Object.keys(target)) {
        if (!(key in base)) {
            extra.push(key);
        }
    }

    return { missing, extra };
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

async function main() {
    const files = (await fs.readdir(LOCALES_DIR))
        .filter(file => file.endsWith(".json"));

    if (files.length === 0) {
        console.log("No JSON files found in src/locales/");
        return;
    }

    console.log("Files found:");
    files.forEach(f => console.log(" •", f));

    const input = await askQuestion("\nEnter base file name (example: en or en.json): ");
    const baseFilename = files.find(f => f === input || f === input + ".json");

    if (!baseFilename) {
        console.log("File not found.");
        return;
    }

    const baseLang = path.basename(baseFilename, ".json");
    const baseData = flatten(await readJsonFile(path.join(LOCALES_DIR, baseFilename)));

    for (const file of files) {
        if (file === baseFilename) continue;

        const targetData = flatten(await readJsonFile(path.join(LOCALES_DIR, file)));
        const { missing, extra } = compareKeys(baseData, targetData);

        const lang = path.basename(file, ".json");

        console.log(`\n Порівняння з: ${file}`);
        if (missing.length === 0 && extra.length === 0) {
            console.log(" √ No difference.");
        } else {
            console.log(` - Missing keys [${missing.length}]`);
            if (missing.length > 0) {
                missing.forEach(k => console.log("   -", k));
            }

            console.log(` + Edditional keys [${extra.length}]`);
            if (extra.length > 0) {
                extra.forEach(k => console.log("   +", k));
            }
        }
    }
}

main();
