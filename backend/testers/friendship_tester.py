import random
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass

# ================= CONFIG =================
HOST = "http://localhost:3001"
LOGIN_URL = f"{HOST}/api/auth/login"
USERS_URL = f"{HOST}/api/users/"
FRIENDS = f"{HOST}/api/friends"

DEFAULT_PASSWORD = "123456789"
LOGIN_ID_KEY = "email"

SEED_EMAIL = "hicham.elhajji_wmtyeq@test.local"

MAX_USERS = 10
THREADS = 50
OPS_PER_USER = 50
TIMEOUT = 10


# ================= TYPES =================
@dataclass
class Client:
    id: int
    email: str
    s: requests.Session


# ================= HELPERS =================
def login(session, email):
    return session.post(
        LOGIN_URL,
        json={LOGIN_ID_KEY: email, "password": DEFAULT_PASSWORD},
        timeout=TIMEOUT
    )

def ok(resp):
    return resp.status_code in (200, 201, 204, 409, 401)

def safe(fn):
    try:
        return fn()
    except Exception:
        return None


# ================= LOGIN USERS =================
print("[*] Seed login...")
seed = requests.Session()
r = login(seed, SEED_EMAIL)
assert r.status_code in (200, 201)

print("[*] Fetching users...")
users = seed.get(USERS_URL).json()["userData"][:MAX_USERS]

clients = []
for u in users:
    s = requests.Session()
    if u["email"] == SEED_EMAIL:
        clients.append(Client(u["id"], u["email"], seed))
        continue

    r = login(s, u["email"])
    if r.status_code in (200, 201):
        clients.append(Client(u["id"], u["email"], s))

print(f"[OK] Logged in {len(clients)} users")


# ================= ACTIONS =================
def send_request(c, target):
    return c.s.post(f"{FRIENDS}/requests/{target.id}", timeout=TIMEOUT)

def accept_any(c):
    r = c.s.get(f"{FRIENDS}/requests", timeout=TIMEOUT)
    if r.status_code != 200:
        return
    lst = r.json().get("requestsList", [])
    if not lst:
        return
    sender_id = random.choice(lst)["id"]
    return c.s.post(f"{FRIENDS}/requests/{sender_id}/accept", timeout=TIMEOUT)

def block(c, target):
    return c.s.post(f"{FRIENDS}/blocks/{target.id}", timeout=TIMEOUT)

def unblock(c, target):
    return c.s.delete(f"{FRIENDS}/blocks/{target.id}", timeout=TIMEOUT)

def unfriend(c, target):
    return c.s.delete(f"{FRIENDS}/{target.id}", timeout=TIMEOUT)


# ================= CHAOS WORKER =================
def chaos_worker(c: Client):
    for _ in range(OPS_PER_USER):
        target = random.choice(clients)
        if target.id == c.id:
            continue

        action = random.choice([
            lambda: send_request(c, target),
            lambda: accept_any(c),
            lambda: block(c, target),
            lambda: unblock(c, target),
            lambda: unfriend(c, target),
        ])

        r = safe(action)
        if r and not ok(r):
            print("ERR", r.status_code, r.text)


# ================= RUN =================
print("[🔥] Starting chaos test...")
with ThreadPoolExecutor(max_workers=THREADS) as ex:
    futures = [ex.submit(chaos_worker, c) for c in clients]
    for _ in as_completed(futures):
        pass

print("\nDONE ✅ Massive friendship chaos completed.")
