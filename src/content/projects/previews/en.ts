import thumbnailOegCyberHub from "../../../assets/images/projects/oeg-cyber-hub.svg";
import thumbnailEvaluation from "../../../assets/images/projects/project1.png";
import thumbnailBusinessCase from "../../../assets/images/projects/project2.png";
import thumbnailSupplyChain from "../../../assets/images/projects/project3.png";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "OEG Cyber Hub — F&B Ordering & Queue Management App",
    slug: "oeg-cyber-hub",
    thumbnail: thumbnailOegCyberHub,
    description: "Real-time F&B ordering app",
  },
  {
    title: "ChatGPT vs Claude Evaluation Framework",
    slug: "chatgpt-vs-claude",
    thumbnail: thumbnailEvaluation,
    description: "LLM evaluation framework",
  },
  {
    title: "AI Business Case Analysis",
    slug: "ai-business-case",
    thumbnail: thumbnailBusinessCase,
    description: "AI adoption business case",
  },
  {
    title: "NVIDIA Supply Chain Analysis",
    slug: "nvidia-supply-chain",
    thumbnail: thumbnailSupplyChain,
    description: "Supply chain data analysis",
  },
] as const satisfies ProjectPreview[];
