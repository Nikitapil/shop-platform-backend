export const isArrayIncludesData = <T>(data: T[], arr: T[]) => {
  return data.every((item) => arr.includes(item));
};
