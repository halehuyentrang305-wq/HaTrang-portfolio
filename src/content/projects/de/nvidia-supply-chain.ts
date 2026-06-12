import type { ProjectContent } from "../../types";

export default {
  title: "NVIDIA-Lieferketten-Analyse",
  theme: "dark",
  tags: ["python", "powerbi", "sql", "excel"],
  description:
    "Eine deskriptive Analyse der öffentlich berichteten Finanz- und Segmentdaten von NVIDIA, um zu verstehen, wie die Nachfrage im Rechenzentrumsgeschäft den Umsatzmix und die Lieferkette verändert hat.<br/><br/>Vollständig aus öffentlichen Berichten und Marktdaten erstellt – als lehrreiche Fallstudie auf Praktikumsniveau, ohne vertrauliche oder Insider-Informationen.",
  components: [
    {
      type: "text",
      props: {
        title: "Herausforderung",
        text: "Ich wollte verstreute öffentliche Finanz- und Marktdaten in ein klares Bild davon verwandeln, wie die stark steigende Nachfrage im Rechenzentrumsgeschäft die Lieferkette von NVIDIA prägte – über Schlagzeilen hinaus zu etwas, das ein Stakeholder direkt aus einem Dashboard ablesen kann.",
      },
    },
    {
      type: "list",
      props: {
        title: "Vorgehen",
        items: [
          "Quartalsweise Umsatz-, Bestands- und Segmentdaten aus öffentlichen Berichten gesammelt.",
          "Die Daten mit Python (pandas) und SQL-Abfragen bereinigt und strukturiert.",
          "Trend- und Korrelationsansichten über Segmente und Quartale in Power BI erstellt.",
          "Segmentwachstum mit öffentlich berichteten Lieferengpässen abgeglichen.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Wichtigste Erkenntnisse",
        items: [
          "Das Wachstum im Rechenzentrumssegment übertraf das Gaming-Segment deutlich und verschob den gesamten Umsatzmix.",
          "Bestände und Einkaufsverpflichtungen stiegen bereits vor den berichteten Nachfragespitzen.",
          "Der Druck auf die Lieferzeiten konzentrierte sich auf Komponenten in fortgeschrittenen Fertigungsknoten und im HBM-Umfeld.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Ergebnis",
        text: "Ich lieferte ein interaktives Dashboard und ein kurzes Zusammenfassungsmemo, das die Nachfragekonzentration und die daraus resultierenden Lieferrisiken hervorhebt. Aufbereitet war es für ein Stakeholder-Briefing, sodass sich eine komplexe Lieferketten-Geschichte in wenigen Minuten erfassen lässt.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologien & Skills",
        items: ["Python (Grundlagen)", "Power BI", "SQL", "Excel", "KI-gestützte Recherche"],
      },
    },
  ],
} as const satisfies ProjectContent;
