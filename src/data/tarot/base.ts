export interface TarotBase {
    id: number;
    name: string;
    nameKr: string;
    keywords: string[];
    score: number;
    warningScore: number;
}

export const TAROT_BASE: Record<number, TarotBase> = {
    "0": {
        "id": 0,
        "name": "The Fool",
        "nameKr": "광대",
        "keywords": [
            "시작",
            "무경계",
            "변수"
        ],
        "score": 85.4,
        "warningScore": 32.1
    },
    "1": {
        "id": 1,
        "name": "The Magician",
        "nameKr": "마법사",
        "keywords": [
            "구현",
            "기술",
            "주도권"
        ],
        "score": 92.5,
        "warningScore": 45.3
    },
    "2": {
        "id": 2,
        "name": "The High Priestess",
        "nameKr": "고위 여사제",
        "keywords": [
            "통찰",
            "비밀",
            "침묵"
        ],
        "score": 88,
        "warningScore": 50.1
    },
    "3": {
        "id": 3,
        "name": "The Empress",
        "nameKr": "여황제",
        "keywords": [
            "풍요",
            "결실",
            "포용"
        ],
        "score": 95.5,
        "warningScore": 40.5
    },
    "4": {
        "id": 4,
        "name": "The Emperor",
        "nameKr": "황제",
        "keywords": [
            "질서",
            "책임",
            "권위"
        ],
        "score": 90.2,
        "warningScore": 55.4
    },
    "5": {
        "id": 5,
        "name": "The Hierophant",
        "nameKr": "교황",
        "keywords": [
            "전통",
            "가이드",
            "믿음"
        ],
        "score": 82,
        "warningScore": 48.2
    },
    "6": {
        "id": 6,
        "name": "The Lovers",
        "nameKr": "연인",
        "keywords": [
            "선택",
            "조화",
            "결합"
        ],
        "score": 94.6,
        "warningScore": 35.8
    },
    "7": {
        "id": 7,
        "name": "The Chariot",
        "nameKr": "전차",
        "keywords": [
            "승리",
            "의지",
            "추진력"
        ],
        "score": 89.1,
        "warningScore": 41.2
    },
    "8": {
        "id": 8,
        "name": "Strength",
        "nameKr": "힘",
        "keywords": [
            "인내",
            "용기",
            "부드러움"
        ],
        "score": 87.3,
        "warningScore": 52
    },
    "9": {
        "id": 9,
        "name": "The Hermit",
        "nameKr": "은둔자",
        "keywords": [
            "성찰",
            "고독",
            "진리"
        ],
        "score": 75.5,
        "warningScore": 30.4
    },
    "10": {
        "id": 10,
        "name": "Wheel of Fortune",
        "nameKr": "운명의 수레바퀴",
        "keywords": [
            "변화",
            "순환",
            "전환점"
        ],
        "score": 80,
        "warningScore": 45
    },
    "11": {
        "id": 11,
        "name": "Justice",
        "nameKr": "정의",
        "keywords": [
            "균형",
            "공정",
            "결단"
        ],
        "score": 81.2,
        "warningScore": 60.5
    },
    "12": {
        "id": 12,
        "name": "The Hanged Man",
        "nameKr": "매달린 사람",
        "keywords": [
            "인내",
            "정체",
            "관점 전환"
        ],
        "score": 45.3,
        "warningScore": 65.2
    },
    "13": {
        "id": 13,
        "name": "Death",
        "nameKr": "죽음",
        "keywords": [
            "종결",
            "변화",
            "새로운 시작"
        ],
        "score": 20.5,
        "warningScore": 68
    },
    "14": {
        "id": 14,
        "name": "Temperance",
        "nameKr": "절제",
        "keywords": [
            "조화",
            "균형",
            "중용"
        ],
        "score": 88.5,
        "warningScore": 42.1
    },
    "15": {
        "id": 15,
        "name": "The Devil",
        "nameKr": "악마",
        "keywords": [
            "유혹",
            "집착",
            "속박"
        ],
        "score": 18.9,
        "warningScore": 62.1
    },
    "16": {
        "id": 16,
        "name": "The Tower",
        "nameKr": "탑",
        "keywords": [
            "격변",
            "해방",
            "충격"
        ],
        "score": 15.5,
        "warningScore": 35
    },
    "17": {
        "id": 17,
        "name": "The Star",
        "nameKr": "별",
        "keywords": [
            "희망",
            "치유",
            "영감"
        ],
        "score": 96.4,
        "warningScore": 25.5
    },
    "18": {
        "id": 18,
        "name": "The Moon",
        "nameKr": "달",
        "keywords": [
            "불안",
            "혼돈",
            "잠재의식"
        ],
        "score": 35,
        "warningScore": 75.2
    },
    "19": {
        "id": 19,
        "name": "The Sun",
        "nameKr": "태양",
        "keywords": [
            "성공",
            "활력",
            "명료함"
        ],
        "score": 98.2,
        "warningScore": 30.1
    },
    "20": {
        "id": 20,
        "name": "Judgement",
        "nameKr": "심판",
        "keywords": [
            "부활",
            "결단",
            "보상"
        ],
        "score": 85,
        "warningScore": 40.2
    },
    "21": {
        "id": 21,
        "name": "The World",
        "nameKr": "세계",
        "keywords": [
            "완성",
            "통합",
            "새로운 여정"
        ],
        "score": 99.5,
        "warningScore": 50
    },
    "22": {
        "id": 22,
        "name": "Ace of Wands",
        "nameKr": "완드 에이스",
        "keywords": [
            "시작",
            "착수",
            "영감"
        ],
        "score": 85,
        "warningScore": 37
    },
    "23": {
        "id": 23,
        "name": "Two of Wands",
        "nameKr": "완드 2번",
        "keywords": [
            "계획",
            "전망",
            "선택"
        ],
        "score": 71.5,
        "warningScore": 39
    },
    "24": {
        "id": 24,
        "name": "Three of Wands",
        "nameKr": "완드 3번",
        "keywords": [
            "확장",
            "전진",
            "기다림"
        ],
        "score": 73,
        "warningScore": 41
    },
    "25": {
        "id": 25,
        "name": "Four of Wands",
        "nameKr": "완드 4번",
        "keywords": [
            "안정",
            "화합",
            "축제"
        ],
        "score": 67,
        "warningScore": 43
    },
    "26": {
        "id": 26,
        "name": "Five of Wands",
        "nameKr": "완드 5번",
        "keywords": [
            "경쟁",
            "충돌",
            "성장통"
        ],
        "score": 48.5,
        "warningScore": 45
    },
    "27": {
        "id": 27,
        "name": "Six of Wands",
        "nameKr": "완드 6번",
        "keywords": [
            "승리",
            "명예",
            "인정"
        ],
        "score": 70,
        "warningScore": 47
    },
    "28": {
        "id": 28,
        "name": "Seven of Wands",
        "nameKr": "완드 7번",
        "keywords": [
            "수호",
            "방어",
            "입지"
        ],
        "score": 71.5,
        "warningScore": 35
    },
    "29": {
        "id": 29,
        "name": "Eight of Wands",
        "nameKr": "완드 8번",
        "keywords": [
            "속도",
            "급진전",
            "소식"
        ],
        "score": 73,
        "warningScore": 37
    },
    "30": {
        "id": 30,
        "name": "Nine of Wands",
        "nameKr": "완드 9번",
        "keywords": [
            "인내",
            "경계",
            "최후의 시험"
        ],
        "score": 47,
        "warningScore": 39
    },
    "31": {
        "id": 31,
        "name": "Ten of Wands",
        "nameKr": "완드 10번",
        "keywords": [
            "과부하",
            "책임",
            "압박"
        ],
        "score": 78.5,
        "warningScore": 41
    },
    "32": {
        "id": 32,
        "name": "Page of Wands",
        "nameKr": "완드 시종",
        "keywords": [
            "소식",
            "호기심",
            "잠재력"
        ],
        "score": 70,
        "warningScore": 43
    },
    "33": {
        "id": 33,
        "name": "Knight of Wands",
        "nameKr": "완드 기사",
        "keywords": [
            "행동",
            "모험",
            "추진력"
        ],
        "score": 71.5,
        "warningScore": 45
    },
    "34": {
        "id": 34,
        "name": "Queen of Wands",
        "nameKr": "완드 여왕",
        "keywords": [
            "자신감",
            "매력",
            "활력"
        ],
        "score": 73,
        "warningScore": 47
    },
    "35": {
        "id": 35,
        "name": "King of Wands",
        "nameKr": "완드 왕",
        "keywords": [
            "비전",
            "권위",
            "성취"
        ],
        "score": 82,
        "warningScore": 35
    },
    "36": {
        "id": 36,
        "name": "Ace of Cups",
        "nameKr": "컵 에이스",
        "keywords": [
            "시작",
            "정서적 유입",
            "충만"
        ],
        "score": 93.5,
        "warningScore": 37
    },
    "37": {
        "id": 37,
        "name": "Two of Cups",
        "nameKr": "컵 2번",
        "keywords": [
            "화합",
            "우정",
            "파트너십"
        ],
        "score": 80,
        "warningScore": 39
    },
    "38": {
        "id": 38,
        "name": "Three of Cups",
        "nameKr": "컵 3번",
        "keywords": [
            "공유",
            "유대",
            "환희"
        ],
        "score": 81.5,
        "warningScore": 41
    },
    "39": {
        "id": 39,
        "name": "Four of Cups",
        "nameKr": "컵 4번",
        "keywords": [
            "정체",
            "권태",
            "내면 탐색"
        ],
        "score": 83,
        "warningScore": 43
    },
    "40": {
        "id": 40,
        "name": "Five of Cups",
        "nameKr": "컵 5번",
        "keywords": [
            "상실",
            "후회",
            "시선 전환"
        ],
        "score": 57,
        "warningScore": 45
    },
    "41": {
        "id": 41,
        "name": "Six of Cups",
        "nameKr": "컵 6번",
        "keywords": [
            "추억",
            "순수",
            "재방문"
        ],
        "score": 78.5,
        "warningScore": 47
    },
    "42": {
        "id": 42,
        "name": "Seven of Cups",
        "nameKr": "컵 7번",
        "keywords": [
            "환상",
            "선택장애",
            "신기루"
        ],
        "score": 80,
        "warningScore": 35
    },
    "43": {
        "id": 43,
        "name": "Eight of Cups",
        "nameKr": "컵 8번",
        "keywords": [
            "이탈",
            "본질 탐구",
            "여정"
        ],
        "score": 81.5,
        "warningScore": 37
    },
    "44": {
        "id": 44,
        "name": "Nine of Cups",
        "nameKr": "컵 9번",
        "keywords": [
            "만족",
            "소원 성취",
            "자기애"
        ],
        "score": 63,
        "warningScore": 39
    },
    "45": {
        "id": 45,
        "name": "Ten of Cups",
        "nameKr": "컵 10번",
        "keywords": [
            "완성",
            "정서적 유대",
            "조화"
        ],
        "score": 87,
        "warningScore": 41
    },
    "46": {
        "id": 46,
        "name": "Page of Cups",
        "nameKr": "컵 시종",
        "keywords": [
            "소식",
            "예술적 감성",
            "호기심"
        ],
        "score": 78.5,
        "warningScore": 43
    },
    "47": {
        "id": 47,
        "name": "Knight of Cups",
        "nameKr": "컵 기사",
        "keywords": [
            "제안",
            "로맨티시즘",
            "우아함"
        ],
        "score": 80,
        "warningScore": 45
    },
    "48": {
        "id": 48,
        "name": "Queen of Cups",
        "nameKr": "컵 여왕",
        "keywords": [
            "공감",
            "자애",
            "통찰"
        ],
        "score": 81.5,
        "warningScore": 47
    },
    "49": {
        "id": 49,
        "name": "King of Cups",
        "nameKr": "컵 왕",
        "keywords": [
            "평정",
            "관대",
            "정서적 숙련"
        ],
        "score": 97.8,
        "warningScore": 35
    },
    "50": {
        "id": 50,
        "name": "Ace of Swords",
        "nameKr": "검 에이스",
        "keywords": [
            "결단",
            "명확함",
            "돌파"
        ],
        "score": 67,
        "warningScore": 52
    },
    "51": {
        "id": 51,
        "name": "Two of Swords",
        "nameKr": "검 2번",
        "keywords": [
            "교착",
            "선택 보류",
            "균형"
        ],
        "score": 53.5,
        "warningScore": 54
    },
    "52": {
        "id": 52,
        "name": "Three of Swords",
        "nameKr": "검 3번",
        "keywords": [
            "상처",
            "슬픔",
            "직면"
        ],
        "score": 30.5,
        "warningScore": 62.4
    },
    "53": {
        "id": 53,
        "name": "Four of Swords",
        "nameKr": "검 4번",
        "keywords": [
            "휴식",
            "회복",
            "정지"
        ],
        "score": 56.5,
        "warningScore": 58
    },
    "54": {
        "id": 54,
        "name": "Five of Swords",
        "nameKr": "검 5번",
        "keywords": [
            "이기주의",
            "불화",
            "상처뿐인 승리"
        ],
        "score": 38,
        "warningScore": 60
    },
    "55": {
        "id": 55,
        "name": "Six of Swords",
        "nameKr": "검 6번",
        "keywords": [
            "이동",
            "회복",
            "국면 전환"
        ],
        "score": 52,
        "warningScore": 62
    },
    "56": {
        "id": 56,
        "name": "Seven of Swords",
        "nameKr": "검 7번",
        "keywords": [
            "기만",
            "은밀함",
            "책임 회피"
        ],
        "score": 53.5,
        "warningScore": 50
    },
    "57": {
        "id": 57,
        "name": "Eight of Swords",
        "nameKr": "검 8번",
        "keywords": [
            "속박",
            "무력감",
            "제약"
        ],
        "score": 55,
        "warningScore": 52
    },
    "58": {
        "id": 58,
        "name": "Nine of Swords",
        "nameKr": "검 9번",
        "keywords": [
            "불면",
            "불안",
            "죄책감"
        ],
        "score": 29.9,
        "warningScore": 62.6
    },
    "59": {
        "id": 59,
        "name": "Ten of Swords",
        "nameKr": "검 10번",
        "keywords": [
            "종결",
            "바닥",
            "수용"
        ],
        "score": 30.3,
        "warningScore": 65
    },
    "60": {
        "id": 60,
        "name": "Page of Swords",
        "nameKr": "검 시종",
        "keywords": [
            "경계",
            "첩보",
            "미숙함"
        ],
        "score": 52,
        "warningScore": 58
    },
    "61": {
        "id": 61,
        "name": "Knight of Swords",
        "nameKr": "검 기사",
        "keywords": [
            "급박함",
            "추진력",
            "논리적 관철"
        ],
        "score": 53.5,
        "warningScore": 60
    },
    "62": {
        "id": 62,
        "name": "Queen of Swords",
        "nameKr": "검 여왕",
        "keywords": [
            "독립",
            "냉철함",
            "경계 설정"
        ],
        "score": 55,
        "warningScore": 62
    },
    "63": {
        "id": 63,
        "name": "King of Swords",
        "nameKr": "검 왕",
        "keywords": [
            "지성",
            "전략",
            "이성적 권위"
        ],
        "score": 71.5,
        "warningScore": 50
    },
    "64": {
        "id": 64,
        "name": "Ace of Pentacles",
        "nameKr": "펜타클 에이스",
        "keywords": [
            "기틀",
            "번영",
            "실질적 결실"
        ],
        "score": 97.8,
        "warningScore": 37
    },
    "65": {
        "id": 65,
        "name": "Two of Pentacles",
        "nameKr": "펜타클 2번",
        "keywords": [
            "조율",
            "유연성",
            "변동성"
        ],
        "score": 77,
        "warningScore": 39
    },
    "66": {
        "id": 66,
        "name": "Three of Pentacles",
        "nameKr": "펜타클 3번",
        "keywords": [
            "협동",
            "숙련",
            "인정"
        ],
        "score": 78.5,
        "warningScore": 41
    },
    "67": {
        "id": 67,
        "name": "Four of Pentacles",
        "nameKr": "펜타클 4번",
        "keywords": [
            "소유",
            "안전제일",
            "보수적"
        ],
        "score": 80,
        "warningScore": 43
    },
    "68": {
        "id": 68,
        "name": "Five of Pentacles",
        "nameKr": "펜타클 5번",
        "keywords": [
            "고립",
            "고난",
            "소외"
        ],
        "score": 33.9,
        "warningScore": 63.2
    },
    "69": {
        "id": 69,
        "name": "Six of Pentacles",
        "nameKr": "펜타클 6번",
        "keywords": [
            "관용",
            "나눔",
            "균형"
        ],
        "score": 83,
        "warningScore": 47
    },
    "70": {
        "id": 70,
        "name": "Seven of Pentacles",
        "nameKr": "펜타클 7번",
        "keywords": [
            "인내",
            "수확 대기",
            "중간 점검"
        ],
        "score": 77,
        "warningScore": 35
    },
    "71": {
        "id": 71,
        "name": "Eight of Pentacles",
        "nameKr": "펜타클 8번",
        "keywords": [
            "성실",
            "연마",
            "장인 정신"
        ],
        "score": 78.5,
        "warningScore": 37
    },
    "72": {
        "id": 72,
        "name": "Nine of Pentacles",
        "nameKr": "펜타클 9번",
        "keywords": [
            "자립",
            "성취",
            "품격"
        ],
        "score": 60,
        "warningScore": 39
    },
    "73": {
        "id": 73,
        "name": "Ten of Pentacles",
        "nameKr": "펜타클 10번",
        "keywords": [
            "유산",
            "가풍",
            "부유함"
        ],
        "score": 91.5,
        "warningScore": 41
    },
    "74": {
        "id": 74,
        "name": "Page of Pentacles",
        "nameKr": "펜타클 시종",
        "keywords": [
            "학구열",
            "신중",
            "기회 포착"
        ],
        "score": 83,
        "warningScore": 43
    },
    "75": {
        "id": 75,
        "name": "Knight of Pentacles",
        "nameKr": "펜타클 기사",
        "keywords": [
            "우직함",
            "보수적",
            "실천"
        ],
        "score": 77,
        "warningScore": 45
    },
    "76": {
        "id": 76,
        "name": "Queen of Pentacles",
        "nameKr": "펜타클 여왕",
        "keywords": [
            "실속",
            "풍요",
            "보살핌"
        ],
        "score": 78.5,
        "warningScore": 47
    },
    "77": {
        "id": 77,
        "name": "King of Pentacles",
        "nameKr": "펜타클 왕",
        "keywords": [
            "재력",
            "성공",
            "경제적 권위"
        ],
        "score": 95,
        "warningScore": 35
    }
};
