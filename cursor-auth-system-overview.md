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
