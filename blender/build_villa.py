# =====================================================
# Layal Alshaikh - procedural modern villa (Blender, headless)
# Run:  blender --background --python build_villa.py
# Renders a dusk villa with warm lit windows to assets/villa-blender.png
# =====================================================
import bpy, math, os
from mathutils import Vector

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "villa-blender.png")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# mode: 'dusk' (warm glowing windows / night) or 'day' (sun-lit morning)
MODE = os.environ.get('VILLA_MODE', 'dusk')
DAY = (MODE == 'day')
if DAY:
    OUT = OUT.replace('villa-blender.png', 'villa-blender-day.png')

# ---------- clean slate ----------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.objects):
    for b in list(coll):
        try: coll.remove(b)
        except Exception: pass

# ---------- helpers ----------
def mat(name, base=(0.8, 0.8, 0.8), rough=0.6, metal=0.0, transmission=0.0,
        emission=None, e_strength=0.0, ior=1.45):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    def s(n, v):
        if b and n in b.inputs:
            b.inputs[n].default_value = v; return True
        return False
    s('Base Color', (*base, 1.0)); s('Roughness', rough); s('Metallic', metal); s('IOR', ior)
    for tn in ('Transmission Weight', 'Transmission'):
        if s(tn, transmission): break
    if emission is not None:
        for en in ('Emission Color', 'Emission'):
            if s(en, (*emission, 1.0)): break
        s('Emission Strength', e_strength)
    return m

