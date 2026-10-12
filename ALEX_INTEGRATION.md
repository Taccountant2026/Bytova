# Alex — private Bytova operations integration

Alex currently runs on a Windows PC at `C:\Bytova-AI\Alex`, using local Ollama (`http://127.0.0.1:11434`) with model `qwen3:4b`. The local address is **not accessible** to a public website. Do not expose Ollama, SQLite, Alex's dashboard or the Windows computer to the internet.

## Safe rollout
1. Keep the public static website independent of Alex. Never place tokens, customer personal data, local IPs or credentials in GitHub Pages source.
2. Create a separate authenticated server-side enquiry endpoint (hosting and authentication to be chosen). Validate input, add bot/rate-limit protection, obtain required privacy disclosures and apply data retention rules.
3. The private endpoint should queue **minimum necessary** enquiry data, then Alex's Windows agent can poll the queue over outbound HTTPS using short-lived credentials. Alex may classify enquiries, draft replies and create tasks; no autonomous customer messages, refunds, payment changes or remote access without explicit owner approval.
4. Persist idempotency keys and processing status in the private backend to prevent duplicate tasks. Log only redacted operational events.
5. Test offline recovery, retry behaviour, malformed inputs, prompt injection, rate limits and approval gates before connecting production enquiries.

## Proposed event contract (not active)
```json
{"schema_version":1,"event_id":"uuid","type":"customer.enquiry.created","created_at":"ISO-8601","payload":{"service":"remote-help","message":"sanitised text","contact_reference":"opaque-server-side-id"}}
```

## Current state
This is an integration design only. No network connection or access to Alex's local installation has been established, and the website currently collects no enquiries.
