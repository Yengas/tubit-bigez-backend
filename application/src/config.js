module.exports = {
  name: process.env.NAME || 'bigez',
  port: process.env.PORT || '8080',
  frontend: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:2000'
  },
  social: {
    facebook: {
      id: process.env.FACEBOOK_APP_ID,
      secret: process.env.FACEBOOK_APP_SECRET,
      scope: 'email,public_profile',
      fields: 'name,last_name,first_name,email,picture'
    }
  },
  token: {
    length: parseInt(process.env.TOKEN_LENGTH) || 12
  }
};