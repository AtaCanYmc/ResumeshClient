-- =============================================================================
-- ResuMesh Supabase Schema Migration: Base Tables, Indexes, and Default Seeds
-- =============================================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(512),
    repo_url VARCHAR(512),
    stars INT DEFAULT 0,
    forks INT DEFAULT 0,
    watchers INT DEFAULT 0,
    language VARCHAR(100),
    topics JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);

-- 2. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(512) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_articles_platform ON articles(platform);

-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EDUCATIONS TABLE
CREATE TABLE IF NOT EXISTS educations (
    id VARCHAR(36) PRIMARY KEY,
    school VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    grade VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level INT DEFAULT 0,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- 7. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    platform VARCHAR(50) DEFAULT '',
    url VARCHAR(512),
    docs_url VARCHAR(512),
    tags VARCHAR(255) DEFAULT '',
    version VARCHAR(50) DEFAULT '',
    last_month_downloads INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    platform VARCHAR(50),
    url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(512) NOT NULL,
    thumbnail VARCHAR(512),
    profile VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
    id VARCHAR(36) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(512) NOT NULL,
    icon VARCHAR(100),
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links(platform);

-- 11. SECTIONS TABLE
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(36) PRIMARY KEY,
    key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sections_key ON sections(key);

-- 12. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB
);
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- 13. SYSTEM LOGS TABLE
CREATE TABLE IF NOT EXISTS system_logs (
    id VARCHAR(36) PRIMARY KEY,
    level VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    service VARCHAR(100),
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED SECTIONS DEFAULTS
INSERT INTO sections (id, key, title, description, is_active, order_index) VALUES
    ('sec-1', 'educations', 'Educations Section', 'Display educations page', true, 1),
    ('sec-2', 'experiences', 'Experiences Section', 'Display experiences page', true, 2),
    ('sec-3', 'projects', 'Projects Section', 'Display projects page', true, 3),
    ('sec-4', 'certificates', 'Certificates Section', 'Display certificates page', true, 4),
    ('sec-5', 'articles', 'Articles Section', 'Display articles page', true, 5),
    ('sec-6', 'videos', 'Videos Section', 'Display videos page', true, 6),
    ('sec-7', 'skills', 'Skills Section', 'Display skills page', true, 7),
    ('sec-8', 'posts', 'Posts Section', 'Display posts page', true, 8)
ON CONFLICT (key) DO NOTHING;

-- SEED SOCIAL LINKS DEFAULTS
INSERT INTO social_links (id, platform, label, url, icon, order_index, is_active) VALUES
    ('github', 'github', 'GitHub', 'https://github.com/AtaCanYmc', 'github', 1, true),
    ('linkedin', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/ata-can-yaymac%C4%B1/', 'linkedin', 2, true),
    ('devto', 'devto', 'Dev.to', 'https://dev.to/atacanymc', 'devto', 3, true),
    ('medium', 'medium', 'Medium', 'https://medium.com/@atacanymc', 'medium', 4, true)
ON CONFLICT (id) DO NOTHING;
