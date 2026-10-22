#!/usr/bin/env python3
"""Reproduce Bytova's five printable security resources with ReportLab.

Run from any directory: python3 scripts/create-security-pdfs.py
Requires reportlab. Uses a system DejaVu Sans font, with built-in fallback.
These static, unfilled templates are deliberately not interactive AcroForms.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json

from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "security" / "downloads"
OUT.mkdir(parents=True, exist_ok=True)
NAVY = colors.HexColor("#0a1a5c")
CYAN = colors.HexColor("#00d4ff")
INK = colors.HexColor("#243250")
MUTED = colors.HexColor("#4c5677")
LINE = colors.HexColor("#cbd6e8")
SOFT = colors.HexColor("#edf4fd")
W, H = A4
M = 43
CW = W - 2 * M
DATE = "22 October 2026"
PHP = "https://www.php.net/archive/2026.php#2026-10-21-5"
NCSC = "https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php"

regular = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
bold = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if regular.exists() and bold.exists():
    pdfmetrics.registerFont(TTFont("Body", str(regular)))
    pdfmetrics.registerFont(TTFont("BodyBold", str(bold)))
    FONT, BOLD = "Body", "BodyBold"
else:
    FONT, BOLD = "Helvetica", "Helvetica-Bold"


class Sheet:
    def __init__(self, filename, title, total):
        self.c = canvas.Canvas(str(OUT / filename), pagesize=A4, pageCompression=1)
        self.c.setTitle(title + " | Bytova")
        self.c.setAuthor("Bytova - Leighton Liam Hepworth")
        self.c.setSubject("Independent educational security resource. Sources checked " + DATE)
        self.total = total
        self.page = 0

    def p(self, text, x, y, width=CW, size=9.3, leading=14.3, color=INK, bold=False):
        style = ParagraphStyle("p", fontName=BOLD if bold else FONT, fontSize=size,
                               leading=leading, textColor=color, spaceAfter=0)
        para = Paragraph(text, style)
        _, height = para.wrap(width, H)
        para.drawOn(self.c, x, y - height)
        return y - height

    def start(self, title, subtitle, label="PRINTABLE RESOURCE"):
        self.page += 1
        c = self.c
        c.setFillColor(NAVY)
        c.rect(0, H - 9, W, 9, fill=1, stroke=0)
        c.setFillColor(CYAN)
        c.rect(M, H - 46, 28, 3, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.setFont(BOLD, 7.3)
        c.drawString(M + 38, H - 45, "SECURITY RESPONSE / 2026")
        c.drawImage(str(ROOT / "assets" / "Bytova_Logo.png"), W - M - 138,
                    H - 105, width=138, height=92, preserveAspectRatio=True, mask="auto")
        self.p(label, M, H - 83, size=7.5, leading=11, color=MUTED, bold=True)
        title_end = self.p(title, M, H - 108, size=25, leading=30, color=NAVY, bold=True)
        subtitle_end = self.p(subtitle, M, title_end - 14, size=9.3, leading=14.2, color=MUTED)
        c.setStrokeColor(LINE)
        c.line(M, subtitle_end - 18, W - M, subtitle_end - 18)
        return subtitle_end - 37

    def footer(self, source="both"):
        c = self.c
        c.setStrokeColor(LINE)
        c.line(M, 76, W - M, 76)
        self.p("Independent educational guidance. No security guarantee or authority endorsement.", M, 67,
               size=6.8, leading=10, color=MUTED)
        names = []
        if source in {"php", "both"}:
            names.append('<link href="' + PHP + '">PHP official advisory (21 Oct 2026)</link>')
        if source in {"ncsc", "both"}:
            names.append('<link href="' + NCSC + '">UK NCSC guidance (21 Oct 2026)</link>')
        self.p("Sources: " + " | ".join(names), M, 54, size=6.6, leading=9.5, color=MUTED)
        self.p("Checked " + DATE + " | bytova.co.uk | Keep records in a protected location.", M, 41,
               size=6.6, leading=9.5, color=MUTED)
        c.setFont(BOLD, 7)
        c.setFillColor(NAVY)
        c.drawRightString(W - M, 26, f"{self.page} / {self.total}")
        c.showPage()

    def item(self, number, title, body, y):
        c = self.c
        c.setStrokeColor(colors.HexColor("#657696"))
        c.setLineWidth(.8)
        c.rect(M, y - 12, 11, 11, stroke=1, fill=0)
        x = M + 23
        self.p(f"{number:02d}  {escape(title)}", x, y + 1, width=CW - 23,
               size=10.1, leading=14.4, color=NAVY, bold=True)
        bottom = self.p(escape(body), x, y - 19, width=CW - 23, size=8.8, leading=13.1)
        return bottom - 20

    def note(self, title, body, y):
        style = ParagraphStyle("note", fontName=FONT, fontSize=8.6, leading=13, textColor=INK)
        para = Paragraph(escape(body), style)
        _, ph = para.wrap(CW - 30, H)
        height = ph + 50
        if y - height < 91:
            raise ValueError(f"Note overlaps footer: y={y:.1f}, height={height:.1f}")
        self.c.setFillColor(SOFT)
        self.c.roundRect(M, y - height, CW, height, 6, fill=1, stroke=0)
        self.c.setFillColor(colors.HexColor("#0086a3"))
        self.c.rect(M, y - height, 3, height, fill=1, stroke=0)
        self.p(escape(title), M + 15, y - 13, width=CW - 30, size=9, leading=13, bold=True, color=NAVY)
        para.drawOn(self.c, M + 15, y - 35 - ph)
        return y - height - 20

    def ruled(self, label, y, height=44, hint=None):
        self.p(escape(label), M, y, size=8.5, leading=12, color=NAVY, bold=True)
        top = y - 19
        self.c.setStrokeColor(LINE)
        self.c.rect(M, top - height, CW, height, fill=0, stroke=1)
        if hint:
            self.p(escape(hint), M + 10, top - 9, width=CW - 20, size=7.3, leading=11, color=MUTED)
        return top - height - 18

    def table(self, columns, widths, rows, y, rowheight=35):
        c = self.c
        headerheight = 31
        c.setFillColor(SOFT)
        c.rect(M, y - headerheight, CW, headerheight, fill=1, stroke=0)
        c.setStrokeColor(LINE)
        c.rect(M, y - headerheight - rows * rowheight, CW, headerheight + rows * rowheight, fill=0, stroke=1)
        x = M
        for label, width in zip(columns, widths):
            self.p(escape(label), x + 7, y - 7, width=width - 14, size=7.3, leading=10, bold=True, color=NAVY)
            x += width
            if x < W - M - 1:
                c.line(x, y, x, y - headerheight - rows * rowheight)
        for i in range(rows + 1):
            yy = y - headerheight - i * rowheight
            c.line(M, yy, W - M, yy)
        return y - headerheight - rows * rowheight - 22

    def save(self):
        if self.page != self.total:
            raise ValueError(f"Unexpected page count: {self.page} != {self.total}")
        self.c.save()


patch = Sheet("php-patch-checklist.pdf", "PHP administrator patch checklist", 2)
y = patch.start("PHP administrator<br/>patch checklist", "A controlled update, from inventory to a verified running service. Tick only when completed in your authorised process.", "PATCHING / 01 OF 02")
for n, title, body in [
    (1, "Inventory the actual runtime", "Identify every web PHP handler, pool, container, replica and bundled application. CLI PHP can differ from the website. Use authenticated hosting or application health information; do not publish phpinfo()."),
    (2, "Record the source and permission", "Record the OS release, package source, full package revision, service owner and change approver. Agree the scope, maintenance window and recovery route before changing anything."),
    (3, "Verify both advisory records", "Assess CVE-2026-109618 and CVE-2026-109619 using PHP and your vendor. A distribution may backport fixes without adopting the upstream version number. Retain the exact source and evidence."),
    (4, "Back up and prove restore", "Protect application files, databases and configuration. Keep a separate protected backup and test a restore in isolation. A recent backup is not automatically trusted if compromise is suspected."),
    (5, "Test in staging", "Check PHP and extension compatibility, login, forms, uploads and key business flows in a representative isolated environment. Disable real payments, email delivery and external actions during testing."),
]:
    y = patch.item(n, title, body, y)
y = patch.note("If compromise is suspected", "Pause the routine patch process and involve your host and a qualified incident responder. Agree containment and preserve evidence before cleanup or restoration.", y)
patch.footer()
y = patch.start("Apply the fix.<br/>Verify the result.", "Installed files and a version label are not enough. Confirm what is running, then record the evidence.", "PATCHING / 02 OF 02")
for n, title, body in [
    (6, "Apply an approved vendor update", "Use the established signed vendor package channel or the authorised hosting control panel. Review intended changes and vendor instructions for your exact platform. Avoid untrusted one-line update commands."),
    (7, "Replace every affected worker", "Follow the vendor restart or reload procedure. Verify that old PHP workers are gone across Apache/mod_php, PHP-FPM pools, Windows application pools, containers and replicas as applicable."),
    (8, "Validate version and service", "Recheck the running web PHP and full package revision. Test login, forms, uploads, background jobs and essential business functions. Exercise checkout only in a test environment. Record outcomes and errors."),
    (9, "Review the exposure window", "Preserve and examine web, PHP, authentication, deployment and application logs. Investigate unexpected accounts, file changes, scheduled tasks, outbound connections or repeated crashes. Quiet logs do not rule out compromise."),
    (10, "Document, monitor and close", "Record approval, package evidence, restart time, validation, remaining risks and the next review. If rollback would restore vulnerable PHP, keep the affected service restricted or offline pending an approved safe alternative."),
]:
    y = patch.item(n, title, body, y)
y = patch.note("Verified upstream fixes on 22 October 2026", "PHP 8.2.35, 8.3.36, 8.4.27 and 8.5.12 contain the fixes for both advisories. This is a dated record, not a list of all later releases. Check exact vendor backports separately. A version result is not proof of security or compromise.", y)
patch.footer()
patch.save()

incident = Sheet("incident-response-checklist.pdf", "Security incident response checklist", 2)
y = incident.start("Incident response<br/>checklist", "Use when there are signs of unauthorised access, suspicious changes or possible data exposure. Involve a qualified responder.", "INCIDENT TRIAGE / 01 OF 02")
for n, title, body in [
    (1, "Nominate a lead and safe contact route", "Record the decision maker, hosting contact and qualified responder. Use a trusted device and communication route if current accounts or systems may be compromised. Do not rely on a suspected account for incident coordination."),
    (2, "Record what was actually observed", "Capture the time and time zone, system, observer and original alert. Separate confirmed observations from assumptions. Do not claim a specific CVE caused the incident without evidence."),
    (3, "Agree immediate containment", "Work with the owner, host and responder to restrict access, isolate affected services or take them offline where necessary. Balance urgent harm reduction with evidence preservation; record approval and business impact."),
    (4, "Preserve original evidence", "Protect relevant logs, authorised snapshots, configuration and alerts. Record collection time, method, custodian and integrity information. Do not run cleanup tools, delete suspicious files or overwrite evidence before advice."),
    (5, "Assess the scope", "Identify affected accounts, sites, databases, secrets, integrations and related systems. Establish the possible exposure window and known gaps. Check for unauthorised persistence and activity beyond the visible website."),
]:
    y = incident.item(n, title, body, y)
y = incident.note("Routine support has limits", "Bytova's everyday computer-support appointments exclude active incidents and forensic investigation. A PHP update alone does not remove an existing backdoor, restore data integrity or prove that compromise did not occur.", y)
incident.footer("ncsc")
y = incident.start("Investigate. Recover.<br/>Keep a decision record.", "The response lead and qualified adviser should agree each consequential action. Preserve both evidence and uncertainty.", "INCIDENT RESPONSE / 02 OF 02")
for n, title, body in [
    (6, "Investigate with controlled access", "Correlate web, PHP, authentication, deployment and application evidence. Investigate new administrators, unexplained files or jobs and unexpected outbound traffic. Retain original records and avoid publishing customer evidence."),
    (7, "Plan a trusted recovery", "Determine the likely entry point and persistence. Agree whether to rebuild from a trusted baseline or restore an independently assessed clean backup. Patch the relevant runtime, application and dependencies before reconnecting."),
    (8, "Rotate exposed access safely", "After containment, use a trusted device to rotate affected credentials, tokens and application secrets with the responsible owners. Review dependent services and revoke unnecessary access; preserve relevant access evidence first."),
    (9, "Validate before return to service", "Confirm the fixed running runtime and replaced workers. Check data integrity, essential functionality and working logs. Restore access in stages with a named owner and a clear route back to containment if needed."),
    (10, "Communicate, review and follow up", "Use approved factual messages. Record reporting or notification decisions with the responsible professional adviser. Track unresolved risks and monitoring, then review causes, recovery lessons and any changes to access or backups."),
]:
    y = incident.item(n, title, body, y)
y = incident.note("What this checklist cannot decide", "It cannot determine legal notification obligations, establish attribution or certify a clean system. An absence of obvious indicators is not proof that no compromise occurred. Obtain appropriate incident, legal and privacy advice for your circumstances.", y)
incident.footer("ncsc")
incident.save()

recovery = Sheet("website-recovery-checklist.pdf", "Website recovery checklist", 2)
y = recovery.start("Website recovery<br/>checklist", "Return to service from a trusted state, with the host and responder where compromise is suspected.", "RECOVERY PREPARATION / 01 OF 02")
for n, title, body in [
    (1, "Preserve the incident record first", "Keep authorised evidence copies, relevant logs and the decision history before overwriting a server. Maintain custody and integrity records. Coordinate evidence needs with containment and business continuity priorities."),
    (2, "Identify what must be restored", "List the application, database, uploads, configuration, accounts, integrations and scheduled jobs. Identify essential functions, dependencies and owners. Record the acceptable recovery point and outage impact."),
    (3, "Choose a trusted source", "Assess backup age, integrity and signs of compromise. Do not assume a snapshot made during the exposure window is clean. Use known-good release artifacts and trusted installation media where appropriate."),
    (4, "Recover into isolation", "Rebuild or restore in a controlled environment with restricted access. Disable outgoing email, live payments, automated integrations and public traffic until approved checks pass. Retain the original incident environment as agreed."),
    (5, "Close the entry point", "Apply the vendor fix to PHP and review the affected application and dependencies. Check the relevant full package revision, configuration and every worker, pool, container and replica. Remove unauthorised persistence through an approved recovery process."),
]:
    y = recovery.item(n, title, body, y)
y = recovery.note("Avoid a false finish", "A fresh-looking homepage and a fixed PHP label do not establish a trusted system. Recovery needs evidence about the runtime, data, accounts, persistence and business functions, plus a documented decision to reconnect.", y)
recovery.footer()
y = recovery.start("Validate the service.<br/>Reconnect deliberately.", "Record the evidence for each check and the owner of any outstanding risk. Do not silently return to a vulnerable runtime.", "RECOVERY VALIDATION / 02 OF 02")
for n, title, body in [
    (6, "Review accounts and secrets", "From a trusted device, rotate affected credentials and application secrets after containment, and revoke unnecessary access. Confirm administrators and integration permissions with their owners. Plan dependent changes to avoid accidental outages."),
    (7, "Validate data and functionality", "Check critical data integrity, permissions, login, forms, uploads, scheduled tasks and administration. Test the intended customer journeys. Use sandbox payment and message systems for tests, then reconcile any manual requests."),
    (8, "Confirm visibility and monitoring", "Ensure relevant logs are retained and accessible to the approved people. Establish a baseline for expected processes, accounts and network activity. Assign a monitoring owner and an escalation route for anomalies."),
    (9, "Authorise a staged return", "Record who approved reconnection, the evidence reviewed and remaining limitations. Restore public access gradually where feasible. Keep the incident lead and host available for the agreed monitoring period."),
    (10, "Retain a safe recovery route", "If the new deployment fails, use an agreed alternative that does not expose vulnerable PHP again. Keep a restricted or offline state if needed. Preserve the final record, follow-up actions and lessons for the next recovery exercise."),
]:
    y = recovery.item(n, title, body, y)
y = recovery.note("Recovery sign-off", "Record the restored release and data point, verified package, worker replacement time, test outcomes, approver, unresolved risks and next review. A qualified responder should assess suspected compromise; these templates do not certify clearance.", y)
recovery.footer()
recovery.save()

continuity = Sheet("business-continuity-guide.pdf", "Website business continuity guide", 1)
y = continuity.start("Keep essential<br/>work moving.", "A small-business continuity guide for a website outage or security incident. Coordinate with the incident lead and service owners.", "BUSINESS CONTINUITY / 01 OF 01")
for n, title, body in [
    (1, "Agree the priorities", "Identify the essential customer and internal work that must continue. Name a decision maker and deputy. Record what can safely pause, the impact of delay and the dependencies that need attention first."),
    (2, "Use a trusted communication route", "Keep a protected offline copy of host, staff and professional-adviser contacts. If existing accounts may be compromised, coordinate from a trusted device and channel. Share only information necessary for each role."),
    (3, "Publish a factual status message", "Use an approved channel that is safe to operate. Explain known service impact, a practical contact route and the next update time. Do not speculate about causes, invent restoration times or expose incident details."),
    (4, "Control temporary workarounds", "Use a protected manual request queue with an owner and clear access. Collect only necessary information. Pause automated workflows that could duplicate orders, send incorrect messages or disclose data."),
    (5, "Prepare the hand-back", "Agree a trusted recovery source, acceptance checks and the authority to reconnect. Reconcile manual records, messages, payments and queued jobs before restarting automation. Retain evidence needed by the incident process."),
    (6, "Review what the outage taught you", "Record the decisions, loss of service and unresolved risks. Test restore procedures and contact lists. Improve the recovery plan around real observations rather than claiming that a single patch prevents every future incident."),
]:
    y = continuity.item(n, title, body, y)
y = continuity.note("Keep safety and evidence together", "If compromise is suspected, involve your host and a qualified responder. Business continuity work should not erase evidence, reconnect an untrusted server or bypass agreed access controls.", y)
continuity.footer("ncsc")
continuity.save()

record = Sheet("security-incident-record.pdf", "Security incident recording template", 2)
y = record.start("Security incident<br/>record", "Printable blank template. Keep in a protected case folder. Record observations separately from interpretation; exclude passwords and unnecessary personal data.", "CASE RECORD / 01 OF 02")
y = record.ruled("Case ID / incident lead / contact route", y, 30)
y = record.ruled("Affected service / owner / hosting environment", y, 30)
y = record.ruled("First observed: date, time and time zone / observer / alert source", y, 30)
y = record.ruled("Confirmed observations and evidence references", y, 66, "What was directly seen? Where is the original evidence retained?")
y = record.ruled("Hypotheses, unknowns and scope gaps", y, 52, "What is suspected, and what still needs to be verified?")
y = record.ruled("Immediate containment / authorisation / business impact", y, 52, "Who approved the action, when, and what effect did it have?")
if y < 89:
    raise ValueError("Incident record page 1 overlaps footer")
record.footer("ncsc")
y = record.start("Evidence, decisions<br/>and follow-up", "Continue with the same case ID. Retain original evidence; use protected references rather than copying sensitive material into this form.", "CASE RECORD / 02 OF 02")
y = record.ruled("Case ID / person completing this page / date and time zone", y, 31)
record.p("Evidence custody record", M, y, size=9, leading=13, bold=True, color=NAVY)
y = record.table(["Evidence reference / integrity", "Collected: time + zone / method", "Custodian / access or transfer"], [CW*.35, CW*.34, CW*.31], 2, y-20, 29)
record.p("Action and decision log", M, y, size=9, leading=13, bold=True, color=NAVY)
y = record.table(["Time + zone / action", "Authoriser / rationale / evidence", "Result / uncertainty / owner"], [CW*.31, CW*.39, CW*.30], 2, y-20, 29)
y = record.ruled("Recovery validation / reporting decision references / approver", y, 44)
y = record.ruled("Outstanding actions / owner / due date / next review", y, 44)
if y < 89:
    raise ValueError("Incident record page 2 overlaps footer")
record.footer("ncsc")
record.save()

template = {
    "template_version": 1,
    "title": "Security incident record",
    "template_reviewed": "2026-10-22",
    "privacy_note": "Keep in a protected case folder. Do not include passwords or unnecessary personal data. Separate observations from hypotheses.",
    "case_id": "",
    "incident_lead": "",
    "trusted_contact_route": "",
    "affected_services": [],
    "service_owner": "",
    "hosting_environment": "",
    "first_observed_at_with_timezone": "",
    "observer": "",
    "alert_source": "",
    "confirmed_observations": [],
    "hypotheses": [],
    "unknowns_and_scope_gaps": [],
    "evidence_custody": [{"evidence_reference": "", "original_location": "", "collected_at_with_timezone": "", "collection_method": "", "integrity_record": "", "custodian": "", "access_or_transfer_record": ""}],
    "actions_and_decisions": [{"at_with_timezone": "", "action": "", "authorised_by": "", "rationale": "", "evidence_references": [], "business_impact": "", "result": "", "remaining_uncertainty": ""}],
    "recovery_validation": [],
    "reporting_and_notification_decision_references": [],
    "return_to_service_approver": "",
    "outstanding_actions": [{"action": "", "owner": "", "due_date": "", "status": ""}],
    "next_review_at_with_timezone": "",
    "limitations": "This template does not establish attribution, security clearance or legal notification obligations. Involve appropriate qualified advisers for suspected compromise.",
}
(OUT / "incident-record-template.json").write_text(json.dumps(template, indent=2) + "\n", encoding="utf-8")
print(f"Created five PDFs and incident-record-template.json in {OUT}")
