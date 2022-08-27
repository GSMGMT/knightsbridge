import { MouseEvent, useCallback } from 'react';

export const useCopy = () => {
  const trigerPopper: (element: HTMLElement) => void = useCallback(
    (element) => {
      element.classList.add('copied');
      element.setAttribute('disabled', 'true');

      setTimeout(() => {
        element.classList.remove('copied');
        element.removeAttribute('disabled');
      }, 1000);
    },
    []
  );

  const handleCopy: (textToCopy: string) => void = useCallback(
    (text) => navigator.clipboard?.writeText(text),
    []
  );

  const handleElementCopy: (
    event: MouseEvent<HTMLElement>,
    text?: string
  ) => void = useCallback(({ currentTarget }, text) => {
    const disabled = !!currentTarget.classList.contains('copied');

    if (disabled) return;

    let value;

    if (text) {
      value = text;
    } else {
      switch (currentTarget.tagName) {
        case 'BUTTON':
          value = currentTarget.previousElementSibling?.textContent;
          break;
        default:
          value = currentTarget.textContent;
          break;
      }
    }

    if (value) {
      handleCopy(value);

      trigerPopper(currentTarget);
    }
  }, []);

  return { handleElementCopy };
};
