/**
 * In-page navigation. `id` must match the id given to the corresponding
 * <Section> on the homepage — the active-section observer watches exactly
 * these, so a typo here means a nav item that never lights up.
 */
export type NavItem = {
  id: string;
  label: string;
};

export const navItems: NavItem[] = [
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
