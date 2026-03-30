#!/usr/bin/env python3
"""
Refactors all card*.ts files: restructures the celtic section from
flat interpretations+positions to nested normal/reversed CelticCategory format.
"""

from typing import Optional, Tuple
import re
import os
import glob

CARDS_DIR = os.path.join(os.path.dirname(__file__), 'src', 'data', 'tarot', 'cards')


def extract_block(text: str, start: int) -> tuple[str, int]:
    """Given an index pointing AT the opening '{', extract the full balanced block."""
    assert text[start] == '{', f"Expected '{{' at index {start}, got '{text[start]}'"
    depth = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return text[start:i+1], i
    raise ValueError("Unbalanced braces")


def find_key_block(text: str, key: str, from_pos: int = 0) -> Optional[Tuple[str, int, int]]:
    """
    Find `key: { ... }` inside text starting at from_pos.
    Returns (block_content_with_braces, start_of_key, end_of_block) or None.
    """
    # Pattern: key followed by optional whitespace and a colon, then optional whitespace, then '{'
    pattern = re.compile(r'\b' + re.escape(key) + r'\s*:\s*\{')
    m = pattern.search(text, from_pos)
    if not m:
        return None
    brace_start = m.end() - 1  # position of '{'
    block, brace_end = extract_block(text, brace_start)
    return block, m.start(), brace_end


def find_key_string(text: str, key: str, from_pos: int = 0) -> Optional[Tuple[str, int, int]]:
    """
    Find `key: '...'` or `key: "..."` inside text.
    Returns (quoted_string_with_quotes, start_of_key, end_of_quote) or None.
    """
    pattern = re.compile(r'\b' + re.escape(key) + r"\s*:\s*(['\"])")
    m = pattern.search(text, from_pos)
    if not m:
        return None
    quote_char = m.group(1)
    start = m.end() - 1  # position of opening quote
    # Find closing quote, skipping escaped ones
    i = start + 1
    while i < len(text):
        if text[i] == '\\':
            i += 2
            continue
        if text[i] == quote_char:
            return text[start:i+1], m.start(), i
        i += 1
    raise ValueError(f"Unmatched quote for key {key}")


def indent_block(block: str, spaces: int) -> str:
    """Re-indent a block so the content inside the braces is indented by `spaces` spaces."""
    lines = block.split('\n')
    if len(lines) == 1:
        return block
    # Determine current indentation of the content (second line)
    result = [lines[0]]
    for line in lines[1:]:
        result.append(' ' * spaces + line.lstrip())
    return '\n'.join(result)


def reformat_positions_block(block: str) -> str:
    """Reformat position block to be compact but readable (remove extra blank lines)."""
    # block is like { core: '...', obstacle: '...', ... }
    return block


def refactor_mode_block(mode_text: str) -> str:
    """
    Takes the content of spicy: { ... } or gentle: { ... } (the full string including the key)
    and transforms it.
    """
    # Extract interpretations block
    interp_result = find_key_block(mode_text, 'interpretations')
    if not interp_result:
        print("  WARNING: 'interpretations' not found, skipping mode")
        return mode_text

    interp_block, _, _ = interp_result
    
    # Extract strings from interpretations
    def get_str(block, key):
        r = find_key_string(block, key)
        if r is None:
            raise ValueError(f"Key '{key}' not found in interpretations block")
        return r[0]  # the quoted string value

    love_i = get_str(interp_block, 'love')
    love_ri = get_str(interp_block, 'loveReversed')
    money_i = get_str(interp_block, 'money')
    money_ri = get_str(interp_block, 'moneyReversed')
    work_i = get_str(interp_block, 'work')
    work_ri = get_str(interp_block, 'workReversed')

    # Extract position blocks (love, loveReversed, money, moneyReversed, work, workReversed)
    def get_pos(text, key):
        r = find_key_block(text, key)
        if r is None:
            raise ValueError(f"Key '{key}' not found in mode block")
        return r[0]  # the { ... } block content

    love_pos = get_pos(mode_text, 'love')
    love_rpos = get_pos(mode_text, 'loveReversed')
    money_pos = get_pos(mode_text, 'money')
    money_rpos = get_pos(mode_text, 'moneyReversed')
    work_pos = get_pos(mode_text, 'work')
    work_rpos = get_pos(mode_text, 'workReversed')

    # Build the new structure
    # Detect indent from mode_text (find the first non-whitespace line to get base indent)
    indent = '            '  # 12 spaces (3 levels: celtic.spicy/gentle.love/money/work)
    inner = '                '  # 16 spaces for normal/reversed
    pos_indent = '                    '  # 20 spaces for positions content

    def fmt_positions(block: str) -> str:
        """Format a positions block with correct indentation."""
        # The block is { core: '...', ... }
        # We want to reformat to be properly indented
        # Strip outer braces, get content
        inner_content = block[1:-1].strip()
        # The 10 fields: core, obstacle, goal, foundation, past, nearFuture, self, influence, hopes, destiny
        return block  # Keep as-is, reformatting would be complex

    new_block = (
        f"{{\n"
        f"{indent}love: {{\n"
        f"{inner}normal: {{ interpretation: {love_i}, positions: {love_pos} }},\n"
        f"{inner}reversed: {{ interpretation: {love_ri}, positions: {love_rpos} }}\n"
        f"{indent}}},\n"
        f"{indent}money: {{\n"
        f"{inner}normal: {{ interpretation: {money_i}, positions: {money_pos} }},\n"
        f"{inner}reversed: {{ interpretation: {money_ri}, positions: {money_rpos} }}\n"
        f"{indent}}},\n"
        f"{indent}work: {{\n"
        f"{inner}normal: {{ interpretation: {work_i}, positions: {work_pos} }},\n"
        f"{inner}reversed: {{ interpretation: {work_ri}, positions: {work_rpos} }}\n"
        f"{indent}}}\n"
        f"        }}"  # closing brace for the mode
    )
    return new_block


