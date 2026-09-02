import swaggerJsdoc from "swagger-jsdoc";
import { OpenAPIV3 } from "openapi-types";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instant Mechanic API",
      version: "1.0.0",
      description: "Instant Mechanic Backend API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options) as OpenAPIV3.Document;

swaggerSpec.paths = {
  "/health": {
    get: {
      summary: "Health check",
      responses: {
        "200": {
          description: "Healthy",
        },
      },
    },
  },

  "/api/auth/login": {
    post: {
      summary: "Login",
      responses: {
        "200": {
          description: "JWT login response",
        },
      },
    },
  },

  "/api/dashboard": {
    get: {
      security: [{ bearerAuth: [] }],
      summary: "Dashboard analytics",
      responses: {
        "200": {
          description: "Dashboard data",
        },
      },
    },
  },

  "/api/bookings": {
    get: {
      security: [{ bearerAuth: [] }],
      summary: "List bookings with pagination/search/filtering",
      responses: {
        "200": {
          description: "Bookings retrieved successfully",
        },
      },
    },

    post: {
      security: [{ bearerAuth: [] }],
      summary: "Create booking",
      responses: {
        "201": {
          description: "Booking created successfully",
        },
      },
    },
  },

  "/api/bookings/{id}/status": {
    patch: {
      security: [{ bearerAuth: [] }],
      summary: "Update booking status",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "Booking status updated successfully",
        },
      },
    },
  },

  "/api/mechanics": {
    get: {
      security: [{ bearerAuth: [] }],
      summary: "List mechanics",
      responses: {
        "200": {
          description: "Mechanics retrieved successfully",
        },
      },
    },
  },

  "/api/customers": {
    get: {
      security: [{ bearerAuth: [] }],
      summary: "List customers",
      responses: {
        "200": {
          description: "Customers retrieved successfully",
        },
      },
    },
  },

  "/api/notifications": {
    get: {
      security: [{ bearerAuth: [] }],
      summary: "List notifications",
      responses: {
        "200": {
          description: "Notifications retrieved successfully",
        },
      },
    },
  },
};

export default swaggerSpec;