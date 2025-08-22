-- Initial schema for Candidate Tracking System
-- This file shows how to implement the data structure in Supabase

-- Create enum types for better data integrity
CREATE TYPE requisition_status AS ENUM ('draft', 'open', 'on_hold', 'closed', 'cancelled');
CREATE TYPE requisition_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE candidate_priority AS ENUM ('low', 'medium', 'high');

-- Job Requisitions Table
CREATE TABLE requisitions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    type TEXT, -- 'Full-time', 'Part-time', 'Contract', etc.
    status requisition_status DEFAULT 'draft',
    priority requisition_priority DEFAULT 'medium',
    hiring_manager TEXT,
    recruiter TEXT,
    created_date DATE,
    target_start_date DATE,
    description TEXT,
    requirements TEXT[], -- Array of requirement strings
    salary_range TEXT,
    positions_to_fill INTEGER DEFAULT 1,
    hiring_stages JSONB, -- Flexible hiring stages configuration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates Table
CREATE TABLE candidates (
    id TEXT PRIMARY KEY,
    requisition_id TEXT REFERENCES requisitions(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    location TEXT,
    current_stage TEXT, -- References the stage ID from requisition.hiring_stages
    priority candidate_priority DEFAULT 'medium',
    source TEXT, -- 'LinkedIn', 'Company Website', 'Referral', etc.
    applied_date DATE,
    experience_years INTEGER,
    current_company TEXT,
    current_title TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    salary_expectation TEXT,
    notice_period TEXT,
    notes TEXT,
    tags TEXT[], -- Array of skill/tag strings
    interviews JSONB, -- Array of interview records
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisitions_created_date ON requisitions(created_date);
CREATE INDEX idx_candidates_requisition_id ON candidates(requisition_id);
CREATE INDEX idx_candidates_current_stage ON candidates(current_stage);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_applied_date ON candidates(applied_date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_requisitions_updated_at 
    BEFORE UPDATE ON requisitions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS on both tables
ALTER TABLE requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust based on your authentication needs)
-- Allow all operations for authenticated users (you can make this more restrictive)
CREATE POLICY "Allow all operations for authenticated users" ON requisitions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON candidates
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data (optional - for development)
INSERT INTO requisitions (
    id, title, department, location, type, status, priority,
    hiring_manager, recruiter, created_date, target_start_date,
    description, requirements, salary_range, positions_to_fill,
    hiring_stages
) VALUES (
    'req-001',
    'Senior Frontend Developer',
    'Engineering',
    'San Francisco, CA',
    'Full-time',
    'open',
    'high',
    'Sarah Johnson',
    'Mike Chen',
    '2024-01-15',
    '2024-03-01',
    'We are looking for a Senior Frontend Developer to join our growing engineering team.',
    ARRAY[
        '5+ years of frontend development experience',
        'Expert knowledge of React and TypeScript',
        'Experience with Next.js and modern build tools'
    ],
    '$120,000 - $160,000',
    2,
    '[
        {"id": "applied", "name": "Applied", "description": "Candidates who have submitted applications"},
        {"id": "screening", "name": "Screening", "description": "Initial screening and resume review"},
        {"id": "phone_interview", "name": "Phone Interview", "description": "Phone or video screening interview"},
        {"id": "technical_interview", "name": "Technical Interview", "description": "Technical assessment and interview"},
        {"id": "final_interview", "name": "Final Interview", "description": "Final round with hiring manager"},
        {"id": "offer", "name": "Offer Extended", "description": "Job offer has been extended"},
        {"id": "hired", "name": "Hired", "description": "Candidate accepted and onboarded"},
        {"id": "rejected", "name": "Rejected", "description": "Application was not successful"}
    ]'::jsonb
);

-- Insert sample candidate
INSERT INTO candidates (
    id, requisition_id, first_name, last_name, email, phone, location,
    current_stage, priority, source, applied_date, experience_years,
    current_company, current_title, linkedin_url, salary_expectation,
    notice_period, notes, tags, interviews
) VALUES (
    'cand-001',
    'req-001',
    'Alex',
    'Chen',
    'alex.chen@email.com',
    '+1 (555) 123-4567',
    'San Francisco, CA',
    'technical_interview',
    'high',
    'LinkedIn',
    '2024-01-20',
    6,
    'TechCorp Inc.',
    'Frontend Developer',
    'https://linkedin.com/in/alexchen',
    '$145,000',
    '2 weeks',
    'Strong React skills, great portfolio. Moving to technical round.',
    ARRAY['react', 'typescript', 'senior-level', 'local'],
    '[
        {
            "date": "2024-01-22",
            "type": "screening",
            "interviewer": "Mike Chen",
            "rating": 4,
            "feedback": "Great communication skills, solid technical background"
        },
        {
            "date": "2024-01-25",
            "type": "phone_interview",
            "interviewer": "Sarah Johnson",
            "rating": 4,
            "feedback": "Impressive experience, good cultural fit"
        }
    ]'::jsonb
);
