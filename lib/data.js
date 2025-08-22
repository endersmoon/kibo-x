// Candidate Tracking System Data Model
// This structure is designed to be compatible with Supabase

// Job Requisition Status
export const REQUISITION_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  ON_HOLD: "on_hold",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

// Default hiring stages - can be customized per requisition
export const DEFAULT_HIRING_STAGES = [
  {
    id: "applied",
    name: "Applied",
    description: "Candidates who have submitted applications",
  },
  {
    id: "screening",
    name: "Screening",
    description: "Initial screening and resume review",
  },
  {
    id: "phone_interview",
    name: "Phone Interview",
    description: "Phone or video screening interview",
  },
  {
    id: "technical_interview",
    name: "Technical Interview",
    description: "Technical assessment and interview",
  },
  {
    id: "final_interview",
    name: "Final Interview",
    description: "Final round with hiring manager",
  },
  {
    id: "offer",
    name: "Offer Extended",
    description: "Job offer has been extended",
  },
  {
    id: "hired",
    name: "Hired",
    description: "Candidate accepted and onboarded",
  },
  {
    id: "rejected",
    name: "Rejected",
    description: "Application was not successful",
  },
];

// Sample Job Requisitions
export const sampleRequisitions = [
  {
    id: "req-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: REQUISITION_STATUS.OPEN,
    priority: "high",
    hiring_manager: "Sarah Johnson",
    recruiter: "Mike Chen",
    created_date: "2024-01-15",
    target_start_date: "2024-03-01",
    description:
      "We are looking for a Senior Frontend Developer to join our growing engineering team. The ideal candidate will have 5+ years of experience with React, TypeScript, and modern frontend technologies.",
    requirements: [
      "5+ years of frontend development experience",
      "Expert knowledge of React and TypeScript",
      "Experience with Next.js and modern build tools",
      "Strong understanding of responsive design",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of testing frameworks (Jest, Cypress)",
    ],
    salary_range: "$120,000 - $160,000",
    positions_to_fill: 2,
    hiring_stages: DEFAULT_HIRING_STAGES,
  },
  {
    id: "req-002",
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    status: REQUISITION_STATUS.OPEN,
    priority: "medium",
    hiring_manager: "David Rodriguez",
    recruiter: "Lisa Wang",
    created_date: "2024-01-20",
    target_start_date: "2024-02-15",
    description:
      "We are seeking an experienced Product Manager to drive product strategy and execution for our core platform. You will work closely with engineering, design, and business stakeholders.",
    requirements: [
      "3+ years of product management experience",
      "Experience with B2B SaaS products",
      "Strong analytical and data-driven approach",
      "Excellent communication and leadership skills",
      "Experience with Agile development processes",
      "MBA or equivalent experience preferred",
    ],
    salary_range: "$110,000 - $140,000",
    positions_to_fill: 1,
    hiring_stages: [
      {
        id: "applied",
        name: "Applied",
        description: "Candidates who have submitted applications",
      },
      {
        id: "screening",
        name: "Initial Screening",
        description: "Resume and portfolio review",
      },
      {
        id: "case_study",
        name: "Case Study",
        description: "Product case study presentation",
      },
      {
        id: "stakeholder_interview",
        name: "Stakeholder Interview",
        description: "Interview with key stakeholders",
      },
      {
        id: "final_interview",
        name: "Final Interview",
        description: "Final round with executive team",
      },
      {
        id: "offer",
        name: "Offer Extended",
        description: "Job offer has been extended",
      },
      {
        id: "hired",
        name: "Hired",
        description: "Candidate accepted and onboarded",
      },
      {
        id: "rejected",
        name: "Rejected",
        description: "Application was not successful",
      },
    ],
  },
  {
    id: "req-003",
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Contract",
    status: REQUISITION_STATUS.OPEN,
    priority: "low",
    hiring_manager: "Emma Thompson",
    recruiter: "Alex Kim",
    created_date: "2024-01-25",
    target_start_date: "2024-02-20",
    description:
      "We are looking for a talented UX Designer to help improve our user experience and design systems. This is a 6-month contract position with potential for extension.",
    requirements: [
      "3+ years of UX design experience",
      "Proficiency in Figma and design systems",
      "Experience with user research and testing",
      "Portfolio demonstrating strong design thinking",
      "Collaborative mindset and excellent communication",
    ],
    salary_range: "$70 - $90 per hour",
    positions_to_fill: 1,
    hiring_stages: [
      {
        id: "applied",
        name: "Applied",
        description: "Candidates who have submitted applications",
      },
      {
        id: "portfolio_review",
        name: "Portfolio Review",
        description: "Design portfolio assessment",
      },
      {
        id: "design_challenge",
        name: "Design Challenge",
        description: "Take-home design exercise",
      },
      {
        id: "design_interview",
        name: "Design Interview",
        description: "Portfolio presentation and design discussion",
      },
      {
        id: "team_interview",
        name: "Team Interview",
        description: "Cultural fit and team collaboration",
      },
      {
        id: "offer",
        name: "Offer Extended",
        description: "Contract offer has been extended",
      },
      {
        id: "hired",
        name: "Hired",
        description: "Candidate accepted and onboarded",
      },
      {
        id: "rejected",
        name: "Rejected",
        description: "Application was not successful",
      },
    ],
  },
];

