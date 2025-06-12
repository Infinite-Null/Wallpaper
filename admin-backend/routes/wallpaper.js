/**
 * Wallpaper routes.
 * @module routes/wallpaper
 */
import express from "express";

import {
    createWallpaper,
    deleteWallpaper,
    getHomeScreenData,
    getWallpaperById,
    getWallpapers,
    incrementDownload,
    updateWallpaper
} from "../controller/wallpaper.js";
import authMiddleware from "../middleware/auth.js";

/**
 * Express router to mount wallpaper routes on.
 * @type {object}
 * @const
 */
const wallpaperRoute = express.Router();

/**
 * Route to get home screen data (public)
 * @name GET /home
 * @access public
 */
wallpaperRoute.get( "/home", getHomeScreenData );

/**
 * Route to get all wallpapers with filters (public)
 * @name GET /
 * @access public
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Items per page
 * @query {string} [category=all] - Filter by category
 * @query {string} [wallpaperStyle=all] - Filter by style (anime/real)
 * @query {string} [keyword] - Search keyword
 * @query {string} [sortBy=createdAt] - Sort field (createdAt/downloadCount/title)
 * @query {string} [sortOrder=desc] - Sort order (asc/desc)
 * @query {boolean} [isActive] - Filter by active status
 */
wallpaperRoute.get( "/", getWallpapers );

/**
 * Route to get wallpaper by ID (public)
 * @name GET /:id
 * @access public
 */
wallpaperRoute.get( "/:id", getWallpaperById );

/**
 * Route to increment download count (public)
 * @name POST /:id/download
 * @access public
 */
wallpaperRoute.post( "/:id/download", incrementDownload );

/**
 * Route to create new wallpaper (admin only)
 * @name POST /
 * @access private
 */
wallpaperRoute.post( "/", authMiddleware, createWallpaper );

/**
 * Route to update wallpaper (admin only)
 * @name PUT /:id
 * @access private
 */
wallpaperRoute.put( "/:id", authMiddleware, updateWallpaper );

/**
 * Route to delete wallpaper (admin only)
 * @name DELETE /:id
 * @access private
 */
wallpaperRoute.delete( "/:id", authMiddleware, deleteWallpaper );

export default wallpaperRoute;
