import type { Lesson } from '@/types/lesson'

/** Phase be-auth — [roadmap.sh/backend](https://roadmap.sh/backend) authentication & authorization */
export const backendAuthLessons: Lesson[] = [
  {
    id: 'be-auth-fundamentals',
    moduleId: 'backend',
    phaseId: 'be-auth',
    phaseNumber: 2,
    order: 1,
    title: 'Authentication vs Authorization & Password Security',
    description:
      'Learn the difference between proving identity (authn) and granting access (authz), and how to store passwords safely with bcrypt — never plain text.',
    duration: '50 min',
    difficulty: 'beginner',
    objectives: [
      'Define authentication vs authorization with real API examples',
      'Hash passwords with bcrypt and explain salting',
      'Never leak credentials in logs or error messages',
      'Design a minimal register/login flow',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Two different problems

| Term | Question | Example |
|------|----------|---------|
| **Authentication** | Who are you? | Login with email + password |
| **Authorization** | What may you do? | Only admins may DELETE /users |

Authentication happens first. Authorization uses the authenticated identity (user id, roles) on every protected route.`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '401 vs 403',
        content:
          '**401 Unauthorized** — not authenticated (missing or invalid token/session). **403 Forbidden** — authenticated but not allowed (wrong role). Clients use this to decide: refresh token / login again (401) vs show “contact admin” (403).',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'auth/password.js',
        code: `import bcrypt from 'bcrypt'

const ROUNDS = 12

export async function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

// Store ONLY hash in database — never plain password`,
        explanation: 'bcrypt is slow on purpose — brute-force attacks cost more. Increase rounds as hardware improves.',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'routes/auth.js',
        code: `// POST /auth/register — simplified
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'email and password required' } })
  }
  const password_hash = await hashPassword(password)
  const user = await db.users.create({ email, password_hash, role: 'member' })
  return res.status(201).json({ data: { id: user.id, email: user.email } })
})`,
      },
      {
        type: 'exercise',
        title: 'Auth vocabulary',
        description:
          'In comments, give one example each: authentication step, authorization check, and a response that should be 401 vs 403.',
        language: 'javascript',
        starterCode: `// authentication:
// authorization:
// 401 example:
// 403 example:
`,
        solution: `// authentication: POST /login validates email+password
// authorization: middleware checks user.role === 'admin'
// 401: missing Authorization header on GET /me
// 403: member tries DELETE /admin/users`,
      },
    ],
  },
  {
    id: 'be-jwt-tokens',
    moduleId: 'backend',
    phaseId: 'be-auth',
    phaseNumber: 2,
    order: 2,
    title: 'JWT Access & Refresh Tokens',
    description:
      'Issue signed JSON Web Tokens, separate short-lived access tokens from refresh tokens, and protect routes with Bearer middleware.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Explain JWT header.payload.signature structure',
      'Sign and verify tokens with a server secret',
      'Use access (short) and refresh (long) token pattern',
      'Attach tokens via Authorization Bearer header',
    ],
    content: [
      {
        type: 'text',
        markdown: `## JWT in one picture

A JWT is three Base64URL parts separated by dots: \`header.payload.signature\`.

The server **signs** with a secret (HMAC) or private key (RSA). Clients send:

\`Authorization: Bearer <access_token>\`

Never put secrets in the JWT payload — it is only encoded, not encrypted.`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'auth/jwt.js',
        code: `import jwt from 'jsonwebtoken'

const ACCESS_TTL = '15m'
const REFRESH_TTL = '7d'
const SECRET = process.env.JWT_SECRET

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: ACCESS_TTL })
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, SECRET, { expiresIn: REFRESH_TTL })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'middleware/requireAuth.js',
        code: `export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } })
  }
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Token expired or invalid' } })
  }
}`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Why refresh tokens?',
        content:
          'Short access tokens limit damage if stolen. Refresh tokens (stored httpOnly cookie or secure storage) obtain new access tokens without re-entering password. Rotate refresh tokens on use in production.',
      },
      {
        type: 'exercise',
        title: 'Protect a route',
        description: 'Add `requireAuth` to GET `/me` that returns `{ data: { id: req.user.sub } }`.',
        language: 'javascript',
        starterCode: `// app.get('/me', requireAuth, (req, res) => { ... })`,
        solution: `app.get('/me', requireAuth, (req, res) => {
  res.json({ data: { id: req.user.sub, role: req.user.role } })
})`,
      },
    ],
  },
  {
    id: 'be-oauth-oidc',
    moduleId: 'backend',
    phaseId: 'be-auth',
    phaseNumber: 2,
    order: 3,
    title: 'OAuth 2.0 & OpenID Connect (Social Login)',
    description:
      'Understand authorization code flow, why you redirect to Google/GitHub, and how OIDC adds identity (id_token) on top of OAuth.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Walk through authorization code flow step by step',
      'Differentiate OAuth (delegation) from OIDC (identity)',
      'Configure redirect URIs safely',
      'Map external provider profile to local user record',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Authorization code flow (most common)

1. User clicks “Login with Google”
2. Browser redirects to Google with \`client_id\`, \`redirect_uri\`, \`scope\`, \`state\`
3. User approves; Google redirects back with \`?code=...\`
4. **Your server** exchanges \`code\` + \`client_secret\` for tokens (never in browser)
5. You create session/JWT for your app user

\`state\` prevents CSRF — verify it matches what you stored in session.`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Never expose client_secret in frontend',
        content: 'SPAs use PKCE variant without secret. Server-side apps keep the secret in environment variables only.',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'auth/oauth-callback.js',
        code: `// GET /auth/google/callback?code=...&state=...
app.get('/auth/google/callback', async (req, res) => {
  const { code, state } = req.query
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state')
  }
  const tokens = await exchangeCodeForTokens(code)
  const profile = await fetchGoogleProfile(tokens.access_token)
  const user = await findOrCreateUserFromOAuth('google', profile)
  const access = signAccessToken(user)
  res.redirect(\`/app?token=\${access}\`) // or set httpOnly cookie
})`,
      },
      {
        type: 'exercise',
        title: 'OAuth steps ordering',
        description: 'Number these steps 1–5 in comments: exchange code, user approves at provider, redirect with code, issue app JWT, redirect to provider.',
        language: 'javascript',
        starterCode: `// a) redirect to provider
// b) exchange code server-side
// c) provider shows consent
// d) create local session/JWT
// e) callback with ?code=
`,
        solution: `// 1 a, 2 c, 3 e, 4 b, 5 d`,
      },
    ],
  },
  {
    id: 'be-rbac-middleware',
    moduleId: 'backend',
    phaseId: 'be-auth',
    phaseNumber: 2,
    order: 4,
    title: 'RBAC, Permissions & Auth Middleware',
    description:
      'Model roles (admin, member), compose middleware chains, and enforce least-privilege access on every route.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Design role-based access control (RBAC) tables or claims',
      'Write requireRole and requirePermission middleware',
      'Compose middleware order correctly in Express/Fastify',
      'Audit routes for missing auth checks',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'middleware/rbac.js',
        code: `export function requireRole(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient role' },
      })
    }
    next()
  }
}

// Usage:
// app.delete('/users/:id', requireAuth, requireRole('admin'), deleteUser)`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'RBAC vs ABAC',
        content:
          '**RBAC** — access by role (`admin`, `editor`). **ABAC** — access by attributes (owner_id === user.id). Start with RBAC; add resource-level checks (`canEditPost(user, post)`) where roles are too coarse.',
      },
      {
        type: 'exercise',
        title: 'Route matrix',
        description:
          'In comments, assign middleware for: GET /public/posts (none), POST /posts (auth), DELETE /posts/:id (auth + admin).',
        language: 'javascript',
        starterCode: `// GET /public/posts:
// POST /posts:
// DELETE /posts/:id:
`,
        solution: `// GET: no auth
// POST: requireAuth
// DELETE: requireAuth, requireRole('admin')`,
      },
    ],
  },
  {
    id: 'be-session-security',
    moduleId: 'backend',
    phaseId: 'be-auth',
    phaseNumber: 2,
    order: 5,
    title: 'Sessions, Cookies, CSRF & Rate Limiting',
    description:
      'Secure session cookies (httpOnly, Secure, SameSite), understand CSRF for cookie-based auth, and add rate limits on auth endpoints.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Configure secure session cookies',
      'Explain CSRF and mitigations (SameSite, CSRF token)',
      'Rate-limit /login and /register against brute force',
      'Choose cookie sessions vs JWT for your product',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'session-config.js',
        code: `import session from 'express-session'

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}))`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Cookie vs JWT trade-off',
        content:
          '**Cookie sessions** — server stores session; easy revoke; needs CSRF care. **JWT in header** — stateless; harder to revoke instantly; great for mobile/SPA APIs. Many products use both: httpOnly refresh cookie + short access JWT.',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'rate-limit-auth.js',
        code: `import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts' } },
})

app.use('/auth/login', authLimiter)
app.use('/auth/register', authLimiter)`,
      },
      {
        type: 'exercise',
        title: 'Secure cookie checklist',
        description: 'List four cookie/session flags or practices from this lesson and what each prevents.',
        language: 'javascript',
        starterCode: `// 1.
// 2.
// 3.
// 4.
`,
        solution: `// 1. httpOnly — blocks JS theft via XSS
// 2. Secure — HTTPS only in production
// 3. sameSite=lax/strict — reduces CSRF
// 4. rate limit on login — slows brute force`,
      },
    ],
  },
]
