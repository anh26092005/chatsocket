import jwt from "jsonwebtoken";
export const generateTokken = (userId, res) => {
    const tokken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: "7day",
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,//prevent ASS attacks:cross-site scripting
        sameSite: "strict",//CSRF attacks
        secure: process.env.NODE_ENV === "development" ? false : true,//only send cookies over https

    });
    return tokken;
}