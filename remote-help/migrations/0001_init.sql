-- Bytova Remote Help. Run against a dedicated new D1 database, never the RRUK D1 database.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY NOT NULL,
  customer_name TEXT NOT NULL CHECK(length(customer_name) BETWEEN 1 AND 90),
  email TEXT NOT NULL,
  service TEXT NOT NULL CHECK(service IN ('remote-tech-help','setup-getting-started','computer-care-safety-check')),
  summary TEXT NOT NULL,
  device TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','review','waiting_customer','approved','appointment_confirmed','reschedule_requested','ready','in_progress','escalated','no_show','completed','declined','cancelled','closed')),
  payment_status TEXT NOT NULL DEFAULT 'not_requested' CHECK(payment_status IN ('not_requested','awaiting_payment','paid','refunded','disputed')),
  amount_pence INTEGER NOT NULL CHECK(amount_pence IN (2500,3500,2900)),
  calendly_invitee_uri TEXT UNIQUE,
  appointment_at TEXT,
  stripe_session_id TEXT UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status,updated_at);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_payment ON tickets(payment_status);
CREATE TABLE IF NOT EXISTS ticket_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id TEXT NOT NULL,
  actor TEXT NOT NULL CHECK(actor IN ('customer','operator','stripe','calendly')),
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  external_event_id TEXT UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket ON ticket_events(ticket_id,id DESC);
CREATE TABLE IF NOT EXISTS webhook_receipts (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  ticket_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(provider,event_id),
  FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
