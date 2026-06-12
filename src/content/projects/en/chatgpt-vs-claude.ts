import type { ProjectContent } from "../../types";

export default {
  title: "ChatGPT vs Claude Evaluation Framework",
  theme: "dark",
  tags: ["chatgpt", "claude", "python", "excel"],
  description:
    "A lightweight, reproducible framework for comparing ChatGPT and Claude across everyday work tasks — summarization, reasoning, extraction, rewriting, and Q&A — using a fixed prompt set and a shared scoring rubric.<br/><br/>The goal was to replace \"gut feel\" model choices with a simple, repeatable evaluation an intern could run end to end without any ML infrastructure.",
  components: [
    {
      type: "text",
      props: {
        title: "Challenge",
        text: "Teams kept picking a language model based on first impressions, with no fair or repeatable way to compare outputs. I needed an evaluation that was structured enough to trust, but light enough to run on a laptop with just a spreadsheet and a few small scripts.",
      },
    },
    {
      type: "list",
      props: {
        title: "Methodology",
        items: [
          "Defined 5 task categories — summarization, reasoning, extraction, rewriting, and Q&A — with 8 prompts each.",
          "Built a 1–5 rubric scoring accuracy, completeness, tone, and format adherence.",
          "Ran identical prompts through both models and blind-labelled the outputs to reduce bias.",
          "Logged every score in a structured spreadsheet and aggregated the results with a small Python script.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Key Findings",
        items: [
          "Claude scored higher on long-form summarization and multi-step formatting instructions.",
          "ChatGPT was stronger on short creative rewrites and quick code snippets.",
          "Tightening the rubric raised inter-rater agreement from 62% to 84%.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Outcome",
        text: "The project produced a reusable scorecard template and a short recommendation memo. The team adopted the rubric as its default starting point for future model comparisons, turning an opinion-based decision into a measured one.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologies & Skills",
        items: ["Prompt Engineering", "LLM Evaluation", "Python (Basic)", "Excel", "Blind scoring rubric design"],
      },
    },
  ],
} as const satisfies ProjectContent;
