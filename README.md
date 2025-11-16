# API Proxy Service

**English** | [中文](README.ZH.md)

A simple API proxy service built with Nitro framework. It forwards HTTP requests to configured target APIs based on request paths.

## 🚀 Quick Start

### Deploy to Vercel

> Note: Please be aware of Vercel's free plan usage limits. Public deployment is not recommended to prevent abuse.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OrzMiku/api-proxy)

### Deploy to Cloudflare

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OrzMiku/api-proxy)

## 📝 What This Project Does

This is a simple reverse proxy that:

- Takes HTTP requests on specific paths (e.g., `/openai/**`)
- Forwards them to configured target servers (e.g., `https://api.openai.com`)
- Returns the response back to the client
- Removes client IP headers for basic privacy

It's useful for:

- Bypassing CORS restrictions in web applications
- Hiding API endpoints behind a single domain
- Adding a simple layer between clients and APIs

## 🌟 Features

- **Request Forwarding**: Forwards HTTP requests including headers, body, and query parameters
- **Privacy Protection**: Removes client IP headers (`x-forwarded-for`, `x-real-ip`) from forwarded requests
- **Environment Configuration**: Configure proxy targets via environment variables
- **Optional Dashboard**: Simple web interface to view configured endpoints
- **Password Protection**: Secure your dashboard with optional password authentication
- **Lightweight**: Minimal dependencies, built with Nitro framework

## ⚙️ Configuration

### Environment Variables

Configure proxy targets using the pattern `PROXY_{NAME}_TARGET`:

```env
# Basic proxy configurations
PROXY_GEMINI_TARGET=https://generativelanguage.googleapis.com
PROXY_OPENAI_TARGET=https://api.openai.com
PROXY_ANTHROPIC_TARGET=https://api.anthropic.com

# Optional: Enable homepage dashboard
HOMEPAGE_ENABLE=true

# Optional: Protect dashboard with password
HOMEPAGE_PASSWORD=your-secure-password
```

### Proxy Configuration Table

| Endpoint Path   | Target URL                                  | Environment Variable                                            | Description       |
| --------------- | ------------------------------------------- | --------------------------------------------------------------- | ----------------- |
| `/gemini/**`    | `https://generativelanguage.googleapis.com` | `PROXY_GEMINI_TARGET=https://generativelanguage.googleapis.com` | Google Gemini API |
| `/openai/**`    | `https://api.openai.com`                    | `PROXY_OPENAI_TARGET=https://api.openai.com`                    | OpenAI API        |
| `/anthropic/**` | `https://api.anthropic.com`                 | `PROXY_ANTHROPIC_TARGET=https://api.anthropic.com`              | Anthropic API     |

### Adding New Proxies

To add a new proxy endpoint, simply add an environment variable following the naming pattern:

```env
# Forward /myapi/** requests to https://api.example.com
PROXY_MYAPI_TARGET=https://api.example.com

# Forward /v1/chat/** requests to https://chat.example.com
PROXY_V1_CHAT_TARGET=https://chat.example.com
```

The service will automatically:

- Convert `PROXY_MYAPI_TARGET` to route `/myapi/**`
- Convert `PROXY_V1_CHAT_TARGET` to route `/v1/chat/**`

## 📊 Dashboard

When `HOMEPAGE_ENABLE=true`, accessing the root URL shows:

- List of configured proxy endpoints
- Target URLs for each endpoint
- Copy buttons for quick URL copying

### Password Protection

To secure your dashboard, set the `HOMEPAGE_PASSWORD` environment variable:

```env
HOMEPAGE_ENABLE=true
HOMEPAGE_PASSWORD=your-secure-password
```

When password protection is enabled:

- Users must log in with the password to view the dashboard
- Authentication persists for 7 days via secure cookies
- A logout button appears in the dashboard for authenticated users
- Changing the password invalidates all existing sessions

> **Note**: Password protection only applies to the dashboard homepage. API proxy endpoints remain publicly accessible and are not protected by this password.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
