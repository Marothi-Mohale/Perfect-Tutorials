"use client";

import { FormEvent, useState } from "react";
import { publicEnv } from "../lib/env";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  levelOfStudy: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  levelOfStudy: "",
  subject: "",
  message: "",
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type InquiryApiSuccess = {
  success: true;
  message: string;
  data: {
    inquiry: {
      id: string;
    };
  };
};

type InquiryApiError = {
  success?: false;
  code?: string;
  message?: string;
  errors?: Array<{
    field?: string;
    messages?: string[];
  }>;
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string[]>>>({});

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    if (
      !formState.firstName ||
      !formState.email ||
      !formState.levelOfStudy ||
      !formState.subject
    ) {
      setSubmitState({
        status: "error",
        message: "Please complete the required fields before continuing.",
      });
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch(`${publicEnv.apiBaseUrl}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as InquiryApiSuccess | InquiryApiError;

      if (!response.ok) {
        const errorPayload = payload as InquiryApiError;
        const nextFieldErrors = (errorPayload.errors ?? []).reduce<
          Partial<Record<keyof FormState, string[]>>
        >((accumulator, issue) => {
          if (!issue.field || !issue.messages?.length) {
            return accumulator;
          }

          if (!(issue.field in formState)) {
            return accumulator;
          }

          accumulator[issue.field as keyof FormState] = issue.messages;
          return accumulator;
        }, {});

        setFieldErrors(nextFieldErrors);
        setSubmitState({
          status: "error",
          message: deriveErrorMessage(errorPayload),
        });
        return;
      }

      const successPayload = payload as InquiryApiSuccess;
      setFormState(initialState);
      setFieldErrors({});
      setSubmitState({
        status: "success",
        message:
          successPayload.message ??
          "Your inquiry has been sent. We will respond within one business day.",
      });
    } catch {
      setSubmitState({
        status: "error",
        message:
          "We could not reach the enquiry service. Please try again in a moment.",
      });
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="label">
            First Name
          </label>
          <input
            id="firstName"
            className="input"
            autoComplete="given-name"
            value={formState.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            aria-invalid={Boolean(fieldErrors.firstName)}
            required
          />
          {fieldErrors.firstName ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.firstName.join(" ")}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className="label">
            Last Name
          </label>
          <input
            id="lastName"
            className="input"
            autoComplete="family-name"
            value={formState.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            aria-invalid={Boolean(fieldErrors.lastName)}
          />
          {fieldErrors.lastName ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.lastName.join(" ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
          {fieldErrors.email ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.email.join(" ")}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input
            id="phone"
            className="input"
            autoComplete="tel"
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.phone.join(" ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="level" className="label">
            Level of Study
          </label>
          <select
            id="level"
            className="select"
            value={formState.levelOfStudy}
            onChange={(event) => updateField("levelOfStudy", event.target.value)}
            aria-invalid={Boolean(fieldErrors.levelOfStudy)}
            required
          >
            <option value="">Choose level</option>
            <option>Grade 8-9</option>
            <option>Grade 10-12</option>
            <option>University</option>
          </select>
          {fieldErrors.levelOfStudy ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.levelOfStudy.join(" ")}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="subject" className="label">
            Subject
          </label>
          <select
            id="subject"
            className="select"
            value={formState.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            aria-invalid={Boolean(fieldErrors.subject)}
            required
          >
            <option value="">Select subject</option>
            <option>Mathematics</option>
            <option>Physical Science</option>
            <option>Both</option>
          </select>
          {fieldErrors.subject ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {fieldErrors.subject.join(" ")}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="textarea"
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
        />
        {fieldErrors.message ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {fieldErrors.message.join(" ")}
          </p>
        ) : null}
      </div>

      {submitState.status === "error" ? (
        <p className="text-sm text-red-600" role="alert">
          {submitState.message}
        </p>
      ) : null}

      {submitState.status === "success" ? (
        <p className="text-sm text-emerald-700" role="status">
          {submitState.message}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn-primary"
        disabled={submitState.status === "submitting"}
      >
        {submitState.status === "submitting" ? "Sending enquiry..." : "Send Enquiry"}
      </button>

      <p className="text-sm text-[var(--muted)]">
        We submit your enquiry securely to the Perfect Tutorials team.
      </p>
    </form>
  );
}

function deriveErrorMessage(payload: InquiryApiError) {
  if (payload.code === "DUPLICATE_INQUIRY") {
    return (
      payload.message ??
      "A similar enquiry was already submitted recently. Please wait a few minutes before trying again."
    );
  }

  if (payload.code === "VALIDATION_ERROR") {
    return payload.message ?? "Please review the highlighted fields and try again.";
  }

  return (
    payload.message ??
    "We could not submit your inquiry right now. Please try again in a moment."
  );
}
