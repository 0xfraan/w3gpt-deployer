# Smart Contract AI API Tester

A Next.js application for testing an AI API that writes and deploys smart contracts.

## Features

- List of 50 example prompts for smart contract generation
- Editable prompt library (add, edit, delete prompts)
- Settings panel for API key and chain ID configuration
- Contract generation with a simple click
- Clean display of AI-generated smart contracts

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your API key in the settings panel
2. Select a chain ID from the dropdown
3. Click on a prompt from the library or add your own
4. Click "Generate Smart Contract" to run the selected prompt
5. View the generated smart contract in the result panel

## API Configuration

To use the API properly, you need to:

1. Configure the actual API endpoint in `src/lib/api.ts`
2. Provide a valid API key in the settings panel
3. Select the appropriate chain ID for your target blockchain

## Notes

- This is a client-side only application for testing purposes
- No actual contract deployment is performed
- Modify the API integration as needed for your specific requirements