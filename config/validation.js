const Joi = require('joi');

const comicSchema = Joi.object({
  bookName: Joi.string().required().messages({
    'string.empty': 'Book Name is required',
    'any.required': 'Book Name is required'
  }),
  authorName: Joi.string().required().messages({
    'string.empty': 'Author Name is required',
    'any.required': 'Author Name is required'
  }),
  yearOfPublication: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'number.base': 'Year of Publication must be a number',
    'number.min': 'Year of Publication must be at least 1900',
    'number.max': 'Year of Publication cannot be in the future',
    'any.required': 'Year of Publication is required'
  }),
  price: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Price must be a positive number',
    'any.required': 'Price is required'
  }),
  discount: Joi.number().precision(2).min(0).messages({
    'number.base': 'Discount must be a non-negative number'
  }),
  numberOfPages: Joi.number().integer().positive().required().messages({
    'number.base': 'Number of Pages must be a positive integer',
    'any.required': 'Number of Pages is required'
  }),
  condition: Joi.string().valid('new', 'used').required().messages({
    'any.only': 'Condition must be either "new" or "used"',
    'any.required': 'Condition is required'
  }),
  description: Joi.string().optional(),
});

module.exports = comicSchema;
