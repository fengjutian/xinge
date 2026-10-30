import { useEffect, useState } from 'react';
import { Compass, Download, MoveDown, MoveUp, RotateCcw, Save } from 'lucide-react';

type ValueReflection = { selected: string[]; why: string; living: string; nextStep: string; updatedAt: string };
const KEY = 'xinge-value-compass-v1';
const VALUES = [
  { name: '真诚', hint: '言行一致，诚实面对自己与他人' },
  { name: '自由', hint: '拥有选择空间与自主决定权' },
  { name: '安全', hint: '有稳定感、可预期性与基本保障' },
  { name: '成长', hint: '学习新事物，拓展能力与理解' },
  { name: '亲密', hint: '与重要的人建立真实连接' },
  { name: '创造', hint: '把想法变成新的作品或方法' },
  { name: '贡献', hint: '为他人、社区或更大的目标带来帮助' },
  { name: '成就', hint: '完成有挑战的目标，看到努力的结果' },
  { name: '平衡', hint: '让工作、关系、休息与兴趣都有位置' },
  { name: '好奇', hint: '保持开放，愿意探索未知' },
  { name: '公平', hint: '重视公正、尊重与平等对待' },
  { name: '宁静', hint: '为内在安定与不被打扰留出空间' },
  { name: '归属', hint: '感到自己被接纳，是群体的一部分' },
  { name: '冒险', hint: '尝试新路径，接受适度的不确定' },
  { name: '关怀', hint: '照顾自己和他人的真实需要' },
  { name: '精进', hint: '持续练习，把重要的事情做得更好' },
];
function readSaved(): ValueReflection | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const candidate = value as Partial<ValueReflection>;
    if (!Array.isArray(candidate.selected) || !candidate.selected.every(x => typeof x === 'string' && VALUES.some(v => v.name === x))) return null;
    return { selected: candidate.selected.slice(0, 5), why: typeof candidate.why === 'string' ? candidate.why : '', living: typeof candidate.living === 'string' ? candidate.living : '', nextStep: typeof candidate.nextStep === 'string' ? candidate.nextStep : '', updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : '' };
  } catch { return null; }
}
export default function ValueCompass() {
  const [selected, setSelected] = useState<string[]>([]);
  const [why, setWhy] = useState('');
  const [living, setLiving] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');
  useEffect(() => { const saved = readSaved(); if (saved) { setSelected(saved.selected); setWhy(saved.why); setLiving(saved.living); setNextStep(saved.nextStep); setSavedAt(saved.updatedAt); } }, []);
  const toggle = (name: string) => {
    setSelected(current => current.includes(name) ? current.filter(x => x !== name) : current.length < 5 ? [...current, name] : current);
    setNotice(''); setError('');
  };
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= selected.length) return;
    setSelected(current => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
    setNotice('');
  };
  const snapshot = (): ValueReflection => ({ selected, why: why.trim(), living: living.trim(), nextStep: nextStep.trim(), updatedAt: new Date().toISOString() });
  const save = () => {
    setError(''); setNotice('');
    if (selected.length < 3) { setError('先选择至少 3 项你真正重视的价值。'); return; }
    try { const data = snapshot(); localStorage.setItem(KEY, JSON.stringify(data)); setSavedAt(data.updatedAt); setNotice('已保存到当前浏览器。你可以随时回来调整排序。'); }
    catch { setError('保存失败：浏览器存储可能不可用或空间不足。请尝试导出备份。'); }
  };
  const exportData = () => {
    try { const blob = new Blob([JSON.stringify({ format: 'xinge-value-compass', version: 1, reflection: snapshot() }, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `xinge-values-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setNotice('价值观练习已导出为 JSON 文件。'); setError(''); }
    catch { setError('导出失败，请尝试其他浏览器。'); }
  };
  const reset = () => {
    if (!window.confirm('清除本浏览器保存的价值观练习，并重置当前填写内容？建议先导出备份。')) return;
    try { localStorage.removeItem(KEY); setSelected([]); setWhy(''); setLiving(''); setNextStep(''); setSavedAt(''); setNotice('已清除这份价值观练习。'); setError(''); }
    catch { setError('无法清除本地记录，请检查浏览器存储权限。'); }
  };
  return <section className="section values" id="values">
    <span className="eyebrow">04 / 价值观罗盘 · VALUES COMPASS</span>
    <h2>在各种选择之间，<br/><em>辨认什么对你真正重要。</em></h2>
    <p className="intro">价值观不是待完成的目标，也没有标准答案。它们更像你希望持续实践的方向。选出最重要的几项，再看看最近的生活是否给它们留了位置。</p>
    <div className="values-layout">
      <div className="values-picker"><div className="values-heading"><Compass size={18}/><b>挑选你的价值方向</b><span>{selected.length} / 5</span></div><p className="values-helper">点击选择或取消，最多选择 5 项。尽量选择即使没人评价，你仍然愿意在意的东西。</p><div className="values-options">{VALUES.map(value => <button type="button" key={value.name} className={selected.includes(value.name) ? 'value-option active' : 'value-option'} onClick={() => toggle(value.name)} aria-pressed={selected.includes(value.name)}><strong>{value.name}</strong><small>{value.hint}</small><span>{selected.includes(value.name) ? '✓' : '+'}</span></button>)}</div></div>
      <div className="values-reflection"><div className="values-heading"><span className="rank-mark">01</span><b>把价值带回真实生活</b><span>REFLECT</span></div>
        <div className="rank-list"><p>拖不动也没关系，用箭头调整优先顺序。顺序代表你此刻的主观选择，不是永久的人格排名。</p>{selected.length === 0 ? <div className="empty-note">选择左侧价值后，它们会出现在这里。</div> : selected.map((name, index) => <div className="rank-item" key={name}><span className="rank-number">{String(index + 1).padStart(2, '0')}</span><b>{name}</b><small>{VALUES.find(v => v.name === name)?.hint}</small><div><button type="button" className="icon-button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`将${name}上移`}><MoveUp size={15}/></button><button type="button" className="icon-button" onClick={() => move(index, 1)} disabled={index === selected.length - 1} aria-label={`将${name}下移`}><MoveDown size={15}/></button></div></div>)}</div>
        <label className="value-label">为什么这些价值对我重要？<textarea rows={3} value={why} onChange={e => setWhy(e.target.value)} placeholder="它们可能来自某段经历、某个人，或你不想失去的东西……"/></label>
        <label className="value-label">最近有什么行动体现了这些价值？<textarea rows={3} value={living} onChange={e => setLiving(e.target.value)} placeholder="不必宏大。一次坦诚的表达、一次休息或一个小决定都算。"/></label>
        <label className="value-label">未来一周，我愿意尝试的一个小行动<textarea rows={2} value={nextStep} onChange={e => setNextStep(e.target.value)} placeholder="写一个具体、轻量、由自己决定的行动……"/></label>
        <div className="values-actions"><button className="secondary" type="button" onClick={exportData}><Download size={14}/> 导出</button><button className="secondary" type="button" onClick={reset}><RotateCcw size={14}/> 重置</button><button className="primary" type="button" onClick={save}><Save size={14}/> 保存练习</button></div>
        {notice && <p className="storage-success" role="status">{notice}</p>}{error && <p className="storage-error" role="alert">{error}</p>}{savedAt && <p className="values-saved">上次保存：{new Date(savedAt).toLocaleString()}</p>}
      </div>
    </div>
    <p className="disclaimer">这不是经过标准化验证的心理测验，不会生成固定人格类型或分数。价值排序会随生活阶段变化；你可以保留矛盾、犹豫和尚未确定的部分。</p>
  </section>;
}
