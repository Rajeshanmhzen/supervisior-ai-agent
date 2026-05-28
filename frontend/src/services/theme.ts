export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme_mode';
const THEME_EVENT = 'theme-mode-changed';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const resolveThemeMode = (mode: ThemeMode) =>
  mode === 'system' ? getSystemTheme() : mode;

export const applyTheme = (mode: ThemeMode) => {
  const resolved = resolveThemeMode(mode);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
};

export const themeStorage = {
  getMode: (): ThemeMode => {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  },
  setMode: (mode: ThemeMode) => {
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
    window.dispatchEvent(new Event(THEME_EVENT));
  },
  subscribe: (listener: () => void) => {
    window.addEventListener(THEME_EVENT, listener);
    return () => window.removeEventListener(THEME_EVENT, listener);
  },
};

export const initTheme = () => {
  applyTheme(themeStorage.getMode());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeStorage.getMode() === 'system') applyTheme('system');
  });
};
