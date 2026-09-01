"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import {
  InvestmentMindset,
  PrimaryGoal,
  QualificationAnswers,
  investmentMindsetOptions,
  primaryGoalLabels,
  primaryGoalValues,
  resultCopy,
  routeQualification,
} from "@/lib/qualification";

type FormState = Partial<QualificationAnswers>;

const steps = [
  "About You",
  "Your Goals",
  "Your History",
  "Coaching Fit",
  "Investment Mindset",
  "Your Results",
] as const;

const goalOptions: { value: PrimaryGoal; label: string }[] = primaryGoalValues.map(
  (value) => ({ value, label: primaryGoalLabels[value] }),
);

const frequencyOptions = [
  { value: "1x", label: "1x per week" },
  { value: "2x", label: "2x per week" },
  { value: "3x_plus", label: "3x per week" },
  { value: "not_sure", label: "Not sure yet" },
];

const importanceOptions = [
  { value: "not_important", label: "Not important" },
  { value: "somewhat", label: "Somewhat important" },
  { value: "very", label: "Very important" },
  { value: "essential", label: "Essential" },
];

const readinessOptions = [
  { value: "ready_now", label: "I'm ready to start now" },
  { value: "few_months", label: "Within the next few months" },
  { value: "exploring", label: "Just exploring for now" },
];

const ageRangeOptions = ["40–49", "50–59", "60–69", "70–79", "80+"];

