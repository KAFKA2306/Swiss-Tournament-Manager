const assert = require('node:assert/strict');
const test = require('node:test');
const { tournamentConfig, validateTournamentConfig } = require('./tournament');

test('loads the JoinWars default configuration', () => {
  assert.deepEqual(tournamentConfig, {
    tournamentName: 'JoinWars at VRChat',
    tableSize: 4,
    preliminaryRounds: 4,
    finalistCut: 22,
  });
});

test('accepts three-player tables without code changes', () => {
  const config = validateTournamentConfig({
    tournamentName: 'Demo tournament',
    tableSize: 3,
    preliminaryRounds: 3,
    finalistCut: 12,
  });

  assert.equal(config.tableSize, 3);
  assert.equal(config.preliminaryRounds, 3);
  assert.equal(config.finalistCut, 12);
});

test('rejects unsupported table sizes', () => {
  assert.throws(
    () =>
      validateTournamentConfig({
        tournamentName: 'Invalid tournament',
        tableSize: 5,
        preliminaryRounds: 3,
        finalistCut: 12,
      }),
    /tableSize must be 3 or 4/,
  );
});
