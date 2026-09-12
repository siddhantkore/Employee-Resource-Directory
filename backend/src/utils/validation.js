const { z } = require("zod");

const employeeSchema = z.object({
  name: z
    .string({ required_error: "Field 'name' is required." })
    .trim()
    .min(1, "Field 'name' cannot be empty.")
    .max(100, "Field 'name' cannot exceed 100 characters."),

  email: z
    .string({ required_error: "Field 'email' is required." })
    .trim()
    .email("Field 'email' must be a valid email address.")
    .max(150, "Field 'email' cannot exceed 150 characters.")
    .transform((v) => v.toLowerCase()),

  department: z
    .string({ required_error: "Field 'department' is required." })
    .trim()
    .min(1, "Field 'department' cannot be empty.")
    .max(50, "Field 'department' cannot exceed 50 characters."),

  role: z
    .string({ required_error: "Field 'role' is required." })
    .trim()
    .min(1, "Field 'role' cannot be empty.")
    .max(50, "Field 'role' cannot exceed 50 characters."),

  managerId: z
    .number()
    .int("Field 'managerId' must be an integer.")
    .positive("Field 'managerId' must be a positive integer.")
    .optional()
    .nullable(),

  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Field 'status' must be 'active' or 'inactive'." }),
  }).optional().default("active"),
});

const employeeUpdateSchema = employeeSchema.partial().extend({

  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Field 'status' must be 'active' or 'inactive'." }),
  }).optional(),
});

module.exports = { employeeSchema, employeeUpdateSchema };
