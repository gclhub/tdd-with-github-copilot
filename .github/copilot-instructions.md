<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Mortgage Calculator Project

This project is a financial calculator for computing mortgage payments based on down payment, interest rate, and loan length. 

## Code Guidelines

- Use TypeScript with strong typing for all new code
- Follow a functional programming approach when possible
- Document all functions with JSDoc comments
- Format currency values using the formatCurrency utility
- Format percentages using the formatPercentage utility
- Write clean, readable code with descriptive variable names

## Project Structure

- `src/models/` - Contains the core calculation logic
- `src/utils/` - Contains utility functions like formatters
- `src/` - Contains the main application entry point

## Key Components

- `MortgageCalculator` - The main class that handles payment calculations
- `formatCurrency` and `formatPercentage` - Utility functions for output formatting
- Command-line interface using the inquirer package
