const rawConfig = require('./tournament.json');

function validateTournamentConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Tournament configuration must be an object.');
  }
  if (!config.tournamentName || typeof config.tournamentName !== 'string') {
    throw new TypeError('tournamentName must be a non-empty string.');
  }
  if (![3, 4].includes(config.tableSize)) {
    throw new RangeError('tableSize must be 3 or 4.');
  }
  if (!Number.isInteger(config.preliminaryRounds) || config.preliminaryRounds < 1) {
    throw new RangeError('preliminaryRounds must be a positive integer.');
  }
  if (!Number.isInteger(config.finalistCut) || config.finalistCut < 1) {
    throw new RangeError('finalistCut must be a positive integer.');
  }

  return Object.freeze({ ...config });
}

module.exports = {
  tournamentConfig: validateTournamentConfig(rawConfig),
  validateTournamentConfig,
};
