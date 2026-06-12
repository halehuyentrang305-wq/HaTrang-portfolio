import type { ProjectContent } from "../../types";

export default {
  title: "AI Business Case Analysis",
  theme: "dark",
  tags: ["chatgpt", "powerbi", "sql", "excel"],
  description:
    "A data-backed analysis of whether a mid-size retailer should adopt an AI assistant for customer support, weighing licensing and integration cost against ticket deflection and customer-experience impact.<br/><br/>The aim was to give stakeholders a clear, defensible yes/no recommendation instead of a vendor sales pitch.",
  components: [
    {
      type: "text",
      props: {
        title: "Challenge",
        text: "Stakeholders wanted a data-backed decision on investing in an AI support assistant, but the inputs were scattered across a year of support tickets, agent time estimates, and vendor quotes. Nobody had pulled them into a single view of cost versus benefit.",
      },
    },
    {
      type: "list",
      props: {
        title: "Methodology",
        items: [
          "Gathered 12 months of support-ticket data and segmented it by intent and resolution time using SQL.",
          "Estimated the automatable share of tickets by sample-tagging a representative set with an LLM.",
          "Built a cost model in Excel covering licensing, integration, and projected agent hours saved.",
          "Visualised payback period and best/base/worst-case sensitivity scenarios in Power BI.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Key Findings",
        items: [
          "About 38% of tickets were repetitive, FAQ-style queries well suited to automation.",
          "The base-case scenario reached break-even at roughly 9 months.",
          "Customer-satisfaction risk was concentrated in 3 complex intent categories that should stay human-handled.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Outcome",
        text: "I recommended a phased rollout starting with FAQ deflection and keeping complex cases with human agents. The work was delivered as a one-page business case backed by an interactive Power BI dashboard for stakeholders to explore the scenarios themselves.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologies & Skills",
        items: ["Business Analysis", "Power BI", "SQL", "Excel", "Generative AI Applications"],
      },
    },
  ],
} as const satisfies ProjectContent;
