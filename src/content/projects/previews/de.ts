import thumbnailEvaluation from "../../../assets/images/projects/project1.png";
import thumbnailBusinessCase from "../../../assets/images/projects/project2.png";
import thumbnailSupplyChain from "../../../assets/images/projects/project3.png";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "ChatGPT vs. Claude – Evaluierungs-Framework",
    slug: "chatgpt-vs-claude",
    thumbnail: thumbnailEvaluation,
    description: "Framework zur LLM-Evaluierung",
  },
  {
    title: "AI-Business-Case-Analyse",
    slug: "ai-business-case",
    thumbnail: thumbnailBusinessCase,
    description: "Business Case zur KI-Einführung",
  },
  {
    title: "NVIDIA-Lieferketten-Analyse",
    slug: "nvidia-supply-chain",
    thumbnail: thumbnailSupplyChain,
    description: "Datenanalyse der Lieferkette",
  },
] as const satisfies ProjectPreview[];
