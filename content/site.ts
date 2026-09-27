import type { Site } from "./types";

export const site: Site = {
  name: "Arman Rahman Rafi",
  shortName: "Arman Rahman Rafi",
  role: "Full-Stack Web Developer",

  /**
   * Split into the lines it reveals as, rather than relying on where the
   * browser happens to wrap. The break after "whole system," is the point of
   * the sentence, so it is a content decision, not a layout accident.
   */
  headline: [
    { text: "I build the" },
    { text: "whole system," },
    { text: "not the", accentWord: "screens" },
    { text: "only." },
  ],

  tagline:
    "Schema, application, server, and the analytics that prove it worked. One person, end to end.",

  credibility: [
    { label: "Studying", value: "CSE at KUET" },
    { label: "Shipped", value: "Six platforms" },
    { label: "Based in", value: "Khulna, BD" },
  ],

  email: "armanr.rafi@gmail.com",
  location: "Khulna, Bangladesh",
  timeZone: "Asia/Dhaka",

  availability: {
    open: true,
    label: "Available for new work",
    detail:
      "Taking on one or two builds at a time, so the one in front of me gets the whole week.",
  },

  socials: [
    { label: "GitHub", href: "https://github.com/Arman-2107046" },
    { label: "Email", href: "mailto:armanr.rafi@gmail.com" },
  ],

  baseUrl: "https://armanrahmanrafi.com",

  metaDescription:
    "Full-stack web developer in Khulna, Bangladesh. I design the schema, write the application, provision the server, and wire the measurement — so one person owns the system end to end.",
};
