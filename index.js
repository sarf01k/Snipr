const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path")
const morgan = require("morgan");

const dbConnection = require("./src/config/database");
require ("dotenv").config();

const port = 3000 || process.env.PORT;
const urlRouter = require("./src/routes/url");
const userRouter = require("./src/routes/user");
const tempURL = require("./src/models/temp_url");
const app = express();
app.use(cookieParser());
dbConnection();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set("view engine", "ejs")
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

app.use("/", userRouter)
app.use("/", urlRouter);

app.get("/", async (req, res) => {
    const tempUrls = await tempURL.find({ uniqueId: req.cookies.uniqueID});
    res.render("index", { tempUrls: tempUrls });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})