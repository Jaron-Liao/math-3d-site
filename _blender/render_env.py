# 用 Cycles 渲染等距柱状影棚环境图（区域光 + 深色世界）
import bpy, math, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
ENV = os.path.join(ROOT, 'assets', 'env')
os.makedirs(ENV, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# 世界：极暗暖灰，避免纯黑
w = bpy.data.worlds.new('W')
sc.world = w
w.use_nodes = True
bg = w.node_tree.nodes['Background']
bg.inputs[0].default_value = (0.02, 0.017, 0.012, 1)
bg.inputs[1].default_value = 1.0

lights = [
    # (位置, 尺寸, 颜色, 功率)
    ((0, 0, 7.5), 6.0, (1.0, 0.94, 0.80), 1400),
    ((-7.0, 1.5, 3.2), 4.0, (1.0, 0.80, 0.48), 900),
    ((7.4, -2.2, 2.4), 3.4, (0.62, 0.80, 1.0), 520),
    ((0, -8.0, 1.2), 5.0, (1.0, 0.68, 0.34), 620),
    ((2.5, 6.0, -3.0), 3.0, (0.9, 0.9, 1.0), 260),
]
for i, (loc, size, col, power) in enumerate(lights):
    d = bpy.data.lights.new('Area%d' % i, 'AREA')
    d.shape = 'RECTANGLE'
    d.size = size
    d.size_y = size * 0.62
    d.energy = power
    d.color = col
    ob = bpy.data.objects.new('Area%d' % i, d)
    sc.collection.objects.link(ob)
    ob.location = loc
    # 朝向原点
    dx, dy, dz = -loc[0], -loc[1], -loc[2]
    import mathutils
    ob.rotation_euler = mathutils.Vector((dx, dy, dz)).to_track_quat('-Z', 'Y').to_euler()

cam_d = bpy.data.cameras.new('Pano')
cam_d.type = 'PANO'
cam_d.panorama_type = 'EQUIRECTANGULAR'
cam = bpy.data.objects.new('Pano', cam_d)
sc.collection.objects.link(cam)
sc.camera = cam

sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = 64
sc.cycles.use_denoising = True
sc.render.resolution_x = 1024
sc.render.resolution_y = 512
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = os.path.join(ENV, 'studio.png')
bpy.ops.render.render(write_still=True)

img = bpy.data.images.load(sc.render.filepath)
px = list(img.pixels)
mx = max(px[0::4]) if px else 0
print('ENV_DONE max=%.3f size=%.1fKB' % (mx, os.path.getsize(sc.render.filepath) / 1024.0))
