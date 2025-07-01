# Authentication System Overview

## System Capabilities

Your authentication system is a comprehensive, modern authentication solution with the following capabilities:

### 🔐 Authentication Methods
1. **Magic Link Authentication** - Passwordless email-based login
2. **Password Authentication** - Traditional username/password login
3. **Passkey Authentication** - WebAuthn-based biometric/hardware key authentication
4. **Step-up Re-authentication** - Additional verification for sensitive actions

### 🛡️ Security Features
- **Session Management** - Secure, token-based sessions with automatic renewal
- **Multi-device Support** - Track and manage sessions across devices
- **Auth Attempts Tracking** - Temporary storage for authentication flows
- **Step-up Authentication** - Require recent authentication for sensitive operations
- **Automatic Session Cleanup** - Remove expired sessions and auth attempts

## Technical Architecture

### Core Structure

```
src/lib/server/auth/           # Main auth logic
├── index.ts                   # Main exports and Auth object
├── handler.ts                 # SvelteKit request handler
├── session.ts                 # Session management
├── auth-attempt.ts            # Authentication flow tracking
├── verify-login.ts            # Login verification logic
├── protect.ts                 # Authorization/protection middleware
├── users.ts                   # User management
├── password.ts                # Password hashing/verification
├── key.ts                     # Passkey management
├── magiclink.ts              # Email magic link sending
├── cookie.ts                 # Cookie utilities
└── utils.ts                  # Utility functions

src/routes/(auth)/            # User-facing auth routes
├── login/                    # Login page
└── auth/                     # API endpoints
    ├── logout/
    ├── magiclink/
    ├── passkey-authenticate/
    └── passkey-register/
```

### Database Schema

**Users Table (`user`)**
- `id` - Primary key
- `name` - Display name
- `identifier` - Email address (unique, case-insensitive)
- `lastSeenAt` - Last activity timestamp
- `createdAt` - Account creation timestamp

**Sessions Table (`user_session`)**
- `id` - Session token hash (primary key)
- `userId` - Link to user (nullable for unauthenticated sessions)
- `ipAddress` - Client IP
- `userAgent` - Client browser info
- `createdAt` - Session start time
- `lastSeenAt` - Last request time
- `lastAuthAt` - Last authentication time (for step-up auth)
- `expiresAt` - Session expiration
- `invalidatedAt` - Manual invalidation timestamp

**Keys Table (`user_key`)**
- `id` - Key identifier (passkey credential ID)
- `userId` - Owner user
- `type` - Key type ('passkey', 'password')
- `name` - User-defined name
- `credential` - Encrypted credential data
- `createdAt` - Registration timestamp

**Auth Attempts Table (`auth_attempt`)**
- `id` - Attempt identifier
- `identifier` - Email being authenticated
- `sessionId` - Associated session
- `type` - Attempt type ('email', 'code', 'passkey_register', 'passkey_login')
- `credential` - Hashed token/challenge
- `expiresAt` - Attempt expiration

## Authentication Flows

### 1. Magic Link Flow
```
1. User enters email → `/auth/magiclink/send`
2. System creates auth attempt with token
3. Email sent with magic link containing token
4. User clicks link → Login page processes token
5. If same session: Direct authentication
6. If different session: Shows 6-digit code for cross-device auth
7. Session authenticated on successful verification
```

**Key Files:**
- `src/lib/server/auth/magiclink.ts` - Email sending
- `src/routes/(auth)/auth/magiclink/send/+server.ts` - API endpoint
- `src/lib/server/auth/verify-login.ts` - Token verification

### 2. Password Flow
```
1. User enters email/password → Login form
2. System verifies password hash
3. Immediate session authentication on success
```

**Key Files:**
- `src/lib/server/auth/password.ts` - Password hashing/verification
- `src/lib/server/auth/verify-login.ts` - Login verification
- `src/routes/(auth)/login/+page.server.ts` - Form handling

### 3. Passkey Flow
```
Registration:
1. Get registration options → `/auth/passkey-register/options`
2. Browser WebAuthn API creates credential
3. Verify registration → `/auth/passkey-register/verify`

Authentication:
1. Get authentication options → `/auth/passkey-authenticate/options`
2. Browser WebAuthn API signs challenge
3. Verify signature → `/auth/passkey-authenticate/verify`
4. Session authenticated on success
```

