const { env } = process;

module.exports = {
  DATA_STORE: `${__dirname}/${env.DATA_STORE}`,
  SESSION_STORE: `${__dirname}/${env.SESSION_STORE}`
};