def refactor_file(filepath: str) -> bool:
    """Refactor a single card file. Returns True if changed."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the celtic block
    celtic_result = find_key_block(content, 'celtic')
    if not celtic_result:
        print(f"  SKIP: celtic block not found in {os.path.basename(filepath)}")
        return False

    celtic_block, celtic_start, celtic_end = celtic_result

    # Find spicy block within celtic
    spicy_result = find_key_block(celtic_block, 'spicy')
    if not spicy_result:
        print(f"  SKIP: spicy block not found in {os.path.basename(filepath)}")
        return False

    spicy_block, spicy_key_start, spicy_end = spicy_result
    new_spicy = 'spicy: ' + refactor_mode_block(spicy_block)

    # Replace spicy block in celtic_block first
    # spicy_key_start is relative to celtic_block
    celtic_block_modified = celtic_block[:spicy_key_start] + new_spicy + celtic_block[spicy_end + 1:]

    # Find gentle block - search in original celtic_block after spicy ends
    # But use the original celtic_block to find gentle's original position
    # Actually, gentle comes after spicy in the original, so find it in the original celtic_block
    gentle_result = find_key_block(celtic_block, 'gentle')
    if not gentle_result:
        print(f"  SKIP: gentle block not found in {os.path.basename(filepath)}")
        return False

    gentle_block, gentle_key_start, gentle_end = gentle_result
    new_gentle = 'gentle: ' + refactor_mode_block(gentle_block)

    # We need to apply both replacements to the modified celtic block
    # After replacing spicy, gentle's offset has changed. Let's work on the original celtic block
    # and apply both replacements together by working on original positions.
    
    # Rebuild celtic block by replacing from back to front (higher offset first)
    # In original celtic_block: gentle is at gentle_key_start, spicy is at spicy_key_start
    # Since spicy comes first (lower index), replace gentle first, then spicy

    celtic_new = celtic_block
    # Replace gentle (comes after spicy, replace first to not affect spicy's offset)
    celtic_new = celtic_new[:gentle_key_start] + new_gentle + celtic_new[gentle_end + 1:]
    # Now replace spicy (spicy_key_start is still valid since gentle is after it)
    celtic_new = celtic_new[:spicy_key_start] + new_spicy + celtic_new[spicy_end + 1:]

    # Replace original celtic block in file content
    new_content = content[:celtic_start] + celtic_new + content[celtic_end + 1:]

    if new_content == content:
        print(f"  NO CHANGE: {os.path.basename(filepath)}")
        return False

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True


def main():
    pattern = os.path.join(CARDS_DIR, 'card*.ts')
    files = sorted(glob.glob(pattern))
    print(f"Found {len(files)} files to refactor.")

    changed = 0
    errors = []
    for fp in files:
        name = os.path.basename(fp)
        try:
            if refactor_file(fp):
                print(f"  OK: {name}")
                changed += 1
            else:
                print(f"  SKIP: {name}")
        except Exception as e:
            print(f"  ERROR in {name}: {e}")
            errors.append((name, str(e)))

    print(f"\nDone. {changed}/{len(files)} files changed.")
    if errors:
        print(f"\n{len(errors)} error(s):")
        for name, err in errors:
            print(f"  {name}: {err}")
    return len(errors) == 0


if __name__ == '__main__':
    import sys
    success = main()
    sys.exit(0 if success else 1)
