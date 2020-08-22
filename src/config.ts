export const config = {
  db: {
    type: 'postgres',
    host: 'host',
    port: 5432,
    database: 'database',
    username: 'username',
    password: 'password',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
  aws: {
    AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
    ACCESS_KEY_ID: 'ACCESS_KEY_ID',
    SECRET_ACCESS_KEY: 'SECRET_ACCESS_KEY',
    cdnUrl: 'cdnUrl',
  },
  nodeMailerOptions: {
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        username: 'username',
        pass: 'pass',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
  frontEndKeys: {
    url: 'localhost',
    port: 4200,
    endpoints: ['auth/reset-password', 'auth/verify-email'],
  },


  vapidKeys: {
    publicKey: 'publicKey',
    privateKey: 'privateKey'
  },

  oAuthGoogle: {
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
    CALL_BACK_URI: 'CALL_BACK_URI',
    SCOPE: ['email', 'profile'],
  },

  oAuthFacebook: {
    FACEBOOK_CLIENT_ID: 'FACEBOOK_CLIENT_ID',
    FACEBOOK_SECRET_ID: 'FACEBOOK_SECRET_ID',
    CALL_BACK_URI: 'CALL_BACK_URI',
    SCOPE: ['email'],
  }

};
