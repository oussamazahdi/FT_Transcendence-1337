import sqlite3
import random
import string
import sys
import bcrypt
import os



DB_PATH = "../database/transcendence.db"
password = '00000000'
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

        username = f"{first[0].upper()}{last.lower()}"
        email = f"{first.lower()}.{last.lower()}@gmail.com"


        if username not in used_usernames and email not in used_emails:
            used_usernames.add(username)
            used_emails.add(email)
            return (username, email, PASSWORD, first, last, None)

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
            INSERT INTO users (username, email, password, firstname, lastname, avatar)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (seed_username, seed_email, PASSWORD, "Seed", "User", None))
        print(f"✅ Inserted Seed User: {seed_email}")
    except sqlite3.IntegrityError:
        print(f"⚠️ Seed user {seed_email} already exists or conflict.")
    
    inserted = 0
    for _ in range(total):
        user_row = make_unique_user(used_usernames, used_emails)
        try:
            cur.execute("""
                INSERT INTO users (username, email, password, firstname, lastname, avatar)
                VALUES (?, ?, ?, ?, ?, ?)
            """, user_row)
            inserted += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    conn.close()

    print(f"✅ Inserted {inserted} users into {DB_PATH}")

if __name__ == "__main__":
    main()
