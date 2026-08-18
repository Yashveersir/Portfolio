'use client';

import { useState, useEffect } from 'react';
import { skillCategories, certifications as DEFAULT_CERTS, experiences as DEFAULT_EXPS, socialLinks as DEFAULT_SOCIAL } from '@/lib/constants';

const DEFAULT_PROJECTS = [
  {
    title: 'Example Project',
    slug: 'example-project',
    description: 'A brief description of the project.',
    tech: ['React', 'Node.js'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: '/project.png',
    caseStudy: {
      overview: 'Detailed overview of the project goals.',
      architecture: 'System architecture details.',
      challenges: 'Challenges faced during development.',
      solutions: 'How those challenges were overcome.'
    }
  }
];

const DEFAULT_STATS = [
  { value: '8.6', label: 'CGPA', color: 'var(--cyan)' },
  { value: '7+', label: 'Projects Completed', color: 'var(--amber)' },
  { value: '10+', label: 'Hackathons Participated', color: 'var(--violet)' },
  { value: '13+', label: 'Certifications Earned', color: 'var(--purple-500)' },
];

const DEFAULT_TERMINAL = {
  name: "Yashveer Singh",
  role: "Full-Stack & Generative AI Developer",
  location: "Delhi NCR, India",
  email: "yashveersingh2003@gmail.com",
  stack: ["MongoDB", "Express", "React", "Node.js", "Next.js", "Python"],
  openToWork: true
};

const DEFAULT_METRICS = [
  { value: '100K+', label: 'Lines of Code', sub: 'Mostly bugs, but they look pretty.', color: 'var(--cyan)' },
  { value: '500+', label: 'Cups of Coffee', sub: 'The true fuel of development.', color: 'var(--amber)' },
  { value: '50+', label: 'Bugs Fixed', sub: '...and probably 100+ created.', color: 'var(--violet)' },
  { value: '13+', label: 'Certifications', sub: 'Because learning never stops.', color: 'var(--purple-500)' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [skillsText, setSkillsText] = useState('');
  const [projectsText, setProjectsText] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [experiencesText, setExperiencesText] = useState('');
  const [aboutStatsText, setAboutStatsText] = useState('');
  const [aboutTerminalText, setAboutTerminalText] = useState('');
  const [numbersText, setNumbersText] = useState('');
  const [socialLinksText, setSocialLinksText] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

  useEffect(() => {
    // We no longer rely on localStorage, but we can verify session implicitly by seeing if PUT works later, 
    // or just fetch data normally (data fetch is public).
    fetchPortfolioData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use Next.js API route proxy for secure HttpOnly cookie
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken('secure-cookie-set');
        fetchPortfolioData();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/portfolio`);
      const data = await res.json();
      setPortfolioData(data);
      setPortfolioData(data);
      setSkillsText(JSON.stringify(data.skills?.length ? data.skills : skillCategories, null, 2));
      setProjectsText(JSON.stringify(data.projects?.length ? data.projects : DEFAULT_PROJECTS, null, 2));
      setCertificationsText(JSON.stringify(data.certifications?.length ? data.certifications : DEFAULT_CERTS, null, 2));
      setExperiencesText(JSON.stringify(data.experiences?.length ? data.experiences : DEFAULT_EXPS, null, 2));
      
      setAboutStatsText(JSON.stringify(data.aboutStats?.length ? data.aboutStats : DEFAULT_STATS, null, 2));
      setAboutTerminalText(JSON.stringify(data.aboutTerminal?.name ? data.aboutTerminal : DEFAULT_TERMINAL, null, 2));
      setNumbersText(JSON.stringify(data.numbers?.length ? data.numbers : DEFAULT_METRICS, null, 2));
      setSocialLinksText(JSON.stringify(data.socialLinks?.email ? data.socialLinks : DEFAULT_SOCIAL, null, 2));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg('');
    try {
      // Use proxy for saving
      const res = await fetch('/api/admin/proxy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Portfolio updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'Error saving');
      }
    } catch (err) {
      alert('Network error saving data');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white">
        <form onSubmit={handleLogin} className="p-8 bg-[#151c2c] border border-[#1e293b] rounded-xl shadow-2xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">Admin Login</h1>
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#0b0f19] border border-[#1e293b] rounded mb-6 text-white outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-cyan-500 hover:bg-cyan-600 rounded text-black font-bold transition-colors"
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  if (!portfolioData) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0f19]">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#1e293b]">
          <h1 className="text-3xl font-bold text-cyan-400">Portfolio Dashboard</h1>
          <div className="flex items-center gap-4">
            {successMsg && <span className="text-green-400 font-bold">{successMsg}</span>}
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded font-bold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => { setToken(null); localStorage.removeItem('adminToken'); }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global Theme Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Global Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Primary Color (Hex)</label>
              <input 
                type="text" 
                value={portfolioData.theme?.primaryColor || '#22d3ee'} 
                onChange={(e) => setPortfolioData({...portfolioData, theme: { ...portfolioData.theme, primaryColor: e.target.value }})}
                className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
                placeholder="#22d3ee"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Secondary Color (Hex)</label>
              <input 
                type="text" 
                value={portfolioData.theme?.secondaryColor || '#a855f7'} 
                onChange={(e) => setPortfolioData({...portfolioData, theme: { ...portfolioData.theme, secondaryColor: e.target.value }})}
                className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
                placeholder="#a855f7"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Hero Section</h2>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Headline 1</label>
            <input 
              type="text" 
              value={portfolioData.heroHeadline1 || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, heroHeadline1: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Headline 2</label>
            <input 
              type="text" 
              value={portfolioData.heroHeadline2 || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, heroHeadline2: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Headline 3</label>
            <input 
              type="text" 
              value={portfolioData.heroHeadline3 || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, heroHeadline3: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Hero Image URL</label>
            <input 
              type="text" 
              value={portfolioData.heroImage || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, heroImage: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Resume Link (URL or /api/resume)</label>
            <input 
              type="text" 
              value={portfolioData.resumeUrl || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, resumeUrl: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white"
            />
          </div>
        </div>

        {/* About Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">About Section</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea 
              value={portfolioData.aboutBio || ''} 
              onChange={(e) => setPortfolioData({...portfolioData, aboutBio: e.target.value})}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-32"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Stats Array (JSON)</label>
            <textarea 
              value={aboutStatsText} 
              onChange={(e) => setAboutStatsText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, aboutStats: parsed});
                } catch(err) {
                  alert("Invalid JSON in About Stats!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-40 font-mono text-xs"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Terminal Data (JSON Object)</label>
            <textarea 
              value={aboutTerminalText} 
              onChange={(e) => setAboutTerminalText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, aboutTerminal: parsed});
                } catch(err) {
                  alert("Invalid JSON in Terminal Data!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-48 font-mono text-xs"
            />
          </div>
        </div>
        
        {/* By The Numbers Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">By The Numbers (Advanced Editor)</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Metrics Array (JSON)</label>
            <textarea 
              value={numbersText} 
              onChange={(e) => setNumbersText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, numbers: parsed});
                } catch(err) {
                  alert("Invalid JSON in By The Numbers!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-xs"
            />
          </div>
        </div>

        {/* Contact/Social Links Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Social Links (Advanced Editor)</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Social Links Array (JSON)</label>
            <textarea 
              value={socialLinksText} 
              onChange={(e) => setSocialLinksText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, socialLinks: parsed});
                } catch(err) {
                  alert("Invalid JSON in Social Links!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-xs"
            />
          </div>
        </div>

        {/* Skills Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Skills (Advanced Editor)</h2>
          <p className="text-sm text-gray-400 mb-2">Since skills contain nested categories and icons, you can edit them directly as JSON here. Ensure the syntax is valid JSON.</p>
          <div className="mb-4">
            <textarea 
              value={skillsText} 
              onChange={(e) => setSkillsText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, skills: parsed});
                } catch(err) {
                  alert("Invalid JSON in Skills!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-sm"
              placeholder="Enter valid JSON array for skills..."
            />
          </div>
        </div>

        {/* Projects Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Projects (Advanced Editor)</h2>
          <p className="text-sm text-gray-400 mb-2">Edit your projects array as JSON.</p>
          <div className="mb-4">
            <textarea 
              value={projectsText} 
              onChange={(e) => setProjectsText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, projects: parsed});
                } catch(err) {
                  alert("Invalid JSON in Projects!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-sm"
              placeholder="Enter valid JSON array for projects..."
            />
          </div>
        </div>

        {/* Certifications Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Certifications (Advanced Editor)</h2>
          <p className="text-sm text-gray-400 mb-2">Edit your certifications array as JSON.</p>
          <div className="mb-4">
            <textarea 
              value={certificationsText} 
              onChange={(e) => setCertificationsText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, certifications: parsed});
                } catch(err) {
                  alert("Invalid JSON in Certifications!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-sm"
              placeholder="Enter valid JSON array for certifications..."
            />
          </div>
        </div>

        {/* Experiences Section Edit */}
        <div className="bg-[#151c2c] p-6 rounded-xl border border-[#1e293b] mb-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-[#1e293b] pb-2">Experience (Advanced Editor)</h2>
          <p className="text-sm text-gray-400 mb-2">Edit your experiences array as JSON.</p>
          <div className="mb-4">
            <textarea 
              value={experiencesText} 
              onChange={(e) => setExperiencesText(e.target.value)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setPortfolioData({...portfolioData, experiences: parsed});
                } catch(err) {
                  alert("Invalid JSON in Experiences!");
                }
              }}
              className="w-full p-2 bg-[#0b0f19] border border-[#1e293b] rounded text-white h-64 font-mono text-sm"
              placeholder="Enter valid JSON array for experiences..."
            />
          </div>
        </div>

      </div>
    </div>
  );
}
