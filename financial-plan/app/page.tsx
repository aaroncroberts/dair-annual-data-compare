"use client";

import { useState, useEffect } from 'react';
import summaryContentData from '@/public/executive-summary.json';
import projectPhasesData from '@/public/project-plan.json';

type SummaryTab = 'process' | 'definitions' | 'insights';

interface SummaryPoint {
    title: string;
    points: string[];
}

interface SummaryContent {
    process: SummaryPoint;
    definitions: SummaryPoint;
    insights: SummaryPoint;
}

interface ProjectPhase {
    id: string;
    duration: string;
    title: string;
    description: string;
    details: {
        time: string;
        effort: string;
        value: string;
    };
    deliverables: string[];
}

// --- Main Page Component ---
export default function InfographicPage() {
    const [animatedElements, setAnimatedElements] = useState(new Set<string>());
    const [activeTab, setActiveTab] = useState<SummaryTab>('process');
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [summaryContent, setSummaryContent] = useState<SummaryContent | null>(summaryContentData);
    const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>(projectPhasesData);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight - 50) {
                setIsNavVisible(true);
            } else {
                setIsNavVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        document.title = 'DAIR: Financial Analysis Automation Initiative';
        let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = 'Project plan for automating financial analysis and visualization for Cleveland State University.';

        let googleFontLink = document.querySelector('link[href*="fonts.googleapis.com"]') as HTMLLinkElement;
        if (!googleFontLink) {
            googleFontLink = document.createElement('link');
            googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap';
            googleFontLink.rel = 'stylesheet';
            document.head.appendChild(googleFontLink);
        }

        const style = document.createElement('style');
        style.textContent = `html { scroll-behavior: smooth; }`;
        document.head.appendChild(style);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setAnimatedElements(prev => new Set(prev).add(entry.target.id));
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => {
            elements.forEach(el => observer.unobserve(el));
            window.removeEventListener('scroll', handleScroll);
            document.head.removeChild(style);
        };
    }, []);
    
    const isVisible = (id: string) => animatedElements.has(id);
    
    const handlePhaseClick = (phaseId: string) => {
        setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
    };

    if (!summaryContent || projectPhases.length === 0) {
        return (
            <div className="bg-gray-900 min-h-screen flex justify-center items-center text-white">
                Loading...
            </div>
        );
    }
    
    return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
          <div className="max-w-6xl mx-auto px-8 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 flex justify-between items-center">
              <span className="font-bold text-lg">Financial Analysis Initiative</span>
              <div className="space-x-4">
                  <a href="#summary" className="px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors">Executive Summary</a>
                  <a href="#plan" className="px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors">Project Plan</a>
              </div>
          </div>
      </nav>

      <main className="bg-gray-800 text-white font-sans overflow-x-hidden" style={{fontFamily: "'Inter', sans-serif"}}>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center p-8 bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <div className="max-w-4xl mx-auto">
             <div className="text-4xl font-extrabold tracking-tight text-white mb-8">
                CLEVELAND STATE <span className="text-[#008A54]">UNIVERSITY</span>
             </div>
            <h1 id="hero-title" className={`animate-on-scroll text-5xl md:text-7xl font-extrabold text-white mb-4 transition-all duration-1000 ease-in-out ${isVisible('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Financial Analysis Automation Initiative
            </h1>
            <p id="hero-description" className={`animate-on-scroll text-lg md:text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 ease-in-out delay-400 ${isVisible('hero-description') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Transforming manual data tasks into a streamlined, automated tool for clear, consistent, and transparent financial insights.
            </p>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-gray-500 text-sm font-medium">
            A project by DAIR: Data Analytics & Institutional Research
          </div>
        </section>
        
        {/* Executive Summary Section */}
        <section id="summary" className="py-20 px-8 bg-gray-900 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-base font-semibold tracking-wider text-[#008A54] uppercase">The Opportunity</h2>
                    <p className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">From Complexity to Clarity</p>
                    <p id="summary-subtitle" className={`animate-on-scroll mt-4 text-gray-400 text-lg transition-all duration-700 delay-200 ${isVisible('summary-subtitle') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>This project will automate financial reporting, delivering three core benefits.</p>
                </div>
                
                <div id="summary-tabs" className={`animate-on-scroll transition-all duration-700 delay-400 ${isVisible('summary-tabs') ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex flex-col md:flex-row justify-center border border-gray-700 rounded-lg p-2 bg-gray-800/50 mb-8">
                    <button onClick={() => setActiveTab('process')} className={`w-full md:w-auto px-6 py-3 font-semibold rounded-md transition-all duration-300 ${activeTab === 'process' ? 'bg-[#008A54] text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                      Process Execution
                    </button>
                    <button onClick={() => setActiveTab('definitions')} className={`w-full md:w-auto px-6 py-3 font-semibold rounded-md transition-all duration-300 ${activeTab === 'definitions' ? 'bg-[#008A54] text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                      Shared Definitions
                    </button>
                    <button onClick={() => setActiveTab('insights')} className={`w-full md:w-auto px-6 py-3 font-semibold rounded-md transition-all duration-300 ${activeTab === 'insights' ? 'bg-[#008A54] text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                      Organizational Insights
                    </button>
                  </div>

                  <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[190px]">
                      {summaryContent && summaryContent[activeTab] && (
                        <>
                          <h3 className="text-2xl font-bold mb-4 text-white">{summaryContent[activeTab].title}</h3>
                          <ul className="space-y-3 list-disc list-inside text-gray-300">
                              {summaryContent[activeTab].points.map((point: string, index: number) => (
                                  <li key={index} className="transition-opacity duration-300">{point}</li>
                              ))}
                          </ul>
                        </>
                      )}
                  </div>
                </div>
            </div>
        </section>

        {/* Project Plan Timeline Section */}
        <section id="plan" className="py-20 px-8 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                     <h2 className="text-base font-semibold tracking-wider text-[#008A54] uppercase">The Blueprint</h2>
                    <p className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">The Roadmap to Automation</p>
                    <p id="plan-subtitle" className={`animate-on-scroll mt-4 text-gray-400 text-lg transition-all duration-700 delay-200 ${isVisible('plan-subtitle') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>A 10-week journey from concept to a fully deployed, value-driving tool.</p>
                </div>

                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-700 -translate-y-1/2"></div>
                    
                    <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
                       {projectPhases.map((phase, index) => (
                            <div key={phase.id} id={phase.id} className={`animate-on-scroll relative group transition-all duration-700 ${isVisible(phase.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{transitionDelay: `${index * 150}ms`}}>
                                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#008A54] rounded-full border-4 border-gray-800 group-hover:scale-125 transition-transform"></div>
                                <div className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg cursor-pointer" onClick={() => handlePhaseClick(phase.id)}>
                                    <h4 className="text-sm font-semibold text-[#008A54] mb-2">PHASE {index + 1} ({phase.duration})</h4>
                                    <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{phase.description}</p>
                                    <div className="space-y-2 text-left text-sm">
                                        <div className="flex items-center"><span className="w-4 h-4 mr-2 text-[#008A54] flex-shrink-0">🕒</span> Time: {phase.details.time}</div>
                                        <div className="flex items-center"><span className="w-4 h-4 mr-2 text-[#008A54] flex-shrink-0">👥</span> Effort: {phase.details.effort}</div>
                                        <div className="flex items-center"><span className="w-4 h-4 mr-2 text-[#008A54] flex-shrink-0">🎯</span> Value: {phase.details.value}</div>
                                    </div>
                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedPhase === phase.id ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
                                      <h5 className="font-bold text-base text-[#008A54] mb-2 border-t border-gray-700 pt-4">Key Deliverables:</h5>
                                      <ul className="space-y-2 text-left text-sm text-gray-300 list-disc list-inside">
                                        {phase.deliverables.map((item: string) => <li key={item}>{item}</li>)}
                                      </ul>
                                    </div>
                                </div>
                            </div>
                       ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-8 text-center text-gray-500 bg-gray-900">
             <div className="text-2xl font-bold tracking-tight text-gray-400 mb-4">
                CLEVELAND STATE <span className="text-[#008A54]">UNIVERSITY</span>
             </div>
            <p>Financial Analysis Automation Initiative</p>
        </footer>
      </main>
    </>
  );
}