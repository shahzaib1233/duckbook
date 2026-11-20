'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star, Play, ThumbsUp, Share2, Flag, BadgeCheck } from 'lucide-react';
import Footer from '../components/Footer';
import CalendlyInlineEmbed from '../components/CalendlyInlineEmbed';

/** Children-book card gradient, sampled top-to-bottom from the Figma art */
const CHILDREN_GRADIENT =
  'linear-gradient(180deg, #7601E8 0%, #9408E0 8%, #B30FDA 16%, #D216D3 24%, #EB1BC7 32%, #EE15A6 42%, #F10F86 50%, #F50B66 58%, #FA0747 67%, #FC0126 74%, #FD1317 81%, #FE3011 87%, #FE6904 100%)';

/* Figma card typography: condensed display headings + Barlow body copy */
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

/* -------------------------------------------------------------------------- */
/*  SHAPED CARD — rounded polygon drawn in SVG at the card's real pixel size  */
/* -------------------------------------------------------------------------- */

type Pt = [number, number];

/** Phones: one swipeable row. Tablet and up: the element's own md:grid takes over. */
const MOBILE_ROW =
  'flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:px-0 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function roundedPolygonPath(pts: Pt[], radius: number): string {
  const n = pts.length;
  const corners = pts.map((p, i) => {
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const d1 = Math.hypot(prev[0] - p[0], prev[1] - p[1]);
    const d2 = Math.hypot(next[0] - p[0], next[1] - p[1]);
    const r = Math.min(radius, d1 / 2, d2 / 2);
    const a: Pt = [p[0] + ((prev[0] - p[0]) / d1) * r, p[1] + ((prev[1] - p[1]) / d1) * r];
    const b: Pt = [p[0] + ((next[0] - p[0]) / d2) * r, p[1] + ((next[1] - p[1]) / d2) * r];
    return { a, p, b };
  });
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  return (
    corners
      .map(({ a, p, b }, i) => `${i === 0 ? 'M' : 'L'} ${f(a)} Q ${f(p)} ${f(b)}`)
      .join(' ') + ' Z'
  );
}

const CREAM_STOPS: [string, string][] = [
  ['0%', '#FDFCFA'],
  ['45%', '#FAF8EC'],
  ['100%', '#F8F2DC'],
];

const ShapedCard = ({
  shape,
  radius = 56,
  className = '',
  style,
  children,
}: {
  /** Vertices in px, given the card's measured width and height. */
  shape: (w: number, h: number) => Pt[];
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const gradId = useId().replace(/:/g, '');

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative isolate ${className}`} style={style}>
      {size && (
        <svg
          aria-hidden
          width={size.w}
          height={size.h}
          className="absolute inset-0 -z-10 overflow-visible pointer-events-none"
          style={{ filter: 'drop-shadow(0 22px 26px rgba(0,0,0,0.10)) drop-shadow(0 2px 5px rgba(0,0,0,0.05))' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              {CREAM_STOPS.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <path d={roundedPolygonPath(shape(size.w, size.h), radius)} fill={`url(#${gradId})`} />
        </svg>
      )}
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  HEADER — pill-shaped white nav                                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/books', label: 'Books' },
  { href: '/authors', label: 'Author' },
  { href: '/services', label: 'Services' },
  { href: '/yt-sharks', label: 'Youtube', active: true },
  { href: '/news', label: 'Events' },
  { href: '/careers', label: 'Careers' },
];

const YtSharksHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4 bg-white/0">
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

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] xl:text-[14px] whitespace-nowrap transition-colors ${
                  l.active
                    ? 'text-neutral-900 font-bold'
                    : 'text-neutral-800 font-medium hover:text-[#F1B300]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="#calendly"
              className="hidden sm:inline-flex items-center justify-center bg-[#F1B300] hover:bg-[#dba200] text-white text-[13px] xl:text-[14px] font-bold px-5 xl:px-6 py-2 xl:py-2.5 rounded-full transition-colors"
            >
              Contact
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
                    className={`block py-2.5 text-base ${
                      l.active ? 'text-neutral-900 font-bold' : 'text-neutral-800'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="#calendly"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center bg-[#F1B300] text-white font-bold px-6 py-2.5 rounded-full"
                >
                  Contact
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
/*  HERO                                                                      */
/* -------------------------------------------------------------------------- */

const Hero = () => (
  <section className="relative overflow-hidden pt-6 sm:pt-10 lg:pt-12 pb-6 sm:pb-10">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="font-['Poppins'] font-bold text-[30px] leading-[1.12] sm:text-[42px] md:text-[4.8vw] md:whitespace-nowrap lg:text-[62px] lg:whitespace-normal xl:text-[72px] xl:leading-[1.08] text-neutral-900 tracking-[-0.02em]"
      >
        Turn your Book into a <span className="text-[#FF0000]">YouTube</span> 
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 sm:mt-5 font-['Poppins'] text-[14px] sm:text-base md:text-[17px] lg:text-[18px] text-neutral-800 max-w-[720px] mx-auto leading-[1.55]"
      >
        For ambitious authors with a manuscript or a published book who are tired of being invisible on the shelves.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 sm:mt-7 flex justify-center"
      >
        <Link
          href="#calendly"
          className="group inline-flex items-center gap-2.5 bg-[#FF0000] hover:bg-[#e00000] text-white font-bold text-[14px] sm:text-base lg:text-[17px] pl-2 pr-6 sm:pr-7 py-1.5 rounded-full shadow-[0_14px_34px_-12px_rgba(255,0,0,0.65)] transition-all hover:scale-[1.02]"
        >
          <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <Image
              src="/youtube-page/YT-Big-icon.png"
              alt=""
              width={40}
              height={40}
              className="object-contain w-5 h-5 sm:w-6 sm:h-6"
            />
          </span>
          <span>Start Your Journey</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative mt-6 sm:mt-10 lg:mt-12 max-w-[1180px] mx-auto"
      >
        <Image
          src="/youtube-page/Banner_img.png"
          alt="Your book playing as a YouTube series, surrounded by published book covers"
          width={1920}
          height={900}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  STATS + CALENDLY                                                          */
/* -------------------------------------------------------------------------- */

const STATS = [
  { icon: '/youtube-page/Book-Icon.png', value: '10,124+', label: 'Book Published' },
  { icon: '/youtube-page/YT-Icon.png', value: '1,200+', label: 'Book Video' },
  { icon: '/youtube-page/Smile_emoji_icon.png', value: '95%', label: 'Happy Authors' },
];

/** Fixed booking height — Calendly scrolls inside the card instead of stretching the page. */
const BOOKING_H = 660;
/** Calendly's two-column card (and its time-slot step) needs ~700px of height to show without scrolling. */
const BOOKING_H_WIDE = 720;

const BookingCard = ({ id, wide = false }: { id: string; wide?: boolean }) => {
  const h = wide ? BOOKING_H_WIDE : BOOKING_H;
  return (
    <div
      className={
        wide
          ? 'overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#FAFAFA]'
          : 'overflow-hidden rounded-[24px] sm:rounded-[28px] border border-zinc-200/70 bg-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.22)]'
      }
    >
      <CalendlyInlineEmbed containerId={id} heightPx={h} heightPxMobile={h} className="w-full" />
    </div>
  );
};

const StatsAndCalendly = () => (
  <section id="calendly" className="relative py-10 sm:py-12 lg:py-16 bg-white scroll-mt-28">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] gap-5 lg:gap-7 items-stretch">
        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full md:h-full bg-white rounded-[22px] sm:rounded-[32px] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.04] px-3 py-5 md:px-6 lg:px-10 md:py-8 grid grid-cols-3 gap-2 md:flex md:flex-col md:justify-around md:gap-7"
        >
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0 flex flex-col items-center text-center gap-1.5 md:flex-row md:text-left md:gap-4 lg:gap-6">
              {/* fixed-width icon column keeps every value left-aligned */}
              <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 md:w-[48px] md:h-[48px] lg:w-[72px] lg:h-[72px] flex items-center justify-center">
                <Image
                  src={s.icon}
                  alt=""
                  width={96}
                  height={96}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <div className="min-w-0">
                <div className="font-['Poppins'] font-normal text-[20px] sm:text-[26px] md:text-[30px] lg:text-[44px] leading-[1.05] text-neutral-900 tracking-tight">
                  {s.value}
                </div>
                <div className="font-['Poppins'] text-[11px] leading-tight sm:text-sm md:text-base lg:text-[18px] text-neutral-800 mt-0.5">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="min-w-0"
        >
          <BookingCard id="calendly-sharks-top" />
        </motion.div>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  VIDEOS WE CREATED                                                         */
/* -------------------------------------------------------------------------- */

const LONG_VIDEOS = [
  { id: '05OWsG4sSX8', title: 'THE WHITE WOLF — The Soldier Who Chose Love Over War', thumb: 'https://i.ytimg.com/vi/05OWsG4sSX8/hqdefault.jpg' },
  { id: 'ha1NneZGm7A', title: 'The ENTIRE History of Human Civilizations (4K Documentary)', thumb: 'https://i.ytimg.com/vi/ha1NneZGm7A/hqdefault.jpg' },
  { id: '7ChWjQ-vnEU', title: 'America Renewed Chapter 1 Explained | The American Tipping Point', thumb: 'https://i.ytimg.com/vi/7ChWjQ-vnEU/hqdefault.jpg' },
  { id: 'K18Tnq7sC6M', title: 'THE WHITE WOLF | The Making of John (Episode 1)', thumb: 'https://i.ytimg.com/vi/K18Tnq7sC6M/hqdefault.jpg' },
  { id: 'Ou80IomKkJ0', title: 'THE WHITE WOLF | The Trainee Who Captured the Instructors', thumb: 'https://i.ytimg.com/vi/Ou80IomKkJ0/hqdefault.jpg' },
  { id: 'VjTJvwgJnGc', title: 'The Little Red Hen — Narrated Children’s Story', thumb: 'https://i.ytimg.com/vi/VjTJvwgJnGc/hqdefault.jpg' },
];

const SHORT_VIDEOS = [
  { id: 'eGA2oAaswxQ', thumb: 'https://i.ytimg.com/vi/eGA2oAaswxQ/hqdefault.jpg' },
  { id: 'wysJZvHFqxI', thumb: 'https://i.ytimg.com/vi/wysJZvHFqxI/hqdefault.jpg' },
  { id: 'tT-BzWbyqkw', thumb: 'https://i.ytimg.com/vi/tT-BzWbyqkw/hqdefault.jpg' },
  { id: 'XfnznTT2BqY', thumb: 'https://i.ytimg.com/vi/XfnznTT2BqY/hqdefault.jpg' },
  { id: 'rdCdrqbpptg', thumb: 'https://i.ytimg.com/vi/rdCdrqbpptg/hqdefault.jpg' },
  { id: '0EezRgZ6tmE', thumb: 'https://i.ytimg.com/vi/0EezRgZ6tmE/hqdefault.jpg' },
];

type VideoTab = 'long' | 'short' | 'thumbnail';
const TABS: { key: VideoTab; label: string }[] = [
  { key: 'long', label: 'long' },
  { key: 'short', label: 'Short' },
  { key: 'thumbnail', label: 'Thumbnail' },
];

const VideosWeCreated = () => {
  const [tab, setTab] = useState<VideoTab>('long');

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-['Poppins'] font-bold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] text-center text-neutral-900 tracking-tight"
        >
          Videos We created
        </motion.h2>

        <div className="mt-6 sm:mt-8 flex items-end justify-center gap-6 sm:gap-10 border-b border-neutral-200 max-w-[420px] mx-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative pb-2.5 text-sm sm:text-base transition-colors ${
                tab === t.key ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {t.key === 'long' && <Play className="w-3.5 h-3.5 fill-current" />}
                {t.label}
              </span>
              {tab === t.key && (
                <motion.span
                  layoutId="ytTabUnderline"
                  className="absolute -bottom-px left-0 right-0 h-[3px] rounded-full bg-[#F1B300]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <AnimatePresence mode="wait">
            {tab === 'long' && (
              <motion.div
                key="long"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className={`${MOBILE_ROW} gap-4 pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5`}
              >
                {LONG_VIDEOS.map((v) => (
                  <a
                    key={v.id}
                    href={`https://youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block shrink-0 w-[82%] max-w-[340px] snap-start md:w-auto md:max-w-none rounded-[18px] overflow-hidden bg-white ring-1 ring-black/[0.06] shadow-[0_8px_24px_-16px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_38px_-18px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-video bg-black">
                      <Image src={v.thumb} alt={v.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="w-12 h-12 rounded-full bg-[#FF0000] grid place-items-center shadow-xl">
                          <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                        </span>
                      </span>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <h3 className="font-semibold text-[13px] sm:text-sm text-neutral-900 line-clamp-2 leading-snug">{v.title}</h3>
                      <p className="mt-1 text-[11px] text-neutral-500">Duck Book Writers · Long form</p>
                    </div>
                  </a>
                ))}
              </motion.div>
            )}

            {tab === 'short' && (
              <motion.div
                key="short"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className={`${MOBILE_ROW} gap-3 pb-4 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-5`}
              >
                {SHORT_VIDEOS.map((v) => (
                  <a
                    key={v.id}
                    href={`https://youtube.com/shorts/${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block shrink-0 w-[44%] max-w-[200px] snap-start md:w-auto md:max-w-none rounded-[20px] overflow-hidden bg-black aspect-[9/16] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1"
                  >
                    <Image src={v.thumb} alt="Short" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                    <span className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#FF0000] grid place-items-center shrink-0">
                        <Play className="w-3 h-3 text-white fill-white translate-x-px" />
                      </span>
                      <span className="text-[11px] text-white font-semibold">Shorts</span>
                    </span>
                  </a>
                ))}
              </motion.div>
            )}

            {tab === 'thumbnail' && (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className={`${MOBILE_ROW} gap-3 pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6`}
              >
                {LONG_VIDEOS.map((v) => (
                  <div
                    key={v.id}
                    className="relative shrink-0 w-[72%] max-w-[320px] snap-start md:w-auto md:max-w-none aspect-video rounded-[18px] overflow-hidden bg-black shadow-[0_10px_30px_-18px_rgba(0,0,0,0.3)] hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] transition-shadow"
                  >
                    <Image src={v.thumb} alt={v.title} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  VIDEO CONVERSION SERVICES — 3 CARDS                                       */
/* -------------------------------------------------------------------------- */

const DESCRIPTION =
  'Perfect for explanatory or illustrative content. We use engaging 2D motion graphics to animate key scenes, summarize plot points, or explain complex ideas from your book.';

/* Slanted service-card silhouettes from the Figma frame (slant ≈ 34% of card width). */
const fictionShape = (w: number, h: number): Pt[] => [[0, w * 0.34], [w, 0], [w, h], [0, h]];
const nonFictionShape = (w: number, h: number): Pt[] => [[0, 0], [w, w * 0.34], [w, h], [0, h]];

const serviceHeading = `${barlowCondensed.className} font-semibold uppercase leading-none tracking-[0.005em] text-[30px] md:text-[clamp(24px,3.4vw,46px)]`;
const serviceBody = `${barlow.className} text-[14px] md:text-[11.5px] lg:text-[14px] xl:text-[16px] leading-[1.45] text-justify [text-align-last:left]`;

const VideoConversionServices = () => (
  <section className="relative bg-white py-12 sm:py-16 lg:py-20">
    <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-['Poppins'] font-bold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] text-center text-neutral-900 leading-[1.14] tracking-tight"
      >
        Our Video Conversion
        <br />
        <span className="text-[#F1B300]">Services</span>
      </motion.h2>

      {/* Icons sit in normal flow and the cards pull up over them with %-of-width margins,
          so the "cut" line stays in the same place at every width. */}
      <div className={`${MOBILE_ROW} mt-8 sm:mt-10 gap-4 pb-8 md:pb-0 items-end md:grid md:grid-cols-[1fr_1.27fr_1fr] md:gap-x-4 lg:gap-x-8`}>
        {/* FICTION — 3D play button tucked behind the slanted top */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="shrink-0 w-[78%] max-w-[330px] snap-center md:w-full md:max-w-none flex flex-col"
        >
          <Image
            src="/youtube-page/youtube.png"
            alt=""
            width={185}
            height={151}
            className="relative z-0 block w-[92%] max-w-none h-auto -ml-[8%] pointer-events-none select-none"
          />
          <ShapedCard
            shape={fictionShape}
            radius={46}
            className="z-10 -mt-[42%] aspect-[482/500] pt-[36%] pl-[14%] pr-[8%] pb-[10%]"
          >
            <h3 className={`${serviceHeading} text-[#F1B300]`}>Fiction Book</h3>
            <p className={`${serviceBody} mt-3 text-neutral-900`}>{DESCRIPTION}</p>
          </ShapedCard>
        </motion.div>

        {/* CHILDREN — hiker walks on the top edge of the gradient card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="shrink-0 w-[86%] max-w-[380px] snap-center md:w-full md:max-w-none flex flex-col"
        >
          <Image
            src="/yt-sharks/children-hiker-v2.png"
            alt=""
            width={262}
            height={372}
            className="relative z-20 block w-[40%] h-auto mx-auto -left-[4%] pointer-events-none select-none"
          />
          <div
            className="relative z-10 -mt-[18%] aspect-[612/543] rounded-[clamp(36px,4.6vw,60px)] pt-[22%] pl-[13%] pr-[12%] pb-[9%] text-white shadow-[0_24px_44px_-22px_rgba(217,37,200,0.5)]"
            style={{ backgroundImage: CHILDREN_GRADIENT }}
          >
            <h3 className={`${barlowCondensed.className} font-semibold italic uppercase leading-none text-[32px] md:text-[clamp(26px,3.6vw,50px)]`}>
              Children Book
            </h3>
            <p className={`${barlow.className} mt-3 italic text-[16px] md:text-[13px] lg:text-[17px] xl:text-[21px] leading-[1.25] text-justify [text-align-last:left]`}>
              {DESCRIPTION}
            </p>
          </div>
        </motion.div>

        {/* NON-FICTION — clapperboard tucked behind the slanted top */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="shrink-0 w-[78%] max-w-[330px] snap-center md:w-full md:max-w-none flex flex-col"
        >
          <Image
            src="/yt-sharks/nonfiction-clapper.png"
            alt=""
            width={475}
            height={320}
            className="relative z-0 block w-full max-w-none h-auto ml-[10%] pointer-events-none select-none"
          />
          <ShapedCard
            shape={nonFictionShape}
            radius={46}
            className="z-10 -mt-[37%] aspect-[482/500] pt-[36%] pl-[6%] pr-[14%] pb-[10%]"
          >
            <h3 className={`${serviceHeading} italic text-[#F1B300]`}>Non-Fiction</h3>
            <p className={`${serviceBody} mt-3 italic text-neutral-900`}>{DESCRIPTION}</p>
          </ShapedCard>
        </motion.div>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  HOW IT WORKS — 7-DAY ROADMAP                                              */
/* -------------------------------------------------------------------------- */

const PHASES = [
  {
    label: 'Phase 1 -',
    title: 'Cinematic Transformation',
    boldTitle: false,
    desc: 'We adapt your manuscript into a high-retention, animated YouTube series. We build the visuals that stop the scroll.',
  },
  {
    label: 'Phase 2 -',
    title: 'Global Distribution',
    boldTitle: false,
    desc: 'We launch your book across 200+ global retailers. You keep 100% of your rights and every cent of your royalties.',
  },
  {
    label: 'Phase 3 -',
    title: 'The Viral Funnel',
    boldTitle: true,
    desc: 'Your YouTube series acts as a 24/7 sales machine, funneling viewers directly from your episodes to your checkout page.',
  },
];

const HowItWorks = () => (
  <section className="relative py-12 sm:py-16 lg:py-20 bg-white">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-7 md:gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="order-2 md:order-1"
        >
          <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_22px_56px_-24px_rgba(0,0,0,0.3)] aspect-square md:aspect-[4/5] max-w-[400px] md:max-w-[460px] mx-auto md:mx-0">
            <Image
              src="/youtube-page/why_youtube.png"
              alt="Published author holding her book beside the Duck Book Writers services page"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="order-1 md:order-2"
        >
          {/* red pill with the 3D YouTube icon overlapping its right end (icon in front) */}
          <div className="relative inline-flex items-center">
            <span className="relative z-10 inline-flex items-center h-[40px] sm:h-[54px] lg:h-[60px] pl-4 sm:pl-7 pr-6 sm:pr-9 rounded-[12px] sm:rounded-[18px] bg-[#FF0000] text-white font-['Poppins'] font-semibold text-[16px] sm:text-[22px] lg:text-[26px] whitespace-nowrap">
              Why Youtube ?
            </span>
            <Image
              src="/yt-sharks/yt-3d-icon.png"
              alt=""
              width={175}
              height={140}
              className="relative z-20 shrink-0 w-[66px] sm:w-[96px] lg:w-[108px] h-auto -ml-3 sm:-ml-5 translate-y-[3px] pointer-events-none select-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.12)]"
            />
          </div>

          <h2 className="mt-3 sm:mt-5 font-['Poppins'] font-bold text-[26px] sm:text-[36px] lg:text-[44px] leading-[1.1] text-neutral-900 tracking-tight">
            How It Works
          </h2>
          <p className="font-['Poppins'] font-light text-[20px] sm:text-[28px] lg:text-[36px] leading-[1.14] text-neutral-900 tracking-tight">
            The 7-Days Roadmap
          </p>

          <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-5">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-[16px] sm:rounded-[20px] px-4 sm:px-7 py-4 sm:py-6 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.04] transition-shadow hover:shadow-[0_20px_46px_-20px_rgba(0,0,0,0.32)]"
              >
                <h3 className="font-['Poppins'] text-[15px] sm:text-lg lg:text-[22px] leading-tight text-neutral-900">
                  <span className="font-bold">{p.label}</span>{' '}
                  <span className={p.boldTitle ? 'font-bold' : 'font-normal'}>{p.title}</span>
                </h3>
                <p className="mt-1 sm:mt-1.5 text-[12.5px] sm:text-sm lg:text-[15px] font-light leading-[1.5] text-neutral-700">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  JOIN AUTHORS — TESTIMONIALS                                               */
/* -------------------------------------------------------------------------- */

type Testimonial = { name: string; rating: number; text: string };

const ROW_A: Testimonial[] = [
  { name: 'Katherine Brooks', rating: 5, text: 'They made my dream come true. From editing to final publication, they were with me every step of the way.' },
  { name: 'Monroe Payson', rating: 5, text: 'They are haven for storytellers! They nurture manuscripts with love, polish them with precision, and gift the world with literary treasures.' },
  { name: 'Dejesus Reid', rating: 4, text: 'After years of scribbling poems into notebooks, I finally saw them come to life as a book. The design was elegant, and they respected my voice.' },
];
const ROW_B: Testimonial[] = [
  { name: 'Monroe Payson', rating: 5, text: 'They are haven for storytellers! They nurture manuscripts with love, polish them with precision, and gift the world with literary treasures.' },
  { name: 'Dejesus Reid', rating: 4, text: 'My grandkids were amazed to see my name on the cover. The whole process felt personal from the first call to the launch.' },
  { name: 'Richard Linn', rating: 5, text: 'The team guided me from manuscript to a professionally published book. Marketing support helped my debut reach readers worldwide.' },
];
const ROW_C: Testimonial[] = [
  { name: 'Dejesus Reid', rating: 4, text: 'After years of scribbling poems into notebooks, I finally saw them come to life as a book. The design was elegant.' },
  { name: 'Monroe Payson', rating: 5, text: 'They are haven for storytellers! They nurture manuscripts with love and polish them with precision.' },
  { name: 'Aiden Hall', rating: 5, text: 'Professional, kind, and incredibly talented. I could not have asked for a better publishing partner.' },
];

const TestimonialCard = ({ name, rating, text }: Testimonial) => (
  <article className="shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] bg-white rounded-[12px] ring-1 ring-black/[0.08] px-5 py-4 sm:px-6 sm:py-5">
    <div className="flex items-center gap-2.5 flex-wrap">
      <h4 className="font-['Poppins'] font-bold text-neutral-900 text-[13px] sm:text-sm">{name}</h4>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className={i < rating ? 'fill-[#F1B300] text-[#F1B300]' : 'fill-neutral-200 text-neutral-200'} />
        ))}
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#17B0A0] bg-white ring-1 ring-[#17B0A0]/40 rounded-full px-2 py-0.5">
        <BadgeCheck size={11} className="fill-[#17B0A0] text-white" /> Verified Buyer
      </span>
    </div>

    <div className="mt-2.5 relative">
      <span className="absolute -left-1 -top-1 text-neutral-300 text-lg leading-none select-none" aria-hidden>&ldquo;</span>
      <p className="pl-3.5 pr-4 text-[12px] sm:text-[13px] text-neutral-800 leading-[1.55]">{text}</p>
      <span className="absolute right-0 bottom-0 text-neutral-300 text-lg leading-none select-none" aria-hidden>&rdquo;</span>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3.5 text-neutral-400">
        <ThumbsUp size={13} />
        <Share2 size={13} />
        <Flag size={13} />
      </div>
      <span className="text-[10px] text-neutral-400">Posted 3 months ago</span>
    </div>
  </article>
);

const MarqueeRow = ({ items, reverse = false, duration = 48 }: { items: Testimonial[]; reverse?: boolean; duration?: number }) => {
  const seq = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />
      <motion.div
        className="flex gap-4 sm:gap-5 w-max"
        animate={{ x: reverse ? ['-33.333%', '0%'] : ['0%', '-33.333%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {seq.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </motion.div>
    </div>
  );
};

const JoinAuthors = () => (
  <section className="relative py-10 sm:py-14 lg:py-16 bg-white overflow-hidden">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-['Poppins'] font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] leading-[1.05] text-neutral-900 tracking-tight">
          Join <span className="text-[#F1B300]">Authors</span>
        </h2>
        <p className="mt-1 font-['Poppins'] font-light text-[18px] sm:text-[24px] lg:text-[32px] leading-tight text-neutral-900 tracking-tight">
          Who Moved Beyond the Page
        </p>
      </motion.div>
    </div>

    <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
      <MarqueeRow items={ROW_A} duration={52} />
      <MarqueeRow items={ROW_B} reverse duration={46} />
      <MarqueeRow items={ROW_C} duration={58} />
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  RIGHT FIT + CALENDLY                                                      */
/* -------------------------------------------------------------------------- */

const FOR_YOU = [
  'You believe your book deserves global reach.',
  'You want expert editing, design, and translation.',
  'You prefer a dedicated team over DIY management.',
  'You value quality across every detail and format.',
  'You want full ownership and creative control.',
  'You are ready to invest in long-term visibility and impact.',
];

const NOT_FOR_YOU = [
  'You are looking for a quick or low-cost solution.',
  'Your project skips professional editing, design, or polish.',
  'Your book is limited to only one format or market.',
  'You want to manage everything yourself.',
  'You aren’t focused on visibility, reach, or legacy.',
];

/* Right Fit silhouettes from Figma: top edges rise toward the centre gap,
   and the left card's outer edge leans outward toward the bottom. */
const fitLeftShape = (w: number, h: number): Pt[] => [[w * 0.063, w * 0.152], [w, 0], [w, h], [0, h]];
const fitRightShape = (w: number, h: number): Pt[] => [[0, 0], [w, w * 0.152], [w, h], [0, h]];

const FitCard = ({
  heading,
  items,
  italic,
  side,
  delay,
}: {
  heading: React.ReactNode;
  items: string[];
  italic?: boolean;
  side: 'left' | 'right';
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="h-full shrink-0 w-[86%] max-w-[420px] snap-center md:w-auto md:max-w-none"
  >
    <ShapedCard
      shape={side === 'left' ? fitLeftShape : fitRightShape}
      radius={64}
      className={`h-full min-h-[clamp(420px,52vw,640px)] pt-[26%] pb-[12%] ${
        side === 'left' ? 'pl-[14%] pr-[7%]' : 'pl-[10%] pr-[8%]'
      }`}
    >
      <h3
        className={`${barlowCondensed.className} font-semibold leading-none text-[#F1B300] text-[clamp(32px,4vw,54px)] mb-5 sm:mb-7 ${italic ? 'italic' : ''}`}
      >
        {heading}
      </h3>
      <ul className="space-y-2.5 sm:space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-[0.62em] w-[5px] h-[5px] rounded-full bg-neutral-900 shrink-0" aria-hidden />
            <span
              className={`${barlow.className} text-[15px] sm:text-[17px] lg:text-[18px] xl:text-[19px] leading-[1.5] text-neutral-900 ${italic ? 'italic' : ''}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </ShapedCard>
  </motion.div>
);

const RightFit = () => (
  <section className="relative py-10 sm:py-14 lg:py-16 bg-white overflow-hidden">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-['Poppins'] font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] leading-[1.05] text-neutral-900 tracking-tight">
          <span className="text-[#F1B300]">Right</span> Fit
        </h2>
        <p className="mt-1 font-['Poppins'] font-light text-[18px] sm:text-[24px] lg:text-[32px] leading-tight text-neutral-900 tracking-tight">
          Is This the for You?
        </p>
      </motion.div>

      <div className={`${MOBILE_ROW} mt-8 sm:mt-10 gap-4 pt-1 pb-10 md:pt-0 md:pb-0 md:grid md:grid-cols-2 md:gap-7 items-stretch`}>
        <FitCard side="left" heading="This is for you if:" items={FOR_YOU} />
        <FitCard side="right" heading={<>This isn&apos;t for you if:</>} items={NOT_FOR_YOU} italic delay={0.1} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-10 sm:mt-12 w-full"
      >
        <BookingCard id="calendly-sharks-bottom" wide />
      </motion.div>

      <div className="mt-8 sm:mt-10 flex justify-center">
        <Link
          href="#calendly"
          className="inline-flex items-center justify-center bg-[#F1B300] hover:bg-[#dba200] text-white font-bold text-sm sm:text-base lg:text-[18px] px-7 sm:px-10 py-2.5 sm:py-3 rounded-full shadow-[0_14px_32px_-14px_rgba(241,179,0,0.7)] transition-all hover:scale-[1.02]"
        >
          Book Meeting
        </Link>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function YtSharksPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <YtSharksHeader />
      <Hero />
      <StatsAndCalendly />
      <VideosWeCreated />
      <VideoConversionServices />
      <HowItWorks />
      <JoinAuthors />
      <RightFit />
      <Footer />
    </main>
  );
}
