'use client';

/* -------------------------------------------------------------------------- */
/*  BOOK-TO-FILM  —  "Turn Your Book Into a Film or Animated Video Series"     */
/*  Matches the Figma frame "Html → Body" (duck-book-yt-page-new).             */
/*                                                                            */
/*  Fully responsive; card rows become snap-scroll strips on phones.          */
/*  // EXPORT: marks spots that still want a real Figma export.                */
/* -------------------------------------------------------------------------- */

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Star, Play, CheckCircle2, Clock,
  ShieldCheck, Film, Clapperboard, Sparkles, Globe, Heart, Video, Award,
  PenTool, Palette, Send, Lock, FileLock2, TrendingUp, ArrowRight, Calendar,
  Smile, Crown, Aperture, Infinity as InfinityIcon, Hexagon, PawPrint,
} from 'lucide-react';
import Footer from '../components/Footer';
import CalendlyInlineEmbed from '../components/CalendlyInlineEmbed';

const MOBILE_ROW =
  'flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:px-0 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const CREAM = '#FAF8F5';
const BROWN = '#6B4A28';

/* -------------------------------------------------------------------------- */
/*  HEADER                                                                     */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/books', label: 'Books' },
  { href: '/authors', label: 'Author' },
  { href: '/services', label: 'Services' },
  { href: '/book-to-film', label: 'Film', active: true },
  { href: '/yt-sharks', label: 'Youtube' },
  { href: '/careers', label: 'Careers' },
];

const SiteHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-5 lg:px-8">
        <div className="relative bg-white rounded-full shadow-[0_8px_26px_-12px_rgba(0,0,0,0.14)] pl-3 pr-3 sm:pl-4 sm:pr-2 py-1.5 sm:py-2 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/duck-logo-final.png"
              alt="Duck Book Writers"
              width={159}
              height={159}
              className="object-contain w-[80px] h-[42px] sm:w-[100px] sm:h-[50px] lg:w-[116px] lg:h-[56px]"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] xl:text-[14px] whitespace-nowrap transition-colors ${
                  l.active ? 'text-neutral-900 font-bold' : 'text-neutral-800 font-medium hover:text-[#F1B300]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="#booking"
              className="hidden sm:inline-flex items-center justify-center bg-[#F1B300] hover:bg-[#dba200] text-[#1A2233] text-[13px] xl:text-[14px] font-bold px-5 xl:px-6 py-2 xl:py-2.5 rounded-full transition-colors"
            >
              Bring My Story to Life
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden p-2 text-neutral-900"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-2 bg-white rounded-3xl shadow-xl px-5 py-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2.5 text-base ${l.active ? 'text-neutral-900 font-bold' : 'text-neutral-800'}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="#booking"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center bg-[#F1B300] text-[#1A2233] font-bold px-6 py-2.5 rounded-full"
                >
                  Bring My Story to Life
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

/* -------------------------------------------------------------------------- */
/*  SHARED BITS                                                                */
/* -------------------------------------------------------------------------- */

const Reveal = ({
  children, delay = 0, y = 22, className = '',
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const EYEBROW_COLORS = {
  amber: { bg: '#F7EFE0', dot: '#F1B300', text: '#B07E00' },
  red: { bg: '#FDECEC', dot: '#E5484D', text: '#C0343A' },
} as const;

const Eyebrow = ({ children, color = 'amber' }: { children: React.ReactNode; color?: keyof typeof EYEBROW_COLORS }) => {
  const c = EYEBROW_COLORS[color];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em]"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {children}
    </span>
  );
};

const SectionHeading = ({
  eyebrow, eyebrowColor = 'amber', children, sub, center = true,
}: {
  eyebrow?: React.ReactNode; eyebrowColor?: keyof typeof EYEBROW_COLORS;
  children: React.ReactNode; sub?: React.ReactNode; center?: boolean;
}) => (
  <Reveal className={center ? 'text-center max-w-[760px] mx-auto' : ''}>
    {eyebrow && <div className="mb-3"><Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow></div>}
    <h2 className="font-['Poppins'] font-bold text-[27px] sm:text-[36px] md:text-[42px] lg:text-[46px] leading-[1.12] text-[#1A2233] tracking-tight">
      {children}
    </h2>
    {sub && (
      <p className="mt-3 sm:mt-4 font-['Poppins'] text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-500 leading-[1.6]">
        {sub}
      </p>
    )}
  </Reveal>
);

/* Amber check row used in the booking card + two-ways cards */
const CheckItem = ({ children, color = '#F1B300' }: { children: React.ReactNode; color?: string }) => (
  <li className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-neutral-700">
    <CheckCircle2 size={18} className="mt-px shrink-0" style={{ color }} />
    <span>{children}</span>
  </li>
);

/* -------------------------------------------------------------------------- */
/*  HERO                                                                       */
/* -------------------------------------------------------------------------- */

const TRUST = [
  { icon: Star, label: 'Trustpilot', fg: '#00B67A' },
  { icon: Hexagon, label: 'Clutch', fg: '#E62415' },
  { icon: PawPrint, label: 'Bark', fg: '#17B0A0' },
];

const Hero = () => (
  <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-14 sm:pb-20">
    <div className="pointer-events-none absolute -top-24 right-0 w-[460px] h-[460px] rounded-full bg-[#F1B300]/10 blur-3xl" />
    <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-10 items-center">
        {/* Left copy */}
        <div>
          <Reveal y={16}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF6DC] text-[#9A6B00] ring-1 ring-[#F1B300]/40 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase">
              <Sparkles size={12} className="text-[#F1B300]" /> New: Cinema Trailer &amp; Series Production Available
              <ArrowRight size={12} />
            </span>
          </Reveal>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-5 font-['Poppins'] font-extrabold text-[30px] leading-[1.1] sm:text-[38px] lg:text-[40px] xl:text-[42px] text-[#1A2233] tracking-[-0.02em]"
          >
            <span className="lg:whitespace-nowrap">Turn Your Book Into a Film</span>
            <br />
            <span className="lg:whitespace-nowrap">or <span className="text-[#F1B300]">Animated Video</span> Series</span>
          </motion.h1>

          <Reveal y={16} delay={0.1}>
            <p className="mt-5 flex items-center gap-2 font-['Poppins'] font-semibold text-[15px] sm:text-[18px] text-[#1A2233]">
              <Sparkles size={16} className="text-[#F1B300]" /> Your Story Deserves to Be Seen, Not Just Read.
            </p>
            <p className="mt-3 font-['Poppins'] text-[14px] sm:text-[15px] text-neutral-500 leading-[1.65] max-w-[560px]">
              For ambitious authors &amp; writers with a published book, manuscript, or great idea who are ready to build a
              global media presence and captive audience through cinematic video storytelling.
            </p>
          </Reveal>

          <Reveal y={16} delay={0.2}>
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="#booking"
                className="inline-flex items-center justify-center gap-2 bg-[#F1B300] hover:bg-[#dba200] text-[#1A2233] font-bold text-[15px] px-7 py-3.5 rounded-full shadow-[0_14px_34px_-12px_rgba(241,179,0,0.7)] transition-all hover:scale-[1.02]"
              >
                Bring My Story to Life <ArrowRight size={17} />
              </Link>
              <Link
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1A2233] font-bold text-[15px] px-7 py-3.5 rounded-full ring-1 ring-black/10 shadow-sm hover:ring-black/20 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-[#F1B300] grid place-items-center">
                  <Play size={11} className="text-white fill-white translate-x-px" />
                </span>
                Watch Animation Samples
              </Link>
            </div>
          </Reveal>

          <Reveal y={16} delay={0.3}>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} className="fill-[#F1B300] text-[#F1B300]" />
                    ))}
                  </div>
                  <span className="font-bold text-[#1A2233] text-[14px]">4.9/5</span>
                </div>
                <p className="mt-1 text-[12px] text-neutral-500">Excellent based on 1,000+ Cinema Channels</p>
              </div>
              <div className="flex items-center gap-2">
                {TRUST.map((t) => (
                  <span key={t.label} className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-black/[0.08] px-3 py-1.5 text-[11px] font-bold text-neutral-600">
                    <t.icon size={13} style={{ color: t.fg }} className={t.label === 'Trustpilot' ? 'fill-current' : ''} />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right visual — live booking calendar + floating badges */}
        <Reveal y={30} delay={0.2} className="relative mx-auto w-full max-w-[500px]">
          <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_26px_60px_-28px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.05]">
            <CalendlyInlineEmbed containerId="calendly-book-to-film-hero" heightPx={640} heightPxMobile={640} className="w-full" />
          </div>
          <div className="absolute -bottom-5 -left-2 sm:-left-5 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 px-3.5 py-2.5 flex items-center gap-2 z-10">
            <Clock size={18} className="text-[#F1B300]" />
            <div className="leading-tight">
              <p className="font-bold text-[13px] text-[#1A2233]">14 Days</p>
              <p className="text-[10px] text-neutral-500">Turnaround</p>
            </div>
          </div>
          <div className="absolute -bottom-5 right-2 sm:right-4 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 px-3.5 py-2.5 flex items-center gap-2 z-10">
            <Award size={18} className="text-[#17B0A0]" />
            <p className="font-bold text-[12px] text-[#1A2233] leading-tight">Golden Laurel<br />Winner</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  PROBLEM — "The Discoverability Crisis"                                     */
/* -------------------------------------------------------------------------- */

const PAINS = [
  { icon: Globe, title: 'Trapped in Algorithms', desc: 'Static bookstore keywords leave stories completely invisible.', tint: '#FDECEC', fg: '#E5484D' },
  { icon: Video, title: 'Zero Visual Presence', desc: 'No trailers, clips, or animation for modern social discovery.', tint: '#FBF4DD', fg: '#C9920A' },
  { icon: TrendingUp, title: 'Rising Ad Costs', desc: 'Traditional pay-per-click ads drain royalties with zero residual equity.', tint: '#FDEDE2', fg: '#E8803A' },
];

const Problem = () => (
  <section className="relative bg-white py-14 sm:py-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        <div>
          <Reveal>
            <Eyebrow color="red">The Discoverability Crisis</Eyebrow>
            <h2 className="mt-3 font-['Poppins'] font-bold text-[27px] sm:text-[34px] lg:text-[40px] leading-[1.14] text-[#1A2233] tracking-tight">
              You&apos;ve Written a Book. But How Many People Have Discovered It?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[14px] text-neutral-500 leading-[1.7]">
              Over 4 million new books are published each year. Even extraordinary, heartwarming, and thrilling stories get
              buried under digital shelves. Modern readers rarely browse endless text pages — instead, millions spend their
              evenings binge-watching narrative videos on YouTube, Netflix, and TikTok.
            </p>
            <p className="mt-3 text-[14px] text-neutral-500 leading-[1.7]">
              Video isn&apos;t just an optional marketing tactic; it is the primary medium where 21st-century audiences fall
              in love with characters, universes, and authors.
            </p>
          </Reveal>

          <div className={`${MOBILE_ROW} mt-6 gap-3 pb-3 md:pb-0 md:grid md:grid-cols-3`}>
            {PAINS.map((p, i) => (
              <Reveal key={p.title} delay={0.15 + i * 0.08} className="shrink-0 w-[72%] max-w-[240px] snap-start md:w-auto md:max-w-none">
                <div className="h-full rounded-2xl p-4" style={{ backgroundColor: p.tint }}>
                  <p.icon size={22} style={{ color: p.fg }} />
                  <h3 className="mt-3 font-['Poppins'] font-bold text-[14px] text-[#1A2233]">{p.title}</h3>
                  <p className="mt-1 text-[12px] text-neutral-600 leading-[1.5]">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="relative rounded-[28px] overflow-hidden shadow-[0_30px_70px_-34px_rgba(0,0,0,0.4)] aspect-[4/3.6] max-w-[520px] mx-auto">
            {/* EXPORT: author/woman reading image */}
            <Image src="/youtube-page/why_youtube.png" alt="Author whose book reached a new audience" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-lg">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Cinematic Lift</p>
                <p className="text-[15px] font-extrabold text-[#1A2233]">+400% Audience Growth</p>
              </div>
              <span className="w-9 h-9 rounded-full bg-[#17B0A0] text-white grid place-items-center">
                <TrendingUp size={18} />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  WHY VIDEO — stats + feature strip                                          */
/* -------------------------------------------------------------------------- */

const BIG_STATS = [
  { value: '82%', color: '#F1B300', label: 'Global Internet Traffic', desc: 'Of all internet traffic is video consumption. Video is the undisputed language of modern digital audiences and future readers.', src: 'Source: Cisco Annual Internet Report' },
  { value: '10x', color: BROWN, label: 'Emotional Recall', desc: 'Higher engagement and emotional connection when viewers experience characters through cinematic animation vs. static book blurbs.', src: 'Source: Digital Narrative Studies' },
  { value: '300+', color: BROWN, label: 'Global Channels Reached', desc: 'Simultaneous distribution across YouTube, streaming networks, and social search channels to funnel warm leads directly to book sales.', src: 'Duck Book Writers Syndication Matrix' },
];

const FEATURES = [
  { icon: Globe, title: 'Global Audience Reach', desc: 'Unlock YouTube search, video suggestions, and organic discovery worldwide.' },
  { icon: Aperture, title: 'World Visualization', desc: 'See your fictional world, magic systems, and heroes rendered in vibrant visual motion.' },
  { icon: Smile, title: 'Deep Emotional Spark', desc: 'Voice acting, cinematic scoring, and dramatic pacing hook casual viewers instantly.' },
  { icon: InfinityIcon, title: 'Scalable Promotion', desc: 'Permanent, evergreen video assets recruit readers 24 hours a day, 365 days a year.' },
  { icon: Crown, title: 'Franchise Authority', desc: 'Position yourself not just as an author, but as a modern multimedia franchise creator.' },
];

const WhyVideo = () => (
  <section className="relative bg-white py-14 sm:py-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Proven Impact" sub="Numbers do not lie. Modern audience psychology prioritizes moving visuals and high-fidelity sound over flat print.">
        Why Bring Your Book to Video?
      </SectionHeading>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {BIG_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="h-full rounded-[20px] bg-white ring-1 ring-black/[0.06] shadow-[0_12px_34px_-24px_rgba(0,0,0,0.3)] p-6 sm:p-7">
              <p className="font-['Poppins'] font-extrabold text-[46px] sm:text-[52px] leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="mt-2 font-['Poppins'] font-bold text-[16px] text-[#1A2233]">{s.label}</p>
              <p className="mt-2 text-[13px] text-neutral-500 leading-[1.6]">{s.desc}</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{s.src}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className={`${MOBILE_ROW} mt-5 gap-4 pb-4 md:pb-0 md:grid md:grid-cols-5`}>
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06} className="shrink-0 w-[68%] max-w-[240px] snap-start md:w-auto md:max-w-none">
            <div className="h-full rounded-2xl bg-white ring-1 ring-black/[0.05] shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="w-11 h-11 rounded-full bg-[#FBF2D8] text-[#C9920A] grid place-items-center">
                <f.icon size={19} />
              </span>
              <h3 className="mt-3 font-['Poppins'] font-bold text-[14px] text-[#1A2233]">{f.title}</h3>
              <p className="mt-1 text-[12px] text-neutral-500 leading-[1.5]">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  TWO WAYS                                                                   */
/* -------------------------------------------------------------------------- */

const VideoPreview = ({ id, labels }: { id: string; labels?: [string, string] }) => {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video rounded-[16px] overflow-hidden bg-black">
      {play ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title="Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0">
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" unoptimized />
          <span className="absolute inset-0 grid place-items-center">
            <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur grid place-items-center ring-1 ring-white/30 group-hover:scale-110 transition-transform">
              <Play size={24} className="text-white fill-white translate-x-0.5" />
            </span>
          </span>
          {labels && (
            <>
              <span className="absolute bottom-3 left-3 text-[10px] text-white font-medium bg-black/50 rounded px-2 py-0.5">{labels[0]}</span>
              <span className="absolute bottom-3 right-3 text-[10px] text-[#F1B300] font-semibold bg-black/50 rounded px-2 py-0.5">{labels[1]}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

const WAYS = [
  {
    cornerL: 'Cinema Experience', cornerR: '10–15 Minutes · 4K', popular: false, videoId: '05OWsG4sSX8', labels: undefined as undefined | [string, string],
    title: 'Animated Short Film',
    desc: 'A comprehensive, high-retention cinematic trailer and standalone short film encapsulating your story’s most dramatic arcs, climax, and emotional core.',
    items: [
      'Complete Hollywood-adapted visual screenplay',
      'Bespoke 2D/3D character design & concept backgrounds',
      'Studio voiceover narration & full orchestral scoring',
      'Turnkey YouTube & film festival distribution package',
    ],
    cta: 'Explore Short Film Production', ctaFilled: false, checkColor: '#27AE60',
  },
  {
    cornerL: 'Franchise Builder', cornerR: 'Multi-Episode Series', popular: true, videoId: 'K18Tnq7sC6M', labels: ['Ep 1: The Inciting Incident', 'Serialized Traffic'] as [string, string],
    title: 'Animated Episodic Video Series',
    desc: 'Transform each chapter into serial animated episodes engineered for binge-watching algorithms, long-term audience retention, and recurring monetized traffic.',
    items: [
      'Episodic cliffhanger scripting for algorithmic binge watch',
      'Recurring character sheets with emotional facial rigs',
      'High-CTR serialized YouTube thumbnail package',
      'Integrated direct-to-book sales checkout funnels',
    ],
    cta: 'Explore Animated Series Production', ctaFilled: true, checkColor: '#F1B300',
  },
];

const TwoWays = () => (
  <section className="relative py-14 sm:py-20" style={{ backgroundColor: CREAM }}>
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Premium Production Formats" sub="Whether you need a high-impact standalone cinematic film or an episodic narrative that builds a dedicated fanbase.">
        Two Exciting Ways to Bring Your Story to Life
      </SectionHeading>

      <div className={`${MOBILE_ROW} mt-10 gap-5 pb-4 md:pb-0 md:grid md:grid-cols-2 md:gap-6 items-stretch`}>
        {WAYS.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.1} className="shrink-0 w-[88%] max-w-[520px] snap-center md:w-auto md:max-w-none">
            <div className={`relative h-full flex flex-col rounded-[24px] bg-white ring-1 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)] p-5 sm:p-6 ${w.popular ? 'ring-[#F1B300]/60' : 'ring-black/[0.06]'}`}>
              {w.popular && (
                <span className="absolute -top-3 right-5 rounded-full bg-[#F1B300] text-[#1A2233] text-[10px] font-bold uppercase tracking-wide px-3 py-1 shadow">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-[#C9920A]">{w.cornerL}</span>
                <span className="text-neutral-400">{w.cornerR}</span>
              </div>

              <div className="mt-3">
                <VideoPreview id={w.videoId} labels={w.labels} />
              </div>

              <h3 className="mt-5 font-['Poppins'] font-bold text-[20px] sm:text-[22px] text-[#1A2233]">{w.title}</h3>
              <p className="mt-2 text-[13px] text-neutral-500 leading-[1.6]">{w.desc}</p>

              <ul className="mt-4 space-y-2.5 flex-1">
                {w.items.map((it) => (
                  <CheckItem key={it} color={w.checkColor}>{it}</CheckItem>
                ))}
              </ul>

              <Link
                href="#booking"
                className={`mt-6 inline-flex items-center justify-center gap-2 font-bold text-[14px] py-3 rounded-full transition-colors ${
                  w.ctaFilled ? 'bg-[#F1B300] hover:bg-[#dba200] text-[#1A2233]' : 'bg-white text-[#1A2233] ring-1 ring-black/15 hover:ring-black/30'
                }`}
              >
                {w.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  HOW IT WORKS — 5 steps                                                     */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { no: '01', icon: PenTool, title: 'Share Your Story', desc: 'Send your manuscript, outline, or concept. We conduct an in-depth narrative audit to identify viral storylines.', badgeBg: '#F1B300', badgeFg: '#fff' },
  { no: '02', icon: Palette, title: 'Script & Characters', desc: 'Our Hollywood-trained screenwriters adapt key scenes into visual scripts and sculpt character style models.', badgeBg: '#ECD9B0', badgeFg: '#8A6D2E' },
  { no: '03', icon: Sparkles, title: '40s Animation Sample', tag: 'First-Week Guarantee', desc: 'Receive a custom 40-second animated scene sample within your first 7 days for review and approval.', badgeBg: '#F2994A', badgeFg: '#fff', highlight: true },
  { no: '04', icon: Film, title: 'Full Animation', desc: 'Animators, voice actors, and audio designers execute full animation with sound effects and custom scoring.', badgeBg: '#ECD9B0', badgeFg: '#8A6D2E' },
  { no: '05', icon: Send, title: 'Publish & Share', desc: 'Global release on YouTube and 300+ platforms with SEO optimization, title testing, and direct book funnels.', badgeBg: '#27AE60', badgeFg: '#fff' },
];

const HowItWorks = () => (
  <section className="relative bg-white py-14 sm:py-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="The 7-Day Roadmap" sub="From your manuscript to the screen in 5 simple steps.">
        How Does Book-to-Video Work?
      </SectionHeading>

      <div className={`${MOBILE_ROW} mt-10 gap-4 pb-4 md:pb-0 md:grid md:grid-cols-5 items-stretch`}>
        {STEPS.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.07} className="shrink-0 w-[70%] max-w-[250px] snap-start md:w-auto md:max-w-none">
            <div className={`h-full rounded-[20px] p-5 transition-shadow hover:shadow-md ${s.highlight ? 'bg-[#FFF9ED] ring-1 ring-[#F2994A]/40' : 'bg-white ring-1 ring-black/[0.06]'}`}>
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full grid place-items-center font-['Poppins'] font-bold text-[13px]" style={{ backgroundColor: s.badgeBg, color: s.badgeFg }}>
                  {s.no}
                </span>
                <s.icon size={18} className="text-neutral-300" />
              </div>
              {s.tag && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#F2994A]/15 text-[#C76A1E] text-[9px] font-bold uppercase tracking-wide px-2 py-0.5">
                  <Sparkles size={9} /> {s.tag}
                </span>
              )}
              <h3 className="mt-2 font-['Poppins'] font-bold text-[15px] text-[#1A2233]">{s.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-neutral-500 leading-[1.55]">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#FAF8F5] ring-1 ring-black/[0.05] px-5 sm:px-7 py-5">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldCheck size={22} className="text-[#F1B300] shrink-0" />
            <div>
              <p className="font-['Poppins'] font-bold text-[15px] text-[#1A2233]">100% Satisfaction &amp; Revision Guarantee</p>
              <p className="text-[12.5px] text-neutral-500">You sign off on script, character art, and animation drafts before we progress.</p>
            </div>
          </div>
          <Link href="#booking" className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#1A2233] hover:bg-black text-white font-bold text-[14px] px-6 py-3 rounded-full transition-colors">
            Start Your 7-Day Roadmap <ArrowRight size={15} />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  GENRES                                                                     */
/* -------------------------------------------------------------------------- */

const GENRES = [
  { img: '/youtube-page/book-1.png', tag: 'Fantasy & Adventure', title: 'The Lost Healer', desc: 'Glowing mystical aesthetics, sweeping magical landscapes, and fluid spellcast animation that captures epic worldbuilding.' },
  { img: '/youtube-page/book-2.png', tag: "Children's Stories", title: 'Whimsical 2D Worlds', desc: 'Vibrant, friendly character design with lively walk cycles and heartwarming narrator voices that delight young readers and parents.' },
  { img: '/youtube-page/book-3.png', tag: 'Romance & Drama', title: 'Return to Me', desc: 'Emotive close-ups, warm sunset color palettes, subtle facial expressions, and acoustic string scores that evoke deep longing.' },
  { img: '/youtube-page/book-4.png', tag: 'Science Fiction', title: 'Paradox & Beyond', desc: 'Futuristic neon holograms, deep-space visual dynamics, tense synthesized sound design, and time-bending story pacing.' },
  { img: '/youtube-page/book-5.png', tag: 'Historical & Memoir', title: 'Historical Narratives', desc: 'Authentic period textures, documentary-style voiceovers, and historical accuracy that establish unmatched authority.' },
  { img: '/youtube-page/book-6.png', tag: 'Mystery & Thriller', title: 'Fatal Exchange', desc: 'Noir shadows, suspenseful heartbeat sound effects, rapid-cut cliffhangers, and psychological tension that demand answers.' },
];

const Genres = () => (
  <section className="relative py-14 sm:py-20" style={{ backgroundColor: CREAM }}>
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Cinematic Versatility" sub="From epic high-fantasy worldbuilding to intimate memoirs and fast-paced thrillers, our animation studio matches the visual language of your genre.">
        What Will Your Book Look Like on Screen?
      </SectionHeading>

      <div className={`${MOBILE_ROW} mt-10 gap-5 pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6`}>
        {GENRES.map((g, i) => (
          <Reveal key={g.title} delay={(i % 3) * 0.08} className="shrink-0 w-[78%] max-w-[380px] snap-start md:w-auto md:max-w-none">
            <div className="group h-full rounded-[20px] bg-white ring-1 ring-black/[0.06] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                {/* EXPORT: swap for genre art */}
                <Image src={g.img} alt={g.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-3 left-3 rounded-md bg-white/95 backdrop-blur text-[#1A2233] text-[9.5px] font-bold uppercase tracking-wide px-2.5 py-1 shadow-sm">
                  {g.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-['Poppins'] font-bold text-[17px] text-[#1A2233]">{g.title}</h3>
                <p className="mt-1.5 text-[13px] text-neutral-500 leading-[1.55]">{g.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-9 flex flex-col items-center gap-3">
        <Link href="#booking" className="inline-flex items-center justify-center gap-2 bg-[#F1B300] hover:bg-[#dba200] text-[#1A2233] font-bold text-[14px] px-7 py-3 rounded-full shadow-[0_14px_32px_-14px_rgba(241,179,0,0.7)] transition-all hover:scale-[1.02]">
          <Calendar size={16} /> Discuss My Story Genre
        </Link>
        <p className="text-[12.5px] text-neutral-400">Don&apos;t see your genre? We craft custom visual treatments for every book.</p>
      </Reveal>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  SHOWCASE — TV + functional tabs + thumbs                                   */
/* -------------------------------------------------------------------------- */

const SHOWCASE_TABS = [
  { label: 'All Projects', key: 'all' },
  { label: 'Animated Short Films', key: 'short' },
  { label: 'Episodic Video Series', key: 'episodic' },
  { label: 'Character Design Samples', key: 'character' },
  { label: 'Trailers & Clips', key: 'trailer' },
];

const SHOWCASE_VIDEOS = [
  { id: 'ha1NneZGm7A', dur: '18:42', title: 'The Entire History of Human Civilizations', desc: 'Documentary-style animation adapting a non-fiction history manuscript into high-yield educational video.', cats: ['all', 'short', 'trailer'] },
  { id: '7ChWjQ-vnEU', dur: '11:15', title: 'America Renewed: Chapter 1 Explained', desc: 'Cinematic narrative trailer that unlocked 85,000 algorithmic impressions in its first month.', cats: ['all', 'episodic', 'trailer'] },
  { id: '05OWsG4sSX8', dur: '09:20', title: 'Mabel: A Gothic Mystery', desc: 'Atmospheric shadows, Victorian set design, and haunting audio driving direct Kindle book downloads.', cats: ['all', 'short'] },
  { id: 'K18Tnq7sC6M', dur: '07:30', title: 'The White Wolf — The Making of John', desc: 'Recurring character model sheets and emotional facial rigs built for a serialized animated universe.', cats: ['all', 'character', 'episodic'] },
  { id: 'Ou80IomKkJ0', dur: '05:12', title: 'The Trainee Who Captured the Instructors', desc: 'A rapid-cut cinematic clip engineered for high click-through and binge retention.', cats: ['all', 'trailer', 'character'] },
  { id: 'VjTJvwgJnGc', dur: '04:08', title: 'The Little Red Hen — Narrated Story', desc: 'Friendly 2D character design and lively walk cycles for a children’s narrated adaptation.', cats: ['all', 'short', 'character'] },
];

const Showcase = () => {
  const [tab, setTab] = useState('all');
  const filtered = useMemo(() => SHOWCASE_VIDEOS.filter((v) => v.cats.includes(tab)), [tab]);
  const featured = filtered[0] ?? SHOWCASE_VIDEOS[0];
  const thumbs = filtered.slice(0, 3);

  return (
    <section id="showcase" className="relative bg-white py-14 sm:py-20 scroll-mt-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Work" sub="Explore actual productions, trailers, and animated chapter series we've crafted for independent and bestselling authors.">
          See What Book-to-Video Looks Like
        </SectionHeading>

        <div className={`${MOBILE_ROW} mt-8 gap-2.5 pb-3 md:pb-0 md:flex md:flex-wrap md:justify-center`}>
          {SHOWCASE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                tab === t.key ? 'bg-[#F1B300] text-[#1A2233]' : 'bg-[#FAF8F5] text-neutral-500 ring-1 ring-black/[0.06] hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TV */}
        <Reveal delay={0.05} className="mt-9">
          <div className="relative mx-auto max-w-[920px]">
            <div className="rounded-[18px] sm:rounded-[22px] bg-[#1A1A1A] p-2 sm:p-3 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] ring-1 ring-black/40">
              <div className="relative aspect-video rounded-[10px] sm:rounded-[14px] overflow-hidden bg-black">
                <iframe
                  key={featured.id}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${featured.id}`}
                  title={featured.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mx-auto mt-0 h-5 w-10 bg-[#2A2A2A]" />
            <div className="mx-auto h-2 w-48 sm:w-64 rounded-b-xl bg-[#1A1A1A]" />
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className={`${MOBILE_ROW} mt-9 gap-5 pb-4 md:pb-0 md:grid md:grid-cols-3`}
          >
            {thumbs.map((v) => (
              <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="group block shrink-0 w-[80%] max-w-[360px] snap-start md:w-auto md:max-w-none">
                <div className="relative aspect-video rounded-[16px] overflow-hidden bg-black shadow-sm">
                  <Image src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} fill className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" unoptimized />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="w-11 h-11 rounded-full bg-white/20 backdrop-blur grid place-items-center ring-1 ring-white/30">
                      <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-white bg-black/70 rounded px-1.5 py-0.5">{v.dur}</span>
                </div>
                <h3 className="mt-3 font-['Poppins'] font-bold text-[15px] text-[#1A2233] leading-snug">{v.title}</h3>
                <p className="mt-1 text-[12.5px] text-neutral-500 leading-[1.5]">{v.desc}</p>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  CREATIVE TEAM                                                              */
/* -------------------------------------------------------------------------- */

const TEAM = [
  { icon: Clapperboard, title: 'Complete Creative Process', desc: 'Zero subcontracting headaches. We manage every step in-house: scriptwriting, character sheets, storyboards, voice casting, animation, Foley audio, and final cinema mastering.' },
  { icon: ShieldCheck, title: 'Your Approval at Every Stage', desc: 'No unpleasant surprises. You participate in milestone checkpoints for script, character concept art, and animatic drafts before the full render goes into production.' },
  { icon: Palette, title: 'Consistent Characters & World', desc: 'Proprietary visual model sheets ensure your protagonist looks identical across all scenes and future episodes, establishing memorable character continuity.' },
  { icon: TrendingUp, title: 'Made for Digital Audiences', desc: 'Engineered with high-retention hooks, 3-second scene transitions, and narrative dynamics that YouTube algorithms heavily favor for organic distribution.' },
  { icon: Heart, title: 'A Team That Understands Authors', desc: 'Unlike cold video agencies, we are published authors and literary screenwriters ourselves. We treat your manuscript with reverence, preserving the emotional nuances, dialogue cadence, and thematic depth that made your book special in the first place.' },
];

const TeamCard = ({ item, n }: { item: typeof TEAM[number]; n: number }) => (
  <div className="h-full rounded-[20px] p-6 ring-1 ring-black/[0.05] hover:shadow-md transition-shadow" style={{ backgroundColor: CREAM }}>
    <span className="w-11 h-11 rounded-full bg-[#FBF2D8] text-[#C9920A] grid place-items-center">
      <item.icon size={19} />
    </span>
    <h3 className="mt-4 font-['Poppins'] font-bold text-[16px] text-[#1A2233]">{n}. {item.title}</h3>
    <p className="mt-2 text-[13px] text-neutral-500 leading-[1.6]">{item.desc}</p>
  </div>
);

const CreativeTeam = () => (
  <section className="relative bg-white py-14 sm:py-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="The Duck Advantage" sub="We combine the editorial rigor of veteran book editors with the visual wizardry of Hollywood animators.">
        Your Story. Your Vision. Our Creative Team.
      </SectionHeading>

      {/* 3 + 2 layout, both rows span the full width so there is no empty gap */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEAM.slice(0, 3).map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}><TeamCard item={t} n={i + 1} /></Reveal>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TEAM.slice(3).map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}><TeamCard item={t} n={i + 4} /></Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  BOOKING                                                                    */
/* -------------------------------------------------------------------------- */

const CALL_POINTS = [
  'Walk through Book-to-Cinema with our executive team',
  'Receive tailored format & budget recommendations',
  '100% Hassle-Free & Confidentiality Guarantee',
];

const Booking = () => (
  <section id="booking" className="relative py-14 sm:py-20 scroll-mt-24" style={{ backgroundColor: CREAM }}>
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Next Step" sub="Don't let your story stay hidden on the page. Join authors reaching hundreds of thousands of new fans through cinematic animation.">
        Your Book Could Be the Next Story People Watch.
      </SectionHeading>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-6 items-stretch">
        <Reveal>
          <div className="h-full rounded-[24px] bg-white ring-1 ring-black/[0.06] shadow-sm p-7 sm:p-9 flex flex-col">
            <Eyebrow>Free Strategy Call</Eyebrow>
            <h3 className="mt-3 font-['Poppins'] font-bold text-[23px] sm:text-[27px] leading-tight text-[#1A2233]">
              Book Your Free 30-Minute Creative Strategy Call
            </h3>
            <p className="mt-3 text-[14px] text-neutral-500 leading-[1.65]">
              Walk through your story with our creative directors. We&apos;ll examine your manuscript, recommend ideal formats,
              and present your 7-day roadmap with zero obligation.
            </p>
            <ul className="mt-6 space-y-3.5 flex-1">
              {CALL_POINTS.map((c) => <CheckItem key={c}>{c}</CheckItem>)}
            </ul>
            <div className="mt-7 flex items-center gap-5 text-[12px] font-semibold text-neutral-400">
              <span className="inline-flex items-center gap-1.5"><Lock size={14} className="text-[#F1B300]" /> 256-Bit SSL Encrypted</span>
              <span className="inline-flex items-center gap-1.5"><FileLock2 size={14} className="text-[#F1B300]" /> NDA Protected</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.06] shadow-sm">
            <CalendlyInlineEmbed containerId="calendly-book-to-film" heightPx={680} heightPxMobile={680} className="w-full" />
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                        */
/* -------------------------------------------------------------------------- */

const FAQS = [
  { q: 'Do I need a finished book to start?', a: 'Not at all. A completed manuscript, a rough outline, or even a strong concept is enough. Our narrative team helps shape the story into a cinematic, high-retention format during the creative audit.' },
  { q: 'How do I make money?', a: 'Your animated series acts as a 24/7 sales funnel — viewers discover your world on YouTube and click through directly to your book checkout. You keep 100% of your rights and royalties, plus any ad and channel revenue.' },
  { q: 'Why YouTube?', a: 'YouTube is the world’s second-largest search engine and the home of binge-watching audiences. Evergreen video keeps recruiting new readers for years, unlike paid ads that stop the moment you stop spending.' },
  { q: 'Is this really done in 7 days?', a: 'You receive a custom 40-second animation sample within your first 7 days for approval. Full productions then follow a fast, milestone-based timeline with a typical 14-day turnaround per episode.' },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative bg-white py-14 sm:py-20">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-['Poppins'] font-bold text-[27px] sm:text-[36px] lg:text-[42px] text-[#1A2233] tracking-tight">
            Frequently Asked <span className="text-[#F1B300]">Questions</span>
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 text-left py-5">
                <span className="font-['Poppins'] font-semibold text-[15px] sm:text-[17px] text-[#1A2233]">{f.q}</span>
                <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center transition-colors ${open === i ? 'bg-[#F1B300] text-white' : 'bg-[#FAF8F5] text-[#1A2233]'}`}>
                  {open === i ? <X size={15} /> : <span className="text-lg leading-none">+</span>}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="pb-5 pr-10 text-[14px] text-neutral-500 leading-[1.65]">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function BookToFilmPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <Problem />
      <WhyVideo />
      <TwoWays />
      <HowItWorks />
      <Genres />
      <Showcase />
      <CreativeTeam />
      <Booking />
      <Faq />
      <Footer />
    </main>
  );
}
