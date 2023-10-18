export const sleep = (timeout: number = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
