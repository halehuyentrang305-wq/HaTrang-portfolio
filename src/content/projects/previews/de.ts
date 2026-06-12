// NOTE: thumbnails are placeholders reusing existing template images.
// Replace with real project screenshots when available.
import thumbnailEvaluation from "../../../assets/thumbnails/quibbo.webp";
import thumbnailBusinessCase from "../../../assets/thumbnails/streakon.webp";
import thumbnailSupplyChain from "../../../assets/thumbnails/cubewar.webp";

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
