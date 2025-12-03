// Pricing calculation utilities

export interface PricingConfig {
  basePrice: number; // Base price per room
  urgentFee: number; // Additional fee for urgent cases
  standardAssessmentPrice: number; // Standard assessment price
  detailedAssessmentPrice: number; // Detailed assessment price
}

export const DEFAULT_PRICING: PricingConfig = {
  basePrice: 100, // NOK
  urgentFee: 50, // NOK
  standardAssessmentPrice: 0, // Included in base
  detailedAssessmentPrice: 200, // Additional for detailed assessment
};

export interface RoomPricing {
  roomCount: number;
  basePrice: number;
  discount: number; // Percentage discount
  discountedPrice: number;
  assessmentLevel: "standard" | "detailed";
  isUrgent: boolean;
  totalPrice: number;
}

export function calculatePricing(
  roomCount: number,
  assessmentLevel: "standard" | "detailed" = "standard",
  isUrgent: boolean = false,
  config: PricingConfig = DEFAULT_PRICING
): RoomPricing {
  // Calculate base price for all rooms
  const basePrice = config.basePrice * roomCount;

  // Apply discounts based on room count
  let discount = 0;
  if (roomCount === 2) {
    discount = 10; // 10% discount for 2 rooms
  } else if (roomCount >= 3) {
    discount = 15; // 15% discount for 3+ rooms
  }

  const discountedPrice = basePrice * (1 - discount / 100);

  // Add assessment level pricing
  let assessmentPrice = 0;
  if (assessmentLevel === "detailed") {
    assessmentPrice = config.detailedAssessmentPrice;
  }

  // Add urgent fee
  const urgentFee = isUrgent ? config.urgentFee : 0;

  // Calculate total
  const totalPrice = discountedPrice + assessmentPrice + urgentFee;

  return {
    roomCount,
    basePrice,
    discount,
    discountedPrice,
    assessmentLevel,
    isUrgent,
    totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
  };
}

