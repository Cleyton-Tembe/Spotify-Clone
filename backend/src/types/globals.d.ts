import { getAuth } from "@clerk/express";
import type { Request } from "express";

type Auth = ReturnType<typeof getAuth>;

declare global {
  namespace Express {
    interface Request {
      auth: Auth;
    }
  }
}

export {};
