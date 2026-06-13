// Adds a low-poly feminine hairstyle to the avatar — pure Node, no Blender.
//
// Builds a stylized, chest-length layered hairstyle with soft bangs as ONE new
// SkinnedMesh, weighted 100% to the head bone (joint index = headBone), so it is
// bound to the head bone only and follows it rigidly. The mesh is added as a
// sibling of the existing skinned mesh nodes under the "armature" root and uses
// skin 0 — structurally identical to the body meshes, so SkeletonUtils.clone()
// rebinds it and the matcap skinning shader works unchanged. It is named "black"
// so the runtime assigns it the dark matcap (assignMatcap in avatar/index.ts).
//
// Nothing existing is modified: no armature/bone/animation/weight/material edits,
// no existing accessor or bufferView is touched. We only APPEND geometry and add
// new accessors/bufferViews/mesh/node. Origin, scale and node graph are preserved.
//
// Usage: node scripts/add-hair.mjs <source.glb> <output.glb>
//   e.g. node scripts/add-hair.mjs src/assets/models/avatar.glb src/assets/models/avatar_female.glb

import fs from "fs";

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error("Usage: node scripts/add-hair.mjs <source.glb> <output.glb>");
  process.exit(1);
}

// ---- GLB read (same chunk walk as feminize-body.mjs) ----------------------
const buf = fs.readFileSync(SRC);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("Not a GLB file");
let off = 12;
let jsonChunk = null;
let binChunk = null;
while (off < buf.length) {
  const len = buf.readUInt32LE(off);
  const type = buf.readUInt32LE(off + 4);
  const start = off + 8;
  if (type === 0x4e4f534a) jsonChunk = buf.slice(start, start + len);
  else if (type === 0x004e4942) binChunk = Buffer.from(buf.slice(start, start + len));
  off = start + len;
}
const json = JSON.parse(jsonChunk.toString("utf8"));

// ---- locate head bone joint + head/face geometry --------------------------
const skin = json.skins[0];
const headNodeIdx = json.nodes.findIndex((n) => n.name === "headBone");
const HEAD_JOINT = skin.joints.indexOf(headNodeIdx);
if (HEAD_JOINT < 0) throw new Error("headBone not found in skin joints");

const armatureIdx = json.nodes.findIndex((n) => n.name === "armature");
if (armatureIdx < 0) throw new Error("armature node not found");

const meshNodeByName = (name) => json.nodes.find((n) => n.name === name && n.mesh !== undefined);
const accOf = (name, attr) => json.accessors[json.meshes[meshNodeByName(name).mesh].primitives[0].attributes[attr]];
const headPos = accOf("head", "POSITION");
const facePos = accOf("face", "POSITION");

// Head bounding box in bind/skin space (the space hair vertices live in).
const hMin = headPos.min, hMax = headPos.max;
const C = { x: (hMin[0] + hMax[0]) / 2, y: (hMin[1] + hMax[1]) / 2, z: (hMin[2] + hMax[2]) / 2 };
const R = { x: (hMax[0] - hMin[0]) / 2, y: (hMax[1] - hMin[1]) / 2, z: (hMax[2] - hMin[2]) / 2 };
const chinY = hMin[1];
// Front is the side the face occupies. Face sits on low Z here -> front = -Z.
const faceCz = (facePos.min[2] + facePos.max[2]) / 2;
const FRONT_SIGN = faceCz < C.z ? -1 : 1; // multiplies the front-pointing Z component
console.log("head center", C, "radii", R, "front Z sign", FRONT_SIGN);

// ---- hair generation parameters -------------------------------------------
const NA = 16;                       // azimuth segments around the head
const SHELL = 1.06;                  // hair shell sits just outside the scalp
const LIFT = 0.03;                   // extra radial offset so it never z-fights the scalp
const DEG = Math.PI / 180;
const AOPEN = 40 * DEG;              // half-angle of the open face area (no long hair, bangs here)
const E_FRONT = 56 * DEG;           // forehead hairline elevation (front rim)
const E_SIDE = 94 * DEG;            // side/back rim elevation (down past the ears / nape)
const CAP_RINGS = 4;                 // polar rings of the crown dome
// chest-length + a shorter inner layer => visible layering
const Y_OUTER = chinY - 0.90;        // longest layer ~ chest
const Y_INNER = chinY - 0.34;        // inner layer ~ shoulder
const Y_BANG = chinY + 0.78;         // bangs end just above the eyes

