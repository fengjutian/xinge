import { useEffect, useState } from 'react';
import { ArrowRight, Leaf, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import EmotionJournal from './components/EmotionJournal';
import GrowthExperiments from './components/GrowthExperiments';
import InnerCosmos from './components/InnerCosmos';
import KnowledgeNetwork from './components/KnowledgeNetwork';
import ReflectionExperiment from './components/ReflectionExperiment';
import ResearchNotes from './components/ResearchNotes';
import SelfAwareness from './components/SelfAwareness';
import TodayQuestion from './components/TodayQuestion';
import ValueCompass from './components/ValueCompass';
import { BranchNetwork, MiniMotif, PageNetwork } from './components/OrganicVisuals';

const navigation = [
  ['探索地图', '/map'], ['知识网络', '/knowledge'], ['今日一问', '/question'],
  ['情绪日记', '/journal'], ['价值罗盘', '/values'], ['心理机制', '/experiment'],
  ['成长实验', '/growth'], ['自我认知', '/awareness'], ['研究笔记', '/notes'],
] as const;

const featureDescriptions = [
  '看见想法、情绪、需要与行动之间的连接', '沿着概念之间的依赖关系建立理解',
  '用一个小问题开始今天的自我观察', '记录情绪出现的情境、强度与需要',
  '辨认真正重要的方向与当下的取舍', '用结构化记录理解一次具体经历',
  '设计足够小、可以观察的行动实验', '比较自我看法与想象中的他人视角',
  '阅读经过整理的心理学概念与提醒',
] as const;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return <header>
    <Link className="brand" to="/" aria-label="心格首页"><span><Leaf /></span><b>心格<small>INNER FIELD NOTES</small></b></Link>
    <nav className={open ? 'open' : ''} aria-label="主要导航">{navigation.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>)}</nav>
    <Link className="head-cta" to="/question">开始探索 ↗</Link>
    <button className="menu" onClick={() => setOpen(value => !value)} aria-label={open ? '关闭菜单' : '打开菜单'}>{open ? <X /> : <Menu />}</button>
  </header>;
}

function Home() {
  return <>
    <section className="hero"><div><span className="eyebrow">● 一个慢一点的自我探索空间</span><motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>你的内心世界，<br /><em>值得被慢慢理解。</em></motion.h1><p>从心理学出发，观察情绪、想法与行动之间的关系。不急着给自己下结论，先为理解留出一点空间。</p><Link className="primary" to="/question">开始今天的探索 <ArrowRight size={16} /></Link><div className="footnote">01　理解先于判断　────────　每次只前进一步</div></div><div className="hero-art"><BranchNetwork /><small className="cap a">NOTICE / 觉察</small><small className="cap b">UNDERSTAND / 理解</small><small className="cap c">GROW / 生长</small></div></section>
    <section className="principle"><b>不急着定义你是谁。</b><p>心理学概念是一盏灯，不是一张标签。这里帮助你提出更好的问题，而不是替你给出唯一答案。</p><Leaf /></section>
    <section className="feature-directory"><span className="eyebrow">探索目录 / EXPLORE</span><h2>每次，只走进一个空间。</h2><p className="intro">选择你此刻最想了解的方向。每项工具都有独立页面，你可以随时从顶部导航切换。</p><div className="feature-grid">{navigation.map(([label, path], index) => <Link to={path} key={path} className="feature-card"><div className="feature-symbol"><small>0{index + 1}</small><MiniMotif index={index} /></div><h3>{label}</h3><p>{featureDescriptions[index]}</p><span>进入探索 →</span></Link>)}</div></section>
    <section className="closing"><span className="brand-mark"><Leaf /></span><small className="eyebrow">A NOTE TO YOURSELF</small><h2>你不必立刻想明白。<br /><em>先对自己保持好奇。</em></h2><p>探索不是为了成为一个标准答案，而是逐渐学会更准确、更温柔地理解自己。</p><Link to="/question">开始今天的探索 ↗</Link></section>
  </>;
}

function MapPage() {
  return <section className="section map page-section"><span className="eyebrow">探索地图 / FIELD MAP</span><h2>看见内在经验的连接。</h2><p className="intro">想法、情绪、需要与行动可以放在同一张地图上观察。选择一个概念，看看它如何帮助你理解一次具体经历。</p><div className="map-grid"><InnerCosmos /><aside><small>HOW TO EXPLORE</small><h3>从一个小问题开始。</h3><p>不需要一次弄懂全部。选择一个让你有共鸣的概念，再把它带回今天的真实生活。</p><ol><li>观察发生了什么</li><li>辨认脑海里的解释</li><li>留意情绪与在意</li></ol><Link to="/experiment">进入机制实验室 →</Link></aside></div></section>;
}

function Layout() {
  return <div className="shell"><ScrollToTop /><Header /><main><PageNetwork /><Routes>
    <Route path="/" element={<Home />} /><Route path="/map" element={<MapPage />} />
    <Route path="/knowledge" element={<KnowledgeNetwork />} /><Route path="/question" element={<TodayQuestion />} />
    <Route path="/journal" element={<EmotionJournal />} /><Route path="/values" element={<ValueCompass />} />
    <Route path="/experiment" element={<ReflectionExperiment />} /><Route path="/growth" element={<GrowthExperiments />} />
    <Route path="/awareness" element={<SelfAwareness />} /><Route path="/notes" element={<ResearchNotes />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main><footer><Link className="brand" to="/">心格 <small>INNER FIELD NOTES</small></Link><span>理解先于判断 · 探索而非预测</span><span>© 2026 心格</span></footer></div>;
}

export default function App() {
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Layout /></BrowserRouter>;
}
