import { useEffect, useMemo, useState } from 'react';
import { Download, FlaskConical, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

type GrowthExperiment = {
  id: string;
  title: string;
  hypothesis: string;
  action: string;
  startDate: string;
  endDate: string;
  observation: string;
  reflection: string;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
};

const KEY = 'xinge-growth-experiments-v1';
const blank = (): Omit<GrowthExperiment, 'id' | 'createdAt' | 'updatedAt'> => ({ title: '', hypothesis: '', action: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', observation: '', reflection: '', status: 'planned' });
function loadExperiments(): GrowthExperiment[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is GrowthExperiment => !!item && typeof item === 'object' && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.action === 'string' && ['planned', 'active', 'completed'].includes(item.status));
  } catch { return []; }
}
const statusText = { planned: '准备开始', active: '进行中', completed: '已复盘' };
export default function GrowthExperiments() {
  const [items, setItems] = useState<GrowthExperiment[]>([]);
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setItems(loadExperiments()); }, []);
  const stats = useMemo(() => ({ total: items.length, active: items.filter(x => x.status === 'active').length, completed: items.filter(x => x.status === 'completed').length }), [items]);
  const persist = (next: GrowthExperiment[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setItems(next); setNotice('已保存到当前浏览器。'); setError(''); return true; }
    catch { setError('保存失败：浏览器存储可能不可用或空间不足。建议先导出已有记录。'); setNotice(''); return false; }
  };
  const update = <K extends keyof ReturnType<typeof blank>>(field: K, value: ReturnType<typeof blank>[K]) => setForm(current => ({ ...current, [field]: value }));
  const startNew = () => { setEditing(null); setForm(blank()); setShowForm(true); setNotice(''); setError(''); };
  const editItem = (item: GrowthExperiment) => { setEditing(item.id); setForm({ title: item.title, hypothesis: item.hypothesis, action: item.action, startDate: item.startDate, endDate: item.endDate, observation: item.observation, reflection: item.reflection, status: item.status }); setShowForm(true); setNotice(''); setError(''); };
  const save = () => {
    if (!form.title.trim() || !form.hypothesis.trim() || !form.action.trim()) { setError('请至少填写实验名称、我的假设和具体行动。'); return; }
    if (form.endDate && form.startDate && form.endDate < form.startDate) { setError('结束日期不能早于开始日期。'); return; }
    const now = new Date().toISOString();
    const old = editing ? items.find(x => x.id === editing) : undefined;
    const item: GrowthExperiment = { ...form, title: form.title.trim(), hypothesis: form.hypothesis.trim(), action: form.action.trim(), observation: form.observation.trim(), reflection: form.reflection.trim(), id: old?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: old?.createdAt || now, updatedAt: now };
    const next = editing ? items.map(x => x.id === editing ? item : x) : [item, ...items];
    if (persist(next)) { setShowForm(false); setEditing(null); setForm(blank()); }
  };
  const remove = (item: GrowthExperiment) => { if (!window.confirm(`确定删除「${item.title}」这条成长实验吗？此操作无法撤销。`)) return; persist(items.filter(x => x.id !== item.id)); };
  const exportData = () => {
    try { const blob = new Blob([JSON.stringify({ format: 'xinge-growth-experiments', version: 1, exportedAt: new Date().toISOString(), experiments: items }, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `xinge-growth-experiments-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setNotice('成长实验记录已导出为 JSON。'); setError(''); } catch { setError('导出失败，请尝试其他浏览器。'); }
  };
  const clearAll = () => { if (!items.length) return; if (!window.confirm('确定删除所有成长实验记录吗？建议先导出备份。')) return; if (persist([])) setNotice('已清除所有成长实验记录。'); };
  return <section className="section growth" id="growth">
    <span className="eyebrow">06 / 个人成长实验 · GROWTH LAB</span>
    <h2>把一个想法，变成一次<br/><em>温和而可观察的尝试。</em></h2>
    <p className="intro">成长实验不是考验意志力，也不要求证明自己正确。先写下一个可以被观察的假设，尝试一件足够小的行动，再记录实际发生了什么。结果不如预期，也是一条有用的信息。</p>
    <div className="growth-summary"><div><strong>{stats.total}</strong><span>条实验记录</span></div><div><strong>{stats.active}</strong><span>正在尝试</span></div><div><strong>{stats.completed}</strong><span>完成复盘</span></div><button className="primary" type="button" onClick={startNew}><Plus size={15}/> 设计一个小实验</button></div>
    {showForm && <div className="growth-form"><div className="growth-form-head"><FlaskConical size={18}/><b>{editing ? '编辑成长实验' : '设计一个小实验'}</b><button type="button" className="icon-button" aria-label="关闭表单" onClick={() => setShowForm(false)}><X size={15}/></button></div>
      <label className="growth-label">实验名称 *<input value={form.title} onChange={e => update('title', e.target.value)} placeholder="例如：会议前先写下我真正想问的问题" maxLength={100}/></label>
      <label className="growth-label">我的假设 *<textarea rows={2} value={form.hypothesis} onChange={e => update('hypothesis', e.target.value)} placeholder="我猜如果……那么可能会……；我怎么知道它是否发生？"/></label>
      <label className="growth-label">我准备采取的具体行动 *<textarea rows={2} value={form.action} onChange={e => update('action', e.target.value)} placeholder="写成可执行的小动作，尽量具体、轻量、由自己掌控。"/></label>
      <div className="growth-date-row"><label className="growth-label">开始日期<input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}/></label><label className="growth-label">计划结束日期<input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)}/></label><label className="growth-label">状态<select value={form.status} onChange={e => update('status', e.target.value as GrowthExperiment['status'])}><option value="planned">准备开始</option><option value="active">进行中</option><option value="completed">已复盘</option></select></label></div>
      <label className="growth-label">我观察到了什么？<textarea rows={3} value={form.observation} onChange={e => update('observation', e.target.value)} placeholder="记录事实、变化和例外；尽量把观察与解释分开。"/></label>
      <label className="growth-label">复盘：我学到了什么？<textarea rows={3} value={form.reflection} onChange={e => update('reflection', e.target.value)} placeholder="假设得到支持了吗？哪些因素可能影响结果？下一次要调整什么？"/></label>
      <div className="growth-form-actions"><button type="button" className="secondary" onClick={() => setShowForm(false)}>取消</button><button type="button" className="primary" onClick={save}><Save size={14}/> 保存实验</button></div>
    </div>}
    {items.length === 0 ? <div className="growth-empty"><FlaskConical size={24}/><b>这里还没有实验记录</b><p>从一件小事开始：提出一个假设，尝试一个行动，观察真实结果。你不需要先改变自己，只需要多了解一点。</p><button type="button" className="secondary" onClick={startNew}>创建第一条实验</button></div> : <div className="growth-list">{items.map(item => <article className="growth-card" key={item.id}><div className="growth-card-top"><span className={`growth-status ${item.status}`}>{statusText[item.status]}</span><small>{item.startDate || '未设置开始日期'}{item.endDate ? ` — ${item.endDate}` : ''}</small></div><h3>{item.title}</h3><div className="growth-detail"><b>假设</b><p>{item.hypothesis}</p></div><div className="growth-detail"><b>行动</b><p>{item.action}</p></div>{item.observation && <div className="growth-detail"><b>观察</b><p>{item.observation}</p></div>}{item.reflection && <div className="growth-detail"><b>复盘</b><p>{item.reflection}</p></div>}<div className="growth-card-actions"><button type="button" className="secondary" onClick={() => editItem(item)}><Pencil size={13}/> 编辑 / 复盘</button><button type="button" className="secondary" onClick={() => remove(item)}><Trash2 size={13}/> 删除</button></div></article>)}</div>}
    <div className="growth-bottom-actions"><span>记录仅保存在当前浏览器；不会上传服务器，也不用于心理诊断。</span><div><button type="button" className="secondary" onClick={exportData}><Download size={14}/> 导出 JSON</button><button type="button" className="secondary" onClick={clearAll} disabled={!items.length}>清空记录</button></div></div>
    {notice && <p className="storage-success" role="status">{notice}</p>}{error && <p className="storage-error" role="alert">{error}</p>}
    <p className="disclaimer">一个实验的结果不能单独证明因果关系。请把它当作个人观察的起点，而不是对自己的评判；如果某项尝试让你明显不适，可以随时停止或调整。</p>
  </section>;
}
