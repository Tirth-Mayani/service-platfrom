const express = require('express');
const router = express.Router();
const { register, login, updateUserByAdmin, deleteUserByAdmin, fetchAllUsers, fetchUserById, fetchUserByEmail } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {body} = require('express-validator');

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentication and User management
 */

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users
 *       403:
 *         description: Access denied
 */
router.get('/users', auth, role('admin'), fetchAllUsers);

/**
 * @swagger
 * /api/auth/user/{user_id}:
 *  get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: USR-0001
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/user/:user_id', auth,  fetchUserById);

/**
 * @swagger
 * /api/auth/user:
 *  get:
 *     summary: Get a user by Email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: user@test.com
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/user', auth, fetchUserByEmail);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: user
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', 
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail(),
        body('phone').isNumeric(),
        body('password').isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
    ],
    register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/user/{user_id}:
 *   put:
 *     summary: Update user details (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: USR-0001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Updated Name
 *               role: department_admin
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Access denied
 */
router.put('/user/:user_id', auth, role('admin'), updateUserByAdmin);

/**
 * @swagger
 * /api/auth/user/{user_id}:
 *   patch:
 *     summary: Partially update user details (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: USR-0001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               role: employee
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Access denied
 */
router.patch('/user/:user_id', auth, role('admin'), updateUserByAdmin);

/**
 * @swagger
 * /api/auth/user/{user_id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: USR-0001
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/user/:user_id', auth, role('admin'), deleteUserByAdmin);

module.exports = router;