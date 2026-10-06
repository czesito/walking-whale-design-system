# English writing

> Applies to everything Walking Whale publishes in English: website, proposals, decks, documents, social posts, email.
> The base is *The Chicago Manual of Style* (18th edition) with Merriam-Webster for spelling. This file records only Walking Whale's choices and exceptions (DR-009). Voice is in [voice.md](voice.md); terms to use and avoid are in [glossary.csv](glossary.csv).

## Spelling and capitalization

1. US spelling: color, organization, center.
2. Headings use sentence case and take no closing period. Question marks are fine.
3. Write kickers in sentence case in the source. The `.ww-kicker` style uppercases them, and Chinese kickers stay as written.
4. Keep the owner's capitalization for names: AI, LINE, WhatsApp, SaaS, iOS.
5. Lowercase common tech words: internet, email, website, app.
6. Walking Whale is never written in all caps in running text. All caps belong only to the logo and kickers.

## Punctuation

1. Use the serial (Oxford) comma.
2. **Exception to Chicago:** set em dashes with a space on each side — like this. This matches the existing site copy.
3. Use an en dash for ranges in tables and lists (2025–2026, Oct 7–9). In running text, write "from October 7 to 9".
4. No exclamation marks and no emoji.
5. Contractions are welcome: we're, don't, you'll.

## Numbers

1. **Exception to Chicago:** spell out one to nine in running text and use numerals for 10 and above.
2. Always use numerals for measurements, money, percentages, dates, times and versions: 3 GB, 5%, v0.1.
3. Use the percent sign: 30%.
4. Money: NT$1,200 and US$480. In formal documents, the first mention may read "NT$1,200 (New Taiwan dollars)".

## Dates and times

| Context | Format | Example |
|---|---|---|
| Running text | Month D, YYYY | October 7, 2026 |
| With weekday | Weekday, Month D, YYYY | Wednesday, October 7, 2026 |
| Lists, tables, UI | Mon D, YYYY | Oct 7, 2026 |
| Weekday abbreviations | Three letters | Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| Month abbreviations | Three letters, no period | Sep (not Sept), Oct |
| Time | h:mm am/pm, lowercase, no periods | 2:30 pm |

**Exception to Chicago:** write am and pm without periods. Add "Taipei time (GMT+8)" whenever the reader may be outside Taiwan.

## People and pronouns

1. Write as we (Walking Whale) to you (the reader or their team).
2. In marketing and proposals, call clients partners, teams or founders, never users or customers. Product UI may say users when it refers to accounts.
3. Write each person's name the way they write it themselves.

## Lists and links

1. List items that are fragments take no period; full sentences do. Keep one style per list.
2. Link text says where the link goes. Never write "click here".

## Check

`npm run check` runs `scripts/copy-lint.mjs` over specimens, components and documents. For English text it flags exclamation marks, emoji and the avoid list in glossary.csv. Run it on any file with `node scripts/copy-lint.mjs path/to/file`.
