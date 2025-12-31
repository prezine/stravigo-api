const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insightsController");

// Public routes
router.get("/", insightsController.getAllInsights);
router.get("/latest", insightsController.getLatestInsights);
router.get("/categories", insightsController.getCategories);
router.get("/:slug", insightsController.getInsight);
router.get("/featured", insightsController.getFeaturedInsights);

module.exports = router;
