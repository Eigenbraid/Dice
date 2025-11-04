#!/usr/bin/env python3
"""
Script to export all names from names.db to a CSV file
Format: Name, Position, Gender, Weight, Tags
"""

import sqlite3
import csv
import sys

def export_names_to_csv(output_file='names.csv'):
    """Export all names to CSV with human-readable values"""

    conn = sqlite3.connect('names.db')
    cursor = conn.cursor()

    print(f"Exporting names to {output_file}...")

    # Query all names with their positions and genders
    cursor.execute('''
        SELECT
            n.id,
            n.name,
            p.position,
            g.gender,
            n.frequency_weight
        FROM names n
        JOIN positions p ON n.position_id = p.id
        JOIN genders g ON n.gender_id = g.id
        ORDER BY n.id
    ''')

    names_data = cursor.fetchall()

    # Open CSV file for writing
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)

        # Write header
        writer.writerow(['Name', 'Position', 'Gender', 'Weight', 'Tags'])

        # Write each name
        for name_id, name, position, gender, weight in names_data:
            # Get all tags for this name
            cursor.execute('''
                SELECT t.tag_name
                FROM tags t
                JOIN name_tags nt ON t.id = nt.tag_id
                WHERE nt.name_id = ?
                ORDER BY t.tag_name
            ''', (name_id,))

            tag_rows = cursor.fetchall()
            tags = '|'.join(tag[0] for tag in tag_rows)  # Pipe-separated tags

            writer.writerow([name, position, gender, weight, tags])

    conn.close()

    print(f"✓ Exported {len(names_data)} names to {output_file}")
    print(f"  Format: Name, Position, Gender, Weight, Tags (pipe-separated)")

if __name__ == '__main__':
    output_file = sys.argv[1] if len(sys.argv) > 1 else 'names.csv'
    export_names_to_csv(output_file)
