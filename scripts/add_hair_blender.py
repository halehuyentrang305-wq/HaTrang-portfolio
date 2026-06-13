# Adds a low-poly, chest-length feminine hairstyle to avatar.glb and re-exports.
#
# WHY BLENDER: hair is geometry that needs visual judgement. This script gives
# you a good starting mesh derived from the real head bounds; tweak it in Edit/
# Sculpt mode before exporting if you want a different fall or length.
#
# WHAT IT PRESERVES: it imports the existing avatar.glb (already body+face
# edited), adds ONE hair object skinned to headBone only, and re-exports with
# settings that keep all mesh names, bone names, and all 7 animation clips.
#
# RUN (headless):
#   blender --background --python scripts/add_hair_blender.py
# or open Blender > Scripting > open this file > Run.
#
# After running, verify with:  node scripts/verify-glb.mjs
import bpy, bmesh, math
from mathutils import Vector

GLB = bpy.path.abspath("//src/assets/models/avatar.glb")  # run from project root
# If // resolves wrong, hard-code an absolute path here:
# GLB = r"C:\Users\Admin\Documents\HaTrang-portfolio\portfolio-2025\src\assets\models\avatar.glb"

# ---- tunables -------------------------------------------------------------
HAIR_NAME   = "black"     # reuse the existing dark matcap (loader keys on name)
FRONT_IS    = "-Z"        # face side (hair stays open here). Flip to "+Z" if reversed.
RINGS_DOWN  = 6           # vertical segments of the falling hair (low poly)
SEGMENTS    = 14          # segments around the head (low poly)
LEN_BACK    = 1.6         # how far hair falls at the back (world units ~ chest)
LEN_SIDE    = 1.2         # fall at the sides
THICK       = 0.06        # shell offset off the scalp

# ---- clean scene & import -------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)

def find(name):
    return bpy.data.objects.get(name)

# locate head mesh, armature, headBone
head = find("head")
arm = next((o for o in bpy.data.objects if o.type == "ARMATURE"), None)
assert head and arm, "head mesh or armature not found"
head_bone = arm.data.bones.get("headBone")
assert head_bone, "headBone not found"

# head bounding box in world space
bb = [head.matrix_world @ Vector(c) for c in head.bound_box]
xs = [v.x for v in bb]; ys = [v.y for v in bb]; zs = [v.z for v in bb]
cx, cz = (min(xs)+max(xs))/2, (min(zs)+max(zs))/2
top_y = max(ys); mid_y = (min(ys)+max(ys))/2
rx = (max(xs)-min(xs))/2; rz = (max(zs)-min(zs))/2
front_sign = -1 if FRONT_IS == "-Z" else 1   # +1 means face toward +Z

# ---- build hair mesh (a layered shell hugging scalp, falling at back/sides)
bm = bmesh.new()
grid = []  # [ring][seg] verts
for r in range(RINGS_DOWN + 1):
    fr = r / RINGS_DOWN
    ring = []
    for s in range(SEGMENTS):
        ang = math.pi * 2 * s / SEGMENTS
        # how "back" this segment is (1 at back, 0 at front)
        back = (1 - front_sign * math.cos(ang)) / 2
        # scalp point (dome) at top, descending as fr grows
        radius_x = rx + THICK
        radius_z = rz + THICK
        x = cx + math.sin(ang) * radius_x
        z = cz + math.cos(ang) * radius_z
        # vertical: start near top, fall down weighted by how 'back' the seg is
        fall = (LEN_BACK * back + LEN_SIDE * (1 - back)) * fr
        # taper the curtain inward slightly as it falls (soft layered look)
        taper = 1 - 0.18 * fr
        x = cx + (x - cx) * taper
        z = cz + (z - cz) * taper
        y = top_y - 0.15 - fall
        # keep the front (face) open: pull front-low verts back toward scalp
        if back < 0.35 and fr > 0.15:
            y = top_y - 0.1 - fall * back * 1.2
        ring.append(bm.verts.new((x, y, z)))
    grid.append(ring)

bm.verts.ensure_lookup_table()
for r in range(RINGS_DOWN):
    for s in range(SEGMENTS):
        s2 = (s + 1) % SEGMENTS
        try:
            bm.faces.new((grid[r][s], grid[r][s2], grid[r+1][s2], grid[r+1][s]))
        except ValueError:
            pass
# a simple top cap so the crown isn't open
try:
    bm.faces.new([grid[0][s] for s in range(SEGMENTS)])
except ValueError:
    pass

mesh = bpy.data.meshes.new("hairMesh")
bm.to_mesh(mesh); bm.free()
mesh.shade_flat()
hair = bpy.data.objects.new(HAIR_NAME, mesh)
bpy.context.collection.objects.link(hair)

# ---- reuse the existing dark material if present --------------------------
src_mat = None
for o in bpy.data.objects:
    if o.type == "MESH" and o.name.startswith("black") and o.data.materials:
        src_mat = o.data.materials[0]; break
if src_mat:
    hair.data.materials.append(src_mat)

# ---- skin to headBone ONLY (single vertex group, weight 1) ----------------
vg = hair.vertex_groups.new(name="headBone")
vg.add(range(len(mesh.vertices)), 1.0, "REPLACE")
mod = hair.modifiers.new("Armature", "ARMATURE")
mod.object = arm
hair.parent = arm

# ---- export back to the same file -----------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=GLB,
    export_format="GLB",
    use_selection=False,
    export_yup=True,
    export_apply=False,          # do NOT apply modifiers (keeps animation safe)
    export_skins=True,
    export_animations=True,
    export_animation_mode="ACTIONS",
    export_nla_strips=True,      # ensure every action/clip is written
    export_morph=False,
)
print("Hair added and exported to", GLB)
