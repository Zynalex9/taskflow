import { useEffect } from "react";

const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - Write Node`;
  }, []);
  return null;
};

export default useTitle;
