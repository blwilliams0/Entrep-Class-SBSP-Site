import Link from "next/link";
import Image from "next/image";

export default function TechnologyPage() {
  const linkedInUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;

  return (
    <main className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <section className="card">
        <p className="brand">Solar At Night</p>
        <h1>Technology + Credibility</h1>
        <p className="subheadline">Visual concept, simulation proof-of-work, and founder profile</p>

        <div className="info-block">
          <h2>System Schematic (Concept)</h2>
          <div className="image-frame">
            <Image
              src="/technology/system-schematic.png"
              alt="Orbital solar reflection MVP system schematic with heliostat and relay satellites directing sunlight toward Earth at night"
              width={1536}
              height={1024}
              className="tech-image tech-image-wide"
            />
          </div>
        </div>

        <div className="info-block">
          <h2>Additional Concept Visual</h2>
          <div className="image-frame">
            <Image
              src="/technology/space-concept.png"
              alt="Concept render of orbital reflector array relaying concentrated solar beams toward nighttime surface target"
              width={1024}
              height={1536}
              className="tech-image tech-image-tall"
            />
          </div>
        </div>

        <div className="info-block">
          <h2>Simulation Snapshot (MATLAB)</h2>
          <div className="image-frame">
            <Image
              src="/technology/matlab-simulation.png"
              alt="MATLAB output showing multi-hop reflection vectors from sun to satellites to Earth target"
              width={716}
              height={743}
              className="tech-image tech-image-mid"
            />
          </div>
        </div>

        <div className="info-block founder-block">
          <h2>Founder</h2>
          <p>Built by Blake Williams. Connect to verify identity and professional background.</p>
          {linkedInUrl ? (
            <a href={linkedInUrl} target="_blank" rel="noreferrer" className="submit-button founder-link">
              View LinkedIn Profile
            </a>
          ) : (
            <p className="cred-note">
              Add <code>NEXT_PUBLIC_LINKEDIN_URL</code> in your environment variables to display your profile link.
            </p>
          )}
        </div>

        <div className="optional-links">
          <Link href="/" className="text-link">
            Back to demand question
          </Link>
          <Link href="/investment" className="text-link">
            Investor interest form
          </Link>
        </div>
      </section>
    </main>
  );
}
