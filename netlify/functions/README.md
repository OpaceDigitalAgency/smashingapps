# Netlify Functions

This directory contains serverless functions that are deployed to Netlify.

## OpenAI Proxy

The `openai-proxy.ts` function serves as a secure proxy for OpenAI API requests. It:

1. Protects your OpenAI API key by keeping it server-side
2. Implements rate limiting to control API usage
3. Verifies reCAPTCHA tokens to prevent abuse
4. Provides consistent headers for tracking API usage

### Environment Variables

Make sure to set the following environment variable in your Netlify dashboard:

- `OPENAI_API_KEY`: Your OpenAI API key

### Usage

The function is accessible at `/.netlify/functions/openai-proxy` or via the redirect at `/api/openai-proxy`.

#### Rate Limit Status

You can check the current rate limit status by sending a GET request to:

```
/api/openai-proxy/rate-limit-status
```

This will return the current rate limit information.

#### Making API Requests

Send a POST request to `/api/openai-proxy` with the same body format you would use for the OpenAI API.

Example:

```javascript
const response = await fetch('/api/openai-proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-ReCaptcha-Token': recaptchaToken // Optional but recommended
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});