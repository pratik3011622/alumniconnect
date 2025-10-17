# AlumniConnect - University Alumni Portal

A comprehensive full-stack alumni portal application for universities, featuring authentication, alumni directory, events management, job board, and admin dashboard.

## Features

### For All Users
- **Home Page**: Modern landing page with university branding and quick navigation
- **Alumni Directory**: Searchable directory with filters for batch, branch, and other criteria
- **Events**: Browse and register for upcoming alumni events and reunions
- **Job Board**: Explore job and internship opportunities posted by alumni
- **Contact & About**: Information pages about the platform

### For Alumni
- **Profile Management**: Complete profile with education, work experience, and social links
- **Job Posting**: Share job and internship opportunities with the community
- **Connection Requests**: Network with other alumni
- **Event Registration**: Register for alumni events and reunions

### For Students
- **Alumni Directory Access**: Connect with alumni from various industries
- **Job Applications**: Apply for opportunities posted by alumni
- **Event Participation**: Register for student-alumni networking events

### For Admins
- **User Management**: Approve/reject alumni registrations
- **Event Management**: Create, update, and delete events
- **Job Moderation**: Monitor and manage job postings
- **Dashboard**: Overview of platform activity

## Tech Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication (Email/Password)
  - Real-time subscriptions

### Database Schema

#### Tables
1. **profiles** - Extended user information
2. **connection_requests** - Alumni networking
3. **events** - University and alumni events
4. **event_registrations** - Event attendance tracking
5. **jobs** - Job and internship postings
6. **job_applications** - Application tracking
7. **messages** - Direct messaging between users

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx           # Login modal
│   │   └── Signup.tsx          # Registration modal
│   ├── layout/
│   │   └── Navigation.tsx      # Main navigation bar
│   └── pages/
│       ├── Home.tsx            # Landing page
│       ├── AlumniDirectory.tsx # Alumni search & profiles
│       ├── Events.tsx          # Events listing & registration
│       ├── Jobs.tsx            # Job board & posting
│       ├── Profile.tsx         # User profile management
│       ├── AdminDashboard.tsx  # Admin panel
│       ├── About.tsx           # About page
│       └── Contact.tsx         # Contact page
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (already configured in this project)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
The `.env` file is already configured with Supabase credentials:
```env
VITE_SUPABASE_URL=https://udcqpaxysqrgcnqlreys.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

## Database Setup

The database schema is already set up in Supabase with:
- All necessary tables with proper relationships
- Row Level Security (RLS) policies for data protection
- Indexes for optimal query performance
- Triggers for automatic timestamp updates

### Creating an Admin User

After signing up, you'll need to manually promote your account to admin:

1. Go to your Supabase dashboard
2. Navigate to Table Editor > profiles
3. Find your user record
4. Change the `role` field from 'student' or 'alumni' to 'admin'
5. Refresh the application

## User Roles & Permissions

### Student
- View approved alumni profiles
- Register for events
- Apply for jobs
- Update own profile

### Alumni
- All student permissions
- Requires admin approval to be visible in directory
- Post job opportunities
- Send connection requests

### Admin
- All alumni permissions
- Approve/reject alumni registrations
- Create and manage events
- Delete job postings
- Full access to user management

## Key Features Explained

### Authentication
- Email/password authentication via Supabase Auth
- Role-based access control (Student, Alumni, Admin)
- Automatic profile creation on signup
- Protected routes and components

### Row Level Security (RLS)
All database tables have RLS policies ensuring:
- Users can only modify their own data
- Alumni must be approved to be visible
- Admins have elevated permissions
- Public data is accessible to all

### Search & Filtering
The alumni directory supports:
- Full-text search by name, company, or profession
- Filter by graduation batch
- Filter by branch/department
- Real-time results

### Event Registration
- Browse upcoming events
- View event details and capacity
- Register for events (one registration per event)
- Admin can track registrations

### Job Board
- Alumni can post full-time jobs and internships
- Detailed job descriptions with requirements
- One-click application submission
- Job poster receives applicant information

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables from `.env`
- Deploy

### Deploy to Render

1. **Create a new Web Service**
- Connect your GitHub repository
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview`

2. **Add Environment Variables**
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`

3. **Deploy**

## Architecture Overview

### Authentication Flow
1. User signs up with email/password
2. Supabase Auth creates user account
3. Profile record created automatically
4. Alumni accounts require admin approval
5. Users receive JWT token for API requests

### Data Flow
1. React components use Supabase client
2. RLS policies validate permissions
3. Database queries return filtered data
4. Real-time subscriptions update UI

### State Management
- AuthContext manages authentication state
- Local component state for UI interactions
- Supabase handles data persistence

## Security Considerations

- All API calls authenticated via JWT
- Row Level Security on all tables
- No sensitive data in client-side code
- Input validation on all forms
- SQL injection prevention via Supabase client

## Future Enhancements

Potential features to add:
- Real-time messaging system
- Email notifications for events/jobs
- Advanced search with more filters
- Alumni success stories section
- Mentorship program matching
- Photo gallery for events
- Export alumni data (for admins)
- Analytics dashboard
- Mobile app (React Native)

## Troubleshooting

### Common Issues

**Build fails:**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (should be 18+)

**Authentication not working:**
- Verify Supabase credentials in `.env`
- Check browser console for errors

**RLS errors:**
- Ensure you're logged in
- Check if alumni account is approved

**Admin dashboard not accessible:**
- Verify your role is set to 'admin' in Supabase

## License

This project is open source and available for educational purposes.

## Support

For questions or issues:
- Email: alumni@university.edu
- Create an issue in the repository
- Contact the development team

---

Built with React, TypeScript, Tailwind CSS, and Supabase
