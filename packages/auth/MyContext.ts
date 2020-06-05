import { Request, Response } from "express";
// import { createAuthorsLoader } from "../utils/authorsLoader";
import {User} from './entity/User'

export interface MyContext {
  req: Request;
  res: Response;
  user?: User
  jwt?: any
  // authorsLoader: ReturnType<typeof createAuthorsLoader>;
}
