const express = require("express");
const router = express.Router();
const { contactFormLimiter } = require("../middleware/rateLimiter");
const leadsController = require("../controllers/leadsController");

// Public routes with rate limiting for contact forms
router.post("/contact", contactFormLimiter, leadsController.submitContact);
router.post("/resource-access", leadsController.submitResourceAccess);
router.post("/job-application", leadsController.submitJobApplication);
router.get("/jobs", leadsController.getJobOpenings);
router.get("/internships", leadsController.getInternships);

module.exports = router;
