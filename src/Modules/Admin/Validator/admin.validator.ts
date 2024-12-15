import Joi, { ValidationResult, ObjectSchema } from "joi";
import { IAdmin } from "../../../Model/admin/admin.model";


export class AdminValidator {
    public validateRegister = (admin: IAdmin): ValidationResult<IAdmin> => {
        const schema: ObjectSchema = Joi.object({
            firstName: Joi.string().required().messages({
                'string.empty': `first name cannot be empty`
            }),
            lastName: Joi.string().required().messages({
                'string.empty': `last name cannot be empty`
            }),
            email: Joi.string().required().messages({
                'string.empty': `email cannot be empty`,
                'string.email': `email format must be valid`
            }),
            password: Joi.string()
                .min(8)
                .max(16)
                .messages({
                    'string.base': `Password should be a type of 'text'`,
                    'string.min': `Password must have at least 7 characters`,
                    'string.max': `Password must have at most 100 characters`,
                    'string.empty': `Password cannot be an empty field`,
                    'any.required': `Password is a required field`,
                    'string.pattern.base': `Password must contain an uppercase letter, a lowercase letter, and a number`
                }),

        }).required();

        return schema.validate(admin)
    }

    public validateVerificationCode = (body: any): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            email: Joi.string().required().messages({
                'string.empty': `email cannot be empty`,
                'string.email': `email format must be valid`
            }),
            code: Joi.string().required().messages({
                'string.empty': `code cannot be empty`,
            })
        })

        return schema.validate(body)
    }

    public validateResendCode = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            email: Joi.string().required().messages({
                'string.empty': `code cannot be empty`,
            })
        })

        return schema.validate(admin)
    }

    public validateResetPasswordLink = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            email: Joi.string().required().messages({
                'string.empty': `code cannot be empty`,
            })
        });

        return schema.validate(admin)
    }

    public validateResetPassword = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            email: Joi.string().required().messages({
                'string.empty': `code cannot be empty`,
            })
        });

        return schema.validate(admin)
    }

    public validateChangePassword = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            oldPassword: Joi.string()
                .min(8)
                .max(16)
                .required()
                .messages({
                    'string.base': `Password should be a type of 'text'`,
                    'string.min': `Password must have at least 7 characters`,
                    'string.max': `Password must have at most 100 characters`,
                    'string.empty': `Password cannot be an empty field`,
                    'any.required': `Password is a required field`,
                    'string.pattern.base': `Password must contain an uppercase letter, a lowercase letter, and a number`
                }),

            newPassword: Joi.string()
                .min(8)
                .max(16)
                .required()
                .messages({
                    'string.base': `Password should be a type of 'text'`,
                    'string.min': `Password must have at least 7 characters`,
                    'string.max': `Password must have at most 100 characters`,
                    'string.empty': `Password cannot be an empty field`,
                    'any.required': `Password is a required field`,
                    'string.pattern.base': `Password must contain an uppercase letter, a lowercase letter, and a number`
                }),
        });

        return schema.validate(admin)
    }


    public validateUpdate = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            firstName: Joi.string().required().messages({
                'string.empty': `first name cannot be empty`
            }),
            lastName: Joi.string().required().messages({
                'string.empty': `last name cannot be empty`
            }),
            email: Joi.string().required().messages({
                'string.empty': `email cannot be empty`,
                'string.email': `email format must be valid`
            }),
        });

        return schema.validate(admin)
    }


    public validateLogin = (admin: IAdmin): ValidationResult => {
        const schema: ObjectSchema = Joi.object({
            email: Joi.string().required().messages({
                'string.empty': `email cannot be empty`,
                'string.email': `email format must be valid`
            }),
            password: Joi.string()
                .min(8)
                .max(16)
                .required()
                .messages({
                    'string.base': `Password should be a type of 'text'`,
                    'string.min': `Password must have at least 7 characters`,
                    'string.max': `Password must have at most 100 characters`,
                    'string.empty': `Password cannot be an empty field`,
                    'any.required': `Password is a required field`,
                    'string.pattern.base': `Password must contain an uppercase letter, a lowercase letter, and a number`
                }),
        })

        return schema.validate(admin)
    }
}




const adminValidator = new AdminValidator
export { adminValidator }