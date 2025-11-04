#!/usr/bin/env python3
"""
Script to clean and update names.csv:
1. Clean all titles to have only 'Default' tag
2. Review and reassign Akoran names to other heritages
3. Review Red Water and Dagger Isles assignments
"""

import csv
import sys

def load_csv(filename='names.csv'):
    """Load CSV and return rows."""
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def save_csv(rows, filename='names.csv'):
    """Save rows to CSV."""
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['Name', 'Position', 'Gender', 'Weight', 'Tags'])
        writer.writeheader()
        writer.writerows(rows)

def clean_titles(rows):
    """Clean all titles to have only 'Default' tag."""
    changes = 0
    for row in rows:
        if row['Position'] == 'title':
            if row['Tags'] != 'Default':
                print(f"Cleaning title: {row['Name']} (was: {row['Tags']})")
                row['Tags'] = 'Default'
                changes += 1
    print(f"\nCleaned {changes} title entries")
    return rows

def analyze_heritage_distribution(rows):
    """Analyze distribution of names across heritages."""
    heritage_counts = {}

    for row in rows:
        if row['Position'] in ['first', 'last', 'nickname']:
            tags = row['Tags'].split('|')
            for tag in tags:
                if tag.startswith('Blades - '):
                    heritage = tag.replace('Blades - ', '')
                    if heritage not in heritage_counts:
                        heritage_counts[heritage] = {'first': 0, 'last': 0, 'nickname': 0}
                    heritage_counts[heritage][row['Position']] += 1

    print("\n=== Heritage Distribution ===")
    for heritage in sorted(heritage_counts.keys()):
        counts = heritage_counts[heritage]
        total = sum(counts.values())
        print(f"{heritage:20s}: {total:3d} total (first: {counts['first']:3d}, last: {counts['last']:3d}, nickname: {counts['nickname']:3d})")

    return heritage_counts

def reassign_names(rows):
    """Reassign Akoran names to underrepresented heritages based on cultural patterns."""
    changes = []

    def matches_pattern(name, heritage):
        """Check if name matches cultural pattern for a heritage."""
        name_lower = name.lower()

        if heritage == 'Skovlan':
            # Scottish/Celtic/Norse: names with specific patterns
            skovlan_names = ['angus', 'arden', 'helles', 'rowan', 'arran', 'basran', 'boden',
                            'brogan', 'clelland', 'dalmore', 'dunvil', 'haig', 'fergus',
                            'malcolm', 'duncan', 'ewan', 'alastair', 'hamish', 'moira', 'fiona',
                            'cairn', 'donal', 'gregor', 'rory', 'sean', 'aisling', 'ian',
                            'finnegan', 'brennan', 'declan', 'donovan', 'flann', 'keegan']
            # Scottish suffixes
            if any(name_lower.endswith(s) for s in ['more', 'burn', 'field', 'ran', 'iron', 'gan', 'lan', 'don']):
                return True
            # Scottish prefixes
            if name_lower.startswith('mc') or name_lower.startswith('mac') or name_lower.startswith('o\''):
                return True
            # Common Scottish/Irish patterns
            if any(s in name_lower for s in ['donn', 'bren', 'finn']):
                return True
            return name_lower in skovlan_names

        elif heritage == 'Iruvia':
            # Middle Eastern/Persian/Arabic: specific sound patterns
            iruvia_indicators = ['aa', 'ee', 'uu', 'oo', 'kh', 'gh', 'qw', 'aj', 'feh', 'barz']
            # Common Arabic/Persian name elements
            arabic_names = ['abdul', 'ahmad', 'ali', 'amir', 'ayodele', 'aziz', 'farid', 'hassan',
                           'jalil', 'kamil', 'malik', 'nasir', 'omar', 'rashid', 'samir', 'tariq',
                           'zahir', 'ishmael']
            if name_lower in arabic_names:
                return True
            # Check for double vowels or specific consonants
            return any(ind in name_lower for ind in iruvia_indicators)

        elif heritage == 'Severos':
            # Slavic/Eastern European/Mediterranean
            # Greek names (like Papadopoulos)
            if 'poulos' in name_lower or 'popov' in name_lower:
                return True
            # Slavic endings
            if any(name_lower.endswith(s) for s in ['os', 'is', 'us', 'ov', 'ev', 'ul', 'yr', 'as', 'ius']):
                return True
            # Specific Slavic/Mediterranean names
            severos_names = ['drav', 'kyran', 'milos', 'stavrul', 'veleris', 'vond', 'yury',
                            'kyra', 'aldo', 'cato', 'dimitri', 'elias', 'marcus', 'basilio',
                            'constantine', 'greco', 'romano', 'paulo', 'boris', 'dmitri',
                            'ivan', 'kaspar', 'luka', 'marius', 'nikolai', 'petrov', 'sergei',
                            'valentin', 'vladimir', 'zoran']
            # Latin/Greek patterns
            if any(s in name_lower for s in ['tus', 'lius', 'tius', 'dius']):
                return True
            return name_lower in severos_names

        elif heritage == 'Tycheros':
            # Far Eastern/exotic fantasy names
            # Specific endings
            if any(name_lower.endswith(s) for s in ['ath', 'eth', 'och', 'anu', 'alis', 'ax', 'ex', 'ix', 'yx']):
                return True
            # Specific patterns
            tycheros_names = ['akut', 'ammog', 'bael', 'narcus', 'noggs', 'vaurin', 'waase',
                             'sesereth', 'sethla', 'syra', 'veretta', 'vestine', 'volette',
                             'athanoch', 'avrathi', 'daralis', 'klevanu', 'nox', 'vex', 'zyx']
            # Fantasy/exotic patterns
            if any(s in name_lower for s in ['vra', 'kle', 'dar', 'sese', 'ves', 'vol']):
                return True
            return name_lower in tycheros_names

        return False

    for row in rows:
        if row['Position'] in ['first', 'last', 'nickname']:
            tags = row['Tags'].split('|')

            # Only process if it has Blades - Akoros and not already multi-heritage
            if 'Blades - Akoros' in tags:
                name = row['Name']
                new_heritage = None

                # Check each heritage in priority order (most undersupplied first)
                for heritage in ['Severos', 'Tycheros', 'Iruvia', 'Skovlan']:
                    if matches_pattern(name, heritage):
                        new_heritage = f'Blades - {heritage}'
                        break

                if new_heritage:
                    # Replace Blades - Akoros with new heritage
                    new_tags = [tag for tag in tags if tag != 'Blades - Akoros']
                    if new_heritage not in new_tags:
                        new_tags.append(new_heritage)
                    row['Tags'] = '|'.join(new_tags)
                    changes.append(f"{name} ({row['Position']}): Akoros -> {new_heritage.replace('Blades - ', '')}")

    print(f"\n=== Reassigned {len(changes)} Names ===")
    for change in changes[:30]:  # Show first 30
        print(change)
    if len(changes) > 30:
        print(f"... and {len(changes) - 30} more")

    return rows

if __name__ == '__main__':
    rows = load_csv('names.csv')

    print("=== Step 1: Clean Titles ===")
    rows = clean_titles(rows)

    print("\n=== Step 2: Analyze Heritage Distribution (Before) ===")
    analyze_heritage_distribution(rows)

    print("\n=== Step 3: Reassign Names ===")
    rows = reassign_names(rows)

    print("\n=== Step 4: Analyze Heritage Distribution (After) ===")
    analyze_heritage_distribution(rows)

    # Save cleaned CSV
    save_csv(rows, 'names.csv')
    print("\n✓ Saved cleaned CSV")
