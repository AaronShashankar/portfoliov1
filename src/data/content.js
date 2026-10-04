/** Personal content and links supplied by Aaron. */
export const PERSONA = {
  name: 'Aaron Shasankar Bishwakarma', firstName: 'Aaron', role: 'Software Developer',
  location: 'Lalitpur, Nepal', timezone: 'Asia/Kathmandu', email: 'aaronshasankar@gmail.com',
  github: 'https://github.com/AaronShashankar', copyrightYear: new Date().getFullYear(),
}
export const EDUCATION = { degree: 'Bachelor of Computer Application (BCA)', period: '2023 — Present', status: 'Currently studying' }
export const EMPLOYER = { name: 'Top Tech Giants', url: 'https://www.toptechgiants.com/', status: 'Currently working here' }
export const NAVIGATION_LINKS = [
  { label: 'About', href: '#about' }, { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#work' }, { label: 'Contact', href: '#contact' },
]
export const HERO_CONTENT = {
  eyebrow: 'Software developer & BCA student',
  headline: ['Thoughtful code.', 'Real-world impact.'],
  lead: 'I’m Aaron Shasankar Bishwakarma. I build web applications and APIs, and keep learning along the way. Based in Lalitpur, Nepal.',
}
export const ABOUT_CONTENT = {
  headline: 'Always curious. Always building.',
  statement: 'I’m a software developer and a BCA student who enjoys connecting the pieces — from a clear interface to the API and database behind it.',
  extendedBio: 'Since starting my Bachelor of Computer Application in 2023, I’ve been exploring frontend, backend, and mobile development. I’m currently working at Top Tech Giants while continuing my studies.',
}
export const SKILL_GROUPS = [
  { id: 'frontend', title: 'Frontend', icon: 'code', description: 'Interfaces for the web.', items: ['JavaScript', 'HTML5', 'CSS', 'SCSS', 'React', 'Vite', 'Tailwind CSS', 'TanStack Query'] },
  { id: 'backend', title: 'Backend & APIs', icon: 'server', description: 'The logic behind the experience.', items: ['Python', 'Django', 'PHP', 'REST APIs', 'WebSocket'] },
  { id: 'databases', title: 'Databases', icon: 'database', description: 'Structured and flexible data.', items: ['PostgreSQL', 'MySQL', 'MongoDB'] },
  { id: 'tools', title: 'Tools & testing', icon: 'terminal', description: 'A dependable development workflow.', items: ['Git', 'GitHub', 'Docker', 'Docker Compose', 'Swagger', 'Postman', 'Jest', 'Vitest', 'React Testing Library'] },
  { id: 'platforms', title: 'Mobile & platforms', icon: 'layers', description: 'Exploring beyond the browser.', items: ['React Native', 'MERN Stack', 'WordPress'] },
  { id: 'foundations', title: 'Foundations', icon: 'book', description: 'Languages and frameworks I’m learning.', items: ['.NET (basic)', 'Java (basic)', 'C# (basic)'] },
]
export const SKILLS_LIST = SKILL_GROUPS.flatMap(group => group.items)
export const CONTACT_CONTENT = {
  headline: 'Have something in mind?', subhead: 'A project, a question, or just a hello — I’d be happy to hear from you.',
  email: PERSONA.email, locationName: PERSONA.location, officeTimezone: PERSONA.timezone,
  socials: [{ name: 'GitHub', href: PERSONA.github }],
}
