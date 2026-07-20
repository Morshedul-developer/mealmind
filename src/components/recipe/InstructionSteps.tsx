export function InstructionSteps({ steps }: { steps: string[] }) {
  if (steps.length === 0) {
    return <p className="text-charcoal-muted">No instructions provided.</p>;
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {steps.map((step, index) => (
        <div key={step} className="flex gap-6 md:gap-8">
          <span className="font-heading text-display text-primary opacity-15 select-none leading-none shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-body-lg text-charcoal-muted leading-loose pt-2">{step}</p>
        </div>
      ))}
    </div>
  );
}
