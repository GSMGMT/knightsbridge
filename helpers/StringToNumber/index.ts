type StringToNumber = (string: string) => number;
export const stringToNumber: StringToNumber = (string) => {
  const stringSanitized = string.replace(/,/g, '');

  const number = Number(stringSanitized);

  if (Number.isNaN(number)) {
    return 0;
  }

  return number;
};
