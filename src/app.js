require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const register = require("./models/registers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3300;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/about", (req, res) => {
    res.render('about')
});
app.get("/search", (req, res) => {
    res.render('search')
});
app.get("/register", (req, res) => {
    res.render('register')
});
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            })

            console.log("the success part" + registerEmployee);
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log(cookie);

            const registered = await registerEmployee.save();
            console.log("the page part " + registered);
            res.status(201).render("index");
        } else {
            res.send("password is not matching")
        }
    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
});

app.get("/login", (req, res) => {
    res.render('login')
});
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(`${email} and password is ${password}`);

        const useremail = await register.findOne({ email: email })
        // res.send(useremail.password);
        // console.log(useremail);

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        console.log(`this is the cookie awesome ${req.cookies.jwt}`);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.render("404error")
        }
    } catch (error) {
        res.status(400).send("invalid Email")

    }
})

app.get("*", (req, res) => {
    res.render('404error', {
        errorMsg: 'Opps! Page Not Found'
    })
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})