// Sample Candidates
export const sampleCandidates = [
  // Frontend Developer Candidates
  {
    id: "cand-001",
    requisition_id: "req-001",
    first_name: "Alex",
    last_name: "Chen",
    email: "alex.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    current_stage: "technical_interview",
    priority: "high",
    source: "LinkedIn",
    applied_date: "2024-01-20",
    experience_years: 6,
    current_company: "TechCorp Inc.",
    current_title: "Frontend Developer",
    linkedin_url: "https://linkedin.com/in/alexchen",
    resume_url: "/resumes/alex-chen.pdf",
    portfolio_url: "https://alexchen.dev",
    salary_expectation: "$145,000",
    notice_period: "2 weeks",
    notes: "Strong React skills, great portfolio. Moving to technical round.",
    tags: ["react", "typescript", "senior-level", "local"],
    interviews: [
      {
        date: "2024-01-22",
        type: "screening",
        interviewer: "Mike Chen",
        rating: 4,
        feedback: "Great communication skills, solid technical background",
      },
      {
        date: "2024-01-25",
        type: "phone_interview",
        interviewer: "Sarah Johnson",
        rating: 4,
        feedback: "Impressive experience, good cultural fit",
      },
    ],
    created_at: "2024-01-20",
    updated_at: "2024-01-25",
  },
  {
    id: "cand-002",
    requisition_id: "req-001",
    first_name: "Maya",
    last_name: "Patel",
    email: "maya.patel@email.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    current_stage: "phone_interview",
    priority: "medium",
    source: "Company Website",
    applied_date: "2024-01-18",
    experience_years: 5,
    current_company: "StartupXYZ",
    current_title: "Senior Frontend Engineer",
    linkedin_url: "https://linkedin.com/in/mayapatel",
    resume_url: "/resumes/maya-patel.pdf",
    portfolio_url: "https://mayapatel.io",
    salary_expectation: "$135,000",
    notice_period: "1 month",
    notes: "Open to relocation, strong Next.js experience",
    tags: ["react", "nextjs", "remote-friendly"],
    interviews: [
      {
        date: "2024-01-23",
        type: "screening",
        interviewer: "Mike Chen",
        rating: 3,
        feedback: "Good technical skills, needs to improve communication",
      },
    ],
    created_at: "2024-01-18",
    updated_at: "2024-01-23",
  },
  {
    id: "cand-003",
    requisition_id: "req-001",
    first_name: "James",
    last_name: "Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    current_stage: "applied",
    priority: "low",
    source: "Referral",
    applied_date: "2024-01-26",
    experience_years: 4,
    current_company: "BigTech Co.",
    current_title: "Frontend Developer",
    linkedin_url: "https://linkedin.com/in/jameswilson",
    resume_url: "/resumes/james-wilson.pdf",
    salary_expectation: "$125,000",
    notice_period: "2 weeks",
    notes: "Referred by John Doe, needs initial screening",
    tags: ["react", "junior-to-mid", "referral"],
    interviews: [],
    created_at: "2024-01-26",
    updated_at: "2024-01-26",
  },
  {
    id: "cand-004",
    requisition_id: "req-001",
    first_name: "Sofia",
    last_name: "Rodriguez",
    email: "sofia.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    current_stage: "offer",
    priority: "high",
    source: "Recruiter",
    applied_date: "2024-01-15",
    experience_years: 7,
    current_company: "Design Systems Inc.",
    current_title: "Principal Frontend Engineer",
    linkedin_url: "https://linkedin.com/in/sofiarodriguez",
    resume_url: "/resumes/sofia-rodriguez.pdf",
    portfolio_url: "https://sofia-dev.com",
    salary_expectation: "$155,000",
    notice_period: "3 weeks",
    notes: "Excellent candidate, offer extended at $150k",
    tags: ["react", "design-systems", "senior-level", "offer-stage"],
    interviews: [
      {
        date: "2024-01-17",
        type: "screening",
        interviewer: "Mike Chen",
        rating: 5,
        feedback: "Outstanding candidate with great experience",
      },
      {
        date: "2024-01-19",
        type: "phone_interview",
        interviewer: "Sarah Johnson",
        rating: 5,
        feedback: "Perfect fit for our team and culture",
      },
      {
        date: "2024-01-22",
        type: "technical_interview",
        interviewer: "Tech Team",
        rating: 5,
        feedback: "Exceptional technical skills and problem-solving",
      },
      {
        date: "2024-01-24",
        type: "final_interview",
        interviewer: "Sarah Johnson",
        rating: 5,
        feedback: "Strong leadership potential, recommended for hire",
      },
    ],
    created_at: "2024-01-15",
    updated_at: "2024-01-26",
  },

  // Product Manager Candidates
  {
    id: "cand-005",
    requisition_id: "req-002",
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 567-8901",
    location: "Remote (EST)",
    current_stage: "case_study",
    priority: "high",
    source: "AngelList",
    applied_date: "2024-01-22",
    experience_years: 5,
    current_company: "ProductCo",
    current_title: "Senior Product Manager",
    linkedin_url: "https://linkedin.com/in/michaelbrown",
    resume_url: "/resumes/michael-brown.pdf",
    salary_expectation: "$130,000",
    notice_period: "1 month",
    notes: "Strong B2B SaaS background, preparing case study presentation",
    tags: ["product-management", "saas", "remote", "senior-level"],
    interviews: [
      {
        date: "2024-01-24",
        type: "screening",
        interviewer: "Lisa Wang",
        rating: 4,
        feedback: "Great PM experience, strong analytical skills",
      },
    ],
    created_at: "2024-01-22",
    updated_at: "2024-01-24",
  },

  // UX Designer Candidates
  {
    id: "cand-006",
    requisition_id: "req-003",
    first_name: "Priya",
    last_name: "Singh",
    email: "priya.singh@email.com",
    phone: "+1 (555) 678-9012",
    location: "New York, NY",
    current_stage: "design_challenge",
    priority: "medium",
    source: "Dribbble",
    applied_date: "2024-01-27",
    experience_years: 4,
    current_company: "Creative Agency",
    current_title: "UX Designer",
    linkedin_url: "https://linkedin.com/in/priyasingh",
    resume_url: "/resumes/priya-singh.pdf",
    portfolio_url: "https://priyasingh.design",
    salary_expectation: "$80/hour",
    notice_period: "2 weeks",
    notes: "Beautiful portfolio, currently working on design challenge",
    tags: ["ux-design", "figma", "user-research", "local"],
    interviews: [
      {
        date: "2024-01-29",
        type: "portfolio_review",
        interviewer: "Emma Thompson",
        rating: 4,
        feedback: "Impressive portfolio with strong design thinking",
      },
    ],
    created_at: "2024-01-27",
    updated_at: "2024-01-29",
  },
];

