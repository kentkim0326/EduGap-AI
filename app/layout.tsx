import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduGap AI — 교육 격차 분석 플랫폼',
  description: '교육 공공데이터 기반 지역별 교육 격차 진단 및 AI 자원 배분 제안',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
