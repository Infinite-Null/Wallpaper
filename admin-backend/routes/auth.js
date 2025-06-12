/**
 * User authentication routes.
 * @module routes/auth
 */
import express from "express";

import { deleteAdmin, getAdminById, getAdmins, login, logout, me, register } from "../controller/auth.js";
import authMiddleware from "../middleware/auth.js";

/**
 * Express router to mount admin authentication routes on.
 * @type {object}
 * @const
 */
const authRoute = express.Router();

/**
 * Route to register a new user
 * @name POST /register
 * @access private
 */
authRoute.post( "/register", register );

/**
 * Route to login a user
 * @name POST /login
 * @access public
 */
authRoute.post( "/login", login );

/**
 * Route to logout a user
 * @name POST /logout
 * @access private
 */
authRoute.post( "/logout", authMiddleware, logout );

/**
 * Route to get current user details
 * @name GET /me
 * @access private
 */
authRoute.get( "/me", authMiddleware, me );

/**
 * Route to get all admin users with pagination
 * @name GET /
 * @access private
 */
authRoute.get( "/", authMiddleware, getAdmins );

/**
 * Route to get admin user by ID
 * @name GET /:id
 * @access private
 */
authRoute.get( "/:id", authMiddleware, getAdminById );

/**
 * Route to delete admin user by ID
 * @name DELETE /:id
 * @access private
 */
authRoute.delete( "/:id", authMiddleware, deleteAdmin );

export default authRoute;
