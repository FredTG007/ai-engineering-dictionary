---
title: Assertion-Based Evals
description: Deterministic code checks on model outputs, such as schema, regex, substring and execution tests, run before or instead of an LLM judge.
difficulty: intermediate
interview: "Your eval suite costs 400 dollars a week because an LLM judge grades every case, and the scores still wobble between runs. How would you restructure it to be cheaper and more stable?"
interviewAnswer: "Covers moving every checkable property into deterministic assertions such as JSON validity, required fields, forbidden phrases, length limits and executed code, running those first and for free on every change, and reserving the judge for the few subjective criteria that assertions cannot express."
buildThis:
  title: Replace a judge with thirty assertions
  goal: "Write a deterministic test suite for an LLM task and measure how much of a judge's work it can take over."
  steps:
    - Pick a task with structured output, such as extracting fields from a product description into JSON.
    - Collect forty outputs and list every failure you can describe as a rule, such as missing key, wrong type or price outside a range.
    - Implement each rule as a test function and run the suite over the forty outputs.
    - "Compare the suite's pass or fail verdicts with an LLM judge's verdicts and count the disagreements."
  skills:
    - Testing
    - JSON Schema
    - Regex
    - Python
  time: an afternoon
  stretch: Add a code-execution assertion that runs a generated SQL query against a sample database and checks the row count.
---

Assertion-based evals are checks on model output written as ordinary code: does the JSON parse, is the required key present, does the regex match, is the reply under a length, does the generated code run and pass a test. They are deterministic, cost nothing per case, and give the same answer every time. For many tasks they catch most failures before an [LLM-as-judge](./llm-as-judge.md) is needed at all.

Judges are expensive and noisy when used for everything. One team graded every case in a 3,000-item suite with a judge on each pull request. The bill reached 400 dollars a week and the headline score drifted by two or three points between identical runs, which made small regressions invisible. They read a sample of judge failures and found that most were things a rule could state: output not valid JSON, a date in the wrong format, a reply that mentioned a competitor, a summary longer than the source. Thirty assertions replaced the judge on 80 percent of cases. The suite ran in seconds, the cost dropped to a few dollars, and the judge was kept for tone and faithfulness only.

The cost hierarchy is the design principle. Run the cheapest check that can fail a case first, and only escalate what passes:

| Layer | Example | Cost per case |
| --- | --- | --- |
| Parse and schema | Valid JSON matching a [structured output](./structured-output.md) schema | Free |
| String rules | Required substring, forbidden phrase, regex for an order ID | Free |
| Execution | Generated code compiles and passes a unit test | Cents of compute |
| Reference comparison | Exact match or similarity against a known answer | Free to cheap |
| Judge | Faithfulness to context, tone, completeness | Model call |

Assertions are the right home for anything that is already a rule in the product. If the reply must never promise a refund outside policy, a phrase check is more reliable than asking a judge whether the tone was appropriate. If every number in an answer must come from a retrieved chunk, a substring check against the context is a crude but fast form of [citation verification](./citation-verification.md). Where a rule is too strict for free text, make it a warning rather than a failure and let the judge decide the borderline cases.

Because assertions are deterministic, they are what [regression evals](./regression-evals.md) and [canary prompts](./canary-prompts.md) should be built from. A judge score that moves by a point tells you little. An assertion that passed yesterday and fails today tells you exactly what changed. Keep the assertions in version control next to the prompt, and add a new one each time [evals](./evals.md) or production traces reveal a failure that a rule could have caught.

_Usage:_

- "Don't ask the judge if the JSON is valid. Parse it."
- "Thirty assertions replaced the judge on eighty percent of the suite and the bill went from four hundred a week to four."
- "Make the length limit a hard assertion and leave tone to the judge."
