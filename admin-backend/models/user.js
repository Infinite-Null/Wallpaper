import mongoose from "mongoose";

/**
 * Admin User Schema
 * 
 * Mongoose schema 
 * @type {mongoose.Schema}
 */
const AdminUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            sparse: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate: {
                validator: function ( v ) {
                    if ( !v ) return false;
                    const hasLetter = /[a-zA-Z]/.test( v );
                    const hasNumber = /\d/.test( v );
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test( v );

                    return hasLetter && hasNumber && hasSpecialChar;
                },
                message:
          "Password must contain at least one letter and one number and one special character.",
            },
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: [ "admin" ],
        },
    },
    {
        timestamps: true,
    }
);

const AdminUser = mongoose.model( "AdminUser", AdminUserSchema );

export default AdminUser;
