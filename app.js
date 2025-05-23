if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  const express = require("express");
  const app = express();
  const path = require("path");
  const mongoose = require("mongoose");
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const wrapAsync = require("./utils/wrapAsync.js");
  const ExpressError = require("./utils/expressError.js");
  const { message } = require("statuses");
  const listingRoute = require("./routes/listing.js");
  const reviewRoute = require("./routes/reviews.js");
  const userRoute = require("./routes/users.js");
  const MongoStore = require("connect-mongo");
  const session = require("express-session");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js");
  const flash = require("connect-flash");
  const Listing = require("./models/listing.js");
  
  app.set("views", path.join(__dirname, "/views/listings"));
  app.set("view engine", "ejs");
  
  // MongoDB Connection
  const mongoURL = process.env.ATLAS_URL;
  if (!mongoURL) {
    console.error("MongoDB URL is not defined in the environment variables.");
    process.exit(1);
  }
  
  main()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
  
  async function main() {
    await mongoose.connect(mongoURL);
  }
  
  const store = MongoStore.create({
    mongoUrl: mongoURL,
    crypto: { secret: process.env.SECRET_KEY },
    touchAfter: 24 * 3600,
  });
  
  store.on("error", (err) => {
    console.error("ERROR IN MONGO SESSION STORE:", err);
  });
  
  const sessionConfig = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    },
  };
  
  app.use(session(sessionConfig));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });
  
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  
  app.engine("ejs", ejsMate);

  //root route
  app.get("/",async(req,res)=>{
    const listings = await Listing.find({});
    res.render("index.ejs", { listings });
  });
  app.use("/listings", listingRoute);
  app.use("/listings/:id/reviews", reviewRoute);
  app.use("/", userRoute);
  
  // Error Handling
  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!!"));
  });
  
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
  