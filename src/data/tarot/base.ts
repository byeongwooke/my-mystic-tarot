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
    normal: string;
    reversed: string;
}

export interface WorryData {
    normal: string;
    reversed: string;
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

export interface CelticPositions {
    core: string;
    obstacle: string;
    goal: string;
    foundation: string;
    past: string;
    nearFuture: string;
    self: string;
    influence: string;
    hopes: string;
    destiny: string;
}

export interface CelticCategory {
    normal: { interpretation: string; positions: CelticPositions };
    reversed: { interpretation: string; positions: CelticPositions };
}

export interface CelticContent {
    love: CelticCategory;
    money: CelticCategory;
    work: CelticCategory;
}

export interface CelticData {
    spicy: CelticContent;
    gentle: CelticContent;
}

export interface CardContent {
    today: TodayData;
    worry: WorryData;
    spread3: Spread3Data;
    celtic: CelticData;
}
