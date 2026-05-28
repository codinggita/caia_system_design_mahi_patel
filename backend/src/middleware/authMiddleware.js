// middle ware 

// auth 
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email()
}).min(1);

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    next();
  };
};

module.exports = {
  validateRegister: validateRequest(registerSchema),
  validateLogin: validateRequest(loginSchema),
  validateUpdateProfile: validateRequest(updateProfileSchema),
  validateForgotPassword: validateRequest(forgotPasswordSchema),
  validateResetPassword: validateRequest(resetPasswordSchema),
  validateVerifyEmail: validateRequest(verifyEmailSchema)
};