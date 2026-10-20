# EPIC-18 — Learning operations

**Goal:** Persist assigned learning, completions, certificates, and manager overdue — original Work Beacon, not a third-party LMS clone.  
**Gate:** Employee starts + completes a course (certificate issued); Manager assigns and sees overdue; agent answers assigned / overdue.

## Tickets

### T18-01 — Catalog + assignments in store
- [x] Courses and per-worker assignments persist in mock store
**Done when:** reload keeps progress.

### T18-02 — Employee start / complete
- [x] Start assigned → in progress; complete → 100%
**Done when:** buttons on `/dashboard/learning`.

### T18-03 — Certificates
- [x] Issue on complete; list on Learning
**Done when:** Security awareness completion writes a cert.

### T18-04 — Team learning (manager / HR)
- [x] Assign a catalog course + due date; overdue list
**Done when:** `/dashboard/learning/team` restricted.

### T18-05 — Compliance inbox
- [x] Completing Security awareness 2026 marks the matching inbox todo
**Done when:** inbox row closes.

### T18-06 — Home pin
- [x] Learning widget (open / overdue count)
**Done when:** pin list includes Learning.

### T18-07 — Agent tools
- [x] My learning, complete assigned training, overdue (manager)
**Done when:** ≥3 tools; chip when training is open.

### T18-08 — QA gate
- [x] Build + brand scan + browser paths
**Done when:** `docs/evidence/EPIC-18-qa.md`.
