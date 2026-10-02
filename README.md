# B1 Lesen Exam Studio

A web application designed for generating, storing, editing, previewing, and exporting 10 complete Goethe- / ÖSD-Zertifikat B1 **Modul Lesen** practice examination papers with official visual fidelity.

## Features

- **10 Complete, Authentic B1 Exam Sets**:
  - **Exams 1–10** cover distinct CEFR B1 everyday themes: *Wohnen gegen Hilfe, Ehrenamt, Ernährungs-Trends, Digitales Lernen, Bahnreisen & Nachtzüge, Sport & Firmenfitness, Musikfestivals & Kultur, Nachhaltigkeit & Repair-Cafés, Sprachkurse & Praktika, Gesunder Schlaf & Work-Life-Balance*.
  - Strictly follows Goethe-Institut / ÖSD test regulations:
    - **Teil 1** (10 min): 6 items (1–6, Richtig/Falsch) on personal correspondence (email/blog) + Beispiel (0).
    - **Teil 2** (20 min): 6 items (7–12, 3-option multiple choice a/b/c) across two authentic press articles + Beispiel (0).
    - **Teil 3** (10 min): 7 situations (13–19) matched with 10 advertisements (A–J) with torn-edge style and letter tabs. Contains exactly one unmatched situation (`answer = 0`) and one unused advertisement + Beispiel (0).
    - **Teil 4** (15 min): 7 reader opinions (20–26, Ja/Nein) on a controversial topic in *Leserbriefe* forum + Beispiel (0).
    - **Teil 5** (10 min): 4 items (27–30, 3-option MCQs) on a formal bordered & drop-shadowed *Hausordnung* regulation card.

- **Separate Official Answer Keys (Prüferblätter)**:
  - Downloadable separately from the question papers.
  - Includes compact solutions table (items 1–30 + examples).
  - High-fidelity filled-in scan-sheet mock (**Antwortbogen**) with official marked bubbles (`☒`), barcode, and evaluator signature lines.
  - Official score conversion table mapping raw scores (30 to 0) to scaled points (100 to 0), with passing threshold at 60% (18/30 raw).

- **Full In-App Editor**:
  - Live editing for all texts, instructions, items, options, ads, and rules.
  - Reordering, adding, deleting, and duplicating items with automatic renumbering.
  - Item shuffle mode without breaking numbering.
  - Per-exam style customizer (fonts: *Source Sans 3, Open Sans, Merriweather, Arial, Georgia*, font size, line height, header bar color, margins) with global sync.
  - Autosave to IndexedDB with 50-step undo/redo stack (`Ctrl+Z` / `Ctrl+Y`).

- **Interactive Student Test Runner**:
  - Live 65-minute countdown timer.
  - Interactive clickable bubble choices.
  - Instant grading against official CEFR B1 scoring criteria with pass/fail breakdown.

- **Export Capabilities**:
  - **PDF Export**: Print-ready A4 portrait papers with exact page breaks.
  - **DOCX Export**: Microsoft Word documents with shaded header bars, checkbox characters (`☐`, `☒`), and bordered tables.
  - **Bulk Export (ZIP)**: One-click streaming ZIP containing all 10 candidate papers and 10 answer keys.

- **Norm Validator**:
  - Enforces 30 items count, presence of Beispiele, single unused ad, unique matching letters, and CEFR B1 word count guidelines.
