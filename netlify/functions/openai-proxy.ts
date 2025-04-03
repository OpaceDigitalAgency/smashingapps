import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import OpenAI from "openai";
import axios from "axios";
import * as crypto from "crypto";

// reCAPTCHA configuration
const RECAPTCHA_SECRET_KEY = "6Lc_BQkrAAAAAC2zzS3znw-ahAhHQ57Sqhwxcui2";
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_SCORE_THRESHOLD = 0.5; // Minimum score to consider human (0.0 to 1.0)

// Rate limit configuration
const RATE_LIMIT = 20; // 20 requests per IP per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to verify reCAPTCHA token
async function verifyReCaptchaToken(token: string): Promise<{ success: boolean; score?: number }> {
  try {
    const params = new URLSearchParams();
    params.append('secret', RECAPTCHA_SECRET_KEY);
    params.append('response', token);
    
    const response = await axios.post(RECAPTCHA_VERIFY_URL, params);
    const data = response.data;
    
    console.log('reCAPTCHA verification response:', data);
    
    if (data.success) {
      return {
        success: true,
        score: data.score
      };
    } else {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { success: false };
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return { success: false };
  }
}

// Function to generate a fingerprint from IP and User-Agent
function generateFingerprint(ip: string, userAgent: string): string {
  const data = `${ip}:${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Define the handler function
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Get client IP
  const clientIP = event.headers["client-ip"] ||
                  event.headers["x-forwarded-for"] ||
                  "unknown-ip";
  
  // Get User-Agent
  const userAgent = event.headers["user-agent"] || "unknown-user-agent";
  
  // Generate fingerprint from IP and User-Agent
  const fingerprint = generateFingerprint(clientIP, userAgent);
  console.log(`Generated fingerprint for IP ${clientIP}: ${fingerprint.substring(0, 8)}...`);
  
  // Check for reCAPTCHA token - headers in Netlify Functions are lowercase
  const recaptchaToken = event.headers["x-recaptcha-token"];
  console.log(`reCAPTCHA token present: ${recaptchaToken ? 'Yes' : 'No'}`);
  if (recaptchaToken) {
    console.log(`Token starts with: ${recaptchaToken.substring(0, 10)}...`);
  }
  
  // Check if it's local development
  const isLocalDev = clientIP === "::1" || clientIP === "127.0.0.1" || clientIP.startsWith("192.168.");
  if (isLocalDev) {
    console.log("Local development detected, tracking rate limit but always allowing requests");
  }
  
  // For rate limit status endpoint
  if (event.httpMethod === "GET" && event.path.endsWith("/rate-limit-status")) {
    console.log("Rate limit status request received");
    
    // Return a simple response with default values
    // The actual tracking will be done on the client side
    const headers = {
      "Content-Type": "application/json",
      "X-RateLimit-Limit": String(RATE_LIMIT),
      "X-RateLimit-Remaining": String(RATE_LIMIT - 1),
      "X-RateLimit-Reset": new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      "X-RateLimit-Used": "1"
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        limit: RATE_LIMIT,
        remaining: RATE_LIMIT - 1,
        reset: new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
        used: 1
      })
    };
  }
  
  // Validate request method for other endpoints
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  
  try {
    // Check for reCAPTCHA token - headers in Netlify Functions are lowercase
    const recaptchaToken = event.headers["x-recaptcha-token"];
    let recaptchaVerified = false;
    
    console.log(`POST request reCAPTCHA token present: ${recaptchaToken ? 'Yes' : 'No'}`);
    if (recaptchaToken) {
      console.log(`POST request token starts with: ${recaptchaToken.substring(0, 10)}...`);
    }
    
    if (recaptchaToken && !isLocalDev) {
      // Verify reCAPTCHA token
      const verification = await verifyReCaptchaToken(recaptchaToken);
      
      if (verification.success && verification.score !== undefined) {
        if (verification.score >= RECAPTCHA_SCORE_THRESHOLD) {
          console.log(`reCAPTCHA verification successful with score: ${verification.score}`);
          recaptchaVerified = true;
        } else {
          console.warn(`reCAPTCHA score too low: ${verification.score}`);
          // For now, we'll still allow the request but with a warning
        }
      } else {
        console.warn('reCAPTCHA verification failed');
        // For now, we'll still allow the request but with a warning
      }
    } else if (!isLocalDev) {
      console.warn('No reCAPTCHA token provided');
      // For now, we'll still allow the request but with a warning
    }
    
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "API key not configured" })
      };
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body || "{}");
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });
    
    // Forward the request to OpenAI
    if (!requestBody.model || !requestBody.messages) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid request. 'model' and 'messages' are required." })
      };
    }
    
    const response = await openai.chat.completions.create({
      model: requestBody.model,
      messages: requestBody.messages,
      ...requestBody // Include any other parameters passed in the request
    });
    
    // Get the API call count from the request headers or use a default value
    const apiCallCount = parseInt(event.headers["x-api-call-count"] || "0", 10) + 1;
    
    // Return the response with rate limit headers
    const responseHeaders = {
      "Content-Type": "application/json",
      "X-RateLimit-Limit": String(RATE_LIMIT),
      "X-RateLimit-Remaining": String(RATE_LIMIT - apiCallCount),
      "X-RateLimit-Reset": new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      "X-RateLimit-Used": String(apiCallCount),
      "X-Fingerprint": fingerprint.substring(0, 8) // Just for debugging
    };
    
    // Add reCAPTCHA verification status to headers
    if (!isLocalDev) {
      responseHeaders["X-ReCaptcha-Verified"] = recaptchaVerified ? "true" : "false";
    }
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("Error proxying request to OpenAI:", error);
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      })
    };
  }
};