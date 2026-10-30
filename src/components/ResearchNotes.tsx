import { Link } from 'react-router-dom';
import { notes } from '../data';

export default function ResearchNotes() {
  return <section className="section notes" id="notes">
    <span className="eyebrow">03 / 研究笔记</span>
    <h2>一些值得带在身边的想法。</h2>
    <div className="notes-grid">{notes.map(note => <article key={note[0]}>
      <div className="note-top"><span>{note[0]}</span><small>{note[3]}</small></div>
      <h3>{note[1]}</h3><p>{note[2]}</p><Link to="/question">继续探索 ↗</Link>
    </article>)}</div>
  </section>;
}
