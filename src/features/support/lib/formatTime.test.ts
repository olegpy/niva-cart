import { formatTime } from './formatTime';

describe(formatTime.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats with short month, day, hour, and minute', () => {
    const spy = jest
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('Jun 10, 02:32 PM');

    expect(formatTime('2026-06-10T14:32:00.000Z')).toBe('Jun 10, 02:32 PM');
    expect(spy).toHaveBeenCalledWith(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });
});
