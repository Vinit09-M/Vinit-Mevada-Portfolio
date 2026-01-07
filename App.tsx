import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Shield, 
  X, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Cpu, 
  Code,
  Globe,
  Award,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { PortfolioData, Project } from './types';

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

// --- Main App Component ---

export default function App() {
  // State for Portfolio Data
  const [data] = useState<PortfolioData>(INITIAL_DATA);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme_preference');
      return (savedTheme as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 relative selection:bg-cyber-highlight selection:text-cyber-primary pb-32 transition-colors duration-300">
      
      {/* --- Hacker Style Theme Toggle (Top Left Horizontal) --- */}
      <div className="fixed left-6 top-6 z-[100] flex items-center gap-4">
         <div className="relative group">
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>
           
           <button 
             onClick={toggleTheme}
             className="relative bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-cyan-500 p-2 shadow-hard dark:shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:scale-105 transition-all group overflow-hidden"
             title="Toggle System Theme"
           >
              <div className="flex items-center gap-1">
                 <div className={`w-1 h-3 ${theme === 'light' ? 'bg-orange-500' : 'bg-slate-700'} rounded-sm transition-colors`}></div>
                 <div className={`w-1 h-3 ${theme === 'dark' ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-slate-300'} rounded-sm transition-colors`}></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
           </button>
         </div>
         
         <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1">SYS_THEME</span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-cyan-400 leading-none tracking-wider">
               {theme === 'light' ? 'LIGHT_MODE' : 'NIGHT_OPS'}
            </span>
         </div>
      </div>

      {/* --- Project Details Modal --- */}
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
                  {selectedProject.link && (
                    <a href={selectedProject.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-mono font-bold shadow-hard dark:shadow-[4px_4px_0_0_#000] hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                      <Github className="w-4 h-4" /> VIEW SOURCE
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a href={selectedProject.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-cyber-primary text-white font-mono font-bold shadow-hard dark:shadow-[4px_4px_0_0_#000] hover:bg-cyber-accent transition-colors">
                      <ExternalLink className="w-4 h-4" /> LIVE DEMO
                    </a>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- Header / Hero --- */}
      <header className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 pt-20 pb-16 px-6 lg:px-20 relative overflow-hidden transition-colors duration-300">
         <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Shield className="w-64 h-64 text-cyber-primary" />
         </div>
         
         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2 space-y-6">
              <div className="inline-block">
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 border border-green-500 text-green-700 dark:text-green-400 font-mono text-xs font-bold rounded-sm mb-2">
                  {data.systemStatus}
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {data.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-cyber-primary font-mono font-medium typing-cursor border-r-2 border-transparent pr-2 w-fit">
                {data.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {data.about}
              </p>

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
                  </div>

                  <div className="font-mono text-xs text-center space-y-1 w-full mt-4 text-slate-800 dark:text-slate-300">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                      <span>SEC_LEVEL</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">A+</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                      <span>AVAILABILITY</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{data.availability}</span>
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
        
        {/* --- Hall of Fame Section --- */}
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
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
               {data.hallOfFame.map((item) => (
                  <div key={item.id} className={`flex flex-col items-center justify-center p-4 gap-3 h-full group ${getThemeCardClasses(data.hallOfFameStyle)}`}>
                    <div className={`w-20 h-20 flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110 p-2 rounded bg-white ${data.hallOfFameStyle === 'soft' ? 'drop-shadow-md' : ''}`}>
                      <img src={item.logo} alt={item.company} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="text-center z-10">
                       <h3 className="font-mono font-bold text-sm leading-tight mb-1 text-slate-800 dark:text-slate-200">{item.company}</h3>
                       <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{item.date}</span>
                    </div>
                  </div>
               ))}
            </div>
          </section>
        )}

        {/* --- Experienced With (Tools) Section --- */}
        <section>
          <SectionHeader title="Command_Center (Experienced With)" icon={Wrench} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.tools && data.tools.map((tool) => (
              <div key={tool.id} className={`flex flex-col items-center justify-center p-6 gap-3 group text-center ${getThemeCardClasses(data.hallOfFameStyle)}`}>
                <div className={`w-16 h-16 flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110 p-2 rounded bg-white ${data.hallOfFameStyle === 'soft' ? 'drop-shadow-sm' : ''}`}>
                  <img src={tool.logo} alt={tool.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- Experience Section --- */}
        <section>
           <SectionHeader title="System_Logs (Experience)" icon={Terminal} />
           
           <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6 pl-6 md:pl-10">
             {data.experience.map((exp) => (
               <div key={exp.id} className="relative group">
                 <div className="absolute -left-[31px] md:-left-[47px] top-8 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-cyber-primary rounded-full z-10"></div>
                 
                 <Card className="group-hover:border-cyber-primary dark:group-hover:border-cyber-primary transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                          </div>
                       </div>

                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div className="w-full">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{exp.role}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm font-mono mt-1 text-slate-500 dark:text-slate-400">
                                  <span className="text-cyber-primary font-semibold">@{exp.company}</span>
                                  <span className="mt-1 sm:mt-0">[{exp.period}]</span>
                                </div>
                             </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-2 font-mono text-sm leading-relaxed">
                            {exp.description}
                          </p>
                       </div>
                    </div>
                 </Card>
               </div>
             ))}
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
                onClick={() => setSelectedProject(proj)}
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <img src={proj.logo} alt="logo" className="w-12 h-12 object-contain rounded bg-slate-50 dark:bg-white border border-slate-100 p-1" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <h3 className="font-bold text-lg font-mono truncate text-slate-800 dark:text-slate-100 group-hover:text-cyber-primary transition-colors">{proj.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {proj.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.technologies.slice(0, 3).map((tech, i) => (
                       <span key={i} className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-sm border border-slate-200 dark:border-slate-700">
                         {tech}
                       </span>
                    ))}
                    {proj.technologies.length > 3 && (
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
                      {skill}
                    </span>
                  </span>
                ))}
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
              <Mail className="w-5 h-5 cursor-pointer hover:text-cyber-primary transition-colors" onClick={() => window.location.href = `mailto:${data.social.email}`} />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-cyber-primary transition-colors" onClick={() => window.open(data.social.linkedin, '_blank')} />
              <Github className="w-5 h-5 cursor-pointer hover:text-cyber-primary transition-colors" onClick={() => window.open(data.social.github, '_blank')} />
           </div>
        </footer>

      </main>
    </div>
  );
}
