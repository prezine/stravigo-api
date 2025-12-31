const { supabase } = require("../config/supabase");
const { catchAsync } = require("../middleware/errorHandler");

const InsightsController = {
  // Get featured insights/articles
  getFeaturedInsights: catchAsync(async (req, res) => {
    const { limit = 6 } = req.query;

    const { data, error } = await supabase
      .from("insights")
      .select(
        "id, title, slug, category, featured_image_url, author_name, published_at, excerpt, is_featured"
      )
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  }),

  // Get all insights/articles
  getAllInsights: catchAsync(async (req, res) => {
    const { page = 1, limit = 12, category, format, search } = req.query;

    let query = supabase
      .from("insights")
      .select(
        "id, title, slug, category, featured_image_url, author_name, published_at, excerpt, is_featured",
        { count: "exact" }
      )
      .eq("is_published", true);

    // Apply filters
    if (category) query = query.eq("category", category);
    if (format) query = query.eq("content_format", format);

    // Search
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,category.ilike.%${search}%,excerpt.ilike.%${search}%`
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

  // Get single insight/article
  getInsight: catchAsync(async (req, res) => {
    const { slug } = req.params;

    const { data: insight, error } = await supabase
      .from("insights")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Insight not found",
        });
      }
      throw error;
    }

    // Get related insights (same category)
    const { data: related, error: relatedError } = await supabase
      .from("insights")
      .select("id, title, slug, category, featured_image_url, published_at")
      .eq("category", insight.category)
      .eq("is_published", true)
      .neq("id", insight.id)
      .order("published_at", { ascending: false })
      .limit(3);

    if (relatedError) throw relatedError;

    res.json({
      success: true,
      data: {
        ...insight,
        related: related || [],
      },
    });
  }),

  // Get insight categories
  getCategories: catchAsync(async (req, res) => {
    const { data, error } = await supabase
      .from("insights")
      .select("category")
      .eq("is_published", true)
      .order("category", { ascending: true });

    if (error) throw error;

    // Get unique categories
    const categories = [...new Set(data.map((item) => item.category))].filter(
      Boolean
    );

    res.json({
      success: true,
      data: categories,
    });
  }),

  // Get latest insights for homepage
  getLatestInsights: catchAsync(async (req, res) => {
    const { limit = 3 } = req.query;

    const { data, error } = await supabase
      .from("insights")
      .select(
        "id, title, slug, category, featured_image_url, author_name, published_at, excerpt, is_featured"
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  }),
};

module.exports = InsightsController;
