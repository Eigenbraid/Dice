#!/usr/bin/env python3
"""
Script to import names from a CSV file into names.db
Format: Name, Position, Gender, Weight, Tags (pipe-separated)

Usage:
    python3 import_names_from_csv.py [filename] [-reset]

    filename: Path to CSV file (default: names.csv)
    -reset: Clear all existing names before importing
"""

import sqlite3
import csv
import sys

def validate_and_import_csv(csv_file='names.csv', reset=False):
    """Import names from CSV with validation and error reporting"""

    conn = sqlite3.connect('names.db')
    cursor = conn.cursor()

    print(f"Importing names from {csv_file}...")

    # Handle reset flag
    if reset:
        print("⚠ Resetting database - deleting all existing names...")
        cursor.execute('DELETE FROM name_tags')
        cursor.execute('DELETE FROM names')
        conn.commit()
        print("  All existing names cleared.")

    # Get valid positions
    cursor.execute('SELECT position FROM positions')
    valid_positions = {row[0] for row in cursor.fetchall()}

    # Get valid genders
    cursor.execute('SELECT gender FROM genders')
    valid_genders = {row[0] for row in cursor.fetchall()}

    # Get valid tags (by name)
    cursor.execute('SELECT id, tag_name FROM tags')
    tag_name_to_id = {row[1]: row[0] for row in cursor.fetchall()}

    # Get position and gender IDs for lookups
    cursor.execute('SELECT position, id FROM positions')
    position_to_id = {row[0]: row[1] for row in cursor.fetchall()}

    cursor.execute('SELECT gender, id FROM genders')
    gender_to_id = {row[0]: row[1] for row in cursor.fetchall()}

    # Read and process CSV
    successes = 0
    failures = []

    try:
        with open(csv_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row_num, row in enumerate(reader, start=2):  # Start at 2 (1 is header)
                errors = []

                # Validate required fields
                if not row.get('Name') or not row['Name'].strip():
                    errors.append("missing or empty Name")

                if not row.get('Position'):
                    errors.append("missing Position")
                elif row['Position'] not in valid_positions:
                    errors.append(f"unknown position '{row['Position']}'")

                if not row.get('Gender'):
                    errors.append("missing Gender")
                elif row['Gender'] not in valid_genders:
                    errors.append(f"unknown gender '{row['Gender']}'")

                # Validate weight
                try:
                    weight = float(row.get('Weight', 1.0))
                    if weight <= 0:
                        errors.append(f"invalid weight '{weight}' (must be > 0)")
                except (ValueError, TypeError):
                    errors.append(f"invalid weight '{row.get('Weight')}' (must be a number)")
                    weight = 1.0

                # Validate tags
                tag_list = []
                if row.get('Tags'):
                    tags_str = row['Tags'].strip()
                    if tags_str:
                        tag_list = [t.strip() for t in tags_str.split('|') if t.strip()]
                        for tag in tag_list:
                            if tag not in tag_name_to_id:
                                errors.append(f"unknown tag '{tag}'")

                # If there are validation errors, record them
                if errors:
                    error_msg = f"Row {row_num}: " + ", ".join(errors)
                    failures.append(error_msg)
                    continue

                # Insert the name
                try:
                    cursor.execute('''
                        INSERT INTO names (name, position_id, gender_id, frequency_weight)
                        VALUES (?, ?, ?, ?)
                    ''', (
                        row['Name'].strip(),
                        position_to_id[row['Position']],
                        gender_to_id[row['Gender']],
                        weight
                    ))

                    # Get the inserted name's ID
                    name_id = cursor.lastrowid

                    # Insert tag associations
                    for tag in tag_list:
                        cursor.execute('''
                            INSERT INTO name_tags (name_id, tag_id)
                            VALUES (?, ?)
                        ''', (name_id, tag_name_to_id[tag]))

                    successes += 1

                except sqlite3.IntegrityError as e:
                    failures.append(f"Row {row_num}: database error - {str(e)}")
                    conn.rollback()

    except FileNotFoundError:
        print(f"✗ Error: File '{csv_file}' not found")
        conn.close()
        return
    except Exception as e:
        print(f"✗ Error reading CSV: {str(e)}")
        conn.close()
        return

    # Commit all successful inserts
    conn.commit()

    # Report results
    total = successes + len(failures)
    print(f"\n{'='*60}")
    print(f"Import complete!")
    print(f"{'='*60}")
    print(f"Loaded {total} rows. {successes} successes. {len(failures)} failures.")

    if failures:
        print(f"\nErrors:")
        for failure in failures:
            print(f"  * {failure}")

    print(f"{'='*60}")

    # Show final database stats
    cursor.execute('SELECT COUNT(*) FROM names')
    total_names = cursor.fetchone()[0]
    print(f"Total names in database: {total_names}")

    conn.close()

if __name__ == '__main__':
    # Parse command-line arguments
    csv_file = 'names.csv'
    reset = False

    for arg in sys.argv[1:]:
        if arg == '-reset':
            reset = True
        elif not arg.startswith('-'):
            csv_file = arg

    validate_and_import_csv(csv_file, reset)
