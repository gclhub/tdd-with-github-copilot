import inquirer from 'inquirer';
import { MortgageCalculator } from './models/MortgageCalculator';
import { formatCurrency, formatPercentage } from './utils/formatters';

// Define interfaces for better type safety
interface MortgageAnswers {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
}

interface AmortizationOptions {
  showSchedule: boolean;
}

/**
 * Financial Calculator CLI
 * 
 * A command-line interface for the mortgage payment calculator.
 */
async function main() {
  console.log('\n===== Mortgage Payment Calculator =====\n');
  
  const questions = [
    {
      type: 'number',
      name: 'propertyPrice' as const,
      message: 'What is the total property price?',
      validate: (value: number): boolean | string => value > 0 ? true : 'Please enter a positive number'
    },
    {
      type: 'number',
      name: 'downPayment' as const,
      message: 'What is your down payment amount?',
      validate: (value: number, answers: any): boolean | string => {
        if (value < 0) return 'Please enter a non-negative number';
        
        // Check if propertyPrice exists and is a number
        // The answers object structure can vary between inquirer versions
        // This handles both direct access and nested property access patterns
        let propertyPrice: number;
        
        if (typeof answers === 'object' && answers !== null) {
          // Try to find propertyPrice in different possible locations
          if (typeof answers.propertyPrice === 'number') {
            propertyPrice = answers.propertyPrice;
          } else if (answers.answers && typeof answers.answers.propertyPrice === 'number') {
            propertyPrice = answers.answers.propertyPrice;
          } else {
            // Default to a high value to allow validation to pass in case of issues
            // This is safer than blocking valid inputs
            propertyPrice = Number.MAX_SAFE_INTEGER;
          }
        } else {
          propertyPrice = Number.MAX_SAFE_INTEGER;
        }
        
        // Now do the comparison with the extracted property price
        if (value >= propertyPrice) {
          return 'Down payment cannot exceed the property price';
        }
        
        return true;
      }
    },
    {
      type: 'number',
      name: 'interestRate' as const,
      message: 'What is the annual interest rate? (e.g. 5.25 for 5.25%)',
      validate: (value: number): boolean | string => value >= 0 ? true : 'Please enter a non-negative number'
    },
    {
      type: 'number',
      name: 'loanTerm' as const,
      message: 'What is the loan term in years?',
      validate: (value: number): boolean | string => value > 0 ? true : 'Please enter a positive number'
    }
  ];
  
  const answers = await inquirer.prompt<MortgageAnswers>(questions as any);

  const calculator = new MortgageCalculator();
  const { propertyPrice, downPayment, interestRate, loanTerm } = answers;
  
  // Calculate loan details
  const loanAmount = propertyPrice - downPayment;
  const monthlyPayment = calculator.calculateMonthlyPayment(
    loanAmount,
    interestRate,
    loanTerm
  );
  
  const totalPayment = calculator.calculateTotalPayment(monthlyPayment, loanTerm);
  const totalInterest = calculator.calculateTotalInterest(totalPayment, loanAmount);

  // Display summary
  console.log('\n===== Mortgage Payment Summary =====');
  console.log(`Property Price: ${formatCurrency(propertyPrice)}`);
  console.log(`Down Payment: ${formatCurrency(downPayment)} (${formatPercentage((downPayment / propertyPrice) * 100)})`);
  console.log(`Loan Amount: ${formatCurrency(loanAmount)}`);
  console.log(`Interest Rate: ${formatPercentage(interestRate)}`);
  console.log(`Loan Term: ${loanTerm} years`);
  console.log(`\nMonthly Payment: ${formatCurrency(monthlyPayment)}`);
  console.log(`Total of ${loanTerm * 12} Payments: ${formatCurrency(totalPayment)}`);
  console.log(`Total Interest: ${formatCurrency(totalInterest)}`);

  // Ask if user wants to see amortization schedule
  const scheduleQuestion = [
    {
      type: 'confirm',
      name: 'showSchedule' as const,
      message: 'Would you like to see the amortization schedule?',
      default: false
    }
  ];
  
  const { showSchedule } = await inquirer.prompt<AmortizationOptions>(scheduleQuestion as any);

  if (showSchedule) {
    const schedule = calculator.generateAmortizationSchedule(
      loanAmount,
      monthlyPayment,
      interestRate,
      loanTerm
    );

    console.log('\n===== Amortization Schedule =====');
    console.log('Payment #  | Payment       | Principal     | Interest      | Remaining Balance');
    console.log('--------------------------------------------------------------------------');

    // Display first 12 payments (1 year)
    for (let i = 0; i < Math.min(12, schedule.length); i++) {
      const payment = schedule[i];
      console.log(
        `${payment.paymentNumber.toString().padStart(10)} | ` +
        `${formatCurrency(payment.payment).padStart(13)} | ` +
        `${formatCurrency(payment.principal).padStart(13)} | ` +
        `${formatCurrency(payment.interest).padStart(13)} | ` +
        `${formatCurrency(payment.remainingBalance).padStart(13)}`
      );
    }

    // If term is more than 1 year, show some later payments at intervals
    if (loanTerm > 1) {
      console.log('...');
      
      // Show payments at year intervals
      for (let year = 2; year <= loanTerm; year += Math.ceil(loanTerm / 10)) {
        if (year > loanTerm) break;
        
        const paymentIndex = (year * 12) - 1; // Last payment of the year
        if (paymentIndex >= schedule.length) break;
        
        const payment = schedule[paymentIndex];
        console.log(
          `${payment.paymentNumber.toString().padStart(10)} | ` +
          `${formatCurrency(payment.payment).padStart(13)} | ` +
          `${formatCurrency(payment.principal).padStart(13)} | ` +
          `${formatCurrency(payment.interest).padStart(13)} | ` +
          `${formatCurrency(payment.remainingBalance).padStart(13)}`
        );
      }
      
      // Show final payment
      if (schedule.length > 0) {
        console.log('...');
        const finalPayment = schedule[schedule.length - 1];
        console.log(
          `${finalPayment.paymentNumber.toString().padStart(10)} | ` +
          `${formatCurrency(finalPayment.payment).padStart(13)} | ` +
          `${formatCurrency(finalPayment.principal).padStart(13)} | ` +
          `${formatCurrency(finalPayment.interest).padStart(13)} | ` +
          `${formatCurrency(finalPayment.remainingBalance).padStart(13)}`
        );
      }
    }
  }

  console.log('\nThank you for using the Mortgage Payment Calculator!');
}

main().catch(error => {
  console.error('An error occurred:', error);
});
