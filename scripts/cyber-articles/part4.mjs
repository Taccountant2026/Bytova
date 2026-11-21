export default [
  {
    "slug": "first-hour-after-account-hack",
    "title": "What to do in the first hour after an account hack",
    "category": "Incidents & Recovery",
    "summary": "Regain control methodically without making the situation worse.",
    "sections": [
      [
        "Establish whether the account is compromised",
        "An unexpected login alert alone is not proof of a breach. Check recent activity through the genuine provider site or app, using a device you trust, and look for unfamiliar devices, rules or profile changes."
      ],
      [
        "Secure the account using the official route",
        "Change the password if needed, revoke unfamiliar sessions, enable strong two-step verification and check recovery methods. For a compromised email account, inspect forwarding rules and linked applications, since an attacker may retain access after a password change."
      ],
      [
        "Protect linked services",
        "Email is often used to reset other accounts. Check banking, payment, shopping and cloud accounts that depend on it. If money or payment details may be involved, contact your bank or payment provider using a verified channel."
      ],
      [
        "Keep records and request help",
        "Record times, unfamiliar sign-ins and provider notices without publishing private details. If this is a business account, assess whether customer data was accessed and involve the appropriate security, legal or data-protection contact."
      ]
    ],
    "actions": [
      "Use the real provider recovery process.",
      "Revoke unrecognised sessions and forwarding rules.",
      "Check payment services and customer data exposure."
    ],
    "refs": [
      "incident",
      "ico"
    ]
  },
  {
    "slug": "ransomware-first-response",
    "title": "Ransomware warning signs and immediate response",
    "category": "Incidents & Recovery",
    "summary": "Protect other systems and backups while seeking authorised incident assistance.",
    "sections": [
      [
        "Recognise possible ransomware",
        "Signs can include suddenly unreadable files, unexpected filename extensions and ransom demands. These can also have other causes, so record what you observe rather than guessing at a particular malware family."
      ],
      [
        "Limit spread without destroying evidence",
        "If infection is suspected on a business device, disconnect it from networks where safe, stop using affected shared drives and contact the incident lead or authorised specialist promptly. Do not start running downloaded 'cleaners' on production systems."
      ],
      [
        "Protect recovery options",
        "Keep offline or isolated backups separate from compromised accounts. Do not reconnect backup drives or restore into an untrusted environment until the incident has been assessed and the recovery method verified."
      ],
      [
        "Decide recovery with evidence",
        "Preserve useful logs and timelines. Review legal reporting obligations, service disruption and possible data exposure. Avoid assuming that paying a ransom guarantees recovery or that a quick reinstallation resolves every persistence issue."
      ]
    ],
    "actions": [
      "Isolate suspected affected devices safely.",
      "Protect and verify independent backups.",
      "Seek qualified incident-response advice."
    ],
    "refs": [
      "incident",
      "backup"
    ]
  },
  {
    "slug": "lost-device-business-response",
    "title": "Respond to a lost business laptop or phone",
    "category": "Incidents & Recovery",
    "summary": "Contain account exposure and assess whether customer or charity information is at risk.",
    "sections": [
      [
        "Record the facts promptly",
        "Note when and where the device was last seen, who had access, whether it held customer data, and whether encryption and a strong screen lock were enabled."
      ],
      [
        "Use managed recovery tools",
        "Where configured, use the official device-management service to lock or revoke access. Coordinate a remote wipe carefully: it may erase helpful evidence, fail when the device is offline or be inappropriate if recovery is possible."
      ],
      [
        "Secure accounts and tokens",
        "Revoke affected browser sessions and access tokens, reset credentials where necessary and review mobile payment, authenticator and SIM access. Notify the appropriate organisation contact."
      ],
      [
        "Assess reporting duties",
        "A lost encrypted device is not automatically a reportable personal data breach, nor is every lost device harmless. Assess the likelihood and severity of risk to individuals using applicable ICO guidance and document the decision."
      ]
    ],
    "actions": [
      "Record device and encryption status.",
      "Revoke affected logins and credentials.",
      "Assess whether personal data is exposed."
    ],
    "refs": [
      "incident",
      "ico"
    ]
  },
  {
    "slug": "personal-data-breach-first-72-hours",
    "title": "A small organisation's first 72 hours after a data breach",
    "category": "Incidents & Recovery",
    "summary": "Understand containment, evidence and the UK notification threshold.",
    "sections": [
      [
        "Contain and record",
        "Stop the inappropriate disclosure or access where safely possible, preserve evidence and start a factual incident log. Record what information was involved, when the breach was discovered and who is affected."
      ],
      [
        "Assess risks to people",
        "Consider sensitivity, scale, likely misuse and protections such as encryption. Under UK GDPR, personal data breaches are reportable to the ICO unless they are unlikely to result in a risk to people's rights and freedoms."
      ],
      [
        "Meet the reporting deadline when required",
        "If reportable, notify the ICO without undue delay and, where feasible, within 72 hours of becoming aware. If you do not yet have every fact, follow the ICO's instructions for providing an initial report and updates."
      ],
      [
        "Inform affected people when necessary",
        "Breaches likely to result in a high risk to individuals normally require direct communication without undue delay. Seek appropriate professional advice and use the ICO's current guidance, rather than relying on a generic template."
      ]
    ],
    "actions": [
      "Start an incident log immediately.",
      "Use ICO guidance to assess reporting.",
      "Keep a record of the reasons for your decision."
    ],
    "refs": [
      "ico-breach",
      "incident"
    ]
  },
  {
    "slug": "secure-account-after-phishing",
    "title": "Recover safely after entering a password on a fake site",
    "category": "Incidents & Recovery",
    "summary": "What to do if you suspect you submitted credentials to a phishing page.",
    "sections": [
      [
        "Stop using the suspicious page",
        "Do not enter further details or call a displayed support number. Close the page and open the genuine service through a trusted bookmark or independently typed address."
      ],
      [
        "Replace exposed credentials",
        "Change the affected password and any reused passwords from a trusted device. Enable a passkey or strong two-step verification, review recovery contacts and revoke unrecognised sessions."
      ],
      [
        "Look for secondary changes",
        "Check email forwarding, linked apps and payment details. If the page asked you to download software, avoid running it and seek help before changing sensitive accounts on the potentially compromised device."
      ],
      [
        "Report and monitor",
        "Use the genuine platform's phishing reporting function. If financial information was submitted, contact the bank or provider promptly and monitor for unauthorised activity."
      ]
    ],
    "actions": [
      "Change compromised passwords on the real service.",
      "Revoke unfamiliar sessions and connected apps.",
      "Tell the bank if payment details were disclosed."
    ],
    "refs": [
      "incident",
      "accounts"
    ]
  },
  {
    "slug": "backup-restore-drill",
    "title": "Run a safe backup restoration drill",
    "category": "Incidents & Recovery",
    "summary": "Prove that you can get useful files back instead of trusting a green backup icon.",
    "sections": [
      [
        "Choose a small, safe test",
        "Select representative non-sensitive files or a disposable test dataset. Restore into a separate folder or isolated test environment, not on top of live production files."
      ],
      [
        "Check integrity and access",
        "Open restored documents and confirm that versions, permissions and names are correct. For business applications, a database backup may require application files, configuration and a matching recovery process."
      ],
      [
        "Measure recovery needs",
        "Record how long the restoration takes, who has the necessary keys, and how much data could have been lost. A recovery time estimate should come from a real test rather than an optimistic assumption."
      ],
      [
        "Fix the weak points",
        "Update instructions, replace failed storage, remove single-person dependencies and repeat the exercise after major system changes. Protect the restored copy and delete test data appropriately."
      ]
    ],
    "actions": [
      "Restore a small file to a different location.",
      "Document recovery time and missing steps.",
      "Repeat after major changes."
    ],
    "refs": [
      "backup",
      "incident"
    ]
  },
  {
    "slug": "suspicious-login-alert",
    "title": "Check an unexpected sign-in alert without clicking",
    "category": "Incidents & Recovery",
    "summary": "Verify security notifications safely and respond to genuine account activity.",
    "sections": [
      [
        "Treat notifications as unverified",
        "An alert may be genuine or an imitation intended to make you click a fake sign-in link. The sender name, logo and apparent urgency are not reliable proof."
      ],
      [
        "Open the provider independently",
        "Use your normal app or bookmarked website to review account sign-ins, devices and active sessions. Check that any location information is plausible; location estimates are imperfect and may be affected by network routing."
      ],
      [
        "Act on real anomalies",
        "If an unfamiliar successful login appears, revoke access, change relevant credentials and check recovery details and connected apps. Consider whether your primary email account is also exposed."
      ],
      [
        "Reduce repeated alerts",
        "Turn on the provider's legitimate security alerts and MFA, then review your devices. Do not approve unexpected authentication prompts just to stop them appearing."
      ]
    ],
    "actions": [
      "Verify through your usual provider app.",
      "Revoke confirmed unfamiliar sign-ins.",
      "Never approve a sign-in you did not begin."
    ],
    "refs": [
      "accounts",
      "incident"
    ]
  },
  {
    "slug": "security-incident-log-template",
    "title": "Keep a useful security incident log",
    "category": "Incidents & Recovery",
    "summary": "Turn a confusing event into an accurate timeline and decision record.",
    "sections": [
      [
        "Write observations, not assumptions",
        "Record time, system, account, visible behaviour and who reported it. Label interpretations as unconfirmed; 'malware detected' and 'someone accessed our database' need different evidence."
      ],
      [
        "Record decisions and authorisation",
        "Include actions taken, who authorised them, the systems affected and the intended outcome. This matters when restoring backups, changing passwords or restricting access to customer services."
      ],
      [
        "Preserve evidence carefully",
        "Keep relevant logs, messages and screenshots in protected storage. Avoid copying more personal information than necessary or sharing customer data in unapproved chat and email systems."
      ],
      [
        "Close the loop",
        "After resolving the incident, record service restoration, remaining risks, reporting decisions and improvements. Review the incident with the people involved without inventing a root cause."
      ]
    ],
    "actions": [
      "Create a timestamped incident timeline.",
      "Record who approved each major action.",
      "Document evidence and follow-up controls."
    ],
    "refs": [
      "incident",
      "ico"
    ]
  },
  {
    "slug": "cyber-incident-contact-list",
    "title": "Prepare a cyber emergency contact list",
    "category": "Incidents & Recovery",
    "summary": "Know who to reach when email, your website or payment service fails.",
    "sections": [
      [
        "Start with critical contacts",
        "Record approved routes for your hosting company, domain registrar, email provider, payment processor, insurer if relevant and a trusted IT or incident-response specialist."
      ],
      [
        "Store an offline copy",
        "If email or cloud storage is compromised, the contact list may be unavailable. Keep a protected alternative accessible to the right people without printing sensitive passwords alongside phone numbers."
      ],
      [
        "Agree who can decide",
        "A small business needs clarity over who can shut down a service, contact customers or authorise restoration. A charity may need a trustee or senior staff member involved in higher-impact decisions."
      ],
      [
        "Test the list",
        "Ask whether each contact remains current, check support hours and know whether the number is for ordinary support or urgent incidents. Update after staff or supplier changes."
      ]
    ],
    "actions": [
      "List emergency support contacts.",
      "Store an accessible offline copy.",
      "Name the person who can approve recovery decisions."
    ],
    "refs": [
      "incident",
      "small"
    ]
  },
  {
    "slug": "recover-after-device-malware",
    "title": "What to do after malware is found on a computer",
    "category": "Incidents & Recovery",
    "summary": "Prioritise trusted recovery and account safety over quick fixes.",
    "sections": [
      [
        "Check the original alert",
        "Open your security software directly rather than trusting a pop-up in the browser. Record the detection name and scan status, but remember that a detection does not automatically establish what data was accessed."
      ],
      [
        "Contain suspicious behaviour",
        "If malware appears active or the device is part of a workplace network, follow the organisation's incident procedure and consider network isolation. Avoid plugging in backup drives while infection status is uncertain."
      ],
      [
        "Recover from a trusted state",
        "Use reputable security tools and manufacturer guidance, and seek professional advice for persistent or business-critical cases. A clean reinstallation may be appropriate, but files and credentials still need review."
      ],
      [
        "Secure linked accounts",
        "If credentials might have been exposed, change them from another trusted device, review sessions and enable strong MFA. Verify backups before restoring and monitor for recurrence."
      ]
    ],
    "actions": [
      "Use legitimate installed security software.",
      "Keep backups isolated until safe.",
      "Secure exposed accounts from a trusted device."
    ],
    "refs": [
      "incident",
      "devices"
    ]
  }
];
