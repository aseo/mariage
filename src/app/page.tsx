"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export default function Home() {
  const handleStartClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'start_button',
        value: 1
      })
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-16">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image 
              src="/food-drink-pairing.png" 
              alt="Beer mug and pizza slice dancing together - perfect food and drink pairing"
              width={400}
              height={300}
              priority
              className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            내 안주의 짝꿍 찾기 🤓
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            AI가 추천해주는 완벽한 조합
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-md mx-auto">
          <Link href="/food" className="w-full">
            <Button 
              size="lg" 
              onClick={handleStartClick}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-lg sm:text-xl h-auto min-h-[60px] sm:min-h-[70px] font-medium w-full rounded-xl"
            >
              시작하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
