// 교육 격차 지수(EDI) 계산 및 지역 데이터 타입 정의
// ⚠️ 이 데이터는 edi_analysis.py 실행 결과(region_data.json)에서 자동 생성된 값입니다.
// 학교알리미 실제 CSV 넣고 재실행하면 더 정확한 수치로 업데이트됩니다.

export interface RegionData {
  id: string
  name: string
  shortName: string
  ediScore: number
  teacherRatio: number
  facilityAge: number
  programCount: number
  budgetPerStudent: number
  specialClassRate: number
  cluster: 'A' | 'B' | 'C' | 'D'
  lat: number
  lng: number
}

export interface SchoolInfo {
  schoolName: string
  address: string
  studentCount: number
  teacherCount: number
  establishYear: number
}

// ── region_data.json 반영 (edi_analysis.py 계산 결과) ──────────────
export const REGION_DATA: RegionData[] = [
  { id: '46', name: '전라남도',       shortName: '전남', ediScore: 74.2, teacherRatio: 10.61, facilityAge: 51.9, programCount: 3.4, budgetPerStudent: 113, specialClassRate: 70.0, cluster: 'D', lat: 34.8679, lng: 126.9910 },
  { id: '47', name: '경상북도',       shortName: '경북', ediScore: 72.3, teacherRatio: 11.01, facilityAge: 50.3, programCount: 3.6, budgetPerStudent: 121, specialClassRate: 71.1, cluster: 'D', lat: 36.4919, lng: 128.8889 },
  { id: '45', name: '전라북도',       shortName: '전북', ediScore: 68.8, teacherRatio: 10.66, facilityAge: 45.7, programCount: 3.6, budgetPerStudent: 111, specialClassRate: 75.2, cluster: 'D', lat: 35.7175, lng: 127.1530 },
  { id: '42', name: '강원특별자치도', shortName: '강원', ediScore: 64.8, teacherRatio: 11.18, facilityAge: 41.3, programCount: 4.4, budgetPerStudent: 119, specialClassRate: 75.4, cluster: 'D', lat: 37.8228, lng: 128.1555 },
  { id: '43', name: '충청북도',       shortName: '충북', ediScore: 63.9, teacherRatio: 11.90, facilityAge: 37.4, programCount: 4.5, budgetPerStudent: 122, specialClassRate: 81.5, cluster: 'C', lat: 36.8002, lng: 127.7004 },
  { id: '26', name: '부산광역시',     shortName: '부산', ediScore: 60.7, teacherRatio: 13.33, facilityAge: 33.4, programCount: 6.3, budgetPerStudent: 127, specialClassRate: 88.8, cluster: 'B', lat: 35.1796, lng: 129.0756 },
  { id: '44', name: '충청남도',       shortName: '충남', ediScore: 60.4, teacherRatio: 11.88, facilityAge: 34.7, programCount: 4.8, budgetPerStudent: 123, specialClassRate: 82.5, cluster: 'C', lat: 36.5184, lng: 126.8000 },
  { id: '28', name: '인천광역시',     shortName: '인천', ediScore: 60.1, teacherRatio: 13.63, facilityAge: 24.5, programCount: 6.9, budgetPerStudent: 124, specialClassRate: 84.9, cluster: 'B', lat: 37.4563, lng: 126.7052 },
  { id: '48', name: '경상남도',       shortName: '경남', ediScore: 59.4, teacherRatio: 11.75, facilityAge: 34.1, programCount: 5.1, budgetPerStudent: 123, specialClassRate: 80.0, cluster: 'C', lat: 35.4606, lng: 128.2132 },
  { id: '27', name: '대구광역시',     shortName: '대구', ediScore: 55.8, teacherRatio: 12.86, facilityAge: 27.3, programCount: 6.4, budgetPerStudent: 125, specialClassRate: 86.4, cluster: 'B', lat: 35.8714, lng: 128.6014 },
  { id: '50', name: '제주특별자치도', shortName: '제주', ediScore: 50.7, teacherRatio: 11.93, facilityAge: 30.5, programCount: 6.1, budgetPerStudent: 128, specialClassRate: 84.8, cluster: 'C', lat: 33.4890, lng: 126.4983 },
  { id: '41', name: '경기도',         shortName: '경기', ediScore: 49.5, teacherRatio: 13.72, facilityAge: 20.3, programCount: 7.8, budgetPerStudent: 134, specialClassRate: 88.8, cluster: 'B', lat: 37.4138, lng: 127.5183 },
  { id: '29', name: '광주광역시',     shortName: '광주', ediScore: 49.3, teacherRatio: 13.04, facilityAge: 23.7, programCount: 7.1, budgetPerStudent: 129, specialClassRate: 90.2, cluster: 'B', lat: 35.1595, lng: 126.8526 },
  { id: '31', name: '울산광역시',     shortName: '울산', ediScore: 41.8, teacherRatio: 12.62, facilityAge: 25.8, programCount: 7.0, budgetPerStudent: 142, specialClassRate: 91.2, cluster: 'B', lat: 35.5384, lng: 129.3114 },
  { id: '30', name: '대전광역시',     shortName: '대전', ediScore: 37.1, teacherRatio: 12.33, facilityAge: 20.3, programCount: 7.5, budgetPerStudent: 136, specialClassRate: 91.6, cluster: 'B', lat: 36.3504, lng: 127.3845 },
  { id: '11', name: '서울특별시',     shortName: '서울', ediScore: 27.0, teacherRatio: 12.25, facilityAge: 17.8, programCount: 8.3, budgetPerStudent: 147, specialClassRate: 93.6, cluster: 'A', lat: 37.5665, lng: 126.9780 },
  { id: '36', name: '세종특별자치시', shortName: '세종', ediScore:  1.8, teacherRatio: 10.83, facilityAge:  8.3, programCount: 8.7, budgetPerStudent: 164, specialClassRate: 96.3, cluster: 'A', lat: 36.4801, lng: 127.2890 },
]

export const CLUSTER_INFO = {
  A: { label: 'A형 — 교육 강세', color: '#10b981', bg: '#052e16', desc: '전 지표 상위권, 교원·시설·예산 충분' },
  B: { label: 'B형 — 중간 혼재', color: '#3b82f6', bg: '#0c1a2e', desc: '일부 지표 우수, 일부 취약 혼재' },
  C: { label: 'C형 — 구조적 취약', color: '#f59e0b', bg: '#2d1a00', desc: '교원·시설·재정 복합 취약' },
  D: { label: 'D형 — 매우 취약', color: '#ef4444', bg: '#2d0a0a', desc: '전 지표 하위권, 농산어촌 다수' },
}

export function getEdiColor(score: number): string {
  if (score < 30) return '#10b981'
  if (score < 45) return '#3b82f6'
  if (score < 60) return '#f59e0b'
  return '#ef4444'
}

export function getEdiLabel(score: number): string {
  if (score < 30) return '양호'
  if (score < 45) return '보통'
  if (score < 60) return '취약'
  return '매우취약'
}
