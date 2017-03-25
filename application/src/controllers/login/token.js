// Token generation and query
module.exports = (config) => {
  const { length } = config;

  /**
   * Generates token for the given user.
   * @param user
   */
  function generate(user){
    // TODO: take user and time into account for preventing clashes.
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Promise.resolve([...new Array(length)].map(() => alphabet[parseInt(Math.random() * alphabet.length)]).join(""));
  }

  // Find the user in the token store!
  function query(token){
    return Promise.resolve(undefined);
  }

  return {
    generate,
    query
  };
};
