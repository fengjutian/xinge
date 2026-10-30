import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { reflectionStorage, ReflectionEntry } from '../lib/reflectionStorage';

function isReflectionEntry(value: unknown): value is ReflectionEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<ReflectionEntry>;
  return typeof entry.situation === 'string'
    && typeof entry.thought === 'string'
    && typeof entry.need === 'string'
    && (entry.updatedAt === undefined || typeof entry.updatedAt === 'string');
}

export default function ReflectionExperiment() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [need, setNeed] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const entry = reflectionStorage.load();
      if (!entry) return;
      setSituation(entry.situation);
      setThought(entry.thought);
      setNeed(entry.need);
      setHasExisting(true);
    } catch {
      setError('无法读取本地记录。请检查浏览器存储权限；如果之前导出过备份，可以尝试导入恢复。');
    }
  }, []);

  const save = () => {
    setError('');
    setNotice('');
    try {
      reflectionStorage.save({ situation, thought, need, updatedAt: new Date().toISOString() });
      setSaved(true);
      setHasExisting(true);
      setNotice('已保存到当前浏览器。');
    } catch {
      setSaved(false);
      setError('浏览器暂时无法保存。请检查存储空间或隐私设置，并先导出或复制保留重要内容。');
    }
  };

  const clear = () => {
    if (!window.confirm('确定清除保存在此浏览器中的这条反思记录吗？建议先导出备份。')) return;
    try {
      reflectionStorage.clear();
      setSituation(''); setThought(''); setNeed('');
      setSaved(false); setHasExisting(false); setError(''); setNotice('本地记录已清除。');
    } catch {
      setError('未能清除本地记录，请检查浏览器存储权限。');
    }
  };

  const exportBackup = () => {
    setError('');
    try {
      const entry: ReflectionEntry = { situation, thought, need, updatedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify({ format: 'xinge-reflection-backup', version: 1, entry }, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `xinge-reflection-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setNotice('备份文件已导出到你的设备。');
    } catch {
      setError('导出失败。请尝试使用其他浏览器，或先复制文本内容。');
    }
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(''); setNotice('');
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const wrapper = parsed as { format?: unknown; version?: unknown; entry?: unknown };
      const candidate = wrapper?.format === 'xinge-reflection-backup' ? wrapper.entry : parsed;
      if (!isReflectionEntry(candidate)) throw new Error('invalid backup');
      const entry: ReflectionEntry = {
        situation: candidate.situation,
        thought: candidate.thought,
        need: candidate.need,
        updatedAt: candidate.updatedAt || new Date().toISOString(),
      };
      reflectionStorage.save(entry);
      setSituation(entry.situation); setThought(entry.thought); setNeed(entry.need);
      setHasExisting(true); setSaved(true);
      setNotice('备份已导入并保存到当前浏览器。');
    } catch {
      setError('无法导入该文件。请选择心格导出的 JSON 备份文件，且确认浏览器允许本地存储。');
    }
  };

  const fields = [
    { key: 'A', title: '发生了什么？', hint: '尽量写下摄像机能够记录的事实。', value: situation, set: setSituation },
    { key: 'B', title: '我脑海里出现了什么解释？', hint: '留意“我猜”“我担心”“我认为”等句子。', value: thought, set: setThought },
    { key: 'C', title: '这件事触碰了什么在意？', hint: '也许是认可、准备、理解或个人空间。', value: need, set: setNeed },
  ];

  return (
    <section className="section experiment" id="experiment">
      <span className="eyebrow">02 / 心理机制实验室</span>
      <h2>把一团担心，拆成可以观察的部分。</h2>
      <p className="intro">用三分钟记录一次真实经历。先不急着纠正自己，只尝试区分发生了什么、脑海里出现了什么，以及你在意什么。</p>
      {hasExisting && <p className="storage-note">已载入上次保存在此浏览器中的记录。编辑后再次保存会覆盖它。</p>}
      <div className="fields">
        {fields.map((field) => (
          <label className="field" key={field.key}>
            <span className="letter">{field.key}</span>
            <strong>{field.title}</strong>
            <small>{field.hint}</small>
            <textarea rows={4} value={field.value} onChange={(event) => { field.set(event.target.value); setSaved(false); setError(''); setNotice(''); }} placeholder="写下你愿意观察的一点……" />
          </label>
        ))}
      </div>
      <div className="save-row">
        <small>内容只保存在当前浏览器，不会发送到服务器。建议定期导出备份。</small>
        <div className="save-actions">
          <button className="secondary" type="button" onClick={exportBackup}><Download size={15} /> 导出备份</button>
          <button className="secondary" type="button" onClick={() => fileInput.current?.click()}><Upload size={15} /> 导入备份</button>
          <input ref={fileInput} className="file-input" type="file" accept="application/json,.json" onChange={importBackup} aria-label="选择心格反思备份文件" />
          {hasExisting && <button className="secondary" type="button" onClick={clear}><Trash2 size={15} /> 清除记录</button>}
          <button className="primary" type="button" onClick={save}>{saved ? '✓ 已保存在本地' : '保存这次观察 →'}</button>
        </div>
      </div>
      {notice && <p className="storage-success" role="status">{notice}</p>}
      {error && <p className="storage-error" role="alert">{error}</p>}
      <p className="disclaimer">这是一项自我反思练习，不是心理诊断、人格测量或未来预测。若痛苦持续影响生活，可考虑向合格的心理健康专业人士寻求支持。</p>
    </section>
  );
}
