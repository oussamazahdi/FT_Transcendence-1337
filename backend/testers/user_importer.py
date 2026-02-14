import sqlite3
import random
import string
import sys
import bcrypt
import os
import math
from datetime import datetime, timedelta



DB_PATH = "../database/transcendence.db"
password = '123456789'
salt = bcrypt.gensalt(rounds=12);
bytes = password.encode('utf-8')
hashed = bcrypt.hashpw(bytes, salt)
PASSWORD = hashed.decode('utf-8')

FIRST_NAMES = [
    "Ahmed","Mohamed","Youssef","Omar","Ali","Hamza","Ayoub","Anas","Ilyas","Zakaria",
    "Amine","Bilal","Mehdi","Sofiane","Reda","Karim","Nabil","Khalid","Hicham","Rachid",
    "Adil","Samir","Said","Mustapha","Tarek","Yassine","Ismail","Hassan","Badr","Chafik",
    "Fouad","Jamal","Noureddine","Abdelhak","Abdellah","Abderrahim","Mounir","Walid","Imad","Marouane",
    "Kamal","Othmane","Soufian","Younes","Ibrahim","Ayman","Rayan","Nassim","Houcine","Kenza",
    "Fatima","Amina","Khadija","Zineb","Ikram","Houda","Rania","Sanaa","Chaimae","Malak",
    "Sara","Aya","Imane","Hajar","Salma","Nour","Lina","Meryem","Kawtar","Asmae",
    "Soukaina","Wiam","Oumaima","Hanane","Nadia","Samira","Naima","Btissam","Mouna","Loubna",
    "Yasmine","Nawal","Fatiha","Rajae","Kenza","Hind","Siham","Keltoum","Maha","Nisrine",
    "Adam","Noah","Liam","Lucas","Ethan","Mason","Leo","Daniel","David","Samuel",
    "Emma","Olivia","Sophia","Mia","Lily","Chloe","Grace","Ella","Ava","Zoey"
]

LAST_NAMES = [
    "Benali","ElAmrani","Haddad","Zerouali","Bennani","ElFassi","Alaoui","Tahiri","Raji","Kabbaj",
    "Bouzidi","Lamrani","Skalli","Idrissi","ElMansouri","ElKhatib","Berrada","Tazi","Sebti","Ziani",
    "Rahmani","Bensaid","Khalfi","AitLahcen","Ouazzani","Cherkaoui","ElOuardi","Fellah","Jabri","Baalla",
    "ElGuerrouj","Boudiaf","ElHariri","ElMekki","ElBakkali","Boukhari","Chraibi","Khnifri","ElKouchi","ElBouchouari",
    "Zerhouni","Bennouna","ElHajji","ElAissati","ElKhettabi","Slaoui","ElHassani","Bouazza","ElAzouzi","ElBadaoui",
    "Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Martinez","Taylor",
    "Anderson","Thomas","Hernandez","Moore","Martin","Jackson","Thompson","White","Lopez","Lee"
]

def rand_suffix(n=6) -> str:
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))

def make_unique_user(used_usernames: set, used_emails: set):
    while True:
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        suffix = rand_suffix(6)

        username = f"{first.lower()}.{last.lower()}_{suffix}"
        email = f"{username}@test.local"

        if username not in used_usernames and email not in used_emails:
            used_usernames.add(username)
            used_emails.add(email)
            return (username, email, PASSWORD, first, last, "http://localhost:3001/uploads/default/profile2.png", 1)

