# -*- coding: utf-8 -*-
"""Blender 无界面建模：生成网站用的数学 3D 资产（GLB）

运行： blender.exe -b --factory-startup --python build_assets.py
产物： ../models/*.glb
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', 'models'))
os.makedirs(OUT, exist_ok=True)

GOLD = (0.83, 0.69, 0.22, 1.0)
GOLD_DK = (0.55, 0.43, 0.12, 1.0)
ICE = (0.64, 0.82, 1.0, 1.0)
CORAL = (1.0, 0.55, 0.58, 1.0)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, color, metallic=1.0, rough=0.28, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = rough
    if emit > 0:
        bsdf.inputs['Emission Color'].default_value = color
        bsdf.inputs['Emission Strength'].default_value = emit
    return m


def mesh_from_grid(name, f, nu, nv, close_u=False, thickness=None):
    """参数曲面 -> 网格。f(u,v)->(x,y,z)，u/v 均取 [0,1]"""
    verts, faces = [], []
    for i in range(nu + 1):
        u = i / nu
        for j in range(nv + 1):
            v = j / nv
            verts.append(f(u, v))
    w = nv + 1
    for i in range(nu):
        for j in range(nv):
            a = i * w + j
            faces.append((a, a + 1, a + w + 1, a + w))

    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    if thickness:
        sm = ob.modifiers.new('solid', 'SOLIDIFY')
        sm.thickness = thickness
        sm.offset = 0
    for p in me.polygons:
        p.use_smooth = True
    return ob


def join_all(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    ob = bpy.context.object
    ob.name = name
    return ob


def export(ob, filename):
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    path = os.path.join(OUT, filename)
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True,
        export_apply=True, export_yup=True,
    )
    print('EXPORT %-22s %7.1f KB' % (filename, os.path.getsize(path) / 1024.0))


# ─────────── 1. 莫比乌斯带（首页主视觉）───────────
def build_mobius():
    reset()
    R, W = 1.0, 0.42

    def f(u, v):
        a = u * 2 * math.pi
        s = (v - 0.5) * 2 * W
        x = (R + s * math.cos(a / 2)) * math.cos(a)
        y = (R + s * math.cos(a / 2)) * math.sin(a)
        z = s * math.sin(a / 2)
        return (x, y, z)

    ob = mesh_from_grid('Mobius', f, 150, 16, thickness=0.022)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.modifier_apply(modifier='solid')
    ob.data.materials.append(mat('Gold', GOLD))
    export(ob, 'hero_mobius.glb')


# ─────────── 2. 双曲抛物面（偏导 / 切平面）───────────
def build_saddle():
    reset()
    S = 2.6

    def f(u, v):
        x = (u - 0.5) * 2 * S
        y = (v - 0.5) * 2 * S
        z = (x * x - y * y) * 0.32
        return (x, y, z)

    ob = mesh_from_grid('Saddle', f, 68, 68)
    ob.data.materials.append(mat('Ice', ICE, metallic=0.85, rough=0.35))
    ob.scale = (1.0, 1.0, 0.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    export(ob, 'ch_partial_saddle.glb')


# ─────────── 3. 旋转体（定积分应用）───────────
def build_revolve():
    reset()
    NU, NV = 96, 34

    def f(u, v):
        a = u * 2 * math.pi
        t = v * math.pi                # 0..π 沿母线
        r = 0.45 + 0.42 * math.sin(t) ** 1.2 + 0.10 * math.cos(3 * t)
        y = math.cos(t) * 1.35
        return (r * math.cos(a), r * math.sin(a), y)

    ob = mesh_from_grid('Revolve', f, NU, NV)
    ob.data.materials.append(mat('Gold', GOLD, rough=0.22))
    export(ob, 'ch_integral_solid.glb')


# ─────────── 4. 螺旋管（曲线积分）───────────
def build_helix():
    reset()
    cu = bpy.data.curves.new('helix', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.055
    cu.bevel_resolution = 4
    sp = cu.splines.new('POLY')
    N = 240
    sp.points.add(N - 1)
    for i in range(N):
        t = i / (N - 1) * 4 * math.pi
        sp.points[i].co = (0.9 * math.cos(t), 0.9 * math.sin(t), (i / (N - 1) - 0.5) * 2.6, 1)
    ob = bpy.data.objects.new('Helix', cu)
    bpy.context.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.convert(target='MESH')
    ob = bpy.context.object
    ob.data.materials.append(mat('Coral', CORAL, metallic=0.75, rough=0.3))
    export(ob, 'ch_line_helix.glb')


# ─────────── 5. ε-δ 收敛环带（极限）───────────
def build_rings():
    reset()
    objs = []
    for i, r in enumerate((1.05, 0.82, 0.62, 0.46, 0.34)):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=r, minor_radius=0.028 + 0.004 * (4 - i),
            major_segments=64, minor_segments=8,
            location=(i * 0.52 - 1.04, 0, 0),
        )
        o = bpy.context.object
        o.rotation_euler = (0, math.radians(90), 0)
        o.data.materials.append(mat('Ring%d' % i, GOLD if i % 2 == 0 else GOLD_DK))
        for p in o.data.polygons:
            p.use_smooth = True
        objs.append(o)
    ob = join_all(objs, 'EpsRings')
    export(ob, 'ch_limit_rings.glb')


# ─────────── 6. 向量场流线（常微分方程）───────────
def build_flow():
    reset()
    objs = []
    for k in range(7):
        ang = k / 7.0 * 2 * math.pi
        cu = bpy.data.curves.new('flow%d' % k, 'CURVE')
        cu.dimensions = '3D'
        cu.bevel_depth = 0.018
        cu.bevel_resolution = 2
        sp = cu.splines.new('POLY')
        N = 96
        sp.points.add(N - 1)
        for i in range(N):
            t = i / (N - 1) * 2.4
            rr = 0.25 + 0.95 * math.exp(-0.55 * t)
            sp.points[i].co = (rr * math.cos(t * 1.9 + ang),
                               rr * math.sin(t * 1.9 + ang),
                               (t - 1.2) * 0.55, 1)
        o = bpy.data.objects.new('flow%d' % k, cu)
        bpy.context.collection.objects.link(o)
        o.data.materials.append(mat('Flow%d' % k, ICE if k % 3 else GOLD, metallic=0.6, rough=0.4))
        objs.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.convert(target='MESH')
    ob = join_all([bpy.context.object] + objs[1:], 'FlowField')
    export(ob, 'ch_ode_flow.glb')


if __name__ == '__main__':
    for fn in (build_mobius, build_saddle, build_revolve, build_helix, build_rings, build_flow):
        try:
            fn()
        except Exception as e:
            print('FAIL %s: %s' % (fn.__name__, e))
            import traceback
            traceback.print_exc()
    print('DONE')
