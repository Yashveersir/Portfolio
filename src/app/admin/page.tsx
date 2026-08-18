'use client';

import { useState, useEffect, useRef } from 'react';
import { skillCategories, certifications as DEFAULT_CERTS, experiences as DEFAULT_EXPS, socialLinks as DEFAULT_SOCIAL } from '@/lib/constants';
import { Palette, Image as ImageIcon, User, Briefcase, FileText, LogOut, Save, Upload, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_PROJECTS: any[] = [];
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

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('theme');
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);

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
      
      // Ensure defaults if missing
      if (!data.aboutStats || !data.aboutStats.length) data.aboutStats = DEFAULT_STATS;
      if (!data.aboutTerminal || !data.aboutTerminal.name) data.aboutTerminal = DEFAULT_TERMINAL;
      if (!data.projects) data.projects = DEFAULT_PROJECTS;
      if (!data.skills) data.skills = skillCategories;
      if (!data.socialLinks) data.socialLinks = DEFAULT_SOCIAL;

      setPortfolioData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSave = async () => {
    if (!window.confirm("Are you sure you want to save these changes to the live database?")) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/proxy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>, projIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const newProjects = [...portfolioData.projects];
      newProjects[projIndex].images = [reader.result];
      setPortfolioData({ ...portfolioData, projects: newProjects });
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
    { id: 'about', icon: <User size={18} />, label: 'About & Terminal' },
    { id: 'projects', icon: <Briefcase size={18} />, label: 'Projects & Skills' },
    { id: 'contact', icon: <FileText size={18} />, label: 'Socials & Resume' },
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

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
            
            {/* THEME */}
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HERO */}
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
                      <p className="text-xs text-gray-500">Max size 2MB. Converts automatically to a database-friendly Base64 string.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Headline 1</label>
                    <input type="text" value={portfolioData.heroHeadline1 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline1: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Headline 2 (Gradient text)</label>
                    <input type="text" value={portfolioData.heroHeadline2 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline2: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Headline 3</label>
                    <input type="text" value={portfolioData.heroHeadline3 || ''} onChange={(e) => setPortfolioData({...portfolioData, heroHeadline3: e.target.value})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <h3 className="text-xl font-bold mb-6 text-white border-b border-cyan-900/30 pb-4">Personal Bio</h3>
                  <textarea 
                    value={portfolioData.aboutBio || ''} 
                    onChange={(e) => setPortfolioData({...portfolioData, aboutBio: e.target.value})}
                    className="w-full p-4 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400 h-32 leading-relaxed"
                  />
                </div>

                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <div className="flex justify-between items-center mb-6 border-b border-cyan-900/30 pb-4">
                    <h3 className="text-xl font-bold text-white">About Stats (e.g., CGPA, Projects)</h3>
                    <button 
                      onClick={() => setPortfolioData({...portfolioData, aboutStats: [...(portfolioData.aboutStats||[]), { value: '', label: '', color: 'var(--cyan)' }]})}
                      className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30 text-sm"
                    >
                      <Plus size={16} /> Add Stat
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {portfolioData.aboutStats?.map((stat: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center bg-[#05050f] p-4 rounded-xl border border-cyan-900/50">
                        <input placeholder="Value (e.g. 8.6)" value={stat.value} onChange={(e) => {
                          const newStats = [...portfolioData.aboutStats];
                          newStats[idx].value = e.target.value;
                          setPortfolioData({...portfolioData, aboutStats: newStats});
                        }} className="w-1/4 p-2 bg-transparent border-b border-gray-700 text-white outline-none focus:border-cyan-400" />
                        <input placeholder="Label (e.g. CGPA)" value={stat.label} onChange={(e) => {
                          const newStats = [...portfolioData.aboutStats];
                          newStats[idx].label = e.target.value;
                          setPortfolioData({...portfolioData, aboutStats: newStats});
                        }} className="w-2/4 p-2 bg-transparent border-b border-gray-700 text-white outline-none focus:border-cyan-400" />
                        <input placeholder="Color Variable" value={stat.color} onChange={(e) => {
                          const newStats = [...portfolioData.aboutStats];
                          newStats[idx].color = e.target.value;
                          setPortfolioData({...portfolioData, aboutStats: newStats});
                        }} className="w-1/4 p-2 bg-transparent border-b border-gray-700 text-white outline-none focus:border-cyan-400 text-xs" />
                        <button onClick={() => {
                          const newStats = [...portfolioData.aboutStats];
                          newStats.splice(idx, 1);
                          setPortfolioData({...portfolioData, aboutStats: newStats});
                        }} className="text-red-500 hover:text-red-400"><Trash2 size={20} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <h3 className="text-xl font-bold mb-6 text-white border-b border-cyan-900/30 pb-4">Terminal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name</label>
                      <input value={portfolioData.aboutTerminal?.name || ''} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, name: e.target.value}})} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Role</label>
                      <input value={portfolioData.aboutTerminal?.role || ''} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, role: e.target.value}})} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Location</label>
                      <input value={portfolioData.aboutTerminal?.location || ''} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, location: e.target.value}})} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input value={portfolioData.aboutTerminal?.email || ''} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, email: e.target.value}})} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Tech Stack (comma-separated)</label>
                      <input value={portfolioData.aboutTerminal?.stack?.join(', ') || ''} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, stack: e.target.value.split(',').map(s=>s.trim())}})} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <input type="checkbox" checked={portfolioData.aboutTerminal?.openToWork || false} onChange={(e) => setPortfolioData({...portfolioData, aboutTerminal: {...portfolioData.aboutTerminal, openToWork: e.target.checked}})} className="w-5 h-5 accent-cyan-500" />
                      <label className="text-gray-300">Open to Work</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS & SKILLS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                
                {/* SKILLS */}
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <div className="flex justify-between items-center mb-6 border-b border-cyan-900/30 pb-4">
                    <h3 className="text-xl font-bold text-white">Skill Categories</h3>
                    <button 
                      onClick={() => setPortfolioData({...portfolioData, skills: [...(portfolioData.skills||[]), { category: 'New Category', items: [] }]})}
                      className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30 text-sm"
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>
                  <div className="space-y-4">
                    {portfolioData.skills?.map((skill: any, idx: number) => (
                      <div key={idx} className="bg-[#05050f] p-4 rounded-xl border border-cyan-900/50 relative">
                        <button onClick={() => {
                          const newSkills = [...portfolioData.skills];
                          newSkills.splice(idx, 1);
                          setPortfolioData({...portfolioData, skills: newSkills});
                        }} className="absolute top-4 right-4 text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                        
                        <div className="mb-3 w-5/6">
                          <label className="block text-xs text-gray-500 mb-1 uppercase">Category Name</label>
                          <input value={skill.category} onChange={(e) => {
                            const newSkills = [...portfolioData.skills];
                            newSkills[idx].category = e.target.value;
                            setPortfolioData({...portfolioData, skills: newSkills});
                          }} className="w-full p-2 bg-transparent border-b border-gray-700 text-white outline-none focus:border-cyan-400 text-lg font-bold" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1 uppercase">Skills (comma-separated)</label>
                          <textarea value={skill.items?.join(', ')} onChange={(e) => {
                            const newSkills = [...portfolioData.skills];
                            newSkills[idx].items = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                            setPortfolioData({...portfolioData, skills: newSkills});
                          }} className="w-full p-2 bg-[#0a0a14] border border-cyan-900/30 rounded text-cyan-300 outline-none focus:border-cyan-400 h-16 font-mono text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROJECTS */}
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <div className="flex justify-between items-center mb-6 border-b border-cyan-900/30 pb-4">
                    <h3 className="text-xl font-bold text-white">Projects & Case Studies</h3>
                    <button 
                      onClick={() => {
                        const newProject = { title: 'New Project', slug: 'new-project', caseStudy: {} };
                        setPortfolioData({...portfolioData, projects: [...(portfolioData.projects||[]), newProject]});
                        setExpandedProjectIndex((portfolioData.projects?.length || 0));
                      }}
                      className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500/30 text-sm"
                    >
                      <Plus size={16} /> Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {portfolioData.projects?.map((proj: any, idx: number) => {
                      const isExpanded = expandedProjectIndex === idx;
                      return (
                        <div key={idx} className="bg-[#05050f] border border-cyan-900/50 rounded-xl overflow-hidden">
                          {/* Header */}
                          <div 
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-cyan-900/10 transition-colors"
                            onClick={() => setExpandedProjectIndex(isExpanded ? null : idx)}
                          >
                            <h4 className="font-bold text-lg text-white">{proj.title || 'Untitled Project'}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500 font-mono">{proj.slug}</span>
                              {isExpanded ? <ChevronUp size={20} className="text-cyan-400" /> : <ChevronDown size={20} className="text-gray-500" />}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="p-6 border-t border-cyan-900/50 bg-[#070712]">
                               <div className="flex justify-end mb-4">
                                <button onClick={() => {
                                  const newProjects = [...portfolioData.projects];
                                  newProjects.splice(idx, 1);
                                  setPortfolioData({...portfolioData, projects: newProjects});
                                }} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded">
                                  <Trash2 size={14} /> Delete Project
                                </button>
                               </div>

                               {/* Basic Info */}
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                                    <input value={proj.title || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].title = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" />
                                 </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">URL Slug</label>
                                    <input value={proj.slug || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].slug = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 font-mono" />
                                 </div>
                                 <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1">Subtitle / Short Description</label>
                                    <input value={proj.subtitle || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].subtitle = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" />
                                 </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Role</label>
                                    <input value={proj.role || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].role = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" placeholder="e.g. Lead Developer" />
                                 </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Outcome</label>
                                    <input value={proj.outcome || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].outcome = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" placeholder="e.g. Increased speed by 40%" />
                                 </div>
                               </div>

                               <div className="mb-6">
                                  <label className="block text-xs text-gray-500 mb-1">Project Image (Banner)</label>
                                  <div className="flex items-center gap-4">
                                    {proj.images?.[0] && (
                                      <div className="relative w-32 h-20 rounded overflow-hidden border border-gray-700 shrink-0">
                                        <Image src={proj.images[0]} alt="preview" fill className="object-cover" />
                                      </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(e, idx)} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20" />
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">GitHub Link</label>
                                    <input value={proj.github || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].github = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" />
                                 </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 mb-1">Live Demo Link</label>
                                    <input value={proj.demo || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].demo = e.target.value; setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" />
                                 </div>
                               </div>

                               <div className="mb-6">
                                  <label className="block text-xs text-gray-500 mb-1">Tags / Tech Stack (comma-separated)</label>
                                  <input value={proj.tags?.join(', ') || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].tags = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400" />
                               </div>
                               
                               <div className="mb-6">
                                  <label className="block text-xs text-gray-500 mb-1">Key Features (comma-separated or bullets)</label>
                                  <textarea value={proj.features?.join('\n') || ''} onChange={(e) => {
                                      const np = [...portfolioData.projects]; np[idx].features = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); setPortfolioData({...portfolioData, projects: np});
                                    }} className="w-full p-2 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 h-24" placeholder="Type each feature on a new line" />
                               </div>

                               {/* Case Study Sub-section */}
                               <div className="mt-8 pt-6 border-t border-gray-800">
                                 <h5 className="font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                   <FileText size={16} /> Case Study Details
                                 </h5>
                                 <div className="space-y-4">
                                   <div>
                                      <label className="block text-xs text-gray-500 mb-1">Overview</label>
                                      <textarea value={proj.caseStudy?.overview || ''} onChange={(e) => {
                                        const np = [...portfolioData.projects]; np[idx].caseStudy = {...np[idx].caseStudy, overview: e.target.value}; setPortfolioData({...portfolioData, projects: np});
                                      }} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 h-24" />
                                   </div>
                                   <div>
                                      <label className="block text-xs text-gray-500 mb-1">Architecture & Tech</label>
                                      <textarea value={proj.caseStudy?.architecture || ''} onChange={(e) => {
                                        const np = [...portfolioData.projects]; np[idx].caseStudy = {...np[idx].caseStudy, architecture: e.target.value}; setPortfolioData({...portfolioData, projects: np});
                                      }} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 h-24" />
                                   </div>
                                   <div>
                                      <label className="block text-xs text-gray-500 mb-1">Challenges</label>
                                      <textarea value={proj.caseStudy?.challenges || ''} onChange={(e) => {
                                        const np = [...portfolioData.projects]; np[idx].caseStudy = {...np[idx].caseStudy, challenges: e.target.value}; setPortfolioData({...portfolioData, projects: np});
                                      }} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 h-24" />
                                   </div>
                                   <div>
                                      <label className="block text-xs text-gray-500 mb-1">Solutions & Outcome</label>
                                      <textarea value={proj.caseStudy?.solutions || ''} onChange={(e) => {
                                        const np = [...portfolioData.projects]; np[idx].caseStudy = {...np[idx].caseStudy, solutions: e.target.value}; setPortfolioData({...portfolioData, projects: np});
                                      }} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded text-white outline-none focus:border-cyan-400 h-24" />
                                   </div>
                                 </div>
                               </div>
                               
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT & SOCIALS */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <h3 className="text-xl font-bold mb-6 text-white border-b border-cyan-900/30 pb-4">Resume Configuration</h3>
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
                </div>
                
                <div className="bg-[#0a0a14] p-8 rounded-2xl border border-cyan-900/30">
                  <h3 className="text-xl font-bold mb-6 text-white border-b border-cyan-900/30 pb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                      <input value={portfolioData.socialLinks?.email || ''} onChange={(e) => setPortfolioData({...portfolioData, socialLinks: {...portfolioData.socialLinks, email: e.target.value}})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                      <input value={portfolioData.socialLinks?.github || ''} onChange={(e) => setPortfolioData({...portfolioData, socialLinks: {...portfolioData.socialLinks, github: e.target.value}})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                      <input value={portfolioData.socialLinks?.linkedin || ''} onChange={(e) => setPortfolioData({...portfolioData, socialLinks: {...portfolioData.socialLinks, linkedin: e.target.value}})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Twitter URL</label>
                      <input value={portfolioData.socialLinks?.twitter || ''} onChange={(e) => setPortfolioData({...portfolioData, socialLinks: {...portfolioData.socialLinks, twitter: e.target.value}})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Discord/Other URL</label>
                      <input value={portfolioData.socialLinks?.discord || ''} onChange={(e) => setPortfolioData({...portfolioData, socialLinks: {...portfolioData.socialLinks, discord: e.target.value}})} className="w-full p-3 bg-[#05050f] border border-cyan-900/50 rounded-xl text-white outline-none focus:border-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
