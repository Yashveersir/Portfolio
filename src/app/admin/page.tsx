'use client';

import { useState, useEffect, useRef } from 'react';
import { skillCategories, certifications as DEFAULT_CERTS, experiences as DEFAULT_EXPS, socialLinks as DEFAULT_SOCIAL } from '@/lib/constants';
import { Palette, Image as ImageIcon, User, Briefcase, FileText, LogOut, Save, Upload } from 'lucide-react';
import Image from 'next/image';

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
  
  const [activeTab, setActiveTab] = useState('theme');

  const [skillsText, setSkillsText] = useState('');
  const [projectsText, setProjectsText] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [experiencesText, setExperiencesText] = useState('');
  const [aboutStatsText, setAboutStatsText] = useState('');
  const [aboutTerminalText, setAboutTerminalText] = useState('');
  const [numbersText, setNumbersText] = useState('');
  const [socialLinksText, setSocialLinksText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPortfolioData({ ...portfolioData, heroImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050f] text-white">
        <form onSubmit={handleLogin} className="p-8 bg-[#0a0a14] border border-cyan-900/50 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-2 border-cyan-500 flex items-center justify-center rounded-xl bg-cyan-500/10">
              <LogOut className="text-cyan-400 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center text-white">System Access</h1>
          {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
          <input
            type="password"
            placeholder="Enter Admin Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl mb-6 text-white outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-black font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  if (!portfolioData) {
    return <div className="min-h-screen flex items-center justify-center text-cyan-400 bg-[#05050f] font-mono">Initializing dashboard...</div>;
  }

  const tabs = [
    { id: 'theme', icon: <Palette size={18} />, label: 'Theme' },
    { id: 'hero', icon: <ImageIcon size={18} />, label: 'Hero' },
    { id: 'about', icon: <User size={18} />, label: 'About' },
    { id: 'projects', icon: <Briefcase size={18} />, label: 'Data & Projects' },
    { id: 'contact', icon: <FileText size={18} />, label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#05050f] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a14] border-b md:border-b-0 md:border-r border-cyan-900/30 flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Admin Panel
          </h1>
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          <button
            onClick={() => { setToken(null); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-bold transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-cyan-900/30 bg-[#0a0a14]/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-medium text-gray-200 capitalize">Editing: {activeTab}</h2>
          <div className="flex items-center gap-4">
            {successMsg && <span className="text-green-400 font-bold text-sm animate-pulse">{successMsg}</span>}
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* THEME TAB */}
            {activeTab === 'theme' && (
              <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                <h3 className="text-xl font-bold mb-6 text-white">Global Theme Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primary Color (Hex)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-600 shrink-0 shadow-lg" style={{ backgroundColor: portfolioData.theme?.primaryColor || '#22d3ee' }} />
                      <input 
                        type="text" 
                        value={portfolioData.theme?.primaryColor || '#22d3ee'} 
                        onChange={(e) => setPortfolioData({...portfolioData, theme: { ...portfolioData.theme, primaryColor: e.target.value }})}
                        className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400"
                        placeholder="#22d3ee"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Secondary Color (Hex)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-600 shrink-0 shadow-lg" style={{ backgroundColor: portfolioData.theme?.secondaryColor || '#a855f7' }} />
                      <input 
                        type="text" 
                        value={portfolioData.theme?.secondaryColor || '#a855f7'} 
                        onChange={(e) => setPortfolioData({...portfolioData, theme: { ...portfolioData.theme, secondaryColor: e.target.value }})}
                        className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400"
                        placeholder="#a855f7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hero Profile Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#05050f] border border-cyan-900/50 rounded-xl">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/30 shrink-0 bg-[#0a0a14]">
                      {portfolioData.heroImage ? (
                        <Image src={portfolioData.heroImage} alt="Profile" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={40} /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-2"
                      >
                        <Upload size={18} /> Upload New Image
                      </button>
                      <p className="text-xs text-gray-500">Max size 2MB. Image will be compressed into a database-friendly Base64 string automatically.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Headline 1</label>
                    <input type="text" value={portfolioData.heroHeadline1 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline1: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Headline 2 (Gradient)</label>
                    <input type="text" value={portfolioData.heroHeadline2 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline2: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Headline 3</label>
                    <input type="text" value={portfolioData.heroHeadline3 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline3: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30 space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea 
                    value={portfolioData.aboutBio || ''} 
                    onChange={(e) => setPortfolioData({...portfolioData, aboutBio: e.target.value})}
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400 h-32 leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex justify-between">
                    <span>Stats Array (JSON)</span>
                    <span className="text-xs text-cyan-500">Must be valid JSON</span>
                  </label>
                  <textarea 
                    value={aboutStatsText} 
                    onChange={(e) => setAboutStatsText(e.target.value)}
                    onBlur={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setPortfolioData({...portfolioData, aboutStats: parsed});
                      } catch(err) {
                        alert("Invalid JSON format in About Stats!");
                      }
                    }}
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-cyan-200 outline-none focus:border-cyan-400 h-48 font-mono text-xs whitespace-pre"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Terminal Info (JSON)</label>
                  <textarea 
                    value={aboutTerminalText} 
                    onChange={(e) => setAboutTerminalText(e.target.value)}
                    onBlur={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setPortfolioData({...portfolioData, aboutTerminal: parsed});
                      } catch(err) {
                        alert("Invalid JSON format in Terminal Info!");
                      }
                    }}
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-cyan-200 outline-none focus:border-cyan-400 h-48 font-mono text-xs whitespace-pre"
                  />
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200 text-sm">
                  <strong>Warning:</strong> Be very careful when editing JSON directly. Ensure quotes and brackets are properly closed.
                </div>
                
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <label className="block text-sm text-gray-400 mb-4 font-bold">Projects Array (JSON)</label>
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
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-cyan-200 outline-none focus:border-cyan-400 h-96 font-mono text-xs whitespace-pre"
                  />
                </div>

                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <label className="block text-sm text-gray-400 mb-4 font-bold">Skills Array (JSON)</label>
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
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-cyan-200 outline-none focus:border-cyan-400 h-96 font-mono text-xs whitespace-pre"
                  />
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30 space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Resume Link (URL)</label>
                  <input 
                    type="text" 
                    value={portfolioData.resumeUrl || ''} 
                    onChange={(e) => setPortfolioData({...portfolioData, resumeUrl: e.target.value})}
                    placeholder="e.g. /api/resume or https://docs.google.com/..."
                    className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter a URL to a PDF file, Google Drive link, or keep it as /api/resume if serving locally.</p>
                </div>
                
                <div className="mt-8">
                  <label className="block text-sm text-gray-400 mb-2">Social Links (JSON)</label>
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
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-cyan-200 outline-none focus:border-cyan-400 h-48 font-mono text-xs whitespace-pre"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
