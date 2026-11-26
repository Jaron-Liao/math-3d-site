# -*- coding: utf-8 -*-
"""Blender 无界面建模（第二批 10 个数学模型）→ GLB

运行： blender.exe -b --factory-startup --python build_more.py
产物： ../models/ex_*.glb  （随后用 glb2gltf.py 转 glTF）
不修改 build_assets.py 的既有 6 个模型。
"""
import bpy, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', 'models'))
os.makedirs(OUT, exist_ok=True)

GOLD = (0.83, 0.69, 0.22, 1.0)
GOLD_DK = (0.55, 0.43, 0.12, 1.0)
ICE = (0.64, 0.82, 1.0, 1.0)
CORAL = (1.0, 0.55, 0.58, 1.0)
MINT = (0.55, 0.88, 0.72, 1.0)
LAV = (0.78, 0.68, 0.92, 1.0)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, color, metallic=0.9, rough=0.3, emit=0.0):
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


def mesh_from_grid(name, f, nu, nv, thickness=None):
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
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.modifier_apply(modifier='solid')
    for p in me.polygons:
        p.use_smooth = True
    return ob


def curve_tube(name, pts, radius, color):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = 3
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (p[0], p[1], p[2], 1)
    ob = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.convert(target='MESH')
    ob = bpy.context.object
    ob.data.materials.append(mat(name + 'M', color))
    return ob


def export(ob, filename):
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    path = os.path.join(OUT, filename)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True,
                              export_apply=True, export_yup=True)
    print('EXPORT %-24s %7.1f KB' % (filename, os.path.getsize(path) / 1024.0))


def build_klein():
    """克莱因瓶（浸入三维的经典参数化）"""
    reset()
    def f(u, v):
        u *= 2 * math.pi; v *= 2 * math.pi
        if u < math.pi:
            x = 6*math.cos(u)*(1+math.sin(u)) + 4*(1-math.cos(u)/2)*math.cos(u)*math.cos(v)
            z = -16*math.sin(u) - 4*(1-math.cos(u)/2)*math.sin(u)*math.cos(v)
        else:
            x = 6*math.cos(u)*(1+math.sin(u)) + 4*(1-math.cos(u)/2)*math.cos(v+math.pi)
            z = -16*math.sin(u)
        y = -4*(1-math.cos(u)/2)*math.sin(v)
        return (x*0.14, y*0.14, z*0.14)
    ob = mesh_from_grid('Klein', f, 120, 60)
    ob.data.materials.append(mat('KleinM', LAV, 0.85, 0.28))
    export(ob, 'ex_klein_bottle.glb')


def build_hyperboloid():
    """单叶双曲面 x²+y²−z²=1"""
    reset()
    def f(u, v):
        a = u * 2 * math.pi
        z = (v - 0.5) * 3.2
        r = math.sqrt(1 + z*z*0.5)
        return (r*math.cos(a), r*math.sin(a), z)
    ob = mesh_from_grid('Hyperboloid', f, 96, 48)
    ob.data.materials.append(mat('HypM', GOLD, 0.95, 0.22))
    export(ob, 'ex_hyperboloid.glb')


def build_rose():
    """玫瑰曲面 r = cos(kθ) 的径向隆起"""
    reset()
    def f(u, v):
        a = u * 2 * math.pi
        rho = v * 1.8
        k = 5
        z = math.cos(k*a) * math.exp(-rho*0.9) * 1.4
        return (rho*math.cos(a), rho*math.sin(a), z)
    ob = mesh_from_grid('Rose', f, 160, 40)
    ob.data.materials.append(mat('RoseM', CORAL, 0.7, 0.35))
    export(ob, 'ex_rose_surface.glb')


def build_lissajous():
    """李萨如曲面 z = sin(ax)·sin(by) 叠加"""
    reset()
    def f(u, v):
        x = (u-0.5)*5; y = (v-0.5)*5
        z = 1.1*math.sin(2*x)*math.sin(3*y) + 0.3*math.sin(x+y)
        return (x, y, z)
    ob = mesh_from_grid('Lissajous', f, 90, 90)
    ob.data.materials.append(mat('LisM', ICE, 0.8, 0.3))
    export(ob, 'ex_lissajous.glb')


