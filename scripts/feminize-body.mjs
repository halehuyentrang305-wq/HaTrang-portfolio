// Rig-aware, non-destructive body feminization for avatar.glb
//
// Edits ONLY vertex POSITIONS. Does not touch the armature, bone names,
// skin weights (JOINTS_0/WEIGHTS_0), animations, materials, or node graph.
// Displacements are blended per-vertex by skin weight, so transitions between
// body regions are seamless, and every edit is symmetric about the body midline
// so the avatar origin does not move.
//
// Usage: node scripts/feminize-body.mjs <source.glb> <output.glb>
//   source = the untouched backup (so re-runs never compound)
//   output = src/assets/models/avatar.glb

import fs from "fs";

// ---- Tunable feminization amounts (fractions) -----------------------------
// Factors are pre-compensated for weight-blend dilution at bone boundaries
// so the realized change at each region lands near the intended target.
const WAIST_NARROW = 0.12; // target ~ -10% waist width
const SHOULDER_NARROW = 0.11; // target ~ -8% shoulder width
const HIP_WIDEN = 0.11; // target ~ +5% hip width
const ARM_SLIM = 0.14; // target ~ -10% arm thickness
const LEG_SLIM = 0.16; // target ~ -10% leg thickness

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error("Usage: node scripts/feminize-body.mjs <source.glb> <output.glb>");
  process.exit(1);
}

// ---- GLB read -------------------------------------------------------------
const buf = fs.readFileSync(SRC);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("Not a GLB file");
let off = 12;
let jsonChunk = null;
let binChunk = null;
let binChunkStart = 0;
while (off < buf.length) {
  const len = buf.readUInt32LE(off);
  const type = buf.readUInt32LE(off + 4);
  const start = off + 8;
  if (type === 0x4e4f534a) jsonChunk = buf.slice(start, start + len);
  else if (type === 0x004e4942) {
    binChunk = Buffer.from(buf.slice(start, start + len)); // copy: we mutate it
    binChunkStart = start;
  }
  off = start + len;
}
const json = JSON.parse(jsonChunk.toString("utf8"));
const skin = json.skins[0];
const jointNodeName = skin.joints.map((n) => json.nodes[n].name);

// ---- joint -> category map (by joint index within the skin) ---------------
const idx = (name) => jointNodeName.indexOf(name);
const SIDE = {}; // jointIndex -> "L" | "R"
jointNodeName.forEach((n, j) => {
  if (/^left/i.test(n)) SIDE[j] = "L";
  else if (/^right/i.test(n) || n === "bone-right-hand") SIDE[j] = "R";
});

const WAIST = new Set([idx("spineBone"), idx("spine1Bone"), idx("spine2Bone")]);
const SHOULDER = new Set([idx("leftShoulderBone"), idx("rightShoulder")]);
const HIPS = new Set([idx("hipsBone")]);
const ARM = new Set([idx("leftArmBone"), idx("leftForeArmBone"), idx("rightarmBone"), idx("rightForearmBone")]);
const LEG = new Set([idx("leftUpLegBone"), idx("leftLegBone"), idx("rightUpLegBone"), idx("rightLegBone")]);
// head, hands, fingers, feet, toes => untouched (no displacement)

// ---- accessor helpers -----------------------------------------------------
const accBase = (acc) => json.bufferViews[acc.bufferView].byteOffset + (acc.byteOffset || 0);
const bodyNodes = json.nodes.filter((n) => ["black", "gray", "skin", "white"].includes(n.name));

// Gather per-vertex data for every body mesh
const meshData = bodyNodes.map((node) => {
  const prim = json.meshes[node.mesh].primitives[0];
  const pAcc = json.accessors[prim.attributes.POSITION];
  const jAcc = json.accessors[prim.attributes.JOINTS_0];
  const wAcc = json.accessors[prim.attributes.WEIGHTS_0];
  const n = pAcc.count;
  const pOff = accBase(pAcc);
  const jOff = accBase(jAcc);
  const wOff = accBase(wAcc);
  return { name: node.name, n, pAcc, pOff, jOff, wOff };
});

