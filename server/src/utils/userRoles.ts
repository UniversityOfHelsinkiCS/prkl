/** User role enumerations. */
import { User } from "../entities/User";
export const USER = 1;
export const STAFF = 2;
export const ADMIN = 3;

/** Check if user is an admin. */
export const isAdmin = (user: User): boolean => user.role === 3;
