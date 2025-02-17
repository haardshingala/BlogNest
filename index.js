const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie} = require("./middlewares/authentication");
const Blog = require("./models/blog");
const User = require("./models/user");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = 8000;

mongoose
.connect("mongodb://127.0.0.1:27017/blogify")
.then((e) => console.log("MongoDB connected!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token")); // coz at time of signin we named cookie as token
app.use(express.static(path.resolve("./public"))); // means whatever in public folder, serve it statically


app.get("/", async  (req, res) =>{
    const allBlogs = await Blog.find({}); // -1 means descending
    // const PersonData = await User.find({email: req.user.email});
    // console.log(PersonData.email); did by myself coz wanted to change name in home page dynamically
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
        
    });
    
})

app.use("/user", userRoute);
app.use("/blog",blogRoute);

app.listen(PORT, () => console.log(`server started at port: ${PORT}`));