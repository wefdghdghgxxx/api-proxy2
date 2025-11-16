// server/routes/logout.ts

import { clearAuthCookie } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  // Clear authentication cookie
  clearAuthCookie(event);

  // Redirect to homepage
  return sendRedirect(event, "/", 302);
});
