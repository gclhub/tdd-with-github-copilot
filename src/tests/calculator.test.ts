import { MortgageCalculator } from '../models/MortgageCalculator';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * Test suite for the basic mortgage calculator functionality
 */
describe('Mortgage Calculator', () => {
  let calculator: MortgageCalculator;
  
  beforeEach(() => {
    calculator = new MortgageCalculator();
  });

  /**
   * Standard mortgage calculation test
   * Verifies that the monthly payment calculation is correct
   * for typical mortgage scenarios
   */
  test('should calculate standard mortgage payment correctly', () => {
    // Arrange
    const loanAmount = 200000;
    const interestRate = 5.5;
    const loanTerm = 30;
    
    // Act
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount, 
      interestRate,
      loanTerm
    );
    
    // Assert
    // Calculate expected payment using the formula
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const expectedPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Log for visibility
    console.log(`Monthly Payment: ${formatCurrency(monthlyPayment)}`);
    console.log(`Expected Payment: ${formatCurrency(expectedPayment)}`);
    
    expect(monthlyPayment).toBeCloseTo(expectedPayment, 2);
  });
  
  /**
   * Zero interest rate test
   * Mortgage calculator should handle the edge case of 0% interest rate
   */
  test('should calculate payment correctly with 0% interest rate', () => {
    // Arrange
    const loanAmount = 150000;
    const interestRate = 0;
    const loanTerm = 15;
    
    // Act
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    
    // Assert
    const expectedPayment = loanAmount / (loanTerm * 12);
    
    // Log for visibility
    console.log(`Monthly Payment (0% interest): ${formatCurrency(monthlyPayment)}`);
    console.log(`Expected Payment: ${formatCurrency(expectedPayment)}`);
    
    expect(monthlyPayment).toBeCloseTo(expectedPayment, 2);
  });
  
  /**
   * Amortization schedule test
   * Verifies that the generated amortization schedule correctly
   * accounts for all payments and pays off the loan
   */
  test('should generate correct amortization schedule', () => {
    // Arrange
    const loanAmount = 100000;
    const interestRate = 4;
    const loanTerm = 10;
    
    // Calculate monthly payment first
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    
    // Act
    const schedule = calculator.generateAmortizationSchedule(
      loanAmount,
      monthlyPayment,
      interestRate,
      loanTerm
    );
    
    // Assert
    // Log for visibility
    console.log(`Schedule Entries: ${schedule.length} (expected: ${loanTerm * 12})`);
    console.log(`Final Balance: ${formatCurrency(schedule[schedule.length - 1].remainingBalance)}`);
    
    // Verify we have the right number of payments
    expect(schedule.length).toBe(loanTerm * 12);
    
    // Verify final balance is close to zero
    expect(schedule[schedule.length - 1].remainingBalance).toBeLessThan(1);
    
    // Verify that the sum of all principal payments equals the loan amount
    const totalPrincipal = schedule.reduce((sum, payment) => sum + payment.principal, 0);
    expect(totalPrincipal).toBeCloseTo(loanAmount, 0);
  });
});
