import yup from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "username must be atleast of 3 charecters")
    .required(),
  email: yup.string().email("Email is not valid one").required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "One uppercase required")
    .matches(/[0-9]/, "One number required")
    .matches(/[@$!%*?&#]/, "One special character required")
    .required("Password is required"),
});


export const validateUser = (schema) => async (req, res, next) => {
  try {
    // abortEarly: false => collect all validation errors instead of stopping at the first one
    const value = await schema.validate(req.body, { abortEarly: false });
    req.body = value;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.inner.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }
};