// azimuth: a = 0 points to the front (-Z by FRONT_SIGN), increasing toward +X
const azimuth = (i) => (i / NA) * Math.PI * 2;
const wrapDelta0 = (a) => Math.atan2(Math.sin(a), Math.cos(a)); // signed angle to front (a=0)
const inFaceZone = (a) => Math.abs(wrapDelta0(a)) < AOPEN;
// rim elevation per azimuth: high (forehead) at front, low (nape) at back/sides
const rimE = (a) => {
  const d = Math.abs(wrapDelta0(a)) / AOPEN; // 0 at front -> 1 at zone edge
  if (d >= 1) return E_SIDE;
  const t = 0.5 - 0.5 * Math.cos(Math.min(d, 1) * Math.PI); // smoothstep
  return E_FRONT + (E_SIDE - E_FRONT) * t;
};

// point on the hair shell at azimuth a, elevation e (0 = crown top)
function shellPoint(a, e) {
  const se = Math.sin(e), ce = Math.cos(e);
  const ux = se * Math.sin(a);
  const uy = ce;
  // a = 0 must map to the face side. Data has front = -Z (FRONT_SIGN = -1).
  const fz = -se * Math.cos(a) * (FRONT_SIGN < 0 ? 1 : -1);
  return {
    x: C.x + R.x * ux * SHELL + Math.sign(ux || 1) * 0,
    y: C.y + R.y * uy * SHELL,
    z: C.z + R.z * fz * SHELL,
  };
}
// add uniform outward lift along the radial direction from head center
function lift(p) {
  let dx = p.x - C.x, dy = p.y - C.y, dz = p.z - C.z;
  const l = Math.hypot(dx, dy, dz) || 1;
  return { x: p.x + (dx / l) * LIFT, y: p.y + (dy / l) * LIFT, z: p.z + (dz / l) * LIFT };
}

// ---- mesh builders with vertex welding + outward winding ------------------
const V = [];                  // [{x,y,z}]
const keyMap = new Map();
const tris = [];               // [[i,j,k, refKind]]
function vIndex(p) {
  const k = p.x.toFixed(4) + "," + p.y.toFixed(4) + "," + p.z.toFixed(4);
  let i = keyMap.get(k);
  if (i === undefined) { i = V.length; V.push({ x: p.x, y: p.y, z: p.z }); keyMap.set(k, i); }
  return i;
}
// ref: "head" => outward from head center; "axis" => outward from vertical body axis
function pushTri(p0, p1, p2, ref) {
  const a = vIndex(p0), b = vIndex(p1), c = vIndex(p2);
  if (a === b || b === c || a === c) return; // skip degenerate (dome apex fans)
  tris.push([a, b, c, ref]);
}
function pushQuad(p00, p10, p11, p01, ref) {
  pushTri(p00, p10, p11, ref);
  pushTri(p00, p11, p01, ref);
}

// (1) CROWN DOME -- full azimuth, rim follows the hairline (high front / low back)
for (let i = 0; i < NA; i++) {
  const a0 = azimuth(i), a1 = azimuth(i + 1);
  const e0r = rimE(a0), e1r = rimE(a1);
  for (let j = 0; j < CAP_RINGS; j++) {
    const t0 = j / CAP_RINGS, t1 = (j + 1) / CAP_RINGS;
    const p00 = lift(shellPoint(a0, e0r * t0));
    const p10 = lift(shellPoint(a1, e1r * t0));
    const p11 = lift(shellPoint(a1, e1r * t1));
    const p01 = lift(shellPoint(a0, e0r * t1));
    pushQuad(p00, p10, p11, p01, "head");
  }
}

// helper: rim point (bottom edge of the dome) at azimuth a
const rimPoint = (a) => lift(shellPoint(a, rimE(a)));

