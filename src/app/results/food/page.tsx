"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

import { useEffect, useState, useRef } from "react"
import { DrinkRecommendation } from "@/lib/gemini"

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export default function FoodResultsPage() {
  const [foodItem, setFoodItem] = useState('Your Food')
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<DrinkRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingEmojiIndex, setLoadingEmojiIndex] = useState(0)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  const hasFetched = useRef(false)

  const drinkEmojis = ['🍺', '🍷', '🍶', '🥃', '🍾', '🍹']

  // Rotate emojis during loading
  useEffect(() => {
    if (isLoading || loadingStartTime) {
      // Start rotation immediately
      const interval = setInterval(() => {
        setLoadingEmojiIndex((prev) => (prev + 1) % drinkEmojis.length)
      }, 300) // Faster rotation for more engaging animation

      // Clear interval when loading stops
      return () => clearInterval(interval)
    } else {
      // Reset emoji index when not loading
      setLoadingEmojiIndex(0)
    }
  }, [isLoading, loadingStartTime, drinkEmojis.length])

  // Reset emoji index when loading starts
  useEffect(() => {
    if (isLoading || loadingStartTime) {
      setLoadingEmojiIndex(0)
    }
  }, [isLoading, loadingStartTime])

  // Ensure minimum loading time for better UX
  useEffect(() => {
    if (isLoading && !loadingStartTime) {
      setLoadingStartTime(Date.now())
    }
    
    if (!isLoading && loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime
      const minLoadingTime = 800 // 0.6 seconds for cached results
      
      if (elapsed < minLoadingTime) {
        const remaining = minLoadingTime - elapsed
        setTimeout(() => {
          setLoadingStartTime(null)
        }, remaining)
      } else {
        setLoadingStartTime(null)
      }
    }
  }, [isLoading, loadingStartTime])

  const handleTryAnotherFood = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'try_another_food', {
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
        window.gtag('event', 'share_results', {
          event_category: 'engagement',
          food_item: foodItem,
          value: 1
        })
      }
      
      // Show temporary success feedback
      const button = document.getElementById('share-results-button')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          URL 복사 완료
        `
        // Keep the primary color styling
        button.className = button.className.replace('text-primary/80', 'text-primary').replace('border-primary/80', 'border-primary')
        setTimeout(() => {
          button.innerHTML = originalHTML
          // Restore original styling
          button.className = button.className.replace('text-primary', 'text-primary/80').replace('border-primary', 'border-primary/80')
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }



  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Get search params on client side only
        const urlParams = new URLSearchParams(window.location.search)
        const food = urlParams.get('food') || 'Your Food'
        setFoodItem(food)
        
        // Fetch recommendations from Gemini API
        const response = await fetch(`/api/recommendations/drinks?food=${encodeURIComponent(food)}`, {
          cache: 'default', // Use browser cache for better UX
          headers: {
            'Cache-Control': 'max-age=3600' // 1 hour browser cache
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.error && errorData.error.includes('음식이 아닙니다')) {
            throw new Error(errorData.error)
          }
          throw new Error('Failed to fetch recommendations')
        }
        
        const data = await response.json()
        
        // Check if data is an array and if the first item has an error
        if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === 'object' && 'error' in data[0]) {
          // This is an error response from Gemini - redirect to food page with error
          const errorMessage = data[0].message || '입력하신 값은 음식이 아닙니다.'
          window.location.href = `/food?error=invalid_food&message=${encodeURIComponent(errorMessage)}`
          return
        }
        
        // Data is a valid recommendations array
        setRecommendations(data)
        
        // Track successful results view
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'view_results', {
            event_category: 'results',
            food_item: food,
            result_count: data.length,
            value: 1
          })
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        if (err instanceof Error && err.message.includes('음식이 아닙니다')) {
          setError(err.message)
        } else {
          setError('Failed to load recommendations. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Prevent duplicate API calls
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchRecommendations()
    }
  }, [])

  if (isLoading || loadingStartTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 transition-opacity duration-300 ease-in-out">
            {drinkEmojis[loadingEmojiIndex]}
          </div>
          <div className="text-xl text-slate-600">천상의 궁합 찾는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    const isFoodValidationError = error.includes('음식이 아닙니다')
    
    // Redirect to food page with error parameter for food validation errors
    if (isFoodValidationError) {
      window.location.href = '/food?error=invalid_food'
      return null
    }
    
    // For other errors, show the error page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Link href="/food" className="inline-block mb-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                ← Back to Food Selection
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              😔 죄송합니다
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              AI 추천 시스템에 일시적으로 연결할 수 없습니다.<br />
              잠시 후 다시 시도해주세요.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md mx-auto px-4 py-5">
        {/* Header */}
        <div className="text-center mb-8 pt-8 sm:pt-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {foodItem}에는 이거지🧡
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            한 입 먹고 한 잔 딱!
          </p>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {recommendations.map((drink, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 gap-3 py-5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl sm:text-5xl">
                      {drink.rank === 1 ? "🥇" : drink.rank === 2 ? "🥈" : "🥉"}
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-slate-800">
                        {drink.name}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-slate-600">
                        {drink.category}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl sm:text-2xl font-bold ${
                      drink.grade === 'A+' ? 'text-emerald-500' :
                      drink.grade === 'A' || drink.grade === 'A-' ? 'text-blue-500' :
                      'text-sky-500'
                    }`}>
                      {drink.grade}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 items-start">
                  {/* Image Placeholder */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                      {drink.imagePlaceholder || drink.emoji || "🍷"}
                    </div>
                  </div>
                  
                  {/* Explanation */}
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {drink.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-3">
          <div>
            <button 
              id="share-results-button"
              onClick={handleShareClick}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 border border-primary hover:border-primary/80 px-4 py-2 rounded-lg transition-all duration-200 text-base font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              결과 공유하기
            </button>
          </div>
          
          <Link href="/food">
            <Button 
              variant="ghost"
              onClick={handleTryAnotherFood}
              className="text-slate-700 hover:text-slate-900 text-base font-medium"
            >
              ← 다른 음식 알아보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Force cache for URL consistency - same URL = same results
export const dynamic = 'force-static'