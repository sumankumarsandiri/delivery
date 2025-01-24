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

Status Code: 200 OK
Response Body:

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

Status Code: 400 Bad Request
Response Body:

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

Status Code: 409 Conflict
Response Body:

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

Authorization: Bearer <token>

**Response:**

Status Code: 200 OK
Response Body:

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

Status Code: 401 Unauthorized
Response Body:

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

Status Code: 200 OK
Response Body:

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

Status Code: 400 Bad Request
Response Body:

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

Authorization: Bearer <token>

**Response:**

Status Code: 200 OK
Response Body:

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

Status Code: 401 Unauthorized
Response Body:

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

Authorization: Bearer <token>

**Response:**

Status Code: 200 OK
Response Body:

```json
{
  "message": "User logged out successfully"
}
```

Status Code: 401 Unauthorized
Response Body:

```json
{
  "success": 0,
  "message": "Invalid or expired token"
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
