/**
 * Mobile-first scroll utilities for smooth navigation
 */

/**
 * Scrolls to a section with proper offset for mobile viewport
 * @param sectionId - The ID of the section to scroll to
 * @param additionalOffset - Extra offset in pixels (default: 20)
 */
export const scrollToSection = (
  sectionId: string,
  additionalOffset: number = 20
): void => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  // Get header height for offset calculation
  const headerHeight = 64; // h-16 = 64px
  const totalOffset = headerHeight + additionalOffset;

  // Calculate the target position
  const elementPosition = element.offsetTop;
  const targetPosition = elementPosition - totalOffset;

  // Smooth scroll to the calculated position
  window.scrollTo({
    top: Math.max(0, targetPosition), // Ensure we don't scroll above the page
    behavior: 'smooth',
  });
};

/**
 * Scrolls to the top of the page
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Checks if an element is in the viewport
 * @param element - The element to check
 * @param threshold - Percentage of element that should be visible (0-1)
 */
export const isElementInViewport = (
  element: HTMLElement,
  threshold: number = 0.5
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate how much of the element is visible
  const visibleHeight =
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;

  return visibleHeight / elementHeight >= threshold;
};

/**
 * Gets the current scroll position
 */
export const getScrollPosition = (): number => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

/**
 * Scrolls to a specific position
 * @param position - The scroll position in pixels
 */
export const scrollToPosition = (position: number): void => {
  window.scrollTo({
    top: position,
    behavior: 'smooth',
  });
};
