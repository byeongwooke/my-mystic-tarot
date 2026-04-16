export interface TarotBase {
    id: number;
    name: string;
    nameKr: string;
    keywords: string[];
    keywordsReversed: string[]; // 역방향 핵심 키워드 추가
    score: number;
    warningScore: number;
    polarity: 'positive' | 'negative';
    reversePolarity: 'positive' | 'negative';
}

export interface TodayData {
    normal: { interpretation: string; advice: string };
    reversed: { interpretation: string; advice: string };
}

export interface WorryCategory {
    normal: { interpretation: string; advice: string };
    reversed: { interpretation: string; advice: string };
}

export interface WorryContent {
    love: WorryCategory;
    money: WorryCategory;
    work: WorryCategory;
}

export interface WorryData {
    spicy: WorryContent;
    gentle: WorryContent;
}

export interface TimelineAdvice {
    past: string;
    present: string;
    future: string;
}

export interface CategoryContent {
    interpretation: string;
    advice: TimelineAdvice;
}

export interface Spread3Category {
    normal: CategoryContent;
    reversed: CategoryContent;
}

export interface Spread3Content {
    love: Spread3Category;
    money: Spread3Category;
    work: Spread3Category;
}

export interface Spread3Data {
    spicy: Spread3Content;
    gentle: Spread3Content;
}

export interface CelticAdvice {
    core: string;
    obstacle: string;
    foundation: string;
    past: string;
    goal: string;
    nearFuture: string;
    self: string;
    influence: string;
    hopes: string;
    destiny: string;
}

export interface CelticPositionContent {
    interpretation: string;
    advice: CelticAdvice;
}

export interface CelticPositionData {
    normal: CelticPositionContent;
    reversed: CelticPositionContent;
}

export interface CelticCategorySet {
    love: CelticPositionData;
    money: CelticPositionData;
    work: CelticPositionData;
}

export interface CardContent {
    today: TodayData;
    worry: WorryData;
    spread3: Spread3Data;
    celtic: {
        spicy: CelticCategorySet;
        gentle: CelticCategorySet;
    };
}
