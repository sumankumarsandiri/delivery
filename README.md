# Loco Delivery API Documentation

## Endpoints

### 1. Register User

**Endpoint:** `/auth/register`

**Method:** `POST`

**Description:** This endpoint registers a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "fullname": "John Doe",
  "password": "password123"
}
```

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "User registered successfully",
  "status": 200,
  "data": {
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "fullname": "John Doe",
      "email": "user@example.com",
      "mobileNumber": null,
      "role": "customer",
      "socketId": null,
      "orders": [],
      "last_Login": "2023-10-10T10:00:00.000Z",
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "fullName is required",
      "param": "fullname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

- **Status Code:** 409 Conflict
- **Response Body:**

```json
{
  "success": 0,
  "message": "User already registered",
  "status": 409
}
```

### 2. User Check

**Endpoint:** `/auth/userChecking`

**Method:** `GET`

**Description:** This endpoint checks if a user is authenticated and returns user information.

**Headers:**

- Authorization: Bearer <token>

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "User found successfully",
  "status": 200,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "email": "user@example.com",
    "fullname": "John Doe",
    "orders": []
  }
}
```

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "success": 0,
  "message": "Invalid or expired token"
}
```

### 3. Login User

**Endpoint:** `/auth/login`

**Method:** `POST`

**Description:** This endpoint logs in a user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "User logged in successfully",
  "status": 200,
  "data": {
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "fullname": "John Doe",
      "email": "user@example.com",
      "mobileNumber": null,
      "role": "customer",
      "socketId": null,
      "orders": [],
      "last_Login": "2023-10-10T10:00:00.000Z",
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### 4. Get User Profile

**Endpoint:** `/auth/profile`

**Method:** `GET`

**Description:** This endpoint retrieves the profile of the authenticated user.

**Headers:**

- Authorization: Bearer <token>

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "fullname": "John Doe",
  "email": "user@example.com",
  "mobileNumber": null,
  "role": "customer",
  "socketId": null,
  "orders": [],
  "last_Login": "2023-10-10T10:00:00.000Z",
  "createdAt": "2023-10-10T10:00:00.000Z",
  "updatedAt": "2023-10-10T10:00:00.000Z"
}
```

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "success": 0,
  "message": "Invalid or expired token"
}
```

### 5. Logout User

**Endpoint:** `/auth/logout`

**Method:** `GET`

**Description:** This endpoint logs out the authenticated user.

**Headers:**

- Authorization: Bearer <token>

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "message": "User logged out successfully"
}
```

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "success": 0,
  "message": "Invalid or expired token"
}
```

### 6. Register Captain

**Endpoint:** `/captain/register`

**Method:** `POST`

**Description:** This endpoint registers a new captain.

**Request Body:**

```json
{
  "email": "captain@example.com",
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "TX 01 ER 1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Captain registered successfully",
  "status": 200,
  "data": {
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      },
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    }
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "fullName is required",
      "param": "fullname",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    },
    {
      "msg": "Color must be at least 3 characters long",
      "param": "vehicle.color",
      "location": "body"
    },
    {
      "msg": "Plate must be at least 3 characters long",
      "param": "vehicle.plate",
      "location": "body"
    },
    {
      "msg": "Capacity must be at least 1",
      "param": "vehicle.capacity",
      "location": "body"
    },
    {
      "msg": "Vehicle type must be bike, car or truck",
      "param": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

### 7. Login Captain

**Endpoint:** `/captain/login`

**Method:** `POST`

**Description:** This endpoint logs in a captain.

**Request Body:**

```json
{
  "email": "captain@example.com",
  "password": "password123"
}
```

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Captain logged in successfully",
  "status": 200,
  "data": {
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      },
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### 8. Get Captain Profile

**Endpoint:** `/captain/profile`

**Method:** `GET`

**Description:** This endpoint retrieves the profile of the authenticated captain.

**Headers:**

- Authorization: Bearer <token>

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Captain profile retrieved successfully",
  "status": 200,
  "data": {
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      },
      "createdAt": "2023-10-10T10:00:00.000Z",
      "updatedAt": "2023-10-10T10:00:00.000Z"
    }
  }
}
```

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "success": 0,
  "message": "Invalid or expired token"
}
```

### 9. Logout Captain

**Endpoint:** `/captain/logout`

**Method:** `GET`

**Description:** This endpoint logs out the authenticated captain.

