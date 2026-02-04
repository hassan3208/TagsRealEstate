import re
from models import LeaseType


def canonicalize_name(name: str):
    name = name.lower()
    name = re.sub(r"(llc|inc|ltd)", "", name)
    name = re.sub(r"[^a-z0-9 ]", "", name)
    return name.strip()


def parse_address(addr: str):
    parts = [p.strip() for p in addr.split(",")]

    street = parts[0]
    city = parts[1]
    state_zip = parts[2].split()
    state = state_zip[0]
    zip_code = state_zip[1] if len(state_zip) > 1 else ""

    return street, city, state, zip_code


def normalize_size(size):
    if isinstance(size, int):
        return size
    return int(str(size).replace(",", "").split()[0])


def normalize_rent(rent, size):
    rent = str(rent).lower().replace("$", "").strip()

    if "/sf" in rent:
        return float(rent.replace("/sf", ""))

    if "/mo" in rent:
        monthly = float(rent.replace("/mo", ""))
        if size <= 0:
            raise ValueError("size must be > 0")

        return round((monthly * 12) / size, 2)

    return float(rent)


def normalize_lease(t):
    t = t.lower()

    if t in ["nnn", "triple net"]:
        return LeaseType.NNN

    if t == "gross":
        return LeaseType.GROSS

    if t == "modified":
        return LeaseType.MODIFIED

    return LeaseType.UNKNOWN
