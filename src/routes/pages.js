const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");

// Public routes
router.get("/home", pagesController.getHomepage);
router.get("/about", pagesController.getAboutPage);
router.get("/service/:type", pagesController.getServicePage);
router.get("/:slug", pagesController.getPage);

module.exports = router;
