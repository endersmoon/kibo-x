# Kibo-X Candidate Tracking System

A modern, intuitive candidate tracking system built with Next.js and designed for Supabase integration. Manage job requisitions and track candidates through customizable hiring stages using drag-and-drop kanban boards.

## Features

### 🎯 **Job Requisition Management**
- Create and manage job requisitions with detailed information
- Customizable hiring stages for different roles and processes
- Priority levels and status tracking
- Department and location-based organization
- Target start dates and position counts

### 👥 **Candidate Tracking**
- Comprehensive candidate profiles with contact and professional information
- Drag-and-drop kanban boards for visual progress tracking
- Interview history and feedback management
- Skills and tags for easy categorization
- Priority levels and source tracking

### 📊 **Dashboard & Analytics**
- Overview dashboard with requisition statistics
- Real-time candidate counts per stage
- Filterable requisition views by status
- Visual progress indicators

### 🎨 **Modern UI/UX**
- Responsive design that works on all devices
- Dark mode support
- Intuitive drag-and-drop interface
- Clean, professional design with accessibility in mind

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom kanban board with Radix UI primitives
- **Database**: Designed for Supabase (PostgreSQL)
- **State Management**: React hooks with local state
- **Icons**: Lucide React
- **Code Quality**: Biome for linting and formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Supabase account for database integration

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kibo-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Mode

The application currently runs with dummy data for development and testing. All data is stored in local state and will reset when you refresh the page.

## Supabase Integration

### Setup Instructions

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Run the migration**
   Execute the SQL migration file in your Supabase dashboard:
   ```bash
   supabase/migrations/001_initial_candidate_tracking_schema.sql
   ```

4. **Install Supabase client**
   ```bash
   npm install @supabase/supabase-js
   ```

5. **Update components to use Supabase**
   Replace the dummy data imports with Supabase service calls from `lib/supabase.js`

### Database Schema

The system uses two main tables:

- **`requisitions`**: Job requisition information with customizable hiring stages
- **`candidates`**: Candidate profiles linked to requisitions with stage tracking

Both tables include:
- Automatic timestamp management
- Row Level Security (RLS) for data protection
- Optimized indexes for performance
- JSONB fields for flexible data storage

## Project Structure

```
kibo-x/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main application page
├── components/            # React components
│   ├── ui/                # UI component library
│   ├── candidate-kanban.jsx    # Kanban board for candidates
│   ├── candidate-modal.jsx     # Candidate detail modal
│   ├── kanban.jsx         # Reusable kanban components
│   └── requisition-overview.jsx # Requisition dashboard
├── lib/                   # Utility libraries
│   ├── data.js           # Sample data and utilities
│   ├── supabase.js       # Supabase client and services
│   └── utils.js          # General utilities
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
└── public/               # Static assets
```

## Key Components

### RequisitionOverview
The main dashboard showing all job requisitions with:
- Filterable views by status
- Statistics cards
- Requisition details and candidate counts
- Navigation to individual kanban boards

### CandidateKanban
Drag-and-drop kanban board for managing candidates:
- Customizable stages per requisition
- Visual candidate cards with key information
- Real-time updates via drag-and-drop
- Candidate priority and source indicators

### CandidateModal
Detailed candidate profile modal featuring:
- Complete contact and professional information
- Interview history with ratings and feedback
- Editable notes and tags
- Timeline of candidate interactions

## Customization

### Hiring Stages
Each requisition can have custom hiring stages. Default stages include:
- Applied
- Screening
- Phone Interview
- Technical Interview
- Final Interview
- Offer Extended
- Hired
- Rejected

### Priority Levels
Both requisitions and candidates support three priority levels:
- **High**: Red indicators, urgent attention
- **Medium**: Yellow indicators, normal priority  
- **Low**: Green indicators, lower priority

### Data Sources
Candidates can be sourced from various channels:
- LinkedIn
- Company Website
- Referrals
- Recruiters
- Job Boards (AngelList, Dribbble, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Format code
npm run format
```

## Future Enhancements

- [ ] Email notifications for stage changes
- [ ] Calendar integration for interview scheduling
- [ ] Resume parsing and auto-fill
- [ ] Advanced analytics and reporting
- [ ] Integration with job boards
- [ ] Bulk candidate import/export
- [ ] Custom fields per requisition
- [ ] Advanced search and filtering
- [ ] Mobile app for recruiters

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.