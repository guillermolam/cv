import { atom, type WritableAtom } from 'nanostores';

/**
 * persistentAtom — a nanostore atom backed by localStorage.
 *
 * SSR-safe: on the server (no window) it behaves like a plain atom with the
 * initial value. On the client it hydrates from localStorage on creation and
 * writes back on every change. Cross-tab sync via the `storage` event.
 */
export function persistentAtom<T>(
  key: string,
  initial: T,
  opts?: {
    encode?: (value: T) => string;
    decode?: (raw: string) => T;
  },
): WritableAtom<T> {
  const encode = opts?.encode ?? ((v: T) => JSON.stringify(v));
  const decode = opts?.decode ?? ((r: string) => JSON.parse(r) as T);

  let start = initial;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) start = decode(raw);
    } catch {
      /* ignore malformed / unavailable storage */
    }
  }

  const store = atom<T>(start);

  if (typeof window !== 'undefined') {
    store.subscribe((value) => {
      try {
        window.localStorage.setItem(key, encode(value));
      } catch {
        /* storage full or blocked — non-fatal */
      }
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        store.set(decode(event.newValue));
      } catch {
        /* ignore */
      }
    });
  }

  return store;
}
