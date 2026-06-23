const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const { createUser, updateUserRole, findUserByEmail, updateUser, deleteUser, getAllUsers, getUserById, getUserByEmail } = require('../models/userModel');
const secreatkey = process.env.SECRET_KEY; //reading secret key from env file
const generateId = require('../utils/generateIds');
const apiError = require('../utils/apiError');

const register = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) //checking for valid req input
            throw new apiError(400, 'Invalid input', errors.array());

        const {name, email, phone, password} = req.body; //extracting data from req body
        const user_id = await generateId('users', 'user_id', 'USR');

        const existingEmail = await findUserByEmail(email); //checking if email already exists
        if(existingEmail)
            throw new apiError(409, 'Email already exists');

        const hashed = await bcrypt.hash(password, 10); //hashing password
        const user = await createUser({user_id, name, email, phone, password: hashed}); //creating new user

        res.json({message: "User Registered", user});
    }catch(err){
        next(err);
    }
};

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body; //extracting data from req body
        const user = await findUserByEmail(email);

        if(!user)
            throw new apiError(404, 'User not found', [{msg: 'User not found'}]);

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            throw new apiError(401, 'Invalid credentials', [{msg: 'Invalid credentials'}]);

        const token = jwt.sign(  //creating jwt token
            {user_id : user.user_id, role: user.role},
            secreatkey,
            {expiresIn: '1d'}
        );  
        
        res.json({ token });
    }catch(err){
        next(err);
    }
};

const updateUserByAdmin = async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const data = req.body;

        if(Object.keys(data).length === 0){
            throw new apiError(400,'No fields provided for update');
        }

        const allowedFields = ['name', 'role', 'email', 'phone', 'password'];
        const filteredData = {};

        for(const field of allowedFields){
            if(data[field])
                filteredData[field] = data[field];
        }

        if(filteredData.password){
            filteredData.password = await bcrypt.hash(filteredData.password, 10);
        }

        const updated = await updateUser(user_id, filteredData);

        if(!updated)
            throw new apiError(404, 'User to be updated not found', [{msg: 'User to be updated not found'}]);

        delete updated.password;

        res.json({message: "User updated succesfully", updated});
    }catch(err){
        next(err);
    }
};

const deleteUserByAdmin = async (req, res, next) => {
    try{
        const{user_id} = req.params;
        const deleted = await deleteUser(user_id);

        if(!deleted)
            throw new apiError(404, 'User to be deleted not found', [{msg: 'User to be deleted not found'}]);

        res.json({message: "User deleted successfully", deleted});
    }catch(err){
        next(err);
    }
};

const fetchAllUsers = async (req, res, next) => {
    try{
        const users = await getAllUsers();
        res.json(users);
    }catch(err){
        next(err);
    }
};

const fetchUserById = async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const user = await getUserById(user_id);

        if(!user)
            throw new apiError(404, 'User not found', [{msg: 'User not found'}]);
        res.json(user);
    }catch(err){
        next(err);
    }
};

const fetchUserByEmail = async (req, res, next) => {
    try{
        const {email} = req.query;
        const user = await getUserByEmail(email);

        if(!user)
            throw new apiError(404, 'User not found', [{msg: 'User not found'}]);
        res.json(user);
    }catch(err){
        next(err);
    }
};
    
module.exports = {register, login, updateUserByAdmin, deleteUserByAdmin, fetchAllUsers, fetchUserById, fetchUserByEmail};