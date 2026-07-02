import type { ProjectContent } from "../../types";

export default {
  title: "OEG Cyber Hub — F&B-Bestell- & Warteschlangen-App",
  theme: "dark",
  tags: ["react", "vite", "firebase", "tailwind", "vercel"],
  live: "https://final-prj-self.vercel.app/",
  source: "https://github.com/sinhvien11-commits/final-prj",
  description:
    "Eine Echtzeit-Web-App, mit der Gäste per Tischnummer Speisen bestellen, während Küche und Management die Bestellungen live abwickeln. Ich habe das gesamte Frontend und die Backend-Logik selbst entwickelt – vom Datenmodell über die Authentifizierung bis zum Echtzeit-Bestellablauf.<br/><br/>Ziel war ein einziges System, das Gäste, Küche und Management in dem Moment synchron hält, in dem sich eine Bestellung ändert, ohne dass jemand die Seite neu laden muss.",
  components: [
    {
      type: "text",
      props: {
        title: "Herausforderung",
        text: "Ein stark frequentierter F&B-Betrieb wollte, dass Gäste direkt am Tisch bestellen und die Küche sofort reagiert, während das Management die gesamte Warteschlange im Blick behält. Der Bestellstatus musste also über mehrere Bildschirme hinweg konsistent bleiben, mit klaren Rollen dafür, wer was sehen und tun darf – und das mit knappem Budget und ohne eigenes Backend-Team.",
      },
    },
    {
      type: "list",
      props: {
        title: "Was ich gebaut habe",
        items: [
          "Echtzeit-Synchronisation der Bestellungen zwischen Gästen und Küche über Firestore-Listener, sodass Statusänderungen sofort auf jedem Bildschirm erscheinen.",
          "Rollenbasierter Zugriff für Admin und Küche mit Firebase Auth plus eigenem Route Guard, abgesichert durch Security Rules und einen Composite Index.",
          "Ein Loyalty-Kreislauf – Bonuspunkte einlösbar gegen Gutscheine, Sternebewertungen und schriftliches Feedback sowie ein Serviceruf.",
          "Zweisprachige Oberfläche Englisch–Vietnamesisch mit react-i18next und akustische Bestellhinweise über die Web Audio API.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Highlights",
        items: [
          "Den kompletten Stack von Anfang bis Ende verantwortet: React-+-Vite-Frontend und die gesamte Firebase-Backend-Logik.",
          "Firestore-Datenmodell und Security Rules so gestaltet, dass jede Rolle nur das liest und schreibt, was sie soll.",
          "Mit einem schnellen, mobil-optimierten Bestellablauf auf Vercel in Produktion gebracht.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Ergebnis",
        text: "Das Ergebnis ist ein produktionsreifes Bestellsystem, bei dem ein Gast eine Bestellung aufgibt und die Küche sie in derselben Sekunde sieht – mit integriertem Loyalty- und Feedback-System, das Gäste zurückbringt. Es wurde zu meinem wichtigsten Vorzeigeprojekt für Full-Stack-Entwicklung mit React und Firebase.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologien & Skills",
        items: ["React", "Vite", "Firebase (Firestore, Auth)", "Tailwind CSS", "Vercel", "Echtzeit-Systeme", "react-i18next"],
      },
    },
  ],
} as const satisfies ProjectContent;
