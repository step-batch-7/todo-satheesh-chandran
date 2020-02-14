const { env } = process;

module.exports = { DATA_STORE: `${__dirname}/${env.DATA_STORE}` };
