# wallpaper-backend

Node.js Express API generated with express-backend-cli

## Features

- ✅ Express.js server
- ✅ MongoDB integration with Mongoose
- ✅ Winston logging
- ✅ HTTP request logging with Morgan
- ✅ Global error handling middleware
- ✅ CORS enabled
- ✅ Environment configuration with dotenv
- ✅ Standardized API response format

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env` (especially DATABASE_URL)

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Test Endpoint
- **POST** `/api/v1/test/hello`
  - Description: Test endpoint to verify API is working
  - Response: `{ "message": "Hello World! Your API is working correctly." }`

## Project Structure

```
wallpaper-backend/
├── config/          # Configuration files
│   ├── db.js        # Database connection
│   ├── logger.js    # Winston logger configuration
│   └── morgan.js    # Morgan HTTP logging
├── controller/      # Route controllers
│   └── test.js
├── middleware/      # Custom middleware
│   └── error-handler.js
├── routes/          # API routes
│   └── test.js
├── template/        # Response templates
│   └── response.js
├── .env.example     # Environment variables example
├── package.json
└── server.js        # Main server file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
BASE_URL=http://localhost:
DATABASE_URL=mongodb://localhost:27017/your-database-name
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.