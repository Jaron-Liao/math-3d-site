# -*- coding: utf-8 -*-
"""补充资产：4 个进阶模型 + Blender 渲染的等距柱状影棚环境图

运行：blender.exe -b --factory-startup --python build_extra.py
"""
import bpy, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))
OUT = os.path.join(ROOT, 'models')
ENV = os.path.join(ROOT, 'assets', 'env')
os.makedirs(OUT, exist_ok=True)
os.makedirs(ENV, exist_ok=True)

GOLD = (0.83, 0.69, 0.22, 1.0)
ICE = (0.64, 0.82, 1.0, 1.0)
ROSE = (1.0, 0.45, 0.55, 1.0)
MINT = (0.55, 0.9, 0.72, 1.0)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, color, metallic=0.95, rough=0.24, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = color
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = color
        b.inputs['Emission Strength'].default_value = emit
    return m


def grid_surface(name, f, nu, nv, material):
    verts, faces = [], []
    for i in range(nu + 1):
        for j in range(nv + 1):
            verts.append(f(i / nu, j / nv))
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
    for p in me.polygons:
        p.use_smooth = True
    ob.data.materials.append(material)
    return ob


def export(ob, filename):
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    path = os.path.join(OUT, filename)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB',
                              use_selection=True, export_apply=True, export_yup=True)
    print('EXPORT %-26s %7.1f KB' % (filename, os.path.getsize(path) / 1024.0))


# ── 1. 球谐曲面：r = 1 + 0.36·Y(4,3) ──
def build_harmonic():
    reset()

    def Y(t, p):
        # 实球谐 Y_4^3 的角向部分（归一化省略）
        return math.sin(3 * p) * (5 * math.cos(t) ** 3 - 3 * math.cos(t)) * math.sin(t) ** 3

    def f(u, v):
        p = u * 2 * math.pi
        t = v * math.pi
        r = 1.0 + 0.55 * Y(t, p)
        return (r * math.sin(t) * math.cos(p), r * math.sin(t) * math.sin(p), r * math.cos(t))

    ob = grid_surface('Harmonic', f, 160, 90, mat('Gold', GOLD))
    export(ob, 'ex_harmonic.glb')


# ── 2. 悬链面（极小曲面）──
def build_catenoid():
    reset()

    def f(u, v):
        p = u * 2 * math.pi
        t = -1.15 + v * 2.3
        r = math.cosh(t) * 0.62
        return (r * math.cos(p), r * math.sin(p), t * 1.05)

    ob = grid_surface('Catenoid', f, 128, 40, mat('Ice', ICE, metallic=0.9, rough=0.18))
    export(ob, 'ex_catenoid.glb')


# ── 3. 陀螺面（三周期极小曲面片）──
def build_gyroid():
    reset()

    def f(u, v):
        x = (u - 0.5) * 4.2
        y = (v - 0.5) * 4.2
        z = 0.55 * (math.sin(2.2 * x) * math.cos(2.2 * y) + math.sin(2.2 * y) * math.cos(1.6 * x))
        return (x, y, z)

    ob = grid_surface('Gyroid', f, 110, 110, mat('Mint', MINT, metallic=0.8, rough=0.3))
    export(ob, 'ex_gyroid.glb')


# ── 4. 超公式曲面（Superformula 星形）──
def build_supershape():
    reset()

    def superf(a, m, n1, n2, n3):
        t1 = abs(math.cos(m * a / 4)) ** n2
        t2 = abs(math.sin(m * a / 4)) ** n3
        return (t1 + t2) ** (-1 / n1) if (t1 + t2) > 1e-9 else 0.0

    def f(u, v):
        p = u * 2 * math.pi
        t = v * math.pi
        r1 = superf(p, 6, 0.6, 1.6, 1.6)
        r2 = superf(t, 6, 0.6, 1.6, 1.6)
        r = 1.15 * r1 * r2
        return (r * math.sin(t) * math.cos(p), r * math.sin(t) * math.sin(p), r * math.cos(t))

    ob = grid_surface('Supershape', f, 150, 80, mat('Rose', ROSE, metallic=0.85, rough=0.22))
    export(ob, 'ex_supershape.glb')


# ── 5. 渲染等距柱状影棚环境图（供 Three.js 作 environment）──
def render_env():
    reset()
    scene = bpy.context.scene

    # 暗色房间：内向球
    bpy.ops.mesh.primitive_uv_sphere_add(radius=14, segments=64, ring_count=32)
    room = bpy.context.object
    m = bpy.data.materials.new('Room')
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (0.035, 0.03, 0.022, 1)
    b.inputs['Roughness'].default_value = 0.75
    room.data.materials.append(m)
    room.scale = (-1, 1, 1)   # 翻转法线，相机在球内

    # 发光灯板
    panels = [
        ((0, 0, 8.2), (5.2, 3.2), (1.0, 0.93, 0.78), 26),
        ((-6.4, 1.2, 3.0), (3.4, 2.2), (1.0, 0.82, 0.5), 12),
        ((6.6, -2.0, 2.2), (3.0, 2.0), (0.65, 0.82, 1.0), 8),
        ((0, -7.4, 1.6), (4.0, 2.6), (1.0, 0.7, 0.35), 7),
    ]
    for i, (loc, size, col, power) in enumerate(panels):
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
        p = bpy.context.object
        p.scale = (size[0], size[1], 1)
        p.rotation_euler = (math.radians(90), 0, 0)
        pm = bpy.data.materials.new('Panel%d' % i)
        pm.use_nodes = True
        nodes, links = pm.node_tree.nodes, pm.node_tree.links
        for n in list(nodes):
            if n.type == 'BSDF_PRINCIPLED':
                nodes.remove(n)
        em = nodes.new('ShaderNodeEmission')
        em.inputs[0].default_value = (col[0], col[1], col[2], 1)
        em.inputs[1].default_value = power
        out = nodes.new('ShaderNodeOutputMaterial')
        links.new(em.outputs[0], out.inputs[0])
        p.data.materials.append(pm)

    # 全景相机
    cam_data = bpy.data.cameras.new('PanoCam')
    cam_data.type = 'PANO'
    cam_data.panorama_type = 'EQUIRECTANGULAR'
    cam = bpy.data.objects.new('PanoCam', cam_data)
    scene.collection.objects.link(cam)
    cam.location = (0, 0, 0)
    scene.camera = cam

    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath = os.path.join(ENV, 'studio.png')
    bpy.ops.render.render(write_still=True)
    print('ENV %s %.1f KB' % (scene.render.filepath,
                              os.path.getsize(scene.render.filepath) / 1024.0))


if __name__ == '__main__':
    for fn in (build_harmonic, build_catenoid, build_gyroid, build_supershape):
        try:
            fn()
        except Exception as e:
            print('FAIL %s: %s' % (fn.__name__, e))
            import traceback; traceback.print_exc()
    try:
        render_env()
    except Exception as e:
        print('FAIL render_env: %s' % e)
        import traceback; traceback.print_exc()
    print('DONE')
