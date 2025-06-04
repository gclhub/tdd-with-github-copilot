import { MortgageCalculator } from '../models/MortgageCalculator';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * Simple test framework
 */
function test(name: string, testFn: () => boolean): void {
  try {
    const passed = testFn();
    if (passed) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${(error as Error).message}`);
  }
}

/**
 * Test cases for the mortgage calculator
 */
function runTests(): void {
  const calculator = new MortgageCalculator();
  
  console.log('\n----- MORTGAGE CALCULATOR TESTS -----\n');
  
  // Test case 1: $300,000 property, $60,000 down payment (20%), 5% interest, 30-year term
  test('Standard mortgage calculation', () => {
    const propertyPrice = 300000;
    const downPayment = 60000;
    const interestRate = 5;
    const loanTerm = 30;
    
    const loanAmount = propertyPrice - downPayment;
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    
    // Expected monthly payment around $1,288.37 for these parameters
    const expectedPayment = 1288.37;
    const isWithinRange = Math.abs(monthlyPayment - expectedPayment) < 1; // Within $1
    
    // Display details of calculation
    const totalPayment = calculator.calculateTotalPayment(monthlyPayment, loanTerm);
    const totalInterest = calculator.calculateTotalInterest(totalPayment, loanAmount);
    
    console.log(`  Property Price: ${formatCurrency(propertyPrice)}`);
    console.log(`  Down Payment: ${formatCurrency(downPayment)} (${formatPercentage(downPayment/propertyPrice*100)})`);
    console.log(`  Loan Amount: ${formatCurrency(loanAmount)}`);
    console.log(`  Interest Rate: ${formatPercentage(interestRate)}`);
    console.log(`  Monthly Payment: ${formatCurrency(monthlyPayment)}`);
    console.log(`  Total Payments: ${formatCurrency(totalPayment)}`);
    console.log(`  Total Interest: ${formatCurrency(totalInterest)}`);
    
    return isWithinRange;
  });
  
  // Test case 2: Zero interest rate
  test('Zero interest rate calculation', () => {
    const propertyPrice = 200000;
    const downPayment = 40000;
    const interestRate = 0;
    const loanTerm = 15;
    
    const loanAmount = propertyPrice - downPayment;
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    const expectedPayment = loanAmount / (loanTerm * 12);
    
    // Should be exact match for zero interest
    const isExact = Math.abs(monthlyPayment - expectedPayment) < 0.01;
    
    console.log(`  Monthly Payment (0% interest): ${formatCurrency(monthlyPayment)}`);
    console.log(`  Expected Payment: ${formatCurrency(expectedPayment)}`);
    
    return isExact;
  });
  
  // Test case 3: Amortization schedule correctness
  test('Amortization schedule calculation', () => {
    const loanAmount = 100000;
    const interestRate = 4;
    const loanTerm = 10;
    
    // Calculate monthly payment first
    const monthlyPayment = calculator.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    
    // Generate full amortization schedule
    const schedule = calculator.generateAmortizationSchedule(
      loanAmount,
      monthlyPayment,
      interestRate,
      loanTerm
    );
    
    // Verify we have the right number of payments
    const hasCorrectPayments = schedule.length === loanTerm * 12;
    
    // Verify final balance is close to zero
    const finalBalance = schedule[schedule.length - 1].remainingBalance;
    const isBalanceNearZero = finalBalance < 1;
    
    console.log(`  Schedule Entries: ${schedule.length} (expected: ${loanTerm * 12})`);
    console.log(`  Final Balance: ${formatCurrency(finalBalance)}`);
    
    return hasCorrectPayments && isBalanceNearZero;
  });
  
  console.log('\n----------------------------------\n');
}

// Run all tests
runTests();
