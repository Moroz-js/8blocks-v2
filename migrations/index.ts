import * as migration_20260323_084226_initial from './20260323_084226_initial';

export const migrations = [
  {
    up: migration_20260323_084226_initial.up,
    down: migration_20260323_084226_initial.down,
    name: '20260323_084226_initial'
  },
];
