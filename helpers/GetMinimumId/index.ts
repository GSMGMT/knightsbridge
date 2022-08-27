export const getMinimumId: (id: string) => string = (id) => {
  const initialId = id.slice(0, 4);
  const finalId = id.slice(-4);

  return `${initialId}...${finalId}`;
};
