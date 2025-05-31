export const isImageUrl = (cover: string | undefined): boolean => {
  if (!cover) return false;
  return cover.startsWith("http");
};
