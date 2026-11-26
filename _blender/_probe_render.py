
import bpy, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render_assets as R
R.render_floor()
img = bpy.data.images.load(bpy.context.scene.render.filepath)
px = list(img.pixels)[0::4]
print("FLOOR_STATS max=%.3f mean=%.4f" % (max(px), sum(px)/len(px)))
