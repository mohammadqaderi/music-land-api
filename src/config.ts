export const config = {
  db: {
    type: 'postgres',
    host: 'music-land.clwaq40esgxk.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'music-land',
    username: 'mohammad',
    password: '633802asdASD',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
  aws: {
    AWS_S3_BUCKET_NAME: 'music-land',
    ACCESS_KEY_ID: 'AKIAI74L3YS6JQG6LWBQ',
    SECRET_ACCESS_KEY: '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',
    cdnUrl: 'https://music-land.s3.us-east-2.amazonaws.com',
  },
  nodeMailerOptions: {
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        username: 'mqaderi44@gmail.com',
        pass: '12345678asd',
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
    publicKey: 'BE5Rjtto5sbMH7VUlQY7Wrpes3TEASURYHEYZf85NxSLKPDriaMvDxg6ru78gaDTmK0CtVvFynCGOA72AoKNMVA',
    privateKey: 'IxUoBD-fTmayfgonGvYaf_BQhIAux93gvFgc7RQVfy0'
  },

  oAuthGoogle: {
    GOOGLE_CLIENT_ID: '489272575762-vca6inkq37bqapfpsn4l3u3qpn8rbig4.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'iALijCcKEcXgSxfp_RchkQu7',
    CALL_BACK_URI: 'http://localhost:3000/auth/google/callback',
    SCOPE: ['email', 'profile'],
  },

  oAuthFacebook: {
    FACEBOOK_CLIENT_ID: '321927035491005',
    FACEBOOK_SECRET_ID: '4cee40e6f3f3d56840e8e8f6dc0367d0',
    CALL_BACK_URI: 'http://localhost:3000/auth/facebook/callback',
    SCOPE: ['email'],
  }

};
