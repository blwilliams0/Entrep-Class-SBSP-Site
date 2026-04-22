"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";

export default function InvestmentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "submitted">("idle");
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFormState("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          company,
          linkedResponseId: null
        })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your interest.");
      }

      setFormState("submitted");
      track("investment_interest_submitted", { hasCompany: company ? "yes" : "no" });
    } catch (error) {
      setFormState("idle");
      const message = error instanceof Error ? error.message : "Unable to submit your interest.";
      setFormError(message);
    }
  }

  return (
    <main className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <section className="card">
        <p className="brand">Solar At Night</p>
        <h1>Investment Interest</h1>
        <p className="subheadline">Express interest in peak-demand solar extension and shoulder-hour augmentation</p>

        {formState !== "submitted" ? (
          <>
            <p className="prompt investment-copy">Share your contact details and we will follow up with investment updates.</p>

            <form onSubmit={handleSubmit} className="contact-form investment-form">
              <label>
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </label>

              <label>
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  autoComplete="email"
                />
              </label>

              <label>
                Company (optional)
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  autoComplete="organization"
                />
              </label>

              {formError ? <p className="form-error">{formError}</p> : null}

              <button disabled={formState === "loading"} type="submit" className="submit-button">
                {formState === "loading" ? "Submitting..." : "Express Investment Interest"}
              </button>
            </form>
          </>
        ) : (
          <div className="info-block">
            <h2>Thank you.</h2>
            <p>We will reach out with investment updates.</p>
          </div>
        )}

        <div className="optional-links">
          <Link href="/" className="text-link">
            Back to demand question
          </Link>
          <Link href="/technology" className="text-link">
            View technology details
          </Link>
        </div>
      </section>
    </main>
  );
}
