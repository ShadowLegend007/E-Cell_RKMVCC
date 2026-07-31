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
import logo from './assets/Logo.png';

const renderProfile = (member: TeamMember, size: 'large' | 'small' = 'large') => {
  const cardWidth = size === 'large' ? 'w-[250px] md:w-[280px]' : 'w-[200px] md:w-[240px]';

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
        enableMobileTilt={false}
        behindGlowEnabled={false}
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
    // Prevent browser from restoring scroll position on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Always start from top
    window.scrollTo(0, 0);
    
    // Fallback for browsers that delay scroll restoration
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    fetchTeamData().then(setTeamData);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Header and Parallax GSAP Animations (Run Once)
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

      // Parallax Effects
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

  useEffect(() => {
    // Tree GSAP Animations
    const ctx = gsap.context(() => {
      // Tree animations tied to individual scroll positions (Scroll Reveal & Hide)
      const commonScrollTrigger = (triggerTarget: string | Element) => ({
        trigger: triggerTarget,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      });

      // 1. Reveal Leader Profile
      gsap.from(".leader-node", {
        scrollTrigger: commonScrollTrigger(".leader-node"),
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      });
      // 2. Reveal Line to Co-Leader
      gsap.from(".line-to-coleader", {
        scrollTrigger: commonScrollTrigger(".line-to-coleader"),
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      });
      // 3. Reveal Co-Leader Profile
      gsap.from(".coleader-node", {
        scrollTrigger: commonScrollTrigger(".coleader-node"),
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      });
      // 4. Reveal Line to Management
      gsap.from(".line-to-management", {
        scrollTrigger: commonScrollTrigger(".line-to-management"),
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      });
      // 5. Reveal Management Profile
      gsap.from(".management-node", {
        scrollTrigger: commonScrollTrigger(".management-node"),
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.2)"
      });
      // 6. Reveal Line down to Horizontal Connector
      gsap.from(".line-to-horizontal", {
        scrollTrigger: commonScrollTrigger(".line-to-horizontal"),
        scaleY: 0,
        opacity: 0,
        duration: 0.5,
        transformOrigin: "top center",
        ease: "power2.inOut"
      });
      // 7. Reveal Horizontal Connectors
      gsap.utils.toArray(".connector-line-h").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: commonScrollTrigger(el),
          scaleX: 0,
          opacity: 0,
          duration: 0.8,
          transformOrigin: "center center",
          ease: "power2.inOut"
        });
      });
      // 8. Stagger reveal sub-teams
      gsap.utils.toArray(".subteam-line").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: commonScrollTrigger(el),
          scaleY: 0,
          opacity: 0,
          duration: 0.4,
          transformOrigin: "top center",
          ease: "power2.inOut"
        });
      });
      gsap.utils.toArray(".team-header").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: commonScrollTrigger(el),
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(1.2)"
        });
      });
      gsap.utils.toArray(".subteam-member-line").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: commonScrollTrigger(el),
          scaleY: 0,
          opacity: 0,
          duration: 0.5,
          transformOrigin: "top center",
          ease: "power2.inOut"
        });
      });
      gsap.utils.toArray(".subteam-member").forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: commonScrollTrigger(el),
          y: 40,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.2)"
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [teamData]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-sans selection:bg-primary/20 relative overflow-hidden">
      {!isMobile && (
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
      )}

      {!isMobile && <GoldenGlitters />}

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
                  src={logo}
                  alt="RKMVCC E-CELL Logo"
                  className="w-full h-full object-contain drop-shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                  loading="eager"
                  fetchPriority="high"
                  onError={(e) => {
                    // Fallback to text if Logo.png is missing
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

          <div className="header-buttons flex flex-wrap justify-center items-center gap-3 md:gap-4 mt-8 w-full max-w-full">
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
        <div className="relative w-full pb-2 px-4 tree-container">
          <div className="flex flex-col items-center w-full mx-auto">

            {/* Leader */}
            <div className="flex flex-col items-center snap-center leader-node">
              {renderProfile(teamData.leader, 'large')}
              {/* Vertical Line */}
              <div className="h-16 -my-2 line-to-coleader shine-line relative overflow-hidden line-3d-v z-0"></div>
            </div>

            {/* Co-Leader */}
            <div className="flex flex-col items-center snap-center coleader-node">
              {renderProfile(teamData.coLeader, 'large')}
              {/* Vertical Line */}
              <div className="h-16 -my-2 line-to-management shine-line relative overflow-hidden line-3d-v z-0"></div>
            </div>

            {/* Management Head */}
            <div className="flex flex-col items-center snap-center management-node">
              {renderProfile(teamData.management, 'large')}
              {/* Vertical Line going down to horizontal connector */}
              <div className="h-[80px] -mt-2 mb-0 line-to-horizontal shine-line relative overflow-hidden line-3d-v z-0"></div>
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
                    <div className={`hidden xl:block absolute top-0 connector-line-h line-3d-h ${idx === 0 ? 'left-1/2 -right-4' :
                        idx === SUB_TEAMS.length - 1 ? '-left-4 right-1/2' :
                          '-left-4 -right-4'
                      }`}></div>

                    {/* Vertical line connecting horizontal bar to sub-team header */}
                    <div className="h-8 absolute top-0 left-1/2 -translate-x-1/2 subteam-line shine-line overflow-hidden line-3d-v z-10"></div>

                    {/* Team Header */}
                    <div className="team-header glass-panel px-6 py-3 rounded-2xl border-t border-primary/20 z-10 text-center w-[90%] min-h-[4rem] flex items-center justify-center">
                      <h3 className="text-sm font-bold tracking-wider text-black uppercase">{team.name}</h3>
                    </div>

                    {/* Team Members */}
                    <div className="flex flex-col w-full items-center relative">
                      {team.members.map((member, memberIdx) => (
                        <div key={memberIdx} className="flex flex-col items-center w-full">
                          <div className={`relative w-[2px] subteam-member-line shine-line overflow-hidden line-3d-v z-0 ${memberIdx === 0 ? 'h-12' : 'h-10'} -my-2`}></div>
                          <div className="relative z-10 subteam-member">
                            {renderProfile(member, 'small')}
                          </div>
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
      <footer className="mt-8 pt-4 pb-4 border-t border-gray-200 text-center relative overflow-hidden">
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
