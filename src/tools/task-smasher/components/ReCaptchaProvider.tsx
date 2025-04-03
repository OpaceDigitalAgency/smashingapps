import React, { ReactNode, useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// The actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = '6Lc_BQkrAAAAAFsiOOsjnnY5_S69i8zidb5oTRHw';

interface ReCaptchaProviderProps {
  children: ReactNode;
}

const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({ children }) => {
  // Add custom CSS to ensure the reCAPTCHA badge is always visible
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    
    // Add CSS to ensure the reCAPTCHA badge is visible
    style.textContent = `
      .grecaptcha-badge {
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 999999 !important;
        right: 0 !important;
        bottom: 0 !important;
        display: block !important;
        position: fixed !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
      }
      
      /* Add a custom indicator */
      .recaptcha-indicator {
        position: fixed;
        bottom: 60px;
        right: 0;
        background-color: rgba(0, 123, 255, 0.8);
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 4px 0 0 4px;
        z-index: 999998;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
      }
    `;
    
    // Append the style to the document head
    document.head.appendChild(style);
    
    // Create a custom indicator element
    const indicator = document.createElement('div');
    indicator.className = 'recaptcha-indicator';
    indicator.textContent = 'reCAPTCHA Active';
    document.body.appendChild(indicator);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator);
      }
    };
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      container={{
        parameters: {
          badge: 'bottomright',
          theme: 'light',
        }
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;