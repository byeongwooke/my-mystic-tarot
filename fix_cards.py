import re

def get_worry(filename):
    with open(filename, 'r') as f:
        content = f.read()
    # Match everything between "worry: {" and "    spread3: {"
    match = re.search(r'(    worry: \{.*?\n)    spread3: \{', content, re.DOTALL)
    return match.group(1)

def replace_worry(filename, new_worry):
    with open(filename, 'r') as f:
        content = f.read()
    new_content = re.sub(r'    worry: \{.*?\n    spread3: \{', f'{new_worry}    spread3: {{', content, flags=re.DOTALL)
    with open(filename, 'w') as f:
        f.write(new_content)

worry_knight_cups = get_worry('src/data/tarot/cards/card77.ts')  # where we wrongly put Knight of Cups
worry_king_pentacles = get_worry('src/data/tarot/cards/card75.ts')  # where we wrongly put King of Pentacles

# 1. card47.ts receives Knight of Cups
replace_worry('src/data/tarot/cards/card47.ts', worry_knight_cups)

# 2. card77.ts receives King of Pentacles
replace_worry('src/data/tarot/cards/card77.ts', worry_king_pentacles)

print("Fixed card47 and card77")
