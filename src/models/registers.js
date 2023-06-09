const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generating tokens
employeeSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}
// converting password into hash
employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        // const passwordHash = await bcrypt.hash(password,10);
        // console.log(`the courent password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the courent password is ${this.password}`);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }

    next();
})

// now we need to creat a collactions

const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register;