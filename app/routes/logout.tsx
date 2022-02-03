import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "~/utils/session.server";

/*
 * The reason that we're using an action (rather than a loader)
 * is because we want to avoid CSRF problems by using a POST request rather than a GET request.
 * This is why the logout button is a form and not a link.
 */
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

// The loader is just there in case someone somehow lands on that page, we'll just redirect them back home.
export const loader: LoaderFunction = async () => {
  return redirect("/");
};
