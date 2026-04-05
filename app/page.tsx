'use client'
import { useState, useEffect } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { REGION_DATA, CLUSTER_INFO, getEdiColor, getEdiLabel } from '@/lib/data'
import { MapPin, TrendingDown, Users, BookOpen, Building2, Zap, ChevronRight, Activity } from 'lucide-react'

// ── 커스텀 툴팁 ──────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f1929', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: '#8899bb', fontSize: 12, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontFamily: 'DM Mono, monospace' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── 시뮬레이터 ──────────────────────────────
function Simulator({ region }: { region: typeof REGION_DATA[0] }) {
  const [teacherBoost, setTeacherBoost] = useState(0)
  const [budgetBoost, setBudgetBoost] = useState(0)
  const [facilityBoost, setFacilityBoost] = useState(0)

  const improvement = (teacherBoost * 0.25 + budgetBoost * 0.2 + facilityBoost * 0.18) * 0.6
  const newScore = Math.max(5, region.ediScore - improvement)
  const delta = region.ediScore - newScore

  const simData = [
    { label: '현재', score: region.ediScore },
    { label: '1년후', score: Math.max(5, region.ediScore - improvement * 0.3) },
    { label: '3년후', score: Math.max(5, region.ediScore - improvement * 0.7) },
    { label: '5년후', score: newScore },
  ]

  return (
    <div style={{ background: '#0a111f', border: '1px solid #1e2d45', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={16} color="#f59e0b" />
        <span style={{ color: '#e8edf5', fontWeight: 500 }}>자원 배분 시뮬레이터 — {region.shortName}</span>
      </div>

      <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
        {[
          { label: '교원 증원', value: teacherBoost, set: setTeacherBoost, unit: '명', max: 50 },
          { label: '예산 증가율', value: budgetBoost, set: setBudgetBoost, unit: '%', max: 30 },
          { label: '시설 개보수', value: facilityBoost, set: setFacilityBoost, unit: '%', max: 40 },
        ].map(({ label, value, set, unit, max }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#8899bb', fontSize: 12 }}>{label}</span>
              <span style={{ color: '#06b6d4', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>+{value}{unit}</span>
            </div>
            <input type="range" min={0} max={max} value={value}
              onChange={e => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#0f1929', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ color: '#4a607a', fontSize: 11, marginBottom: 4 }}>현재 EDI</div>
          <div style={{ color: getEdiColor(region.ediScore), fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 700 }}>{region.ediScore}</div>
        </div>
        <div style={{ background: '#0f1929', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ color: '#4a607a', fontSize: 11, marginBottom: 4 }}>개선 후 EDI</div>
          <div style={{ color: getEdiColor(newScore), fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 700 }}>
            {newScore.toFixed(1)}
            {delta > 0 && <span style={{ fontSize: 13, color: '#10b981', marginLeft: 6 }}>▼{delta.toFixed(1)}</span>}
          </div>
        </div>
      </div>

      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="label" tick={{ fill: '#4a607a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#4a607a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────
export default function Home() {
  const [selectedId, setSelectedId] = useState('46') // 전남 기본 선택 (최취약)
  const [compareId, setCompareId] = useState('11')   // 서울 비교
  const [mounted, setMounted] = useState(false)
  const [apiStatus, setApiStatus] = useState<'idle'|'loading'|'ok'|'demo'>('idle')
  const [neisData, setNeisData] = useState<{ name: string; address: string; schoolType: string }[]>([])

  useEffect(() => { setMounted(true) }, [])

  const selected = REGION_DATA.find(r => r.id === selectedId)!
  const compare  = REGION_DATA.find(r => r.id === compareId)!

  // 나이스 API 호출
  useEffect(() => {
    setApiStatus('loading')
    fetch(`/api/neis?region=${selectedId}`)
      .then(r => r.json())
      .then(d => {
        setNeisData(d.data ?? [])
        setApiStatus(d.demo ? 'demo' : 'ok')
      })
      .catch(() => setApiStatus('demo'))
  }, [selectedId])

  // 레이더 차트 데이터
  const radarData = [
    { subject: '교원비율', A: 100 - (selected.teacherRatio / 16 * 100), B: 100 - (compare.teacherRatio / 16 * 100) },
    { subject: '시설양호', A: 100 - selected.facilityAge,               B: 100 - compare.facilityAge },
    { subject: '프로그램', A: selected.programCount / 10 * 100,         B: compare.programCount / 10 * 100 },
    { subject: '예산수준', A: selected.budgetPerStudent / 170 * 100,    B: compare.budgetPerStudent / 170 * 100 },
    { subject: '특수학급', A: selected.specialClassRate,                 B: compare.specialClassRate },
  ]

  // 막대 차트 — 전체 EDI 순위
  const barData = [...REGION_DATA].sort((a, b) => b.ediScore - a.ediScore)

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ── 헤더 ── */}
      <header style={{ borderBottom: '1px solid #1e2d45', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0e1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>EduGap AI</span>
          <span style={{ color: '#4a607a', fontSize: 12, marginLeft: 4 }}>교육 격차 분석 플랫폼</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ background: apiStatus === 'ok' ? '#052e16' : '#1a1000', color: apiStatus === 'ok' ? '#10b981' : '#f59e0b', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
            <span className="pulse" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: apiStatus === 'ok' ? '#10b981' : '#f59e0b', marginRight: 5 }} />
            {apiStatus === 'loading' ? 'NEIS 연결중...' : apiStatus === 'ok' ? 'NEIS LIVE' : 'DEMO MODE'}
          </span>
          <span style={{ color: '#4a607a', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>제8회 교육 공공데이터 AI활용대회</span>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── 히어로 ── */}
        <div className="fade-up fade-up-1" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              <span className="grad-text">데이터로 보는</span> 교육 불평등
            </h1>
            <span style={{ color: '#4a607a', fontSize: 13 }}>2020–2024 교육통계서비스 · 학교알리미 기반</span>
          </div>
          <p style={{ color: '#8899bb', maxWidth: 600 }}>
            17개 시도 교육 격차 지수(EDI)를 실시간으로 분석하고, AI 기반 자원 배분 시나리오를 시뮬레이션합니다.
          </p>
        </div>

        {/* ── KPI 카드 4개 ── */}
        <div className="fade-up fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { icon: <MapPin size={16} />, label: '분석 지역', value: '17개 시도', sub: '229개 시군구 확장 예정', color: '#3b82f6' },
            { icon: <Users size={16} />, label: '최취약 지역 EDI', value: `${Math.max(...REGION_DATA.map(r=>r.ediScore))}점`, sub: REGION_DATA.find(r=>r.ediScore===Math.max(...REGION_DATA.map(x=>x.ediScore)))?.shortName ?? '', color: '#ef4444' },
            { icon: <TrendingDown size={16} />, label: 'EDI 격차 (최대-최소)', value: `${Math.max(...REGION_DATA.map(r=>r.ediScore)) - Math.min(...REGION_DATA.map(r=>r.ediScore))}점`, sub: '교육 불균형 수준', color: '#f59e0b' },
            { icon: <BookOpen size={16} />, label: '데이터 출처', value: '3개 공공API', sub: 'NEIS · 학교알리미 · KESS', color: '#10b981' },
          ].map(({ icon, label, value, sub, color }) => (
            <div key={label} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, marginBottom: 10 }}>
                {icon}
                <span style={{ fontSize: 11, fontWeight: 500, color: '#8899bb' }}>{label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'DM Mono, monospace', color, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#4a607a' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── 메인 그리드 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, marginBottom: 16 }}>

          {/* ── 지역 목록 ── */}
          <div className="card fade-up fade-up-2" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e2d45', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>시도별 EDI 순위</span>
              <span style={{ fontSize: 11, color: '#4a607a' }}>높을수록 취약</span>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 480 }}>
              {barData.map((r, i) => (
                <div key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  style={{
                    padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #0f1929',
                    background: selectedId === r.id ? '#0c1a2e' : 'transparent',
                    transition: 'background 0.15s'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#4a607a', fontFamily: 'DM Mono, monospace', fontSize: 11, width: 18 }}>{i+1}</span>
                      <span style={{ fontSize: 13, color: selectedId === r.id ? '#e8edf5' : '#8899bb' }}>{r.shortName}</span>
                      <span style={{ background: CLUSTER_INFO[r.cluster].bg, color: CLUSTER_INFO[r.cluster].color, fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>{r.cluster}형</span>
                    </div>
                    <span style={{ color: getEdiColor(r.ediScore), fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 600 }}>{r.ediScore}</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${r.ediScore}%`, background: getEdiColor(r.ediScore) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 상세 + 레이더 ── */}
          <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: 12 }}>

            {/* 선택 지역 상세 */}
            <div className="card fade-up fade-up-3" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700 }}>{selected.name}</h2>
                    <span style={{ background: CLUSTER_INFO[selected.cluster].bg, color: CLUSTER_INFO[selected.cluster].color, fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{CLUSTER_INFO[selected.cluster].label}</span>
                  </div>
                  <p style={{ color: '#8899bb', fontSize: 12 }}>{CLUSTER_INFO[selected.cluster].desc}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#4a607a', marginBottom: 2 }}>교육 격차 지수(EDI)</div>
                  <div style={{ fontSize: 40, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: getEdiColor(selected.ediScore), lineHeight: 1 }}>{selected.ediScore}</div>
                  <div style={{ fontSize: 11, marginTop: 2, color: getEdiColor(selected.ediScore) }}>{getEdiLabel(selected.ediScore)}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                {[
                  { icon: <Users size={12} />, label: '교원 1인당', value: `${selected.teacherRatio}명`, color: '#3b82f6' },
                  { icon: <Building2 size={12} />, label: '노후 시설', value: `${selected.facilityAge}%`, color: '#f59e0b' },
                  { icon: <BookOpen size={12} />, label: '방과후 프로그램', value: `${selected.programCount}개`, color: '#10b981' },
                  { icon: <Zap size={12} />, label: '1인당 예산', value: `${selected.budgetPerStudent}만`, color: '#8b5cf6' },
                  { icon: <Activity size={12} />, label: '특수학급 충족', value: `${selected.specialClassRate}%`, color: '#06b6d4' },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} style={{ background: '#0a111f', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color, marginBottom: 6 }}>{icon}<span style={{ fontSize: 10, color: '#4a607a' }}>{label}</span></div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 600, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 레이더 + 비교 선택 */}
            <div className="card fade-up fade-up-3" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>지역 비교 레이더</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#8899bb' }}>비교 지역:</span>
                  <select value={compareId} onChange={e => setCompareId(e.target.value)}
                    style={{ background: '#0a111f', border: '1px solid #1e2d45', color: '#e8edf5', borderRadius: 6, padding: '3px 8px', fontSize: 12, cursor: 'pointer' }}>
                    {REGION_DATA.filter(r => r.id !== selectedId).map(r => (
                      <option key={r.id} value={r.id}>{r.shortName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e2d45" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8899bb', fontSize: 11 }} />
                    <Radar name={selected.shortName} dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={1.5} />
                    <Radar name={compare.shortName}  dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={1.5} />
                    <Legend wrapperStyle={{ color: '#8899bb', fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── 하단 그리드: EDI 막대 + 시뮬레이터 + NEIS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px 300px', gap: 16, marginBottom: 32 }}>

          {/* EDI 막대 그래프 */}
          <div className="card fade-up fade-up-4" style={{ padding: 20 }}>
            <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 13 }}>전국 EDI 현황</div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                  <XAxis dataKey="shortName" tick={{ fill: '#4a607a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a607a', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0,100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e2d45' }} />
                  <Bar dataKey="ediScore" name="EDI점수" radius={[3,3,0,0]}>
                    {barData.map(r => (
                      <Cell key={r.id} fill={selectedId === r.id ? '#ffffff' : getEdiColor(r.ediScore)} opacity={selectedId === r.id ? 1 : 0.75} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 시뮬레이터 */}
          <div className="fade-up fade-up-4">
            <Simulator region={selected} />
          </div>

          {/* NEIS API 연동 결과 */}
          <div className="card fade-up fade-up-4" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>NEIS 학교 정보</span>
              <span style={{ background: '#0a111f', color: '#8899bb', fontSize: 10, padding: '1px 6px', borderRadius: 3 }}>OPEN API</span>
            </div>
            {apiStatus === 'loading' ? (
              <div style={{ color: '#4a607a', fontSize: 12, textAlign: 'center', padding: 30 }}>데이터 로딩 중...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {neisData.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ background: '#0a111f', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{s.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4a607a', fontSize: 11 }}>{s.address?.slice(0, 12)}</span>
                      <span style={{ color: '#06b6d4', fontSize: 10, padding: '1px 5px', background: '#0c1f2e', borderRadius: 3 }}>{s.schoolType}</span>
                    </div>
                  </div>
                ))}
                {apiStatus === 'demo' && (
                  <div style={{ color: '#4a607a', fontSize: 11, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ChevronRight size={10} /> NEIS_API_KEY 설정 시 실시간 연동
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 군집 유형 범례 ── */}
        <div className="card fade-up fade-up-4" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 13 }}>K-Means 군집 분석 결과 (K=4)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {(Object.entries(CLUSTER_INFO) as [string, { label: string; color: string; bg: string; desc: string }][]).map(([k, v]) => (
              <div key={k} style={{ background: v.bg, border: `1px solid ${v.color}30`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ color: v.color, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{v.label}</div>
                <p style={{ color: '#8899bb', fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{v.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {REGION_DATA.filter(r => r.cluster === k).map(r => (
                    <span key={r.id} onClick={() => setSelectedId(r.id)}
                      style={{ background: '#0a0e1a', color: v.color, fontSize: 11, padding: '2px 7px', borderRadius: 4, cursor: 'pointer', border: `1px solid ${v.color}40` }}>
                      {r.shortName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 푸터 ── */}
        <footer style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #1e2d45', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#4a607a', fontSize: 11 }}>
            <span style={{ fontFamily: 'DM Mono, monospace' }}>EduGap AI</span> — 제8회 교육 공공데이터 AI활용대회 출품작
          </div>
          <div style={{ color: '#4a607a', fontSize: 11 }}>
            데이터 출처: 교육통계서비스(KESS) · 학교알리미 · 나이스 교육정보 개방포털 | 공공누리 1유형
          </div>
        </footer>
      </main>
    </div>
  )
}
