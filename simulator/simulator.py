"""
CampusPulse event simulator
============================

Pretends to be the sensors and service requests on NorthBridge University's
campus. There are no real sensors, so this script invents events and either
prints them (so you can see it works) or sends them to your API once it exists.

HOW TO USE
----------
1. Right now, before the API exists:
     - leave SEND_TO_API = False below
     - run:  python simulator.py
     - you'll see fake events printed to the screen every 2 seconds

2. Once your API is built and you have its URL:
     - set SEND_TO_API = True
     - paste the URL into API_URL
     - paste your API key into API_KEY
     - run it again; now the same events get POSTed to your API

Press Ctrl+C to stop it at any time.

This script only needs the 'requests' library, and only when actually sending.
Install it once with:  pip install requests
"""

import json
import random
import time
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# SETTINGS  -- the only lines you normally change
# ---------------------------------------------------------------------------

# False = print events to the screen. True = send them to your API.
SEND_TO_API = False

# Your API's POST /events URL. You won't have this until the API is built.
# Example once it exists: "https://abc123.execute-api.us-east-1.amazonaws.com/events"
API_URL = "PASTE_YOUR_API_URL_HERE"

# The secret key the API checks to know the sensor is allowed. Placeholder for now.
API_KEY = "PASTE_YOUR_API_KEY_HERE"

# How many seconds to wait between events. 2 is a good default.
SECONDS_BETWEEN_EVENTS = 2


# ---------------------------------------------------------------------------
# THE CAMPUS  -- the fixed list of buildings and rooms, matching the schema
# ---------------------------------------------------------------------------

BUILDINGS = ["Library-A", "Science-B", "Engineering-C", "Admin-D", "Sports-E"]

# A few rooms per building for occupancy and environment events.
ROOMS = ["101", "102", "203", "A203", "C110", "D004", "Lab-1", "Hall-2"]

# Realistic-sounding maintenance requests.
REQUEST_MESSAGES = [
    "Projector not powering on, class at 14:00",
    "Air conditioning not working in the room",
    "Broken chair needs replacing",
    "Water leak under the sink",
    "Fire alarm going off, possible emergency",
    "Wifi down in the whole wing",
    "Light flickering, needs a new bulb",
]


# ---------------------------------------------------------------------------
# EVENT MAKERS  -- one small function per event type
# ---------------------------------------------------------------------------

def new_event_id():
    """Make a unique id like evt-2026-000042 using a random 6-digit number."""
    return f"evt-2026-{random.randint(0, 999999):06d}"


def now_timestamp():
    """The current time in the exact format the schema wants (UTC, ending Z)."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_occupancy_event():
    """How many people are in a room right now."""
    return {
        "event_id": new_event_id(),
        "building": random.choice(BUILDINGS),
        "room": random.choice(ROOMS),
        "event_type": "occupancy",
        "value": random.randint(0, 120),   # people
        "unit": "people",
        "timestamp": now_timestamp(),
    }


def make_energy_event():
    """How much power a building is drawing. Room is '-' for a whole-building meter."""
    return {
        "event_id": new_event_id(),
        "building": random.choice(BUILDINGS),
        "room": "-",
        "event_type": "energy",
        "value": round(random.uniform(20, 400), 1),   # kWh
        "unit": "kWh",
        "timestamp": now_timestamp(),
    }


def make_environment_event():
    """A temperature or humidity reading from a room sensor."""
    # Randomly pick which kind of reading this sensor is sending.
    if random.random() < 0.5:
        value = round(random.uniform(12, 34), 1)
        unit = "celsius"
    else:
        value = round(random.uniform(15, 85), 1)
        unit = "percent"
    return {
        "event_id": new_event_id(),
        "building": random.choice(BUILDINGS),
        "room": random.choice(ROOMS),
        "event_type": "environment",
        "value": value,
        "unit": unit,
        "timestamp": now_timestamp(),
    }


def make_request_event():
    """A student or staff maintenance request. No value or unit; carries a description."""
    return {
        "event_id": new_event_id(),
        "building": random.choice(BUILDINGS),
        "room": random.choice(ROOMS),
        "event_type": "request",
        "description": random.choice(REQUEST_MESSAGES),
        "reported_by": f"student-{random.randint(1000, 9999)}",
        "timestamp": now_timestamp(),
    }


# A list of the four makers so we can pick one at random each loop.
EVENT_MAKERS = [
    make_occupancy_event,
    make_energy_event,
    make_environment_event,
    make_request_event,
]


# ---------------------------------------------------------------------------
# SENDING  -- either print, or POST to the API
# ---------------------------------------------------------------------------

def send_event(event):
    """Print the event, and also send it to the API if SEND_TO_API is on."""
    # Always show it on screen so you can watch what's happening.
    print(json.dumps(event))

    if not SEND_TO_API:
        return

    # Only import requests when we actually need it, so print mode needs nothing.
    import requests

    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,   # the secret the API checks
    }
    try:
        response = requests.post(API_URL, json=event, headers=headers, timeout=5)
        print(f"   -> sent, API replied {response.status_code}")
    except Exception as error:
        # Don't crash the whole simulator just because one send failed.
        print(f"   -> send failed: {error}")


# ---------------------------------------------------------------------------
# MAIN LOOP  -- runs forever until you press Ctrl+C
# ---------------------------------------------------------------------------

def main():
    mode = "SENDING to API" if SEND_TO_API else "PRINTING only"
    print(f"CampusPulse simulator starting -- {mode}")
    print("Press Ctrl+C to stop.\n")

    try:
        while True:
            make_event = random.choice(EVENT_MAKERS)   # pick a random event type
            event = make_event()                        # build one event
            send_event(event)                           # print and/or send it
            time.sleep(SECONDS_BETWEEN_EVENTS)          # wait, then do it again
    except KeyboardInterrupt:
        print("\nSimulator stopped.")


if __name__ == "__main__":
    main()