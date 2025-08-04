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
  const hasFetched = useRef(false)

  const handleTryAnotherFood = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'try_another_food', {
        event_category: 'engagement',
        value: 1
      })
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
        const response = await fetch(`/api/recommendations/drinks?food=${encodeURIComponent(food)}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.error && errorData.error.includes('음식이 아닙니다')) {
            throw new Error(errorData.error)
          }
          throw new Error('Failed to fetch recommendations')
        }
        
        const data = await response.json()
        setRecommendations(data.recommendations)
        
        // Track successful results view
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'view_results', {
            event_category: 'results',
            food_item: food,
            result_count: data.recommendations.length,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            {foodItem}에는 이거지🧡
          </h1>
          <p className="text-lg text-slate-600">
            한 입 먹고 한 잔 딱!
          </p>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {recommendations.map((drink, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl sm:text-5xl">
                      {drink.rank === 1 ? "🥇" : drink.rank === 2 ? "🥈" : "🥉"}
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl text-slate-800">
                        {drink.name}
                      </CardTitle>
                      <CardDescription className="text-base text-slate-600">
                        {drink.category}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl sm:text-3xl font-bold ${
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
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                      {drink.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <Link href="/food">
            <Button 
              variant="ghost" 
              onClick={handleTryAnotherFood}
              className="text-slate-600 hover:text-slate-800 px-4 py-2 text-sm font-medium"
            >
              ← 다른 음식 알아보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 