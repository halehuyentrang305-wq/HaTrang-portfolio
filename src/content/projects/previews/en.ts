// NOTE: thumbnails are placeholders reusing existing template images.
// Replace with real project screenshots when available.
import thumbnailEvaluation from "../../../assets/thumbnails/quibbo.webp";
import thumbnailBusinessCase from "../../../assets/thumbnails/streakon.webp";
import thumbnailSupplyChain from "../../../assets/thumbnails/cubewar.webp";

import type { ProjectPreview } from "../../types";

export default [
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
