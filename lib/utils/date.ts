export const todayString = (): string =>
  new Date().toISOString().split('T')[0];