**Headers:**

- Authorization: Bearer <token>

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Captain logged out successfully",
  "status": 200
}
```

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "success": 0,
  "message": "Invalid or expired token"
}
```

### 10. Create Ride

**Endpoint:** `/ride/create`

**Method:** `POST`

**Description:** This endpoint creates a new ride.

**Request Body:**

```json
{
  "pickup": "123 Main St, City, Country",
  "destination": "456 Elm St, City, Country",
  "vehicleType": "car"
}
```

**Response:**

- **Status Code:** 201 Created
- **Response Body:**

```json
{
  "_id": "60d0fe4f5311236168a109cc",
  "user": "60d0fe4f5311236168a109ca",
  "pickup": "123 Main St, City, Country",
  "destination": "456 Elm St, City, Country",
  "otp": "123456",
  "fare": 100,
  "status": "pending",
  "createdAt": "2023-10-10T10:00:00.000Z",
  "updatedAt": "2023-10-10T10:00:00.000Z"
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid pickup address",
      "param": "pickup",
      "location": "body"
    },
    {
      "msg": "Invalid destination address",
      "param": "destination",
      "location": "body"
    },
    {
      "msg": "Invalid vehicle type",
      "param": "vehicleType",
      "location": "body"
    }
  ]
}
```

### 11. Get Fare

**Endpoint:** `/ride/get-fare`

**Method:** `GET`

**Description:** This endpoint retrieves the fare for a ride.

**Query Parameters:**

- `pickup`: The pickup address
- `destination`: The destination address

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "fare": {
    "auto": 50,
    "car": 100,
    "moto": 30
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid pickup address",
      "param": "pickup",
      "location": "query"
    },
    {
      "msg": "Invalid destination address",
      "param": "destination",
      "location": "query"
    }
  ]
}
```

### 12. Confirm Ride

**Endpoint:** `/ride/confirm`

**Method:** `POST`

**Description:** This endpoint confirms a ride.

**Request Body:**

```json
{
  "rideId": "60d0fe4f5311236168a109cc"
}
```

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Ride confirmed successfully",
  "status": 200,
  "data": {
    "_id": "60d0fe4f5311236168a109cc",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "fullname": "John Doe",
      "email": "user@example.com"
    },
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      }
    },
    "pickup": "123 Main St, City, Country",
    "destination": "456 Elm St, City, Country",
    "otp": "123456",
    "fare": 100,
    "status": "accepted",
    "createdAt": "2023-10-10T10:00:00.000Z",
    "updatedAt": "2023-10-10T10:00:00.000Z"
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid ride id",
      "param": "rideId",
      "location": "body"
    }
  ]
}
```

### 13. Start Ride

**Endpoint:** `/ride/pickup-ride`

**Method:** `GET`

**Description:** This endpoint starts a ride.

**Query Parameters:**

