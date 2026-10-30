import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const mechanisms = [
  { id:'regulation', no:'01', title:'情绪调节过程', en:'EMOTION REGULATION', summary:'情绪展开的不同阶段，都可能成为可介入的位置。', loop:['选择或进入情境','注意落在哪里','如何评价意义','情绪与身体反应'], question:'我现在更可能改变情境、注意方向、解释方式，还是回应方式？', practice:'先选择一个最早、最小的介入点，不要求立刻让情绪消失。', boundary:'不同策略是否有帮助取决于情境、目标与强度，没有一种策略永远最好。', source:'Gross · Process Model of Emotion Regulation', url:'https://emergingtrends.stanford.edu/files/original/91918bc0b9659cda25dabb59beb8be03d91e2313.pdf' },
  { id:'rumination', no:'02', title:'反刍循环', en:'RUMINATION LOOP', summary:'思考看似在寻找答案，却可能重复同一问题而没有产生新信息。', loop:['出现不适','反复追问“为什么”','短暂获得控制感','注意收窄、不适延续'], question:'这段思考有没有产生新信息、具体行动或明确结束点？', practice:'把“为什么总这样”改写为“下一步能验证什么”，并为思考设置结束时间。', boundary:'重复思考并不都无益；关键在于它是否具体、可行动，并帮助问题推进。', source:'Watkins · Constructive and Unconstructive Repetitive Thought', url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC2672052/' },
  { id:'experiential-avoidance', no:'03', title:'体验回避', en:'EXPERIENTIAL AVOIDANCE', summary:'为了不接触某些想法、感受或身体感觉，而让行为越来越受它们控制。', loop:['出现不想要的体验','努力压制或逃离','短期得到缓解','长期选择空间缩小'], question:'我是在远离一种感受，还是在靠近真正重视的生活？', practice:'选择一个安全、足够小的动作，在允许不适存在的同时靠近价值方向。', boundary:'接纳不等于忍受伤害；真实危险、侵犯和不安全环境需要保护与行动。', source:'ACBS · ACT and Psychological Flexibility', url:'https://contextualscience.org/about_act' },
  { id:'avoidance', no:'04', title:'回避与负强化', en:'AVOIDANCE LEARNING', summary:'回避让焦虑短期下降，这份轻松会提高下次继续回避的可能。', loop:['预期威胁','回避或寻求保证','焦虑暂时下降','缺少修正预期的经验'], question:'这次回避保护了我什么？又让我错过了什么新信息？', practice:'只在安全前提下，把任务缩小一级，尝试一次可退出、可观察的接近。', boundary:'回避真实危险是适应性保护；不要把所有退出或设立边界都视为问题。', source:'Krypotos et al. · Avoidance Learning Review', url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4508580/' },
  { id:'needs', no:'05', title:'基本心理需要', en:'BASIC PSYCHOLOGICAL NEEDS', summary:'自主、胜任与联结的满足程度，会影响动力和日常体验。', loop:['自主：是否有选择','胜任：是否能产生影响','联结：是否被理解连接','环境支持或阻碍'], question:'此刻最受阻的是选择感、能力感，还是连接感？', practice:'为最受阻的一项增加一个小支持：多一个选择、降低难度，或发出一次联系。', boundary:'三种需要是理解环境与经验的视角，不是人格分类，也不是简单打分。', source:'Self-Determination Theory · Basic Needs', url:'https://selfdeterminationtheory.org/basic-psychological-need-satisfaction-scales/' },
] as const;

export default function MechanismLibrary(){
  const [selected,setSelected]=useState<(typeof mechanisms)[number]['id']>(mechanisms[0].id);
  const active=mechanisms.find(item=>item.id===selected)!;
  return <section className="mechanism-library" aria-labelledby="mechanism-library-title">
    <div className="mechanism-library-head"><div><span className="eyebrow">机制索引 / MECHANISM LIBRARY</span><h3 id="mechanism-library-title">先找到正在运作的回路。</h3><p>机制不是给人贴标签，而是帮助观察：什么触发了反应、什么维持了它，以及哪里可能出现一点选择空间。</p></div><span className="mechanism-count">05 个观察入口</span></div>
    <div className="mechanism-browser"><div className="mechanism-tabs" role="tablist" aria-label="选择心理机制">{mechanisms.map(item=><button key={item.id} role="tab" aria-selected={selected===item.id} className={selected===item.id?'active':''} onClick={()=>setSelected(item.id)}><small>{item.no}</small><span>{item.title}<em>{item.en}</em></span></button>)}</div>
      <article className="mechanism-detail" role="tabpanel"><div className="mechanism-title"><span>{active.no}</span><div><small>{active.en}</small><h4>{active.title}</h4></div></div><p className="mechanism-summary">{active.summary}</p><div className="mechanism-loop">{active.loop.map((step,index)=><div key={step}><small>0{index+1}</small><b>{step}</b>{index<active.loop.length-1&&<i>→</i>}</div>)}</div><div className="mechanism-tools"><div><small>观察问题</small><p>{active.question}</p></div><div><small>一个小练习</small><p>{active.practice}</p></div></div><p className="mechanism-boundary"><b>边界提醒</b>{active.boundary}</p><a href={active.url} target="_blank" rel="noreferrer">来源：{active.source}<ExternalLink size={12}/></a></article>
    </div>
  </section>;
}