def seed_game_settings(cur):
    cur.execute("SELECT id FROM users")
    user_ids = [row[0] for row in cur.fetchall()]

    inserted = 0
    for user_id in user_ids:
        try:
            # XP grows randomly
            xp = random.randint(0, 20000)

            # Level derived from XP
            level = int(math.sqrt(xp / 100))

            # Optional gameplay randomization
            ball_speed = random.choice([5, 6, 7, 8])
            paddle_size = random.choice([100, 120, 140])
            score_limit = random.choice([5, 10, 15])

            cur.execute("""
                INSERT INTO game_settings (
                    player_id,
                    player_xp,
                    player_level,
                    game_mode,
                    ball_speed,
                    score_limit,
                    paddle_size
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                xp,
                level,
                "hell",
                ball_speed,
                score_limit,
                paddle_size
            ))

            inserted += 1

        except sqlite3.IntegrityError:
            pass

    print(f"🎮 Inserted {inserted} game_settings rows")

def seed_match_history(cur, matches=10000, days=7, min_per_day=None, start_days_ago=None):
    cur.execute("SELECT id FROM users")
    user_ids = [r[0] for r in cur.fetchall()]

    if len(user_ids) < 2:
        return

    now = datetime.now()

    # Window: [window_start, window_end]
    if start_days_ago is None:
        window_end = now
        window_start = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        window_end = (now - timedelta(days=start_days_ago)).replace(hour=23, minute=59, second=59, microsecond=0)
        window_start = (window_end - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    day_counts = [0] * days
    if min_per_day is not None and min_per_day > 0:
        base = min_per_day * days
        if base > matches:
            raise ValueError("min_per_day * days must be <= matches")
        for i in range(days):
            day_counts[i] = min_per_day
        remaining = matches - base
    else:
        remaining = matches

    for _ in range(remaining):
        day_counts[random.randrange(days)] += 1

    inserted = 0
    for day_index, count_for_day in enumerate(day_counts):
        day_start = window_start + timedelta(days=day_index)

        for _ in range(count_for_day):
            p1, p2 = random.sample(user_ids, 2)

            score_limit = random.choice([5, 10, 15])
            is_forfeit = (random.random() < 0.08)
            winner_id = random.choice([p1, p2])

            if is_forfeit:
                status = "forfait"
                if winner_id == p1:
                    p1_score, p2_score = score_limit, 0
                else:
                    p1_score, p2_score = 0, score_limit
            else:
                status = "win"  # ALWAYS win for a normal match

                loser_score = random.randint(0, score_limit - 1)
                if winner_id == p1:
                    p1_score, p2_score = score_limit, loser_score
                else:
                    p1_score, p2_score = loser_score, score_limit

                loser_score = random.randint(0, score_limit - 1)
                if winner_id == p1:
                    p1_score, p2_score = score_limit, loser_score
                else:
                    p1_score, p2_score = loser_score, score_limit
            seconds_into_day = random.randint(0, 86399)
            created_at_dt = day_start + timedelta(seconds=seconds_into_day)
            created_at = created_at_dt.strftime("%Y-%m-%d %H:%M:%S")

            cur.execute("""
                INSERT INTO match_history (
                    player1_id, player2_id, winner_id,
                    player1_score, player2_score, status,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (p1, p2, winner_id, p1_score, p2_score, status, created_at))

            inserted += 1

    print(f"🏓 Inserted {inserted} match_history rows across {days} days")

def seed_social_graph(
    cur,
    *,
    wipe=True,
    accepted_per_user=8,
    pending_per_user=3,
    blocked_per_user=1,
    messages_per_conversation=30,
):
    # --- Load users ---
    cur.execute("SELECT id FROM users")
    user_ids = [r[0] for r in cur.fetchall()]
    if len(user_ids) < 2:
        print("⚠️ Not enough users to seed friends/conversations/messages.")
        return

    if wipe:
        # Wipe in dependency order
        cur.execute("DELETE FROM messages")
        cur.execute("DELETE FROM conversations")
        cur.execute("DELETE FROM friends")
        print("🧹 Cleared messages, conversations, friends")

    def upsert_friend(sender_id, receiver_id, status, blocked_by=None):
        # INSERT OR IGNORE because you have UNIQUE(sender_id, receiver_id)
        cur.execute("""
            INSERT OR IGNORE INTO friends (sender_id, receiver_id, status, blocked_by)
            VALUES (?, ?, ?, ?)
        """, (sender_id, receiver_id, status, blocked_by))

    def ensure_conversation(user_id, friend_id):
        cur.execute("""
            INSERT OR IGNORE INTO conversations (user_id, friend_id, last_message)
            VALUES (?, ?, NULL)
        """, (user_id, friend_id))
        cur.execute("""
            SELECT id FROM conversations
            WHERE user_id = ? AND friend_id = ?
        """, (user_id, friend_id))
        row = cur.fetchone()
        return row[0] if row else None

    def insert_message(conversation_id, sender_id, content, msg_type="text_message"):
        cur.execute("""
            INSERT INTO messages (conversation_id, sender_id, type, content)
            VALUES (?, ?, ?, ?)
        """, (conversation_id, sender_id, msg_type, content))

    def update_last_message(conversation_id, content):
        cur.execute("""
            UPDATE conversations
            SET last_message = ?, updatedate = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (content, conversation_id))

    # --- Seed friends ---
    # We'll create relations per user, but avoid duplicates by keeping a set of directed pairs.
    directed_pairs = set()

    def pick_targets(me, k, exclude_set):
        pool = [u for u in user_ids if u != me and u not in exclude_set]
        random.shuffle(pool)
        return pool[:k]

    for me in user_ids:
        # gather already-used targets for this user (avoid spamming same users)
        used_targets = set()

        # Accepted (create ONE directed row; your queries must treat it undirected)
        for other in pick_targets(me, accepted_per_user, used_targets):
            used_targets.add(other)
            if (me, other) in directed_pairs or (other, me) in directed_pairs:
                continue

            # random direction on who sent the request originally
            sender, receiver = (me, other) if random.random() < 0.5 else (other, me)
            upsert_friend(sender, receiver, "accepted")
            directed_pairs.add((sender, receiver))

        # Pending (direction matters)
        for other in pick_targets(me, pending_per_user, used_targets):
            used_targets.add(other)
            if (me, other) in directed_pairs:
                continue
            upsert_friend(me, other, "pending")
            directed_pairs.add((me, other))

        # Blocked (direction matters + blocked_by)
        for other in pick_targets(me, blocked_per_user, used_targets):
            used_targets.add(other)
            if (me, other) in directed_pairs:
                continue
            # blocked_by is the blocker (me)
            upsert_friend(me, other, "blocked", blocked_by=me)
            directed_pairs.add((me, other))

    # --- Seed conversations + messages for accepted friendships ---
    cur.execute("""
        SELECT sender_id, receiver_id
        FROM friends
        WHERE status = 'accepted'
    """)
    accepted_pairs = cur.fetchall()

    inserted_convos = 0
    inserted_msgs = 0

    for a, b in accepted_pairs:
        # Make two convo rows so each user has their own (matches UNIQUE(user_id, friend_id))
        convo_ab = ensure_conversation(a, b)
        convo_ba = ensure_conversation(b, a)
        if convo_ab: inserted_convos += 1
        if convo_ba: inserted_convos += 1

        # Messages: distribute randomly between a and b,
        # and insert into BOTH conversations so each user sees same history.
        for i in range(messages_per_conversation):
            sender = a if random.random() < 0.5 else b
            content = f"msg_{i}_{rand_suffix(10)}"
            msg_type = "text_message"

            if convo_ab:
                insert_message(convo_ab, sender, content, msg_type)
                update_last_message(convo_ab, content)
                inserted_msgs += 1
            if convo_ba:
                insert_message(convo_ba, sender, content, msg_type)
                update_last_message(convo_ba, content)
                inserted_msgs += 1

    print(f"👥 Seeded friends: accepted={len(accepted_pairs)} (directional rows)")
    print(f"💬 Seeded conversations rows (attempted): ~{inserted_convos}")
    print(f"✉️ Seeded messages rows: {inserted_msgs}")


def main():
    total = 1000
    if len(sys.argv) >= 2:
        total = int(sys.argv[1])

    seed_email = "abdelhak.elhajji_igpi6a@test.local"
    seed_username = "seed.user"

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE email LIKE '%@test.local'")
    used_usernames = set()
    used_emails = set()
    for (u, e) in cur.execute("SELECT username, email FROM users"):
        if u: used_usernames.add(u)
        if e: used_emails.add(e)

    # cur.execute("BEGIN")

    # cur.execute("BEGIN")

    # Insert SEED USER specifically
    try:
        cur.execute("""
            INSERT INTO users (username, email, password, firstname, lastname, avatar, isverified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (seed_username, seed_email, PASSWORD, "Seed", "User", "http://localhost:3001/uploads/default/profile2.png", 1));
        print(f"✅ Inserted Seed User: {seed_email}")
    except sqlite3.IntegrityError:
        print(f"⚠️ Seed user {seed_email} already exists or conflict.")
    
    inserted = 0
    for _ in range(total):
        user_row = make_unique_user(used_usernames, used_emails)
        try:
            cur.execute("""
                INSERT INTO users (username, email, password, firstname, lastname, avatar, isverified)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, user_row)
            inserted += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()

    # Seed game_settings AFTER users exist
    seed_game_settings(cur)
    seed_match_history(cur, matches=10000, days=7, min_per_day=500)
    seed_social_graph(
        cur,
        wipe=True,                 # set False if you don't want to clear old data
        accepted_per_user=8,
        pending_per_user=3,
        blocked_per_user=1,
        messages_per_conversation=25
    )

    conn.commit()

    conn.commit()
    conn.close()

    print(f"✅ Inserted {inserted} users into {DB_PATH}")
    conn.close()

    print(f"✅ Inserted {inserted} users into {DB_PATH}")

if __name__ == "__main__":
    main()
