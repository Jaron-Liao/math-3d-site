# GLB -> 内嵌 base64 buffer 的 .gltf（纯文本，便于以文本方式推送/托管）
import base64, json, os, struct, sys

def convert(glb_path, gltf_path):
    data = open(glb_path, 'rb').read()
    magic, version, length = struct.unpack('<III', data[:12])
    if magic != 0x46546C67:
        raise ValueError('not a GLB: ' + glb_path)
    off, chunks = 12, []
    while off < length:
        clen, ctype = struct.unpack('<II', data[off:off + 8])
        chunks.append((ctype, data[off + 8: off + 8 + clen]))
        off += 8 + clen
    doc = json.loads(chunks[0][1].decode('utf-8').rstrip('\x00 '))
    bin_chunk = chunks[1][1] if len(chunks) > 1 else b''
    if bin_chunk:
        uri = 'data:application/octet-stream;base64,' + base64.b64encode(bin_chunk).decode('ascii')
        if doc.get('buffers'):
            doc['buffers'][0]['uri'] = uri
            doc['buffers'][0].pop('byteLength', None)
            doc['buffers'][0]['byteLength'] = len(bin_chunk)
        else:
            doc['buffers'] = [{'byteLength': len(bin_chunk), 'uri': uri}]
    with open(gltf_path, 'w', encoding='utf-8') as f:
        json.dump(doc, f, separators=(',', ':'), ensure_ascii=False)
    return os.path.getsize(gltf_path)

if __name__ == '__main__':
    total = 0
    for fn in sorted(os.listdir('models')):
        if fn.endswith('.glb'):
            src = os.path.join('models', fn)
            dst = src[:-4] + '.gltf'
            n = convert(src, dst)
            total += n
            print('%-26s %7.1f KB' % (fn[:-4] + '.gltf', n / 1024.0))
            os.remove(src)
    print('TOTAL %.1f KB' % (total / 1024.0))
