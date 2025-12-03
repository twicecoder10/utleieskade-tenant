// Payment-related constants

export const PAYMENT_CURRENCY = "nok";
export const PAYMENT_CURRENCY_SYMBOL = "NOK";

// Payment statuses
export enum PaymentStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  REJECTED = "rejected",
  FAILED = "failed",
}

// Assessment levels
export enum AssessmentLevel {
  STANDARD = "standard",
  DETAILED = "detailed",
}

// Urgency levels
export enum UrgencyLevel {
  HIGH = "high",
  MODERATE = "moderate",
  LOW = "low",
}

// Payment methods
export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  APPLE_PAY = "apple_pay",
  GOOGLE_PAY = "google_pay",
}

// Damage locations (matching spec)
export const DAMAGE_LOCATIONS = [
  "Bathroom",
  "Kitchen",
  "Exterior",
  "Living Room",
  "Furniture",
  "Other",
] as const;

export type DamageLocation = typeof DAMAGE_LOCATIONS[number];

// Damage types
export const DAMAGE_TYPES = [
  "Water Damage",
  "Electricity Issues",
  "Structural Damage",
  "Appliance Malfunction",
  "Pest Problem",
] as const;

export type DamageType = typeof DAMAGE_TYPES[number];

// Cause of damage
export const CAUSE_OF_DAMAGE = [
  "Accident",
  "External Impact",
  "Leakage",
] as const;

export type CauseOfDamage = typeof CAUSE_OF_DAMAGE[number];

