export const useTheme = () => {
  const classNameDark = 'dark-mode';
  const classNameLight = 'light-mode';

  let defaultDark: boolean = false;

  const storageKey = 'darkMode';
  const storageTheme = localStorage.getItem(storageKey);

  const handleSetClassOnDocumentBody: (darkMode: string) => void = (
    darkMode
  ) => {
    document.body.classList.add(darkMode ? classNameDark : classNameLight);
    document.body.classList.remove(darkMode ? classNameLight : classNameDark);
  };

  if (storageTheme) {
    handleSetClassOnDocumentBody(JSON.parse(storageTheme));
  } else {
    defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (defaultDark) {
      handleSetClassOnDocumentBody(classNameDark);
    }

    localStorage.setItem(storageKey, JSON.stringify(defaultDark));
  }
};
