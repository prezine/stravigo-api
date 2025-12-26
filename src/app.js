const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");

// Import routes
const pagesRoutes = require("./routes/pages");
const caseStudiesRoutes = require("./routes/caseStudies");
const insightsRoutes = require("./routes/insights");
const leadsRoutes = require("./routes/leads");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Stravigo API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Apply rate limiting to all API routes
app.use("/", apiLimiter);

// API routes
app.use("/pages", pagesRoutes);
app.use("/case-studies", caseStudiesRoutes);
app.use("/insights", insightsRoutes);
app.use("/leads", leadsRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handling
app.use(errorHandler);

module.exports = app;
