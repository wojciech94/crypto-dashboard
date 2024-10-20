# Table of Contents

1. [Description](#description)
2. [Website](#website)
3. [Features](#features)
4. [User guide](#user-guide)
5. [Installation guide](#installation-guide)

# Description

Crypto-dashboard is a comprehensive platform that showcases cryptocurrency panels, providing detailed statistics and real-time data for informed trading and investment decisions.

# Website
[CryptoDashboard](https://wk-crypto-dashboard.netlify.app)

# Features
   - Managing favorites coins list
   - Managing portfolio (manual creation of portfolio list)
   - Managing transactions (creating transactions for coins in portfolio!)
   - Portfolio chart (based on transactions)
   - Managing wallets addresses
   - Fetching wallet portfolio (Add any erc20 wallet address in Wallets tab)
   - Managing price alerts
   - Settings modifications

# User guide
The user guide is available at /docs/user-guide.md

# Installation Guide

1. **Create an account** on [CoinGecko](https://www.coingecko.com).

2. **Generate an API key** at [CoinGecko Developers Dashboard](https://www.coingecko.com/en/developers/dashboard).

3. **Create a `.env` file** in the main directory of the project.

4. **Insert your API key** into the `.env` file using the following format:

   ```plaintext
   REACT_APP_COINGECKO_API_KEY=YOUR_API_KEY
   ```

5. **Add cryptocurrencies network integrations** to `.env` file:
   
    ```plaintext
   REACT_APP_ETHERSCAN_API_KEY=YOUR_API_KEY
   REACT_APP_ARBISCAN_API_KEY=YOUR_API_KEY
   REACT_APP_OPTIMISM_API_KEY=YOUR_API_KEY
   ```
   This enables the feature of fetching token balances for a specific wallet address.

   [Ethereum](https://etherscan.io/),
   [Arbitrum](https://arbiscan.io/),
   [Optimism](https://optimistic.etherscan.io/)

7. **Install the project dependencies**:

   Run the following command in your terminal:

   ```bash
   npm install
   ```

8. **Start the development server**:

   Run the following command in your terminal:

   ```bash
   npm run dev
   ```

9. **Access the app**:

   Open your web browser and navigate to the following URL: [http://127.0.0.1:5173/](http://127.0.0.1:5173/).
  
10. **Additional Notes**:

   - **Ensure that Node.js and npm are installed** on your system. You can download Node.js from [nodejs.org](https://nodejs.org/).
   - For **new integrations**, instructions on adding a new network integration will be provided.
   - If you encounter any problems, report them by opening an issue in the repository.
