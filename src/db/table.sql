-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  hero_title TEXT,
  hero_description TEXT,
  hero_cta_text VARCHAR(100),
  hero_cta_link VARCHAR(255),
  content JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  hero_title TEXT,
  hero_description TEXT,
  hero_cta_text VARCHAR(100),
  intro_text TEXT,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service offerings
CREATE TABLE service_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Case studies
CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  sector VARCHAR(100),
  headline_summary TEXT,
  excerpt TEXT,
  full_description TEXT,
  background TEXT,
  strategic_approach TEXT,
  impact TEXT,
  featured_image_url TEXT,
  tags TEXT[],
  service_type VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Case study media
CREATE TABLE case_study_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID REFERENCES case_studies(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(50) DEFAULT 'image',
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insights/Blog articles
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  excerpt TEXT,
  content_body TEXT,
  featured_image_url TEXT,
  author_name VARCHAR(255),
  content_format VARCHAR(50) DEFAULT 'article',
  seo_meta_title VARCHAR(255),
  seo_meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback TEXT NOT NULL,
  service_type VARCHAR(50),
  customer_name VARCHAR(255),
  company VARCHAR(255),
  designation VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leads (contact form submissions)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(100),
  page_source VARCHAR(255),
  service_interest VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resource access tracking
CREATE TABLE resource_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  company VARCHAR(255),
  title VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, resource_type)
);

-- Job openings
CREATE TABLE job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title VARCHAR(255) NOT NULL,
  business_division VARCHAR(100),
  team VARCHAR(100),
  work_type VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Internships
CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  division VARCHAR(100),
  team VARCHAR(100),
  work_type VARCHAR(50),
  location VARCHAR(255),
  duration VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_opening_id UUID REFERENCES job_openings(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  cv_url TEXT,
  answers TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Brand clients for bragging rights
CREATE TABLE brand_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_group VARCHAR(100),
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  service_type VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);