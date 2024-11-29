import { Iblog } from "../../../Model/Blog/blog.model";
import Joi, { ObjectSchema, ValidationResult } from "joi";

export class BlogValidator {
    public createBlogValidation (blog: Iblog): ValidationResult<Iblog>  {
        {
            const schema: ObjectSchema = Joi.object({
                title: Joi.string().required().messages({
                    'string.empty': `blog title cannot be empty`
                }),
    
                content: Joi.string().required().messages({
                    'string.empty': `content cannot be empty`
                })
            });
    
            return  schema.validate(blog)
        }
    }

    public updateBlogValidator(blog: Iblog): ValidationResult<Iblog>  {
        const schema: ObjectSchema = Joi.object({
            title: Joi.string().required().messages({
                'string.empty': `blog title cannot be empty`
            }),

            content: Joi.string().required().messages({
                'string.empty': `content cannot be empty`
            })
        });

        return schema.validate(blog)
    }
}


const blogValidator = new BlogValidator();
export { blogValidator }