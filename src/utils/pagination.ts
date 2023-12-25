export const getOffset = (page: number, limit: number) => {
  return page * limit - limit;
};