**Key Files:**
- `src/lib/server/auth/key.ts` - Passkey storage/retrieval
- `src/routes/(auth)/auth/passkey-*` - WebAuthn endpoints

## Session Management

### Session Types
1. **Unauthenticated Sessions** - Created for all visitors, 7-day expiry
2. **Authenticated Sessions** - Attached to users, 30-day expiry with renewal

### Session Lifecycle
- **Creation**: Automatic on first visit or manual creation
- **Authentication**: Associates user with existing session
- **Renewal**: Automatic when >20 days until expiry
- **Invalidation**: Manual logout or security breach
- **Cleanup**: Automatic removal of expired sessions

### Security Features
- **Token Hashing**: Session tokens are hashed before storage
- **IP/User Agent Tracking**: Monitor session usage patterns
- **Automatic Renewal**: Extend active sessions
- **Step-up Authentication**: Require recent auth for sensitive actions

## Authorization & Protection

### Protection Levels

**`requireSession()`**
- Ensures any session exists (creates unauthenticated if needed)
- Used for: Any page that needs to track state

**`requireAuthenticatedUser()`**
- Ensures user is logged in
- Redirects to login if not authenticated
- Used for: Protected pages/features

**`requireRecentAuth()`**
- Ensures authentication within last 15 minutes
- Forces step-up re-authentication if needed
- Used for: Sensitive operations (account changes, payments)

### Implementation
```typescript
// In your route/page files:
import Auth from '$lib/server/auth'

// Require any session
const session = await Auth.protect.requireSession(event)

// Require authenticated user
const user = await Auth.protect.requireAuthenticatedUser(event)

// Require recent authentication
await Auth.protect.requireRecentAuth(event)
```

## Request Pipeline Integration

The auth system integrates with SvelteKit's request pipeline via the `authHandler`:

**File:** `src/hooks/hooks.server.ts`
```typescript
export const handle: Handle = sequence(authHandler)
```

**Process:**
1. Extract session token from cookies
2. Validate token and load user/session
3. Attach to `event.locals.user` and `event.locals.session`
4. Renew session cookie if needed
5. Continue to route handler

## API Surface

The main `Auth` object (from `src/lib/server/auth/index.ts`) provides:

### User Management
- `getUserByIdentifier(email)` - Find user by email
- `getUserKeysAvailable(userId)` - Get available auth methods
- `requestUpdateUserIdentifier()` - Start email change process

### Session Management
- `createUnauthenticatedSession(event)` - Create new session
- `createAuthenticatedSession(event, userId)` - Create logged-in session
- `authenticateSession({event, user})` - Authenticate existing session
- `validateSessionToken(token)` - Validate and renew session
- `invalidateSession(sessionId)` - Log out specific session

### Authentication
- `verify.withEmail({token, sessionId})` - Verify magic link
- `verify.withPassword({identifier, password})` - Verify password
- `verify.withCode({identifier, sessionId, code})` - Verify 6-digit code

### Utilities
- `generateToken()` - Create secure random tokens
- `generateShortCode()` - Create 6-digit codes
- Cookie management functions
- Protection middleware

## Key Security Features

1. **Token Hashing**: All tokens stored as hashes
2. **Salt + Hash Passwords**: Proper password security
3. **Time-limited Attempts**: Auth attempts expire quickly
4. **Cross-device Security**: Codes for device switching
5. **Session Tracking**: IP and user agent monitoring
6. **Automatic Cleanup**: Remove expired data
7. **Step-up Auth**: Fresh authentication for sensitive actions

## File Organization Summary

- **Core Logic**: `src/lib/server/auth/` - All authentication business logic
- **API Routes**: `src/routes/(auth)/auth/` - REST endpoints for auth flows
- **UI**: `src/routes/(auth)/login/` - User-facing login interface
- **Integration**: `src/hooks/hooks.server.ts` - SvelteKit integration
- **Schema**: `src/lib/server/db/schema/auth.ts` - Database structure

This system provides a complete, production-ready authentication solution with modern security practices and multiple authentication methods.