// Utility functions for data management
export const getRequisitionById = (id) => {
  return sampleRequisitions.find((req) => req.id === id);
};

export const getCandidatesByRequisition = (requisitionId) => {
  return sampleCandidates.filter(
    (candidate) => candidate.requisition_id === requisitionId,
  );
};

export const getCandidatesByStage = (requisitionId, stage) => {
  return sampleCandidates.filter(
    (candidate) =>
      candidate.requisition_id === requisitionId &&
      candidate.current_stage === stage,
  );
};

export const getRequisitionStats = (requisitionId) => {
  const candidates = getCandidatesByRequisition(requisitionId);
  const requisition = getRequisitionById(requisitionId);

  if (!requisition) return null;

  const stats = {
    total_candidates: candidates.length,
    positions_to_fill: requisition.positions_to_fill,
    stages: {},
  };

  // Count candidates in each stage
  requisition.hiring_stages.forEach((stage) => {
    stats.stages[stage.id] = getCandidatesByStage(
      requisitionId,
      stage.id,
    ).length;
  });

  return stats;
};

// Function to get priority color for styling
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-yellow-500";
    case "low":
      return "border-l-green-500";
    default:
      return "border-l-gray-300";
  }
};

export const getPriorityBadge = (priority) => {
  const colors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return colors[priority] || colors.low;
};

// Supabase-compatible schema definitions (for future reference)
export const SUPABASE_SCHEMA = {
  requisitions: {
    id: "text PRIMARY KEY",
    title: "text NOT NULL",
    department: "text",
    location: "text",
    type: "text",
    status: "text",
    priority: "text",
    hiring_manager: "text",
    recruiter: "text",
    created_date: "date",
    target_start_date: "date",
    description: "text",
    requirements: "text[]",
    salary_range: "text",
    positions_to_fill: "integer",
    hiring_stages: "jsonb",
    created_at: "timestamp with time zone DEFAULT now()",
    updated_at: "timestamp with time zone DEFAULT now()",
  },
  candidates: {
    id: "text PRIMARY KEY",
    requisition_id: "text REFERENCES requisitions(id)",
    first_name: "text NOT NULL",
    last_name: "text NOT NULL",
    email: "text UNIQUE",
    phone: "text",
    location: "text",
    current_stage: "text",
    priority: "text",
    source: "text",
    applied_date: "date",
    experience_years: "integer",
    current_company: "text",
    current_title: "text",
    linkedin_url: "text",
    resume_url: "text",
    portfolio_url: "text",
    salary_expectation: "text",
    notice_period: "text",
    notes: "text",
    tags: "text[]",
    interviews: "jsonb",
    created_at: "timestamp with time zone DEFAULT now()",
    updated_at: "timestamp with time zone DEFAULT now()",
  },
};
