import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Cpu, 
  Code,
  Globe,
  MessageSquare,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Camera,
  Upload,
  Wrench,
  Palette,
  Download,
  RefreshCw,
  CheckCircle,
  Moon,
  Sun,
  Power
} from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { PortfolioData, Project } from './types';
import { generateTerminalResponse } from './services/geminiService';

// --- Utility Components ---

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-8 border-b-2 border-cyber-primary/30 pb-2">
    <Icon className="w-6 h-6 text-cyber-primary" />
    <h2 className="text-2xl font-mono font-bold text-cyber-text dark:text-cyber-dark-text uppercase tracking-wider">
      <span className="text-cyber-primary mr-2">{'//'}</span>
      {title}
    </h2>
  </div>
);

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-hard dark:shadow-[4px_4px_0px_0px_rgba(8,145,178,0.2)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(8,145,178,0.4)] ${className}`}
  >
    {children}
  </div>
);

const Button = ({ onClick, variant = 'primary', children, className = "" }: any) => {
  const baseStyle = "font-mono font-bold px-4 py-2 border-2 text-sm transition-all active:translate-y-1 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-white dark:bg-slate-900 border-slate-800 dark:border-cyan-500 text-slate-800 dark:text-cyan-400 hover:bg-cyber-highlight dark:hover:bg-cyan-900/20 shadow-hard-sm dark:shadow-[2px_2px_0px_0px_rgba(8,145,178,0.4)]",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-600 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 shadow-hard-sm",
    ghost: "border-transparent text-slate-500 dark:text-slate-400 hover:text-cyber-primary hover:bg-slate-100 dark:hover:bg-slate-800",
    icon: "p-2 border-slate-800 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-cyber-highlight dark:hover:bg-slate-700 shadow-hard-sm"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

// --- Main App Component ---

export default function App() {
  // State for Portfolio Data
  const [data, setData] = useState<PortfolioData>(() => {
    // Bumped to v7 for Theme features
    const saved = localStorage.getItem('portfolio_data_v7');
    if (saved) {
      return { ...INITIAL_DATA, ...JSON.parse(saved) };
    }
    return INITIAL_DATA;
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme_preference');
      return (savedTheme as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<{role: 'user' | 'system', text: string}[]>([
    { role: 'system', text: 'Welcome to VinitOS v2.0. Type a query to begin...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('portfolio_data_v7', JSON.stringify(data));
  }, [data]);

  // Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme_preference', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Notifications
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- CRUD Handlers ---

  const updateField = (section: keyof PortfolioData, value: any) => {
    setData(prev => ({ ...prev, [section]: value }));
  };

  const updateNestedField = (section: 'experience' | 'projects' | 'hallOfFame' | 'tools', id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Generic File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (section: 'experience' | 'projects' | 'skills' | 'hallOfFame' | 'tools') => {
    if (section === 'skills') {
      setData(prev => ({ ...prev, skills: [...prev.skills, "New Skill"] }));
      return;
    }
    
    const newId = Math.random().toString(36).substr(2, 9);
    let newItem;
    
    if (section === 'experience') {
      newItem = { id: newId, role: "New Role", company: "Company", period: "2024", description: "Description...", logo: "https://ui-avatars.com/api/?name=Co" };
    } else if (section === 'projects') {
      newItem = { id: newId, title: "New Project", technologies: ["Tech"], description: "Description...", link: "#", logo: "https://ui-avatars.com/api/?name=Proj" };
    } else if (section === 'hallOfFame') {
      newItem = { id: newId, company: "New Company", logo: "https://ui-avatars.com/api/?name=HOF", date: "2025" };
    } else if (section === 'tools') {
      newItem = { id: newId, name: "New Tool", logo: "https://ui-avatars.com/api/?name=Tool" };
    }

    if (newItem) {
      setData(prev => ({
        ...prev,
        [section]: [...(prev[section] as any[]), newItem]
      }));
    }
  };

  const deleteItem = (section: 'experience' | 'projects' | 'skills' | 'hallOfFame' | 'tools', idOrIndex: string | number) => {
    if (section === 'skills') {
      setData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== idOrIndex)
      }));
    } else {
      setData(prev => ({
        ...prev,
        [section]: (prev[section] as any[]).filter((item) => item.id !== idOrIndex)
      }));
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Data exported successfully!");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure? This will delete all your local changes and reset to default data.")) {
      localStorage.removeItem('portfolio_data_v7');
      setData(INITIAL_DATA);
      showNotification("System reset to default.");
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      showNotification("Changes saved to local storage.");
    }
    setIsEditing(!isEditing);
  };

  // --- Helper for Themed Cards (HOF & Tools) ---
  const getThemeCardClasses = (style: string = 'classic') => {
    switch (style) {
      case 'soft':
        return "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(8,145,178,0.2)] border border-slate-100 dark:border-slate-800 hover:-translate-y-2 hover:scale-105 transition-all duration-500 ease-out";
      case 'cyber':
        return "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-cyber-primary dark:hover:border-cyber-primary relative overflow-hidden transition-all duration-300 group hover:shadow-[0_0_20px_rgba(8,145,178,0.25)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-cyber-primary before:to-cyber-accent before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-500 before:origin-left";
      case 'classic':
      default:
        return "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-hard dark:shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] dark:shadow-slate-800 hover:-translate-y-1 transition-all duration-200 hover:shadow-hard-lg dark:hover:shadow-slate-700";
    }
  };

  // --- Terminal Logic ---

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const query = terminalInput;
    setTerminalInput('');
    setTerminalHistory(prev => [...prev, { role: 'user', text: `> ${query}` }]);
    setIsTyping(true);

    const response = await generateTerminalResponse(query, data);
    
    setIsTyping(false);
    setTerminalHistory(prev => [...prev, { role: 'system', text: response }]);
  };

  // --- UI Sections ---

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 relative selection:bg-cyber-highlight selection:text-cyber-primary pb-32 transition-colors duration-300">
      
      {/* --- Hacker Style Theme Toggle (Top Left Horizontal) --- */}
      <div className="fixed left-6 top-6 z-[100] flex items-center gap-4">
         <div className="relative group">
           {/* Connecting Line Decoration (Top) */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>
           
           <button 
             onClick={toggleTheme}
             className="relative bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-cyan-500 p-2 shadow-hard dark:shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:scale-105 transition-all group overflow-hidden"
             title="Toggle System Theme"
           >
              <div className="flex items-center gap-1">
                 {/* Horizontal Indicators */}
                 <div className={`w-1 h-3 ${theme === 'light' ? 'bg-orange-500' : 'bg-slate-700'} rounded-sm transition-colors`}></div>
                 <div className={`w-1 h-3 ${theme === 'dark' ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-slate-300'} rounded-sm transition-colors`}></div>
              </div>
              
              {/* Scanline Effect Horizontal */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
           </button>
         </div>
         
         {/* Horizontal Label */}
         <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1">SYS_THEME</span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-cyan-400 leading-none tracking-wider">
               {theme === 'light' ? 'LIGHT_MODE' : 'NIGHT_OPS'}
            </span>
         </div>
      </div>

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-slate-800 dark:bg-cyan-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-slate-700 dark:border-cyan-500">
            <CheckCircle className="w-5 h-5 text-green-400 dark:text-cyan-300" />
            <span className="font-mono text-sm">{notification}</span>
          </div>
        </div>
      )}

      {/* --- Fixed Controls (Right Side) --- */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        {isEditing && (
          <>
            <button 
              onClick={handleResetData}
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 p-3 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-transform flex items-center justify-center"
              title="Reset to Defaults"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            <button 
              onClick={handleDownloadData}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-800 dark:border-slate-600 p-3 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-transform flex items-center justify-center"
              title="Download Data (Backup)"
            >
              <Download className="w-6 h-6" />
            </button>
          </>
        )}
        <button 
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className="bg-slate-800 dark:bg-cyan-700 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-transparent dark:border-cyan-500"
          title="Open Terminal Assistant"
        >
          <Terminal className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleEditMode}
          className={`p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 ${isEditing ? 'bg-cyber-primary text-white border-cyber-primary' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-800 dark:border-slate-600'}`}
          title={isEditing ? "Save Changes" : "Edit Portfolio"}
        >
          {isEditing ? <Save className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
        </button>
      </div>

      {/* --- Modals --- */}
      
      {/* Terminal Modal */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 flex flex-col h-[500px]">
            <div className="bg-slate-800 p-3 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-400 font-mono">bash -- vinit-assistant</span>
              </div>
              <button onClick={() => setIsTerminalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-green-400 space-y-2">
              {terminalHistory.map((msg, idx) => (
                <div key={idx} className={msg.role === 'user' ? 'text-cyan-300' : 'text-slate-300'}>
                  {msg.text}
                </div>
              ))}
              {isTyping && <div className="text-slate-500 animate-pulse">Processing...</div>}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
              <span className="text-green-500 font-mono py-2">{'>'}</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono focus:outline-none py-2"
                placeholder="Ask about my skills, projects..."
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setSelectedProject(null)}>
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden border-2 border-slate-800 dark:border-cyan-900 relative" onClick={e => e.stopPropagation()}>
             <div className="absolute top-0 left-0 w-full h-2 bg-cyber-primary"></div>
             <button 
               onClick={() => setSelectedProject(null)}
               className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-800 dark:text-slate-200"
             >
               <X className="w-5 h-5" />
             </button>
             
             <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                   <img src={selectedProject.logo} alt={selectedProject.title} className="w-16 h-16 rounded-md object-contain border border-slate-200 dark:border-slate-700 shadow-sm bg-white" />
                   <div>
                     <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{selectedProject.title}</h2>
                     <div className="flex gap-2 mt-2">
                       {selectedProject.technologies.map((tech, i) => (
                         <span key={i} className="text-xs font-mono bg-cyber-highlight dark:bg-cyan-900/30 text-cyber-primary dark:text-cyan-400 px-2 py-1 rounded-sm border border-cyber-primary/20 dark:border-cyan-500/30">
                           {tech}
                         </span>
                       ))}
                     </div>
                   </div>
                </div>
                
                <div className="prose max-w-none text-slate-600 dark:text-slate-300 font-mono text-sm leading-relaxed mb-8">
                  <p>{selectedProject.description}</p>
                </div>

                <div className="flex justify-end gap-3">
                  <a href={selectedProject.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-mono font-bold shadow-hard dark:shadow-[4px_4px_0_0_#000] hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                    <Github className="w-4 h-4" /> VIEW SOURCE
                  </a>
                  <a href={selectedProject.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-cyber-primary text-white font-mono font-bold shadow-hard dark:shadow-[4px_4px_0_0_#000] hover:bg-cyber-accent transition-colors">
                    <ExternalLink className="w-4 h-4" /> LIVE DEMO
                  </a>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- Header / Hero --- */}
      <header className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 pt-20 pb-16 px-6 lg:px-20 relative overflow-hidden transition-colors duration-300">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Shield className="w-64 h-64 text-cyber-primary" />
         </div>
         
         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2 space-y-6">
              <div className="inline-block">
                {isEditing ? (
                  <input 
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 border border-green-500 text-green-700 dark:text-green-400 font-mono text-xs font-bold rounded-sm mb-2 w-full"
                    value={data.systemStatus}
                    onChange={(e) => updateField('systemStatus', e.target.value)}
                  />
                ) : (
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 border border-green-500 text-green-700 dark:text-green-400 font-mono text-xs font-bold rounded-sm mb-2">
                    {data.systemStatus}
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    className="w-full text-5xl font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-b-2 border-cyber-primary p-2 font-mono"
                    value={data.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                  />
                  <input 
                    className="w-full text-2xl text-cyber-primary bg-slate-50 dark:bg-slate-800 border-b-2 border-cyber-primary p-2 font-mono"
                    value={data.title} 
                    onChange={(e) => updateField('title', e.target.value)} 
                  />
                  <textarea 
                    className="w-full text-lg text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-2 border-cyber-primary p-2 h-32"
                    value={data.about} 
                    onChange={(e) => updateField('about', e.target.value)} 
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                    {data.name}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-cyber-primary font-mono font-medium typing-cursor border-r-2 border-transparent pr-2 w-fit">
                    {data.title}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {data.about}
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-4 pt-4">
                <a href={data.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-mono text-sm hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-hard-sm dark:shadow-none">
                  <Linkedin className="w-4 h-4" /> LINKEDIN
                </a>
                <a href={data.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-2 border-slate-800 dark:border-slate-600 font-mono text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-hard-sm dark:shadow-none">
                  <Github className="w-4 h-4" /> GITHUB
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono text-sm border-2 border-transparent">
                  <MapPin className="w-4 h-4 text-cyber-primary" /> {data.location}
                </div>
              </div>
            </div>

            {/* Profile Stats / Avatar Placeholder */}
            <div className="hidden md:flex justify-center">
               <div className="w-72 h-fit bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 relative shadow-hard dark:shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center p-6 transition-colors">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-primary -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-primary -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-primary -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-primary -mb-1 -mr-1"></div>
                  
                  <div className="relative group">
                    <img 
                      src={data.profileImage || `https://picsum.photos/seed/${data.name.replace(' ', '')}/400/400`} 
                      alt="Profile" 
                      className="w-48 h-48 rounded-full border-4 border-white dark:border-slate-900 shadow-md mb-4 object-cover"
                    />
                    {isEditing && (
                       <label className="absolute bottom-4 right-4 bg-cyber-primary text-white p-3 rounded-full cursor-pointer hover:bg-cyber-accent shadow-lg transition-transform hover:scale-110">
                          <Upload size={20} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateField('profileImage', url))} />
                       </label>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mb-2 w-full">
                       <input 
                        className="w-full text-xs text-center border-b border-slate-300 dark:border-slate-600 p-1 bg-transparent focus:border-cyber-primary focus:outline-none placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-200"
                        value={data.profileImage} 
                        onChange={(e) => updateField('profileImage', e.target.value)}
                        placeholder="Or paste Image URL..." 
                      />
                    </div>
                  )}

                  <div className="font-mono text-xs text-center space-y-1 w-full mt-4 text-slate-800 dark:text-slate-300">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                      <span>SEC_LEVEL</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">A+</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                      <span>AVAILABILITY</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{isEditing ? <input value={data.availability} onChange={(e) => updateField('availability', e.target.value)} className="w-20 text-right bg-transparent border-b border-blue-300" /> : data.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENCRYPTION</span>
                      <span className="text-slate-400 dark:text-slate-500">ENABLED</span>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-20 py-16 space-y-24">
        
        {/* --- Hall of Fame Section (Grid Layout with Themes) --- */}
        {data.hallOfFame && data.hallOfFame.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8 border-b-2 border-cyber-primary/30 pb-2">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-cyber-primary" />
                <h2 className="text-2xl font-mono font-bold text-cyber-text dark:text-white uppercase tracking-wider">
                  <span className="text-cyber-primary mr-2">{'//'}</span>
                  Hall_Of_Fame
                </h2>
              </div>
              
              {/* Theme Selector (Visible in Edit Mode) */}
              {isEditing && (
                <div className="flex items-center gap-2 mb-1">
                   <Palette className="w-4 h-4 text-slate-400" />
                   <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
                      <button 
                        onClick={() => updateField('hallOfFameStyle', 'classic')}
                        className={`px-3 py-1 text-xs font-mono rounded ${data.hallOfFameStyle === 'classic' ? 'bg-slate-800 text-white dark:bg-slate-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                      >
                        Classic
                      </button>
                      <button 
                        onClick={() => updateField('hallOfFameStyle', 'soft')}
                        className={`px-3 py-1 text-xs font-mono rounded ${data.hallOfFameStyle === 'soft' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                      >
                        Soft
                      </button>
                      <button 
                        onClick={() => updateField('hallOfFameStyle', 'cyber')}
                        className={`px-3 py-1 text-xs font-mono rounded ${data.hallOfFameStyle === 'cyber' ? 'bg-cyber-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                      >
                        Cyber
                      </button>
                   </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
               {data.hallOfFame.map((item) => (
                  <div key={item.id} className={`flex flex-col items-center justify-center p-4 gap-3 h-full group ${getThemeCardClasses(data.hallOfFameStyle)}`}>
                    {isEditing ? (
                       <div className="w-full flex flex-col items-center gap-2">
                          <div className="relative w-20 h-20 group/img">
                             <img src={item.logo} alt={item.company} className="w-full h-full object-contain mb-1 drop-shadow-sm bg-white rounded p-1" />
                             <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer rounded-md transition-opacity opacity-0 group-hover/img:opacity-100">
                                <Upload className="text-white w-6 h-6 mb-1" />
                                <span className="text-[10px] text-white font-mono">UPLOAD</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateNestedField('hallOfFame', item.id, 'logo', url))} />
                             </label>
                          </div>
                          
                          <label className="cursor-pointer text-xs flex items-center gap-1 text-cyber-primary font-bold hover:underline">
                            <Upload className="w-3 h-3" /> Change Logo
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateNestedField('hallOfFame', item.id, 'logo', url))} />
                          </label>

                          <input 
                            value={item.company} 
                            onChange={(e) => updateNestedField('hallOfFame', item.id, 'company', e.target.value)} 
                            className="text-xs font-bold text-center border-b w-full bg-transparent text-slate-800 dark:text-slate-200"
                          />
                           <input 
                            value={item.date} 
                            onChange={(e) => updateNestedField('hallOfFame', item.id, 'date', e.target.value)} 
                            className="text-[10px] text-slate-500 dark:text-slate-400 text-center border-b w-full bg-transparent"
                          />
                          <button onClick={() => deleteItem('hallOfFame', item.id)} className="text-red-500 text-xs mt-1">Remove</button>
                       </div>
                    ) : (
                       <>
                         <div className={`w-20 h-20 flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110 p-2 rounded bg-white ${data.hallOfFameStyle === 'soft' ? 'drop-shadow-md' : ''}`}>
                           <img src={item.logo} alt={item.company} className="max-w-full max-h-full object-contain" />
                         </div>
                         <div className="text-center z-10">
                            <h3 className="font-mono font-bold text-sm leading-tight mb-1 text-slate-800 dark:text-slate-200">{item.company}</h3>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{item.date}</span>
                         </div>
                       </>
                    )}
                  </div>
               ))}
               
               {isEditing && (
                 <button 
                   onClick={() => addItem('hallOfFame')}
                   className="h-full min-h-[180px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-cyber-primary hover:border-cyber-primary transition-colors bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                 >
                   <Plus className="w-8 h-8 mb-2" />
                   <span className="font-mono text-sm text-center">ADD_ENTRY</span>
                 </button>
               )}
            </div>
          </section>
        )}

        {/* --- Experienced With (Tools) Section --- */}
        <section>
          <SectionHeader title="Command_Center (Experienced With)" icon={Wrench} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.tools && data.tools.map((tool) => (
              <div key={tool.id} className={`flex flex-col items-center justify-center p-6 gap-3 group text-center ${getThemeCardClasses(data.hallOfFameStyle)}`}>
                 {isEditing ? (
                   <div className="relative w-full flex flex-col items-center gap-2">
                      <div className="relative group/edit">
                         <img src={tool.logo} alt={tool.name} className="w-16 h-16 object-contain mb-1 bg-white rounded p-1" />
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/edit:opacity-100 transition-opacity cursor-pointer rounded-full">
                            <Upload className="text-white w-6 h-6" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateNestedField('tools', tool.id, 'logo', url))} />
                         </label>
                      </div>
                      <input 
                        value={tool.name} 
                        onChange={(e) => updateNestedField('tools', tool.id, 'name', e.target.value)} 
                        className="text-sm font-bold text-center border-b w-full bg-transparent text-slate-800 dark:text-slate-200" 
                        placeholder="Tool Name"
                      />
                      <button onClick={() => deleteItem('tools', tool.id)} className="text-red-500 text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                   </div>
                 ) : (
                   <>
                     <div className={`w-16 h-16 flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110 p-2 rounded bg-white ${data.hallOfFameStyle === 'soft' ? 'drop-shadow-sm' : ''}`}>
                       <img src={tool.logo} alt={tool.name} className="max-w-full max-h-full object-contain" />
                     </div>
                     <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
                   </>
                 )}
              </div>
            ))}
            {isEditing && (
              <button 
                 onClick={() => addItem('tools')}
                 className="h-full min-h-[160px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-cyber-primary hover:border-cyber-primary transition-colors bg-slate-50 dark:bg-slate-900"
               >
                 <Plus className="w-8 h-8 mb-2" />
                 <span className="font-mono text-sm">ADD_TOOL</span>
               </button>
            )}
          </div>
        </section>

        {/* --- Experience Section --- */}
        <section>
           <SectionHeader title="System_Logs (Experience)" icon={Terminal} />
           
           <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6 pl-6 md:pl-10">
             {data.experience.map((exp) => (
               <div key={exp.id} className="relative group">
                 {/* Timeline Dot */}
                 <div className="absolute -left-[31px] md:-left-[47px] top-8 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-cyber-primary rounded-full z-10"></div>
                 
                 <Card className="group-hover:border-cyber-primary dark:group-hover:border-cyber-primary transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                       {/* Company Logo Section */}
                       <div className="flex-shrink-0">
                          {isEditing ? (
                             <div className="flex flex-col gap-2 items-center">
                               <div className="relative group/logo">
                                  <img src={exp.logo || "https://placehold.co/100"} alt="logo" className="w-20 h-20 object-contain rounded-md border border-slate-200 dark:border-slate-700 bg-white" />
                                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer rounded-md">
                                    <Upload className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateNestedField('experience', exp.id, 'logo', url))} />
                                  </label>
                               </div>
                             </div>
                          ) : (
                             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                               <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                             </div>
                          )}
                       </div>

                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div className="w-full">
                                {isEditing ? (
                                  <div className="grid gap-2 mb-2">
                                    <input 
                                      className="font-bold text-lg font-mono border-b border-slate-300 dark:border-slate-600 w-full bg-transparent text-slate-800 dark:text-slate-200"
                                      value={exp.role}
                                      onChange={(e) => updateNestedField('experience', exp.id, 'role', e.target.value)}
                                    />
                                    <input 
                                      className="text-cyber-primary font-mono border-b border-slate-300 dark:border-slate-600 w-full bg-transparent"
                                      value={exp.company}
                                      onChange={(e) => updateNestedField('experience', exp.id, 'company', e.target.value)}
                                    />
                                    <input 
                                      className="text-xs text-slate-500 dark:text-slate-400 font-mono border-b border-slate-300 dark:border-slate-600 w-full bg-transparent"
                                      value={exp.period}
                                      onChange={(e) => updateNestedField('experience', exp.id, 'period', e.target.value)}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{exp.role}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm font-mono mt-1 text-slate-500 dark:text-slate-400">
                                      <span className="text-cyber-primary font-semibold">@{exp.company}</span>
                                      <span className="mt-1 sm:mt-0">[{exp.period}]</span>
                                    </div>
                                  </>
                                )}
                             </div>
                             {isEditing && (
                               <Button variant="danger" onClick={() => deleteItem('experience', exp.id)} className="ml-4">
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             )}
                          </div>
                          {isEditing ? (
                            <textarea 
                              className="w-full h-20 border border-slate-300 dark:border-slate-600 p-2 text-sm text-slate-600 dark:text-slate-300 mt-2 font-mono bg-transparent"
                              value={exp.description}
                              onChange={(e) => updateNestedField('experience', exp.id, 'description', e.target.value)}
                            />
                          ) : (
                            <p className="text-slate-600 dark:text-slate-400 mt-2 font-mono text-sm leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                       </div>
                    </div>
                 </Card>
               </div>
             ))}
             
             {isEditing && (
               <Button onClick={() => addItem('experience')} className="w-full flex justify-center items-center gap-2">
                 <Plus className="w-4 h-4" /> NEW_ENTRY
               </Button>
             )}
           </div>
        </section>

        {/* --- Projects Section --- */}
        <section>
          <SectionHeader title="Deployed_Payloads (Projects)" icon={Code} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.map((proj) => (
              <Card 
                key={proj.id} 
                className="h-full flex flex-col relative overflow-hidden group cursor-pointer hover:border-cyber-primary dark:hover:border-cyber-primary"
                onClick={() => !isEditing && setSelectedProject(proj)}
              >
                {isEditing && (
                  <div className="absolute top-2 right-2 z-10">
                    <Button variant="danger" onClick={(e: any) => { e.stopPropagation(); deleteItem('projects', proj.id); }} className="!p-1">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    {/* Project Logo */}
                     {isEditing ? (
                       <div className="relative group/proj">
                         <img src={proj.logo || ''} alt="logo" className="w-12 h-12 object-contain rounded bg-slate-50 border border-slate-100 p-1" />
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/proj:opacity-100 transition-opacity cursor-pointer rounded">
                            <Upload className="text-white w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateNestedField('projects', proj.id, 'logo', url))} onClick={e => e.stopPropagation()} />
                         </label>
                       </div>
                     ) : (
                       <img src={proj.logo} alt="logo" className="w-12 h-12 object-contain rounded bg-slate-50 dark:bg-white border border-slate-100 p-1" />
                     )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        {isEditing ? (
                          <input 
                             className="font-bold text-lg font-mono border-b border-slate-300 dark:border-slate-600 w-full bg-transparent text-slate-800 dark:text-slate-200"
                             value={proj.title}
                             onChange={(e) => updateNestedField('projects', proj.id, 'title', e.target.value)}
                             onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <h3 className="font-bold text-lg font-mono truncate text-slate-800 dark:text-slate-100 group-hover:text-cyber-primary transition-colors">{proj.title}</h3>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <textarea 
                      className="w-full h-24 border border-slate-300 dark:border-slate-600 p-2 text-sm text-slate-600 dark:text-slate-300 font-mono mb-4 bg-transparent"
                      value={proj.description}
                      onChange={(e) => updateNestedField('projects', proj.id, 'description', e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {proj.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.technologies.slice(0, 3).map((tech, i) => (
                       <span key={i} className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-sm border border-slate-200 dark:border-slate-700">
                         {isEditing ? (
                           <input 
                             value={tech}
                             onChange={(e) => {
                               const newTech = [...proj.technologies];
                               newTech[i] = e.target.value;
                               updateNestedField('projects', proj.id, 'technologies', newTech);
                             }}
                             className="w-16 bg-transparent"
                             onClick={e => e.stopPropagation()}
                           />
                         ) : tech}
                       </span>
                    ))}
                    {!isEditing && proj.technologies.length > 3 && (
                      <span className="text-xs font-mono text-slate-400 px-1 py-1">+{proj.technologies.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <span className="text-xs font-mono text-slate-400 dark:text-slate-500">CLICK FOR DETAILS</span>
                   <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></div>
                </div>
              </Card>
            ))}
             
             {isEditing && (
               <button 
                 onClick={() => addItem('projects')}
                 className="h-full min-h-[200px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-cyber-primary hover:border-cyber-primary transition-colors bg-slate-50 dark:bg-slate-900"
               >
                 <Plus className="w-8 h-8 mb-2" />
                 <span className="font-mono text-sm">INIT_NEW_PROJECT</span>
               </button>
             )}
          </div>
        </section>

        {/* --- Skills Section --- */}
        <section>
          <SectionHeader title="Technical_Arsenal" icon={Cpu} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <div className="w-2 h-2 bg-cyber-primary rounded-full"></div>
                Skill_Matrix
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="group relative">
                    <span className={`inline-block px-3 py-1 font-mono text-sm border ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300' : 'bg-slate-800 dark:bg-slate-700 text-white border-slate-800 dark:border-slate-700'} hover:scale-105 transition-transform cursor-default`}>
                      {isEditing ? (
                         <input 
                           value={skill} 
                           onChange={(e) => {
                             const newSkills = [...data.skills];
                             newSkills[idx] = e.target.value;
                             updateField('skills', newSkills);
                           }}
                           className="bg-transparent w-24 focus:outline-none"
                         />
                      ) : skill}
                    </span>
                    {isEditing && (
                      <button 
                        onClick={() => deleteItem('skills', idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <button onClick={() => addItem('skills')} className="px-3 py-1 font-mono text-sm border border-dashed border-slate-400 text-slate-500 hover:text-cyber-primary hover:border-cyber-primary flex items-center gap-1">
                    <Plus className="w-3 h-3" /> ADD_NODE
                  </button>
                )}
              </div>
            </Card>
            
            <div className="font-mono text-sm text-slate-500 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-800 pl-4 flex flex-col justify-center space-y-4">
               <p>{'>'} Initializing skill database...</p>
               <p>{'>'} Loading core competencies...</p>
               <p>{'>'} Analysis complete. Proficiency levels optimal.</p>
               <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-cyber-primary w-3/4 animate-pulse"></div>
               </div>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="border-t-2 border-slate-200 dark:border-slate-800 pt-10 pb-20 text-center text-slate-500 dark:text-slate-400 text-sm font-mono">
           <p className="mb-2">SECURE CONNECTION ESTABLISHED</p>
           <p>© {new Date().getFullYear()} {data.name}. All systems operational.</p>
           <div className="mt-4 flex justify-center gap-4">
              <MessageSquare className="w-5 h-5 cursor-pointer hover:text-cyber-primary transition-colors" onClick={() => setIsTerminalOpen(true)} />
              <Mail className="w-5 h-5 cursor-pointer hover:text-cyber-primary transition-colors" />
           </div>
        </footer>

      </main>
    </div>
  );
}