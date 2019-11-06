import env from './.env.json';

export const MAPS_API_KEY = env.MAPS_API_KEY;
export const SERVER_ADDR = env.API_SERVER_ADDR;

// hardcoded user ID; replace later
// export const UID = '5d979e6c5a0de701d708959e';
export const UID = '5db34c8a72ddbf4cb0b31a93';

// hardcoded values for Atlanta; replace later
export const INIT_LOCATION = {
  latitude: 33.749,
  longitude: -84.38798
};

export const PLACE_ID = 'ChIJjQmTaV0E9YgRC2MLmS_e_mY';
export const NAME = 'Atlanta';
export const PHOTO_REFERENCE = 'CmRaAAAAAVviIuc41ZmCjyzYAJibjYiPifxWGaLU-8iNHOF8wUcdOa-TF55F0BxshomvVU-2jk0EOQqJPdbvIFoUPuckVvJIQlpJp4clRM7mbzO7J8BngxE6eJmb2V_UUmQB5YhtEhDDgv53QSflPG5pwDz1zuYiGhRtmMNGRb9ft_1n0YyY_MFmiO9hcA';

export const FIREBASE_CONFIG = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DB_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: '',
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID
};
