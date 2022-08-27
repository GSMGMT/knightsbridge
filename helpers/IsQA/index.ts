export const isQA: () => boolean = () => {
  const path = window.location.hostname;

  return path.includes('qa');
};
