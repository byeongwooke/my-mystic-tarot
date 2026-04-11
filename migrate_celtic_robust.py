import os
import re

pos_keys = [
    'core', 'obstacle', 'goal', 'foundation', 'past', 
    'nearFuture', 'self', 'influence', 'hopes', 'destiny'
]

def migrate_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # celtic 블록 찾기
    celtic_match = re.search(r'celtic:\s*\{(.*?)\n\s*\}\n};', content, re.DOTALL)
    if not celtic_match:
        # 끝에 };가 있는 일반 패턴
        celtic_match = re.search(r'celtic:\s*\{(.*?)\n\s*\}', content, re.DOTALL)
    
    if not celtic_match: return False
    
    flavors = ['spicy', 'gentle']
    categories = ['love', 'money', 'work']
    
    new_content = content
    
    for flavor in flavors:
        for cat in categories:
            # 패턴: cat: { normal: { interpretation: '...', positions: { ... } }, reversed: { ... } }
            # 정규식 패턴을 더 유연하게 조정 (공백 및 줄바꿈 대응)
            pattern = fr'({cat}):\s*\{{\s*normal:\s*\{{\s*interpretation:\s*([\'"`].*?[\'"`]),\s*positions:\s*\{{(.*?)\}}\s*\}},\s*reversed:\s*\{{\s*interpretation:\s*([\'"`].*?[\'"`]),\s*positions:\s*\{{(.*?)\}}\s*\}}\s*\}}'
            
            match = re.search(pattern, new_content, re.DOTALL)
            if not match: continue
            
            full_match = match.group(0)
            norm_int = match.group(2)
            norm_pos_block = match.group(3)
            rev_int = match.group(4)
            rev_pos_block = match.group(5)
            
            def get_advice(block, key):
                # 키와 값 쌍을 찾되, 다음 키가 나오거나 블록이 끝날 때까지 캡처
                m = re.search(fr'{key}:\s*([\'"`].*?[\'"`])(?=,|$)', block, re.DOTALL)
                return m.group(1) if m else "''"
            
            items = []
            for key in pos_keys:
                n_adv = get_advice(norm_pos_block, key)
                r_adv = get_advice(rev_pos_block, key)
                
                item = f"""                {{
                    normal: {{ interpretation: {norm_int}, advice: {n_adv} }},
                    reversed: {{ interpretation: {rev_int}, advice: {r_adv} }}
                }}"""
                items.append(item)
            
            new_cat_str = f"{cat}: [\n" + ",\n".join(items) + "\n            ]"
            new_content = new_content.replace(full_match, new_cat_str)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# 실행 로직
dir_path = './src/data/tarot/cards'
count = 0
for i in range(78):
    fname = f'card{i}.ts'
    fpath = os.path.join(dir_path, fname)
    if os.path.exists(fpath):
        if migrate_file(fpath):
            count += 1

print(f"✅ 총 {count}개 파일 로버스트 마이그레이션 완료!")
