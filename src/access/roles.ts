import type { Access, FieldAccess } from "payload";
import type { User } from "@/payload-types";

export type Role = User["role"];

export const hasRole = (user: User | null | undefined, ...roles: Role[]): boolean =>
  Boolean(user && roles.includes(user.role));

export const isSuperAdmin: Access = ({ req: { user } }) => hasRole(user, "superadmin");

export const isSuperAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  hasRole(user, "superadmin");

/** Superadmin plus the given roles may perform the action; everyone else is denied. */
export const isSuperAdminOr =
  (...roles: Role[]): Access =>
  ({ req: { user } }) =>
    hasRole(user, "superadmin", ...roles);

/** Anyone signed in may read; the public can read only published documents. */
export const readPublishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

export const anyoneLoggedIn: Access = ({ req: { user } }) => Boolean(user);
