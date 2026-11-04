---
title: Multimodal
description: Models and systems that accept or produce more than text, such as images, audio, PDFs, or video, within a single interaction.
difficulty: beginner
interview: "Users want to upload photos of receipts and ask questions about them. What changes when your text-only pipeline becomes multimodal?"
interviewAnswer: "Covers images costing many tokens and adding latency, file size and format limits, and choosing between a vision model and OCR first. Mentions errors on blurry or rotated images, validating extracted numbers, privacy of uploads, and evals built from real images."
---

A multimodal model can take in, and sometimes produce, more than one kind of data, such as text, images, audio, or video. In practice most production use today is text plus images or documents as input: screenshots, scanned forms, charts, photos of receipts, and PDFs whose layout matters. Some models also handle audio directly, which overlaps with [voice agents](./voice-agents.md) that otherwise chain [speech-to-text](./speech-to-text.md) and text models together.

Multimodal input often replaces brittle pipelines. A team processing supplier invoices used OCR to extract text and then asked a text model to find totals; it regularly confused line items because the table layout was lost in extraction. Sending the page image directly to a multimodal model, with a [structured output](./structured-output.md) schema for the fields, cut extraction errors substantially and removed an entire preprocessing service.

Images and documents are expensive in tokens. Each image is converted into a number of tokens that depends on its resolution, and a multi-page PDF can consume a large share of the [context window](./context-window.md) before any question is asked. The same invoice team found that sending full-resolution scans tripled their cost with no accuracy gain over a moderately downscaled version. Resizing, cropping to the relevant region, and sending only the needed pages are the main cost controls.

Multimodal models have characteristic failure modes. They can misread small text, miscount objects, invent details in blurry regions, and struggle with dense charts, all forms of [hallucination](./hallucination.md) that are harder to spot than in text because reviewers do not always look at the source image. Build [evals](./evals.md) with real samples from production, including bad scans, rotated pages, and handwriting, rather than clean examples.

Images are also a new route for [prompt injection](./prompt-injection.md). Text embedded in an uploaded image, such as a screenshot containing hidden instructions, is read by the model just like typed text. Treat content extracted from images as untrusted input with the same caution as retrieved web pages.

_Usage:_

- "Skip the OCR step and send the page image with the schema; it reads tables better."
- "Downscale the scans first, full resolution is burning tokens for nothing."
- "Someone uploaded a screenshot with instructions in it and the bot followed them."
