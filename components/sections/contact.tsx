"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { CopyEmail } from "@/components/ui/copy-email";
import { site } from "@/content/site";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import {
  BUDGET_RANGES,
  EMPTY_CONTACT,
  HONEYPOT_FIELD,
  PROJECT_TYPES,
  validateField,
  type ContactFieldName,
} from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

const INITIAL: ContactState = { status: "idle" };

type FieldErrors = Partial<Record<ContactFieldName, string>>;

/** Shared look for inputs and selects, so the two cannot drift apart. */
const CONTROL = [
  "type-body bg-canvas mt-[var(--space-2)] w-full rounded-xs border",
  "px-[var(--space-3)] py-[var(--space-3)]",
  "transition-colors duration-[var(--duration-fast)]",
].join(" ");

/**
 * Label, control and error as one unit.
 *
 * The label is always visible. A placeholder vanishes the moment someone starts
 * typing, which is precisely when they are most likely to want to check what
 * the field was asking for — so placeholders here are format hints only.
 */
function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="type-mono text-ink-muted block">
        {label}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} className="type-caption mt-[var(--space-2)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Contact() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL);
  const formId = useId();

  /**
   * Client-side errors are kept separate from the server's.
   *
   * Validation runs on blur, not on every keystroke — announcing that an email
   * is invalid while someone is still on the third character is noise. It
   * clears on input as soon as the field becomes valid, so an error disappears
   * the moment it stops being true rather than waiting for the next blur.
   */
  const [touchedErrors, setTouchedErrors] = useState<FieldErrors>({});

  const errors: FieldErrors = { ...state.fieldErrors, ...touchedErrors };
  const values = state.values ?? EMPTY_CONTACT;

  function controlProps(field: ContactFieldName) {
    const id = `${formId}-${field}`;
    const error = errors[field];

    return {
      id,
      name: field,
      defaultValue: values[field],
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
      onBlur: (
        event: React.FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const value = event.target.value;
        setTouchedErrors((current) => ({
          ...current,
          [field]: validateField(field, value),
        }));
      },
      onInput: (
        event: React.FormEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const value = event.currentTarget.value;
        setTouchedErrors((current) => {
          if (!current[field]) return current;
          if (validateField(field, value)) return current;
          const next = { ...current };
          delete next[field];
          return next;
        });
      },
      className: cn(CONTROL, error ? "border-ink" : "border-edge"),
    };
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-[var(--rhythm-base)]"
    >
      <Container>
        <div className="border-hairline border-b pb-[var(--space-4)]">
          <h2 id="contact-heading" className="type-display-l measure-lead">
            Tell me what you are trying to build.
          </h2>
        </div>

        <div className="mt-[var(--space-10)] grid gap-[var(--space-12)] lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-[var(--space-16)]">
          <div>
            <p className="type-mono text-ink-muted">Or just email</p>

            <a
              href={`mailto:${site.email}`}
              className="type-h2 tap-target decoration-accent mt-[var(--space-3)] underline decoration-[1px] underline-offset-[6px]"
            >
              {site.email}
            </a>

            <div className="mt-[var(--space-4)]">
              <CopyEmail />
            </div>

            <p className="measure type-body text-ink-muted mt-[var(--space-6)]">
              {site.availability.detail}
            </p>
          </div>

          <div>
            {/*
             * Rendered even when empty, so the live region exists before its
             * content arrives — a region added at the same moment as its text
             * frequently goes unannounced.
             */}
            <p
              role="status"
              aria-live="polite"
              className={cn(
                "type-body",
                state.message ? "mb-[var(--space-6)] block" : "sr-only",
              )}
            >
              {state.message}
            </p>

            {state.status === "success" ? (
              <div className="border-hairline border-t pt-[var(--space-6)]">
                <p className="type-h3">Message received.</p>
                <p className="measure type-body text-ink-muted mt-[var(--space-3)]">
                  If it has not been answered within a working day, something ate it. Send
                  the same note to{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="decoration-accent underline decoration-[1px] underline-offset-4"
                  >
                    {site.email}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form action={formAction} noValidate>
                {/* The honeypot: out of sight, out of the accessibility tree and
                    out of the tab order. A person cannot reach it, so anything
                    in it did not come from one. */}
                <div aria-hidden="true" className="absolute left-[-9999px]">
                  <label htmlFor={`${formId}-${HONEYPOT_FIELD}`}>Company</label>
                  <input
                    id={`${formId}-${HONEYPOT_FIELD}`}
                    name={HONEYPOT_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-[var(--space-6)] sm:grid-cols-2">
                  <Field id={`${formId}-name`} label="Your name" error={errors.name}>
                    <input {...controlProps("name")} type="text" autoComplete="name" />
                  </Field>

                  <Field id={`${formId}-email`} label="Email" error={errors.email}>
                    <input
                      {...controlProps("email")}
                      type="email"
                      autoComplete="email"
                      // Allowed, because it is a format hint rather than a
                      // stand-in for the label above it.
                      placeholder="name@example.com"
                    />
                  </Field>

                  <Field
                    id={`${formId}-projectType`}
                    label="What kind of project"
                    error={errors.projectType}
                  >
                    <select {...controlProps("projectType")}>
                      <option value="">Choose one</option>
                      {PROJECT_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id={`${formId}-budget`}
                    label="Budget range"
                    error={errors.budget}
                  >
                    <select {...controlProps("budget")}>
                      <option value="">Choose one</option>
                      {BUDGET_RANGES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id={`${formId}-message`}
                    label="The project"
                    error={errors.message}
                    className="sm:col-span-2"
                  >
                    <textarea
                      {...controlProps("message")}
                      rows={6}
                      className={cn(controlProps("message").className, "resize-y")}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className={cn(
                    "type-body bg-ink text-ink-inverse mt-[var(--space-8)] rounded-xs",
                    "px-[var(--space-6)] py-[var(--space-3)]",
                    "transition-opacity duration-[var(--duration-fast)]",
                    pending ? "opacity-60" : "hover:opacity-90",
                  )}
                >
                  {pending ? "Sending" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
