export const social = [
  { url: "mailto:halehuyentrang305@gmail.com", name: "mail" },
  { url: "https://github.com/halehuyentrang305-wq", name: "github" },
  // TODO: add LinkedIn / X handles when available
  //{ url: "https://www.linkedin.com/in/...", name: "linkedin" },
  //{ url: "https://x.com/...", name: "x" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
