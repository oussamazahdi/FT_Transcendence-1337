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
SEED_EMAIL = "abdelhak.elhajji_igpi6a@test.local"

MAX_USERS = 100
THREADS = 60
TIMEOUT = 10

# Pair-level distribution (each pair gets ONE final type)
P_FRIEND  = 0.45
P_PENDING = 0.25
P_BLOCKED = 0.10
# rest = none

# Total number of unique pairs you want to touch
PAIRS_TOTAL = 1200

# Cleanup intensity: how many random pairs per user to try removing old state
CLEAN_TARGETS_PER_USER = 60

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

def safe(fn):
    try:
        return fn()
    except Exception:
        return None

def ok(resp):
    return resp is not None and resp.status_code in (200, 201, 204, 409)

# ================= LOGIN USERS =================
print("[*] Seed login...")
seed = requests.Session()
r = login(seed, SEED_EMAIL)
assert r.status_code in (200, 201), r.text

print("[*] Fetching users...")
users = seed.get(USERS_URL, timeout=TIMEOUT).json()["userData"][:MAX_USERS]

clients = []
for u in users:
    s = requests.Session()
    if u["email"] == SEED_EMAIL:
        clients.append(Client(u["id"], u["email"], seed))
        continue

    rr = login(s, u["email"])
    if rr.status_code in (200, 201):
        clients.append(Client(u["id"], u["email"], s))

print(f"[OK] Logged in {len(clients)} users")

# ================= API ACTIONS =================
def send_request(c, target_id):
    return c.s.post(f"{FRIENDS}/requests/{target_id}", timeout=TIMEOUT)

def fetch_requests(c):
    r = c.s.get(f"{FRIENDS}/requests", timeout=TIMEOUT)
    if r.status_code != 200:
        return []
    return r.json().get("requestsList", []) or []

def accept_request(c, sender_id):
    return c.s.post(f"{FRIENDS}/requests/{sender_id}/accept", timeout=TIMEOUT)

def block(c, target_id):
    return c.s.post(f"{FRIENDS}/blocks/{target_id}", timeout=TIMEOUT)

def unblock(c, target_id):
    return c.s.delete(f"{FRIENDS}/blocks/{target_id}", timeout=TIMEOUT)

def unfriend(c, target_id):
    return c.s.delete(f"{FRIENDS}/{target_id}", timeout=TIMEOUT)

# ================= CLEANUP PHASE =================
def cleanup_worker(c: Client):
    pool = [x for x in clients if x.id != c.id]
    if not pool:
        return
    targets = random.sample(pool, k=min(CLEAN_TARGETS_PER_USER, len(pool)))

    for t in targets:
        # Try to remove both possible old states
        safe(lambda: unblock(c, t.id))
        safe(lambda: unfriend(c, t.id))

print("[🧹] Cleanup old blocks/friendships (best-effort)...")
with ThreadPoolExecutor(max_workers=THREADS) as ex:
    futures = [ex.submit(cleanup_worker, c) for c in clients]
    for _ in as_completed(futures):
        pass
print("[OK] Cleanup done")

# ================= BUILD UNIQUE PAIRS =================
# Create PAIRS_TOTAL unique unordered pairs (a<b)
ids = [c.id for c in clients]
id_to_client = {c.id: c for c in clients}

pairs = set()
attempts = 0
max_attempts = PAIRS_TOTAL * 20

while len(pairs) < min(PAIRS_TOTAL, (len(ids) * (len(ids)-1)) // 2) and attempts < max_attempts:
    a, b = random.sample(ids, 2)
    if a == b:
        continue
    x, y = (a, b) if a < b else (b, a)
    pairs.add((x, y))
    attempts += 1

pairs = list(pairs)
random.shuffle(pairs)

# Assign each pair exactly one type
def choose_type():
    r = random.random()
    if r < P_FRIEND:
        return "friend"
    if r < P_FRIEND + P_PENDING:
        return "pending"
    if r < P_FRIEND + P_PENDING + P_BLOCKED:
        return "blocked"
    return "none"

pair_types = {p: choose_type() for p in pairs}

# ================= SEED PHASE =================
def seed_pair(pair):
    a_id, b_id = pair
    t = pair_types[pair]
    a = id_to_client[a_id]
    b = id_to_client[b_id]

    # NOTE: to make direction consistent and avoid “mutual block everywhere”,
    # we always apply directional actions from a -> b.
    if t == "none":
        return True

    if t == "blocked":
        return ok(safe(lambda: block(a, b_id)))

    if t == "pending":
        return ok(safe(lambda: send_request(a, b_id)))

    if t == "friend":
        # Send from a -> b, then accept on b
        r1 = safe(lambda: send_request(a, b_id))
        if not ok(r1):
            return False

        # Accept specifically by sender_id (your API design)
        reqs = safe(lambda: fetch_requests(b)) or []
        found = any((req.get("id") == a_id) for req in reqs)
        if not found:
            # If accept list structure is different, friend creation won't complete,
            # but it still won't turn into "blocked everywhere".
            return False

        r2 = safe(lambda: accept_request(b, a_id))
        return ok(r2)

    return True

print("[🎲] Seeding mixed relationships (pair-based)...")
with ThreadPoolExecutor(max_workers=THREADS) as ex:
    futures = [ex.submit(seed_pair, p) for p in pairs]
    for _ in as_completed(futures):
        pass

# Quick distribution report
from collections import Counter
dist = Counter(pair_types.values())
print("\nDONE ✅ Mixed seed completed.")
print("Distribution:", dict(dist))
