const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const { createUser, updateUserRole, findUserByEmail, updateUser, deleteUser, gettAllUsers, getUserById, getUserByEmail } = require('../models/userModel');
const secreatkey = process.env.SECRET_KEY; //reading secret key from env file
const generateId = require('../utils/generateIds');

const register = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) //checking for valid req input
            return res.status(400).json({errors: errors.array()});

        const {name, email, phone, password} = req.body; //extracting data from req body
        const user_id = await generateId('users', 'user_id', 'USR');

        const existingEmail = await findUserByEmail(email); //checking if email already exists
        if(existingEmail)
            return res.status(409).json({errors: [{msg: 'Email already exists'}]});

        const hashed = await bcrypt.hash(password, 10); //hashing password
        const user = await createUser({user_id, name, email, phone, password: hashed}); //creating new user

        res.json({message: "User Registered", user});
    }catch(err){
        res.status(500).json({errors: [{msg: err.message}]});
    }
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body; //extracting data from req body
        const user = await findUserByEmail(email);

        if(!user)
            return res.status(404).json({errors: [{msg: 'User with given Email not found'}]});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(401).json({errors: [{msg: 'Invalid credentials'}]});

        const token = jwt.sign(  //creating jwt token
            {user_id : user.user_id, role: user.role},
            secreatkey,
            {expiresIn: '1d'}
        );  
        
        res.json({ token });
    }catch(err){
        res.status(500).json({errors: [{msg: err.message}]});
    }
};

const updateUserByAdmin = async (req, res) => {
    try{
        const {user_id} = req.params;
        const data = req.body;

        const updated = await updateUser(user_id, data);

        if(!updated)
            return res.status(404).json({errors: [{msg: 'User not found'}]});

        res.json({message: "User updated succesfully", updated});
    }catch(err){
        return res.status(500).json({errors: [{msg: err.message}]});
    }
};

const deleteUserByAdmin = async (req, res) => {
    try{
        const{user_id} = req.params;
        const deleted = await deleteUser(user_id);

        if(!deleted)
            return res.status(404).json({errors: [{msg: 'User to be deleted not found'}]});

        res.json({message: "User deleted successfully", deleted});
    }catch(err){
        return res.status(500).json({errors: [{msg: err.message}]});
    }
};

const fetchAllUsers = async (req, res) => {
    try{
        const users = await gettAllUsers();
        res.json(users);
    }catch(err){
        res.status(500).json({errors: [{msg: err.message}]});
    }
};

const fetchUseryId = async (req, res) => {
    try{
        const {user_id} = req.params;
        const user = await getUserById(user_id);

        if(!user)
            return res.status(404).json({errors: [{msg: 'User not found'}]});
        res.json(user);
    }catch(err){
        res.status(500).json({errors: [{msg: err.message}]});
    }
};

const fetchUserByEmail = async (req, res) => {
    try{
        const {email} = req.params;
        const user = await getUserByEmail(email);

        if(!user)
            return res.status(404).json({errors: [{msg: 'User not found'}]});
        res.json(user);
    }catch(err){
        res.status(500).json({errors: [{msg: err.message}]});
    }
};
    
module.exports = {register, login, updateUserByAdmin, deleteUserByAdmin, fetchAllUsers, fetchUseryId, fetchUserByEmail};