- `rideId`: The ride ID
- `otp`: The OTP for the ride

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Ride started successfully",
  "status": 200,
  "data": {
    "_id": "60d0fe4f5311236168a109cc",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "fullname": "John Doe",
      "email": "user@example.com"
    },
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      }
    },
    "pickup": "123 Main St, City, Country",
    "destination": "456 Elm St, City, Country",
    "otp": "123456",
    "fare": 100,
    "status": "ongoing",
    "createdAt": "2023-10-10T10:00:00.000Z",
    "updatedAt": "2023-10-10T10:00:00.000Z"
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid ride id",
      "param": "rideId",
      "location": "query"
    },
    {
      "msg": "Invalid OTP",
      "param": "otp",
      "location": "query"
    }
  ]
}
```

### 14. Complete Ride

**Endpoint:** `/ride/complete-ride`

**Method:** `GET`

**Description:** This endpoint completes a ride.

**Query Parameters:**

- `rideId`: The ride ID

**Response:**

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "success": 1,
  "message": "Ride completed successfully",
  "status": 200,
  "data": {
    "_id": "60d0fe4f5311236168a109cc",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "fullname": "John Doe",
      "email": "user@example.com"
    },
    "captain": {
      "_id": "60d0fe4f5311236168a109cb",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "captain@example.com",
      "vehicle": {
        "color": "red",
        "plate": "TX 01 ER 1234",
        "capacity": 4,
        "vehicleType": "car"
      }
    },
    "pickup": "123 Main St, City, Country",
    "destination": "456 Elm St, City, Country",
    "otp": "123456",
    "fare": 100,
    "status": "completed",
    "createdAt": "2023-10-10T10:00:00.000Z",
    "updatedAt": "2023-10-10T10:00:00.000Z"
  }
}
```

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Invalid ride id",
      "param": "rideId",
      "location": "query"
    }
  ]
}
```

## How to Use

### Register User:

Send a POST request to `/auth/register` with the required fields in the request body.

### User Check:

Send a GET request to `/auth/userChecking` with the Authorization header containing a valid JWT token.

### Login User:

Send a POST request to `/auth/login` with the required fields in the request body.

### Get User Profile:

Send a GET request to `/auth/profile` with the Authorization header containing a valid JWT token.

### Logout User:

Send a GET request to `/auth/logout` with the Authorization header containing a valid JWT token.

### Register Captain:

Send a POST request to `/captain/register` with the required fields in the request body.

### Login Captain:

Send a POST request to `/captain/login` with the required fields in the request body.

### Get Captain Profile:

Send a GET request to `/captain/profile` with the Authorization header containing a valid JWT token.

### Logout Captain:

Send a GET request to `/captain/logout` with the Authorization header containing a valid JWT token.

### Create Ride:

Send a POST request to `/ride/create` with the required fields in the request body.

### Get Fare:

Send a GET request to `/ride/get-fare` with the required query parameters.

### Confirm Ride:

Send a POST request to `/ride/confirm` with the required fields in the request body.

### Start Ride:

Send a GET request to `/ride/pickup-ride` with the required query parameters.

### Complete Ride:

Send a GET request to `/ride/complete-ride` with the required query parameters.

## Example Requests

### Register User

```sh
curl -X POST http://localhost:3030/auth/register \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "fullname": "John Doe",
        "password": "password123"
      }'
```

### User Check

```sh
curl -X GET http://localhost:3030/auth/userChecking \
  -H "Authorization: Bearer <token>"
```

### Login User

```sh
curl -X POST http://localhost:3030/auth/login \
  -H "Content-Type: application/json" \
  -d '{
        "email": "user@example.com",
        "password": "password123"
      }'
```

### Get User Profile

```sh
curl -X GET http://localhost:3030/auth/profile \
  -H "Authorization: Bearer <token>"
```

### Logout User

```sh
curl -X GET http://localhost:3030/auth/logout \
  -H "Authorization: Bearer <token>"
```

### Register Captain

```sh
curl -X POST http://localhost:3030/captain/register \
  -H "Content-Type: application/json" \
  -d '{
        "email": "captain@example.com",
        "fullname": {
          "firstname": "Jane",
          "lastname": "Doe"
        },
        "password": "password123",
        "vehicle": {
          "color": "red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }'
```

### Login Captain

```sh
curl -X POST http://localhost:3030/captain/login \
  -H "Content-Type: application/json" \
  -d '{
        "email": "captain@example.com",
        "password": "password123"
      }'
```

### Get Captain Profile

```sh
curl -X GET http://localhost:3030/captain/profile \
  -H "Authorization: Bearer <token>"
```

### Logout Captain

```sh
curl -X GET http://localhost:3030/captain/logout \
  -H "Authorization: Bearer <token>"
```

### Create Ride

```sh
curl -X POST http://localhost:3030/ride/create \
  -H "Content-Type: application/json" \
  -d '{
        "pickup": "123 Main St, City, Country",
        "destination": "456 Elm St, City, Country",
        "vehicleType": "car"
      }'
```

### Get Fare

```sh
curl -X GET http://localhost:3030/ride/get-fare \
  -G \
  --data-urlencode "pickup=123 Main St, City, Country" \
  --data-urlencode "destination=456 Elm St, City, Country"
```

### Confirm Ride

```sh
curl -X POST http://localhost:3030/ride/confirm \
  -H "Content-Type: application/json" \
  -d '{
        "rideId": "60d0fe4f5311236168a109cc"
      }'
```

### Start Ride

```sh
curl -X GET http://localhost:3030/ride/pickup-ride \
  -G \
  --data-urlencode "rideId=60d0fe4f5311236168a109cc" \
  --data-urlencode "otp=123456"
```

### Complete Ride

```sh
curl -X GET http://localhost:3030/ride/complete-ride \
  -G \
  --data-urlencode "rideId=60d0fe4f5311236168a109cc"
```
