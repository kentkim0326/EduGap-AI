// 교육 격차 지수(EDI) 계산 및 지역 데이터 타입 정의

export interface RegionData {
  id: string
  name: string
  shortName: string
  ediScore: number        // 0~100, 높을수록 취약
  teacherRatio: number    // 교원 1인당 학생 수
  facilityAge: number     // 노후 시설 비율 (%)
  programCount: number    // 학교당 방과후 프로그램 수
  budgetPerStudent: number // 학생 1인당 예산 (만원)
  specialClassRate: number // 특수학급 충족률 (%)
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

// 시도별 정적 기준 데이터 (학교알리미 + KESS 기반 추정치)
// 실제 서비스에서는 API/CSV로 대체
export const REGION_DATA: RegionData[] = [
  { id: '11', name: '서울특별시',     shortName: '서울',  ediScore: 22, teacherRatio: 12.1, facilityAge: 18, programCount: 8.2, budgetPerStudent: 142, specialClassRate: 94, cluster: 'A', lat: 37.5665, lng: 126.9780 },
  { id: '26', name: '부산광역시',     shortName: '부산',  ediScore: 38, teacherRatio: 13.4, facilityAge: 31, programCount: 6.1, budgetPerStudent: 128, specialClassRate: 88, cluster: 'B', lat: 35.1796, lng: 129.0756 },
  { id: '27', name: '대구광역시',     shortName: '대구',  ediScore: 35, teacherRatio: 13.0, facilityAge: 28, programCount: 6.4, budgetPerStudent: 131, specialClassRate: 89, cluster: 'B', lat: 35.8714, lng: 128.6014 },
  { id: '28', name: '인천광역시',     shortName: '인천',  ediScore: 33, teacherRatio: 13.8, facilityAge: 26, programCount: 6.8, budgetPerStudent: 127, specialClassRate: 87, cluster: 'B', lat: 37.4563, lng: 126.7052 },
  { id: '29', name: '광주광역시',     shortName: '광주',  ediScore: 31, teacherRatio: 12.6, facilityAge: 24, programCount: 7.1, budgetPerStudent: 133, specialClassRate: 91, cluster: 'B', lat: 35.1595, lng: 126.8526 },
  { id: '30', name: '대전광역시',     shortName: '대전',  ediScore: 28, teacherRatio: 12.3, facilityAge: 22, programCount: 7.4, budgetPerStudent: 138, specialClassRate: 92, cluster: 'A', lat: 36.3504, lng: 127.3845 },
  { id: '31', name: '울산광역시',     shortName: '울산',  ediScore: 30, teacherRatio: 12.8, facilityAge: 23, programCount: 7.0, budgetPerStudent: 145, specialClassRate: 90, cluster: 'A', lat: 35.5384, lng: 129.3114 },
  { id: '36', name: '세종특별자치시', shortName: '세종',  ediScore: 20, teacherRatio: 11.2, facilityAge: 8,  programCount: 9.1, budgetPerStudent: 168, specialClassRate: 96, cluster: 'A', lat: 36.4801, lng: 127.2890 },
  { id: '41', name: '경기도',         shortName: '경기',  ediScore: 25, teacherRatio: 13.5, facilityAge: 20, programCount: 7.8, budgetPerStudent: 135, specialClassRate: 91, cluster: 'A', lat: 37.4138, lng: 127.5183 },
  { id: '42', name: '강원특별자치도', shortName: '강원',  ediScore: 58, teacherRatio: 11.4, facilityAge: 42, programCount: 4.2, budgetPerStudent: 118, specialClassRate: 78, cluster: 'C', lat: 37.8228, lng: 128.1555 },
  { id: '43', name: '충청북도',       shortName: '충북',  ediScore: 55, teacherRatio: 11.8, facilityAge: 38, programCount: 4.6, budgetPerStudent: 120, specialClassRate: 80, cluster: 'C', lat: 36.8002, lng: 127.7004 },
  { id: '44', name: '충청남도',       shortName: '충남',  ediScore: 52, teacherRatio: 11.6, facilityAge: 36, programCount: 4.9, budgetPerStudent: 122, specialClassRate: 81, cluster: 'C', lat: 36.5184, lng: 126.8000 },
  { id: '45', name: '전라북도',       shortName: '전북',  ediScore: 63, teacherRatio: 10.8, facilityAge: 46, programCount: 3.8, budgetPerStudent: 115, specialClassRate: 74, cluster: 'C', lat: 35.7175, lng: 127.1530 },
  { id: '46', name: '전라남도',       shortName: '전남',  ediScore: 68, teacherRatio: 10.2, facilityAge: 52, programCount: 3.2, budgetPerStudent: 112, specialClassRate: 71, cluster: 'C', lat: 34.8679, lng: 126.9910 },
  { id: '47', name: '경상북도',       shortName: '경북',  ediScore: 61, teacherRatio: 10.9, facilityAge: 48, programCount: 3.6, budgetPerStudent: 116, specialClassRate: 75, cluster: 'C', lat: 36.4919, lng: 128.8889 },
  { id: '48', name: '경상남도',       shortName: '경남',  ediScore: 48, teacherRatio: 11.5, facilityAge: 34, programCount: 5.2, budgetPerStudent: 123, specialClassRate: 83, cluster: 'D', lat: 35.4606, lng: 128.2132 },
  { id: '50', name: '제주특별자치도', shortName: '제주',  ediScore: 42, teacherRatio: 12.0, facilityAge: 30, programCount: 5.8, budgetPerStudent: 130, specialClassRate: 86, cluster: 'D', lat: 33.4890, lng: 126.4983 },
]

export const CLUSTER_INFO = {
  A: { label: 'A형 — 교육 강세', color: '#10b981', bg: '#052e16', desc: '전 지표 상위권, 교원·시설·예산 충분' },
  B: { label: 'B형 — 중간 혼재', color: '#3b82f6', bg: '#0c1a2e', desc: '일부 지표 우수, 일부 취약 혼재' },
  C: { label: 'C형 — 구조적 취약', color: '#ef4444', bg: '#2d0a0a', desc: '교원·시설·재정 모두 하위권' },
  D: { label: 'D형 — 재정 취약', color: '#f59e0b', bg: '#2d1a00', desc: '예산 부족, 인구감소 지자체 다수' },
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
