const { v4: uuidv4 } = require("uuid");
const { getServiceClient, getAnonClient } = require("../config/supabase");
const emailService = require("../services/emailService");
const { catchAsync } = require("../middleware/errorHandler");

const LeadsController = {
  // Submit contact form
  submitContact: catchAsync(async (req, res) => {
    const {
      full_name,
      email,
      phone_number,
      company,
      title,
      page_source,
      service_interest,
      message,
    } = req.body;

    // Validation
    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    // Save to database
    const leadData = {
      id: uuidv4(),
      full_name,
      email,
      phone_number,
      company,
      title,
      page_source: page_source || "contact-form",
      service_interest: service_interest || "general",
      message,
      status: "new",
      source: "website",
      created_at: new Date().toISOString(),
    };

    // Use SERVICE CLIENT (bypasses RLS)
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error("Lead insert error:", error);
      // If it's a duplicate (based on email and recent timestamp), still return success
      if (error.code === "23505") {
        console.log("Duplicate lead submission:", email);
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to save contact form. Please try again.",
          error: error.message,
        });
      }
    }

    // Send email notifications
    try {
      // Send confirmation to user
      await emailService.sendContactConfirmation(email, full_name);

      // Send notification to admin
      await emailService.sendLeadNotification(leadData);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: data || leadData,
    });
  }),

  // Submit resource access form
  submitResourceAccess: catchAsync(async (req, res) => {
    const { resource_type, full_name, email, phone_number, company, title } =
      req.body;

    // Validation
    if (!full_name || !email || !resource_type) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and resource type are required",
      });
    }

    // Save to database
    const accessData = {
      id: uuidv4(),
      resource_type,
      full_name,
      email,
      phone_number,
      company,
      title,
      created_at: new Date().toISOString(),
    };

    // Use SERVICE CLIENT (bypasses RLS)
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("resource_access")
      .insert(accessData)
      .select()
      .single();

    if (error) {
      console.error("Resource access insert error:", error);
      if (error.code === "23505") {
        console.log("Duplicate resource access:", email);
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to save resource access. Please try again.",
          error: error.message,
        });
      }
    }

    // Send email with resource access
    try {
      await emailService.sendResourceAccess(email, full_name, resource_type);
    } catch (emailError) {
      console.error("Failed to send resource email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Resource access granted. Check your email!",
      data: data || accessData,
    });
  }),

  // Submit job application
  submitJobApplication: catchAsync(async (req, res) => {
    const { job_opening_id, full_name, email, phone_number, cv_url, answers } =
      req.body;

    // Validation
    if (!job_opening_id || !full_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Job opening ID, full name, and email are required",
      });
    }

    // Use ANON CLIENT for read (respects RLS)
    const supabaseAnon = getAnonClient();
    const { data: job, error: jobError } = await supabaseAnon
      .from("job_openings")
      .select("id, role_title")
      .eq("id", job_opening_id)
      .eq("is_active", true)
      .single();

    if (jobError) {
      console.error("Job opening check error:", jobError);
      return res.status(404).json({
        success: false,
        message: "Job opening not found or closed",
      });
    }

    // Save application - Use SERVICE CLIENT for write
    const supabaseService = getServiceClient();
    const applicationData = {
      id: uuidv4(),
      job_opening_id,
      full_name,
      email,
      phone_number,
      cv_url,
      answers: answers ? JSON.stringify(answers) : null,
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseService
      .from("job_applications")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      console.error("Job application insert error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit application. Please try again.",
        error: error.message,
      });
    }

    // Send confirmation email
    try {
      await emailService.sendApplicationConfirmation(
        email,
        full_name,
        job.role_title
      );
    } catch (emailError) {
      console.error("Failed to send application email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data,
    });
  }),

  // Get active job openings
  getJobOpenings: catchAsync(async (req, res) => {
    // Use ANON CLIENT for read (respects RLS)
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from("job_openings")
      .select(
        "id, role_title, business_division, team, work_type, location, description"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get job openings error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch job openings",
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  }),

  // Get internships
  getInternships: catchAsync(async (req, res) => {
    // Use ANON CLIENT for read (respects RLS)
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from("internships")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get internships error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch internships",
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  }),
};

module.exports = LeadsController;
