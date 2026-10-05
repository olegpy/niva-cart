/**
 * DB-backed tests run only when TEST_DATABASE_URL points at a migrated, disposable
 * database. They are skipped otherwise so they can never write to the dev or prod DB.
 */
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

export const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;
