import {
  FaNodeJs, FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaGitAlt, FaGithub,
} from 'react-icons/fa';
import {
  SiExpress, SiMongodb, SiPostman, SiJsonwebtokens, SiCplusplus, SiRender,
} from 'react-icons/si';

/* ========== NAV LINKS ========== */
export const navLinks = [
  { id: 'about', title: 'About' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'experience', title: 'Experience' },
  { id: 'contact', title: 'Contact' },
];

/* ========== HERO TYPING LINES ========== */
export const typingLines = [
  'I build scalable web applications',
  'I design secure backend systems',
  'I integrate AI into modern web apps',
];

/* ========== ABOUT ========== */
export const aboutText =
  'Computer Science Engineering student with 8.6 CGPA, specializing in MERN stack and Generative AI. Experienced in building secure REST APIs, scalable applications, and integrating AI into modern web architecture.';

/* ========== SKILLS ========== */
export const skillCategories = [
  {
    title: 'Backend',
    color: '#22d3ee',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
      { name: 'Express.js', icon: SiExpress, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg' },
      { name: 'REST APIs', icon: null, image: null },
      { name: 'JWT Auth', icon: SiJsonwebtokens, image: 'https://picperf.io/https://jwt.io/img/pic_logo.svg' },
      { name: 'OTP Auth', icon: null, image: null },
    ],
  },
  {
    title: 'Frontend',
    color: '#818cf8',
    skills: [
      { name: 'React.js', icon: FaReact, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'HTML5', icon: FaHtml5, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: FaCss3Alt, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      { name: 'JavaScript', icon: FaJsSquare, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'SPA Dev', icon: null, image: null },
    ],
  },
  {
    title: 'Programming',
    color: '#a855f7',
    skills: [
      { name: 'C', icon: null, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
      { name: 'C++', icon: SiCplusplus, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
      { name: 'DSA', icon: null, image: null },
    ],
  },
  {
    title: 'Tools',
    color: '#ec4899',
    skills: [
      { name: 'Git', icon: FaGitAlt, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'GitHub', icon: FaGithub, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
      { name: 'Postman', icon: SiPostman, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
      { name: 'MongoDB Atlas', icon: SiMongodb, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
      { name: 'Render', icon: SiRender, image: null },
    ],
  },
];

/* ========== PROJECTS ========== */
export const projects = [
  {
    title: 'Green Valley Poultry Farm',
    subtitle: 'Full-Stack E-Commerce Platform',
    description:
      'A complete e-commerce system with OTP-based authentication, real-time inventory management, and event-driven notification engine. Built with Node.js, Express, MongoDB, and vanilla JavaScript.',
    tags: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST API'],
    features: [
      'OTP-based authentication system',
      'Real-time inventory management',
      'Event-based notification engine',
      'Admin dashboard with analytics',
    ],
    github: 'https://github.com/Yashveersir/green-valley-farm',
    demo: 'https://www.green-valley-farm.online/',
    featured: true,
    color: '#22d3ee',
    images: [
      '/project-images/green-valley-home.png',
    ]
  },
  {
    title: 'TaskFlow',
    subtitle: 'Real-Time Multi-Team Task Manager',
    description:
      'A production-ready task management system with multi-tenant workspace architecture, real-time Kanban board, and WebSocket-powered collaboration. Built during internship at Vaidsys Technologies.',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    features: [
      'Multi-team workspace system with invite codes',
      'Real-time Kanban board with drag & drop',
      'Dashboard with priority-based analytics',
      'JWT authentication & data isolation',
    ],
    github: 'https://github.com/Yashveersir/Task-Manager',
    demo: 'https://task-manager-theta-ten-91.vercel.app/',
    featured: true,
    color: '#a855f7',
    images: [
      '/project-images/taskflow-dashboard.png',
    ]
  },
  {
    title: 'Ledger System',
    subtitle: 'Secure Financial REST API',
    description:
      'Secure transaction REST API with JWT authentication, bcrypt password hashing, fund transfer system, and automated email notifications for every transaction.',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt'],
    features: [
      'JWT authentication + bcrypt',
      'Fund transfer system',
      'Email notifications',
      'Transaction history',
    ],
    github: 'https://github.com/Yashveersir/Backend-Ledger',
    demo: 'https://backend-ledger-8to4.onrender.com/',
    featured: true,
    color: '#818cf8',
    images: [
      '/project-images/ledger-service.png',
    ]
  },
];

/* ========== CERTIFICATIONS ========== */
export const certifications = [
  {
    title: 'Getting Started with Cybersecurity',
    issuer: 'IBM SkillsBuild',
    icon: '🛡️',
    color: '#22d3ee',
    pdf: '/Certificates/IBMDesign20260412-32-7ulru8.pdf',
  },
  {
    title: 'Introduction to Generative AI Studio',
    issuer: 'Google Cloud',
    icon: '✨',
    color: '#a855f7',
    pdf: '/Certificates/Introduction to Generative AI Studio.pdf',
  },
  {
    title: 'Machine Learning Using Python',
    issuer: 'Certified Course',
    icon: '📊',
    color: '#ec4899',
    pdf: '/Certificates/Machine Learning Using Python.pdf',
  },
  {
    title: 'Web Development',
    issuer: 'Certified Course',
    icon: '🌐',
    color: '#818cf8',
    pdf: '/Certificates/Web Development.pdf',
  },
  {
    title: 'Building with Anthropic Claude API',
    issuer: 'Anthropic',
    icon: '🤖',
    color: '#6366f1',
    pdf: '/Certificates/certificate-znoyvs2n5q2r-1775826374.pdf',
  },
  {
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    icon: '🧠',
    color: '#8b5cf6',
    pdf: '/Certificates/certificate-c68gypmwnzzt-1775841599.pdf',
  },
  {
    title: 'Model Context Protocol: Advanced Topics',
    issuer: 'Anthropic',
    icon: '🔗',
    color: '#06b6d4',
    pdf: '/Certificates/certificate-bokp7k3o2iyj-1775908001.pdf',
  },
  {
    title: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic',
    icon: '⚙️',
    color: '#818cf8',
    pdf: '/Certificates/certificate-yosa54h7rs8j-1775907608.pdf',
  },
  {
    title: 'Introduction to Claude Cowork',
    issuer: 'Anthropic',
    icon: '🤝',
    color: '#a855f7',
    pdf: '/Certificates/certificate-63yr7aeyor49-1775828172.pdf',
  },
  {
    title: 'Introduction to Subagents',
    issuer: 'Anthropic',
    icon: '🔀',
    color: '#6366f1',
    pdf: '/Certificates/certificate-zp2ipvowitrq-1775908588.pdf',
  },
  {
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic',
    icon: '🎯',
    color: '#ec4899',
    pdf: '/Certificates/certificate-tj5bskd2nxy5-1775908530.pdf',
  },
  {
    title: 'Introduction to Computer Use',
    issuer: 'Anthropic',
    icon: '🖥️',
    color: '#8b5cf6',
    pdf: '/Certificates/certificate-znzvj3m672fp-1775841173.pdf',
  },
  {
    title: 'AI Fluency for Students',
    issuer: 'Anthropic',
    icon: '🎓',
    color: '#06b6d4',
    pdf: '/Certificates/certificate-9ktqp6zwn5xo-1775908457.pdf',
  },
];

/* ========== EXPERIENCE / RESPONSIBILITY ========== */
export const experiences = [
  {
    title: 'Full-Stack Development Intern',
    organization: 'Vaidsys Technologies',
    description:
      'Building TaskFlow — a real-time multi-team task management system with WebSocket-powered Kanban board, multi-tenant workspace architecture, and JWT authentication. Deployed on Vercel + Render.',
    icon: '💼',
    date: 'Apr 2026 – May 2026',
    color: '#6366f1',
  },
  {
    title: 'Software Engineer Intern',
    organization: 'YugaYatra Retail (OPC) Pvt. Ltd.',
    description:
      'Working on web development using Cursor AI, Firebase Studio, and AI technologies. Developing websites/apps, freelancing projects, and collaborating with teams using Google Workspace.',
    icon: '🚀',
    date: 'Apr 2026 – Jun 2026',
    color: '#8b5cf6',
  },
  {
    title: 'Peer Mentor',
    organization: 'CodeBird Coding Club',
    description:
      'Guided fellow students in competitive programming, data structures, and algorithm design. Conducted workshops and mentoring sessions.',
    icon: '👨‍💻',
    date: 'Ongoing',
    color: '#06b6d4',
  },
  {
    title: 'NSS Volunteer',
    organization: 'National Service Scheme',
    description:
      'Participated in community service initiatives, social awareness campaigns, and rural development programs.',
    icon: '🤝',
    date: 'Ongoing',
    color: '#ec4899',
  },
];

/* ========== SOCIAL LINKS ========== */
export const socialLinks = {
  github: 'https://github.com/Yashveersir',
  linkedin: 'https://www.linkedin.com/in/yashveer-singh-41bb36280',
  email: 'singhyash9631@gmail.com',
  phone: '+91 8873394750',
};
