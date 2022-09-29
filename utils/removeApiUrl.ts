export const removeApiUrl = <T>(data: T & { logo: string }) => {
  const [, logo] = data.logo.split(`${process.env.API_URL}/`);
  return {
    ...data,
    logo,
  };
};
