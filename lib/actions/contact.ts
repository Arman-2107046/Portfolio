"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { site } from "@/content/site";
import {
  CONTACT_FIELDS,
  EMPTY_CONTACT,
  HONEYPOT_FIELD,
  type ContactFieldName,
  type ContactValues,
  validateAll,
} from "@/lib/contact-schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Shown above the form. Never blames the sender. */
  message?: string;
  fieldErrors?: Partial<Record<ContactFieldName, string>>;
  /** Echoed back so a failed submit does not empty the form. */
  values?: ContactValues;
};

/**
 * A small in-memory limit: five submissions per address per hour.
 *
 * Honest about what this is — it lives in one server instance's memory, so on a
 * platform running several instances it limits per instance, and it resets on
 * deploy. For a personal contact form that is the right amount of engineering:
 * it stops a script hammering one box, and the honeypot handles the traffic
 * that actually turns up. A shared store is the answer only if this ever needs
 * to be a real guarantee.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const attempts = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function readValues(formData: FormData): ContactValues {
  const values: ContactValues = { ...EMPTY_CONTACT };
  for (const field of CONTACT_FIELDS) {
    const raw = formData.get(field);
    values[field] = typeof raw === "string" ? raw : "";
  }
  return values;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = readValues(formData);

  // The honeypot: a field no human sees, so anything in it came from something
  // filling every input on the page. Answered with success rather than an
  // error, because telling a bot which check it failed is how it gets fixed.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  const fieldErrors = validateAll(values);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "A couple of fields need another look before this can send.",
      fieldErrors,
      values,
    };
  }

  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(key)) {
    return {
      status: "error",
      message: `That is several messages in a short space of time, so this one was held. Email ${site.email} directly and it will come straight through.`,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Fail closed, and say so. A form that silently swallows enquiries because a
  // key is missing is worse than no form at all — and the person has already
  // written the message, so the fallback has to be a real way to send it.
  if (!apiKey || !from) {
    return {
      status: "error",
      message: `The form is not connected to its mail service yet. Send this to ${site.email} and it will reach me.`,
      values,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: site.email,
      replyTo: values.email,
      subject: `Enquiry from ${values.name} — ${values.projectType}`,
      html: [
        `<p><strong>From:</strong> ${escapeHtml(values.name)} (${escapeHtml(values.email)})</p>`,
        `<p><strong>Project type:</strong> ${escapeHtml(values.projectType)}</p>`,
        `<p><strong>Budget:</strong> ${escapeHtml(values.budget)}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${escapeHtml(values.message).replace(/\n/g, "<br>")}</p>`,
      ].join(""),
    });

    if (error) throw new Error(error.message);

    return {
      status: "success",
      message: "Sent. You will get a reply within one working day.",
    };
  } catch {
    // The specific failure is the server's problem, not the sender's. What they
    // need is the message they just wrote, still in the form, and another way
    // to send it.
    return {
      status: "error",
      message: `That did not send, and the fault is at my end rather than yours. Your message is still here, and ${site.email} always works.`,
      values,
    };
  }
}
