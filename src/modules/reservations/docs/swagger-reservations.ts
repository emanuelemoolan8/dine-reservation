/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReservationInput:
 *       type: object
 *       required:
 *         - userId
 *         - tableNumber
 *         - reservationTime
 *         - numberOfSeats
 *       properties:
 *         userId:
 *           type: integer
 *           example: 123
 *         tableNumber:
 *           type: integer
 *           example: 5
 *         numberOfSeats:
 *           type: integer
 *           example: 4
 *         reservationTime:
 *           type: string
 *           format: date-time
 *           example: "2024-10-01T12:30:00Z"
 *
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 123
 *         tableNumber:
 *           type: integer
 *           example: 5
 *         numberOfSeats:
 *           type: integer
 *           example: 4
 *         reservationTime:
 *           type: string
 *           format: date-time
 *           example: "2024-10-01T12:30:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-09-30T09:15:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-10-01T10:20:00Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         statusCode:
 *           type: integer
 *           example: 500
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "RESERVATION_ERROR"
 *             message:
 *               type: string
 *               example: "Failed to fetch reservations."
 *             details:
 *               type: string
 *               example: "Internal server error"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-09-30T12:00:00Z"
 *             path:
 *               type: string
 *               example: "/reservations"
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Create a new reservation
 *     description: Creates a new reservation for a table at a specific time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationInput'
 *     responses:
 *       201:
 *         description: Reservation successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       409:
 *         description: Conflict - Table is already reserved for the selected time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Get reservations by date range
 *     description: Fetches a list of reservations within a specified date range with optional pagination and table filtering.
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2024-10-01T00:00:00Z"
 *         description: The start date of the reservation range.
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2024-10-31T23:59:59Z"
 *         description: The end date of the reservation range.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number (default is 1).
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of reservations to return per page (default is 10).
 *       - in: query
 *         name: tableNumber
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by a specific table number (optional, e.g., 5).
 *     responses:
 *       200:
 *         description: A list of reservations within the specified date range and optional table number.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Bad request - invalid date range or pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Cancel a reservation
 *     description: Deletes an existing reservation by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation ID.
 *     responses:
 *       204:
 *         description: Reservation successfully deleted.
 *       404:
 *         description: Reservation not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export const reservationSwaggerDocs = {};
