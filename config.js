const { env } = process;

module.exports = {
  DATA_STORE: `${__dirname}/${env.DATA_STORE}`,
  CREDENTIALS_STORE: `${__dirname}/${env.CREDENTIALS_STORE}`
};
