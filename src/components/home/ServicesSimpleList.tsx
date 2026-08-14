import { services } from "@/content/services";

/**
 * Homepage §8 — "Everything You Need to Get Age Fit" (Clarity). Renders
 * as a single concise bullet-separated line, mirroring the approved
 * copy's own formatting in the Master Reference ("Personal Training •
 * Nutrition Guidance • …") rather than expanding into a card grid —
 * keeps this section true to "keep concise" and avoids the
 * card-heavy Demo #1 treatment.
 */
export function ServicesSimpleList() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center">
      {services.map((service, i) => (
        <li key={service} className="flex items-center gap-3">
          <span className="text-base font-semibold text-ink-800 sm:text-lg">
            {service}
          </span>
          {i < services.length - 1 && (
            <span aria-hidden="true" className="text-ink-300">
              •
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
