const prisma = require("../config/prismaClient");
const {
  employeeSchema,
  employeeUpdateSchema,
} = require("../utils/validation");



const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

/**
 * Find Employee by ID - a helper function to be used in other controller functions
 * @param {*} id 
 * @returns employees
 */
const findEmployee = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    const error = new Error(`Employee with ID ${id} not found.`);
    error.status = 404;
    throw error;
  }

  return employee;
};


/**
 * Get all employees
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
        ...(department && {
          department: {
            equals: department,
            mode: "insensitive",
          },
        }),
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Employee by ID
 * @route GET /api/employees/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid employee ID.",
      });
    }

    const employee = await findEmployee(id);

    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};


/**
 * Create a new employee
 * @route POST /api/employees
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const createEmployee = async (req, res, next) => {
  try {
    const result = employeeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }

    const data = result.data;

    if (data.managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: data.managerId },
      });

      if (!manager) {
        return res.status(400).json({
          error: `Employee with ID ${data.managerId} not found.`,
        });
      }
    }

    const employee = await prisma.employee.create({
      data,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "An employee with this email already exists.",
      });
    }

    next(error);
  }
};


/**
 * Update existing employee by using its ID
 * @route PUT /api/employees/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const updateEmployee = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid employee ID.",
      });
    }

    await findEmployee(id);

    const result = employeeUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }

    const data = result.data;

    if (data.managerId === id) {
      return res.status(400).json({
        error: "An employee cannot be their own manager.",
      });
    }

    if (data.managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: data.managerId },
      });

      if (!manager) {
        return res.status(400).json({
          error: `Employee with ID ${data.managerId} not found.`,
        });
      }
    }

    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(employee);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "An employee with this email already exists.",
      });
    }

    next(error);
  }
};


/**
 * Delete existing employee by id
 * @route DELETE /api/employees/:id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid employee ID.",
      });
    }

    await findEmployee(id);

    await prisma.employee.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};