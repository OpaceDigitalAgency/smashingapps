import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getReCaptchaToken = useCallback(async (action: string = 'api_call') => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not yet available');
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return null;
    }
  }, [executeRecaptcha]);

  return { getReCaptchaToken };
};

export default useReCaptcha;