import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'us-east-1_2KzMVrl0I',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || 'hd18nu5nf78724dc3lq8av23s',
      mandatorySignIn: true,
      authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
  },
};

// Configure Amplify on import
Amplify.configure(amplifyConfig, { ssr: false });
// console.log('Amplify configured with:', amplifyConfig);

export default amplifyConfig;