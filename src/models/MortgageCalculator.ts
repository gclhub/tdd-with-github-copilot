/**
 * MortgageCalculator Class
 * 
 * Calculates mortgage payments based on principal, down payment, interest rate, and loan term.
 */
export class MortgageCalculator {
  /**
   * Calculate the monthly mortgage payment
   * 
   * @param loanAmount - The loan amount (property price minus down payment)
   * @param interestRate - The annual interest rate (as a percentage)
   * @param loanTerm - The loan term in years
   * @returns The monthly payment amount
   */
  calculateMonthlyPayment(
    loanAmount: number,
    interestRate: number,
    loanTerm: number
  ): number {
    
    // Convert annual interest rate to monthly rate (and decimal)
    const monthlyRate = interestRate / 100 / 12;
    
    // Convert loan term from years to months
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using the formula:
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    // Where:
    // M = monthly payment
    // P = principal (loan amount)
    // r = monthly interest rate
    // n = number of payments
    
    // Handle edge case of 0% interest rate
    if (monthlyRate === 0) {
      return loanAmount / numberOfPayments;
    }
    
    const monthlyPayment = 
      loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  }

  /**
   * Calculate the total amount paid over the life of the loan
   * 
   * @param monthlyPayment - The monthly payment amount
   * @param loanTerm - The loan term in years
   * @returns The total amount paid
   */
  calculateTotalPayment(monthlyPayment: number, loanTerm: number): number {
    return monthlyPayment * loanTerm * 12;
  }

  /**
   * Calculate the total interest paid over the life of the loan
   * 
   * @param totalPayment - The total amount paid
   * @param loanAmount - The principal loan amount
   * @returns The total interest paid
   */
  calculateTotalInterest(totalPayment: number, loanAmount: number): number {
    return totalPayment - loanAmount;
  }

  /**
   * Generate an amortization schedule
   * 
   * @param loanAmount - The principal loan amount
   * @param monthlyPayment - The monthly payment amount
   * @param interestRate - The annual interest rate (as a percentage)
   * @param loanTerm - The loan term in years
   * @returns An array of payment objects showing principal, interest, and remaining balance for each payment
   */
  generateAmortizationSchedule(
    loanAmount: number,
    monthlyPayment: number,
    interestRate: number,
    loanTerm: number
  ): Array<{
    paymentNumber: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }> {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    let remainingBalance = loanAmount;
    const schedule = [];

    for (let paymentNumber = 1; paymentNumber <= totalPayments; paymentNumber++) {
      // Calculate interest for this payment
      const interestPayment = remainingBalance * monthlyRate;
      
      // Calculate principal for this payment
      const principalPayment = monthlyPayment - interestPayment;
      
      // Update remaining balance
      remainingBalance -= principalPayment;
      
      // Add payment to schedule
      schedule.push({
        paymentNumber,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance) // Ensure we don't show negative balance
      });
    }

    return schedule;
  }
}
