import type { Product } from '@/features/products/types';
import {
  EMPTY_CART,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
  updateCart,
} from './cartStore';

const STORAGE_KEY = 'niva-cart.v1';

function makeProduct(id: number): Product {
  return {
    id,
    title: `Product ${id}`,
    price: 10,
    description: '',
    images: [],
    category: 'test',
    quantity: 5,
    thumbnail: '/t.jpg',
  };
}

describe('cartStore', () => {
  beforeEach(() => {
    updateCart(() => []);
  });

  it('starts empty on the server', () => {
    expect(getServerCartSnapshot()).toBe(EMPTY_CART);
  });

  it('persists updates to localStorage and reads them back', () => {
    updateCart(() => [{ product: makeProduct(1), quantity: 2 }]);

    expect(getCartSnapshot()).toEqual([{ product: makeProduct(1), quantity: 2 }]);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(1);
  });

  it('returns the same reference until the cart changes', () => {
    updateCart(() => [{ product: makeProduct(1), quantity: 1 }]);

    expect(getCartSnapshot()).toBe(getCartSnapshot());
  });

  it('removes the storage key when the cart is emptied', () => {
    updateCart(() => [{ product: makeProduct(1), quantity: 1 }]);

    updateCart(() => []);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(getCartSnapshot()).toEqual([]);
  });

  it('ignores storage that is not valid JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');

    expect(getCartSnapshot()).toEqual([]);
  });

  it('ignores storage that is not an array', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [] }));

    expect(getCartSnapshot()).toEqual([]);
  });

  it('drops malformed entries and keeps valid ones', () => {
    const valid = { product: makeProduct(1), quantity: 2 };
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([valid, { product: null, quantity: 1 }, { product: makeProduct(2), quantity: 0 }, 'junk']),
    );

    expect(getCartSnapshot()).toEqual([valid]);
  });

  it('notifies subscribers on update and stops after unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToCart(listener);

    updateCart(() => [{ product: makeProduct(1), quantity: 1 }]);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    updateCart(() => []);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('notifies subscribers when another tab changes the cart', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToCart(listener);

    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('keeps the cart in memory when storage writes fail', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    updateCart(() => [{ product: makeProduct(1), quantity: 1 }]);

    expect(getCartSnapshot()).toEqual([{ product: makeProduct(1), quantity: 1 }]);
    setItem.mockRestore();
  });
});