// ---- pass 1: centroids per slim-joint + body midline ----------------------
const sum = {}; // jointIndex -> {x,y,z,c}
const addSum = (j, x, y, z) => {
  if (!sum[j]) sum[j] = { x: 0, y: 0, z: 0, c: 0 };
  sum[j].x += x; sum[j].y += y; sum[j].z += z; sum[j].c++;
};
for (const m of meshData) {
  for (let i = 0; i < m.n; i++) {
    const x = binChunk.readFloatLE(m.pOff + i * 12);
    const y = binChunk.readFloatLE(m.pOff + i * 12 + 4);
    const z = binChunk.readFloatLE(m.pOff + i * 12 + 8);
    // dominant joint = max weight
    let dj = 0, dw = -1;
    for (let k = 0; k < 4; k++) {
      const w = binChunk.readFloatLE(m.wOff + i * 16 + k * 4);
      const jj = binChunk.readUInt8(m.jOff + i * 4 + k);
      if (w > dw) { dw = w; dj = jj; }
    }
    if (ARM.has(dj) || LEG.has(dj) || HIPS.has(dj) || WAIST.has(dj)) addSum(dj, x, y, z);
  }
}
const centroid = (j) => ({ x: sum[j].x / sum[j].c, y: sum[j].y / sum[j].c, z: sum[j].z / sum[j].c });
const armC = {}, legC = {};
[...ARM].forEach((j) => (armC[j] = centroid(j)));
[...LEG].forEach((j) => (legC[j] = centroid(j)));
// midline X = average of the two upper-leg centroids (well-defined, symmetric)
const MID_X = (centroid(idx("leftUpLegBone")).x + centroid(idx("rightUpLegBone")).x) / 2;
console.log("midline X =", MID_X.toFixed(4));

// ---- displacement that one joint contributes to a vertex ------------------
function jointDisp(j, x, y, z) {
  if (WAIST.has(j)) return [(MID_X - x) * WAIST_NARROW, 0, 0];
  if (SHOULDER.has(j)) return [(MID_X - x) * SHOULDER_NARROW, 0, 0];
  if (HIPS.has(j)) return [(x - MID_X) * HIP_WIDEN, 0, 0];
  if (ARM.has(j)) { const c = armC[j]; return [0, (c.y - y) * ARM_SLIM, (c.z - z) * ARM_SLIM]; }
  if (LEG.has(j)) { const c = legC[j]; return [(c.x - x) * LEG_SLIM, 0, (c.z - z) * LEG_SLIM]; }
  return [0, 0, 0];
}

// ---- pass 2: apply blended displacement, update bbox ----------------------
let moved = 0;
for (const m of meshData) {
  let mn = [Infinity, Infinity, Infinity];
  let mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.n; i++) {
    const x = binChunk.readFloatLE(m.pOff + i * 12);
    const y = binChunk.readFloatLE(m.pOff + i * 12 + 4);
    const z = binChunk.readFloatLE(m.pOff + i * 12 + 8);
    let dx = 0, dy = 0, dz = 0;
    for (let k = 0; k < 4; k++) {
      const w = binChunk.readFloatLE(m.wOff + i * 16 + k * 4);
      if (w <= 0) continue;
      const jj = binChunk.readUInt8(m.jOff + i * 4 + k);
      const d = jointDisp(jj, x, y, z);
      dx += w * d[0]; dy += w * d[1]; dz += w * d[2];
    }
    const nx = x + dx, ny = y + dy, nz = z + dz;
    if (dx || dy || dz) moved++;
    binChunk.writeFloatLE(nx, m.pOff + i * 12);
    binChunk.writeFloatLE(ny, m.pOff + i * 12 + 4);
    binChunk.writeFloatLE(nz, m.pOff + i * 12 + 8);
    mn = [Math.min(mn[0], nx), Math.min(mn[1], ny), Math.min(mn[2], nz)];
    mx = [Math.max(mx[0], nx), Math.max(mx[1], ny), Math.max(mx[2], nz)];
  }
  m.pAcc.min = mn; // refresh bounds for correct culling
  m.pAcc.max = mx;
}
console.log("vertices moved:", moved);

// ---- GLB write (rebuild both chunks with 4-byte padding) ------------------
const newJson = Buffer.from(JSON.stringify(json), "utf8");
const jsonPad = (4 - (newJson.length % 4)) % 4;
const jsonPadded = Buffer.concat([newJson, Buffer.alloc(jsonPad, 0x20)]);
const binPad = (4 - (binChunk.length % 4)) % 4;
const binPadded = Buffer.concat([binChunk, Buffer.alloc(binPad, 0x00)]);
const total = 12 + 8 + jsonPadded.length + 8 + binPadded.length;
const out = Buffer.alloc(total);
let o = 0;
out.writeUInt32LE(0x46546c67, o); o += 4;
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(total, o); o += 4;
out.writeUInt32LE(jsonPadded.length, o); o += 4;
out.writeUInt32LE(0x4e4f534a, o); o += 4;
jsonPadded.copy(out, o); o += jsonPadded.length;
out.writeUInt32LE(binPadded.length, o); o += 4;
out.writeUInt32LE(0x004e4942, o); o += 4;
binPadded.copy(out, o);
fs.writeFileSync(OUT, out);
console.log("wrote", OUT, "(" + total + " bytes)");