// (2) LENGTH LAYERS -- skirts hanging from the rim, only outside the face zone.
// Two tiers (outer = longest/chest, inner = shorter/shoulder) => layered look.
function buildSkirt(yBottom, flare, zPull, vSeg) {
  for (let i = 0; i < NA; i++) {
    const a0 = azimuth(i), a1 = azimuth(i + 1);
    if (inFaceZone(a0) || inFaceZone(a1)) continue; // open at the face
    const r0 = rimPoint(a0), r1 = rimPoint(a1);
    // soft, slightly uneven tips for a stylized layered silhouette
    const yb0 = yBottom + 0.05 * Math.sin(3 * a0);
    const yb1 = yBottom + 0.05 * Math.sin(3 * a1);
    for (let v = 0; v < vSeg; v++) {
      const t0 = v / vSeg, t1 = (v + 1) / vSeg;
      const pt = (rim, yb, t) => {
        const rs = 1 + (flare - 1) * t;                 // flare outward toward the tips
        const x = C.x + (rim.x - C.x) * rs;
        const z = C.z + (rim.z - C.z) * rs + FRONT_SIGN * zPull * t * (rim.z < C.z ? 1 : 0.4);
        const y = rim.y + (yb - rim.y) * t;
        return { x, y, z };
      };
      const p00 = pt(r0, yb0, t0), p10 = pt(r1, yb1, t0);
      const p11 = pt(r1, yb1, t1), p01 = pt(r0, yb0, t1);
      pushQuad(p00, p10, p11, p01, "axis");
    }
  }
}
buildSkirt(Y_INNER, 1.08, 0.06, 3); // inner shorter layer (closer to neck)
buildSkirt(Y_OUTER, 1.22, 0.14, 4); // outer chest-length layer (flares out)

// (3) SOFT BANGS -- short fringe across the forehead, scalloped soft bottom.
{
  const bangCols = [];
  for (let i = 0; i <= NA; i++) {
    const a = azimuth(i);
    if (Math.abs(wrapDelta0(a)) <= AOPEN) bangCols.push(a);
  }
  const VSEG = 2;
  for (let c = 0; c < bangCols.length - 1; c++) {
    const a0 = bangCols[c], a1 = bangCols[c + 1];
    const top0 = rimPoint(a0), top1 = rimPoint(a1);
    // soft wavy hem: alternate columns dip a little lower
    const wave = (a, idx) => Y_BANG + 0.06 * Math.cos(2.5 * wrapDelta0(a)) - (idx % 2 ? 0.04 : 0);
    const yb0 = wave(a0, c), yb1 = wave(a1, c + 1);
    for (let v = 0; v < VSEG; v++) {
      const t0 = v / VSEG, t1 = (v + 1) / VSEG;
      // sweep the fringe forward and down over the forehead
      const pt = (top, yb, t) => ({
        x: C.x + (top.x - C.x) * (1 + 0.04 * t),
        y: top.y + (yb - top.y) * t,
        z: top.z + FRONT_SIGN * (0.10 * t),
      });
      const p00 = pt(top0, yb0, t0), p10 = pt(top1, yb1, t0);
      const p11 = pt(top1, yb1, t1), p01 = pt(top0, yb0, t1);
      pushQuad(p00, p10, p11, p01, "axis");
    }
  }
}

console.log("hair: vertices", V.length, "triangles", tris.length);

// ---- normals (welded) + outward winding -----------------------------------
const normals = V.map(() => ({ x: 0, y: 0, z: 0 }));
const idx = [];
for (const [a, b, c, ref] of tris) {
  const A = V[a], B = V[b], Cc = V[c];
  let nx = (B.y - A.y) * (Cc.z - A.z) - (B.z - A.z) * (Cc.y - A.y);
  let ny = (B.z - A.z) * (Cc.x - A.x) - (B.x - A.x) * (Cc.z - A.z);
  let nz = (B.x - A.x) * (Cc.y - A.y) - (B.y - A.y) * (Cc.x - A.x);
  const cen = { x: (A.x + B.x + Cc.x) / 3, y: (A.y + B.y + Cc.y) / 3, z: (A.z + B.z + Cc.z) / 3 };
  // outward reference vector
  const out = ref === "head"
    ? { x: cen.x - C.x, y: cen.y - C.y, z: cen.z - C.z }
    : { x: cen.x - C.x, y: 0, z: cen.z - C.z }; // radial from vertical axis
  let order = [a, b, c];
  if (nx * out.x + ny * out.y + nz * out.z < 0) { order = [a, c, b]; nx = -nx; ny = -ny; nz = -nz; }
  idx.push(order[0], order[1], order[2]);
  for (const vi of order) { normals[vi].x += nx; normals[vi].y += ny; normals[vi].z += nz; }
}
for (const n of normals) {
  const l = Math.hypot(n.x, n.y, n.z) || 1;
  n.x /= l; n.y /= l; n.z /= l;
}

