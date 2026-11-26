# -*- coding: utf-8 -*-
"""Blender 渲染资产：影棚全景环境 + 地面舞台 + 20 张模型缩略图

运行：blender.exe -b --factory-startup --python render_assets.py -- [env|floor|thumbs|all]
"""
import bpy, math, os, sys
import mathutils

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))
MODELS = os.path.join(ROOT, 'models')
ENV = os.path.join(ROOT, 'assets', 'env')
THUMBS = os.path.join(ROOT, 'assets', 'thumbs')
for d in (ENV, THUMBS):
    os.makedirs(d, exist_ok=True)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def emission_mat(name, color, power):
    """自发光材质：直接用 Principled 的 Emission 输入（最稳妥，不碰节点连线）"""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (0, 0, 0, 1)
    b.inputs['Roughness'].default_value = 1.0
    b.inputs['Emission Color'].default_value = (color[0], color[1], color[2], 1)
    b.inputs['Emission Strength'].default_value = power
    return m


def pbr_mat(name, color, metallic=0.9, rough=0.25):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (color[0], color[1], color[2], 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = rough
    return m


def add_area(name, loc, size, color, power, target=(0, 0, 0)):
    """自发光灯板：headless 下 AR　EA 灯不生效，用发光平面代替（反射中可见灯形）"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (size, size * 0.65, 1)
    vec = mathutils.Vector(target) - mathutils.Vector(loc)
    ob.rotation_euler = vec.to_track_quat('-Z', 'Y').to_euler()
    ob.data.materials.append(emission_mat(name + '_m', color, power))
    ob.visible_camera = False      # 只照明，不入镜
    return ob


def cycles(samples=64, w=1024, h=512):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.render.resolution_x = w
    sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.view_transform = 'Filmic'
    sc.view_settings.look = 'Medium High Contrast'
    return sc


# ── 1. 影棚全景（等距柱状）──
def render_env():
    reset()
    sc = cycles(64, 1024, 512)
    w = bpy.data.worlds.new('W')
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs[0].default_value = (0.03, 0.026, 0.019, 1)

    lights = [
        ((0, 0, 8.0), 6.5, (1.0, 0.94, 0.82), 45),
        ((-7.5, 1.5, 3.4), 4.5, (1.0, 0.78, 0.45), 28),
        ((7.8, -2.0, 2.6), 3.6, (0.60, 0.78, 1.0), 18),
        ((0, -8.5, 1.0), 5.2, (1.0, 0.66, 0.32), 22),
        ((3.0, 6.5, -3.2), 3.2, (0.92, 0.92, 1.0), 8),
    ]
    for i, (loc, size, col, power) in enumerate(lights):
        add_area('L%d' % i, loc, size, col, power)

    cd = bpy.data.cameras.new('Pano')
    cd.type = 'PANO'
    cd.panorama_type = 'EQUIRECTANGULAR'
    cam = bpy.data.objects.new('Pano', cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    sc.render.filepath = os.path.join(ENV, 'studio.png')
    bpy.ops.render.render(write_still=True)
    print('ENV_OK', os.path.getsize(sc.render.filepath) // 1024, 'KB')


# ── 2. 地面舞台（英雄区背景）──
def render_floor():
    reset()
    sc = cycles(96, 1600, 900)
    w = bpy.data.worlds.new('W')
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs[0].default_value = (0.010, 0.009, 0.007, 1)

    # 抛光深色地面
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
    floor = bpy.context.object
    floor.data.materials.append(pbr_mat('Floor', (0.085, 0.072, 0.055), metallic=0.72, rough=0.14))

    # 远处背板（只做纵深，不遮挡视线）
    bpy.ops.mesh.primitive_plane_add(size=44, location=(0, 26, 9))
    wall = bpy.context.object
    wall.rotation_euler = (math.radians(90), 0, math.radians(180))
    wall.data.materials.append(pbr_mat('Wall', (0.05, 0.043, 0.033), metallic=0.1, rough=0.7))

    # 灯：主光池 + 两道金色边光
    add_area('Key', (1.5, -3.0, 7.0), 4.0, (1.0, 0.92, 0.78), 55, (0, 0, 1.2))
    add_area('RimL', (-6.0, 2.0, 3.2), 3.0, (1.0, 0.72, 0.36), 26, (0, 0, 1))
    add_area('RimR', (6.5, 1.0, 2.6), 2.6, (0.55, 0.75, 1.0), 20, (0, 0, 1))

    cd = bpy.data.cameras.new('Cam')
    cd.lens = 26
    cam = bpy.data.objects.new('Cam', cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    cam.location = (0, -8.5, 1.35)
    cam.rotation_euler = (math.radians(88), 0, 0)

    sc.render.filepath = os.path.join(ENV, 'floor.png')
    bpy.ops.render.render(write_still=True)
    print('FLOOR_OK', os.path.getsize(sc.render.filepath) // 1024, 'KB')


# ── 3. 模型缩略图 ──
def render_thumbs(only=None):
    files = sorted(f for f in os.listdir(MODELS) if f.endswith(('.glb', '.gltf')))
    for f in files:
        key = os.path.splitext(f)[0]
        if only and key not in only:
            continue
        reset()
        sc = cycles(28, 640, 400)
        w = bpy.data.worlds.new('W')
        sc.world = w
        w.use_nodes = True
        w.node_tree.nodes['Background'].inputs[0].default_value = (0.012, 0.011, 0.008, 1)

        bpy.ops.import_scene.gltf(filepath=os.path.join(MODELS, f))
        objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
        if not objs:
            continue
        # 合并包围盒
        bpy.context.view_layer.update()
        mins = mathutils.Vector((1e9, 1e9, 1e9))
        maxs = mathutils.Vector((-1e9, -1e9, -1e9))
        for o in objs:
            for c in o.bound_box:
                p = o.matrix_world @ mathutils.Vector(c)
                mins = mathutils.Vector((min(mins[i], p[i]) for i in range(3)))
                maxs = mathutils.Vector((max(maxs[i], p[i]) for i in range(3)))
        center = (mins + maxs) / 2
        size = max((maxs - mins).x, (maxs - mins).y, (maxs - mins).z) or 1
        dist = size * 2.75

        cd = bpy.data.cameras.new('C')
        cd.lens = 50
        cam = bpy.data.objects.new('C', cd)
        sc.collection.objects.link(cam)
        sc.camera = cam
        cam.location = center + mathutils.Vector((0.62, -1.0, 0.55)) * dist
        cam.rotation_euler = (center - cam.location).to_track_quat('-Z', 'Y').to_euler()

        add_area('Key', center + mathutils.Vector((1.6, -1.4, 2.2)) * size, size * 2.2,
                 (1.0, 0.93, 0.80), 40, center)
        add_area('Rim', center + mathutils.Vector((-2.0, 1.2, 0.8)) * size, size * 1.8,
                 (1.0, 0.72, 0.38), 22, center)
        add_area('Fill', center + mathutils.Vector((0.6, 2.2, -0.4)) * size, size * 1.6,
                 (0.60, 0.78, 1.0), 14, center)

        sc.render.filepath = os.path.join(THUMBS, key + '.png')
        bpy.ops.render.render(write_still=True)
        print('THUMB_OK %s %dKB' % (key, os.path.getsize(sc.render.filepath) // 1024))
        sys.stdout.flush()


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['all']
    what = argv[0] if argv else 'all'
    if what in ('env', 'all'):
        render_env()
    if what in ('floor', 'all'):
        render_floor()
    if what in ('thumbs', 'all'):
        render_thumbs(argv[1:] or None)
    print('DONE')
