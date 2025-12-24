![alt text](src/assets/working_model.png)

# 🔐 Authentication System Documentation

This backend implements **production-grade authentication** using:

* JWT Access Tokens
* Refresh Tokens
* HTTP-only Cookies
* Server-side session control

---

## 🔑 Token Types

### 1. Access Token

* Short-lived (e.g., 15 minutes)
* Sent in `Authorization: Bearer <token>` header
* Used to access protected APIs
* Stateless (not stored in DB)

### 2. Refresh Token

* Long-lived (e.g., 7 days)
* Stored in **HTTP-only cookie**
* Also stored in database
* Used only to obtain new access tokens

---

## 🧠 Core Design Principle

> **Access tokens authorize requests.
> Refresh tokens control sessions.**

---

## 🔄 Authentication Flow

### 1️⃣ Signup / Login

1. User sends credentials
2. Backend verifies credentials
3. Backend generates:

   * Access Token (JWT)
   * Refresh Token (JWT)
4. Backend:

   * Sends access token in JSON response
   * Stores refresh token in DB
   * Sets refresh token in HTTP-only cookie

```text
Client ← accessToken (JSON)
Client ← refreshToken (HTTP-only cookie)
```

---

## 🔐 Accessing Protected Routes

1. Client sends request with:

   ```
   Authorization: Bearer <accessToken>
   ```
2. Backend:

   * Verifies access token
   * Allows or denies access

If access token is expired:

* Backend responds with `401 Unauthorized`

---

## ♻️ Token Refresh Flow

1. Client receives `401` due to expired access token
2. Client calls:

   ```
   POST /auth/refresh
   ```
3. Browser automatically sends refresh token cookie
4. Backend:

   * Verifies refresh token cryptographically
   * Verifies refresh token exists in DB
5. Backend issues a **new access token**

```text
Client ← new accessToken
```

> Refresh tokens are **never accessible to JavaScript**.

---

## 🚪 Logout Flow

1. Client calls:

   ```
   POST /auth/logout
   ```
2. Backend:

   * Deletes refresh token from DB
   * Clears refresh token cookie
3. Session is invalidated

### Important Note

* Existing access tokens may remain valid until expiry
* No new access tokens can be created
* User is effectively logged out

---

## 🔒 Why Refresh Tokens Are Stored in DB

JWTs cannot be revoked once issued.

Storing refresh tokens in the database enables:

* Logout
* Session revocation
* Forced sign-out
* Protection against stolen tokens

Rule enforced:

> **A refresh token is valid only if it exists in the database.**

---

## 🛡️ Security Properties

* Refresh tokens are never exposed to JavaScript
* XSS cannot steal refresh tokens
* CSRF protection via `SameSite` cookies
* Short-lived access tokens reduce attack window
* Server maintains session control

---

## 🧩 Auth Server vs Resource Server (Logical)

* `/auth/*` → Authentication responsibilities
* `/api/*` → Protected resources

Currently implemented in a **single backend**, but logically separated.

---

## ✅ Summary

* Stateless access tokens for performance
* Stateful refresh tokens for control
* HTTP-only cookies for security
* Database-backed session revocation
* Industry-standard authentication architecture

---

### 🔒 One-line takeaway

> **Logout kills the session, not the already-issued permission slip.**

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    A[Client Request] --> B[Express Server]
    B --> C[requestIdMiddleware]
    C --> D[express.json & cookieParser]
    D --> E[generalLimiter]
    E --> F[Routes /auth/*]
    
    F --> G{Auth Routes}
    G -->|POST /signup| H[authLimiter]
    G -->|POST /login| H
    G -->|POST /refresh| H
    G -->|GET /me| I[generalLimiter + authMiddleware]
    G -->|POST /logout| I
    G -->|DELETE /admin/users/:id| J[generalLimiter + authMiddleware + requireRole ADMIN]
    
    H --> K[validate Schema]
    K --> L[asyncHandler Controller]
    L --> M[Controller Logic]
    M --> N[Database MongoDB]
    M --> O[Token Utils]
    O --> P[JWT Sign/Verify]
    
    I --> Q[authMiddleware]
    Q --> R[Verify Access Token]
    R -->|Valid| L
    R -->|Invalid| S[401 Error]
    
    J --> Q
    Q --> T[requireRole]
    T -->|Has Role| L
    T -->|No Role| U[403 Error]
    
    M --> V[log Function]
    V --> W[Console JSON Log]
    
    L --> X[Response]
    X --> Y[errorHandler on Error]
    Y --> Z[Structured Error Log]
    
    N --> AA[Mongoose Models]
    AA --> AB[User Model]
```