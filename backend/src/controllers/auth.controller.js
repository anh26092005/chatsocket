import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import "dotenv/config";
export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: " All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }


        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser) {
            const saveUser = await newUser.save()
            generateToken(saveUser._id, res);
            res.status(201).json({

                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
            //todo:send a welcom email to user

            try {
                await sendWelcomeEmail(saveUser.email, saveUser.fullName, process.env.CLIENT_URL);
            }
            catch (error) {
                console.log("Failed to send welcome email:", error);
            }
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }

    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};