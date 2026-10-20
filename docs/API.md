# Work Beacon Demo API

OpenAPI-ish surface for the Phase 2 tenant. Data is seed JSON, not the browser mock store.

```yaml
openapi: 3.0.3
info:
  title: Work Beacon Demo API
  version: 0.1.0
servers:
  - url: /
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
paths:
  /api/demo/workers:
    get:
      summary: List demo workers
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: Worker list
        "401":
          description: Invalid demo key
  /api/demo/events:
    get:
      summary: Seed process events
      responses:
        "200":
          description: hired / paid / approved / terminated
  /api/demo/time-off:
    get:
      summary: Seed leave requests
      responses:
        "200":
          description: Leave rows
```

Auth: `Authorization: Bearer wb_live_demo_northstar` (optional). Keys starting with `wb_live_` are accepted. Others 401.

Rate limit (copy only): 60 req/min/key — not enforced.
