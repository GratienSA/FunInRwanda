/**
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 *  @type {string[]}

 */

export const publicRoutes = [
    "/",
    "/auth/new-verification"
];
/**
 * An array of routes that are used for authentication
 * these routes will redirect logged in users to/settings
 *  @type {string[]}
 */
export const authRoutes =
[
"/login",
"/register",
"/auth/reset",
"/auth/new-password"

];

/**
 * The prefix for API authentification routes
 * Routes that start with this prefix are used for API
 *  authentication purpose
 *  @type {string}
 */

export const ApiAuthPrefix ="/api/auth";

/**
 * The prefix for API authentification routes
 * Routes that start with this prefix are used for API
 *  authentication purpose
 *  @type {string}
 */

/**
 * The default redirect path after logging in
 *  @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/"