def build_logspiral():
    """对数螺线锥 r = e^{bθ}"""
    reset()
    pts = []
    N = 320
    for i in range(N):
        t = i/(N-1)
        a = t * 4 * math.pi
        r = 0.06 * math.exp(0.62 * a)
        if r > 2.4: r = 2.4
        pts.append((r*math.cos(a), r*math.sin(a), (t-0.5)*1.2))
    ob = curve_tube('LogSpiral', pts, 0.045, GOLD)
    export(ob, 'ex_log_spiral.glb')


def build_gradient():
    """梯度下降地形：双井势能 + 等高走向"""
    reset()
    def f(u, v):
        x = (u-0.5)*5; y = (v-0.5)*5
        z = 0.6*(x*x + y*y)*0.18 - 1.6*math.exp(-((x-1)**2+(y-1)**2)*1.2) - 1.1*math.exp(-((x+1)**2+(y+1)**2)*1.5)
        return (x, y, z)
    ob = mesh_from_grid('Gradient', f, 80, 80)
    ob.data.materials.append(mat('GradM', MINT, 0.65, 0.42))
    export(ob, 'ex_gradient_terrain.glb')


def build_archimedean():
    """阿基米德螺面（螺旋坡道）"""
    reset()
    def f(u, v):
        t = u * 3 * math.pi
        r = 0.15 + 0.52*t
        s = (v-0.5)*0.9
        return (r*math.cos(t), r*math.sin(t), t*0.13 + s)
    ob = mesh_from_grid('Archimedean', f, 200, 12, thickness=0.02)
    ob.data.materials.append(mat('ArchM', GOLD_DK, 0.9, 0.25))
    export(ob, 'ex_archimedean.glb')


def build_torus_knot():
    """(p,q) 环面纽结"""
    reset()
    pts = []
    N = 300
    p, q = 2, 3
    for i in range(N):
        t = i/(N-1) * 2*math.pi
        r = 1.0 + 0.42*math.cos(q*t)
        pts.append((r*math.cos(p*t), r*math.sin(p*t), 0.42*math.sin(q*t)))
    ob = curve_tube('TorusKnot', pts, 0.055, GOLD)
    export(ob, 'ex_torus_knot.glb')


def build_standing_wave():
    """二维驻波网格 sin(mx)sin(ny)"""
    reset()
    def f(u, v):
        x = (u-0.5)*4*math.pi; y = (v-0.5)*4*math.pi
        return (x*0.42, y*0.42, math.sin(3*x)*math.sin(4*y)*0.85)
    ob = mesh_from_grid('StandingWave', f, 110, 110)
    ob.data.materials.append(mat('WaveM', ICE, 0.75, 0.3))
    export(ob, 'ex_standing_wave.glb')


def build_funnel():
    """指数衰减漏斗 z = -1/r 截断"""
    reset()
    def f(u, v):
        a = u * 2 * math.pi
        t = v
        r = 0.28 + 2.0*t*t
        z = -1.6/(r+0.35) + 1.2
        return (r*math.cos(a), r*math.sin(a), z)
    ob = mesh_from_grid('Funnel', f, 96, 40)
    ob.data.materials.append(mat('FunnelM', GOLD, 0.92, 0.24))
    export(ob, 'ex_exponential_funnel.glb')


BUILDERS = [build_klein, build_hyperboloid, build_rose, build_lissajous, build_logspiral,
            build_gradient, build_archimedean, build_torus_knot, build_standing_wave, build_funnel]

if __name__ == '__main__':
    for fn in BUILDERS:
        try:
            fn()
        except Exception as e:
            print('FAIL %s: %s' % (fn.__name__, e))
            import traceback
            traceback.print_exc()
    print('DONE')
