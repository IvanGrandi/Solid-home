// Product categories; must match the `category` values stored in the database
export const CATEGORIES = ["Beds", "Furniture", "Decoration", "Storage", "Home"];

export function formatPrice(value) {
  return Number(value || 0).toFixed(2);
}
