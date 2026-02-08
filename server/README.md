# Kaamgar API - Backend Server

RESTful API for the Kaamgar Contractor Management Application.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing
- **CORS:** Enabled for frontend integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `server/` directory with the following variables:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/kaamgar
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   ```

   **🔐 Security Note:** 
   - Generate a secure JWT secret using: 
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - **NEVER** commit `.env` to version control!

3. **Start the server:**
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

4. **Verify the server is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Expected response:
   ```json
   {
     "status": "OK",
     "message": "Kaamgar API is running"
   }
   ```

## 📁 Project Structure

```
server/
├── models/              # Mongoose schemas
│   ├── Contractor.js    # Contractor/user model
│   ├── Worker.js        # Worker model
│   ├── Attendance.js    # Attendance records
│   ├── Advance.js       # Advance payments
│   └── Holiday.js       # Holiday calendar
├── routes/              # API routes
│   ├── auth.routes.js   # Authentication endpoints
│   ├── worker.routes.js # Worker management
│   ├── attendance.routes.js
│   ├── advance.routes.js
│   └── holiday.routes.js
├── middleware/          # Custom middleware
│   └── auth.middleware.js  # JWT authentication
├── server.js            # Main application file
└── package.json         # Dependencies
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new contractor
- `POST /login` - Login
- `GET /me` - Get current user profile (protected)
- `PUT /me` - Update profile (protected)

### Workers (`/api/workers`)
- `GET /` - Get all workers
- `GET /:id` - Get single worker
- `POST /` - Create worker
- `PUT /:id` - Update worker
- `DELETE /:id` - Delete worker
- `PATCH /:id/toggle-status` - Toggle active/inactive

### Attendance (`/api/attendance`)
- `GET /` - Get attendance records (supports filters)
- `POST /` - Mark attendance
- `POST /bulk` - Bulk mark attendance
- `GET /date/:date` - Get attendance for date
- `DELETE /:id` - Delete attendance

### Advances (`/api/advances`)
- `GET /` - Get all advances (supports filters)
- `POST /` - Record advance
- `PUT /:id` - Update advance
- `DELETE /:id` - Delete advance
- `GET /worker/:workerId/monthly` - Monthly total

### Holidays (`/api/holidays`)
- `GET /` - Get all holidays
- `POST /` - Create holiday
- `PUT /:id` - Update holiday
- `DELETE /:id` - Delete holiday

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Login Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'

# 3. Use the token in subsequent requests
curl -X GET http://localhost:5000/api/workers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Data Models

### Contractor
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  companyName: String,
  subscriptionPlan: 'free' | 'basic' | 'standard' | 'premium',
  subscriptionStatus: 'active' | 'expired' | 'trial',
  trialEndsAt: Date
}
```

### Worker
```javascript
{
  contractorId: ObjectId,
  name: String,
  age: Number (18-70),
  dailyWage: Number,
  workStartTime: String,
  workEndTime: String,
  photo: String (base64),
  photoLocation: { latitude, longitude, accuracy, timestamp },
  status: 'active' | 'inactive',
  joiningDate: Date
}
```

### Attendance
```javascript
{
  contractorId: ObjectId,
  workerId: ObjectId,
  date: String (YYYY-MM-DD),
  status: 'present' | 'absent',
  overtimeHours: Number,
  checkInTime: String,
  checkOutTime: String,
  notes: String
}
```

### Advance
```javascript
{
  contractorId: ObjectId,
  workerId: ObjectId,
  amount: Number,
  date: String (YYYY-MM-DD),
  reason: String,
  status: 'pending' | 'deducted' | 'cancelled'
}
```

### Holiday
```javascript
{
  contractorId: ObjectId,
  date: String (YYYY-MM-DD),
  name: String,
  description: String
}
```

## 🔍 Query Filters

### Attendance Filters
```javascript
GET /api/attendance?month=1&year=2026        // Specific month
GET /api/attendance?date=2026-02-08          // Specific date
GET /api/attendance?workerId=507f1f77...     // Specific worker
```

### Advance Filters
```javascript
GET /api/advances?workerId=507f1f77...       // By worker
GET /api/advances?month=1&year=2026          // By month
GET /api/advances?status=pending             // By status
```

### Holiday Filters
```javascript
GET /api/holidays?year=2026                  // By year
```

## 🗄️ Database Indexes

For optimal performance, the following indexes are automatically created:

- **Attendance:** `{ contractorId, workerId, date }` (unique compound)
- **Attendance:** `{ contractorId, date }`
- **Worker:** `{ contractorId, status }`
- **Advance:** `{ contractorId, workerId }`, `{ contractorId, date }`
- **Holiday:** `{ contractorId, date }` (unique compound)

## 🚨 Error Handling

All endpoints follow this error response format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (dev only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## 🔐 Security Best Practices

✅ **Implemented:**
- Password hashing with bcryptjs (12 rounds)
- JWT authentication with expiry
- CORS configuration
- Contractor-scoped queries (data isolation)
- Input validation
- Unique constraints on critical fields

⚠️ **Recommended for Production:**
- Rate limiting (use `express-rate-limit`)
- Request validation (use `express-validator`)
- Helmet.js for security headers
- MongoDB connection pooling
- Environment-specific configurations
- Logging (winston/morgan)
- API documentation (Swagger)

## 🧪 Testing

```bash
# Install dev dependencies
npm install --save-dev jest supertest

# Run tests (when implemented)
npm test
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

## 🚀 Deployment

### MongoDB Atlas (Recommended)
1. Create a cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Whitelist your server's IP
3. Copy connection string to `MONGODB_URI`

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Configure environment variables in Vercel dashboard

### DigitalOcean / AWS / GCP
1. Set up a Node.js server
2. Clone repository
3. Install dependencies
4. Configure environment variables
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name kaamgar-api
   pm2 save
   pm2 startup
   ```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running locally or check your `MONGODB_URI` in `.env`

### JWT Authentication Error
```
Invalid or expired token
```
**Solution:** Check that `JWT_SECRET` is consistent and token hasn't expired (30 days)

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Add your frontend URL to `allowedOrigins` in `server.js` or set `FRONTEND_URL` in `.env`

## 📝 License

This project is proprietary and confidential.

## 👥 Contributors

- Vishal Soni - Project Owner

## 📞 Support

For issues or questions, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** February 8, 2026
