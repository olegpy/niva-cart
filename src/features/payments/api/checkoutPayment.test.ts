/**
 * @jest-environment node
 */
const mockRetrieve = jest.fn();
jest.mock('@/features/payments/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        retrieve: (...args: unknown[]) => mockRetrieve(...args),
      },
    },
  }),
}));

import { getCheckoutPaymentStatus } from './checkoutPayment';

const SESSION_ID = 'cs_test_xyz';
const OWNER_ID = 'owner_user_1';
const OTHER_ID = 'attacker_user_1';

describe('getCheckoutPaymentStatus', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    mockRetrieve.mockReset();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('returns "paid" when the owner matches and payment_status is paid', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: { userId: OWNER_ID },
      payment_status: 'paid',
    });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'paid',
    );
  });

  it('returns "unpaid" for a complete-but-not-yet-paid session owned by the caller', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: { userId: OWNER_ID },
      payment_status: 'unpaid',
    });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'unpaid',
    );
  });

  it('treats "no_payment_required" as paid (not unpaid)', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: { userId: OWNER_ID },
      payment_status: 'no_payment_required',
    });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'paid',
    );
  });

  it('returns "unknown" when the caller is NOT the session owner — security gate', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: { userId: OWNER_ID },
      payment_status: 'paid',
    });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OTHER_ID)).resolves.toBe(
      'unknown',
    );
  });

  it('returns "unknown" when the session carries no userId metadata key', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: {},
      payment_status: 'paid',
    });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'unknown',
    );
  });

  it('returns "unknown" when the session has no metadata object at all', async () => {
    mockRetrieve.mockResolvedValue({ payment_status: 'paid' });

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'unknown',
    );
  });

  it('returns "unknown" when Stripe rejects — unknown session id, network error, bad key', async () => {
    mockRetrieve.mockRejectedValue(
      new Error('No such checkout.session: cs_test_xyz'),
    );

    await expect(getCheckoutPaymentStatus(SESSION_ID, OWNER_ID)).resolves.toBe(
      'unknown',
    );
    expect(consoleError).toHaveBeenCalled();
  });

  it('calls Stripe with the exact session id it was given — no mutation', async () => {
    mockRetrieve.mockResolvedValue({
      metadata: { userId: OWNER_ID },
      payment_status: 'paid',
    });

    await getCheckoutPaymentStatus(SESSION_ID, OWNER_ID);

    expect(mockRetrieve).toHaveBeenCalledTimes(1);
    expect(mockRetrieve).toHaveBeenCalledWith(SESSION_ID);
  });

  it('does not leak the raw Stripe error back to the caller', async () => {
    mockRetrieve.mockRejectedValue(
      new Error('Invalid API Key provided: sk_live_***SECRET***'),
    );

    const status = await getCheckoutPaymentStatus(SESSION_ID, OWNER_ID);

    expect(status).toBe('unknown');
    // The function returns an enum value, never the Error itself.
    expect(typeof status).toBe('string');
  });
});
