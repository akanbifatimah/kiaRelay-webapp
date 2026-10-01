/**
 * The business product's name (TC-14, 2026-09-28). Company customer
 * accounts are presented as "KiaRelay Business" wherever the label names the
 * account type or product. Field labels about a company's own details
 * ("Company Name", "Company Legal Name") and KiaRelay's own Company Settings
 * keep "Company". Change it here if the pending naming decision lands on
 * "KiaRelay for Businesses".
 */
export const BUSINESS_BRAND = "KiaRelay Business";

/** Display label for a customer account type. */
export const accountTypeLabel = (accountType: "individual" | "company") => (accountType === "individual" ? "Individual" : BUSINESS_BRAND);

// Same pages as the customer app's constants/brand.ts.
// TODO: point at the real Terms/Privacy pages once the website URL is final.
export const TERMS_URL = "https://www.kiarelay.com/terms";
export const PRIVACY_URL = "https://www.kiarelay.com/privacy";