def block(loc, dim, material, name="block"):
    """dim = full (x,y,z) size; loc = center."""
    bpy.ops.mesh.primitive_cube_add(size=2, location=loc)
    o = bpy.context.active_object; o.name = name
    o.scale = (dim[0] / 2, dim[1] / 2, dim[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    return o

# ---------- materials ----------
m_plaster = mat("plaster", (0.86, 0.82, 0.74), rough=0.72)
m_plaster2= mat("plaster2",(0.74, 0.69, 0.60), rough=0.8)
m_wood    = mat("wood",    (0.22, 0.12, 0.05), rough=0.5)
m_stone   = mat("stone",   (0.46, 0.44, 0.40), rough=0.9)
m_roof    = mat("roof",    (0.045,0.04, 0.035),rough=0.45, metal=0.1)
m_trim    = mat("trim",    (0.55, 0.42, 0.15), rough=0.35, metal=0.85)
m_glassdk = mat("glass_dark",(0.02,0.03,0.04), rough=0.05, metal=0.0, transmission=0.0, ior=1.5)
m_litwarm = mat("win_lit", (0.7,0.78,0.85) if DAY else (0,0,0),
                emission=(1.0, 0.62, 0.30), e_strength=(0.0 if DAY else 14.0),
                rough=0.06, ior=1.5)
m_water   = mat("water",   (0.10, 0.30, 0.40), rough=0.04, ior=1.33, transmission=0.25)
m_grass   = mat("grass",   (0.10, 0.20, 0.07), rough=0.95)
m_path    = mat("path",    (0.55, 0.52, 0.46), rough=0.85)
m_leaf    = mat("leaf",    (0.09, 0.22, 0.08), rough=0.9)
m_trunk   = mat("trunk",   (0.18, 0.11, 0.06), rough=0.9)

# ---------- ground ----------
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
bpy.context.active_object.data.materials.append(m_grass)

# stone plinth + path  (front of house faces -Y)
block((0, 0, 0.15), (7.0, 5.0, 0.3), m_stone, "plinth")
block((0.3, -3.0, 0.32), (1.6, 3.2, 0.06), m_path, "path")

# ---------- volumes ----------
block((0, 0, 1.3),   (5.4, 3.5, 2.0), m_plaster,  "ground_floor")
block((2.15, 0, 1.35),(1.0, 3.55, 2.05), m_wood,   "wood_column")
block((-0.4, 0.55, 3.2),(3.8, 2.4, 1.8), m_plaster, "upper_floor")
block((1.15, 0.55, 3.2),(1.1, 2.42, 1.8), m_stone,  "upper_stone")

# flat overhanging roofs
block((0, 0, 2.36),     (5.9, 4.1, 0.16), m_roof, "roof1")
block((-0.4, 0.55, 4.18),(4.3, 3.0, 0.16), m_roof, "roof2")
block((-0.4, 0.55, 4.30),(4.4, 3.05, 0.04), m_trim, "roof_trim")

# ---------- glazing (lit at dusk) ----------
def window(w, h, x, z, y, lit=True):
    block((x, y, z), (w, 0.06, h), m_litwarm if lit else m_glassdk, "win")
    # mullions
    n = max(2, round(w / 0.6))
    for i in range(n + 1):
        block((x - w/2 + w*i/n, y - 0.02, z), (0.05, 0.05, h + 0.05), m_wood, "mull")

YF = -1.78  # front face of ground floor
window(3.6, 1.5, -0.7, 1.05, YF, lit=True)
# ground-floor extra window (right of door)
block((1.7, YF, 1.0), (1.0, 0.06, 1.4), m_litwarm, "win_r")
# upper floor front glazing (front face at y = 0.55 - 1.2 = -0.65)
window(3.0, 1.2, -0.4, 3.15, -0.66, lit=True)
# side glazing (left, x = -2.73)
block((-2.73, 0.1, 1.1), (0.06, 2.1, 1.4), m_litwarm, "win_side")

# ---------- entrance ----------
block((0.4, YF + 0.02, 0.95), (1.1, 0.08, 1.7), m_wood, "door_recess")
block((0.4, YF - 0.03, 0.85), (0.55, 0.05, 1.4), m_trim, "door")
block((0.4, YF - 0.35, 1.85), (1.7, 1.1, 0.12), m_roof, "canopy")
block((1.1, YF - 0.35, 1.0), (0.1, 0.1, 1.7), m_wood, "canopy_post")
block((0.4, YF - 0.45, 0.36), (2.2, 0.5, 0.12), m_stone, "step1")
block((0.4, YF - 0.7, 0.24),  (2.6, 0.5, 0.12), m_stone, "step2")
# porch lamp (small warm glow)
block((1.05, YF - 0.05, 1.5), (0.12, 0.12, 0.2), m_litwarm, "porch_lamp")

# ---------- terrace railing (upper, front edge y = -0.66) ----------
block((-0.4, -0.66, 2.7), (3.5, 0.05, 0.06), m_trim, "rail_top")
for i in range(12):
    block((-2.05 + i * 0.37, -0.66, 2.45), (0.03, 0.03, 0.5), m_wood, "baluster")

# ---------- pool ----------
block((-2.9, -2.2, 0.34), (3.0, 1.9, 0.14), m_stone, "pool_deck")
block((-2.9, -2.2, 0.40), (2.5, 1.5, 0.06), m_water, "pool")

# ---------- trees & hedges ----------
def tree(x, y, s=1.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.9, location=(x, y, 0.6))
    bpy.context.active_object.data.materials.append(m_trunk)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.6 * s, location=(x, y, 1.4 * s))
    t = bpy.context.active_object; t.data.materials.append(m_leaf)
    for p in t.data.polygons: p.use_smooth = True

tree(3.8, -2.6, 1.1); tree(-4.0, 1.8, 1.3); tree(3.9, 2.2, 0.95)
block((0.3, -3.4, 0.6), (3.4, 0.45, 0.5), m_leaf, "hedge1")
block((-3.4, -0.2, 0.6),(0.45, 2.6, 0.5), m_leaf, "hedge2")

# ---------- world: Nishita dusk sky ----------
world = bpy.data.worlds.new("sky"); bpy.context.scene.world = world
world.use_nodes = True
nt = world.node_tree
for n in list(nt.nodes): nt.nodes.remove(n)
bg = nt.nodes.new("ShaderNodeBackground")
out = nt.nodes.new("ShaderNodeOutputWorld")
sky = nt.nodes.new("ShaderNodeTexSky")
# Blender 5.x renamed Nishita -> MULTIPLE_SCATTERING; fall back across versions
for st in ('MULTIPLE_SCATTERING', 'SINGLE_SCATTERING', 'NISHITA', 'HOSEK_WILKIE', 'PREETHAM'):
    try:
        sky.sky_type = st; break
    except Exception:
        continue
def skyset(attr, val):
    try: setattr(sky, attr, val)
    except Exception: pass
skyset('sun_elevation', math.radians(30 if DAY else 5.5))   # higher = midday, low = dusk
skyset('sun_rotation', math.radians(-58))
skyset('air_density', 2.2); skyset('dust_density', 2.6); skyset('ozone_density', 1.2)
skyset('turbidity', 3.0); skyset('ground_albedo', 0.25)
bg.inputs['Strength'].default_value = (1.35 if DAY else 0.14)   # bright day / deep twilight
nt.links.new(sky.outputs['Color'], bg.inputs['Color'])
nt.links.new(bg.outputs['Background'], out.inputs['Surface'])

# sun: strong warm-white by day, faint warm rim by dusk
bpy.ops.object.light_add(type='SUN', location=(8, -10, 6))
sunl = bpy.context.active_object.data
sunl.energy = (4.5 if DAY else 0.8); sunl.angle = math.radians(2.5)
sunl.color = ((1.0, 0.93, 0.82) if DAY else (1.0, 0.48, 0.20))
bpy.context.active_object.rotation_euler = ((math.radians(50), 0, math.radians(-40)) if DAY
                                            else (math.radians(76), 0, math.radians(-46)))

# warm light spilling OUT of the entrance & windows (dusk only)
def warm_point(loc, energy, size=0.5):
    bpy.ops.object.light_add(type='POINT', location=loc)
    L = bpy.context.active_object.data
    L.energy = energy; L.color = (1.0, 0.6, 0.28); L.shadow_soft_size = size
if not DAY:
    warm_point((0.4, YF - 0.55, 1.25), 110)    # porch / doorway
    warm_point((-0.7, YF - 0.6, 1.1), 130)     # big ground-floor window
    warm_point((-0.4, -1.0, 3.2), 90)          # upper terrace glazing
    warm_point((-2.71 - 0.4, 0.1, 1.1), 70)    # side window spill

# ---------- camera (3/4 architectural view) ----------
bpy.ops.object.empty_add(location=(0, 0, 1.8))
target = bpy.context.active_object
bpy.ops.object.camera_add(location=(11.5, -10.5, 5.6))
cam = bpy.context.active_object
cam.data.lens = 42
con = cam.constraints.new('TRACK_TO'); con.target = target
con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'
bpy.context.scene.camera = cam

# ---------- render settings ----------
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
try: sc.cycles.device = 'CPU'
except Exception: pass
sc.cycles.samples = 140
sc.cycles.use_denoising = True
try: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
except Exception: pass
sc.render.resolution_x = 1500
sc.render.resolution_y = 940
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = OUT
# AgX / Filmic tone mapping for realism
try: sc.view_settings.view_transform = 'AgX'
except Exception:
    try: sc.view_settings.view_transform = 'Filmic'
    except Exception: pass
for lk in ('AgX - Medium High Contrast', 'AgX - Base', 'Medium High Contrast', 'None'):
    try:
        sc.view_settings.look = lk; break
    except Exception:
        continue
sc.view_settings.exposure = (0.0 if DAY else -0.7)   # twilight: let the lit windows glow

print("RENDERING ->", OUT)
bpy.ops.render.render(write_still=True)
print("DONE")
