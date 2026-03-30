import re
from collections import Counter

file_path = 'src/data/tarot/gentle_celtic.ts'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 값(Value)만 추출 (문장 데이터)
    sentences = re.findall(r':\s*"(.*?)"', content)

    # 5자 이상인 문장 중 2번 이상 반복되는 것 찾기
    count = Counter(sentences)
    dupes = {sent: num for sent, num in count.items() if num > 1 and len(sent) > 5}

    print(f"총 추출된 문장 수: {len(sentences)}")
    print("--- 중복 발견 리스트 ---")
    if not dupes:
        print("중복된 문장이 없습니다.")
    else:
        for sent, num in dupes.items():
            print(f"[{num}회 반복]: {sent}")
except Exception as e:
    print(f"오류 발생: {e}")
