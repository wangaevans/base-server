import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import User from "../models/userSchema.js";

export const createUser = async (req, res) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET.toString()
        ),
        location: req.body.location
    });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("User not found");
        const decryptedpass = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET
        );
        const encodedPass=decryptedpass.toString(CryptoJS.enc.Utf8)
        encodedPass !== req.body.password &&
            res.status(401).json("Wrong password");
        const userToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: "21d" }
        );
        const { password, __v, createdAt,updatedAt, ...others } = user._doc;
        res.status(200).json({ ...others, token: userToken });
    } catch (error) {
        res.status(500).json("Failed to login check your credentials");
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve user" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
