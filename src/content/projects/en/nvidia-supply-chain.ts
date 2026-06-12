import type { ProjectContent } from "../../types";

export default {
  title: "NVIDIA Supply Chain Analysis",
  theme: "dark",
  tags: ["python", "powerbi", "sql", "excel"],
  description:
    "A descriptive analysis of NVIDIA's publicly reported financial and segment data to understand how data-center demand was reshaping its revenue mix and supply chain.<br/><br/>Built entirely from public filings and market data as an educational, intern-level case study — no proprietary or insider information.",
  components: [
    {
      type: "text",
      props: {
        title: "Challenge",
        text: "I wanted to turn scattered public financial and market data into a clear picture of how surging data-center demand was shaping NVIDIA's supply chain — moving past headlines to something a stakeholder could actually read off a dashboard.",
      },
    },
    {
      type: "list",
      props: {
        title: "Methodology",
        items: [
          "Collected quarterly revenue, inventory, and segment data from public filings.",
          "Cleaned and structured the data with Python (pandas) and SQL queries.",
          "Built trend and correlation views in Power BI across segments and quarters.",
          "Cross-referenced segment growth against publicly reported supply constraints.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Key Findings",
        items: [
          "Data-center segment growth sharply outpaced gaming, shifting the overall revenue mix.",
          "Inventory and purchase commitments rose ahead of reported demand spikes.",
          "Lead-time pressure clustered around advanced-node and HBM-related components.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Outcome",
        text: "I delivered an interactive dashboard and a short summary memo highlighting demand concentration and the resulting supply risks. It was framed for a stakeholder briefing, making a complex supply story easy to scan in a few minutes.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologies & Skills",
        items: ["Python (Basic)", "Power BI", "SQL", "Excel", "AI-assisted Research"],
      },
    },
  ],
} as const satisfies ProjectContent;
