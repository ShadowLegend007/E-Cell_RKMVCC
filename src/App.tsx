import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import BlurText from './components/BlurText';
import SpecularButton from './components/SpecularButton';
import ProfileCard from './components/ProfileCard';
import GlareHover from './components/GlareHover';
import SplashCursor from './components/SplashCursor';
import GoldenGlitters from './components/GoldenGlitters';
import { fetchTeamData, LEADER, CO_LEADER, MANAGEMENT_HEAD, SUB_TEAMS } from './data/team';
import type { TeamMember, TeamData } from './data/team';

const renderProfile = (member: TeamMember, size: 'large' | 'small' = 'large') => {
  const cardWidth = size === 'large' ? 'w-[280px]' : 'w-[240px]';
  
  return (
    <div className={`team-node ${cardWidth} shrink-0 mx-2 my-0 flex flex-col items-center z-10`}>
      <ProfileCard
        name={member.name}
        title={member.role}
        handle={member.name.toLowerCase().replace(' ', '')}
        status="E-Cell Member"
        contactText="Connect"
        avatarUrl={member.avatarUrl}
        linkedin={member.linkedin}
        instagram={member.instagram}
        portfolio={member.portfolio}
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={true}
        behindGlowEnabled={true}
        innerGradient="linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)"
        behindGlowColor="rgba(212, 175, 55, 0.3)"
      />
    </div>
  );
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [teamData, setTeamData] = useState<TeamData>({
    leader: LEADER,
    coLeader: CO_LEADER,
    management: MANAGEMENT_HEAD,
    subTeams: SUB_TEAMS
  });

  useEffect(() => {
    fetchTeamData().then(setTeamData);
  }, []);

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      // Header animations
      gsap.from(logoRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)",
      });

      gsap.from(".header-text", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".header-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      });

      // Main sequential timeline for the organizational chart
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".tree-container",
          start: "top 80%",
          once: true
        }
      });

      // 1. Reveal Leader Profile
      tl.from(".leader-node", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      })
      // 2. Reveal Line to Co-Leader
      .from(".line-to-coleader", {
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      })
      // 3. Reveal Co-Leader Profile
      .from(".coleader-node", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      })
      // 4. Reveal Line to Management
      .from(".line-to-management", {
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      })
      // 5. Reveal Management Profile
      .from(".management-node", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      })
      // 6. Reveal Line down to Horizontal Connector
      .from(".line-to-horizontal", {
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      })
      // 7. Reveal Horizontal Connector
      .from(".connector-line-h", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        transformOrigin: "center center",
        ease: "power2.inOut"
      })
      // 8. Stagger reveal sub-teams (lines, headers, then members)
      .from(".subteam-line", {
        scaleY: 0,
        opacity: 0,
        duration: 0.4,
        transformOrigin: "top center",
        stagger: 0.1,
        ease: "power2.inOut"
      }, "-=0.2")
      .from(".team-header", {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.2)"
      }, "-=0.2")
      .from(".subteam-member", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)"
      }, "-=0.2");


      // Parallax Effects
      // 1. Background decorative elements
      gsap.utils.toArray('.parallax-bg').forEach((layer, i) => {
        const depth = (i + 1) * 0.15;
        gsap.to(layer as Element, {
          y: () => -(window.innerHeight * depth),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-sans selection:bg-primary/20 pb-24 relative overflow-hidden">
      <SplashCursor 
        DENSITY_DISSIPATION={4.5}
        VELOCITY_DISSIPATION={4}
        PRESSURE={0.3}
        CURL={4}
        SPLAT_RADIUS={0.25}
        COLOR_UPDATE_SPEED={5}
        COLOR="#d4af37"
        RAINBOW_MODE={false}
      />
      
      <GoldenGlitters />

      {/* Background Decorative Parallax Elements */}
      <div className="parallax-bg absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="parallax-bg absolute top-[40%] right-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="parallax-bg absolute top-[70%] left-[15%] w-72 h-72 bg-gray-200/50 rounded-full blur-[90px] pointer-events-none z-0"></div>
      <div className="parallax-bg absolute top-[90%] right-[5%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header Section */}
      <header className="relative min-h-screen pt-16 pb-24 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 50% 0%, #d4af37 0%, transparent 70%)' }}>
        </div>
        
        <div className="z-10 flex flex-col items-center gap-6 px-4">
          <div ref={logoRef}>
            <GlareHover
              width="240px"
              height="240px"
              background="transparent"
              borderRadius="0"
              borderColor="transparent"
              className="mb-4"
              glareColor="#d4af37"
            >
              <div className="flex flex-col items-center justify-center h-full w-full p-2">
                <img 
                  src="/src/assets/logo.png" 
                  alt="RKMVCC E-CELL Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                  onError={(e) => {
                    // Fallback to text if logo.png is missing
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="font-serif font-bold text-2xl text-primary">E-CELL</span>';
                    }
                  }}
                />
              </div>
            </GlareHover>
          </div>
          
          <div>
            <h1 className="header-text text-4xl md:text-6xl font-bold tracking-tight text-black mb-2">
              RKMVCC <span className="text-primary font-serif italic">E-CELL</span>
            </h1>
            <p className="header-text text-lg md:text-xl text-gray-600 font-medium tracking-widest uppercase mb-1">
              Entrepreneurship Cell
            </p>
            <p className="header-text text-sm text-gray-500 max-w-md mx-auto">
              Ramakrishna Mission Vivekananda Centenary College Rahara, Kolkata - 118118
            </p>
          </div>
          
          <div className="header-buttons flex gap-4 mt-8">
            <SpecularButton 
              size="md" 
              baseColor="#ffffff" 
              lineColor="#d4af37" 
              textColor="#000000"
              className="font-semibold shadow-sm border border-gray-200"
              onClick={() => window.location.href = 'mailto:entre@rkmvccrahara.org'}
            >
              entre@rkmvccrahara.org
            </SpecularButton>
            <SpecularButton 
              size="md" 
              baseColor="#ffffff" 
              lineColor="#d4af37" 
              textColor="#000000"
              className="font-semibold shadow-sm border border-gray-200"
              onClick={() => window.open('https://www.rkmvccrahara.org', '_blank')}
            >
              Website
            </SpecularButton>
          </div>
        </div>
      </header>

      {/* Main Content: Organizational Chart */}
      <main className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="mb-16 text-center">
          <BlurText 
            text="OUR TEAM" 
            className="text-4xl md:text-5xl font-bold font-serif text-black tracking-widest"
            delay={100}
            animateBy="letters"
          />
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 rounded-full" />
        </div>

        {/* Tree Structure */}
        <div className="relative w-full pb-12 px-4 tree-container">
          <div className="flex flex-col items-center w-full mx-auto">
            
            {/* Leader */}
            <div className="flex flex-col items-center snap-center leader-node">
              {renderProfile(teamData.leader, 'large')}
              {/* Vertical Line */}
              <div className="h-12 my-0 line-to-coleader shine-line relative overflow-hidden line-3d-v"></div>
            </div>

            {/* Co-Leader */}
            <div className="flex flex-col items-center snap-center coleader-node">
              {renderProfile(teamData.coLeader, 'large')}
              {/* Vertical Line */}
              <div className="h-12 my-0 line-to-management shine-line relative overflow-hidden line-3d-v"></div>
            </div>

            {/* Management Head */}
            <div className="flex flex-col items-center snap-center management-node">
              {renderProfile(teamData.management, 'large')}
              {/* Vertical Line going down to horizontal connector */}
              <div className="h-[72px] my-0 line-to-horizontal shine-line relative overflow-hidden line-3d-v z-10"></div>
            </div>

            {/* Sub-teams Horizontal Layout */}
            <div className="relative w-full">
              <div className="flex flex-wrap justify-center gap-8 relative mt-0 z-0">
                {teamData.subTeams.map((team, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center relative flex-1 min-w-[280px] snap-center pt-8"
                  >
                  {/* Horizontal Segment connecting the nodes (bridges gap-8 between columns) */}
                  <div className={`hidden xl:block absolute top-0 connector-line-h line-3d-h ${
                    idx === 0 ? 'left-1/2 -right-4' :
                    idx === SUB_TEAMS.length - 1 ? '-left-4 right-1/2' :
                    '-left-4 -right-4'
                  }`}></div>

                  {/* Vertical line connecting horizontal bar to sub-team header */}
                  <div className="h-8 absolute top-0 left-1/2 -translate-x-1/2 subteam-line shine-line overflow-hidden line-3d-v z-10"></div>
                  
                  {/* Team Header */}
                  <div className="team-header glass-panel px-6 py-3 rounded-2xl mb-8 border-t border-primary/20 z-10 text-center w-[90%]">
                    <h3 className="text-sm font-bold tracking-wider text-black uppercase">{team.name}</h3>
                  </div>

                  {/* Team Members */}
                  <div className="flex flex-col gap-6 w-full items-center relative">
                    {/* Connecting line for members in a team */}
                    <div className="absolute top-[-32px] bottom-0 left-1/2 -translate-x-1/2 z-0 shine-line overflow-hidden line-3d-v"></div>
                    
                    {team.members.map((member, memberIdx) => (
                      <div key={memberIdx} className="relative z-10 subteam-member">
                        {renderProfile(member, 'small')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-6 pb-6 border-t border-gray-200 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/5 blur-3xl rounded-full"></div>
        <p className="text-gray-600 font-medium italic tracking-wide text-base z-10 relative font-serif">
          "Empowering Ideas. Building Future."
        </p>
        <div className="flex flex-col justify-center items-center gap-1 mt-3 text-primary opacity-80">
          <div className="flex items-center gap-2">
            <span>✧</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold">RKMVCC E-CELL</span>
            <span>✧</span>
          </div>
          <p className="mt-1 text-xs text-gray-700 font-semibold tracking-wide">
            Made by{' '}
            <a href="https://github.com/shadowlegend007" target="_blank" rel="noreferrer" className="text-primary hover:underline transition-all">
              @shadowlegend007
            </a>
            . All rights reserved by{' '}
            <span className="text-primary font-serif italic drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
              E-Cell RKMVCC
            </span>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
