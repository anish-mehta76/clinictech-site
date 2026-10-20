"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Arrow } from "@/components/Button";
import { SCENES, STAGES, type SceneKey } from "./content";
import { RoadmapMap } from "./RoadmapMap";
import { Bow, Seal } from "./ornaments";
import { PearlCursor } from "./PearlCursor";
import { BeadWorkflow, BeforeAfter, Counters, FitPuzzle, RibbonToggle, SelfChecklist, StageCard, TimeCalculator } from "./widgets";

// Map viewBox is 1600 × 1000; the camera centers (x, y) at scale s.
const camTransform = ({ x, y, s }: SceneKey) => `translate(${(800 - s * x).toFixed(2)} ${(500 - s * y).toFixed(2)}) scale(${s.toFixed(3)})`;

const eyebrow = "font-mono text-xs uppercase tracking-[0.12em] text-muted";
const h2 = "mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1] tracking-[-0.04em]";
const em = "font-serif font-normal tracking-normal text-accent";

function Scene({ id, index, children }: { id: string; index: number; children: React.ReactNode }) {
  return (
    <section id={`scene-${id}`} data-scene={index} aria-label={SCENES[index].label} className="flex min-h-[72svh] scroll-mt-16 items-center py-14 lg:min-h-[calc(100svh-4rem)]">
      <div className="w-full max-w-lg">{children}</div>
    </section>
  );
}

