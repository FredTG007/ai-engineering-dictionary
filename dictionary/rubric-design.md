---
title: Rubric Design
description: Writing the scored criteria a human grader or LLM judge applies to an output, so that scores mean the same thing every time.
difficulty: intermediate
interview: "Your LLM judge rates almost every support reply 8 out of 10, yet users keep complaining. How would you redesign the rubric so it separates good replies from bad ones?"
interviewAnswer: "Covers replacing a single vague scale with several binary, checkable criteria written in concrete language, grounding each criterion in a real failure seen in traces, labelling a sample by hand to calibrate the judge against people, and reporting agreement with human labels before trusting the scores."
buildThis:
  title: Rewrite a vague rubric into binary checks and measure agreement
  goal: Turn a one-to-ten quality score into five yes-or-no criteria and compare judge scores with your own labels.
  steps:
    - Collect thirty real or realistic outputs from a task you run and label each one good or bad yourself, with a one-line reason.
    - Write five binary criteria in concrete language that would have caught the bad ones.
    - Run an LLM judge over the thirty outputs with both the original one-to-ten rubric and the new binary rubric.
    - Compute agreement with your labels for each rubric and note which criterion the judge gets wrong most.
  skills:
    - LLM-as-judge
    - Labelling
    - Python
  time: an afternoon
  stretch: Add two deliberately borderline outputs and tighten the wording of whichever criterion splits on them.
---

Rubric design is the work of writing down exactly what a grader should check in an output and how to score it. The grader may be a person or an [LLM-as-judge](./llm-as-judge.md), and in both cases the rubric decides whether the score measures what you care about or something vaguer. A rubric is the part of an eval that is easiest to write badly and hardest to notice when you have.

The most common failure is a single wide scale. One team asked a judge to rate support replies for helpfulness from 1 to 10. After two weeks the average sat at 8.1 with almost no variance, while the thumbs-down rate in production had doubled. Reading the judged outputs showed why: a reply that quoted the wrong refund window scored 8 because it was polite, well formatted and confident. The rubric never said that the refund window had to be correct, so the judge rewarded everything else.

Binary criteria beat scales. A judge asked "does the reply state the refund window from the retrieved policy, yes or no" gives an answer you can check, argue about and count. A judge asked for a 7 or an 8 gives a number nobody can verify. Split quality into several yes-or-no questions, each tied to a failure you have actually seen in [error analysis](./error-analysis.md), and report them separately rather than averaging them into one score.

| Vague criterion | Concrete replacement |
| --- | --- |
| Answer is helpful | Answer addresses every question the user asked |
| Tone is appropriate | No blame, no exclamation marks, no promises outside policy |
| Uses the context well | Every number in the reply appears in a retrieved chunk |
| Response is concise | Under 120 words unless the user asked for detail |

Calibrate the rubric against people before trusting it. Label 50 to 100 outputs by hand, run the judge with the rubric, and measure agreement per criterion. A criterion where the judge and the humans disagree a third of the time is badly worded, not a sign that the model is bad at judging. Rewrite it with an example of a pass and a fail and measure again. Keep the labelled set as part of the [golden dataset](./golden-dataset.md) so later rubric changes can be checked the same way.

Rubrics belong wherever a model grades a model. The same criteria drive [pairwise evals](./pairwise-evals.md), a [reflection](./reflection.md) pass that checks a draft before the user sees it, and the judge in CI. Where a criterion can be reduced to a rule, move it out of the rubric into an [assertion-based eval](./assertion-based-evals.md), which is cheaper and never changes its mind. The rubric should hold only what genuinely needs judgement.

_Usage:_

- "Everything scores an 8. The rubric is measuring politeness, not correctness."
- "Make it a yes-or-no question: does the reply quote the policy number or not?"
- "Judge and humans disagree on criterion three a third of the time. Reword it before we trust it."
