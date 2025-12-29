const express = require("express");
const router = express.Router();
const caseStudiesController = require("../controllers/caseStudiesController");

// Public routes
router.get("/", caseStudiesController.getAllCaseStudies);
router.get("/featured", caseStudiesController.getFeaturedCaseStudies);
router.get("/statuses", caseStudiesController.getStatuses); // Changed from /sectors to /statuses
router.get("/:slug", caseStudiesController.getCaseStudy);

module.exports = router;
