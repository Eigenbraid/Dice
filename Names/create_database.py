#!/usr/bin/env python3
"""
Script to create the names.db SQLite database schema for Name Generator
"""

import sqlite3

def create_database():
    """Create the names.db database with all tables and basic reference data"""

    # Connect to database (creates if doesn't exist)
    conn = sqlite3.connect('names.db')
    cursor = conn.cursor()

    print("Creating tables...")

    # Create positions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS positions (
            id INTEGER PRIMARY KEY,
            position TEXT UNIQUE
        )
    ''')

    # Create genders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS genders (
            id INTEGER PRIMARY KEY,
            gender TEXT UNIQUE
        )
    ''')

    # Create names table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS names (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            pronunciation TEXT,
            meaning TEXT,
            frequency_weight REAL DEFAULT 1.0,
            position_id INTEGER REFERENCES positions(id),
            gender_id INTEGER REFERENCES genders(id)
        )
    ''')

    # Create tag_types table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tag_types (
            id INTEGER PRIMARY KEY,
            type_name TEXT UNIQUE NOT NULL
        )
    ''')

    # Create tags table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY,
            tag_type_id INTEGER REFERENCES tag_types(id),
            tag_name TEXT NOT NULL,
            parent_tag_id INTEGER REFERENCES tags(id),
            metadata_json TEXT,
            UNIQUE(tag_type_id, tag_name)
        )
    ''')

    # Create name_tags junction table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS name_tags (
            name_id INTEGER REFERENCES names(id) ON DELETE CASCADE,
            tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (name_id, tag_id)
        )
    ''')

    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_names_position ON names(position_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_names_gender ON names(gender_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(tag_type_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_tags_parent ON tags(parent_tag_id)')

    print("Tables created successfully!")

    # Populate positions
    print("Populating positions...")
    positions = ["first", "last", "title", "nickname"]
    for position in positions:
        cursor.execute('INSERT OR IGNORE INTO positions (position) VALUES (?)', (position,))

    # Populate genders
    print("Populating genders...")
    genders = ["any", "male", "female", "ambiguous", "queer"]
    for gender in genders:
        cursor.execute('INSERT OR IGNORE INTO genders (gender) VALUES (?)', (gender,))

    # Populate tag_types
    print("Populating tag_types...")
    tag_types = ["source", "vibe", "theme"]
    for tag_type in tag_types:
        cursor.execute('INSERT OR IGNORE INTO tag_types (type_name) VALUES (?)', (tag_type,))

    # Populate tags
    print("Populating tags...")
    # Get the source tag_type_id
    cursor.execute('SELECT id FROM tag_types WHERE type_name = ?', ("source",))
    source_type_id = cursor.fetchone()[0]

    # Insert parent tags first (no parent_tag_id)
    parent_tags = [
        "Blades In The Dark",
        "Backer Names",
        "BehindTheName.com",
        "Test Names",
        "Default"
    ]

    for tag_name in parent_tags:
        cursor.execute('''
            INSERT OR IGNORE INTO tags (tag_type_id, tag_name, parent_tag_id, metadata_json)
            VALUES (?, ?, NULL, NULL)
        ''', (source_type_id, tag_name))

    # Get the "Blades In The Dark" parent tag ID
    cursor.execute('SELECT id FROM tags WHERE tag_name = ?', ("Blades In The Dark",))
    bitd_parent_id = cursor.fetchone()[0]

    # Insert child tags with parent_tag_id set to Blades In The Dark
    child_tags = [
        "Blades 68",
        "Blades - Red Water",
        "Blades - Dagger Isles",
        "Blades - Akoros",
        "Blades - Iruvia",
        "Blades - Severos",
        "Blades - Skovlan",
        "Blades - Tycheros"
    ]

    for tag_name in child_tags:
        cursor.execute('''
            INSERT OR IGNORE INTO tags (tag_type_id, tag_name, parent_tag_id, metadata_json)
            VALUES (?, ?, ?, NULL)
        ''', (source_type_id, tag_name, bitd_parent_id))

    # Insert default titles (universal fallback titles)
    print("Populating default titles...")

    # Get the Default tag id
    cursor.execute('SELECT id FROM tags WHERE tag_name = ?', ("Default",))
    default_tag_id = cursor.fetchone()[0]

    # Get position and gender ids
    cursor.execute('SELECT id FROM positions WHERE position = ?', ("title",))
    title_position_id = cursor.fetchone()[0]

    gender_ids = {}
    for gender in ["any", "male", "female"]:
        cursor.execute('SELECT id FROM genders WHERE gender = ?', (gender,))
        gender_ids[gender] = cursor.fetchone()[0]

    # Default titles with genders
    default_titles = [
        ("Dr.", "any"),
        ("Professor", "any"),
        ("Captain", "any"),
        ("Sir", "male"),
        ("Lady", "female"),
        ("Lord", "male"),
        ("Dame", "female"),
        ("Colonel", "any"),
        ("Major", "any"),
        ("Lieutenant", "any"),
        ("Sergeant", "any"),
        ("Admiral", "any"),
        ("General", "any"),
        ("Commander", "any"),
        ("Chief", "any"),
        ("Duke", "male"),
        ("Duchess", "female"),
        ("Count", "male"),
        ("Countess", "female"),
        ("Baron", "male"),
        ("Baroness", "female"),
        ("Knight", "any"),
        ("Elder", "any"),
        ("Reverend", "any"),
        ("Father", "male"),
        ("Mother", "female"),
        ("Sister", "female"),
        ("Brother", "male"),
        ("Bishop", "any"),
        ("Archbishop", "any"),
        ("Judge", "any"),
        ("Justice", "any"),
        ("Senator", "any"),
        ("Governor", "any"),
        ("Mayor", "any"),
        ("Chancellor", "any"),
        ("Dean", "any"),
        ("Magistrate", "any"),
        ("Councilor", "any"),
        ("Ambassador", "any"),
        ("Minister", "any"),
        ("Secretary", "any"),
        ("President", "any"),
        ("Vice President", "any"),
        ("Chairman", "male"),
        ("Chairwoman", "female"),
        ("Director", "any"),
        ("Superintendent", "any"),
        ("Commissioner", "any"),
        ("Inspector", "any"),
        # Additional titles
        ("King", "male"),
        ("Queen", "female"),
        ("Prince", "male"),
        ("Princess", "female"),
        ("Master", "male"),
        ("Mistress", "female"),
        ("Esquire", "any"),
    ]

    for title, gender in default_titles:
        cursor.execute('''
            INSERT OR IGNORE INTO names (name, position_id, gender_id, frequency_weight)
            VALUES (?, ?, ?, ?)
        ''', (title, title_position_id, gender_ids[gender], 1.0))

        cursor.execute('SELECT id FROM names WHERE name = ?', (title,))
        result = cursor.fetchone()
        if result:
            name_id = result[0]
            cursor.execute('''
                INSERT OR IGNORE INTO name_tags (name_id, tag_id)
                VALUES (?, ?)
            ''', (name_id, default_tag_id))

    print(f"  Added {len(default_titles)} default titles")

    # Commit changes
    conn.commit()

    # Verify the schema
    print("\n" + "="*50)
    print("Database schema created successfully!")
    print("="*50)

    cursor.execute('SELECT COUNT(*) FROM positions')
    print(f"Positions: {cursor.fetchone()[0]}")

    cursor.execute('SELECT COUNT(*) FROM genders')
    print(f"Genders: {cursor.fetchone()[0]}")

    cursor.execute('SELECT COUNT(*) FROM tag_types')
    print(f"Tag Types: {cursor.fetchone()[0]}")

    cursor.execute('SELECT COUNT(*) FROM tags')
    print(f"Tags: {cursor.fetchone()[0]}")

    print("="*50)
    print("\nDatabase ready for data import!")
    print("Run import_test_names.py to populate with test data.")
    print("="*50)

    # Close connection
    conn.close()

if __name__ == '__main__':
    create_database()
