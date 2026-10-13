import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

// Mobile Messaging Terms of Service for the GetAgeFit Essentials SMS
// program (Klaviyo). Content below is the business-provided draft,
// reproduced verbatim except for house-style markup (e.g. &rsquo;/&trade;)
// — no legal substance has been added, removed, or reworded.
//
// NOT YET READY TO PUBLISH. See the reviewer notice immediately below the
// page heading for the specific placeholders and conflicting business
// details (legal entity name, business address) that still need
// confirmation before this goes live anywhere — on this domain or on the
// separate, minimal standalone project prepared alongside it. `robots:
// noindex` is intentional and should stay in place until that
// confirmation happens and this page is actually linked from the site.
export const metadata: Metadata = {
  title: "Mobile Messaging Terms of Service",
  description: `Mobile messaging (SMS) terms of service for the ${siteConfig.name} Essentials text messaging program.`,
  alternates: { canonical: "/mobile-terms" },
  robots: { index: false, follow: true },
};

export default function MobileTermsPage() {
  return (
    <Section tone="white">
      <div className="mx-auto max-w-prose">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mb-6 text-3xl">Get Age Fit Mobile Messaging Terms of Service</h1>

        {/* Internal reviewer notice — not part of the legal text itself.
            Delete this block once the items below are confirmed and this
            page is approved to publish. */}
        <div className="mb-8 rounded-xl2 border-2 border-plum-300 bg-plum-50 p-5 text-sm leading-relaxed text-ink-800">
          <p className="mb-2 font-semibold uppercase tracking-wide text-plum-700">
            Internal review notice — not yet approved to publish
          </p>
          <p className="mb-2">This page is not linked from site navigation and is marked noindex. Before publishing anywhere, confirm:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Legal entity name:</strong> the opening paragraph still has an unfilled
              placeholder (highlighted below), but Section 12 of the same draft states &ldquo;Get Age
              Fit, LLC&rdquo; — and the site&rsquo;s own existing config lists the legal name simply as
              &ldquo;GetAgeFit&rdquo; (no suffix), itself flagged elsewhere as unconfirmed. These three
              values need to be reconciled into one confirmed legal name before publishing.
            </li>
            <li>
              <strong>Business address:</strong> this draft uses &ldquo;3626 Williams Drive, Georgetown,
              TX 78628&rdquo; (no suite/floor). The site&rsquo;s existing NAP data uses &ldquo;3626 Williams
              Drive, <strong>Suite 200</strong>&rdquo;, and the connected Klaviyo account lists &ldquo;3626
              Williams dr <strong>FL 2</strong>&rdquo;. Three different unit designators — please confirm
              the correct one before publishing.
            </li>
            <li>
              <strong>SMS sending number:</strong> Sections 5 and 6 reference replying STOP/HELP
              to messages from &ldquo;our SMS program&rdquo; / &ldquo;our SMS sending number&rdquo; without
              naming a specific number — that&rsquo;s intentional and fine as written, but note no
              sending number is provisioned in Klaviyo yet, so this program is not actually
              operating yet regardless of this page&rsquo;s publication status.
            </li>
            <li>
              <strong>Linked Privacy Policy:</strong> Section 8 links to{" "}
              <code>https://getagefit.com/privacy</code>. The equivalent page in this (unlaunched)
              codebase is still a content placeholder. Confirm what currently lives at that live
              URL today, and that it adequately covers SMS-related data practices, before using
              this page in any carrier-facing registration.
            </li>
            <li>
              <strong>Effective/Last Updated dates:</strong> both currently read October 13, 2026
              (today, in this session) — confirm whether these should instead reflect the actual
              publish date.
            </li>
          </ul>
        </div>

        <p className="mb-4 text-sm text-ink-400">Effective Date: October 13, 2026</p>
        <p className="mb-6 text-sm text-ink-400">Last Updated: October 13, 2026</p>

        <p className="mb-6 leading-relaxed text-ink-600">
          These Mobile Messaging Terms of Service (&ldquo;Mobile Terms&rdquo;) govern the text
          messaging program operated by{" "}
          <mark className="rounded bg-amber-200 px-1 font-semibold text-ink-900">
            [INSERT FULL LEGAL BUSINESS NAME]
          </mark>
          , doing business as Get Age Fit (&ldquo;Get Age Fit,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;).
        </p>
        <p className="mb-8 leading-relaxed text-ink-600">
          By voluntarily enrolling in our SMS program, you agree to these Mobile Terms and
          acknowledge our Privacy Policy.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">1. Program Description</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          The Get Age Fit mobile messaging program provides subscribers with text messages related
          to GetAgeFit Essentials, including our ageLIFT&trade; and ageFUEL&trade; supplement
          products.
        </p>
        <p className="mb-2 leading-relaxed text-ink-600">Messages may include:</p>
        <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed text-ink-600">
          <li>Supplement waitlist confirmations and updates.</li>
          <li>Product availability and launch announcements.</li>
          <li>Product-related news and information.</li>
          <li>Promotional offers and special announcements related to GetAgeFit Essentials.</li>
        </ul>
        <p className="mb-4 leading-relaxed text-ink-600">
          We will not automatically enroll you in unrelated text messaging programs solely because
          you joined the supplement waitlist.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">2. Consent to Receive Messages</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          By providing your mobile phone number, affirmatively selecting the optional SMS consent
          checkbox on our signup form, and submitting the form, you authorize Get Age Fit to send
          recurring marketing and informational text messages to the mobile number you provided.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">Messages may be sent using automated technology.</p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Your consent to receive text messages is voluntary and is not a condition of purchasing
          products or services from Get Age Fit.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Providing your telephone number without affirmatively opting in does not constitute
          consent to receive marketing text messages.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">3. Message Frequency</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          Message frequency varies based on product availability, launch activity, and relevant
          GetAgeFit Essentials announcements.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">We do not guarantee a specific number of messages.</p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">4. Message and Data Rates</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          Get Age Fit does not charge a separate subscription fee for participating in its mobile
          messaging program.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Message and data rates may apply according to your mobile carrier and wireless plan. You
          are responsible for charges imposed by your wireless provider.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Contact your mobile carrier for details about your messaging plan.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">5. How to Opt Out</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          You may withdraw your consent and stop receiving Get Age Fit marketing text messages at
          any time.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          To unsubscribe, reply STOP to a text message received from our SMS program.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          After your opt-out request is processed, you may receive a final confirmation message.
          You will no longer receive recurring marketing messages from this program unless you
          subsequently provide valid consent again.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          You may also contact us at{" "}
          <a href={`mailto:${siteConfig.nap.email}`} className="underline hover:text-ink-700">
            {siteConfig.nap.email}
          </a>{" "}
          to request assistance with unsubscribing.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Unsubscribing from SMS does not automatically unsubscribe you from email communications.
          Email subscriptions may be managed separately.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">6. Customer Support</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          For assistance with our mobile messaging program, reply HELP to a message from our SMS
          sending number.
        </p>
        <p className="mb-2 leading-relaxed text-ink-600">You may also contact:</p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Get Age Fit
          <br />
          Email:{" "}
          <a href={`mailto:${siteConfig.nap.email}`} className="underline hover:text-ink-700">
            {siteConfig.nap.email}
          </a>
          <br />
          Website:{" "}
          <a href="https://getagefit.com" className="underline hover:text-ink-700">
            https://getagefit.com
          </a>
          <br />
          Business Address: 3626 Williams Drive, Georgetown, TX 78628
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Please allow a reasonable period for email support requests to be reviewed and processed.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">
          7. Eligibility and Phone Number Accuracy
        </h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          Our SMS program is intended for individuals who are at least 18 years old and who are
          authorized to enroll the mobile number they provide.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          By subscribing, you represent that the mobile number belongs to you or that you are
          authorized to provide consent for that number.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          If you change or discontinue your mobile number, please notify us so that we can update
          our records and avoid sending messages to an unintended recipient.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">
          8. Privacy and Personal Information
        </h2>
        <p className="mb-4 leading-relaxed text-ink-600">We respect your privacy.</p>
        <p className="mb-4 leading-relaxed text-ink-600">
          When you enroll in our SMS program, we may collect and process information including
          your name, mobile phone number, SMS consent status, signup details, message delivery
          information, and interactions with our communications.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          We use this information to administer the mobile messaging program, deliver requested
          communications, maintain subscription preferences, process opt-out requests, provide
          support, and comply with applicable legal obligations.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          We use service providers, including Klaviyo and associated messaging delivery providers,
          to operate our SMS program.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Mobile opt-in information and consent will not be shared with third parties or affiliates
          for their own marketing or promotional purposes. We may disclose information to service
          providers acting on our behalf to operate the messaging program, subject to appropriate
          contractual and confidentiality protections.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          For additional information about our data practices and your privacy rights, please
          review our Privacy Policy:{" "}
          <a href="https://getagefit.com/privacy" className="underline hover:text-ink-700">
            https://getagefit.com/privacy
          </a>
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">
          9. Message Delivery and Availability
        </h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          Message delivery depends on your wireless carrier, network availability, device
          compatibility, and other factors outside our control.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Wireless carriers are not responsible for delayed or undelivered messages.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          We do not guarantee uninterrupted or error-free delivery of text messages.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Nothing in these Mobile Terms excludes or limits liability where such exclusion or
          limitation is prohibited by applicable law.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">
          10. Changes to the Program or These Terms
        </h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          We may modify, suspend, or discontinue the mobile messaging program or update these
          Mobile Terms from time to time.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          We will provide notice of material changes when required by applicable law.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Changes will not override applicable consent requirements. Where additional consent is
          legally required, we will obtain it before sending the affected communications.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">11. Applicable Law</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          These Mobile Terms are governed by applicable federal law and, to the extent permitted by
          law, the laws of the State of Texas.
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Nothing in these Mobile Terms limits any consumer rights or protections that cannot
          legally be waived.
        </p>

        <h2 className="mb-3 mt-8 font-display text-xl text-ink-900">12. Contact Information</h2>
        <p className="mb-4 leading-relaxed text-ink-600">
          Questions or concerns about these Mobile Terms may be directed to:
        </p>
        <p className="mb-4 leading-relaxed text-ink-600">
          Get Age Fit, LLC
          <br />
          Doing Business As: Get Age Fit
          <br />
          3626 Williams Drive
          <br />
          Georgetown, TX 78628
          <br />
          Email:{" "}
          <a href={`mailto:${siteConfig.nap.email}`} className="underline hover:text-ink-700">
            {siteConfig.nap.email}
          </a>
          <br />
          Website:{" "}
          <a href="https://getagefit.com" className="underline hover:text-ink-700">
            https://getagefit.com
          </a>
        </p>

        <p className="mt-10 text-sm italic text-ink-400">End of Mobile Messaging Terms of Service</p>
      </div>
    </Section>
  );
}
