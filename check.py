import json
import re
import os

with open('src/data/tarot/cards/index.ts', 'r') as f:
    text = f.read()

metadata = {}
for line in text.split('\n'):
    m1 = re.search(r'"id":\s*(\d+)', line)
    m2 = re.search(r'"nameKr":\s*"([^"]+)"', line)
    if m1 and m2:
        metadata[int(m1.group(1))] = m2.group(1)

results = []
for i in range(78):
    path = f'src/data/tarot/cards/card{i}.ts'
    if not os.path.exists(path):
        results.append(f"Card {i} missing")
        continue
    with open(path, 'r') as f:
        content = f.read()
    has_export = f"export const card{i}:" in content
    
    m = re.search(r'spicy:\s*{\s*love:\s*{\s*normal:\s*{\s*interpretation:\s*\'([^\']+)\'', content)
    interp = m.group(1) if m else "No spicy match"
    
    # 1. 파일명은 card{i}.ts
    # 2. export const card{i}
    # 3. 인덱스 상의 카드 이름과 내용 일치 여부 (우선 export 체크 및 내용 스니펫)
    status = "OK" if has_export else "MISMATCH EXPORT"
    results.append(f"{i:>2} | Export: {status} | {metadata.get(i, '')} | {interp[:15]}")

for r in results:
    print(r)
