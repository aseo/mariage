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
      window.gtag('event', 'start_journey', {
        event_category: 'engagement',
        value: 1
      })
    }
  }

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      
      // Track share event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'share_url', {
          event_category: 'engagement',
          value: 1
        })
      }
      
      // Show temporary success feedback
      const button = document.getElementById('share-button')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          URL 복사 완료
        `
        button.classList.add('text-primary')
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove('text-primary')
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-0">
      <div className="w-full max-w-md mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 pt-4">
            <Image 
              src="/food-drink-pairing.png" 
              alt="Beer mug and pizza slice dancing together - perfect food and drink pairing"
              width={400}
              height={300}
              priority
              className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            내 안주의 짝꿍 찾기 🤓
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            AI가 추천해주는 완벽한 조합
          </p>
        </div>

        {/* CTA */}
        <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center space-y-3">
          <Link href="/food">
            <Button 
              size="lg" 
              onClick={handleStartClick}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-lg sm:text-lg h-auto min-h-[56px] sm:min-h-[60px] font-medium w-80 rounded-xl"
            >
              <span className="text-2xl">🥂</span>술 추천받기
            </Button>
          </Link>

          <Link href="/drink">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-lg sm:text-lg h-auto min-h-[56px] sm:min-h-[60px] font-medium w-80 rounded-xl"
            >
              <span className="text-2xl">🍲</span>안주 추천받기
            </Button>
          </Link>
          
          <div className="text-center">
            <button 
              id="share-button"
              onClick={handleShareClick}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              공유하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
