module.exports = {
  name: process.env.NAME || 'bigez',
  port: process.env.PORT || '8080',
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:2000'
  },
  headers: {
    token: process.env.TOKEN_HEADER || 'x-bigez-token'
  },
  mail: {
    creds: { service: 'gmail', auth: { user: process.env.GMAIL_ADDRESS, pass: process.env.GMAIL_PASSWORD }},
    createPayload: (text, to) => {
      return {
        from: "yengas07@gmail.com",
        to,
        subject: "Birisi sizinle gezmek istiyor!",
        text, html: text
      };
    }
  },
  redis: {
    host: process.env.REDIS || 'cache',
    port: process.env.REDIS_PORT || 6379,
    auth: {
      key: process.env.AUTH_STORAGE_KEY || 'auth',
      secret: new Buffer(process.env.AUTH_TOKEN_SECRET, 'utf-8'),
      expire: 60 * 60 * 24
    }
  },
  mongo: {
    url: process.env.DATABASE_CONFIGURATION
  },
  social: {
    facebook: {
      id: process.env.FACEBOOK_APP_ID,
      secret: process.env.FACEBOOK_APP_SECRET,
      scope: 'email,public_profile',
      fields: 'name,last_name,first_name,email,picture'
    }
  }
};