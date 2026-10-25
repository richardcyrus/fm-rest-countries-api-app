---
status: accepted
---

# The server holds the country list; the browser never calls the API

The countries API requires a Bearer token, so all upstream calls are made by the server (TanStack Start server functions) and the token never reaches the browser. The server fetches the full country list once, caches it in-process (24-hour TTL, serving stale data if the API fails), and answers search, region filtering, paging, Region lists, and Border Country lookups from that cache. The upstream `?q=` and `region/{value}` endpoints are not used.

## Considered Options

- **Pass-through paging and filtering to the upstream API.** Rejected: every scroll and debounced keystroke would hit an upstream limit of 20 requests per 10 seconds plus a monthly quota, and Regions and Border Countries would still need a full-list fetch.
- **A shared cache (Vercel runtime cache or edge cache headers).** Deferred: an in-process cache is rebuilt on cold starts (about 3 upstream calls), which is acceptable at this traffic. Revisit if latency or quota becomes a problem.

## Consequences

- Search semantics (case-insensitive match on common name) are defined by this app, not by the upstream API.
- Country data can be up to 24 hours stale.
