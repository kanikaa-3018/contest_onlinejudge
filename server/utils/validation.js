const validator = require("validator");

const validateRegister = (req) => {

    const { name, confirmPassword, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
        throw new Error("All fields are required");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    } 
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password: (minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1)");
    } 
    else if(password != confirmPassword) {
        throw new Error("Passwords do not match!");
    }
};
 
module.exports = { validateRegister };