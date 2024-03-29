export const GD_FOCUSABLE_SELECTORS: string = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'embed',
  'iframe',
  'input:not([disabled])',
  'object',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable=true]',
  '[tabindex]',
].join(', ');