// ---- pack binary attributes -----------------------------------------------
const nV = V.length, nI = idx.length;
const posBuf = Buffer.alloc(nV * 12);
const nrmBuf = Buffer.alloc(nV * 12);
const wgtBuf = Buffer.alloc(nV * 16);
const jntBuf = Buffer.alloc(nV * 4);
const pMin = [Infinity, Infinity, Infinity], pMax = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < nV; i++) {
  const p = V[i], n = normals[i];
  posBuf.writeFloatLE(p.x, i * 12); posBuf.writeFloatLE(p.y, i * 12 + 4); posBuf.writeFloatLE(p.z, i * 12 + 8);
  nrmBuf.writeFloatLE(n.x, i * 12); nrmBuf.writeFloatLE(n.y, i * 12 + 4); nrmBuf.writeFloatLE(n.z, i * 12 + 8);
  wgtBuf.writeFloatLE(1, i * 16); // weight 1.0 on the first joint, 0 on the rest
  jntBuf.writeUInt8(HEAD_JOINT, i * 4); // bound to the head bone only
  pMin[0] = Math.min(pMin[0], p.x); pMin[1] = Math.min(pMin[1], p.y); pMin[2] = Math.min(pMin[2], p.z);
  pMax[0] = Math.max(pMax[0], p.x); pMax[1] = Math.max(pMax[1], p.y); pMax[2] = Math.max(pMax[2], p.z);
}
const idxBuf = Buffer.alloc(nI * 2);
for (let i = 0; i < nI; i++) idxBuf.writeUInt16LE(idx[i], i * 2);

// ---- append to the binary buffer (4-byte aligned), add views/accessors ----
const pad4 = (b) => (b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - (b.length % 4))]) : b);
let base = pad4(binChunk); // existing data, padded so new views start aligned
const baseLen = base.length;

const segs = [
  { name: "POSITION", data: posBuf, target: 34962 },
  { name: "NORMAL", data: nrmBuf, target: 34962 },
  { name: "WEIGHTS_0", data: wgtBuf, target: 34962 },
  { name: "JOINTS_0", data: jntBuf, target: 34962 },
  { name: "indices", data: idxBuf, target: 34963 },
];
const parts = [base];
let cursor = baseLen;
const bvIndex = {};
for (const s of segs) {
  const padded = pad4(s.data);
  bvIndex[s.name] = json.bufferViews.length;
  json.bufferViews.push({ buffer: 0, byteOffset: cursor, byteLength: s.data.length, target: s.target });
  parts.push(padded);
  cursor += padded.length;
}
const newBin = Buffer.concat(parts);
json.buffers[0].byteLength = newBin.length;

const accIndex = {};
const addAcc = (name, type, compType, count, extra = {}) => {
  accIndex[name] = json.accessors.length;
  json.accessors.push({ bufferView: bvIndex[name], componentType: compType, count, type, ...extra });
};
addAcc("POSITION", "VEC3", 5126, nV, { min: pMin, max: pMax });
addAcc("NORMAL", "VEC3", 5126, nV);
addAcc("WEIGHTS_0", "VEC4", 5126, nV);
addAcc("JOINTS_0", "VEC4", 5121, nV, { normalized: false });
addAcc("indices", "SCALAR", 5123, nI);

// ---- add mesh + node (sibling of body meshes, skin 0, head-bone bound) -----
const meshIdx = json.meshes.length;
json.meshes.push({
  name: "hair",
  primitives: [{
    attributes: {
      POSITION: accIndex.POSITION,
      NORMAL: accIndex.NORMAL,
      JOINTS_0: accIndex.JOINTS_0,
      WEIGHTS_0: accIndex.WEIGHTS_0,
    },
    indices: accIndex.indices,
  }],
});
const nodeIdx = json.nodes.length;
json.nodes.push({ name: "black", mesh: meshIdx, skin: 0 }); // "black" => dark matcap at runtime
json.nodes[armatureIdx].children.push(nodeIdx);

// ---- GLB write (rebuild both chunks, 4-byte padded) -----------------------
const newJson = Buffer.from(JSON.stringify(json), "utf8");
const jsonPadded = pad4Space(newJson);
function pad4Space(b) {
  const p = (4 - (b.length % 4)) % 4;
  return p ? Buffer.concat([b, Buffer.alloc(p, 0x20)]) : b;
}
const binPadded = pad4(newBin);
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
console.log("wrote", OUT, "(" + total + " bytes)", "hair bbox", pMin.map((v) => +v.toFixed(2)), pMax.map((v) => +v.toFixed(2)));
