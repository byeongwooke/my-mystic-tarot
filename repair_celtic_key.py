import os
import glob
import re

CARDS_DIR = '/Users/yubyeong-ug/Desktop/tarot-app-project/src/data/tarot/cards'

def repair_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue is exactly:
    #     },
    #     {
    #         spicy: {
    # 
    # We want:
    #     },
    #     celtic: {
    #         spicy: {
    
    # Pattern to find the closing brace of spread3 and the opening brace of the unnamed celtic block
    # We look for a line with just a closing brace and comma, then a line with an opening brace
    # and "spicy:" on the next line.
    
    pattern = r'(\s+)\},\s*\{(\s+spicy:\s*\{)'
    # Group 1: original indentation of the closing brace
    # Group 2: original line with spicy (including its indent)
    
    # Replace with indent + '},' + indent + 'celtic: {' + Group 2
    new_content = re.sub(pattern, r'\1},\1celtic: {\2', content)
    
    if new_content == content:
        # Try a more flexible pattern if the first one fails
        # Look for spread3 block end then an opening brace
        pattern2 = r'(spread3: \{.*?\}\s*),\s*\{'
        new_content = re.sub(pattern2, r'\1, celtic: {', content, flags=re.DOTALL)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    files = glob.glob(os.path.join(CARDS_DIR, 'card*.ts'))
    repaired = 0
    for f in files:
        if repair_file(f):
            repaired += 1
            print(f"Repaired: {os.path.basename(f)}")
    print(f"Total repaired: {repaired}/78")

if __name__ == '__main__':
    main()
