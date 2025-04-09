import { OpenAPIV3 } from 'openapi-types';

export const getSwaggerSpec = (): OpenAPIV3.Document => ({
  openapi: '3.0.0',
  info: {
    title: 'Bokningssystem API',
    version: '1.0.0',
  },
  paths: {
    "/api/rooms": {
      get: {
        summary: "Get all rooms",
        description: "Returns a list of all meeting rooms with capacity and features.",
        responses: {
          "200": {
            description: "Successful response",
          },
        },
      },
    },
  
    "/api/timeslots/filter": {
      get: {
        summary: "Get available time slots",
        description: "Returns available (not booked) time slots filtered by room(s) and date range.",
        parameters: [
          {
            name: "start",
            in: "query",
            required: true,
            description: "Start date of the time range (YYYY-MM-DD)",
            schema: { type: "string", format: "date" },
          },
          {
            name: "end",
            in: "query",
            required: true,
            description: "End date of the time range (YYYY-MM-DD)",
            schema: { type: "string", format: "date" },
          },
          {
            name: "roomIds",
            in: "query",
            required: false,
            description: "Optional room IDs to filter",
            schema: {
              type: "array",
              items: { type: "integer" },
            },
            style: "form",
            explode: true
          }
        ],
        responses: {
          "200": {
            description: "List of available time slots",
          },
        },
      },
    },
  
    "/api/bookings": {
      post: {
        summary: "Book a meeting room",
        description: "Creates a booking for a specific user, room, and time slot.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "integer" },
                  roomId: { type: "integer" },
                  timeSlotId: { type: "integer" },
                },
                required: ["userId", "roomId", "timeSlotId"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Booking successful",
          },
          "400": {
            description: "Time slot is already booked or invalid data",
          },
        },
      },
    },
  
    "/api/bookings/{id}": {
      get: {
        summary: "Get booking confirmation",
        description: "Returns booking details for confirmation by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Booking ID",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Booking details returned",
          },
          "404": {
            description: "Booking not found",
          },
        },
      },
    },
  
    "/api/users": {
      get: {
        summary: "Get all users",
        description: "Returns a list of all registered users.",
        responses: {
          "200": {
            description: "Successful response with users",
          },
        },
      },
    }
  }
});
