import type { ProjectContent } from "../../types";

export default {
  title: "OEG Cyber Hub — F&B Ordering & Queue Management App",
  theme: "dark",
  tags: ["react", "vite", "firebase", "tailwind", "vercel"],
  live: "https://final-prj-self.vercel.app/",
  source: "https://github.com/sinhvien11-commits/final-prj",
  description:
    "A real-time web app that lets guests order food by table number while the kitchen and managers process orders live. I built the entire frontend and backend logic myself — from the data model and auth to the real-time order flow.<br/><br/>The goal was a single system that keeps guests, kitchen, and management in sync the moment an order changes, without anyone refreshing a page.",
  components: [
    {
      type: "text",
      props: {
        title: "Challenge",
        text: "A busy F&B spot needed guests to order from their table and the kitchen to react instantly, while managers kept an eye on the whole queue. That meant order state had to stay consistent across several screens at once, with clear roles for who could see and do what — all on a budget, with no dedicated backend team.",
      },
    },
    {
      type: "list",
      props: {
        title: "What I Built",
        items: [
          "Real-time order sync between guests and the kitchen via Firestore listeners, so status changes appear instantly on every screen.",
          "Role-based access for admin and kitchen using Firebase Auth plus a custom route guard, hardened with Security Rules and a composite index.",
          "A loyalty loop — reward points redeemable for vouchers, star ratings and written feedback, and a call-for-service request.",
          "Bilingual English–Vietnamese UI with react-i18next and audio order alerts via the Web Audio API.",
        ],
      },
    },
    {
      type: "list",
      props: {
        title: "Highlights",
        items: [
          "Owned the full stack end to end: React + Vite frontend and all Firebase backend logic.",
          "Modelled Firestore data and Security Rules so each role only reads and writes what it should.",
          "Shipped to production on Vercel with a fast, mobile-first ordering flow.",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Outcome",
        text: "The result is a production-ready ordering system where a guest places an order and the kitchen sees it in the same second, with loyalty and feedback built in to bring guests back. It became my main showcase for full-stack development with React and Firebase.",
      },
    },
    {
      type: "list",
      props: {
        title: "Technologies & Skills",
        items: ["React", "Vite", "Firebase (Firestore, Auth)", "Tailwind CSS", "Vercel", "Real-time Systems", "react-i18next"],
      },
    },
  ],
} as const satisfies ProjectContent;
