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

    conn.commit()
    conn.close()

    print(f"✅ Inserted {inserted} users into {DB_PATH}")
    conn.close()

    print(f"✅ Inserted {inserted} users into {DB_PATH}")

if __name__ == "__main__":
    main()
