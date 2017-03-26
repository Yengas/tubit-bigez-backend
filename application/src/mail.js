const nodemailer = require('nodemailer');

/**
 * Exports methods to seemlesly sends notifications via
 * @param config
 */
module.exports = function(config){
  // No way to send messages without a mail configuration.
  if(!config.creds.auth.user || !config.creds.auth.pass)
    return undefined;

  const transporter = nodemailer.createTransport(config.creds);

  return {
    /**
     * Sends the given body of text to the given mail addres with pre-defined settings.
     * @param text {String} the body of text to send to the user.
     * @param to {String} the mail address of the intended receipent.
     */
    single: function(text, to){
      const payload = config.createPayload(text, to)

      return new Promise((resolve, reject) => {
        transporter.sendMail(payload, (error, info) => {
          error ? reject(error) : resolve(info);
        });
      });
    }
  };
};