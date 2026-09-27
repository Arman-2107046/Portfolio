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
    { text: "not just the" },
    { text: "", accentWord: "screens." },
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

  about: [
    "I work on one or two builds at a time. The reason is not availability, it is that the interesting problems in this work are rarely in the feature list — they are in the schema someone chose in week one, or in the deploy that cannot be rolled back, and finding those takes uninterrupted attention rather than a slot in a rotation.",
    "I am studying computer science and engineering at KUET, which mostly means I am being taught why the things I had already been doing for clients work, and occasionally that they do not. The overlap between the two is smaller than I expected and more useful than I expected.",
    "The work I like most is the kind where the brief is wrong. A client asks for a redesign and the problem is the information architecture; a client asks for faster checkout and the problem is that the conversion data has been lying for a year. Saying so early is usually the most valuable thing I do on a project, and it is also the part that has to be earned before anyone believes it.",
  ],

  portrait: {
    src: "/portrait.png",
    alt: "Arman Rahman Rafi",
    width: 1000,
    height: 1250,
  },

  metaDescription:
    "Full-stack web developer in Khulna, Bangladesh. I design the schema, write the application, provision the server, and wire the measurement — so one person owns the system end to end.",
};
