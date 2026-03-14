const getApiBaseUrl = (): string => {
  // NEXT_PUBLIC_APP_ENV is set during Docker build (dev/production)
  // Falls back to NODE_ENV for local development
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;

  if (env === 'production') {
    return 'https://spendly-api.souvikb.in/api/v1';
  } else if (env === 'development') {
    return 'http://spendly-api.souvikb.in/api/v1';
  } else {
    return 'http://localhost:8002/api/v1';
  }
};

export const getAuthRedirectUrlAfterSignup = (): string => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;

  if (env === 'production') {
    return 'https://spendly.souvikb.in/verify';
  } else if (env === 'development') {
    return 'http://spendly.souvikb.in/verify';
  } else {
    return 'http://localhost:3000/verify';
  }
};

export const API_BASE_URL = getApiBaseUrl();
