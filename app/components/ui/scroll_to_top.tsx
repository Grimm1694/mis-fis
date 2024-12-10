import { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    // Scroll to the top of the page on page load or refresh
    window.scrollTo(220, 0);
  }, []); // Only run once on component mount

  return null;
};

export default ScrollToTop;