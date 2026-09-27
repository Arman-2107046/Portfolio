/**
 * One definition of what a valid enquiry is, imported by both the form and the
 * server action.
 *
 * Written as plain functions rather than pulled from a validation library: the
 * whole schema is five fields, and the thing that actually matters here is that
 * the browser and the server agree — which a shared module gives, and a
 * dependency would only have wrapped.
 *
 * Every message says what happened and what to do about it. None of them tells
 * the reader they did something wrong.
 */

export const PROJECT_TYPES = [
  "A new build from scratch",
  "Rebuilding something that exists",
  "E-commerce or checkout work",
  "Analytics and conversion tracking",
  "Ongoing development and maintenance",
  "Something else",
] as const;

export const BUDGET_RANGES = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "Over $15,000",
  "Not sure yet",
] as const;

export type ContactFieldName = "name" | "email" | "projectType" | "budget" | "message";

export type ContactValues = Record<ContactFieldName, string>;

export const EMPTY_CONTACT: ContactValues = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
};

/** The field a bot fills in and a person never sees. */
export const HONEYPOT_FIELD = "company";

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 4000;

/**
 * Deliberately permissive. The only thing worth rejecting here is an address
 * that cannot be delivered to at all; anything stricter starts refusing valid
 * addresses, and the real confirmation that an address works is a reply.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(
  field: ContactFieldName,
  value: string,
): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (trimmed.length === 0) return "Add your name so I know who I am replying to.";
      if (trimmed.length > 100) return "Names here are capped at 100 characters.";
      return undefined;

    case "email":
      if (trimmed.length === 0) return "Add an email address so a reply can reach you.";
      if (!EMAIL_PATTERN.test(trimmed)) {
        return "This address is missing something — it needs the form name@example.com.";
      }
      return undefined;

    case "projectType":
      if (trimmed.length === 0)
        return "Pick the closest option. It does not lock anything in.";
      if (!PROJECT_TYPES.includes(trimmed as (typeof PROJECT_TYPES)[number])) {
        return "Pick one of the listed options.";
      }
      return undefined;

    case "budget":
      if (trimmed.length === 0) {
        return "Pick a range. 'Not sure yet' is a real answer and is on the list.";
      }
      if (!BUDGET_RANGES.includes(trimmed as (typeof BUDGET_RANGES)[number])) {
        return "Pick one of the listed ranges.";
      }
      return undefined;

    case "message":
      if (trimmed.length === 0) {
        return "Describe the project in a couple of sentences so the reply is useful.";
      }
      if (trimmed.length < MESSAGE_MIN) {
        return `A little more detail helps — ${MESSAGE_MIN - trimmed.length} more characters.`;
      }
      if (trimmed.length > MESSAGE_MAX) {
        return `This is longer than the ${MESSAGE_MAX}-character limit. Send the summary and the detail can follow by email.`;
      }
      return undefined;
  }
}

export const CONTACT_FIELDS: ContactFieldName[] = [
  "name",
  "email",
  "projectType",
  "budget",
  "message",
];

export function validateAll(
  values: ContactValues,
): Partial<Record<ContactFieldName, string>> {
  const errors: Partial<Record<ContactFieldName, string>> = {};
  for (const field of CONTACT_FIELDS) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
