"""Extract a compact cloud and a few story trajectories from the Goodfire demo HTML.

Usage: python3 -I site/scripts/extract-trajectories.py <demo.html> <out.json> [story_id ...]

Source: https://static.goodfire.ai/stories-in-space/hidden-trajectory.html
Stdlib only. Without story ids, the STORY_IDS below are used.
"""
import array
import base64
import json
import random
import sys

# Chosen from 2D previews for distinct, legible paths (10 to 30 sentences).
STORY_IDS = ['2109652', '539105', '1596061', '2023196', '942571', '1670970', '1692290', '1808033', '748017', '1469084']
CLOUD_SIZE = 1500
SEED = 221


def load(path):
    s = open(path, encoding='utf-8').read()
    key = 'window.__DASHBOARD_DATA = '
    i = s.index(key, s.index('id="dashboard-data"')) + len(key)
    j = s.index('</script>', i)
    return json.loads(s[i:j].strip().rstrip(';').strip())


def floats(field):
    if isinstance(field, list):
        return [float(x) for x in field]
    assert field['dtype'] == 'f4', field['dtype']
    a = array.array('f')
    a.frombytes(base64.b64decode(field['bdata']))
    if sys.byteorder == 'big':
        a.byteswap()
    return list(a)


def columns(rec, names):
    cols = [floats(rec[n]) for n in names]
    return list(zip(*cols))


def build(data, ids):
    cl = data['cloud']['emotion']
    cpts = columns(cl, ['umap_hidden_1', 'umap_hidden_2', 'umap_hidden_3'])
    cemo = list(cl['max_option'])
    stories = {}
    for sid in ids:
        st = data['traj']['stories'][sid]
        stories[sid] = columns(st, ['umap_hidden_emotion_1', 'umap_hidden_emotion_2', 'umap_hidden_emotion_3'])

    keep = sorted(random.Random(SEED).sample(range(len(cpts)), CLOUD_SIZE))
    cpts = [cpts[k] for k in keep]
    cemo = [cemo[k] for k in keep]

    # Normalize together: center on the cloud's bounding box, scale by the largest half-extent.
    allp = list(cpts) + [p for s in stories.values() for p in s]
    ctr, half = [], 0.0
    for a in range(3):
        lo = min(p[a] for p in allp)
        hi = max(p[a] for p in allp)
        ctr.append((lo + hi) / 2)
        half = max(half, (hi - lo) / 2)

    def norm(p):
        return [round((p[a] - ctr[a]) / half, 3) for a in range(3)]

    return {
        'cloud': {'points': [norm(p) for p in cpts], 'emotion': cemo},
        'stories': {sid: [norm(p) for p in s] for sid, s in stories.items()},
    }


def main():
    html, out = sys.argv[1], sys.argv[2]
    ids = sys.argv[3:] or STORY_IDS
    result = build(load(html), ids)
    with open(out, 'w') as f:
        json.dump(result, f, separators=(',', ':'))
    print(f'wrote {out}: {len(result["cloud"]["points"])} cloud points, {len(result["stories"])} stories')


if __name__ == '__main__':
    main()
