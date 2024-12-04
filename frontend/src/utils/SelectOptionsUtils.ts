export const optionsFromEnum = (e: {
  [s: string]: any;
}): { key: string; value: any }[] => {
  return Object.entries(e).map(([key, value]) => ({
    key,
    value,
  }));
};
