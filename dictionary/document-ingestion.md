---
title: Document Ingestion
description: The pipeline that turns PDFs, web pages and other sources into clean, structured text and metadata ready for retrieval.
difficulty: intermediate
interview: "Your RAG bot gives wrong prices because answers come from a PDF price list whose tables were extracted as jumbled text. How would you redesign ingestion and catch this earlier?"
interviewAnswer: "Covers choosing parsers that keep layout and tables, or OCR and vision models for scanned pages, preserving headings and table structure into chunks, attaching metadata such as source, date and permissions, deduplication and incremental re-indexing, and spot-checking parsed output with retrieval evals."
buildThis:
  title: Parse messy PDFs into clean chunks with metadata
  goal: Extract text from raw PDF files, strip unwanted headers and footers, and split them into structured chunks.
  steps:
    - Use a PDF parser library to extract raw text and page numbers from sample documents.
    - Write cleaning functions to remove repeated headers, footers, and page numbers.
    - Split the cleaned text into paragraphs with associated source metadata.
  skills:
    - PDF Parsing
    - Regex
    - Data Cleaning
  time: an afternoon
  stretch: Export the chunks into a structured JSON format ready for vector database insertion.
---

Document ingestion is everything that happens between a source file and a searchable index: fetching documents, parsing them into text, cleaning that text, attaching metadata and handing it to [chunking](./chunking.md) and [embeddings](./embeddings.md). In a [RAG](./rag.md) system it is the least glamorous stage and often the one causing the wrong answers.

Parsing is where most quality is lost. A PDF stores characters and their positions on the page, not paragraphs or tables, so a naive extractor can merge two columns line by line, drop table borders so cells run together, or repeat headers and footers on every page. One team's assistant quoted wrong prices because the price list's table came out as one long run of numbers; the right chunk was retrieved, but it was unreadable. Scanned documents add OCR errors on top.

| Source | Common problem | Typical approach |
|---|---|---|
| Text PDFs | Columns merged, tables flattened | Layout-aware parser, table extraction |
| Scanned PDFs, images | No text layer | OCR or a [multimodal](./multimodal.md) model |
| HTML pages | Menus, cookie banners, footers | Boilerplate removal, keep headings |
| Slides and spreadsheets | Meaning lives in layout | Convert per slide or per sheet with labels |
| Wikis and tickets | Duplicates and stale copies | Deduplicate, keep last-modified date |

Structure is worth keeping. Headings, list nesting and table rows tell the chunker where sensible boundaries are, and a chunk that carries its section heading retrieves far better than an orphaned paragraph. Converting everything to Markdown-like text with headings and tables intact is a common middle ground.

Metadata is captured here or not at all. Source URL, document date, product, language and access permissions all feed [metadata filtering](./metadata-filtering.md) and citations later. Missing permissions at ingestion time is how internal-only documents end up in answers to customers.

Ingestion also has to run continuously. Documents change, so pipelines need incremental updates, deletion of removed sources and a record of which parser version produced each chunk. Spot-check parsed output by eye, and track [retrieval metrics](./retrieval-metrics.md) after parser changes, because a parser upgrade can silently change every chunk in the index.

_Usage:_

- "Open the parsed text before blaming the embeddings. The table is soup."
- "We re-ingested with the layout-aware parser and the pricing questions started working."
- "Ingestion drops the permissions field, so we can't filter by team yet."
