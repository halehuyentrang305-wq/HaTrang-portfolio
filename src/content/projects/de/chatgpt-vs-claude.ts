import type { ProjectContent } from "../../types";

export default {
  title: "ChatGPT vs. Claude – Evaluierungs-Framework",
  theme: "dark",
  tags: ["chatgpt", "claude", "python", "excel"],
  description:
    "Ein leichtgewichtiges, reproduzierbares Framework zum Vergleich von ChatGPT und Claude bei alltäglichen Arbeitsaufgaben – Zusammenfassen, Schlussfolgern, Extrahieren, Umformulieren und Q&A – auf Basis eines festen Prompt-Sets und eines gemeinsamen Bewertungsrasters.<br/><br/>Ziel war es, eine \"aus dem Bauch heraus\" getroffene Modellwahl durch eine einfache, wiederholbare Bewertung zu ersetzen, die eine Praktikantin ohne ML-Infrastruktur durchführen kann.",
  components: [
    {
      type: "text",
      props: {
        title: "Herausforderung",
        text: "Teams wählten Sprachmodelle weiterhin nach dem ersten Eindruck aus, ohne eine faire oder wiederholbare Möglichkeit, Ergebnisse zu vergleichen. Ich brauchte eine Bewertung, die strukturiert genug war, um ihr zu vertrauen, aber schlank genug, um sie auf einem Laptop mit nur einer Tabelle und ein paar kleinen Skripten durchzuführen.",
      },
    },
    {
      type: "list",
      props: {
        title: "Vorgehen",
        items: [
          "5 Aufgabenkategorien definiert – Zusammenfassen, Schlussfolgern, Extrahieren, Umformulieren und Q&A – mit je 8 Prompts.",
          "Ein 1–5-Bewertungsraster für Genauigkeit, Vollständigkeit, Tonfall und Formattreue erstellt.",
          "Identische Prompts durch beide Modelle geschickt und die Ausgaben zur Reduktion von Verzerrungen blind bewertet.",
          "Jede Bewertung in einer strukturierten Tabelle erfasst und die Ergebnisse mit einem kleinen Python-Skript aggregiert.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Wichtigste Erkenntnisse",
        items: [
          "Claude schnitt bei längeren Zusammenfassungen und mehrstufigen Formatierungsvorgaben besser ab.",
          "ChatGPT war stärker bei kurzen kreativen Umformulierungen und schnellen Code-Snippets.",
          "Ein präziseres Bewertungsraster steigerte die Übereinstimmung zwischen den Bewertenden von 62 % auf 84 %.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Ergebnis",
        text: "Das Projekt lieferte eine wiederverwendbare Scorecard-Vorlage und ein kurzes Empfehlungsmemo. Das Team übernahm das Raster als Standardausgangspunkt für künftige Modellvergleiche und machte aus einer meinungsbasierten eine messbare Entscheidung.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologien & Skills",
        items: ["Prompt Engineering", "LLM-Evaluierung", "Python (Grundlagen)", "Excel", "Blind-Bewertungsraster"],
      },
    },
  ],
} as const satisfies ProjectContent;
