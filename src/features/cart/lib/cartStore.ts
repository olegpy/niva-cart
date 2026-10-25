import type { Product } from '@/features/products/types';

export interface CartItem {
    product: Product;
    quantity: number;
}

const STORAGE_KEY = 'niva-cart.v1';

export const EMPTY_CART: CartItem[] = [];

const listeners = new Set<() => void>();

let snapshot: CartItem[] = EMPTY_CART;
let snapshotRaw: string | null = null;

function isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) return false;
    const { product, quantity } = value as Partial<CartItem>;
    return (
        typeof quantity === 'number' &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        typeof product === 'object' &&
        product !== null &&
        Number.isInteger(product.id) &&
        typeof product.title === 'string' &&
        typeof product.price === 'number'
    );
}

function parseItems(raw: string | null): CartItem[] {
    if (!raw) return EMPTY_CART;
    try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY_CART;
    } catch {
        return EMPTY_CART;
    }
}

function readStorage(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function writeStorage(items: CartItem[]): void {
    try {
        if (items.length === 0) {
            window.localStorage.removeItem(STORAGE_KEY);
        } else {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    } catch {
        // Storage is disabled or full: the cart still works in memory for this tab.
    }
}

/** Must return the same reference until the stored cart changes (useSyncExternalStore). */
export function getCartSnapshot(): CartItem[] {
    const raw = readStorage();
    if (raw !== snapshotRaw) {
        snapshotRaw = raw;
        snapshot = parseItems(raw);
    }
    return snapshot;
}

export function getServerCartSnapshot(): CartItem[] {
    return EMPTY_CART;
}

export function updateCart(update: (items: CartItem[]) => CartItem[]): void {
    snapshot = update(getCartSnapshot());
    writeStorage(snapshot);
    snapshotRaw = readStorage();
    listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void): () => void {
    listeners.add(listener);

    // Fires when another tab changes the cart.
    const onStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) listener();
    };
    window.addEventListener('storage', onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
}
