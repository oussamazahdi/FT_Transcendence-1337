import sqlite3
import random
import string
import sys
from datetime import datetime, timedelta

# ================= CONFIG =================
DB_PATH = "../database/transcendence.db"

DEFAULT_CONVERSATIONS = 2000
MIN_MSGS_PER_CONV = 1
MAX_MSGS_PER_CONV = 30

# If True: only users with email ending "@test.local" will be used (nice for your seeded users)
ONLY_TEST_LOCAL = True

# How far back timestamps can go
MAX_DAYS_BACK = 30

# ================= HELPERS =================
WORDS = [
    "salut", "cv", "ok", "mdr", "let's", "go", "hmd", "nice", "bro", "wesh",
    "ping", "pong", "test", "message", "socket", "chat", "hey", "yo", "cool",
    "42", "pfe", "stage", "demain", "inshallah", "bien", "merci", "top"
]

def rand_text(min_words=2, max_words=12):
    n = random.randint(min_words, max_words)
    return " ".join(random.choice(WORDS) for _ in range(n))

def canonical_pair(a: int, b: int):
    return (a, b) if a < b else (b, a)

def parse_int(arg, default):
    try:
        return int(arg)
    except Exception:
        return default

# ================= MAIN =================
def main():
    # args: conversations [min_msgs] [max_msgs] [--all-users]
    total_convs = parse_int(sys.argv[1], DEFAULT_CONVERSATIONS) if len(sys.argv) >= 2 else DEFAULT_CONVERSATIONS
    min_msgs = parse_int(sys.argv[2], MIN_MSGS_PER_CONV) if len(sys.argv) >= 3 else MIN_MSGS_PER_CONV
    max_msgs = parse_int(sys.argv[3], MAX_MSGS_PER_CONV) if len(sys.argv) >= 4 else MAX_MSGS_PER_CONV

    only_test_local = ONLY_TEST_LOCAL
    if "--all-users" in sys.argv:
        only_test_local = False

    if min_msgs < 1:
        min_msgs = 1
    if max_msgs < min_msgs:
        max_msgs = min_msgs

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cur = conn.cursor()

    # ---- Load users
    if only_test_local:
        cur.execute("SELECT id FROM users WHERE email LIKE '%@test.local'")
    else:
        cur.execute("SELECT id FROM users")

    user_ids = [r[0] for r in cur.fetchall()]
    if len(user_ids) < 2:
        print("❌ Need at least 2 users in DB to generate conversations.")
        conn.close()
        return

    print(f"[*] Users loaded: {len(user_ids)} (only_test_local={only_test_local})")
    print(f"[*] Generating {total_convs} conversations with {min_msgs}..{max_msgs} msgs each")

    # ---- Create conversations
    # We store canonical (min,max) to respect UNIQUE(user_id, friend_id)
    pairs = set()
    conv_rows = []

    attempts = 0
    max_attempts = total_convs * 20  # avoid infinite loop
    while len(pairs) < total_convs and attempts < max_attempts:
        a, b = random.sample(user_ids, 2)
        u, f = canonical_pair(a, b)
        if (u, f) in pairs:
            attempts += 1
            continue
        pairs.add((u, f))
        conv_rows.append((u, f, None))  # last_message computed later
        attempts += 1

    if not conv_rows:
        print("❌ Could not generate any unique pairs.")
        conn.close()
        return

    # Insert conversations (ignore if already exists)
    cur.execute("BEGIN")
    cur.executemany(
        """
        INSERT OR IGNORE INTO conversations (user_id, friend_id, last_message)
        VALUES (?, ?, ?)
        """,
        conv_rows
    )
    conn.commit()

    # ---- Fetch conversation IDs for all pairs we want (including ones that already existed)
    # Make a map (user_id, friend_id) -> conversation_id
    q_marks = ",".join(["(?,?)"] * len(pairs))
    flat = []
    for (u, f) in pairs:
        flat.extend([u, f])

    cur.execute(
        f"""
        SELECT id, user_id, friend_id
        FROM conversations
        WHERE (user_id, friend_id) IN ({q_marks})
        """,
        flat
    )

    conv_map = {(r[1], r[2]): r[0] for r in cur.fetchall()}
    print(f"[OK] Conversations ready: {len(conv_map)}")

    # ---- Insert messages
    msg_rows = []
    conv_updates = []  # (last_message, updatedate, conv_id)

    now = datetime.utcnow()

    cur.execute("BEGIN")
    for (u, f), conv_id in conv_map.items():
        n_msgs = random.randint(min_msgs, max_msgs)

        # random start time in last MAX_DAYS_BACK days
        start = now - timedelta(days=random.randint(0, MAX_DAYS_BACK), minutes=random.randint(0, 24*60))
        t = start

        last_content = None
        last_time = None

        # alternate senders, but with some randomness
        for i in range(n_msgs):
            sender = u if (i % 2 == 0) else f
            if random.random() < 0.20:
                sender = random.choice([u, f])

            content = rand_text()
            # advance time a bit
            t += timedelta(seconds=random.randint(5, 600))

            msg_rows.append((conv_id, sender, content, t.isoformat(sep=" ")))

            last_content = content
            last_time = t

        if last_time is None:
            last_time = start
            last_content = ""

        conv_updates.append((last_content, last_time.isoformat(sep=" "), conv_id))

    # bulk insert
    cur.executemany(
        """
        INSERT INTO messages (conversation_id, sender_id, content, sent_at)
        VALUES (?, ?, ?, ?)
        """,
        msg_rows
    )

    # update conversations: last_message + updatedate = last msg time
    cur.executemany(
        """
        UPDATE conversations
        SET last_message = ?, updatedate = ?
        WHERE id = ?
        """,
        conv_updates
    )

    conn.commit()
    conn.close()

    print(f"✅ Inserted messages: {len(msg_rows)}")
    print("✅ Updated last_message + updatedate for conversations")
    print("DONE.")

if __name__ == "__main__":
    main()