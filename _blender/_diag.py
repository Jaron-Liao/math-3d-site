import bpy, os, mathutils
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# 发光平面
bpy.ops.mesh.primitive_plane_add(size=4, location=(0, 3, 2))
p = bpy.context.object
p.rotation_euler = (mathutils.Vector((0,0,0)) - p.location).to_track_quat('-Z','Y').to_euler()
m = bpy.data.materials.new('E'); m.use_nodes = True
b = m.node_tree.nodes.get('Principled BSDF')
print('INPUTS:', [i.name for i in b.inputs][:12])
b.inputs['Base Color'].default_value = (0,0,0,1)
b.inputs['Emission Color'].default_value = (1,0.9,0.7,1)
b.inputs['Emission Strength'].default_value = 30
p.data.materials.append(m)

# 灰球接收光照
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0,0,0))
s = bpy.context.object
sm = bpy.data.materials.new('S'); sm.use_nodes = True
sb = sm.node_tree.nodes.get('Principled BSDF')
sb.inputs['Base Color'].default_value = (0.5,0.5,0.5,1)
sb.inputs['Roughness'].default_value = 0.6
s.data.materials.append(sm)

cd = bpy.data.cameras.new('C'); cd.lens = 50
cam = bpy.data.objects.new('C', cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, -6, 0.5)
cam.rotation_euler = (mathutils.Vector((0,0,0)) - cam.location).to_track_quat('-Z','Y').to_euler()

sc.render.engine = 'CYCLES'
print('ENGINE:', sc.render.engine, 'samples:', sc.cycles.samples)
sc.cycles.samples = 16
sc.render.resolution_x = 320; sc.render.resolution_y = 200
sc.render.filepath = os.path.abspath('_shots/_diag.png')
bpy.ops.render.render(write_still=True)
img = bpy.data.images.load(sc.render.filepath)
px = list(img.pixels)[0::4]
print('DIAG max=%.3f mean=%.4f objects=%d' % (max(px), sum(px)/len(px), len(sc.objects)))
