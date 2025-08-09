// Gemini API configuration - Model fallback system
const MODELS = [
  'gemini-2.5-flash-lite',  // Primary: Fastest, best rate limits
  'gemini-2.0-flash-lite',  // Fallback 1: Very fast, most stable
  'gemini-2.5-flash',       // Fallback 2: Good performance
  'gemini-2.0-flash'        // Fallback 3: Reliable alternative
];

const API_KEY = process.env.GOOGLE_AI_API_KEY!;

// Simple in-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

if (!API_KEY) {
  console.error('GOOGLE_AI_API_KEY is not set in environment variables');
}

function getCacheKey(item: string): string {
  return item.toLowerCase().trim();
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
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
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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

export interface FoodRecommendation {
  rank: number;
  category: string;
  name: string;
  grade: string;
  emoji: string;
  explanation: string;
  imagePlaceholder: string;
}

export async function getDrinkRecommendations(foodItem: string): Promise<DrinkRecommendation[]> {
  const cacheKey = `drink:${foodItem.toLowerCase().trim()}`;
  const cached = getFromCache<DrinkRecommendation[]>(cacheKey);
  if (cached) return cached;

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
   - 예: "매콤한 돼지갈비라면, 홉의 쌉쌀함이 기름기를 잡아주고 괜찮은 조합이 될 수 있어요." (이건 예시일 뿐 내용은 절대 참고하지 마세요)
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

  for (const modelName of MODELS) {
    try {
      const { response } = await tryModel(modelName, prompt);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) continue;
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text as string;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid response format');
      const recommendations = JSON.parse(jsonMatch[0]) as DrinkRecommendation[];
      setCache(cacheKey, recommendations);
      return recommendations;
    } catch (err) {
      if (modelName === MODELS[MODELS.length - 1]) throw err;
      continue;
    }
  }
  throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
}

export async function getFoodRecommendations(drinkItem: string): Promise<FoodRecommendation[]> {
  const cacheKey = `food-for-drink:${drinkItem.toLowerCase().trim()}`;
  const cached = getFromCache<FoodRecommendation[]>(cacheKey);
  if (cached) return cached;

  const prompt = `당신은 한국인의 입맛과 문화를 잘 이해하는 '술 페어링 전문가'입니다.  
사용자가 입력한 술(예: IPA, 피노 누아, 버번 위스키 등)에 어울리는 **한국 요리 3가지**를 추천해주세요.

**중요: 먼저 입력값이 술인지 확인하세요.**

입력된 항목: ${drinkItem}

1. 맥주, 와인, 위스키, 소주, 막걸리, 사케, 전통주 등 알코올 음료만 허용
2. 음식, 물, 주스, 커피, 차 등은 에러 반환
3. 오타나 비슷한 표기는 허용 (예: '쉐리' → '셰리', '피노 누와' → '피노 누아')

술이 아닌 경우 에러 응답 예시:
{ "error": true, "message": "입력하신 '${drinkItem}'은(는) 술이 아닙니다. 술 또는 음료 이름을 입력해주세요." }

**추천 조건**
1. 모든 결과는 한국어로 작성
2. 다양한 종류의 요리를 추천 (비슷한 카테고리 반복 금지). 메인 요리 위주로 추천 (사이드, 반찬 제외))
3. 한식, 양식, 일식, 중식, 동남아 등 한국인이 즐겨 먹는 다양한 요리들 위주로 추천.
4. 추천하는 음식 5가지 중 랜덤한 3가지를 선택. 등급 높은 순으로 나열.
5. 3가지 모두가 한 나라의 음식이 안되게끔 다양성 추구
6. 등급은 A+, A, A-, B+, B 중 하나 선택
7. **동급 점수(궁합이 비슷)일 때는 의외로 잘 어울리는 음식**을 우선 선택하세요.
8. 사용자가 포괄적인 와인, 레드 와인, 화이트 와인을 입력했다면, 추천 음식은 와인 품종(예: 카베르네 소비뇽, 피노 누아, 샤르도네, 소비뇽블랑 등)을 기반으로 페어링 및 코멘트 작성 해주세요.
9. 사용자가 포괄적인 위스키를 입력했다면, 추천 음식은 위스키 스타일 (예: 피트, 셰리, 버번 등)을 기반으로 페어링 및 코멘트 작성 해주세요.
10. 사용자가 포괄적인 맥주를 입력했다면, 추천 음식은 맥주 스타일 (예: IPA, 라거, 페일에일, 스타우트 등)을 기반으로 페어링 및 코멘트 작성 해주세요.
11. 각 음식의 설명은 **2~3문장**으로, **선택된 세부 술 종류와 음식의 맛 조화**를 중심으로 **친근하고 재밌는 톤**으로 적어주세요.
   - 예: "IPA의 홉 향과 쌉싸름함이 치즈 떡볶이의 매콤함을 중화시키면서 깔끔하게 마무리돼요." (이건 예시일 뿐 내용은 절대 참고하지 마세요)
12. 최종 결과는 **JSON만 출력**해주세요.

**출력 예시** (이건 예시일 뿐 내용은 절대 참고하지 마세요)
{
  "rank": 1,
  "category": "구이",
  "name": "불고기",
  "grade": "A+",
  "emoji": "🥩",
  "explanation": "피노 누아의 산도와 붉은 과실 향이 불고기의 달콤짭짤한 맛을 산뜻하게 받쳐줘요. 가벼운 탄닌이라 고기의 육즙을 해치지 않고 더 부드럽게 느껴집니다.",
  "imagePlaceholder": "🥩"
}
**이제 JSON 배열 'pairings'만 출력하세요.**`;

  for (const modelName of MODELS) {
    try {
      const { response } = await tryModel(modelName, prompt);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) continue;
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text as string;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid response format');
      const recommendations = JSON.parse(jsonMatch[0]) as FoodRecommendation[];
      setCache(cacheKey, recommendations);
      return recommendations;
    } catch (err) {
      if (modelName === MODELS[MODELS.length - 1]) throw err;
      continue;
    }
  }
  throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
}