export function QualifyQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );

  useEffect(() => {
    trackEvent({ name: "qualify_start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLastQuestionStep = stepIndex === steps.length - 2;
  const isResultsStep = stepIndex === steps.length - 1;

  const result = useMemo(() => {
    if (!form.investmentMindset || !form.personalizedImportance || !form.readiness) {
      return null;
    }
    return routeQualification({
      investmentMindset: form.investmentMindset,
      personalizedImportance: form.personalizedImportance,
      readiness: form.readiness,
    });
  }, [form.investmentMindset, form.personalizedImportance, form.readiness]);

  async function submitQualification() {
    if (!result) return;
    setSubmitStatus("submitting");
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, result, source: "qualify_page" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitStatus("done");
      trackEvent({ name: "qualify_complete", result });
    } catch {
      setSubmitStatus("error");
    }
  }

  function goNext() {
    trackEvent({
      name: "qualify_step_complete",
      step: steps[stepIndex],
      stepIndex,
    });
    if (isLastQuestionStep) {
      setStepIndex((i) => i + 1);
      submitQualification();
    } else {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const canAdvance = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return !!(form.firstName && form.lastName && form.email && form.ageRange);
      case 1:
        return !!(form.primaryGoal && form.primaryGoal.length > 0 && form.trainingFrequency);
      case 2:
        return !!form.hasInjuryOrLimitation;
      case 3:
        return !!(form.personalizedImportance && form.readiness);
      case 4:
        return !!form.investmentMindset;
      default:
        return true;
    }
  }, [stepIndex, form]);

  return (
    <div>
      {!isResultsStep && (
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink-500">
            <span>{steps[stepIndex]}</span>
            <span>
              Step {stepIndex + 1} of {steps.length - 1}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-sage-600 transition-all duration-500 ease-soft"
              style={{ width: `${((stepIndex + 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="rounded-xl2 border border-ink-100 bg-white p-8 shadow-card md:p-10">
        {stepIndex === 0 && (
          <fieldset className="space-y-5">
            <legend className="mb-2 text-xl font-display text-ink-900">
              Let&rsquo;s start with the basics
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="First name"
                value={form.firstName || ""}
                onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                autoComplete="given-name"
              />
              <TextField
                label="Last name"
                value={form.lastName || ""}
                onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                autoComplete="family-name"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Email"
                type="email"
                value={form.email || ""}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                autoComplete="email"
              />
              <TextField
                label="Phone"
                type="tel"
                value={form.phone || ""}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                autoComplete="tel"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink-700">Age range</p>
              <div className="flex flex-wrap gap-2">
                {ageRangeOptions.map((range) => (
                  <ChipOption
                    key={range}
                    label={range}
                    selected={form.ageRange === range}
                    onSelect={() => setForm((f) => ({ ...f, ageRange: range }))}
                  />
                ))}
              </div>
            </div>
          </fieldset>
        )}

        {stepIndex === 1 && (
          <fieldset className="space-y-6">
            <legend className="mb-2 text-xl font-display text-ink-900">
              What are you hoping to achieve?
            </legend>
            <CheckboxGroup
              name="primaryGoal"
              label="Your primary goal (select all that apply)"
              options={goalOptions}
              value={form.primaryGoal || []}
              onChange={(v) => setForm((f) => ({ ...f, primaryGoal: v }))}
            />
            <RadioGroup
              name="trainingFrequency"
              label="How often would you like to train?"
              options={frequencyOptions}
              value={form.trainingFrequency}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  trainingFrequency: v as FormState["trainingFrequency"],
                }))
              }
            />
          </fieldset>
        )}

        {stepIndex === 2 && (
          <fieldset className="space-y-6">
            <legend className="mb-2 text-xl font-display text-ink-900">
              Your training history
            </legend>
            <RadioGroup
              name="hasInjuryOrLimitation"
              label="Are you currently managing an injury or physical limitation?"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              value={form.hasInjuryOrLimitation}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  hasInjuryOrLimitation: v as FormState["hasInjuryOrLimitation"],
                }))
              }
            />
            {form.hasInjuryOrLimitation === "yes" && (
              <div>
                <label
                  htmlFor="injuryDetail"
                  className="mb-2 block text-sm font-semibold text-ink-700"
                >
                  Tell us a bit more (optional)
                </label>
                <textarea
                  id="injuryDetail"
                  rows={4}
                  value={form.injuryDetail || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, injuryDetail: e.target.value }))
                  }
                  className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
                />
              </div>
            )}
          </fieldset>
        )}

        {stepIndex === 3 && (
          <fieldset className="space-y-6">
            <legend className="mb-2 text-xl font-display text-ink-900">
              What matters to you in a coach?
            </legend>
            <RadioGroup
              name="personalizedImportance"
              label="How important is personalized, one-on-one coaching to you?"
              options={importanceOptions}
              value={form.personalizedImportance}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  personalizedImportance: v as FormState["personalizedImportance"],
                }))
              }
            />
            <RadioGroup
              name="readiness"
              label="How ready are you to start a personalized training plan?"
              options={readinessOptions}
              value={form.readiness}
              onChange={(v) =>
                setForm((f) => ({ ...f, readiness: v as FormState["readiness"] }))
              }
            />
          </fieldset>
        )}

        {stepIndex === 4 && (
          <fieldset>
            <legend className="mb-2 text-xl font-display text-ink-900">
              Which best describes your approach to investing in your health
              and fitness?
            </legend>
            <p className="mb-6 text-sm text-ink-500">
              There&rsquo;s no wrong answer: this just helps us point you in the
              right direction.
            </p>
            <div className="space-y-3">
              {investmentMindsetOptions.map((opt) => (
                <RadioCard
                  key={opt.value}
                  name="investmentMindset"
                  value={opt.value}
                  label={opt.label}
                  selected={form.investmentMindset === opt.value}
                  onSelect={() =>
                    setForm((f) => ({
                      ...f,
                      investmentMindset: opt.value as InvestmentMindset,
                    }))
                  }
                />
              ))}
            </div>
          </fieldset>
        )}

        {isResultsStep && result && (
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-700">
              Your Results
            </p>
            <h2 className="mb-4 text-2xl md:text-3xl">
              {resultCopy[result].heading}
            </h2>
            <p className="mx-auto mb-8 max-w-xl leading-relaxed text-ink-600">
              {resultCopy[result].body}
            </p>
            {submitStatus === "error" && (
              <p role="alert" className="mb-4 text-sm text-red-700">
                We saved your answers locally, but couldn&rsquo;t reach our server.
                Please continue: a team member can follow up manually.
              </p>
            )}
            <Button
              href={resultCopy[result].ctaHref}
              size="lg"
              trackCta={resultCopy[result].ctaLabel}
              trackLocation={`qualify-results-${result}`}
            >
              {resultCopy[result].ctaLabel}
            </Button>
          </div>
        )}

        {!isResultsStep && (
          <div className="mt-9 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="text-sm font-semibold text-ink-500 hover:text-ink-800 disabled:opacity-0"
            >
              ← Back
            </button>
            <Button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              trackCta={isLastQuestionStep ? "See My Results" : "Continue"}
              trackLocation="qualify-quiz"
            >
              {isLastQuestionStep ? "See My Results" : "Continue"}
            </Button>
          </div>
        )}
      </div>

      {!isResultsStep && (
        <p className="mt-6 text-center text-xs text-ink-400">
          Prefer to skip straight to a conversation?{" "}
          <Link href="/consultation" className="font-medium text-sage-700 hover:text-sage-900">
            Schedule a consultation directly
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl2 border border-ink-100 bg-white px-4 py-3 text-ink-800 shadow-sm focus:border-sage-400"
      />
    </div>
  );
}

function ChipOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-sage-700 bg-sage-700 text-sand-50"
          : "border-ink-100 text-ink-600 hover:border-sage-400"
      }`}
    >
      {label}
    </button>
  );
}

function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-3 text-sm font-semibold text-ink-700">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl2 border px-4 py-3 text-sm transition-colors ${
              value === opt.value
                ? "border-sage-600 bg-sage-50 text-sage-900"
                : "border-ink-100 text-ink-600 hover:border-sage-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-sage-700"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: { value: PrimaryGoal; label: string }[];
  value: PrimaryGoal[];
  onChange: (v: PrimaryGoal[]) => void;
}) {
  function toggle(optValue: PrimaryGoal) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  return (
    <div role="group" aria-label={label}>
      <p className="mb-3 text-sm font-semibold text-ink-700">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl2 border px-4 py-3 text-sm transition-colors ${
                checked
                  ? "border-sage-600 bg-sage-50 text-sage-900"
                  : "border-ink-100 text-ink-600 hover:border-sage-300"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="h-4 w-4 accent-sage-700"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RadioCard({
  name,
  value,
  label,
  selected,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl2 border px-5 py-4 transition-colors ${
        selected
          ? "border-sage-600 bg-sage-50 text-sage-900"
          : "border-ink-100 text-ink-700 hover:border-sage-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="mt-1 h-4 w-4 accent-sage-700"
      />
      <span>{label}</span>
    </label>
  );
}
