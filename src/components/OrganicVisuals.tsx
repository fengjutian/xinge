const branches = [
  'M26 180 C105 178 126 122 206 116 S302 72 378 52',
  'M26 180 C92 175 132 151 202 148 S298 112 388 106',
  'M26 180 C112 181 145 170 222 177 S310 153 414 145',
  'M26 180 C101 186 136 204 218 207 S321 195 414 208',
  'M26 180 C96 193 129 230 207 244 S301 250 392 278',
  'M26 180 C86 199 111 256 180 276 S269 302 357 320',
] as const;
const twigs = ['M126 143 C169 128 169 88 226 76','M184 123 C226 117 234 71 282 52','M158 158 C201 155 220 134 255 126','M226 176 C263 165 288 134 329 129','M172 195 C215 207 230 229 272 234','M229 208 C272 218 292 250 335 258','M129 218 C163 235 172 264 215 280','M191 268 C233 278 247 310 294 318'] as const;
const endpoints = [[226,76],[282,52],[378,52],[255,126],[388,106],[329,129],[414,145],[414,208],[272,234],[335,258],[392,278],[215,280],[294,318],[357,320]] as const;

export function BranchNetwork() {
  return <svg className="branch-network" viewBox="0 0 450 360" role="img" aria-label="从一个起点向外生长的探索路径"><g className="branch-lines">{branches.map(path => <path key={path} d={path} />)}{twigs.map(path => <path key={path} d={path} />)}</g><circle className="root-node" cx="26" cy="180" r="11" />{endpoints.map(([x,y], index) => <rect key={`${x}-${y}`} className={index % 3 === 0 ? 'node filled' : 'node'} x={x - 4} y={y - 4} width="8" height="8" />)}</svg>;
}

export function MiniMotif({ index }: { index: number }) {
  const common = { className: 'mini-motif', viewBox: '0 0 88 52', 'aria-hidden': true } as const;
  switch (index) {
    case 0: return <svg {...common}><path d="M10 39C24 33 25 15 42 12S63 23 77 13M10 39C30 42 49 35 66 39M42 12C45 23 53 31 66 39"/><circle className="accent" cx="10" cy="39" r="4"/><circle cx="42" cy="12" r="3"/><circle cx="77" cy="13" r="3"/><circle cx="66" cy="39" r="3"/></svg>;
    case 1: return <svg {...common}><path d="M10 27L28 11L45 27L65 12L78 31M10 27L31 42L45 27L62 42L78 31"/><circle cx="10" cy="27" r="3"/><circle cx="28" cy="11" r="3"/><circle className="accent" cx="45" cy="27" r="4"/><circle cx="65" cy="12" r="3"/><circle cx="78" cy="31" r="3"/><circle cx="31" cy="42" r="3"/><circle cx="62" cy="42" r="3"/></svg>;
    case 2: return <svg {...common}><path d="M44 43V30C44 21 34 21 34 13C34 5 45 5 51 9C59 15 53 22 47 23M44 43C30 39 22 31 13 22M44 43C56 39 67 31 76 19"/><circle className="accent" cx="44" cy="43" r="4"/><circle cx="13" cy="22" r="3"/><circle cx="76" cy="19" r="3"/><circle cx="47" cy="23" r="2.5"/></svg>;
    case 3: return <svg {...common}><path d="M8 29C17 29 17 14 27 14S36 39 46 39S56 20 65 20S72 29 80 29"/><circle cx="8" cy="29" r="3"/><circle className="accent" cx="27" cy="14" r="3.5"/><circle cx="46" cy="39" r="3"/><circle className="accent" cx="65" cy="20" r="3"/><circle cx="80" cy="29" r="3"/></svg>;
    case 4: return <svg {...common}><path d="M44 7L67 26L44 45L21 26Z M44 7V45M21 26H67"/><circle className="accent" cx="44" cy="7" r="3.5"/><circle cx="67" cy="26" r="3"/><circle cx="44" cy="45" r="3"/><circle cx="21" cy="26" r="3"/><circle cx="44" cy="26" r="3"/></svg>;
    case 5: return <svg {...common}><path d="M9 26H25C30 26 30 13 38 13S46 39 54 39S59 26 66 26H79"/><circle cx="9" cy="26" r="3"/><circle className="accent" cx="25" cy="26" r="3.5"/><circle cx="38" cy="13" r="3"/><circle className="accent" cx="54" cy="39" r="3.5"/><circle cx="66" cy="26" r="3"/><circle cx="79" cy="26" r="3"/></svg>;
    case 6: return <svg {...common}><path d="M44 45V8M44 33C35 31 29 25 24 17M44 27C53 25 60 18 65 10M44 39C34 39 20 36 12 30M44 35C56 36 69 33 78 26"/><circle className="accent" cx="44" cy="45" r="4"/><circle cx="44" cy="8" r="3"/><circle cx="24" cy="17" r="3"/><circle cx="65" cy="10" r="3"/><circle cx="12" cy="30" r="3"/><circle cx="78" cy="26" r="3"/></svg>;
    case 7: return <svg {...common}><path d="M42 7V45M35 14C25 14 17 20 11 27C18 35 26 39 35 39M49 14C59 14 67 20 73 27C66 35 58 39 49 39M27 26C30 22 34 22 38 26M57 26C54 22 50 22 46 26"/><circle cx="11" cy="27" r="3"/><circle className="accent" cx="27" cy="26" r="3"/><circle className="accent" cx="57" cy="26" r="3"/><circle cx="73" cy="27" r="3"/></svg>;
    default: return <svg {...common}><path d="M14 11H62M14 21H73M14 31H55M14 41H66M62 11C70 15 69 24 73 21M55 31C62 32 61 39 66 41"/><circle className="accent" cx="14" cy="11" r="3"/><circle cx="14" cy="21" r="3"/><circle cx="14" cy="31" r="3"/><circle cx="14" cy="41" r="3"/><circle cx="62" cy="11" r="3"/><circle cx="73" cy="21" r="3"/><circle cx="55" cy="31" r="3"/><circle cx="66" cy="41" r="3"/></svg>;
  }
}

export function PageNetwork() {
  return <svg className="page-network" viewBox="0 0 600 220" aria-hidden="true"><g>{[0,1,2,3,4].map(i => <path key={i} d={`M590 ${30+i*38} C480 ${12+i*42}, 420 ${75+i*18}, 330 ${54+i*30} S190 ${55+i*28}, 42 ${28+i*39}`} />)}</g>{[[590,30],[590,106],[590,182],[330,114],[173,139],[42,184]].map(([x,y],i)=><circle key={i} className={i%2?'accent':''} cx={x} cy={y} r={i>2?3:4}/>)}</svg>;
}

export function OrganicDivider() {
  return <div className="organic-divider" aria-hidden="true"><svg viewBox="0 0 1200 90" preserveAspectRatio="none"><path d="M0 45 C180 45 250 42 402 45 S570 45 600 45 S790 49 1200 45"/><path d="M600 45 C555 42 530 22 488 18"/><path d="M600 45 C648 44 676 19 720 15"/><path d="M600 45 C558 49 535 70 498 75"/><path d="M600 45 C646 49 675 70 714 74"/><circle cx="600" cy="45" r="5"/><circle className="accent" cx="488" cy="18" r="3"/><circle cx="720" cy="15" r="3"/><circle cx="498" cy="75" r="3"/><circle className="accent" cx="714" cy="74" r="3"/></svg></div>;
}
