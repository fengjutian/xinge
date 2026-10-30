import { useEffect, useState } from 'react';
import { Download, Eye, Plus, Trash2, Save, MessageCircle } from 'lucide-react';

type Reflection = { id: string; situation: string; selfView: string; imaginedView: string; evidence: string; alternative: string; nextStep: string; createdAt: string };
const KEY = 'xinge-self-awareness-v1';
const blank = () => ({ situation: '', selfView: '', imaginedView: '', evidence: '', alternative: '', nextStep: '' });
function readSaved(): Reflection[] {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return [];
    const value: unknown = JSON.parse(raw); if (!Array.isArray(value)) return [];
    return value.filter((x): x is Reflection => !!x && typeof x === 'object' && typeof x.id === 'string' && typeof x.createdAt === 'string').map(x => ({
      id: x.id, createdAt: x.createdAt, situation: typeof x.situation === 'string' ? x.situation : '', selfView: typeof x.selfView === 'string' ? x.selfView : '', imaginedView: typeof x.imaginedView === 'string' ? x.imaginedView : '', evidence: typeof x.evidence === 'string' ? x.evidence : '', alternative: typeof x.alternative === 'string' ? x.alternative : '', nextStep: typeof x.nextStep === 'string' ? x.nextStep : ''
    }));
  } catch { return []; }
}
export default function SelfAwareness() {
  const [form, setForm] = useState(blank); const [records, setRecords] = useState<Reflection[]>([]); const [notice, setNotice] = useState(''); const [error, setError] = useState('');
  useEffect(() => { setRecords(readSaved()); }, []);
  const update = (key: keyof ReturnType<typeof blank>, value: string) => setForm(current => ({ ...current, [key]: value }));
  const persist = (next: Reflection[]) => { try { localStorage.setItem(KEY, JSON.stringify(next)); setRecords(next); setError(''); return true; } catch { setError('保存失败：浏览器存储可能不可用或空间不足。'); return false; } };
  const save = () => { setNotice(''); setError(''); if (!form.situation.trim() || !form.selfView.trim()) { setError('请至少写下发生了什么，以及你如何看待自己。'); return; } const item: Reflection = { ...form, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() }; if (persist([item, ...records])) { setForm(blank()); setNotice('这次观察已保存在当前浏览器。'); } };
  const remove = (id: string) => { if (!window.confirm('确定删除这条自我观察吗？此操作无法撤销。')) return; if (persist(records.filter(item => item.id !== id))) setNotice('已删除这条记录。'); };
  const exportData = () => { try { const blob = new Blob([JSON.stringify({ format: 'xinge-self-awareness', version: 1, exportedAt: new Date().toISOString(), reflections: records }, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `xinge-self-awareness-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); setNotice('自我观察记录已导出。'); setError(''); } catch { setError('导出失败，请尝试其他浏览器。'); } };
  return <section className="section awareness" id="awareness">
    <span className="eyebrow">06 / 自我认知 · SELF-AWARENESS</span><h2>我如何看自己，<br/><em>与我以为别人如何看我？</em></h2>
    <p className="intro">我们对自己的判断，有时会混合事实、猜测与担忧。把它们分开写下来，不是为了证明自己想错了，而是给更多解释留出位置。</p>
    <div className="awareness-guide"><div><Eye size={17}/><b>观察，而不是判决</b><p>描述具体情境，避免用“我总是”“我就是这样的人”概括整个自己。</p></div><div><MessageCircle size={17}/><b>猜测，不等于事实</b><p>记录对他人看法的担忧，同时承认自己未必知道对方真实的想法。</p></div></div>
    <div className="awareness-layout"><div className="awareness-form"><div className="awareness-form-head"><span>01</span><b>写下这次经历</b><small>REFLECTION NOTE</small></div>
      <label className="awareness-label">发生了什么？尽量描述可观察的事实<textarea rows={3} value={form.situation} onChange={e => update('situation', e.target.value)} placeholder="例如：会议上我提出了一个方案，现场有几秒没人回应……"/></label>
      <label className="awareness-label">我当时如何看待自己？<textarea rows={3} value={form.selfView} onChange={e => update('selfView', e.target.value)} placeholder="我脑中出现了什么评价？它让我有什么感受？"/></label>
      <label className="awareness-label">我猜别人会如何看我？<textarea rows={3} value={form.imaginedView} onChange={e => update('imaginedView', e.target.value)} placeholder="把它当作一种猜测，而不是已经证实的结论。"/></label>
      <label className="awareness-label">有哪些事实支持或不支持这个猜测？<textarea rows={3} value={form.evidence} onChange={e => update('evidence', e.target.value)} placeholder="只写实际观察到的线索；也可以写‘目前还不知道’。"/></label>
      <label className="awareness-label">还有哪些合理的解释？<textarea rows={3} value={form.alternative} onChange={e => update('alternative', e.target.value)} placeholder="例如：对方可能在思考、没听清，或需要更多信息。"/></label>
      <label className="awareness-label">下一步，我愿意尝试什么？<textarea rows={2} value={form.nextStep} onChange={e => update('nextStep', e.target.value)} placeholder="一个可执行的小行动，也可以是暂时不采取行动。"/></label>
      <div className="awareness-actions"><button className="secondary" type="button" onClick={() => { setForm(blank()); setError(''); setNotice('已清空尚未保存的内容。'); }}>清空草稿</button><button className="primary" type="button" onClick={save}><Save size={14}/> 保存观察</button></div>{notice && <p className="storage-success" role="status">{notice}</p>}{error && <p className="storage-error" role="alert">{error}</p>}
    </div><aside className="awareness-history"><div className="awareness-history-head"><b>我的观察记录</b><span>{records.length} 条</span></div>
      {records.length === 0 ? <div className="awareness-empty"><Plus size={19}/><b>这里还很安静</b><p>保存第一次观察后，可以回来看看自己对不同情境的解释是否发生变化。</p></div> : <div className="awareness-records">{records.map(item => <article className="awareness-record" key={item.id}><div className="awareness-record-top"><time>{new Date(item.createdAt).toLocaleDateString()}</time><button type="button" className="icon-button" onClick={() => remove(item.id)} aria-label="删除这条观察"><Trash2 size={14}/></button></div><h3>{item.situation}</h3><div><small>我如何看自己</small><p>{item.selfView}</p></div>{item.imaginedView && <div><small>我猜别人如何看我</small><p>{item.imaginedView}</p></div>}{item.evidence && <div><small>事实线索</small><p>{item.evidence}</p></div>}{item.alternative && <div><small>其他解释</small><p>{item.alternative}</p></div>}{item.nextStep && <div><small>下一步</small><p>{item.nextStep}</p></div>}</article>)}</div>}
      <button type="button" className="secondary awareness-export" onClick={exportData} disabled={!records.length}><Download size={14}/> 导出 JSON 备份</button>
    </aside></div><p className="disclaimer">这份练习用于自我观察，不是心理测验，也不能替代专业支持。记录中的“别人怎么看我”是你的感受或推测；除非对方明确表达，否则不应当作对方真实想法的证据。</p>
  </section>;
}
