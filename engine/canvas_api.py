"""
Canvas LMS sync: active courses, syllabus text, upcoming assignments, optional calendar.

Credentials come from environment variables — never hardcode session cookies in source control.
"""

from __future__ import annotations

import os
from typing import Any

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# e.g. https://csueb.instructure.com (no trailing slash; /api/v1 is appended)
_DEFAULT_BASE = "https://csueb.instructure.com"


def _api_root() -> str:
    base = os.getenv("CANVAS_BASE_URL", _DEFAULT_BASE).rstrip("/")
    return f"{base}/api/v1"


def _session_headers() -> dict[str, str]:
    csrf = os.getenv("CANVAS_CSRF", "").strip()
    cookie = os.getenv("CANVAS_COOKIE", "").strip()
    if not csrf or not cookie:
        raise RuntimeError(
            "Set CANVAS_CSRF and CANVAS_COOKIE in .env (copy from browser devtools)."
        )
    return {
        "accept": "application/json",
        "x-csrf-token": csrf,
        "cookie": cookie,
        "user-agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
    }


def clean_html(raw_html: str | None) -> str:
    if not raw_html:
        return "No content."
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text(separator=" ", strip=True)


def sync_canvas() -> list[dict[str, Any]] | None:
    """
    Return one entry per course that has at least one future, unsubmitted assignment.

    Skips shell/orientation-style courses with no upcoming work.
    """
    root = _api_root()
    headers = _session_headers()

    res = requests.get(
        f"{root}/courses",
        params={"enrollment_state": "active"},
        headers=headers,
        timeout=60,
    )
    if res.status_code != 200:
        print(f"Auth failed ({res.status_code}). Refresh CANVAS_COOKIE / CANVAS_CSRF in .env.")
        return None

    courses = res.json()
    if not isinstance(courses, list):
        return None

    report: list[dict[str, Any]] = []

    for c in courses:
        if not isinstance(c, dict) or "name" not in c:
            continue
        c_id = c["id"]

        a_res = requests.get(
            f"{root}/courses/{c_id}/assignments",
            params={"bucket": "future"},
            headers=headers,
            timeout=60,
        )
        if a_res.status_code != 200:
            continue
        a_list = a_res.json()
        if not isinstance(a_list, list):
            continue

        upcoming_tasks: list[dict[str, str]] = []
        for a in a_list:
            if not isinstance(a, dict):
                continue
            if a.get("has_submitted_submissions"):
                continue
            due = a.get("due_at")
            if not due:
                continue
            name = a.get("name") or "Assignment"
            due_s = str(due).replace("T", " ").replace("Z", "")
            upcoming_tasks.append({"title": str(name), "due": due_s})

        if not upcoming_tasks:
            continue

        s_res = requests.get(
            f"{root}/courses/{c_id}",
            params={"include[]": "syllabus_body"},
            headers=headers,
            timeout=60,
        )
        syllabus = ""
        if s_res.status_code == 200 and isinstance(s_res.json(), dict):
            syllabus = clean_html(s_res.json().get("syllabus_body"))

        report.append(
            {
                "course": c["name"],
                "tasks": upcoming_tasks,
                "syllabus": syllabus,
            }
        )

    return report


def fetch_calendar_event_titles() -> list[str]:
    """Optional: titles from the user's Canvas calendar (all events)."""
    root = _api_root()
    headers = _session_headers()
    cal = requests.get(
        f"{root}/calendar_events",
        params={"type": "event", "all_events": "true"},
        headers=headers,
        timeout=60,
    )
    if cal.status_code != 200:
        return []
    data = cal.json()
    if not isinstance(data, list):
        return []
    return [str(e.get("title") or "") for e in data if isinstance(e, dict)]


if __name__ == "__main__":
    data = sync_canvas()
    if not data:
        raise SystemExit(1)

    for course in data:
        print(f"\n{course['course']}")
        for t in course["tasks"]:
            print(f"  DUE: {t['due']} | {t['title']}")
        syl = course.get("syllabus") or ""
        if len(syl) > 20:
            print(f"  Syllabus text: {len(syl)} chars")
        else:
            print("  No text-based syllabus in Canvas.")

    ev = fetch_calendar_event_titles()
    if ev:
        print(f"\nCalendar events: {len(ev)}")
