const { getAnonClient } = require("../config/supabase");
const { catchAsync } = require("../middleware/errorHandler");

const PagesController = {
  // Get page by slug
  getPage: catchAsync(async (req, res) => {
    const { slug } = req.params;
    const supabase = getAnonClient(); // Use anon client for reads

    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Page not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: page,
    });
  }),

  // Get homepage data
  getHomepage: catchAsync(async (req, res) => {
    const supabase = getAnonClient(); // Use anon client for reads

    // Get homepage content
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", "home")
      .eq("is_published", true)
      .single();

    if (pageError && pageError.code !== "PGRST116") throw pageError;

    // Get featured case studies - UPDATED with status instead of sector
    const { data: caseStudies, error: csError } = await supabase
      .from("case_studies")
      .select("id, title, slug, status, headline_summary, featured_image_url")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("featured_order", { ascending: true })
      .limit(3);

    if (csError) throw csError;

    // Get testimonials
    const { data: testimonials, error: testError } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .eq("is_approved", true)
      .order("featured_order", { ascending: true })
      .limit(9);

    if (testError) throw testError;

    // Get services
    const { data: services, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (serviceError) throw serviceError;

    res.json({
      success: true,
      data: {
        page: page || {},
        featured_case_studies: caseStudies || [],
        testimonials: testimonials || [],
        services: services || [],
      },
    });
  }),

  // Get about page data
  getAboutPage: catchAsync(async (req, res) => {
    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", "about")
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Page not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: page,
    });
  }),

  // Get service page
  getServicePage: catchAsync(async (req, res) => {
    const { type } = req.params;

    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("service_type", type)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }
      throw error;
    }

    // Get service offerings
    const { data: offerings, error: offeringsError } = await supabase
      .from("service_offerings")
      .select("*")
      .eq("service_id", service.id)
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (offeringsError) throw offeringsError;

    // Get case studies for this service type - UPDATED with status instead of sector
    const { data: caseStudies, error: csError } = await supabase
      .from("case_studies")
      .select("id, title, slug, status, headline_summary, featured_image_url")
      .eq("service_type", type)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3);

    if (csError) throw csError;

    res.json({
      success: true,
      data: {
        ...service,
        offerings: offerings || [],
        case_studies: caseStudies || [],
      },
    });
  }),
};

module.exports = PagesController;
