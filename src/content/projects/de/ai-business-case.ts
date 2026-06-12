import type { ProjectContent } from "../../types";

export default {
  title: "AI-Business-Case-Analyse",
  theme: "dark",
  tags: ["chatgpt", "powerbi", "sql", "excel"],
  description:
    "Eine datengestützte Analyse der Frage, ob ein mittelgroßer Einzelhändler einen KI-Assistenten für den Kundensupport einführen sollte – Lizenz- und Integrationskosten gegen Ticket-Entlastung und Auswirkungen auf die Kundenerfahrung abgewogen.<br/><br/>Ziel war eine klare, belastbare Ja/Nein-Empfehlung für die Stakeholder statt eines Verkaufsversprechens.",
  components: [
    {
      type: "text",
      props: {
        title: "Herausforderung",
        text: "Die Stakeholder wollten eine datengestützte Entscheidung über die Investition in einen KI-Support-Assistenten, doch die Grundlagen verteilten sich auf ein Jahr an Support-Tickets, Schätzungen zur Bearbeitungszeit und Anbieterangebote. Niemand hatte sie zu einer einzigen Sicht auf Kosten und Nutzen zusammengeführt.",
      },
    },
    {
      type: "list",
      props: {
        title: "Vorgehen",
        items: [
          "12 Monate an Support-Ticket-Daten gesammelt und per SQL nach Anliegen und Bearbeitungszeit segmentiert.",
          "Den automatisierbaren Ticketanteil durch Stichproben-Tagging einer repräsentativen Menge mit einem LLM geschätzt.",
          "Ein Kostenmodell in Excel erstellt, das Lizenzen, Integration und eingesparte Agentenstunden abbildet.",
          "Amortisationsdauer sowie Best-/Basis-/Worst-Case-Szenarien in Power BI visualisiert.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Wichtigste Erkenntnisse",
        items: [
          "Rund 38 % der Tickets waren wiederkehrende FAQ-artige Anfragen, die sich gut für Automatisierung eignen.",
          "Das Basis-Szenario erreichte nach etwa 9 Monaten den Break-even.",
          "Das Risiko für die Kundenzufriedenheit konzentrierte sich auf 3 komplexe Anliegenskategorien, die menschlich bearbeitet bleiben sollten.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Ergebnis",
        text: "Ich empfahl einen schrittweisen Rollout, beginnend mit der FAQ-Entlastung, während komplexe Fälle bei menschlichen Agenten bleiben. Geliefert wurde ein einseitiger Business Case, gestützt auf ein interaktives Power-BI-Dashboard, mit dem die Stakeholder die Szenarien selbst erkunden konnten.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologien & Skills",
        items: ["Business-Analyse", "Power BI", "SQL", "Excel", "Generative-KI-Anwendungen"],
      },
    },
  ],
} as const satisfies ProjectContent;
