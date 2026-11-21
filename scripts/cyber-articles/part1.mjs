export default [
  {
    "slug": "use-passkeys-where-available",
    "title": "Use passkeys to reduce phishing risk",
    "category": "Accounts & Identity",
    "summary": "Understand where passkeys help, how to set them up and why recovery still matters.",
    "sections": [
      [
        "What a passkey changes",
        "A passkey signs you into a website or app using a device-held cryptographic credential rather than a password you type. Because it is tied to the genuine service, a fake sign-in page cannot simply steal it in the way it can steal a password."
      ],
      [
        "Set up on an account you already trust",
        "Open the service directly from a saved bookmark or its official app. Find its account security settings, add a passkey on a device protected by a screen lock, and confirm that you can still sign in after closing the session."
      ],
      [
        "Keep a recovery route",
        "Passkeys are not a reason to ignore account recovery. Review which devices hold or synchronise the passkey, protect your main email account, and retain approved recovery methods in a safe place separate from the phone you might lose."
      ],
      [
        "Know the limits",
        "Some services still allow password sign-in as a fallback. Protect those remaining methods with a unique password and two-step verification; no single login method can protect a compromised device or a careless account-recovery process."
      ]
    ],
    "actions": [
      "Try a passkey on one important account.",
      "Check recovery options before relying on a single phone.",
      "Remove passkeys from devices you no longer control."
    ],
    "refs": [
      "accounts"
    ]
  },
  {
    "slug": "enable-two-step-verification",
    "title": "Turn on two-step verification for important accounts",
    "category": "Accounts & Identity",
    "summary": "Prioritise email, banking, cloud storage and accounts that control other services.",
    "sections": [
      [
        "Start with the keys to your digital life",
        "Your main email account can reset passwords for many other services, so secure it first. Next prioritise banking, cloud storage, social media, business administration and online shopping accounts that hold payment details."
      ],
      [
        "Choose the strongest method offered",
        "Use a passkey or hardware security key where supported; otherwise an authenticator app is often preferable to SMS. Do not assume every service offers the same options, and never share a one-time code with a caller or message sender."
      ],
      [
        "Save recovery codes before you need them",
        "Many services provide one-time backup codes. Store them offline or inside a well-protected password manager, and check your recovery email and phone details are current. A code kept only on a lost phone is not much of a backup."
      ],
      [
        "Respond to unexpected prompts",
        "An approval request you did not start might mean someone knows your password or is trying to trick you. Deny it, open the genuine service yourself, review recent sign-ins and change credentials if the account appears exposed."
      ]
    ],
    "actions": [
      "Enable 2SV on your primary email.",
      "Save and test an account recovery option.",
      "Reject unexpected sign-in approval requests."
    ],
    "refs": [
      "accounts",
      "email"
    ]
  },
  {
    "slug": "password-manager-first-steps",
    "title": "Start using a password manager safely",
    "category": "Accounts & Identity",
    "summary": "Create unique passwords without trying to remember dozens of complicated strings.",
    "sections": [
      [
        "Why reused passwords are dangerous",
        "When a breached website exposes a password, criminals may test the same combination on email, shopping or work accounts. A password manager can generate a different, long password for every site and fill it only when you choose."
      ],
      [
        "Protect the manager itself",
        "Choose a reputable manager or your device's built-in password storage. Secure the account or device with a strong unique master password or passkey and additional verification where available. Keep the recovery information somewhere you can actually retrieve it."
      ],
      [
        "Migrate the high-risk accounts first",
        "Change the password on your main email, financial accounts and administrator logins before tackling less important services. Use the service's own account-security page; avoid links in unexpected emails offering to 'upgrade' your password manager."
      ],
      [
        "Check before autofilling",
        "A manager is a useful safety prompt when it does not recognise a suspicious site, but it is not a guarantee of authenticity. Read the website address and avoid installing random browser extensions claiming to manage credentials."
      ]
    ],
    "actions": [
      "Pick one trustworthy password-storage method.",
      "Replace reused passwords on high-value accounts.",
      "Review backup and recovery settings."
    ],
    "refs": [
      "accounts",
      "email"
    ]
  },
  {
    "slug": "review-account-recovery-settings",
    "title": "Audit your account recovery settings",
    "category": "Accounts & Identity",
    "summary": "Prevent an old phone number or forgotten recovery email from becoming an easy account takeover.",
    "sections": [
      [
        "Find the recovery page",
        "Open each important account directly and inspect its security and recovery settings. Look for recovery email addresses, phone numbers, trusted devices, passkeys, backup codes and recent sessions."
      ],
      [
        "Remove what you no longer own",
        "An old mobile number may have been reassigned, and a former work mailbox may no longer be under your control. Remove those methods after confirming that at least one current recovery route works."
      ],
      [
        "Look for silent changes",
        "Unexpected forwarding rules, unfamiliar connected apps or new trusted devices can indicate compromise. If anything is wrong, secure your email from a known-clean device, sign out other sessions and follow the provider's recovery instructions."
      ],
      [
        "Document a safe fallback",
        "Keep backup codes or recovery instructions somewhere secure that does not rely on the same locked account. For business accounts, document who owns recovery and how access can be restored without sharing passwords."
      ]
    ],
    "actions": [
      "Check the recovery address on your main email.",
      "Remove old devices and phone numbers.",
      "Store recovery instructions securely."
    ],
    "refs": [
      "accounts",
      "email"
    ]
  },
  {
    "slug": "separate-admin-everyday-accounts",
    "title": "Separate everyday accounts from administrator accounts",
    "category": "Accounts & Identity",
    "summary": "Reduce the damage from a mistake or compromised browser session.",
    "sections": [
      [
        "Why admin access is different",
        "An administrator can install software, alter security settings and change other users' access. Using that power for browsing and reading email makes ordinary mistakes more consequential."
      ],
      [
        "Create a normal daily login",
        "Where your operating system supports separate accounts, use a standard user account for routine work and keep a distinct administrator login for approved changes. Give the admin identity a unique strong credential and multi-factor protection when supported."
      ],
      [
        "Limit cloud permissions too",
        "Review who can change DNS, payment settings, repositories and workspace administrators. Grant the least privilege needed for a task, remove access when work ends, and avoid sharing one all-powerful account between people."
      ],
      [
        "Test before restricting access",
        "Check that a legitimate owner can still install updates and recover the device or service. Record the approved admin route so accidental lockout does not turn into an emergency."
      ]
    ],
    "actions": [
      "Use a non-admin account for daily browsing.",
      "Review administrator roles on important services.",
      "Remove obsolete privileged access."
    ],
    "refs": [
      "accounts",
      "cyber"
    ]
  },
  {
    "slug": "spot-phishing-email",
    "title": "Spot a phishing email before it steals an account",
    "category": "Scams & Fraud",
    "summary": "Slow down suspicious messages and verify requests through an independent channel.",
    "sections": [
      [
        "Focus on the request, not just spelling",
        "Modern phishing messages may look polished and use real branding. Warning signs include urgency, pressure to bypass a process, unexpected attachments, password-reset demands and requests for payment or account codes."
      ],
      [
        "Verify outside the message",
        "Do not follow a supplied login link when the request is unexpected. Instead open the service from your own bookmark or app, or call the organisation using a number you already trust. A familiar-looking sender name is not proof."
      ],
      [
        "Handle attachments cautiously",
        "A file or QR code can carry a risky destination just as a link can. Avoid enabling macros, running unknown installers or granting remote access just because the message claims to be from IT support."
      ],
      [
        "Act quickly if you clicked",
        "If you entered credentials, change them using the real website, review sign-ins and enable 2SV. If you downloaded software or suspect a business compromise, stop and seek authorised IT assistance before deleting evidence."
      ]
    ],
    "actions": [
      "Check unexpected requests outside the email.",
      "Never share sign-in codes.",
      "Report suspicious messages through the service's reporting route."
    ],
    "refs": [
      "attacks",
      "email"
    ]
  },
  {
    "slug": "fake-technical-support-calls",
    "title": "Recognise fake technical-support calls and pop-ups",
    "category": "Scams & Fraud",
    "summary": "Understand why a frightening warning or unsolicited call is not proof your computer is infected.",
    "sections": [
      [
        "Recognise the script",
        "Scammers may claim to be Microsoft, your bank or an internet provider. A web page may play an alarm or display a telephone number and say your computer is 'blocked' until you call."
      ],
      [
        "Do not hand over remote control",
        "Close the suspicious page if safe, or leave it and restart the browser. Do not call the number in the warning, install remote-control software, make a payment or read out banking codes."
      ],
      [
        "Verify a real issue separately",
        "Use the security status built into your device and update it through trusted settings. If you have a genuine support agreement, contact that provider using its previously verified address or number, not the one in the pop-up."
      ],
      [
        "If you already allowed access",
        "Disconnect from the internet if the caller still has control, then seek trusted help using another device. Change important passwords from a clean device, contact your bank promptly if payments were involved and document what happened."
      ]
    ],
    "actions": [
      "Ignore phone numbers inside scary browser pop-ups.",
      "Do not install tools for unsolicited callers.",
      "Contact your bank immediately if money was sent."
    ],
    "refs": [
      "attacks",
      "devices"
    ]
  },
  {
    "slug": "qr-code-scams",
    "title": "Treat unexpected QR codes like untrusted links",
    "category": "Scams & Fraud",
    "summary": "Check the destination before logging in or entering payment details.",
    "sections": [
      [
        "Why QR scams work",
        "A printed code on a poster, delivery notice or parking machine hides its destination until it is scanned. Attackers can replace legitimate stickers or send QR codes in emails to direct you to a fake sign-in page."
      ],
      [
        "Inspect before opening",
        "Use your phone's built-in camera to preview the destination where possible. Watch for misspelled domains, unusual payment requests and redirects to websites unrelated to the organisation."
      ],
      [
        "Choose the official route",
        "For parking, deliveries, charity donations and account verification, use the provider's genuine app or type its website yourself when the request is unexpected. A familiar logo next to the code does not make it trustworthy."
      ],
      [
        "After a suspicious scan",
        "Scanning alone is not necessarily a compromise. If you submitted a password or card details, change affected credentials on the genuine service, contact the payment provider and monitor account activity."
      ]
    ],
    "actions": [
      "Preview QR destinations before opening.",
      "Use the provider's own app for payments.",
      "Do not enter a code or password on an unexpected page."
    ],
    "refs": [
      "attacks",
      "accounts"
    ]
  },
  {
    "slug": "invoice-redirection-fraud",
    "title": "Prevent invoice and bank-detail change fraud",
    "category": "Scams & Fraud",
    "summary": "Make payment detail changes a verified process rather than a quick email reply.",
    "sections": [
      [
        "Understand the attack",
        "Criminals may impersonate a supplier or compromise an existing email conversation and insert a new bank account. The message can look genuine because it arrives in a familiar thread."
      ],
      [
        "Verify changed details independently",
        "Treat any request to change an account number as high risk. Call your supplier on a previously trusted telephone number or use another independently verified contact method; do not rely on a number included in the change request."
      ],
      [
        "Build a simple approval rule",
        "For a small business or charity, record the old and new details, who requested the change and who verified it. Where possible, require a second person to approve payment amendments and unusual transfers."
      ],
      [
        "Act immediately if money was sent",
        "Contact your bank's fraud team as soon as you discover the problem. Preserve payment references, emails and the timeline, and report the suspected fraud through the appropriate official UK channel."
      ]
    ],
    "actions": [
      "Verify every changed supplier bank account.",
      "Keep a short approval record.",
      "Contact the bank promptly after suspicious transfers."
    ],
    "refs": [
      "attacks",
      "ico"
    ]
  },
  {
    "slug": "social-media-impersonation",
    "title": "Protect yourself from social-media impersonation scams",
    "category": "Scams & Fraud",
    "summary": "Check accounts and urgent messages before donating, paying or sharing personal information.",
    "sections": [
      [
        "Common warning signs",
        "An imitation account may copy a friend's photo, charity branding or local business profile. It may send a new friend request, ask for a donation, advertise a limited offer or claim a family emergency."
      ],
      [
        "Cross-check the identity",
        "Look for account history and an established website, but remember that compromised genuine accounts also exist. Contact the person or organisation using a separate channel you already know."
      ],
      [
        "Protect your own profile",
        "Use a unique password or passkey, 2SV and sensible privacy settings. Review logged-in devices and connected apps, and avoid publishing information that makes identity questions easier for scammers."
      ],
      [
        "Report and warn carefully",
        "Use the platform's impersonation reporting tools. If your business or charity is copied, publish a calm notice from your established website with the official contact route; do not amplify a fake payment link."
      ]
    ],
    "actions": [
      "Verify donation requests outside social media.",
      "Enable 2SV on social accounts.",
      "Report impersonation through the platform."
    ],
    "refs": [
      "attacks",
      "accounts"
    ]
  }
];
