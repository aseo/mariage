// Gemini API configuration - Model fallback system
const MODELS = [
  'gemini-2.5-flash-lite',  // Primary: Fastest, best rate limits
  'gemini-2.0-flash-lite',  // Fallback 1: Very fast, most stable
  'gemini-2.5-flash',       // Fallback 2: Good performance
  'gemini-2.0-flash'        // Fallback 3: Reliable alternative
];

const API_KEY = process.env.GOOGLE_AI_API_KEY!;

// Simple in-memory cache for API responses
const cache = new Map<string, { data: DrinkRecommendation[]; timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Debug: Check if API key is loaded
if (!API_KEY) {
  console.error('GOOGLE_AI_API_KEY is not set in environment variables');
}

function getCacheKey(item: string): string {
  return `drink:${item.toLowerCase().trim()}`;
}

function getFromCache(key: string): DrinkRecommendation[] | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  // Check if cache is still valid
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCache(key: string, data: DrinkRecommendation[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function tryModel(modelName: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  return { response, modelName };
}

export interface DrinkRecommendation {
  rank: number;
  category: string;
  name: string;
  grade: string;
  emoji: string;
  explanation: string;
  imagePlaceholder: string;
}



export async function getDrinkRecommendations(foodItem: string): Promise<DrinkRecommendation[]> {
  const startTime = Date.now();
  console.log(`🚀 Starting API call for: ${foodItem}`);
  
  // Check cache first
  const cacheKey = getCacheKey(foodItem);
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult) {
    console.log(`✅ Cache hit for: ${foodItem} (${Date.now() - startTime}ms)`);
    return cachedResult;
  }
  
  console.log(`❌ Cache miss for: ${foodItem}, calling API...`);

  const prompt = `당신은 한국인을 위한 요리에 어울리는 술 페어링 전문가입니다. 

**중요: 먼저 입력된 항목이 음식인지 확인해주세요.**

입력된 항목: ${foodItem}

**음식 검증 규칙:**
1. 입력된 항목이 음식, 요리, 식재료가 맞는지 확인하세요
2. 컴퓨터, 사랑, 책, 자동차 등 음식이 아닌 항목이 입력되면 에러를 반환하세요
3. 오타나 비슷한 음식명은 허용하세요 (예: "삼겸살" → "삼겹살", "치키" → "치킨")
4. 일반적인 음식명이 아니지만 음식인 경우는 허용하세요

**음식이 아닌 경우 에러 응답:**
{
  "error": true,
  "message": "입력하신 '${foodItem}'은(는) 음식이 아닙니다. 음식 이름을 입력해주세요. (예: 삼겹살, 치킨, 회, 김치찌개 등)"
}

**음식인 경우 정상 응답:**
사용자가 고른 음식에 대해 아래 조건을 지켜서 술 3가지를 추천해주세요.

조건:

1. 모든 대답은 **한국어**로 작성해주세요.
2. 아래의 **술 목록을 최우선 기준으로 참고**하여 추천해주세요.  
   - 반드시 목록 내에서만 선택할 필요는 없지만, **가능한 한 목록 안에서 추천**해주세요.  
   - 특정 아이템(“소주”, “IPA”, “라거”)만 반복 선정하지 마세요.
3. 추천하는 술 5가지 중 랜덤한 3가지를 아래 항목을 포함한 JSON 객체 형태로 작성하고, "pairings"라는 배열에 넣어주세요.
4. 3가지는 등급 순서로 나열해주세요.
5. 등급은 A+, A, A-, B+, B 중에서 하나를 선택해주세요.
6  **동급 점수(맛의 궁합이 비슷)일 때 ‘와인’ 또는 ‘위스키’를 우선 선택**하세요. 단, 등급을 과장하면 안됩니다.
7. 최대한 다양한 카테고리의 술을 제안해주세요.
8. 각 술의 설명은 **2~3문장**으로, **맛의 조화나 느낌**을 중심으로 **친근하고 재밌는 톤**으로 적어주세요.
   - 예: "매콤한 돼지갈비라면, 홉의 쌉쌀함이 기름기를 잡아주고 괜찮은 조합이 될 수 있어요."
9. 최종 결과는 **JSON만 출력**해주세요.

출력 형식 예시 (구조만 참고하세요)
{
  "rank": 1,
  "category": "맥주",
  "name": "IPA",
  "grade": "A+",
  "emoji": "🍺",
  "explanation": "돼지갈비의 단짠 양념이 IPA의 홉 쌉싸름함과 잘 어울려요. 탄산감이 기름기를 정리해줘서 깔끔하게 즐길 수 있어요.",
  "imagePlaceholder": "🍺"
}

참고 술 목록 (카테고리 | 이름):

레드 와인 | 피노 누아
레드 와인 | 쉬라즈
레드 와인 | 카베르네 소비뇽
레드 와인 | 메를로
레드 와인 | 진판델
레드 와인 | 말벡
화이트 와인 | 소비뇽 블랑
화이트 와인 | 샤르도네
화이트 와인 | 리슬링
화이트 와인 | 피노 그리
로제 와인 | 드라이 로제
로제 와인 | 스파클링 로제
스파클링 와인 | 프로세코
스파클링 와인 | 샴페인
스파클링 와인 | 까바
스파클링 와인 | 모스카토 다스티
막걸리 | 탄산감 있는 막걸리
막걸리 | 전통 생막걸리
막걸리 | 달콤한 막걸리
소주 | 소주
소주 | 과일 소주
소주 | 증류식 소주
맥주 | IPA
맥주 | 라거
맥주 | 필스너
맥주 | 스타우트
맥주 | 페일 에일
맥주 | 바이젠 (밀맥주)
맥주 | 흑맥주
사케 | 달콤한 사케
사케 | 드라이한 사케
사케 | 감칠맛 사케
위스키 | 버번 위스키
위스키 | 쉐리 위스키
위스키 | 피트 위스키
기타 | 하이볼
기타 | 고량주
기타 | 매실주


**이제 JSON으로만 응답해주세요. 추가 설명 없이 JSON만 출력해주세요.**`;

  // Try each model in order until one works
  for (const modelName of MODELS) {
    const modelStartTime = Date.now();
    try {
      console.log(`🔄 Trying model: ${modelName}...`);
      const { response } = await tryModel(modelName, prompt);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Model ${modelName} failed (${Date.now() - modelStartTime}ms):`, errorData);
        
        // If it's a rate limit error, try the next model
        if (response.status === 429) {
          console.log(`⚠️ Rate limited on ${modelName} (${Date.now() - modelStartTime}ms), trying next model...`);
          continue;
        }
        
        // For other errors, throw immediately
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        // Check if it's an error response
        const errorMatch = text.match(/\{[^}]*"error"[^}]*\}/);
        if (errorMatch) {
          const errorData = JSON.parse(errorMatch[0]);
          if (errorData.error) {
            throw new Error(errorData.message);
          }
        }
        throw new Error('Invalid response format');
      }
      
      const recommendations = JSON.parse(jsonMatch[0]);
      const modelTime = Date.now() - modelStartTime;
      const totalTime = Date.now() - startTime;
      console.log(`✅ Successfully used model: ${modelName} (${modelTime}ms, total: ${totalTime}ms)`);
      
      // Cache the successful result
      setCache(cacheKey, recommendations);
      return recommendations;
    } catch (error) {
      const modelTime = Date.now() - modelStartTime;
      console.error(`❌ Error with model ${modelName} (${modelTime}ms):`, error);
      
      // If it's a food validation error, throw immediately (don't retry)
      if (error instanceof Error && error.message.includes('음식이 아닙니다')) {
        throw error;
      }
      
      // If it's a rate limit error, try the next model
      if (error instanceof Error && error.message.includes('429')) {
        console.log(`⚠️ Rate limited on ${modelName} (${modelTime}ms), trying next model...`);
        if (modelName === MODELS[MODELS.length - 1]) {
          throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        continue;
      }
      
      // If this is the last model, throw the error
      if (modelName === MODELS[MODELS.length - 1]) {
        throw error;
      }
      
      // For other errors, continue to the next model
      continue;
    }
  }

  // If all models fail, throw error to show retry UI
  console.error('All models failed');
  throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
}

 