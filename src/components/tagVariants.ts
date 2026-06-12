export type TagVariant =
  | "three"
  | "websockets"
  | "react"
  | "redis"
  | "gray"
  | "html"
  | "css"
  | "javascript"
  | "node"
  | "next"
  | "kubernetes"
  | "postgresql"
  | "ogl"
  | "glsl"
  | "chatgpt"
  | "claude"
  | "python"
  | "powerbi"
  | "sql"
  | "excel";

export const tagLabels = {
  three: "Three.js",
  websockets: "WebSockets",
  react: "React",
  redis: "Redis",
  gray: "Gray",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  node: "Node.js",
  next: "Next.js",
  kubernetes: "Kubernetes",
  postgresql: "PostgreSQL",
  ogl: "OGL.js",
  glsl: "GLSL",
  chatgpt: "ChatGPT",
  claude: "Claude",
  python: "Python",
  powerbi: "Power BI",
  sql: "SQL",
  excel: "Excel",
} as const satisfies Record<TagVariant, string>;