export function Storyboard() {
  const camRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(SCENES[0].id);
  const [connected, setConnected] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [untied, setUntied] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [inView, setInView] = useState(true);

  const go = useCallback((id: string) => {
    const el = document.getElementById(`scene-${id}`);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -64, duration: 1.4 });
    else el.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth" });
    el.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
  }, []);

  // Camera: one scrubbed tween per scene, from the previous key to its own.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ autoRaf: false });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const cam = { ...SCENES[0].cam };
      const apply = () => camRef.current?.setAttribute("transform", camTransform(cam));
      SCENES.slice(1).forEach((sc, k) => {
        gsap.fromTo(cam, { ...SCENES[k].cam }, {
          ...sc.cam,
          ease: "power2.inOut",
          immediateRender: false,
          onUpdate: apply,
          scrollTrigger: { trigger: `#scene-${sc.id}`, start: "top bottom", end: "top 35%", scrub: 0.8 },
        });
      });

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  // Active scene for the rail, story state and the reduced-motion camera.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-scene]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(SCENES[Number((e.target as HTMLElement).dataset.scene)].id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const root = rootRef.current;
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (root) vis.observe(root);
    return () => {
      io.disconnect();
      vis.disconnect();
    };
  }, []);

  useEffect(() => {
    if (active !== "cover") setUntied(true);
    if (active === "impact" || active === "cta") setConnected(true);
    if (active === "cta") setSealed(true);
    if (reducedRef.current) {
      const key = SCENES.find((s) => s.id === active)?.cam;
      if (key) camRef.current?.setAttribute("transform", camTransform(key));
    }
  }, [active]);

  const place = () => {
    setPlaced(true);
    setConnected(true);
  };

  return (
    <div ref={rootRef} className="rm-lace">
      <a href="#scene-cta" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-50 focus:border focus:border-foreground focus:bg-surface focus:px-4 focus:py-2">
        Skip storyboard
      </a>
      <PearlCursor />

      <div className="mx-auto grid w-full max-w-page lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 lg:px-10">
        {/* The stage: sticky map with a camera. */}
        <div className="sticky top-16 z-10 h-[36svh] border-b border-foreground bg-background lg:order-2 lg:h-[calc(100svh-4rem)] lg:self-start lg:border-x lg:border-b-0">
          <RoadmapMap ref={camRef} connected={connected} sealed={sealed} active={active} transform={camTransform(SCENES[0].cam)} paused={!inView} />
          <p aria-live="polite" className="absolute bottom-3 left-3 border border-foreground bg-surface px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em]">
            {connected ? "Path connected" : "Path with gaps"}
          </p>
        </div>

        {/* The story. */}
        <div className="px-4 sm:px-6 lg:order-1 lg:px-0">
          <Scene id="cover" index={0}>
            <p className={eyebrow}>A storyboard · 6 stops</p>
            <h1 tabIndex={-1} className="mt-4 text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.045em] outline-none">
              Follow one patient through your <span className={em}>clinic</span>.
            </h1>
            <p className="mt-5 text-lg text-muted">Six stops, a few gaps, and where we come in.</p>
            <div className="mt-8 flex items-center gap-6">
              <button type="button" onClick={() => { setUntied(true); setTimeout(() => go(STAGES[0].id), reducedRef.current ? 0 : 450); }} className="rm-press group inline-flex min-h-12 items-center gap-4 border border-foreground bg-accent px-5 font-semibold text-white">
                Begin <Arrow />
              </button>
              <Bow untied={untied} className="h-20 w-32" />
            </div>
          </Scene>

          {STAGES.map((st, i) => (
            <Scene key={st.id} id={st.id} index={i + 1}>
              <p className={eyebrow}>{String(i + 1).padStart(2, "0")} / {st.name}</p>
              <h2 tabIndex={-1} className={`${h2} outline-none`}>{st.headline}</h2>
              <div className="mt-8"><StageCard stage={st} index={i} /></div>
            </Scene>
          ))}

          <Scene id="fit" index={7}>
            <p className={eyebrow}>07 / Where we fit</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>We fill the <span className={em}>gaps</span> around care.</h2>
            <p className="mt-4 text-muted">Small clinics have the care. What they lack is the staff and software a big system has at every stop.</p>
            <div className="mt-8"><FitPuzzle placed={placed} onPlace={place} /></div>
          </Scene>

          <Scene id="with" index={8}>
            <p className={eyebrow}>08 / With and without</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>Same visit, fewer <span className={em}>steps</span>.</h2>
            <div className="mt-6"><RibbonToggle on={connected} onChange={setConnected} /></div>
            <div className="mt-6"><BeadWorkflow withUs={connected} /></div>
          </Scene>

          <Scene id="untangle" index={9}>
            <p className={eyebrow}>09 / Before and after</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>Untangle the front desk.</h2>
            <p className="mt-4 text-muted">Drag the divider. On the left, a patient bounces between calls, forms and people. On the right, one hop.</p>
            <div className="mt-8"><BeforeAfter /></div>
          </Scene>

          <Scene id="time" index={10}>
            <p className={eyebrow}>10 / Time back</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>Time back, <span className={em}>roughly</span>.</h2>
            <div className="mt-8"><TimeCalculator /></div>
          </Scene>

          <Scene id="impact" index={11}>
            <p className={eyebrow}>11 / Impact</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>What changes for your front desk.</h2>
            <div className="mt-8 grid gap-8">
              <SelfChecklist />
              <Counters />
            </div>
          </Scene>

          <Scene id="cta" index={12}>
            <p className={eyebrow}>12 / Start</p>
            <h2 tabIndex={-1} className={`${h2} outline-none`}>Tell us how your clinic <span className={em}>runs</span>.</h2>
            <p className="mt-4 text-muted">Free for clinics. We reply within two business days.</p>
            <div className="mt-8 flex items-center gap-6">
              <Link href="/request" className="rm-press group inline-flex min-h-12 items-center gap-4 border border-foreground bg-accent px-5 font-semibold text-white">
                Request a project <Arrow />
              </Link>
              {sealed && <Seal className="size-20" />}
            </div>
          </Scene>
        </div>
      </div>

      {/* Progress rail: pearl dots. */}
      <nav aria-label="Storyboard progress" className={`fixed z-30 transition-opacity duration-300 max-lg:inset-x-0 max-lg:bottom-3 max-lg:flex max-lg:justify-center lg:right-4 lg:top-1/2 lg:-translate-y-1/2 ${inView ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <ol className="flex gap-0.5 border border-foreground bg-surface px-1 py-1 lg:flex-col">
          {SCENES.map((sc) => {
            const on = sc.id === active;
            return (
              <li key={sc.id} className="group relative">
                <a
                  href={`#scene-${sc.id}`}
                  aria-current={on ? "step" : undefined}
                  onClick={(e) => { e.preventDefault(); go(sc.id); }}
                  className="grid size-6 place-items-center"
                >
                  <span className={`block rounded-full border border-foreground transition-all duration-200 ${on ? "size-3 bg-accent" : "size-2 bg-surface-alt group-hover:size-2.5"}`} />
                  <span className="sr-only">{sc.label}</span>
                </a>
                <span aria-hidden className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap border border-foreground bg-surface px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 lg:block">
                  {sc.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
