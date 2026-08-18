const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  // Theme Customization
  theme: {
    primaryColor: { type: String, default: '#22d3ee' },   // cyan
    secondaryColor: { type: String, default: '#a855f7' } // purple
  },

  // Hero Section
  heroRoles: { type: [String], default: ['Full-Stack Developer', 'Generative AI Enthusiast'] },
  heroHeadline1: { type: String, default: 'I Build' },
  heroHeadline2: { type: String, default: 'Things' },
  heroHeadline3: { type: String, default: 'That Live Online.' },
  heroImage: { type: String, default: '/myImage.jpeg' },
  resumeUrl: { type: String, default: '/api/resume' },
  
  // About Section
  aboutBio: { type: String, default: 'I am a Software Engineer and Designer dedicated to crafting high-performance web experiences. My work merges technical precision with minimalist aesthetics, specializing in full-stack systems and Generative AI integration.' },
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

  // By The Numbers
  numbers: [{
    value: String,
    label: String
  }],

  // Projects
  projects: [{
    title: String,
    slug: String,
    description: String,
    tech: [String],
    github: String,
    live: String,
    image: String,
    caseStudy: {
      overview: String,
      architecture: String,
      challenges: String,
      solutions: String
    },
    featured: Boolean
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

  // Experience / Certifications
  experience: [{
    title: String,
    company: String,
    date: String,
    description: String
  }],
  
  certifications: [{
    title: String,
    issuer: String,
    date: String,
    link: String
  }],
  
  socialLinks: {
    email: String,
    github: String,
    linkedin: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
