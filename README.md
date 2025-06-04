# Mortgage Payment Calculator

A financial calculator for computing mortgage payments based on down payment, interest rate, and loan length.

## Features

- Calculate monthly mortgage payments
- Display total payment and interest over the life of the loan
- Show detailed amortization schedule
- Format results as currency and percentages

## Prerequisites

- Node.js (v14 or higher recommended)
- npm

## Installation

Clone the repository, then either:

### Option 1: Use the setup script

```bash
./setup.sh
```

### Option 2: Manual installation

```bash
npm install
npm run build
```

## Usage

Run the application using:

```bash
npm start
```

Follow the interactive prompts to:
1. Enter the total property price
2. Specify your down payment amount
3. Enter the annual interest rate (as a percentage)
4. Provide the loan term in years

The calculator will then display:
- Monthly payment amount
- Total payments over the life of the loan
- Total interest paid
- Optional amortization schedule with payment breakdown

## Technical Details

The calculator uses the standard mortgage payment formula:

```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Where:
- M = monthly payment
- P = principal (loan amount)
- r = monthly interest rate (annual rate divided by 12)
- n = number of payments (loan term in years * 12)

## Development

### Building the Project

Build the TypeScript project:

```bash
npm run build
```

The compiled JavaScript files will be output to the `dist` directory.

### Running the Tests

Run the test suite to verify the calculator works correctly:

```bash
npm test
```

This will run a series of tests to validate:
- Standard mortgage calculation
- Zero interest rate calculation
- Amortization schedule generation

### Debugging with VS Code

The project includes VS Code launch configurations for debugging:

1. **Launch Mortgage Calculator** - Runs the main calculator with the interactive CLI
2. **Run Tests** - Runs the test suite with the debugger attached

To start debugging:
1. Open the Debug panel in VS Code (Ctrl+Shift+D or Cmd+Shift+D on Mac)
2. Select the configuration you want to run from the dropdown
3. Click the green play button or press F5

## License

ISC
