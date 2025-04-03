import React, { useState } from 'react';
import OpenAIService from '../utils/openaiService';

const OpenAIExample: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{
    limit: number;
    remaining: number;
    reset: Date;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get completion from OpenAI through our proxy
      const { data, rateLimit } = await OpenAIService.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      
      setResponse(data.choices[0]?.message.content || 'No response');
      setRateLimit(rateLimit);
    } catch (err) {
      if (err instanceof Error && err.message.includes('Rate limit exceeded')) {
        setError(`Rate limit exceeded. The API is limited to 5 requests per day. Please try again later.`);
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  const checkRateLimit = async () => {
    try {
      setLoading(true);
      const rateLimitInfo = await OpenAIService.getRateLimitStatus();
      setRateLimit(rateLimitInfo);
      
      // Show a warning if rate limit is low
      if (rateLimitInfo.remaining === 0) {
        setError(`Rate limit reached. You've used all 5 requests for today. Limit resets at ${rateLimitInfo.reset.toLocaleTimeString()}.`);
      } else if (rateLimitInfo.remaining <= 2) {
        setError(`Warning: Only ${rateLimitInfo.remaining} requests remaining for today. Use them wisely!`);
      } else {
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Rate limit exceeded')) {
        setError(`Rate limit exceeded. The API is limited to 5 requests per day. Please try again later.`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to check rate limit');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">OpenAI API Example</h2>
      
      {/* Rate limit information */}
      {rateLimit && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">Rate Limit Status:</h3>
          <p>Limit: {rateLimit.limit} requests per day</p>
          <p>Remaining: {rateLimit.remaining} requests</p>
          <p>Resets: {rateLimit.reset.toLocaleString()}</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2 font-medium">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type your prompt here..."
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send to OpenAI'}
          </button>
          
          <button
            type="button"
            onClick={checkRateLimit}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Check Rate Limit
          </button>
        </div>
      </form>
      
      {/* Response */}
      {response && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Response:</h3>
          <div className="p-3 bg-gray-100 rounded whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAIExample;