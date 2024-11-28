const ENV = process.env.REACT_APP_ENV || 'dev';

const config = {
    dev: {
      BASE_URL: 'http://localhost:3000', // Development backend URL
    },
    prod: {
      BASE_URL: 'https://qrbgumsmdq.us-east-1.awsapprunner.com', // Production backend URL
    },
  };
  
  const BASE_URL = config[ENV]?.BASE_URL || config.dev.BASE_URL; // Fallback to dev if ENV is invalid
  
  export default BASE_URL;