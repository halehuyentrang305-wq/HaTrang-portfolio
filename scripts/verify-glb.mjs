// Verifies avatar.glb still satisfies the portfolio's hard requirements.
// Usage: node scripts/verify-glb.mjs [path-to.glb]
import fs from "fs";

const path = process.argv[2] || "src/assets/models/avatar.glb";
const b = fs.readFileSync(path);
const jl = b.readUInt32LE(12);
const json = JSON.parse(b.slice(20, 20 + jl).toString("utf8"));

const REQ_MESHES = ["black", "gray", "skin", "white", "head", "face"];
const REQ_ANIMS = ["contact-idle", "idle", "left-desktop", "sleeping", "t-idle", "wake-up", "wave"];

const meshNames = json.nodes.filter((n) => n.mesh !== undefined).map((n) => n.name);
const animNames = (json.animations || []).map((a) => a.name);
const hasBone = json.nodes.some((n) => n.name === "bone-right-hand");

const missingMeshes = REQ_MESHES.filter((m) => !meshNames.includes(m));
const missingAnims = REQ_ANIMS.filter((a) => !animNames.includes(a));

console.log("file:", path);
console.log("mesh nodes:      ", meshNames.join(", "));
console.log("animation clips: ", animNames.join(", "));
console.log("bone-right-hand: ", hasBone ? "present ✅" : "MISSING ❌");
console.log("required meshes: ", missingMeshes.length ? "MISSING " + missingMeshes.join(",") + " ❌" : "all present ✅");
console.log("required anims:  ", missingAnims.length ? "MISSING " + missingAnims.join(",") + " ❌" : "all present ✅");

const ok = hasBone && !missingMeshes.length && !missingAnims.length;
console.log("\nRESULT:", ok ? "PASS ✅ portfolio contract satisfied" : "FAIL ❌ review above");
process.exit(ok ? 0 : 1);
