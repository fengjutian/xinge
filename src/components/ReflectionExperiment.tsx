import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Trash2, Upload } from 'lucide-react';
import { reflectionStorage, ReflectionEntry } from '../lib/reflectionStorage';
import MechanismLibrary from './MechanismLibrary';

function isReflectionEntry(value: unknown): value is ReflectionEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<ReflectionEntry>;
  return typeof entry.situation === 'string' && typeof entry.thought === 'string'
    && typeof entry.need === 'string' && (entry.updatedAt === undefined || typeof entry.updatedAt === 'string');
}

export default function ReflectionExperiment() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [consequence, setConsequence] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const entry = reflectionStorage.load();
      if (!entry) return;
      setSituation(entry.situation); setThought(entry.thought); setConsequence(entry.need);
      setHasExisting(true);
    } catch {
      setError('无法读取本地记录。请检查浏览器存储权限；如果之前导出过备份，可以尝试导入恢复。');
    }
  }, []);

  const save = () => {
    setError(''); setNotice('');
    try {
      reflectionStorage.save({ situation, thought, need: consequence, updatedAt: new Date().toISOString() });
      setSaved(true); setHasExisting(true); setNotice('已保存到当前浏览器。');
    } catch {
      setSaved(false); setError('浏览器暂时无法保存。请检查存储空间或隐私设置，并先导出重要内容。');
    }
  };

  const clear = () => {
    if (!window.confirm('确定清除保存在此浏览器中的这条 ABC 记录吗？建议先导出备份。')) return;
    try {
      reflectionStorage.clear(); setSituation(''); setThought(''); setConsequence('');
      setSaved(false); setHasExisting(false); setError(''); setNotice('本地记录已清除。');
    } catch { setError('未能清除本地记录，请检查浏览器存储权限。'); }
  };

  const exportBackup = () => {
    setError('');
    try {
      const entry: ReflectionEntry = { situation, thought, need: consequence, updatedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify({ format: 'xinge-reflection-backup', version: 1, entry }, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `xinge-abc-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      setNotice('ABC 记录已导出到你的设备。');
    } catch { setError('导出失败。请尝试其他浏览器，或先复制文本内容。'); }
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    setError(''); setNotice('');
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const wrapper = parsed as { format?: unknown; entry?: unknown };
      const candidate = wrapper?.format === 'xinge-reflection-backup' ? wrapper.entry : parsed;
      if (!isReflectionEntry(candidate)) throw new Error('invalid backup');
      const entry: ReflectionEntry = { situation: candidate.situation, thought: candidate.thought, need: candidate.need, updatedAt: candidate.updatedAt || new Date().toISOString() };
      reflectionStorage.save(entry); setSituation(entry.situation); setThought(entry.thought); setConsequence(entry.need);
      setHasExisting(true); setSaved(true); setNotice('备份已导入并保存到当前浏览器。');
    } catch { setError('无法导入该文件。请选择由心格导出的 JSON 备份文件。'); }
  };

  const fields = [
    { key: 'A', en: 'Activating event', title: '发生了什么？', hint: '只写可观察的事实，像摄像机一样记录时间、地点、人物和行为。', value: situation, set: setSituation, placeholder: '例：我发出消息，两小时后仍未收到回复……' },
    { key: 'B', en: 'Beliefs', title: '我如何解释这件事？', hint: '记录当时自动出现的想法、判断、规则或脑海画面，不急着评价对错。', value: thought, set: setThought, placeholder: '例：我是不是说错了？对方可能不想理我……' },
    { key: 'C', en: 'Consequences', title: '随后发生了什么？', hint: '分别留意情绪、身体反应和行为冲动；结果不是只有“好”或“不好”。', value: consequence, set: setConsequence, placeholder: '例：紧张 7/10，胸口发紧，反复查看手机……' },
  ];

  return <section className="section experiment" id="experiment">
    <span className="eyebrow">02 / 心理机制实验室</span>
    <h2>用 ABC，看见事件与反应之间的解释。</h2>
    <p className="intro">ABC 模型来自理性情绪行为疗法（REBT）。它提醒我们：诱发事件会影响人，但我们如何理解事件，也参与塑造之后的情绪与行为。<a className="cite-mark" href="#abc-reference-1" aria-label="查看参考资料 1">[1]</a> 这个模型用于观察，不是要求你否认现实或立刻改变感受。</p>

    <MechanismLibrary />

    <div className="abc-intro">
      <div className="abc-diagram" aria-label="ABC 理论关系图">
        {fields.map((field, index) => <div className="abc-concept" key={field.key}><span>{field.key}</span><small>{field.en}</small><b>{field.key === 'A' ? '诱发事件' : field.key === 'B' ? '信念与解释' : '情绪与行为结果'}</b>{index < 2 && <i>→</i>}</div>)}
      </div>
      <div className="abc-example"><small>一个生活示例</small><p><b>A</b> 会议上提出想法后，大家暂时没有回应。</p><p><b>B</b> “我的想法很差，他们一定觉得我没能力。”</p><p><b>C</b> 羞耻和紧张，肩膀发僵，之后不再发言。</p><em>如果 B 换成“大家可能还在思考，我可以询问具体反馈”，C 也许会不同。但新的解释仍要尊重事实，而不是强迫乐观。</em></div>
    </div>

    <div className="abc-guidance"><span>使用时记住</span><p><b>A 不是无关紧要：</b>现实处境、关系和环境确实会影响我们。</p><p><b>B 不是“错误思想”：</b>先理解它为何出现，再温和检查证据与其他可能。<a className="cite-mark" href="#abc-reference-2" aria-label="查看参考资料 2">[2]</a></p><p><b>C 不只是情绪：</b>也包括身体反应、行为和生理反应。<a className="cite-mark" href="#abc-reference-1" aria-label="查看参考资料 1">[1]</a></p></div>

    <div className="experiment-heading"><span className="eyebrow">三分钟 ABC 记录</span><h3>选择一件具体、刚刚发生的事。</h3><p>先记录，再反思。描述越具体，越容易看见可以调整的位置。</p></div>
    {hasExisting && <p className="storage-note">已载入上次保存在此浏览器中的记录。再次保存会覆盖原记录。</p>}
    <div className="fields">{fields.map(field => <label className="field" key={field.key}><span className="letter">{field.key}</span><small className="field-en">{field.en}</small><strong>{field.title}</strong><small>{field.hint}</small><textarea rows={4} value={field.value} onChange={event => { field.set(event.target.value); setSaved(false); setError(''); setNotice(''); }} placeholder={field.placeholder} /></label>)}</div>

    <div className="abc-reflect"><div><span className="eyebrow">写完之后</span><h3>不急着反驳，先多问三个问题。</h3></div><ul><li>这个解释有哪些事实支持？又有哪些信息还不知道？</li><li>如果朋友遇到同样的事，我会怎样理解和回应？</li><li>哪一种新解释既尊重感受，也更完整、更有行动空间？</li></ul></div>

    <div className="save-row"><small>内容只保存在当前浏览器，不会发送到服务器。建议定期导出备份。</small><div className="save-actions"><button className="secondary" type="button" onClick={exportBackup}><Download size={15}/> 导出备份</button><button className="secondary" type="button" onClick={() => fileInput.current?.click()}><Upload size={15}/> 导入备份</button><input ref={fileInput} className="file-input" type="file" accept="application/json,.json" onChange={importBackup} aria-label="选择 ABC 记录备份文件"/>{hasExisting && <button className="secondary" type="button" onClick={clear}><Trash2 size={15}/> 清除记录</button>}<button className="primary" type="button" onClick={save}>{saved ? '✓ 已保存在本地' : '保存这次观察 →'}</button></div></div>
    {notice && <p className="storage-success" role="status">{notice}</p>}{error && <p className="storage-error" role="alert">{error}</p>}
    <div className="abc-source"><p>ABC 是理解经验的一种简化框架，并不能概括所有心理、关系与环境因素。这里的练习不是心理诊断或治疗。</p></div>
    <section className="abc-references" aria-labelledby="abc-references-title"><span className="eyebrow">SOURCES / 参考资料</span><h3 id="abc-references-title">理论来源与延伸阅读</h3><p>以下资料用于核对模型定义和页面表述。链接指向原始机构资料，不代表对个人情况的诊断建议。</p><div className="reference-list">
      <a id="abc-reference-1" href="https://albertellis.org/wp-content/uploads/2021/09/Emotional-Disturbance-and-Its-Treatment-in-a-Nutshell-ABCs-.pdf" target="_blank" rel="noreferrer"><span>01</span><div><small>Albert Ellis Institute · REBT</small><b>Emotional Disturbance and Its Treatment in a Nutshell: The ABCs</b><p>用于说明诱发事件、信念以及情绪与行为结果之间的 ABC 关系。</p></div><ExternalLink size={14}/></a>
      <a id="abc-reference-2" href="https://beckinstitute.org/wp-content/uploads/2024/05/Cognitive-Model.pdf" target="_blank" rel="noreferrer"><span>02</span><div><small>Beck Institute · Cognitive Model · 2021</small><b>Cognitive Model</b><p>用于补充情境解释、自动思维以及情绪、行为和生理反应之间的关系。</p></div><ExternalLink size={14}/></a>
    </div></section>
  </section>;
}
