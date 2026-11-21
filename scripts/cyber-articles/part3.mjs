export default [
  {
    "slug": "small-business-cyber-inventory",
    "title": "Make a small-business cyber asset inventory",
    "category": "Small Business & Charities",
    "summary": "Know which devices, accounts and services your organisation depends upon.",
    "sections": [
      [
        "Start with the essentials",
        "List the computers, phones, routers, website hosting, email, payment platforms and shared drives essential to trading. Include the person responsible for each service and the recovery or support contact."
      ],
      [
        "Record ownership without collecting passwords",
        "Keep device model, support status, operating system, service owner, update method and backup location. Do not place passwords, card details or recovery codes into an ordinary spreadsheet."
      ],
      [
        "Identify your most important services",
        "Which failure would stop orders, staff communication or support to beneficiaries? Mark those services as critical and check whether they have two-step verification, backups and a recovery route."
      ],
      [
        "Keep the record alive",
        "Review the inventory when a device is purchased, a volunteer leaves or a subscription changes. A one-page record that stays current is more useful than a detailed inventory nobody updates."
      ]
    ],
    "actions": [
      "Record business-critical accounts and devices.",
      "Name an owner for updates and recovery.",
      "Review the list after supplier or staff changes."
    ],
    "refs": [
      "small",
      "cyber"
    ]
  },
  {
    "slug": "charity-volunteer-account-security",
    "title": "Protect charity accounts when volunteers join or leave",
    "category": "Small Business & Charities",
    "summary": "Avoid shared passwords and forgotten access after a volunteer's role changes.",
    "sections": [
      [
        "Give people their own identity",
        "Where possible, create individual user accounts for charity email, cloud storage and fundraising platforms. A shared login makes it hard to tell who changed something or to revoke access safely."
      ],
      [
        "Match access to the role",
        "A volunteer preparing social posts may need publishing rights but not access to donor exports or bank details. Assign the least privilege required, and protect administrative access with multi-factor authentication."
      ],
      [
        "Make joining and leaving predictable",
        "Use a checklist covering account creation, security guidance, approved devices and, at the end, access removal and return of files. Update recovery contacts if a departing volunteer controlled an important account."
      ],
      [
        "Protect beneficiary and donor data",
        "Avoid sending personal records through private messaging accounts. Use an approved shared location, grant only necessary access and report mistaken disclosures promptly through a named charity contact."
      ]
    ],
    "actions": [
      "Create individual accounts wherever possible.",
      "Remove access promptly when roles end.",
      "Identify an owner for donor-data permissions."
    ],
    "refs": [
      "small",
      "ico"
    ]
  },
  {
    "slug": "supplier-access-review",
    "title": "Review the access your IT suppliers can use",
    "category": "Small Business & Charities",
    "summary": "Reduce forgotten administrator accounts and unrestricted third-party permissions.",
    "sections": [
      [
        "Identify every external helper",
        "List hosting companies, accountants, web developers, remote support providers and integrations that access business systems or personal information. Check the reason for each permission."
      ],
      [
        "Use time-limited permissions",
        "Grant specific roles or temporary access rather than sending the owner's password. Require multi-factor authentication where supported, and agree what changes are authorised before work begins."
      ],
      [
        "Check linked applications",
        "Connected tools and automation services may retain broad account permissions. Remove integrations that are unused or cannot be explained, after checking whether an active workflow relies on them."
      ],
      [
        "Revoke and verify",
        "Remove temporary access when work ends, rotate any shared credentials that could not be avoided and review logs for unexpected changes. Keep a short record of the provider's security responsibilities."
      ]
    ],
    "actions": [
      "List external admins and connected applications.",
      "Reduce access to the minimum needed.",
      "Revoke permissions after each engagement."
    ],
    "refs": [
      "small",
      "cloud"
    ]
  },
  {
    "slug": "secure-business-payments",
    "title": "Reduce security risks in online business payments",
    "category": "Small Business & Charities",
    "summary": "Keep payment administration, fraud checks and customer support separate.",
    "sections": [
      [
        "Protect the payment dashboard",
        "Enable multi-factor authentication or passkeys, check account recovery and limit who can issue refunds, change settlement bank details or access customer exports. Keep secret API credentials out of public web code."
      ],
      [
        "Use hosted payment collection",
        "A reputable hosted checkout can reduce exposure to card details. Never request full payment card numbers or security codes by email, chat or a support screenshot."
      ],
      [
        "Check integrations",
        "For connected shops, validate payment notifications using the provider's documented security mechanism and design order processing to tolerate repeated events. Test significant changes in a sandbox before affecting real purchases."
      ],
      [
        "Handle suspicious requests",
        "Be cautious about refund pressure, payment changes and requests to transact outside the normal checkout. Preserve order records and use official payment provider dispute channels."
      ]
    ],
    "actions": [
      "Enable MFA on payment administration.",
      "Keep private keys out of public code.",
      "Use test mode for payment integration changes."
    ],
    "refs": [
      "small",
      "cloud"
    ]
  },
  {
    "slug": "one-page-cyber-policy",
    "title": "Write a one-page cyber security policy",
    "category": "Small Business & Charities",
    "summary": "Give staff and volunteers a few clear, practical security habits.",
    "sections": [
      [
        "Keep it proportionate",
        "Small organisations need an understandable policy more than a huge document copied from another company. State who is responsible for accounts, approved devices, updates, backups and suspected incidents."
      ],
      [
        "Set the baseline",
        "Require unique passwords or passkeys, two-step verification on important accounts, supported software, limited administrator access and careful handling of customer or beneficiary information."
      ],
      [
        "Make reporting straightforward",
        "Name a contact and an alternative if that person is absent. Encourage prompt reporting of unexpected login prompts, lost devices and wrongly sent information; early reporting helps limit damage."
      ],
      [
        "Review as you change",
        "Revisit the policy after major software changes, staff turnover or incidents. Ask people whether they understand the reporting route instead of assuming a document has been read."
      ]
    ],
    "actions": [
      "Assign a named security contact.",
      "Write simple rules people can follow.",
      "Review the policy after major changes."
    ],
    "refs": [
      "small",
      "ico"
    ]
  },
  {
    "slug": "secure-website-administrator",
    "title": "Secure your website administrator account",
    "category": "Websites & Email",
    "summary": "Protect domain, hosting, content and online shop administration.",
    "sections": [
      [
        "Treat administration as critical",
        "A website administrator can change checkout links, forms and scripts. Use a unique password or passkey and multi-factor authentication, with individual accounts for every person who needs access."
      ],
      [
        "Update without shortcuts",
        "Keep your content management system, themes, extensions and server components supported and patched. Remove unused plugins, test updates and maintain a protected recovery point."
      ],
      [
        "Limit access routes",
        "Disable obsolete administrator accounts and unnecessary remote access. Review installed extensions, connected APIs and third-party code, especially anything able to change payments or collect personal data."
      ],
      [
        "Prepare for a bad change",
        "Document domain ownership, host support contact, backup restoration and authorised recovery steps. Test restoration in a safe environment without making unreviewed changes to a live shop."
      ]
    ],
    "actions": [
      "Use MFA on all administrator accounts.",
      "Remove unsupported or unused extensions.",
      "Keep a tested website recovery route."
    ],
    "refs": [
      "web",
      "small"
    ]
  },
  {
    "slug": "dns-domain-lockdown",
    "title": "Protect your domain name and DNS settings",
    "category": "Websites & Email",
    "summary": "A secure website starts with control of the domain and its registrar account.",
    "sections": [
      [
        "Protect the registrar",
        "Use a unique password, phishing-resistant sign-in if offered, and multi-factor authentication. Keep the billing and recovery contact current; losing control of the registrar can redirect your website and email."
      ],
      [
        "Understand the critical records",
        "Document nameservers, website records, mail delivery records and verification records before changing anything. Do not remove unfamiliar DNS entries because you assume they are obsolete."
      ],
      [
        "Limit who can edit records",
        "Only authorised people or tools should modify DNS. Review connected applications and delegated users, turn on transfer lock where appropriate and retain the registrar's recovery instructions."
      ],
      [
        "Check after planned changes",
        "Validate website HTTPS, mail sending and receiving, and important integrations after DNS edits. Keep a rollback record so accidental outages can be reversed safely."
      ]
    ],
    "actions": [
      "Enable registrar MFA and transfer protections.",
      "Export the existing DNS record list.",
      "Verify email and website after changes."
    ],
    "refs": [
      "web",
      "email"
    ]
  },
  {
    "slug": "email-domain-spf-dkim-dmarc",
    "title": "Understand SPF, DKIM and DMARC for business email",
    "category": "Websites & Email",
    "summary": "Reduce domain spoofing without accidentally blocking legitimate messages.",
    "sections": [
      [
        "What each record does",
        "SPF identifies authorised sending infrastructure, DKIM allows providers to sign mail, and DMARC tells receiving servers how to treat certain authentication failures and where to send aggregate reports."
      ],
      [
        "Inventory the sending services",
        "List every real sender such as your mailbox provider, website, invoices and email marketing service. An incomplete list can cause legitimate mail to fail after a strict policy is introduced."
      ],
      [
        "Publish through your provider's instructions",
        "Use the verified setup guide for the exact email service. Avoid adding multiple SPF TXT records for one domain and don't switch DMARC abruptly to a strict reject policy without examining the impact."
      ],
      [
        "Review reports and test delivery",
        "Check DMARC reporting and send test messages to independent recipients. Verify replies, contact forms, invoices and automated mail, then strengthen policy when you understand the sending patterns."
      ]
    ],
    "actions": [
      "Record legitimate mail sending services.",
      "Review SPF, DKIM and DMARC records.",
      "Test actual mail delivery after changes."
    ],
    "refs": [
      "email",
      "web"
    ]
  },
  {
    "slug": "https-not-the-whole-story",
    "title": "Know what HTTPS does—and does not—protect",
    "category": "Websites & Email",
    "summary": "Learn why a padlock is useful but not proof a website is genuine.",
    "sections": [
      [
        "What encrypted connections provide",
        "HTTPS encrypts traffic between your browser and the website endpoint and helps verify the hostname certificate. This is important for protecting logins and submitted forms on untrusted networks."
      ],
      [
        "Why scammers use HTTPS too",
        "Criminals can obtain a genuine certificate for a misleading domain. A padlock therefore does not prove the company, charity or offer is legitimate; inspect the actual website name and the context."
      ],
      [
        "Set up HTTPS correctly",
        "Website owners should use a trusted certificate, renew it automatically where possible and redirect ordinary HTTP traffic to HTTPS. Test important subdomains and assets after changes."
      ],
      [
        "Protect the whole customer journey",
        "Security also depends on maintained software, secure forms, account controls and reputable checkout providers. An encrypted connection cannot fix a stolen administrator password or fraudulent payment request."
      ]
    ],
    "actions": [
      "Read the full domain before signing in.",
      "Use HTTPS on real customer forms.",
      "Test certificate renewal and redirects."
    ],
    "refs": [
      "web",
      "attacks"
    ]
  },
  {
    "slug": "cloud-file-sharing-permissions",
    "title": "Review cloud drive and shared folder permissions",
    "category": "Websites & Email",
    "summary": "Prevent old links and broad access from exposing business documents.",
    "sections": [
      [
        "Find the broad links",
        "Search your cloud drive for folders shared with 'anyone with the link' or entire organisations. Inspect what those locations contain, including files added long after the link was created."
      ],
      [
        "Reduce permission levels",
        "Give named recipients view access when editing is not needed. Avoid granting owners or outsiders unrestricted sharing rights unless their task requires it."
      ],
      [
        "Understand synchronisation and copies",
        "Revoking a sharing link prevents future access through that link, but it does not recall material someone already downloaded. Treat sensitive exports and backups separately from ordinary collaboration documents."
      ],
      [
        "Schedule access reviews",
        "Review access when a volunteer leaves, a contractor finishes or a project ends. Keep important information in business-controlled accounts rather than private accounts owned by one temporary helper."
      ]
    ],
    "actions": [
      "Review public and organisation-wide links.",
      "Use named, least-privilege sharing.",
      "Revoke access when projects end."
    ],
    "refs": [
      "cloud",
      "ico"
    ]
  }
];
