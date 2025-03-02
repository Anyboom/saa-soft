export function debounce(func: unknown, wait: number){
  let timeout: number | undefined;

  return function executedFunction(...args: unknown[]) {
    const later = () => {
      timeout = undefined;

      if (func instanceof Function) {
        func(...args);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
