
# CryptoX – Cryptocurrency Trading Platform

CryptoX is a full-stack cryptocurrency trading platform that allows users to explore cryptocurrency markets, monitor real-time prices, manage digital wallets, and buy or sell cryptocurrencies through an interactive dashboard.

The application integrates external cryptocurrency market APIs with a Spring Boot backend to provide market data, while handling authentication, wallet management, trading operations, and portfolio tracking.

## Features

- **User Authentication** – Secure user registration and login using JWT authentication.
- **Cryptocurrency Market** – Browse cryptocurrencies, market prices, and market statistics.
- **Coin Search** – Search for cryptocurrencies by name or symbol.
- **Coin Details** – View cryptocurrency prices, market capitalization, 24-hour high/low, and price changes.
- **Price Charts** – Visualize historical cryptocurrency price movements.
- **Digital Wallet** – Manage wallet balances, deposits, and withdrawals.
- **Crypto Trading** – Buy and sell cryptocurrencies.
- **Portfolio Management** – Track holdings, total portfolio value, and profit/loss.
- **Transaction History** – View wallet and trading transactions.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend
- Java
- Spring Boot
- Spring Security
- REST APIs
- JWT Authentication

### Database
- MySQL

### External API
- CoinGecko API – Cryptocurrency market data, prices, coin details, and historical charts.

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting

## Architecture

React + TypeScript Frontend
          |
          | Axios / HTTP Requests
          v
Spring Boot REST API
          |
    -------------------
    |        |        |
    v        v        v
 Auth     Trading   Wallet
 Service  Service   Service
    |        |        |
    -------------------
          |
          v
        MySQL

Spring Boot Backend
          |
          v
   CoinGecko External API
   (Market Data & Prices)


## API Modules

| Module | Description |
| Authentication | Registration, login, OTP verification, JWT authentication |
| Crypto Market | Market listings, search, coin details, charts |
| Wallet | Balance, deposits, withdrawals, transactions |
| Trading | Buy and sell cryptocurrencies |
| Portfolio | Holdings, valuation, and portfolio tracking |

## External API Integration

CryptoX integrates with the CoinGecko API to retrieve cryptocurrency market information.

The Spring Boot backend communicates with the external API through HTTP requests, processes JSON responses, maps the response data into Java DTOs, and exposes application-specific REST endpoints to the frontend.

## Security

- JWT-based authentication
- Spring Security
- Protected API endpoints
- Authenticated trading and wallet operations

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MySQL

## Future Enhancements

- Real-time price updates
- Advanced trading charts
- Watchlist functionality
- Price alerts
- Enhanced transaction analytics
- Improved risk and fraud monitoring

## Disclaimer

CryptoX is an educational and portfolio project. It is not a real cryptocurrency exchange and does not facilitate actual blockchain transactions or real-money cryptocurrency trading.



**Built with Java, Spring Boot, React, TypeScript, and MySQL.**
