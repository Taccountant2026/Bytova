export default [
  {
    "slug": "keep-devices-updated",
    "title": "Keep operating systems and apps updated",
    "category": "Devices & Networks",
    "summary": "A simple update routine closes common security gaps without relying on guesswork.",
    "sections": [
      [
        "Why updates matter",
        "Software updates often fix weaknesses that attackers can exploit. A device can look perfectly normal while running outdated software, so do not wait for an obvious symptom before updating it."
      ],
      [
        "Use the built-in update mechanism",
        "Enable automatic updates on your operating system, browsers, phone apps and security tools. Check occasionally that they actually install; a pending restart or a device that is switched off for weeks can delay protection."
      ],
      [
        "Include network and smart devices",
        "Routers, printers, CCTV cameras and storage devices may also need firmware updates. Use the manufacturer's official application or management page and keep a record of models that no longer receive security support."
      ],
      [
        "Plan around important work",
        "For a business, back up critical data, schedule changes at a sensible time and test essentials afterwards. If a device is unsupported, consider replacing, upgrading or isolating it rather than leaving it exposed."
      ]
    ],
    "actions": [
      "Enable automatic updates where available.",
      "Check router and camera firmware support.",
      "Plan to replace unsupported devices."
    ],
    "refs": [
      "devices",
      "cyber"
    ]
  },
  {
    "slug": "secure-home-wifi-router",
    "title": "Secure your home Wi-Fi router",
    "category": "Devices & Networks",
    "summary": "Protect the network that connects your computers, phones and smart devices.",
    "sections": [
      [
        "Start with the administrator login",
        "Change any shared default router administration password, use a unique strong credential and enable additional verification if the equipment supports it. Keep its recovery details secure."
      ],
      [
        "Choose modern wireless security",
        "Use WPA3 where compatible, or WPA2-AES where WPA3 is unavailable. Avoid older WEP or WPA modes and turn off Wi-Fi Protected Setup (WPS) if it is not needed. A strong Wi-Fi password should be different from the router admin password."
      ],
      [
        "Review exposure and updates",
        "Check for manufacturer firmware updates and disable remote administration unless you have a specific secure reason to use it. Review port forwards and UPnP settings; do not leave unfamiliar internet-facing services enabled."
      ],
      [
        "Understand guest networks",
        "A guest or IoT network can help limit accidental access between devices, but isolation depends on the router's actual settings. Test that guests cannot browse private computers or storage before assuming the separation works."
      ]
    ],
    "actions": [
      "Set unique Wi-Fi and router admin credentials.",
      "Use WPA3 or WPA2-AES.",
      "Review updates and unused remote access."
    ],
    "refs": [
      "devices",
      "accounts"
    ]
  },
  {
    "slug": "secure-smart-cameras-and-iot",
    "title": "Protect smart cameras, doorbells and other IoT devices",
    "category": "Devices & Networks",
    "summary": "Use practical settings to reduce the risks of internet-connected home equipment.",
    "sections": [
      [
        "Start with your account",
        "Secure the manufacturer's app account using a unique password and MFA if offered. Review who can view the camera feed, which devices remain signed in, and whether sharing links are still needed."
      ],
      [
        "Keep firmware supported",
        "Install updates through the genuine manufacturer app, and check whether older cameras still receive security fixes. Do not download unofficial firmware or expose a camera management page directly to the internet."
      ],
      [
        "Reduce network exposure",
        "Put cameras and other IoT equipment on an isolated network where your setup supports it, while testing that legitimate mobile viewing and recording still work. Disable services you do not use and document any required local connections."
      ],
      [
        "Think about privacy and continuity",
        "Point cameras responsibly, limit unnecessary recordings and keep backups or local recording where appropriate. If continuous monitoring is important, test power and internet failure scenarios rather than assuming cloud access will always remain available."
      ]
    ],
    "actions": [
      "Review camera account access and MFA.",
      "Update firmware and avoid direct internet exposure.",
      "Test recording and failover after network changes."
    ],
    "refs": [
      "devices",
      "ico"
    ]
  },
  {
    "slug": "protect-phone-from-theft",
    "title": "Secure a phone before it is lost or stolen",
    "category": "Devices & Networks",
    "summary": "Reduce the damage of phone theft by protecting access, backups and recovery.",
    "sections": [
      [
        "Strengthen the lock screen",
        "Use a strong PIN or password and convenient biometric unlock where suitable. Avoid showing sensitive notifications on a locked screen, particularly one-time sign-in codes and payment previews."
      ],
      [
        "Enable recovery features",
        "Turn on the device manufacturer's find, lock or erase features where available. Test how you would sign in to that recovery service from another device without relying on the missing phone."
      ],
      [
        "Back up the essentials",
        "Confirm that photos, contacts and any authenticator recovery options can be restored. A cloud sync service might not keep a deleted file forever, so check its recovery limitations."
      ],
      [
        "Plan the first response",
        "If the phone disappears, try the legitimate device-location service, lock it if appropriate, and contact your mobile provider and bank if accounts or SIM access may be at risk. Change important credentials from a trusted device if needed."
      ]
    ],
    "actions": [
      "Use a non-trivial lock-screen PIN.",
      "Check device find/lock capabilities.",
      "Test recovery without the phone."
    ],
    "refs": [
      "devices",
      "accounts"
    ]
  },
  {
    "slug": "secure-usb-and-removable-drives",
    "title": "Handle USB drives and external storage safely",
    "category": "Devices & Networks",
    "summary": "Prevent lost files and accidental execution from removable devices.",
    "sections": [
      [
        "Treat unknown drives as untrusted",
        "Do not plug in an unexplained USB drive found in a public place or delivered unexpectedly. The risk is not limited to visible files; some devices can impersonate keyboards or other hardware."
      ],
      [
        "Protect data before carrying it",
        "Use device or drive encryption where appropriate, particularly for customer and charity information. Verify that the recovery key is stored securely and never assume a small drive is harmless because it is easy to replace."
      ],
      [
        "Use a safe transfer process",
        "For legitimate files, scan with maintained malware protection, avoid running unfamiliar executables and keep a separate backup. For business transfers, agree which data may be copied and who is permitted to retain it."
      ],
      [
        "Dispose of media deliberately",
        "A quick deletion or ordinary formatting may not protect sensitive information. Follow an appropriate secure erase or physical destruction process for the type of media, documenting disposal when business records are involved."
      ]
    ],
    "actions": [
      "Do not use found or unapproved USB drives.",
      "Encrypt portable drives carrying sensitive data.",
      "Use a secure disposal process."
    ],
    "refs": [
      "devices",
      "ico"
    ]
  },
  {
    "slug": "backups-versus-sync",
    "title": "Understand the difference between a backup and synchronisation",
    "category": "Privacy & Data",
    "summary": "Make sure one accidental deletion cannot remove every copy of a valuable file.",
    "sections": [
      [
        "Synchronisation is convenient, not magic",
        "A synced folder keeps changes aligned between devices and cloud storage. Unfortunately, that can include deletions, unwanted edits and ransomware-encrypted files, depending on the service's version history and retention settings."
      ],
      [
        "Build independent recovery options",
        "Keep copies of essential work in a separate destination with protected access and useful version history. For irreplaceable records, consider an offline or otherwise isolated copy that routine user accounts cannot overwrite."
      ],
      [
        "Test restores, not just backup notifications",
        "Pick a non-sensitive sample file, restore it to a different location and open it. Check that you can recover previous versions and that the backup covers email exports, website data or other records that a sync folder may miss."
      ],
      [
        "Match the frequency to the risk",
        "A household might back up photos weekly; a small business may need daily or more frequent copies of orders and documents. Write down how much recent work could be lost and how long restoration may take."
      ]
    ],
    "actions": [
      "List files you cannot afford to lose.",
      "Keep at least one independent protected backup.",
      "Practice restoring a sample file."
    ],
    "refs": [
      "backup"
    ]
  },
  {
    "slug": "encrypt-a-laptop",
    "title": "Encrypt laptops and portable devices",
    "category": "Privacy & Data",
    "summary": "Protect stored information when equipment is lost or stolen.",
    "sections": [
      [
        "What encryption protects",
        "Full-disk encryption helps prevent someone who possesses a switched-off device from reading its stored files without the correct unlocking credentials. It does not stop someone who has already signed in to your account."
      ],
      [
        "Check support before making changes",
        "Windows, macOS and mobile platforms offer different encryption controls. Confirm that the device supports a suitable option and that the recovery key or account is accessible before enabling or changing encryption."
      ],
      [
        "Protect recovery information",
        "Save recovery keys separately from the laptop, ideally in a trusted protected location. Do not photograph a recovery code and leave it in an unlocked photo gallery on the same machine."
      ],
      [
        "Include external media",
        "A laptop's encrypted internal disk does not encrypt every USB drive or exported file. Use a suitable protected method for backups and portable media, and tell recipients how to access shared data without emailing passwords beside the files."
      ]
    ],
    "actions": [
      "Check whether disk encryption is active.",
      "Verify recovery key access.",
      "Protect exports and external drives too."
    ],
    "refs": [
      "devices",
      "ico"
    ]
  },
  {
    "slug": "share-files-without-oversharing",
    "title": "Share files without exposing private information",
    "category": "Privacy & Data",
    "summary": "Review recipients, permissions and expiry before sending personal or business documents.",
    "sections": [
      [
        "Choose the smallest audience",
        "Use named recipients rather than a public 'anyone with the link' setting for sensitive material. If a document only needs to be read, avoid granting edit or ownership permissions."
      ],
      [
        "Double-check the actual file",
        "Remove hidden comments, tracked changes and unnecessary personal fields where applicable. Inspect the document, its title and attachment before sending; an autocomplete mistake can send it to the wrong person."
      ],
      [
        "Choose safer transfer channels",
        "Use a trusted service with access controls, encryption and clear retention arrangements. For particularly sensitive information, agree a separate secure channel rather than emailing the password with the protected file."
      ],
      [
        "Review access afterwards",
        "Remove temporary contractors or expired charity volunteers once the task ends. Keep a short record of important external sharing and check whether broad links remain available."
      ]
    ],
    "actions": [
      "Inspect the recipient before sending.",
      "Use named access and read-only permissions.",
      "Remove sharing access when finished."
    ],
    "refs": [
      "ico",
      "cloud"
    ]
  },
  {
    "slug": "minimise-customer-data",
    "title": "Collect only the customer data you actually need",
    "category": "Privacy & Data",
    "summary": "Reduce the consequences of a breach by avoiding unnecessary personal information.",
    "sections": [
      [
        "Map what you collect",
        "List the details your service genuinely needs for enquiries, delivery, billing and aftercare. Separate essential fields from nice-to-have information and explain their purpose in plain language."
      ],
      [
        "Avoid collecting secrets",
        "Do not ask customers to send passwords, recovery codes, full card numbers or unrelated identity documents in ordinary email. For technical support, request a description of the issue and only the evidence necessary to assess it."
      ],
      [
        "Apply a retention rule",
        "Decide how long different records are needed for lawful business purposes and when they should be securely erased. A full mailbox of old screenshots, copies of IDs and exported customer lists is an avoidable risk."
      ],
      [
        "Limit staff and tool access",
        "Keep customer data in approved systems and share it only with people who need it. Review connected apps, cloud exports and test environments so data is not duplicated into places you forget to protect."
      ]
    ],
    "actions": [
      "Remove unnecessary enquiry form fields.",
      "Set a practical retention schedule.",
      "Limit access to customer records."
    ],
    "refs": [
      "ico",
      "ico-check"
    ]
  },
  {
    "slug": "dispose-of-old-computers-safely",
    "title": "Prepare an old computer or phone for safe disposal",
    "category": "Privacy & Data",
    "summary": "Protect accounts and personal files when selling, donating or recycling a device.",
    "sections": [
      [
        "Back up and check before erasing",
        "Verify the important files, photos, bookmarks and software licences have moved to their new home. Keep the device until you have opened the backup and confirmed that your accounts work elsewhere."
      ],
      [
        "Sign out and remove account links",
        "Follow the manufacturer's official factory reset or secure erase instructions, and remove the device from account dashboards and find-my-device services where appropriate. Remove memory cards and SIMs."
      ],
      [
        "Understand storage differences",
        "Reset and secure erase procedures vary between solid-state drives, hard drives and mobile devices. When a device contains especially sensitive records or cannot be reliably erased, ask a qualified recycler about documented destruction."
      ],
      [
        "Keep the paperwork",
        "For business equipment, record its model, identifier, disposal date and approved method. Avoid placing confidential devices into general recycling without confirming how their storage is handled."
      ]
    ],
    "actions": [
      "Check the new device and backup first.",
      "Use the manufacturer's erase procedure.",
      "Record business-device disposal."
    ],
    "refs": [
      "ico",
      "devices"
    ]
  }
];
