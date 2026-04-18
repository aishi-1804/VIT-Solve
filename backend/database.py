import sqlite3
from datetime import datetime

DB_PATH = "evaluations.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS doubts (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            created_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS answers (
            id TEXT PRIMARY KEY,
            doubt_id TEXT,
            content TEXT,
            created_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            answer_id TEXT,
            doubt_id TEXT,
            relevance_score REAL,
            label TEXT,
            justification TEXT,
            evaluated_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_evaluation(answer_id, doubt_id, score, label, justification):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO evaluations (answer_id, doubt_id, relevance_score, label, justification, evaluated_at) VALUES (?,?,?,?,?,?)",
        (answer_id, doubt_id, score, label, justification, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_evaluations_for_doubt(doubt_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute(
        "SELECT answer_id, relevance_score, label, justification FROM evaluations WHERE doubt_id=?",
        (doubt_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"answer_id": r[0], "score": r[1], "label": r[2], "justification": r[3]} for r in rows]
