const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insightsController");

// Public routes
router.get("/", insightsController.getAllInsights);
router.get("/latest", insightsController.getLatestInsights);
router.get("/featured", insightsController.getFeaturedInsights);
router.get("/categories", insightsController.getCategories);
router.get("/:slug", insightsController.getInsight);

module.exports = router;
