// 학교알리미 CSV 파싱 API
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const regionId = searchParams.get('regionId') || '11'

  // public/data/ 폴더에 학교알리미 CSV 파일 위치
  const csvPath = path.join(process.cwd(), 'public', 'data', `schoolinfo_${regionId}.csv`)

  // CSV 파일이 없으면 샘플 데이터 반환
  if (!fs.existsSync(csvPath)) {
    return NextResponse.json({
      success: true,
      demo: true,
      message: 'public/data/schoolinfo_{regionId}.csv 파일 배치 시 실제 데이터 사용',
      data: generateSampleData(regionId),
    })
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(Boolean)
  const headers = lines[0].split(',')
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',')
    return headers.reduce((obj: Record<string, string>, h, i) => {
      obj[h.trim()] = vals[i]?.trim() ?? ''
      return obj
    }, {})
  })

  return NextResponse.json({ success: true, data: rows, count: rows.length })
}

function generateSampleData(regionId: string) {
  const counts: Record<string, number> = {
    '11': 1326, '26': 612, '27': 432, '28': 521, '29': 218,
    '30': 241, '31': 213, '36': 98,  '41': 2341, '42': 312,
    '43': 289, '44': 312, '45': 278, '46': 251,  '47': 342,
    '48': 421, '50': 112,
  }
  return {
    totalSchools: counts[regionId] ?? 200,
    avgTeacherRatio: (10 + Math.random() * 5).toFixed(1),
    oldBuildingRate: (15 + Math.random() * 40).toFixed(1),
    avgPrograms: (3 + Math.random() * 7).toFixed(1),
  }
}
