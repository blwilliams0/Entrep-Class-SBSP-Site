import Link from "next/link";

export default function TechnologyPage() {
  return (
    <main className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <section className="card">
        <p className="brand">Solar At Night</p>
        <h1>Technology Overview</h1>
        <p className="subheadline">System concept for nighttime solar energy delivery</p>

        <div className="info-block">
          <h2>System Schematic</h2>
          <div className="schematic">
            <div className="node">Daytime Solar Collection</div>
            <div className="arrow">→</div>
            <div className="node">Energy Conversion Layer</div>
            <div className="arrow">→</div>
            <div className="node">Nighttime Dispatch to Grid</div>
          </div>
        </div>

        <div className="info-block">
          <h2>Simulation Snapshot</h2>
          <p>
            MATLAB simulation outputs will be shown here to compare baseline daytime-only profiles against extended
            nighttime delivery scenarios.
          </p>
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
