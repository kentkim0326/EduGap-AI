// 나이스 Open API — 학교기본정보 연동
import { NextRequest, NextResponse } from 'next/server'

const NEIS_BASE = 'https://open.neis.go.kr/hub'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const regionCode = searchParams.get('region') || '10' // 서울 기본
  const apiKey = process.env.NEIS_API_KEY || 'demo'

  try {
    const url = `${NEIS_BASE}/schoolInfo?KEY=${apiKey}&Type=json&pIndex=1&pSize=20&ATPT_OFCDC_SC_CODE=${regionCode}`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) throw new Error('NEIS API error')
    const json = await res.json()

    // NEIS API 응답 파싱
    const schools = json?.schoolInfo?.[1]?.row ?? []
    const parsed = schools.map((s: Record<string, string>) => ({
      name: s.SCHUL_NM,
      address: s.ORG_RDNMA,
      schoolType: s.SCHUL_KND_SC_NM,
      establishDate: s.FOND_YMD,
      homepage: s.HMPG_ADRES,
    }))

    return NextResponse.json({ success: true, data: parsed, count: parsed.length })
  } catch {
    // API 키 없을 때 데모 데이터 반환
    return NextResponse.json({
      success: true,
      demo: true,
      data: [
        { name: '서울초등학교', address: '서울특별시 종로구', schoolType: '초등학교', establishDate: '19800301' },
        { name: '한강중학교',   address: '서울특별시 마포구', schoolType: '중학교',   establishDate: '19920301' },
        { name: '광화문고등학교', address: '서울특별시 종로구', schoolType: '고등학교', establishDate: '19950301' },
      ],
      count: 3,
      message: 'NEIS_API_KEY 환경변수 설정 시 실시간 데이터 연동 가능'
    })
  }
}
