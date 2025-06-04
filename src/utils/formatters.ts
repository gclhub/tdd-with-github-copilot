/**
 * Format a number as currency
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a number as a percentage
 * 
 * @param value - The value to format as percentage
 * @param decimalPlaces - Number of decimal places to show
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimalPlaces: number = 2): string {
  return value.toFixed(decimalPlaces) + '%';
}
