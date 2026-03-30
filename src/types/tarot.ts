export interface CelticAdvice {
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

export interface CelticCard {
    interpretations: {
        love: string;
        loveReversed: string;
        money: string;
        moneyReversed: string;
        work: string;
        workReversed: string;
    };
    advice: {
        love: CelticAdvice;
        loveReversed: CelticAdvice;
        money: CelticAdvice;
        moneyReversed: CelticAdvice;
        work: CelticAdvice;
        workReversed: CelticAdvice;
    };
}
