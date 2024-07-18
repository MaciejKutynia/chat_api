export {};

declare global {
  namespace Express {
    interface Request {
      account: {
        id: number;
      };
    }
  }
}
