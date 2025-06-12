import mongoose from "mongoose";

import categories from "../enums/category.js";

/**
 * Wallpaper Schema for Hindu Gods
 * 
 * Mongoose schema for Hindu gods wallpaper management
 * @type {mongoose.Schema}
 */
const WallpaperSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            minlength: 3,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
            minlength: 10,
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function( url ) {
                    // Basic URL validation
                    // eslint-disable-next-line security/detect-unsafe-regex, no-useless-escape
                    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

                    return urlPattern.test( url );
                },
                message: "Please provide a valid URL"
            }
        },
        keywords: {
            type: [ String ],
            required: true,
            validate: {
                validator: function( keywords ) {
                    return keywords && keywords.length > 0 && keywords.length <= 20;
                },
                message: "Keywords must contain at least 1 and at most 20 items"
            },
        },
        category: {
            type: String,
            required: true,
            enum: categories,
            trim: true,
        },
        downloadCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminUser",
            required: true,
        },
        wallpaperStyle: {
            type: String,
            required: true,
            enum: [
                "anime",
                "real"
            ],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
WallpaperSchema.index( { category: 1, wallpaperStyle: 1 } );
WallpaperSchema.index( { downloadCount: -1 } );
WallpaperSchema.index( { keywords: 1 } );
WallpaperSchema.index( { createdAt: -1 } );

// Method to increment download count
WallpaperSchema.methods.incrementDownloadCount = async function() {
    this.downloadCount += 1;
    await this.save();

    return this.downloadCount;
};

const Wallpaper = mongoose.model( "Wallpaper", WallpaperSchema );

export default Wallpaper;
