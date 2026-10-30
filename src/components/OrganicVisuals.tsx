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
  const mode = index % 3;
  if (mode === 0) return <svg className="mini-motif" viewBox="0 0 88 52" aria-hidden="true"><path d="M8 42Q28 35 42 10M8 42Q38 38 54 14M8 42Q48 43 72 24"/><circle cx="8" cy="42" r="4"/><circle cx="42" cy="10" r="3"/><circle cx="54" cy="14" r="3"/><circle cx="72" cy="24" r="3"/></svg>;
  if (mode === 1) return <svg className="mini-motif" viewBox="0 0 88 52" aria-hidden="true"><path d="M12 10V39M32 10V39M52 10V39M72 10V39"/>{[12,32,52,72].map(x=><circle key={x} cx={x} cy="10" r="3"/>)}{[12,32,52,72].map(x=><circle key={x} className="accent" cx={x} cy="39" r="3"/>)}</svg>;
  return <svg className="mini-motif" viewBox="0 0 88 52" aria-hidden="true"><path d="M8 42Q38 31 44 8M44 8Q54 27 78 32M44 8Q38 31 44 45M44 8Q25 20 12 22"/><circle cx="44" cy="8" r="4"/><circle cx="8" cy="42" r="3"/><circle cx="78" cy="32" r="3"/><circle cx="44" cy="45" r="3"/><circle cx="12" cy="22" r="3"/></svg>;
}

export function PageNetwork() {
  return <svg className="page-network" viewBox="0 0 600 220" aria-hidden="true"><g>{[0,1,2,3,4].map(i => <path key={i} d={`M590 ${30+i*38} C480 ${12+i*42}, 420 ${75+i*18}, 330 ${54+i*30} S190 ${55+i*28}, 42 ${28+i*39}`} />)}</g>{[[590,30],[590,106],[590,182],[330,114],[173,139],[42,184]].map(([x,y],i)=><circle key={i} className={i%2?'accent':''} cx={x} cy={y} r={i>2?3:4}/>)}</svg>;
}
