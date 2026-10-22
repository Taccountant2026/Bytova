# Bytova campaign review pack

Draft for owner approval. No posts, messages, mailing list, ads, spend or schedules have been activated. Public destinations need to be deployed and checked before publishing. Source snapshot checked 22 October 2026; review due 29 October 2026. Recheck official guidance before any post.

Open `graphics-gallery.html` in a browser for a labelled review gallery. `contact-sheet.png` gives a compact overview. Each of three themes has four exact shapes:

| Suffix | Dimensions | Suggested placement |
| --- | --- | --- |
| `square` | 1080 × 1080 | Facebook or square social post |
| `portrait` | 1080 × 1350 | Portrait feed post |
| `story` | 1080 × 1920 | Story-style placement |
| `landscape` | 1200 × 630 | LinkedIn or link-sharing graphic |

The themes are `check-php`, `backports-matter` and `safe-update-plan`. Every design is supplied as PNG and editable SVG. `website-banner` is 1600 × 320. Review final cropping and readability inside the actual platform composer; these dimensions alone do not establish platform-policy eligibility.

`alt-text.json` contains descriptive alternative text for all 13 designs. `campaign.md` contains all post drafts, an email bulletin, community contribution copy, video scripts, optional paid-copy notes, release gates and a recognition plan. `optional-search-ad.json` is disabled at £0; its candidates fit the standard 30-character headline and 90-character description boundaries. Live policy review and explicit owner activation approval remain separate gates.

`outcomes.csv` is an empty ledger for actual observations after launch. An enquiry click is not a received lead, booking or sale; a checker use is not proof of a patched website. `portfolio-case-study.md` is a project account with those limits stated explicitly.

The retained Bytova logo and original Inter font files are embedded in the SVGs. The Inter licence is in `FONT-LICENSE.txt`. `generate-assets.py` reproduces the graphics from the existing repository assets and reviewed advisory JSON using Pillow and fontTools. If the optional Python Brotli binding is missing, the script uses the installed Node runtime’s Brotli decoder; it does not download assets or call an external design service. Save operations use atomic replacements to avoid incomplete files being observed during regeneration.

From the repository root:

```bash
python3 security-release/campaign/generate-assets.py
python3 security-release/campaign/validate-assets.py
```

The validation script checks every expected PNG’s dimensions and integrity, SVG XML, alternative text, disabled ad budget and copy lengths. It writes `validation.json`. The generator also checks every text line’s canvas bounds. Visual review is still required and was performed on the overview and representative full-size designs.
