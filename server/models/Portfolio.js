const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  // Theme Customization
  theme: {
    primaryColor: { type: String, default: '#22d3ee' },
    secondaryColor: { type: String, default: '#a855f7' }
  },

  // Hero Section
  heroRoles: { type: [String], default: ['Full-Stack Developer', 'Generative AI Enthusiast'] },
  heroHeadline1: { type: String, default: 'I Build' },
  heroHeadline2: { type: String, default: 'Things' },
  heroHeadline3: { type: String, default: 'That Live Online.' },
  heroImage: { type: String, default: '/myImage.jpeg' },
  resumeUrl: { type: String, default: '/api/resume' },

  // About Section
  aboutBio: { type: String },
  aboutStats: [{
    value: String,
    label: String,
    color: String
  }],
  aboutTerminal: {
    name: String,
    role: String,
    location: String,
    email: String,
    stack: [String],
    openToWork: Boolean
  },

  // By The Numbers / Fun Metrics
  numbers: [{
    value: String,
    label: String,
    sub: String,
    color: String
  }],

  // Projects
  projects: [{
    title: String,
    subtitle: String,
    slug: String,
    role: String,
    outcome: String,
    description: String,
    descriptionBullets: [String],
    tags: [String],
    tech: [String],
    features: [String],
    github: String,
    demo: String,
    live: String,
    image: String,
    images: [String],
    color: String,
    featured: Boolean,
    caseStudy: {
      overview: String,
      architecture: String,
      challenges: String,
      solutions: String
    }
  }],

  // Skills
  skills: [{
    title: String,
    color: String,
    skills: [{
      name: String,
      icon: String,
      image: String
    }]
  }],

  // Experience & Responsibilities
  experiences: [{
    title: String,
    organization: String,
    description: String,
    achievements: [String],
    icon: String,
    date: String,
    color: String,
    certificate: String
  }],

  // Certifications
  certifications: [{
    title: String,
    issuer: String,
    icon: String,
    color: String,
    pdf: String,
    date: String,
    link: String
  }],

  // Social Links
  socialLinks: {
    email: String,
    github: String,
    linkedin: String,
    twitter: String,
    discord: String,
    phone: String
  }

}, { timestamps: true, strict: false }); 
// strict: false allows any additional fields without crashing

module.exports = mongoose.model('Portfolio', portfolioSchema);
