export const seedJobs = [
  {
    id: crypto.randomUUID(),
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    postedDate: new Date().toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$120k - $160k',
    description: 'Join our dynamic team to build cutting-edge web applications using React and modern technologies.',
    tags: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    createdBy: 'demo-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$100k - $140k',
    description: 'Build scalable applications from frontend to backend in a fast-paced startup environment.',
    tags: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    createdBy: 'demo-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'Remote',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Contract',
    salaryRange: '$80 - $120/hr',
    description: 'Create beautiful and intuitive user experiences for our growing portfolio of clients.',
    tags: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
    createdBy: 'design-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Backend Developer',
    company: 'DataFlow Inc',
    location: 'Austin, TX',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$110k - $150k',
    description: 'Develop robust backend systems and APIs to handle large-scale data processing.',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    createdBy: 'backend-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$130k - $170k',
    description: 'Manage cloud infrastructure and implement CI/CD pipelines for high-availability applications.',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    createdBy: 'cloud-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Mobile Developer',
    company: 'MobileFirst',
    location: 'Los Angeles, CA',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$105k - $145k',
    description: 'Build cross-platform mobile applications using React Native and native technologies.',
    tags: ['React Native', 'iOS', 'Android', 'JavaScript'],
    createdBy: 'mobile-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    postedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$125k - $165k',
    description: 'Apply machine learning and statistical analysis to solve complex business problems.',
    tags: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    createdBy: 'ai-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Product Manager',
    company: 'ProductCorp',
    location: 'Chicago, IL',
    postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$115k - $155k',
    description: 'Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.',
    tags: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
    createdBy: 'product-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Denver, CO',
    postedDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$85k - $115k',
    description: 'Ensure software quality through comprehensive testing strategies and automation.',
    tags: ['Automation Testing', 'Selenium', 'Jest', 'Cypress'],
    createdBy: 'qa-company@example.com'
  },
  {
    id: crypto.randomUUID(),
    title: 'Security Engineer',
    company: 'SecureTech',
    location: 'Washington, DC',
    postedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'Full-time',
    salaryRange: '$135k - $175k',
    description: 'Protect our systems and data through advanced security measures and threat analysis.',
    tags: ['Cybersecurity', 'Penetration Testing', 'SIEM', 'Compliance'],
    createdBy: 'security-company@example.com'
  }
];

export const seedApplications = [
  {
    id: crypto.randomUUID(),
    company: 'TechCorp',
    title: 'Frontend Developer',
    status: 'Applied',
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Applied through company website. Seems like a great opportunity to work with modern React technologies.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    company: 'StartupXYZ',
    title: 'Full Stack Developer',
    status: 'Interviewing',
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Had initial phone screen. Technical interview scheduled for next week. Very excited about this opportunity!',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    company: 'BigCorp',
    title: 'Senior Developer',
    status: 'Rejected',
    appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Unfortunately did not move forward. Feedback was positive but they went with someone with more years of experience.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];