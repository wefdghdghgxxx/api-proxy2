// server/routes/login.ts

import { verifyPassword, setAuthCookie } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  // Only handle POST requests
  if (event.method !== "POST") {
    setResponseStatus(event, 405);
    return "Method Not Allowed";
  }

  try {
    // Parse form data
    const body = await readBody(event);
    const password = body?.password || "";

    // Verify password
    if (verifyPassword(password)) {
      // Set authentication cookie
      setAuthCookie(event);

      // Redirect to homepage
      return sendRedirect(event, "/", 302);
    } else {
      // Redirect back with error
      return sendRedirect(event, "/?error=invalid", 302);
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return "Internal Server Error";
  }
});
