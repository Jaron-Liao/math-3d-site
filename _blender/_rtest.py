import bpy, os
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.2, location=(0, -5, 0))
o = bpy.context.object
m = bpy.data.materials.new('E')
m.use_nodes = True
nt = m.node_tree
out = next(n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL')   # 复用已有输出
bsdf = nt.nodes.get('Principled BSDF')
nt.nodes.remove(bsdf)
em = nt.nodes.new('ShaderNodeEmission')
em.inputs[0].default_value = (1, 0.9, 0.7, 1)
em.inputs[1].default_value = 50
nt.links.new(em.outputs[0], out.inputs['Surface'])
o.data.materials.append(m)

cd = bpy.data.cameras.new('P'); cd.type = 'PANO'; cd.panorama_type = 'EQUIRECTANGULAR'
c = bpy.data.objects.new('P', cd); sc.collection.objects.link(c); sc.camera = c
sc.render.engine = 'CYCLES'
sc.cycles.samples = 8
sc.render.resolution_x = 256; sc.render.resolution_y = 128
sc.render.filepath = os.path.abspath('_shots/_rtest.png')
bpy.ops.render.render(write_still=True)
img = bpy.data.images.load(sc.render.filepath)
px = list(img.pixels)
print('PANO_MAX %.3f' % max(px[0::4]))

# 透视相机对照
cd2 = bpy.data.cameras.new('P2'); cd2.lens = 50
c2 = bpy.data.objects.new('P2', cd2); sc.collection.objects.link(c2)
c2.location = (0, 0, 0); c2.rotation_euler = (1.5708, 0, 0)
sc.camera = c2
sc.render.filepath = os.path.abspath('_shots/_rtest2.png')
bpy.ops.render.render(write_still=True)
img2 = bpy.data.images.load(sc.render.filepath)
print('PERSP_MAX %.3f' % max(list(img2.pixels)[0::4]))
