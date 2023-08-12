// https://stackoverflow.com/a/4819886/1931117
export const hasTouchCapability = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0
