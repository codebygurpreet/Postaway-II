// imported modules
import { body, validationResult } from "express-validator";

const validateUser = async (req, res, next) => {
  // 1. Setup rules for validation.
  const rules = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters."),

    body("email")
      .isEmail()
      .withMessage("Email must be valid."),

    body("password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      ),
  ];

  // running all rules one by one to check
  await Promise.all(rules.map((rule) => rule.run(req)));

  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      errorMessage: validationErrors.array()[0].msg,
    });
  }
  next();
};

export default validateUser;
