import { MortgageCalculator } from '../models/MortgageCalculator';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * Test suite for the extra payments feature
 * 
 * This tests the ability to calculate how extra monthly payments affect:
 * - Total loan term reduction
 * - Interest savings over the life of the loan
 * - Updated amortization schedule
 */
describe('Extra Payment Impact Calculator', () => {
  let calculator: MortgageCalculator;
  
  beforeEach(() => {
    calculator = new MortgageCalculator();
  });

  /**
   * Test standard extra payment impact with typical parameters
   */
  test('should calculate extra payment impact correctly', () => {
    // Arrange
    const loanAmount = 300000;
    const interestRate = 4.5;
    const loanTermYears = 30;
    const extraMonthlyPayment = 200;
    
    // Act
    const impact = calculator.calculateExtraPaymentImpact(
      loanAmount,
      interestRate,
      loanTermYears,
      extraMonthlyPayment
    );
    
    // Calculate standard payment for comparison
    const standardMonthly = calculator.calculateMonthlyPayment(
      loanAmount, 
      interestRate,
      loanTermYears
    );
    
    // Expected values
    const totalStandardPayment = standardMonthly * loanTermYears * 12;
    const totalStandardInterest = totalStandardPayment - loanAmount;
    
    // Log for visibility
    console.log(`Loan Amount: ${formatCurrency(loanAmount)}`);
    console.log(`Interest Rate: ${formatPercentage(interestRate)}`);
    console.log(`Standard Monthly Payment: ${formatCurrency(standardMonthly)}`);
    console.log(`Extra Monthly Payment: ${formatCurrency(extraMonthlyPayment)}`);
    console.log(`New Loan Term: ${Math.floor(impact.newLoanTermMonths / 12)} years, ${impact.newLoanTermMonths % 12} months`);
    console.log(`Time Saved: ${Math.floor(impact.monthsSaved / 12)} years, ${impact.monthsSaved % 12} months`);
    console.log(`Interest Saved: ${formatCurrency(impact.interestSaved)}`);
    
    // Assert
    expect(impact.newLoanTermMonths).toBeLessThan(loanTermYears * 12);
    expect(impact.monthsSaved).toBeGreaterThan(0);
    expect(impact.interestSaved).toBeGreaterThan(0);
    expect(impact.totalInterestStandard).toBeCloseTo(totalStandardInterest, 0);
  });
  
  /**
   * Test with zero extra payment - should have no impact
   */
  test('should handle zero extra payment correctly', () => {
    // Arrange
    const loanAmount = 250000;
    const interestRate = 4.0;
    const loanTermYears = 15;
    const extraMonthlyPayment = 0;
    
    // Act
    const impact = calculator.calculateExtraPaymentImpact(
      loanAmount,
      interestRate,
      loanTermYears,
      extraMonthlyPayment
    );
    
    // Log for visibility
    console.log(`New Loan Term: ${impact.newLoanTermMonths} months (original: ${loanTermYears * 12})`);
    console.log(`Interest Saved: ${formatCurrency(impact.interestSaved)}`);
    
    // Assert
    expect(impact.newLoanTermMonths).toBe(loanTermYears * 12);
    expect(impact.monthsSaved).toBe(0);
    expect(impact.interestSaved).toBe(0);
  });
  
  /**
   * Test with a large extra payment that significantly reduces the loan term
   */
  test('should handle large extra payment correctly', () => {
    // Arrange
    const loanAmount = 200000;
    const interestRate = 3.75;
    const loanTermYears = 30;
    const extraMonthlyPayment = 500; // Significant extra payment
    
    // Act
    const impact = calculator.calculateExtraPaymentImpact(
      loanAmount,
      interestRate,
      loanTermYears,
      extraMonthlyPayment
    );
    
    // Standard monthly payment
    const standardMonthly = calculator.calculateMonthlyPayment(
      loanAmount, 
      interestRate,
      loanTermYears
    );
    
    // Log for visibility
    console.log(`Standard Monthly: ${formatCurrency(standardMonthly)}`);
    console.log(`Extra Monthly: ${formatCurrency(extraMonthlyPayment)}`);
    console.log(`Original Term: ${loanTermYears * 12} months`);
    console.log(`New Term: ${impact.newLoanTermMonths} months`);
    console.log(`Time Saved: ${impact.monthsSaved} months (${(impact.monthsSaved / 12).toFixed(1)} years)`);
    console.log(`Interest Saved: ${formatCurrency(impact.interestSaved)}`);
    
    // Assert - should save significant time (at least 25% of the original term)
    expect(impact.monthsSaved).toBeGreaterThan(loanTermYears * 12 * 0.25);
    expect(impact.interestSaved).toBeGreaterThan(20000); // Should save significant interest
  });
});