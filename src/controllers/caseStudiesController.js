const { supabase } = require("../config/supabase");
const { catchAsync } = require("../middleware/errorHandler");

const CaseStudiesController = {
  // Get all case studies (public)
  getAllCaseStudies: catchAsync(async (req, res) => {
    const { page = 1, limit = 12, sector, service_type, search } = req.query;

    let query = supabase
      .from("case_studies")
      .select(
        "id, title, slug, sector, headline_summary, featured_image_url, published_at",
        { count: "exact" }
      )
      .eq("is_published", true);

    // Apply filters
    if (sector) query = query.eq("sector", sector);
    if (service_type) query = query.eq("service_type", service_type);

    // Search
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,sector.ilike.%${search}%,headline_summary.ilike.%${search}%`
      );
    }

    // Sort by most recent
    query = query.order("published_at", { ascending: false });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  }),

  // Get single case study
  getCaseStudy: catchAsync(async (req, res) => {
    const { slug } = req.params;

    const { data: caseStudy, error } = await supabase
      .from("case_studies")
      .select(
        `
        *,
        case_study_media(*)
      `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Case study not found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: caseStudy,
    });
  }),

  // Get case study sectors (for filters)
  getSectors: catchAsync(async (req, res) => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("sector")
      .eq("is_published", true)
      .order("sector", { ascending: true });

    if (error) throw error;

    // Get unique sectors
    const sectors = [...new Set(data.map((item) => item.sector))].filter(
      Boolean
    );

    res.json({
      success: true,
      data: sectors,
    });
  }),

  // Get featured case studies for homepage
  getFeaturedCaseStudies: catchAsync(async (req, res) => {
    const { limit = 3 } = req.query;

    const { data, error } = await supabase
      .from("case_studies")
      .select("id, title, slug, sector, headline_summary, featured_image_url")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("featured_order", { ascending: true })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  }),
};

module.exports = CaseStudiesController;
