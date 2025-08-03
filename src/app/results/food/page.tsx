"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

import { useEffect, useState, useRef } from "react"
import { DrinkRecommendation } from "@/lib/gemini"

export default function FoodResultsPage() {
  const [foodItem, setFoodItem] = useState('Your Food')
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<DrinkRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

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
          throw new Error('Failed to fetch recommendations')
        }
        
        const data = await response.json()
        setRecommendations(data.recommendations)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to load recommendations. Please try again.')
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
          <Link href="/food" className="inline-block mb-4">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              ← Back to Food Selection
            </Button>
          </Link>
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
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/food">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 px-4 py-2 text-sm font-medium">
                ← 다른 음식 알아보기
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Start Over
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 