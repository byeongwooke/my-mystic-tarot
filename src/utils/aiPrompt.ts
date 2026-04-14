export const AI_NARRATIVE_GUIDELINE = `
[지시사항]
- 너는 타로 마스터로서 카드의 정/역방향 의미를 완벽히 반영하여 전체 서사를 작성해야 한다.
- 유저가 개별 해석에서 본 내용과 종합 해석의 내용이 '뱡향성(정/역)' 면에서 충돌하지 않도록 극도로 주의해라.
- 역방향 카드가 나왔다면 반드시 그 경고와 장애물의 뉘앙스를 종합 해석 스토리라인에 포함시킬 것.
`;

export function generateAIPromptContext(cardsInfo: any[]) {
  const contextList = cardsInfo.map((info, idx) => {
    const cardData = info.cardData;
    // 방향성 한글 텍스트
    const orientation = info.isReversed ? '역방향' : '정방향';
    
    // 키워드 (정방향/역방향 구분)
    // base.ts의 구조를 가정하여 키워드 추출 (보통 keywords 배열이 있거나 정역방향 구분이 있을 수 있음)
    // TarotBase 데이터에 명시적인 역방향 키워드가 없더라도 방향성은 전달
    const keyMeaning = cardData.keywords ? cardData.keywords.join(', ') : '';

    return `{ cardName: '${cardData.nameKr}(${cardData.name})', orientation: '${orientation}', keyMeaning: '${keyMeaning}' }`;
  });

  return `
[카드 컨텍스트 (총 ${cardsInfo.length}장)]
${contextList.join('\n')}
  `;
}
