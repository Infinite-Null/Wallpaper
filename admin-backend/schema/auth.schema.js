import { z } from "zod/v4";

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;

export const registerSchema = z.object( {
    firstName: z
        .string()
        .min( 1, "First name is required" )
        .max( 50, "First name must be less than 50 characters" ),
    lastName: z
        .string()
        .min( 1, "Last name is required" )
        .max( 50, "Last name must be less than 50 characters" ),
    role: z.enum( [ "admin" ], {
        errorMap: () => ( { message: "Role must be 'admin'" } ),
    } ),
    email: z.email( "Invalid email format" ),
    password: z
        .string()
        .min( 6, "Password must be at least 6 characters long" )
        .regex(
            PASSWORD_REGEX,
            "Password must contain at least one letter, one number and one special character"
        ),
} );

export const loginSchema = z.object( {
    email: z.email( "Invalid email format" ),
    password: z
        .string()
        .min( 6, "Password must be at least 6 characters long" )
        .regex(
            PASSWORD_REGEX,
            "Password must contain at least one letter, one number and one special character"
        ),
} );

