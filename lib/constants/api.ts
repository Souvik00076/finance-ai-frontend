const getApiBaseUrl = (): string => {
  // NEXT_PUBLIC_APP_ENV is set during Docker build (dev/production)
  // Falls back to NODE_ENV for local development
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;

  if (env === 'production') {
    return 'http://api.beatus.co.in/api/v1';
  } else if (env === 'development') {
    return 'http://dev-api.beatus.co.in/api/v1';
  } else {
    return 'http://localhost:8000/api/v1';
  }
};

export const getAuthRedirectUrlAfterSignup = (): string => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;

  if (env === 'production') {
    return 'http://app.beatus.co.in/verify';
  } else if (env === 'development') {
    return 'http://dev.beatus.co.in/verify';
  } else {
    return 'http://localhost:3000/verify';
  }
};

export const API_BASE_URL = getApiBaseUrl();
