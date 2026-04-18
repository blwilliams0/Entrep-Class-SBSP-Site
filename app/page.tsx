"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";

type Vote = "Yes" | "Maybe" | "No";

type VoteState = "idle" | "loading" | "done";

type CheckIpResponse = {
  alreadyResponded: boolean;
  responseId: number | null;
  response: Vote | null;
};

const voteOptions: Vote[] = ["Yes", "Maybe", "No"];

export default function HomePage() {
  const [voteState, setVoteState] = useState<VoteState>("idle");
  const [locked, setLocked] = useState(false);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("Checking eligibility...");
  const [isModalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "submitted">("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkIp() {
      try {
        const response = await fetch("/api/check-ip", { cache: "no-store" });
        const data = (await response.json()) as CheckIpResponse;

        if (cancelled) {
          return;
        }

        if (data.alreadyResponded) {
          setLocked(true);
          setResponseId(data.responseId);
          setSelectedVote(data.response);
          setStatusMessage("Response already recorded.");
          track("already_responded_seen", { response: data.response ?? "unknown" });
          return;
        }

        setStatusMessage("Select your answer below.");
      } catch {
        if (!cancelled) {
          setStatusMessage("Unable to verify status. You can still submit.");
        }
      }
    }

    checkIp();

    return () => {
      cancelled = true;
    };
  }, []);

  const submitDisabled = useMemo(() => {
    return voteState === "loading" || locked;
  }, [voteState, locked]);

  async function handleVote(vote: Vote) {
    setVoteState("loading");
    setFormError("");

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ response: vote })
      });

      const data = await response.json();

      if (response.status === 409) {
        setLocked(true);
        setSelectedVote((data.response as Vote | undefined) ?? null);
        setResponseId((data.responseId as number | undefined) ?? null);
        setStatusMessage("Response already recorded.");
        setVoteState("done");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit response.");
      }

      setSelectedVote(vote);
      setResponseId(data.responseId as number);
      setLocked(true);
      setVoteState("done");
      setStatusMessage("Your response has been recorded.");
      setModalOpen(true);
      track("vote_submitted", { vote });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit response.";
      setVoteState("idle");
      setStatusMessage(message);
    }
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
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
          linkedResponseId: responseId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit contact details.");
      }

      setFormState("submitted");
      track("contact_submitted", { hasCompany: company ? "yes" : "no" });
    } catch (error) {
      setFormState("idle");
      const message = error instanceof Error ? error.message : "Unable to submit contact details.";
      setFormError(message);
    }
  }

  return (
    <main className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <section className="card">
        <p className="brand">Solar At Night</p>

        <h1>Buy solar energy at night</h1>
        <p className="subheadline">For solar farm owners and operators seeking cost-competitive nighttime supply</p>

        <div className="question-box">
          <p className="prompt">If you own or operate a solar farm, would you buy nighttime solar energy from us if it were cost-competitive?</p>

          <div className="button-row">
            {voteOptions.map((option) => (
              <button
                key={option}
                className={`vote-button ${selectedVote === option ? "selected" : ""}`}
                onClick={() => handleVote(option)}
                disabled={submitDisabled}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          <p className={`status ${locked ? "status-locked" : ""}`}>{statusMessage}</p>
        </div>

        <p className="consent">By responding, you agree we store your response and IP-derived fingerprint to prevent duplicates.</p>

        <div className="supporting-copy">
          <p>We are building a system to deliver solar energy beyond daylight hours.</p>
          <p>Our focus is helping operators increase utilization of existing solar assets.</p>
        </div>

        <div className="optional-links">
          <Link href="/technology" className="text-link">
            View technology details
          </Link>
          <Link href="/investment" className="text-link">
            Express investment interest
          </Link>
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div className="modal-card">
            {formState !== "submitted" ? (
              <>
                <h2 id="contact-title">Your response has been recorded.</h2>
                <p>Share your company to receive updates. Name and email are optional.</p>

                <form onSubmit={handleContactSubmit} className="contact-form">
                  <label>
                    Name (Optional)
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                    />
                  </label>

                  <label>
                    Email (Optional)
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                    />
                  </label>

                  <label>
                    Company (Required)
                    <input
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      required
                      autoComplete="organization"
                    />
                  </label>

                  {formError ? <p className="form-error">{formError}</p> : null}

                  <button disabled={formState === "loading"} type="submit" className="submit-button">
                    {formState === "loading" ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Thank you.</h2>
                <p>We will reach out with updates.</p>
                <button type="button" className="submit-button" onClick={() => setModalOpen(false)}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
