import re
from models import LeaseType


US_STATES = {
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
    "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
    "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
    "WI","WY"
}

STATE_NAME_TO_CODE = {
    "alabama": "AL","alaska": "AK","arizona": "AZ","arkansas": "AR",
    "california": "CA","colorado": "CO","connecticut": "CT","delaware": "DE",
    "florida": "FL","georgia": "GA","hawaii": "HI","idaho": "ID",
    "illinois": "IL","indiana": "IN","iowa": "IA","kansas": "KS",
    "kentucky": "KY","louisiana": "LA","maine": "ME","maryland": "MD",
    "massachusetts": "MA","michigan": "MI","minnesota": "MN","mississippi": "MS",
    "missouri": "MO","montana": "MT","nebraska": "NE","nevada": "NV",
    "new hampshire": "NH","new jersey": "NJ","new mexico": "NM","new york": "NY",
    "north carolina": "NC","north dakota": "ND","ohio": "OH","oklahoma": "OK",
    "oregon": "OR","pennsylvania": "PA","rhode island": "RI","south carolina": "SC",
    "south dakota": "SD","tennessee": "TN","texas": "TX","utah": "UT",
    "vermont": "VT","virginia": "VA","washington": "WA","west virginia": "WV",
    "wisconsin": "WI","wyoming": "WY"
}



def is_zip(token: str):
    return bool(re.fullmatch(r"\d{5}", token))


def detect_state(token: str):
    t = token.lower()

    if t.upper() in US_STATES:
        return t.upper()

    if t in STATE_NAME_TO_CODE:
        return STATE_NAME_TO_CODE[t]

    return None


def canonicalize_name(name: str):
    if not name:
        return "unknown"

    name = name.lower()
    name = re.sub(r"(llc|inc|ltd)", "", name)
    name = re.sub(r"[^a-z0-9 ]", "", name)
    return name.strip() or "unknown"


def parse_address(addr: str):
    if not addr or not addr.strip():
        raise ValueError("empty address")

    addr = addr.strip()

    if "," in addr:
        parts = [p.strip() for p in addr.split(",")]

        if len(parts) >= 3:
            street = parts[0]
            city = parts[1]

            tokens = parts[2].split()

            state = ""
            zip_code = ""

            for t in tokens:
                s = detect_state(t)
                if s:
                    state = s
                elif is_zip(t):
                    zip_code = t

            return street, city, state, zip_code

    tokens = addr.split()

    state = ""
    zip_code = ""

    for t in tokens[-3:]:
        s = detect_state(t)
        if s:
            state = s
        elif is_zip(t):
            zip_code = t

    core = [t for t in tokens if t not in [state, zip_code]]

    if len(core) >= 2:
        city = core[-1]
        street = " ".join(core[:-1])
        return street, city, state, zip_code

    raise ValueError("invalid address format")


def normalize_size(size):
    try:
        if isinstance(size, int):
            return size

        size = str(size).lower()
        size = size.replace("sf", "").replace("sqft", "")
        size = re.sub(r"[^0-9]", "", size)

        val = int(size)

        if val <= 0:
            raise ValueError

        return val

    except Exception:
        raise ValueError("invalid size")


def normalize_rent(rent, size):
    try:
        rent = str(rent).lower()

        if rent in ["not provided", "notprovided", "", "na", "none"]:
            raise ValueError("rent not provided")

        rent = rent.replace("$", "")
        rent = rent.replace(" ", "")

        if "/sf" in rent:
            return float(rent.replace("/sf", ""))

        if "/mo" in rent:
            monthly = float(rent.replace("/mo", ""))

            if size <= 0:
                raise ValueError("size must be > 0")

            return round((monthly * 12) / size, 2)

        return float(rent)

    except Exception:
        raise ValueError(f"invalid rent format: {rent}")


def normalize_lease(t):
    if not t:
        return LeaseType.UNKNOWN

    t = str(t).lower().strip()

    if t in ["nnn", "triple net"]:
        return LeaseType.NNN

    if t in ["gross", "gross lease"]:
        return LeaseType.GROSS

    if t in ["modified", "modified gross", "mod gross"]:
        return LeaseType.MODIFIED

    return LeaseType.UNKNOWN
