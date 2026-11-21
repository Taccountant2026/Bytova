export default [
  {
    "slug": "cyber-essentials-five-controls",
    "title": "Understand the five Cyber Essentials technical controls",
    "category": "Cyber Essentials & Skills",
    "summary": "A starting point for improving an organisation's basic technical defences.",
    "sections": [
      [
        "What the scheme covers",
        "Cyber Essentials is a UK government-backed scheme with independently managed certification. It tests a defined baseline of technical controls; it is not a guarantee that an organisation will never experience an incident."
      ],
      [
        "Know the five areas",
        "The principal control families are firewalls, secure configuration, security update management, user access control and malware protection. Work through all five against the current assessment requirements, rather than focusing only on antivirus."
      ],
      [
        "Check the real scope",
        "Document business devices, internet-connected cloud services and relevant home-working or remote access arrangements according to the scheme's current scoping rules. Removing a device from a list does not necessarily remove it from scope."
      ],
      [
        "Prepare before paying",
        "Review unsupported operating systems, admin access, multifactor authentication, patching and remote desktop exposure first. Keep notes and evidence, then use the current IASME readiness tools before starting paid certification."
      ]
    ],
    "actions": [
      "Read the current official requirements.",
      "List every in-scope device and service.",
      "Fix obvious gaps before purchasing assessment."
    ],
    "refs": [
      "ce",
      "cyber"
    ]
  },
  {
    "slug": "cyber-essentials-firewall-check",
    "title": "Check firewall controls before Cyber Essentials assessment",
    "category": "Cyber Essentials & Skills",
    "summary": "Review device firewalls, boundary controls and internet-facing services.",
    "sections": [
      [
        "Identify the boundaries",
        "Map how business devices reach the internet, including homeworking networks and cloud services. A router firewall does not necessarily protect a laptop when used on another network."
      ],
      [
        "Keep protection enabled",
        "Use supported host firewalls and network controls appropriate to the system. Review administrative access and unnecessary inbound rules; do not turn off protection merely because a service is inconvenient to configure."
      ],
      [
        "Document approved exposure",
        "Record why any inbound service is needed, who owns it and how access is restricted. Remote administration and exposed management pages should be reviewed against the current Cyber Essentials requirements."
      ],
      [
        "Test safely after changes",
        "Verify legitimate business services still function after rule changes. Use only authorised tests on systems you own or have explicit permission to assess, and preserve a rollback plan."
      ]
    ],
    "actions": [
      "List incoming access rules.",
      "Remove unneeded exposed services.",
      "Verify firewalls stay enabled on mobile devices."
    ],
    "refs": [
      "ce",
      "small"
    ]
  },
  {
    "slug": "cyber-essentials-update-management",
    "title": "Plan security updates for Cyber Essentials",
    "category": "Cyber Essentials & Skills",
    "summary": "Make updates measurable across devices, apps and firmware.",
    "sections": [
      [
        "Know what is supported",
        "Record operating system versions, applications and firmware in scope. Unsupported products can create certification problems and operational risks even if they seem to work correctly."
      ],
      [
        "Prioritise security fixes",
        "Use current Cyber Essentials requirements to determine the required timescale for high-risk updates, including the 14-day rule where it applies. Check the actual severity and deployment status instead of relying on marketing messages."
      ],
      [
        "Use approved update channels",
        "Install operating system and application patches from the vendor or trusted management tools. Test compatibility when necessary without leaving required security fixes indefinitely postponed."
      ],
      [
        "Keep a simple record",
        "For important systems, note the version, update date, owner, exceptions and reason for any delay. Remove products that can no longer be updated or replace them with supported alternatives."
      ]
    ],
    "actions": [
      "Inventory software and support status.",
      "Enable automatic security updates.",
      "Track overdue security fixes."
    ],
    "refs": [
      "ce",
      "devices"
    ]
  },
  {
    "slug": "cyber-essentials-malware-protection",
    "title": "Choose and maintain appropriate malware protection",
    "category": "Cyber Essentials & Skills",
    "summary": "Understand the role of antivirus, application allowlisting and safe software sources.",
    "sections": [
      [
        "Use supported protection",
        "Install or enable the protection appropriate to your platform and the current assessment rules. On many modern systems, built-in controls can provide useful protection when enabled and kept updated."
      ],
      [
        "Avoid competing security tools",
        "Multiple real-time antivirus products can interfere with one another. Review the vendor's guidance rather than stacking tools in an attempt to maximise protection."
      ],
      [
        "Reduce what users can install",
        "Limit administrator access and prefer trusted app distribution channels. Consider application allowlisting where suitable, particularly on shared or specialist devices."
      ],
      [
        "Keep people involved",
        "Protection software cannot reliably stop every malicious document, compromised website or mistaken approval. Teach users to report unusual behaviour and keep tested backups."
      ]
    ],
    "actions": [
      "Check protection status on each device.",
      "Remove unsupported or conflicting software.",
      "Use trusted sources for installing applications."
    ],
    "refs": [
      "ce",
      "devices"
    ]
  },
  {
    "slug": "secure-remote-it-support",
    "title": "Choose a safe remote IT support session",
    "category": "Cyber Essentials & Skills",
    "summary": "Know who is connecting to your device and what they are allowed to do.",
    "sections": [
      [
        "Confirm who is providing help",
        "Arrange support through a provider's genuine website or an existing trusted relationship. An unexpected telephone call asking to access your device is a warning sign, even if the caller knows your name."
      ],
      [
        "Know the session purpose",
        "Agree which task will be attempted and whether files, settings or payment information could be involved. Never reveal banking passwords, recovery codes or one-time sign-in codes to the supporter."
      ],
      [
        "Stay in control",
        "Only launch a remote support tool you were expecting, review any consent prompts and remain present where practical. End the connection if the activity differs from the agreed work."
      ],
      [
        "Close access afterwards",
        "Confirm the remote session has ended and check whether the software permits unattended access. Remove temporary tools or permissions no longer required and retain a record of changes made."
      ]
    ],
    "actions": [
      "Verify the support provider independently.",
      "Agree the exact scope before connecting.",
      "Confirm unattended access is disabled afterwards."
    ],
    "refs": [
      "small",
      "accounts"
    ]
  },
  {
    "slug": "safe-public-wifi",
    "title": "Use public Wi-Fi more safely",
    "category": "Cyber Essentials & Skills",
    "summary": "Protect accounts when using a cafe, hotel or shared wireless network.",
    "sections": [
      [
        "Confirm the real network",
        "Ask the venue for its network name rather than connecting to a similarly named hotspot. Fake access points and captive portals can imitate a venue's sign-in page."
      ],
      [
        "Prefer encrypted services",
        "Use HTTPS and legitimate apps, keep your device firewall active and avoid disabling certificate warnings. A VPN can add privacy in some circumstances but cannot make a fake login page trustworthy."
      ],
      [
        "Protect high-value activity",
        "Consider using your mobile data connection for sensitive administration or payments. Keep sharing and network discovery disabled on public connections where appropriate."
      ],
      [
        "Disconnect when finished",
        "Forget networks you no longer use and disable automatic joining of unfamiliar hotspots. Review unexpected sign-in prompts that arrive after you have used shared connections."
      ]
    ],
    "actions": [
      "Confirm the venue's network name.",
      "Avoid ignoring browser certificate warnings.",
      "Use mobile data for sensitive work when practical."
    ],
    "refs": [
      "devices",
      "accounts"
    ]
  },
  {
    "slug": "download-software-safely",
    "title": "Download and install software without inviting malware",
    "category": "Cyber Essentials & Skills",
    "summary": "Recognise risky installers and protect your everyday computer.",
    "sections": [
      [
        "Prefer the genuine source",
        "Install through the device's official app store or a known vendor's website. Sponsored search results and download mirrors may look official while offering unwanted or modified installers."
      ],
      [
        "Check publisher and permissions",
        "Read what the application does, who publishes it and which files or device permissions it requests. A simple document reader generally should not require remote-control access or administrator privileges."
      ],
      [
        "Avoid cracks and unknown scripts",
        "Pirated installers and random 'fix commands' can hide malware or tamper with system settings. Use supported software and documented troubleshooting instead of copying an unreviewed command."
      ],
      [
        "Keep installations maintainable",
        "Turn on official updates, remove unused apps and record licences for business use. If an installer fails or warns about security controls, investigate rather than temporarily disabling protection."
      ]
    ],
    "actions": [
      "Download from the vendor or app store.",
      "Review requested permissions.",
      "Remove apps you no longer use."
    ],
    "refs": [
      "devices",
      "cyber"
    ]
  },
  {
    "slug": "spot-ai-generated-scams",
    "title": "Recognise AI-assisted impersonation and voice scams",
    "category": "Cyber Essentials & Skills",
    "summary": "Use independent verification rather than trusting a convincing voice or video.",
    "sections": [
      [
        "Do not rely on appearances",
        "Artificially generated voices, images and messages can imitate colleagues, family members or well-known organisations. A polished message or a familiar voice is not reliable evidence of identity."
      ],
      [
        "Establish a second channel",
        "When a request involves money, credentials or sensitive data, call the person using a previously verified number or open the organisation's own account portal. Do not use contact details introduced in the suspicious message."
      ],
      [
        "Agree a payment process",
        "Small businesses and charities can require two-person approval or independent verification for changes to bank accounts and urgent transfers. The procedure matters more than detecting artificial media perfectly."
      ],
      [
        "Preserve and report attempts",
        "Save suspicious communications without sharing private recordings widely. Report impersonation through the relevant platform and notify your bank promptly if funds were transferred."
      ]
    ],
    "actions": [
      "Verify urgent requests through another channel.",
      "Use two-person approval for unusual payments.",
      "Do not trust voice or video alone."
    ],
    "refs": [
      "attacks",
      "small"
    ]
  },
  {
    "slug": "protect-online-charity-donations",
    "title": "Donate online without falling for a fake charity page",
    "category": "Cyber Essentials & Skills",
    "summary": "Make sure your support reaches the intended charitable organisation.",
    "sections": [
      [
        "Verify the charity",
        "Check the organisation through its official website and the appropriate UK charity register where relevant. Be cautious about new pages borrowing names, logos or photographs from genuine appeals."
      ],
      [
        "Use trusted donation routes",
        "Navigate to the registered charity's website yourself or a recognised fundraiser account. Avoid payment details sent in unsolicited messages, even when the story is emotionally urgent."
      ],
      [
        "Review exactly where money goes",
        "For marketplace charity schemes, read the participating listing's beneficiary and donation percentage. Do not assume that every sale by a business creates a donation unless the seller clearly explains the arrangement."
      ],
      [
        "Keep a record",
        "Save confirmation details and contact the platform or payment provider through the official route if you suspect fraud. Charity registration alone does not guarantee that a particular social media link belongs to that charity."
      ]
    ],
    "actions": [
      "Check the charity's registered identity.",
      "Use its verified donation page.",
      "Read marketplace donation terms on each listing."
    ],
    "refs": [
      "attacks",
      "ico"
    ]
  },
  {
    "slug": "learn-cybersecurity-ethically",
    "title": "Build cybersecurity skills in an authorised practice lab",
    "category": "Cyber Essentials & Skills",
    "summary": "Learn defensively without exposing real organisations to unwanted testing.",
    "sections": [
      [
        "Define the learning goal",
        "Choose one skill such as log review, backup restoration, secure configuration or identifying vulnerable software versions. Keep a short written objective and a record of what you learn."
      ],
      [
        "Use an isolated environment",
        "Run deliberately vulnerable training systems only in a controlled lab with no unintended access to household devices, public networks or customer data. Use synthetic data and snapshots you can restore."
      ],
      [
        "Know the permission boundary",
        "Do not scan, exploit or test third-party systems without clear written authorisation and an agreed scope. An openly accessible website is not an invitation to conduct intrusive security testing."
      ],
      [
        "Turn practice into evidence",
        "Publish sanitised diagrams, configuration notes, control checklists and lessons learned. Avoid exposing private IP addresses, credentials, attack payloads or evidence from systems you are not authorised to disclose."
      ]
    ],
    "actions": [
      "Choose a controlled learning scenario.",
      "Keep lab systems isolated and permissioned.",
      "Publish safe, reproducible learning notes."
    ],
    "refs": [
      "cyber",
      "ce"
    ]
  }
];
