export interface TimelineAdvice {
    past: string;
    present: string;
    future: string;
}

export interface TarotCard {
    id: number;
    name: string;
    nameKr: string;
    keywords: string[];
    todayAdvice: string; // 오늘의 운세 전용 데이터 추가
    interpretations: {
        love: string;
        money: string;
        work: string;
        reversed: string;
    };
    advice: {
        love: TimelineAdvice;
        money: TimelineAdvice;
        work: TimelineAdvice;
    };
}

// --- 1. MAJOR ARCANA (0 - 21) ---
const MAJOR_ARCANA: TarotCard[] = [
    {
        id: 0, name: "The Fool", nameKr: "광대", keywords: ["자유", "순수", "시작"],
        todayAdvice: "새로운 시작이 길한 날입니다. 망설이지 말고 평소 하고 싶었던 일을 가벼운 마음으로 시작해 보세요!",
        interpretations: { love: "새로운 설렘, 자유로운 연애", money: "충동적 지출 주의, 새로운 수입원", work: "창업이나 새로운 프로젝트", reversed: "무모한 선택, 무책임한 행동으로 인한 실패" },
        advice: {
            love: { past: "과거에는 구속 없는 사랑을 원했었군요.", present: "지금은 가벼운 마음으로 인연을 만나보세요.", future: "곧 새로운 설렘이 당신을 찾아올 거예요." },
            money: { past: "돈에 대해 무계획적으로 행동했었나 봐요.", present: "지금은 큰 투자보다 흐름을 지켜보세요.", future: "생각지 못한 곳에서 수입이 생길 수 있어요." },
            work: { past: "준비 없이 일을 시작했던 적이 있었군요.", present: "실패를 두려워 말고 새로운 시도를 해보세요.", future: "창의적인 일이 당신에게 주어질 거예요." }
        }
    },
    {
        id: 1, name: "The Magician", nameKr: "마법사", keywords: ["능력", "창의성", "자신감"],
        todayAdvice: "당신의 잠재력이 빛을 발하는 하루입니다. 자신감을 가지고 주도적으로 당신의 능력을 보여주세요.",
        interpretations: { love: "매력 발산, 새로운 만남 주도", money: "아이디어를 통한 수익 창출", work: "준비된 실력 발휘, 성과 달성", reversed: "재능 낭비, 속임수나 사기 주의" },
        advice: {
            love: { past: "당신의 매력으로 상대를 사로잡았었네요.", present: "자신감을 가지고 상대에게 다가가 보세요.", future: "당신이 주도하는 연애가 시작될 거예요." },
            money: { past: "아이디어로 돈을 벌었던 경험이 있었군요.", present: "당신의 기술을 활용해 수익을 만들어보세요.", future: "재능이 곧 돈이 되는 시기가 올 거예요." },
            work: { past: "과거에 능력을 인정받은 순간이 있었네요.", present: "준비는 끝났으니 당당하게 실력을 보여주세요.", future: "중요한 프로젝트를 성공시키게 될 거예요." }
        }
    },
    {
        id: 2, name: "The High Priestess", nameKr: "고위 여사제", keywords: ["직관", "지혜", "신비"],
        todayAdvice: "직관이 예리해지는 날입니다. 중요한 결정은 논리보다 당신의 마음이 속삭이는 소리에 귀를 기울여 보세요.",
        interpretations: { love: "정신적 교감, 짝사랑, 신중함", money: "문서운 좋음, 신중한 관리", work: "연구, 분석, 공부에 최적화", reversed: "비밀의 폭로, 직관의 왜곡, 신경질적 태도" },
        advice: {
            love: { past: "속마음을 숨기며 신중하게 사랑했었군요.", present: "지금은 직관을 믿고 조용히 지켜보세요.", future: "정신적으로 깊이 통하는 인연을 만날 거예요." },
            money: { past: "과거에는 돈 관리가 아주 철저했었네요.", present: "충동적인 지출을 줄이고 내실을 다지세요.", future: "신중한 판단이 큰 이득으로 돌아올 거예요." },
            work: { past: "공부와 분석에 매진했던 시기가 있었군요.", present: "드러내기보다 전문성을 더 키워보세요.", future: "지혜로운 결정이 직장에서 인정받을 거예요." }
        }
    },
    {
        id: 3, name: "The Empress", nameKr: "여황제", keywords: ["풍요", "모성", "결실"],
        todayAdvice: "풍요로움이 가득한 하루입니다. 자신을 가꾸거나 맛있는 음식을 먹으며 스스로에게 따뜻한 보상을 해주세요.",
        interpretations: { love: "안정적 사랑, 결혼운, 배려", money: "금전적 풍요, 자산 상승", work: "노력의 결실, 풍성한 성과", reversed: "지나친 집착, 과소비, 창의력 정체" },
        advice: {
            love: { past: "풍요로운 사랑을 주고받던 때가 있었군요.", present: "상대에게 따뜻한 배려를 보여주세요.", future: "안정적이고 행복한 관계가 지속될 거예요." },
            money: { past: "금전적으로 여유로웠던 시기를 보냈었네요.", present: "당신을 위한 소비에 인색하지 마세요.", future: "재물이 풍족하게 쌓이는 시기가 올 거예요." },
            work: { past: "열심히 씨를 뿌려 결실을 보았었군요.", present: "동료들과 성과를 기쁘게 누려보세요.", future: "진행 중인 일이 아주 큰 결실을 맺을 거예요." }
        }
    },
    {
        id: 4, name: "The Emperor", nameKr: "황제", keywords: ["권위", "질서", "책임"],
        todayAdvice: "리더십과 책임감이 필요한 날입니다. 공적인 일에서 흔들리지 않는 원칙을 지킨다면 큰 신뢰를 얻을 것입니다.",
        interpretations: { love: "책임감 있는 관계, 주도권 행사", money: "안정적 자산 관리, 체계적 계획", work: "리더십 발휘, 높은 위치 성취", reversed: "독단적 횡포, 융통성 부족" },
        advice: {
            love: { past: "과거엔 책임감이 강한 사랑을 했었군요.", present: "상대에게 믿음직한 모습을 보여주세요.", future: "안정적인 관계의 기틀이 마련될 거예요." },
            money: { past: "체계적으로 돈을 모았던 경험이 있네요.", present: "지금은 계획적인 소비와 투자가 필요해요.", future: "재정적으로 확고한 위치에 서게 될 거예요." },
            work: { past: "강한 리더십으로 조직을 이끌었었군요.", present: "당당하게 주도권을 쥐고 일을 추진하세요.", future: "직장에서 높은 자리에 오르게 될 거예요." }
        }
    },
    {
        id: 5, name: "The Hierophant", nameKr: "교황", keywords: ["전통", "자비", "중재"],
        todayAdvice: "전통이나 규칙을 따르는 것이 유리한 날입니다. 혼자 고민하기보다 선배나 전문가의 조언을 구해보세요.",
        interpretations: { love: "신뢰 중심 관계, 도덕적 사랑", money: "전문가 조언 필요, 안정적 투자", work: "멘토의 도움, 원만한 조직 생활", reversed: "고립된 생각, 잘못된 조언" },
        advice: {
            love: { past: "도덕적이고 보수적인 사랑을 했었군요.", present: "서로의 가치관을 존중하며 대화해 보세요.", future: "주변의 축복을 받는 인연이 나타날 거예요." },
            money: { past: "정석적인 방법으로 자산을 지켰었네요.", present: "혼자 결정하지 말고 전문가에게 물어보세요.", future: "안전한 투자로 꾸준한 이득을 볼 거예요." },
            work: { past: "상사의 도움을 많이 받았던 적이 있군요.", present: "조직의 규칙을 따르는 것이 이로워요.", future: "당신을 도와줄 귀인이 나타날 거예요." }
        }
    },
    {
        id: 6, name: "The Lovers", nameKr: "연인", keywords: ["사랑", "선택", "조화"],
        todayAdvice: "관계에서의 조화와 올바른 선택이 중요한 날입니다. 당신의 마음이 진정으로 향하는 곳이 어디인지 살펴보세요.",
        interpretations: { love: "강렬한 끌림, 최상의 연애운", money: "동업 수익 가능성, 선택의 기로", work: "환상의 팀워크, 협동 프로젝트", reversed: "관계 불균형, 유혹, 잘못된 선택" },
        advice: {
            love: { past: "운명적인 사랑을 경험했던 적이 있군요.", present: "마음이 이끄는 대로 솔직하게 고백하세요.", future: "서로 깊이 소통하는 사랑이 시작될 거예요." },
            money: { past: "선택의 기로에서 고민이 많았었네요.", present: "사람들과 이익을 나누면 운이 좋아져요.", future: "유리한 계약이나 제안이 들어올 거예요." },
            work: { past: "협동 프로젝트에서 성과가 좋았었군요.", present: "동료와 호흡을 맞추는 데 집중해 보세요.", future: "완벽한 파트너와 함께 일을 하게 될 거예요." }
        }
    },
    {
        id: 7, name: "The Chariot", nameKr: "전차", keywords: ["승리", "의지", "추진력"],
        todayAdvice: "목표를 향해 강력하게 돌진해야 하는 날입니다. 장애물이 앞을 가로막아도 굴하지 않는 추진력이 필요합니다.",
        interpretations: { love: "적극적 구애, 빠른 관계 발전", money: "공격적 투자 성과, 단기 수익", work: "목표 달성, 경쟁에서의 승리", reversed: "통제력 상실, 방향을 잃은 폭주" },
        advice: {
            love: { past: "사랑을 위해 물불 가리지 않았었군요.", present: "지금은 망설이지 말고 전진해야 할 때예요.", future: "관계가 비약적으로 빠르게 발전할 거예요." },
            money: { past: "과감한 결단으로 돈을 벌었던 적이 있네요.", present: "목표를 정했다면 공격적으로 투자하세요.", future: "조만간 금전적 승리를 거머쥐게 될 거예요." },
            work: { past: "어려운 과제를 열정으로 돌파했었군요.", present: "장애물을 두려워 말고 밀어붙여 보세요.", future: "경쟁자를 물리치고 목표를 이룰 거예요." }
        }
    },
    {
        id: 8, name: "Strength", nameKr: "힘", keywords: ["용기", "인내", "부드러움"],
        todayAdvice: "강압적인 힘보다 부드러운 인내심이 승리하는 날입니다. 감정을 잘 다스리고 유연하게 대처하는 것이 핵심입니다.",
        interpretations: { love: "부드러운 카리스마, 인내하는 사랑", money: "지출 관리의 인내, 장기적 안정", work: "끈기 있는 문제 해결, 설득의 힘", reversed: "자신감 상실, 감정 조절 실패" },
        advice: {
            love: { past: "상대를 포용하며 잘 견뎌냈던 사랑이네요.", present: "부드러운 미소로 상대의 마음을 다독이세요.", future: "당신의 인내가 사랑을 완성할 거예요." },
            money: { past: "힘든 시기를 끈기로 잘 버텨왔었군요.", present: "지금은 충동적인 소비를 참아야 할 때예요.", future: "장기적인 안목이 큰 재산을 만들 거예요." },
            work: { past: "포기하지 않는 의지로 문제를 해결했었네요.", present: "부드러운 설득력이 강압보다 효과적이에요.", future: "어려운 일도 결국 당신이 해내게 될 거예요." }
        }
    },
    {
        id: 9, name: "The Hermit", nameKr: "은둔자", keywords: ["성찰", "고독", "진리"],
        todayAdvice: "외부의 소음보다는 내면의 목소리에 집중해야 할 때입니다. 혼자만의 시간을 가지며 생각을 정리해 보세요.",
        interpretations: { love: "신중한 접근, 혼자만의 시간 필요", money: "무소유적 태도, 자금 흐름 정체", work: "전문성 강화, 심도 있는 연구", reversed: "사회적 고립, 아집, 소통 거부" },
        advice: {
            love: { past: "혼자만의 시간을 보내며 성찰했었군요.", present: "지금은 내면의 목소리에 더 집중해 보세요.", future: "진정으로 원하는 사랑이 무엇인지 알게 돼요." },
            money: { past: "물욕을 버리고 마음을 비웠던 시기였네요.", present: "돈을 쫓기보다 현재를 점검해 보세요.", future: "깊은 고민 끝에 현명한 길을 찾을 거예요." },
            work: { past: "한 분야를 깊게 연구했던 경험이 있군요.", present: "외부 활동보다는 내실을 다져야 해요.", future: "당신의 전문성이 빛을 발할 날이 와요." }
        }
    },
    {
        id: 10, name: "Wheel of Fortune", nameKr: "운명의 수레바퀴", keywords: ["운명", "변화", "전환점"],
        todayAdvice: "운명적인 변화의 흐름이 느껴지는 하루입니다. 긍정적인 마음으로 변화를 받아들인다면 큰 행운을 잡을 것입니다.",
        interpretations: { love: "운명적 만남, 관계의 큰 반전", money: "뜻밖의 횡재, 금전운의 상승", work: "새로운 기회의 도래, 승진/이직", reversed: "불운의 시작, 변화에 대한 저항" },
        advice: {
            love: { past: "우연한 계기로 시작된 사랑이었군요.", present: "운명의 흐름에 몸을 맡겨보는 건 어때요?", future: "기다리던 인연이 갑자기 나타날 거예요." },
            money: { past: "운 좋게 돈이 들어왔던 적이 있었네요.", present: "지금 오는 기회를 놓치지 말고 잡으세요.", future: "금전적 흐름이 상승 곡선을 탈 거예요." },
            work: { past: "예상치 못한 변화가 기회가 됐었군요.", present: "새로운 제안을 긍정적으로 검토해 보세요.", future: "인생을 바꿀 중요한 변화가 찾아와요." }
        }
    },
    {
        id: 11, name: "Justice", nameKr: "정의", keywords: ["균형", "공정", "결단"],
        todayAdvice: "공정하고 객관적인 판단이 필요한 날입니다. 사적인 감정을 배제하고 이성적으로 결정할 때 답이 보입니다.",
        interpretations: { love: "이성적 관계, 공평한 사랑", money: "정직한 거래, 법적 계약 유리", work: "객관적 평가, 합리적 업무 처리", reversed: "불공정한 처우, 판단 착오" },
        advice: {
            love: { past: "공평하게 감정을 주고받으려 했었군요.", present: "감정보다 이성으로 상대를 대하세요.", future: "결혼이나 문서와 관련된 소식이 올 거예요." },
            money: { past: "정직하게 벌고 정직하게 썼었네요.", present: "계약서를 꼼꼼히 살피는 게 중요해요.", future: "뿌린 만큼 거두는 정직한 이득이 와요." },
            work: { past: "합리적인 판단으로 업무를 수행했었군요.", present: "객관적인 자료를 근거로 일을 진행하세요.", future: "정당한 평가를 통해 보상을 받을 거예요." }
        }
    },
    {
        id: 12, name: "The Hanged Man", nameKr: "매달린 사람", keywords: ["희생", "인내", "관점 전환"],
        todayAdvice: "조급함을 버리고 인내하며 기다려야 하는 날입니다. 지금은 행동하기보다 상황을 멀리서 관조하는 것이 좋습니다.",
        interpretations: { love: "헌신적 사랑, 기다림의 시기", money: "자금 묶임, 미래를 위한 투자", work: "정체기, 새로운 시각에서의 분석", reversed: "무의미한 희생, 변화 없는 고착" },
        advice: {
            love: { past: "사랑을 위해 많은 걸 포기했었군요.", present: "지금은 조급해하지 말고 기다려야 해요.", future: "상황을 거꾸로 보면 답이 보일 거예요." },
            money: { past: "미래를 위해 자금을 묶어뒀던 적이 있네요.", present: "지금은 수익이 없어도 참아내야 할 때예요.", future: "인내한 만큼 나중에 크게 돌아올 거예요." },
            work: { past: "묵묵히 버티며 기회를 엿보던 때였군요.", present: "행동보다 생각을 정리하는 게 우선이에요.", future: "완전히 다른 관점이 성공을 가져와요." }
        }
    },
    {
        id: 13, name: "Death", nameKr: "죽음", keywords: ["종결", "새로운 시작", "이별"],
        todayAdvice: "하나의 장이 끝나고 새로운 시작이 준비되는 날입니다. 미련 없이 과거를 보내주어야 더 나은 새것이 찾아옵니다.",
        interpretations: { love: "관계의 종료 후 새로운 인연", money: "손실 끊어내기, 재테크 변화", work: "프로젝트 종료, 과감한 이직", reversed: "과거에 집착, 변화 거부" },
        advice: {
            love: { past: "가슴 아픈 이별을 겪으셨던 적이 있네요.", present: "끝난 관계는 깨끗이 잊고 새출발 하세요.", future: "더 나은 사랑이 당신을 기다리고 있어요." },
            money: { past: "금전적 손실을 본 경험이 있으시군요.", present: "지금은 안 되는 일을 과감히 정리하세요.", future: "새로운 방식의 부를 창출하게 될 거예요." },
            work: { past: "진행하던 일을 끝냈던 시기가 있었네요.", present: "과거의 성공 방식은 이제 버려야 해요.", future: "완전히 새로운 분야의 문이 열릴 거예요." }
        }
    },
    {
        id: 14, name: "Temperance", nameKr: "절제", keywords: ["조화", "균형", "중용"],
        todayAdvice: "절제와 조화가 필요한 하루입니다. 한쪽으로 치우치지 않도록 감정과 상황의 적절한 균형을 유지하세요.",
        interpretations: { love: "평온한 소통, 서로 맞춰가는 연애", money: "수입 지출의 균형, 안정적 자금", work: "협상과 조율, 원만한 업무 협동", reversed: "불균형, 절제력 부족" },
        advice: {
            love: { past: "서로를 이해하며 잘 조율했었군요.", present: "감정의 속도를 잘 조절하는 게 필요해요.", future: "서로 완벽하게 스며드는 사랑을 해요." },
            money: { past: "지출을 잘 조절하며 살았었네요.", present: "수입과 지출의 균형을 맞추는 데 힘쓰세요.", future: "자금 흐름이 아주 원만하게 풀릴 거예요." },
            work: { past: "동료와 협동하여 성과를 냈었군요.", present: "절충안을 찾아 대화하는 태도가 중요해요.", future: "평화롭고 조화로운 업무 환경이 조성돼요." }
        }
    },
    {
        id: 15, name: "The Devil", nameKr: "악마", keywords: ["유혹", "속박", "집착"],
        todayAdvice: "자극적인 유혹이나 집착을 경계해야 하는 날입니다. 일시적인 쾌락보다는 장기적인 안정을 먼저 생각하세요.",
        interpretations: { love: "치명적 유혹, 벗어나기 힘든 관계", money: "욕심으로 인한 손실, 금전 중독", work: "과도한 스트레스, 부정한 유혹", reversed: "속박으로부터의 탈출, 각성" },
        advice: {
            love: { past: "강한 집착으로 힘들었던 사랑이었네요.", present: "지금 관계가 건강한지 잘 따져보세요.", future: "자유를 찾거나 나쁜 습관을 버리게 돼요." },
            money: { past: "욕심 때문에 돈을 잃었던 경험이 있군요.", present: "일확천금의 유혹을 단호하게 거절하세요.", future: "돈의 노예가 아닌 주인이 될 수 있어요." },
            work: { past: "일 때문에 압박감을 많이 느꼈었네요.", present: "부정한 방법은 나중에 화를 부를 수 있어요.", future: "답답한 현실을 벗어날 기회가 올 거예요." }
        }
    },
    {
        id: 16, name: "The Tower", nameKr: "탑", keywords: ["붕괴", "충격", "해방"],
        todayAdvice: "예상치 못한 변화에 당황할 수 있으나, 이는 낡은 것을 부수고 자유를 찾는 과정입니다. 유연하게 대처하세요.",
        interpretations: { love: "갑작스런 이별/다툼, 관계의 격변", money: "금전적 충격, 예기치 못한 지출", work: "조직의 변화, 갑작스런 업무 종료", reversed: "위기 모면, 재건의 시작" },
        advice: {
            love: { past: "갑작스럽게 헤어졌던 아픔이 있었군요.", present: "무너지는 관계를 억지로 붙잡지 마세요.", future: "폭풍이 지난 뒤 진실만 남게 될 거예요." },
            money: { past: "돈 문제로 큰 충격을 받았었네요.", present: "비상금을 미리 준비해 두는 게 좋겠어요.", future: "바닥을 친 만큼 다시 올라갈 일만 남았어요." },
            work: { past: "회사가 갑자기 변했던 경험이 있군요.", present: "변화를 겸허히 받아들이고 새 판을 짜세요.", future: "낡은 생각은 버리고 혁신적인 일을 해요." }
        }
    },
    {
        id: 17, name: "The Star", nameKr: "별", keywords: ["희망", "영감", "치유"],
        todayAdvice: "희망과 영감이 샘솟는 아름다운 날입니다. 긍정적인 에너지를 바탕으로 당신만의 밝은 미래를 꿈꿔보세요.",
        interpretations: { love: "이상형과의 만남, 희망적 미래", money: "금전적 회복, 낙관적인 상태", work: "아이디어 발산, 미래 지향적 사업", reversed: "실망감, 헛된 희망" },
        advice: {
            love: { past: "꿈같은 사랑을 기대했었군요.", present: "순수한 마음으로 상대를 대해보세요.", future: "바라던 이상형과 행복한 연애를 해요." },
            money: { past: "어려운 형편에서도 희망을 품었었네요.", present: "금전적인 상황이 점점 좋아지고 있어요.", future: "금전적 목표가 서서히 이루어질 거예요." },
            work: { past: "반짝이는 아이디어가 많았었군요.", present: "당신의 창의성을 믿고 마음껏 펼치세요.", future: "업계에서 빛나는 존재가 될 거예요." }
        }
    },
    {
        id: 18, name: "The Moon", nameKr: "달", keywords: ["불안", "혼돈", "무의식"],
        todayAdvice: "마음속 불안이나 안개가 끼어있는 듯한 혼란이 생길 수 있습니다. 안개가 걷힐 때까지 성급한 결정은 피하세요.",
        interpretations: { love: "상대에 대한 불신, 불안한 연애", money: "불투명한 투자 주의, 금전적 혼란", work: "막막한 상황, 보이지 않는 경쟁자", reversed: "불안 해소, 진실의 규명" },
        advice: {
            love: { past: "상대를 믿지 못해 불안했었군요.", present: "마음속 공포에 휘둘리지 않도록 하세요.", future: "안개가 걷히고 진실이 드러날 거예요." },
            money: { past: "돈 문제로 앞이 캄캄했었네요.", present: "불확실한 곳엔 돈을 넣지 마세요.", future: "답답했던 자금 흐름이 명확해질 거예요." },
            work: { past: "일이 잘 안 풀려 막막했었군요.", present: "보이지 않는 적보다 내실을 기하세요.", future: "불안함이 사라지고 길이 보일 거예요." }
        }
    },
    {
        id: 19, name: "The Sun", nameKr: "태양", keywords: ["성공", "기쁨", "활력"],
        todayAdvice: "성공과 기쁨이 가득한 최고의 하루가 될 것입니다. 당신의 밝고 긍정적인 활력을 주변과 마음껏 나누세요.",
        interpretations: { love: "축복받는 관계, 최고의 행복", money: "금전적 대박, 자산의 양지화", work: "인정받는 성과, 에너제틱한 활동", reversed: "일시적 정체, 과한 낙관" },
        advice: {
            love: { past: "아이처럼 순수한 사랑을 했었군요.", present: "지금 사랑을 마음껏 누리고 기뻐하세요.", future: "모두에게 축복받는 사랑을 하게 돼요." },
            money: { past: "금전적으로 아주 좋았던 때가 있네요.", present: "자신 있게 투자하고 돈을 벌어보세요.", future: "재정적으로 가장 밝은 시기가 와요." },
            work: { past: "열정적으로 일해서 인정받았었군요.", present: "당신의 에너지를 밖으로 표출하세요.", future: "최고의 성과를 내고 환하게 웃을 거예요." }
        }
    },
    {
        id: 20, name: "Judgement", nameKr: "심판", keywords: ["부활", "보상", "결정"],
        todayAdvice: "과거의 노력에 대한 보상이나 기다리던 소식이 들려오는 날입니다. 찾아온 부활의 기회를 놓치지 마세요.",
        interpretations: { love: "재회운, 결실을 보는 관계", money: "노력에 대한 보상, 밀린 돈 회수", work: "승진, 합격, 프로젝트 결과 발표", reversed: "기회 상실, 과거의 발목" },
        advice: {
            love: { past: "헤어진 연인과 다시 연락했었군요.", present: "이제는 결단을 내릴 때가 되었어요.", future: "과거의 인연과 행복한 재회를 해요." },
            money: { past: "노력에 대한 대가를 받았었네요.", present: "빌려준 돈이 있다면 지금 받으러 가세요.", future: "금전적으로 정당한 보상이 따를 거예요." },
            work: { past: "결과를 기다리며 초조했었군요.", present: "좋은 소식이 올 테니 마음 준비하세요.", future: "합격이나 승진 소식을 듣게 될 거예요." }
        }
    },
    {
        id: 21, name: "The World", nameKr: "세계", keywords: ["완성", "성취", "통합"],
        todayAdvice: "진행하던 일이 성공적으로 마무리되고 큰 성취감을 얻는 날입니다. 완벽한 하루를 즐기며 보람을 느껴보세요.",
        interpretations: { love: "결혼, 관계의 완성, 만족", money: "목표 달성, 경제적 자유", work: "성공적 마무리, 해외 진출", reversed: "미완의 성공, 정체" },
        advice: {
            love: { past: "관계가 아주 원만하게 완성됐었군요.", present: "현재의 행복을 최고의 상태로 유지하세요.", future: "당신의 세계를 완성할 사랑을 만나요." },
            money: { past: "경제적 자유를 맛보았던 적이 있네요.", present: "더할 나위 없이 좋은 상태를 누리세요.", future: "재정적인 목표를 완벽히 달성할 거예요." },
            work: { past: "일을 성공적으로 마쳤던 기억이 있군요.", present: "글로벌한 시각으로 세상을 바라보세요.", future: "업계에서 최고의 위치에 서게 될 거예요." }
        }
    }
];

// --- 2. WANDS (22 - 35) ---
const WANDS: TarotCard[] = [
    {
        id: 22, name: "Ace of Wands", nameKr: "완드 에이스", keywords: ["열정", "창조", "기회"],
        todayAdvice: "새로운 열정이 샘솟는 하루입니다. 가슴 뛰는 아이디어가 있다면 지금 바로 실행에 옮겨보세요!",
        interpretations: { love: "새 연애 시작, 열정", money: "수익원 발생, 투자 의욕", work: "프로젝트 착수, 추진력", reversed: "의욕 저하, 지연" },
        advice: { love: { past: "불같은 열정이 넘쳤었군요.", present: "망설이지 말고 마음을 표현해 보세요.", future: "가슴 뛰는 새로운 만남이 올 거예요." }, money: { past: "새로운 수익 기회가 있었네요.", present: "과감한 투자가 필요한 시점이에요.", future: "돈을 벌 수 있는 새 통로가 열릴 거예요." }, work: { past: "의욕적으로 일을 벌였었군요.", present: "지금 바로 실행에 옮기는 게 중요해요.", future: "활기찬 새 업무를 맡게 될 거예요." } }
    },
    {
        id: 23, name: "Two of Wands", nameKr: "완드 2번", keywords: ["계획", "결정", "확장"],
        todayAdvice: "현재의 성공에 안주하지 말고 더 큰 미래를 설계해야 하는 날입니다. 당신의 세계를 넓힐 기회를 엿보세요.",
        interpretations: { love: "미래 설계, 관계 확장", money: "자산 확장 기틀, 결정", work: "시장 탐색, 목표 설정", reversed: "불확실한 미래, 정체" },
        advice: { love: { past: "먼 미래를 함께 꿈꿨었군요.", present: "더 넓은 관점으로 상대를 보세요.", future: "함께 더 큰 세상을 항해하게 될 거예요." }, money: { past: "자산을 늘릴 계획을 세웠었네요.", present: "안주하지 말고 다음 단계를 준비하세요.", future: "부의 영역이 크게 넓어질 시기예요." }, work: { past: "사업 확장을 고민했었군요.", present: "새로운 시장을 조사할 때예요.", future: "성공을 향한 구체적인 길이 보여요." } }
    },
    {
        id: 24, name: "Three of Wands", nameKr: "완드 3번", keywords: ["확장", "협력", "기다림"],
        todayAdvice: "노력의 결과가 서서히 보이기 시작합니다. 협력자들과 함께 더 먼 곳을 바라보며 다음 도약을 준비하세요.",
        interpretations: { love: "관계 진전, 장거리 연애", money: "투자 결실의 시작", work: "영역 확대, 비즈니스 성공", reversed: "진행 지연, 협력 실패" },
        advice: { love: { past: "신뢰를 바탕으로 기다렸었군요.", present: "이제는 더 깊은 관계로 나아갈 때예요.", future: "멀리서 좋은 인연이나 소식이 와요." }, money: { past: "장기 투자를 시작했었네요.", present: "수익이 들어올 때까지 조금만 참으세요.", future: "당신이 뿌린 씨앗이 돈으로 돌아와요." }, work: { past: "영역을 넓히기 위해 애썼었군요.", present: "협력자와 함께 다음 목표를 노리세요.", future: "비즈니스가 성공적으로 안착할 거예요." } }
    },
    {
        id: 25, name: "Four of Wands", nameKr: "완드 4번", keywords: ["축제", "안정", "화합"],
        todayAdvice: "평화롭고 안정적인 에너지가 가득한 하루입니다. 가족이나 소중한 지인들과 기쁨을 나누며 휴식을 취하세요.",
        interpretations: { love: "결혼, 안정된 연애", money: "금전적 안정, 축하금", work: "성과 달성, 휴식", reversed: "불화, 불안정" },
        advice: { love: { past: "화목하고 평화로운 때였군요.", present: "지금의 안정을 충분히 즐겨보세요.", future: "평생을 약속할 결혼운이 들어와요." }, money: { past: "돈 문제 없이 평온했었네요.", present: "성공을 축하하며 사람들과 나누세요.", future: "재정적 안정이 완벽하게 잡힐 거예요." }, work: { past: "프로젝트를 잘 마쳤었군요.", present: "잠시 쉬어가며 다음을 구상하세요.", future: "주변의 인정을 받으며 보람을 느껴요." } }
    },
    {
        id: 26, name: "Five of Wands", nameKr: "완드 5번", keywords: ["경쟁", "혼란", "갈등"],
        todayAdvice: "사소한 갈등이나 치열한 경쟁이 생길 수 있는 날입니다. 혼란에 휘말리지 말고 중심을 잘 잡으세요.",
        interpretations: { love: "사소한 의견 대립, 경쟁", money: "치열한 수익 경쟁", work: "팀 내 주도권 싸움", reversed: "갈등 해소, 타협" },
        advice: { love: { past: "서로 주장이 강해 다퉜었군요.", present: "싸움보다 대화로 풀어야 할 때예요.", future: "혼란 끝에 서로를 더 잘 알게 돼요." }, money: { past: "돈 때문에 경쟁이 치열했었네요.", present: "정신 바짝 차리고 이권을 챙기세요.", future: "어려운 경쟁을 뚫고 돈을 벌 거예요." }, work: { past: "팀워크가 잘 안 맞았었군요.", present: "창의적인 논쟁으로 승화시켜 보세요.", future: "혼란이 정리되고 질서가 잡힐 거예요." } }
    },
    {
        id: 27, name: "Six of Wands", nameKr: "완드 6번", keywords: ["승리", "명예", "인정"],
        todayAdvice: "당신의 노력과 성과가 널리 인정받는 명예로운 날입니다. 승리의 기쁨을 마음껏 누리셔도 좋습니다.",
        interpretations: { love: "사랑 쟁취, 선망의 대상", money: "투자 성공, 금전적 승리", work: "승진, 공로 인정", reversed: "자만, 명예 훼손" },
        advice: { love: { past: "인기가 아주 많았던 시기였군요.", present: "당신의 매력을 마음껏 뽐내보세요.", future: "사랑의 승리자가 되어 행복해져요." }, money: { past: "과감한 투자로 돈을 벌었었네요.", present: "성공에 따른 보상을 만끽하세요.", future: "금전적 승전보를 듣게 될 거예요." }, work: { past: "실력을 인정받아 승승장구했었군요.", present: "공로를 당당하게 주장하셔도 좋아요.", future: "직장에서 명예로운 위치에 서게 돼요." } }
    },
    {
        id: 28, name: "Seven of Wands", nameKr: "완드 7번", keywords: ["방어", "용기", "입지"],
        todayAdvice: "여러 가지 도전이나 업무가 몰려올 수 있습니다. 용기를 잃지 말고 당신의 입지를 단호하게 지켜내세요.",
        interpretations: { love: "관계 유지 노력, 방어", money: "자산 방어, 지출 압박", work: "업무 압박, 지위 고수", reversed: "압박 굴복, 포기" },
        advice: { love: { past: "관계를 지키려 애썼던 때였군요.", present: "방해 요소가 있어도 사랑을 지키세요.", future: "결국 당신의 의지가 사랑을 지켜요." }, money: { past: "지출을 막기 위해 애썼었네요.", present: "나가는 돈을 철저히 단속해야 해요.", future: "당신의 자산을 안전하게 지킬 거예요." }, work: { past: "밀려드는 업무를 잘 소화했었군요.", present: "도전에 맞서 당신의 자리를 지키세요.", future: "어려운 상황을 이겨내고 성공해요." } }
    },
    {
        id: 29, name: "Eight of Wands", nameKr: "완드 8번", keywords: ["속도", "급진전", "소식"],
        todayAdvice: "상황이 매우 빠르게 전개되거나 반가운 소식이 찾아올 수 있는 날입니다. 기회가 왔을 때 신속하게 움직이세요.",
        interpretations: { love: "빠른 발전, 갑작스런 고백", money: "빠른 자금 회전, 단기 이익", work: "신속한 처리, 출장", reversed: "조절 실패, 지연" },
        advice: { love: { past: "관계가 눈부시게 빨리 변했었군요.", present: "지금 기회가 왔으니 빨리 움직이세요.", future: "기다리던 사랑의 소식이 올 거예요." }, money: { past: "돈이 아주 빨리 돌았던 시기네요.", present: "신속한 판단이 수익을 가져다줘요.", future: "금전적 행운이 빠르게 찾아올 거예요." }, work: { past: "업무 처리가 매우 빨랐었군요.", present: "흐름을 탔을 때 일을 몰아치세요.", future: "진행하는 프로젝트가 속도를 내요." } }
    },
    {
        id: 30, name: "Nine of Wands", nameKr: "완드 9번", keywords: ["경계", "인내", "마무리"],
        todayAdvice: "목표를 코앞에 두고 마지막 고비가 찾아온 듯한 하루입니다. 조금만 더 인내하며 끝까지 방심하지 마세요.",
        interpretations: { love: "상처 극복, 경계", money: "위기 대비, 자금 관리", work: "마지막 고비, 체력 소모", reversed: "체력 고갈, 방어 상실" },
        advice: { love: { past: "과거 상처로 마음을 닫았었군요.", present: "조금 힘들어도 관계를 포기 마세요.", future: "고난을 이겨내고 사랑을 완성해요." }, money: { past: "돈 문제로 긴장을 많이 했었네요.", present: "마지막까지 지갑 단속을 잘 하세요.", future: "위기를 잘 넘기고 안정을 찾을 거예요." }, work: { past: "거의 다 온 일을 마무리 중이었군요.", present: "끝까지 긴장을 늦추지 말고 해보세요.", future: "지쳤던 몸과 마음이 보상을 받을 거예요." } }
    },
    {
        id: 31, name: "Ten of Wands", nameKr: "완드 10번", keywords: ["압박", "과부하", "책임"],
        todayAdvice: "책임감이 너무 무거워 몸과 마음이 지칠 수 있는 날입니다. 모든 것을 혼자 짊어지려 하지 말고 주변에 도움을 요청하세요.",
        interpretations: { love: "부담스런 관계, 헌신", money: "금전적 중압감, 부채", work: "업무 과다, 번아웃 주의", reversed: "부담 해소, 붕괴" },
        advice: { love: { past: "혼자 모든 걸 짊어졌던 사랑이네요.", present: "상대와 짐을 나누어 지는 게 좋겠어요.", future: "무거웠던 책임감을 곧 내려놓게 돼요." }, money: { past: "돈 때문에 어깨가 무거웠었군요.", present: "지출 구조를 단순하게 만들어 보세요.", future: "재정적인 압박에서 조만간 벗어나요." }, work: { past: "너무 열심히 해서 몸이 상했었네요.", present: "모든 일을 혼자 다 하려 하지 마세요.", future: "일의 효율을 찾고 여유가 생길 거예요." } }
    },
    {
        id: 32, name: "Page of Wands", nameKr: "완드 시종", keywords: ["소식", "호기심", "시작"],
        todayAdvice: "새로운 프로젝트나 흥미로운 제안이 들어올 수 있습니다. 어린아이 같은 호기심과 열정으로 도전을 시작해 보세요.",
        interpretations: { love: "새 인연 예고, 호기심", money: "작은 제안, 정보 수집", work: "열정적인 시작, 학습", reversed: "미숙, 나쁜 소식" },
        advice: { love: { past: "풋풋한 설렘이 있었던 때였군요.", present: "새로운 인연에게 호기심을 가져보세요.", future: "가슴 뛰는 연애 소식이 들려올 거예요." }, money: { past: "작은 소식에 돈을 투자했었네요.", present: "새로운 부업이나 공부를 해보세요.", future: "작은 수익이 나중엔 큰 도움이 돼요." }, work: { past: "신입의 마음으로 일을 배웠었군요.", present: "열정적으로 새로운 업무에 도전하세요.", future: "당신의 열정을 인정받게 될 거예요." } }
    },
    {
        id: 33, name: "Knight of Wands", nameKr: "완드 기사", keywords: ["에너지", "모험", "돌진"],
        todayAdvice: "넘치는 에너지를 주체할 수 없는 활기찬 하루입니다. 모험심을 발휘하여 과감하게 추진력을 발휘해 보세요.",
        interpretations: { love: "불같은 사랑, 돌진", money: "과감한 시도, 지출", work: "추진력, 해외 도전", reversed: "무모함, 중도 포기" },
        advice: { love: { past: "뜨겁게 타올랐던 사랑이 있었군요.", present: "자신 있게 당신의 마음을 고백하세요.", future: "정열적인 사랑이 당신에게 달려와요." }, money: { past: "공격적인 투자로 재미를 봤었네요.", present: "지금은 빠른 자금 회전이 필요해요.", future: "금전적 기회를 향해 돌진할 때예요." }, work: { past: "전국을 누비며 열심히 일했었군요.", present: "추진력 있게 프로젝트를 이끄세요.", future: "도전적인 과제에서 성공을 거둬요." } }
    },
    {
        id: 34, name: "Queen of Wands", nameKr: "완드 여왕", keywords: ["자신감", "매력", "활력"],
        todayAdvice: "당신의 매력과 카리스마가 최고조에 달하는 날입니다. 주변 사람들을 활기차게 이끌며 주인공이 되어 보세요.",
        interpretations: { love: "매력 발산, 주도적 관계", money: "풍요로운 관리, 재력", work: "카리스마 리더십, 사업", reversed: "질투, 변덕" },
        advice: { love: { past: "매력이 넘쳐 인기가 많았었군요.", present: "당당하게 관계를 이끌어 가보세요.", future: "매력적인 여왕처럼 사랑받게 돼요." }, money: { past: "돈 관리에 자신이 넘쳤었네요.", present: "당신의 직관을 믿고 투자해 보세요.", future: "재정적으로 매우 넉넉한 시기가 와요." }, work: { past: "주변을 활기차게 이끌었었군요.", present: "창의적인 리더십을 발휘할 때예요.", future: "사업적인 성과가 눈부시게 빛나요." } }
    },
    {
        id: 35, name: "King of Wands", nameKr: "완드 왕", keywords: ["비전", "권위", "성취"],
        todayAdvice: "강한 비전과 결단력이 필요한 날입니다. 당신의 직관을 믿고 큰 그림을 그리며 목표를 향해 나아가세요.",
        interpretations: { love: "듬직한 리드, 책임", money: "큰 규모 수익, 자산가", work: "비즈니스 정점, 지도자", reversed: "독재적 태도, 판단 착오" },
        advice: { love: { past: "책임감 있는 연애를 했었군요.", present: "상대에게 미래의 비전을 제시하세요.", future: "존경받는 사랑의 주인공이 될 거예요." }, money: { past: "큰 안목으로 부를 쌓았었네요.", present: "대담한 투자 전략을 세워보세요.", future: "금전적으로 강력한 힘을 갖게 돼요." }, work: { past: "성공적인 리더로 일했었군요.", present: "당신의 직관과 결단력을 믿으세요.", future: "업계에서 최고의 자리에 오를 거예요." } }
    }
];

// --- 3. CUPS (36 - 49) ---
const CUPS: TarotCard[] = [
    {
        id: 36, name: "Ace of Cups", nameKr: "컵 에이스", keywords: ["감정", "사랑", "영감"],
        todayAdvice: "마음속에서 따뜻한 감정이 샘솟는 축복 같은 하루입니다. 사랑하는 사람들에게 당신의 진심을 전해 보세요.",
        interpretations: { love: "사랑 시작, 행복", money: "횡재수, 만족", work: "창의성 발휘, 조화", reversed: "감정 메마름" },
        advice: { love: { past: "순수한 사랑이 넘치던 때였군요.", present: "마음의 문을 열고 감정을 표현하세요.", future: "축복 같은 새로운 인연을 만나요." }, money: { past: "돈보다 마음이 풍요로웠었네요.", present: "기분 좋은 횡재를 기대해 보세요.", future: "금전적인 만족감이 아주 커질 거예요." }, work: { past: "영감이 넘쳐 일이 잘 됐었군요.", present: "동료와 정서적으로 소통해 보세요.", future: "예술적인 창의성이 폭발할 시기예요." } }
    },
    {
        id: 37, name: "Two of Cups", nameKr: "컵 2번", keywords: ["결합", "우정", "파트너십"],
        todayAdvice: "마음이 딱 맞는 상대를 만나 깊은 소통을 나눌 수 있는 날입니다. 서로의 눈을 맞추며 신뢰를 쌓아보세요.",
        interpretations: { love: "깊은 소통, 마음 일치", money: "유리한 계약, 협동", work: "조화로운 파트너십", reversed: "불통, 결별" },
        advice: { love: { past: "마음이 딱 맞는 사랑을 했었군요.", present: "상대와 깊은 대화를 나누어 보세요.", future: "운명적인 파트너와 결합하게 돼요." }, money: { past: "협력하여 수익을 냈던 때였네요.", present: "믿을만한 사람과 손을 잡아보세요.", future: "유리한 금전적 계약이 성사될 거예요." }, work: { past: "팀워크가 아주 좋았었군요.", present: "동료와 호흡을 맞추는 데 힘쓰세요.", future: "완벽한 조력자를 만나 일을 성공해요." } }
    },
    {
        id: 38, name: "Three of Cups", nameKr: "컵 3번", keywords: ["축하", "화합", "친구"],
        todayAdvice: "좋은 사람들과 함께 어울려 축하할 일이 생기는 즐거운 날입니다. 오늘만큼은 걱정을 잊고 행복을 만끽하세요.",
        interpretations: { love: "기쁜 모임, 즐거운 연애", money: "지인 도움, 경사", work: "팀 성공, 회식", reversed: "과도한 유흥" },
        advice: { love: { past: "친구처럼 즐겁게 만났었군요.", present: "사람들과 어울려 행복을 나누세요.", future: "사랑이 가득한 축하 자리가 생겨요." }, money: { past: "지인 덕분에 돈이 들어왔었네요.", present: "인맥을 잘 활용하면 수익이 생겨요.", future: "금전적인 경사가 집안에 들 것임." }, work: { past: "다 같이 성공을 누렸었군요.", present: "팀워크를 다지는 자리를 만드세요.", future: "프로젝트 성공을 함께 기뻐할 거예요." } }
    },
    {
        id: 39, name: "Four of Cups", nameKr: "컵 4번", keywords: ["권태", "무관심", "성찰"],
        todayAdvice: "주변의 제안에 무관심해지거나 연애가 따분하게 느껴질 수 있습니다. 마음을 가라앉히고 진짜 원하는 것을 찾아보세요.",
        interpretations: { love: "지루함, 기회 외면", money: "수익 거절, 매너리즘", work: "의욕 상실, 제자리걸음", reversed: "새로운 관심" },
        advice: { love: { past: "연애가 따분하게 느껴졌었군요.", present: "주변의 새로운 사랑을 돌아보세요.", future: "권태를 깨는 새로운 자극이 와요." }, money: { past: "돈에 대해 무심했던 시기였네요.", present: "눈앞의 제안을 무시하지 마세요.", future: "새로운 투자처가 서서히 보일 거예요." }, work: { past: "일에 흥미를 잃었었군요.", present: "내면을 성찰하며 새로움을 찾으세요.", future: "다시 열정을 불태울 일이 생겨요." } }
    },
    {
        id: 40, name: "Five of Cups", nameKr: "컵 5번", keywords: ["상실", "슬픔", "후회"],
        todayAdvice: "지나간 일에 대한 후회나 실망감이 찾아올 수 있습니다. 하지만 고개를 들어보세요. 당신 곁에는 여전히 소중한 것이 남아 있습니다.",
        interpretations: { love: "이별 슬픔, 실망", money: "투자 손실, 미련", work: "결과 실망, 고독", reversed: "회복, 희망 발견" },
        advice: { love: { past: "상처받아 많이 울었었군요.", present: "잃은 것보다 남은 사랑을 보세요.", future: "슬픔을 딛고 더 단단한 사랑을 해요." }, money: { past: "투자 실패로 속상했었네요.", present: "후회하지 말고 다음을 준비하세요.", future: "금전적인 상처가 서서히 아물 거예요." }, work: { past: "성과가 없어 실망했었군요.", present: "실패에서 교훈을 얻는 게 중요해요.", future: "다시 일어설 힘과 기회를 얻게 돼요." } }
    },
    {
        id: 41, name: "Six of Cups", nameKr: "컵 6번", keywords: ["추억", "순수", "재회"],
        todayAdvice: "순수했던 어린 시절이나 옛 추억이 떠오르는 몽글몽글한 하루입니다. 그리운 인연에게 먼저 안부를 물어보는 건 어떨까요?",
        interpretations: { love: "옛 사랑 재회, 동심", money: "과거 유산, 조력", work: "익숙한 일, 과거 인맥", reversed: "과거 집착" },
        advice: { love: { past: "순수했던 사랑이 그리웠었군요.", present: "옛 인연에게 연락이 올 수도 있어요.", future: "과거의 소중한 사람이 나타날 거예요." }, money: { past: "예전부터 알던 곳에서 돈이 옴.", present: "과거의 경험을 투자에 활용해 보세요.", future: "기분 좋은 금전적 혜택을 받게 돼요." }, work: { past: "익숙한 업무를 처리했었군요.", present: "옛 동료의 도움을 받아보세요.", future: "당신을 아는 곳에서 좋은 제안이 와요." } }
    },
    {
        id: 42, name: "Seven of Cups", nameKr: "컵 7번", keywords: ["환상", "망상", "선택장애"],
        todayAdvice: "현실성 없는 상상이나 수많은 선택지 앞에서 혼란스러울 수 있습니다. 구름 위를 걷기보다 발을 땅에 딛고 우선순위를 정하세요.",
        interpretations: { love: "현실 없는 상상, 유혹", money: "뜬구름 투자, 허황", work: "계획만 무성, 비실천", reversed: "현실 직시" },
        advice: { love: { past: "상대를 너무 미화했었군요.", present: "꿈에서 깨어나 현실을 똑바로 보세요.", future: "복잡한 생각 끝에 진짜 사랑을 찾아요." }, money: { past: "일확천금을 꿈꿨던 적이 있네요.", present: "실현 가능한 수익에만 집중하세요.", future: "허황된 욕심을 버리고 안정을 찾아요." }, work: { past: "말만 앞서고 행동이 없었었군요.", present: "우선순위를 정해서 하나만 파세요.", future: "가장 실속 있는 선택을 하게 될 거예요." } }
    },
    {
        id: 43, name: "Eight of Cups", nameKr: "컵 8번", keywords: ["떠남", "포기", "여정"],
        todayAdvice: "정들었던 상황이나 사람을 뒤로하고 새로운 가치를 찾아 떠나야 할 때입니다. 아쉬움은 남겠지만 더 큰 성장을 위한 여정입니다.",
        interpretations: { love: "관계 정리, 미련 없음", money: "수익 포기, 새로운 가치", work: "이직 고민, 진로 변경", reversed: "회귀, 포기 안 함" },
        advice: { love: { past: "미련 없이 사랑을 끝냈었군요.", present: "마음이 떠났다면 새 길을 가세요.", future: "더 높은 가치의 사랑을 찾아 떠나요." }, money: { past: "돈보다 의미를 찾았던 때네요.", present: "수익 없는 일은 이제 그만두세요.", future: "욕심을 버리니 마음이 한결 편해져요." }, work: { past: "발전이 없어 일을 그만뒀었군요.", present: "현재에 안주하지 말고 도전해 보세요.", future: "당신을 성장시킬 새 터전을 찾아요." } }
    },
    {
        id: 44, name: "Nine of Cups", nameKr: "컵 9번", keywords: ["만족", "소원 성취", "안락"],
        todayAdvice: "바라던 소망이 이루어지고 마음 깊은 곳에서 만족감을 느끼는 날입니다. 당신의 성취를 스스로 충분히 축하해 주세요.",
        interpretations: { love: "사랑 만족, 소원 성취", money: "풍족한 생활, 자부심", work: "목표 달성, 자만심 주의", reversed: "탐욕, 자기중심적" },
        advice: { love: { past: "바라던 사랑을 얻었었군요.", present: "현재의 행복을 마음껏 즐겨보세요.", future: "당신의 연애 소망이 이루어질 거예요." }, money: { past: "돈 걱정 없이 풍족했었네요.", present: "경제적인 여유를 스스로 칭찬하세요.", future: "재정적인 만족감이 최고조에 달해요." }, work: { past: "목표한 바를 다 이뤘었군요.", present: "성과에 대해 자부심을 가지세요.", future: "업계에서 부러움을 사는 성공을 해요." } }
    },
    {
        id: 45, name: "Ten of Cups", nameKr: "컵 10번", keywords: ["행복", "가족애", "완성"],
        todayAdvice: "가장 소중한 사람들과 완벽한 행복을 누리는 날입니다. 사랑과 평화가 가득한 환경에서 따뜻한 안식을 취하세요.",
        interpretations: { love: "결혼, 최고의 행복", money: "가문의 부, 평화", work: "팀 화합, 완벽한 성과", reversed: "가정 불화, 조화 상실" },
        advice: { love: { past: "무척이나 행복한 연애를 했었군요.", present: "사랑하는 이들과 시간을 보내세요.", future: "영원히 함께할 가정을 꾸리게 돼요." }, money: { past: "집안이 금전적으로 평온했었네요.", present: "안정된 수입에 감사하며 사세요.", future: "재정적으로 완벽한 행복을 맛봐요." }, work: { past: "팀원들과 한마음으로 일했었군요.", present: "조화로운 업무 환경을 만드세요.", future: "모두가 만족할 큰 성취를 이뤄요." } }
    },
    {
        id: 46, name: "Page of Cups", nameKr: "컵 시종", keywords: ["제안", "호기심", "감수성"],
        todayAdvice: "순수한 호기심과 풍부한 감수성이 당신을 새로운 기회로 이끕니다. 로맨틱한 소식이나 창의적인 아이디어가 찾아옵니다.",
        interpretations: { love: "새 인연, 감성적 접근", money: "기분 좋은 소식, 작은 이득", work: "창의적 아이디어, 예술", reversed: "감정 과잉, 유치함" },
        advice: { love: { past: "감수성이 풍부했던 시기였군요.", present: "순수한 마음으로 상대를 대해보세요.", future: "로맨틱한 고백을 받게 될 거예요." }, money: { past: "기분 좋은 돈이 들어왔었네요.", present: "직관에 따라 투자를 해보는 건 어때요?", future: "기분 좋은 작은 행운이 찾아올 거예요." }, work: { past: "예술적인 일을 하고 싶었었군요.", present: "새로운 아이디어를 제안해 보세요.", future: "당신의 감각이 업무에 도움이 돼요." } }
    },
    {
        id: 47, name: "Knight of Cups", nameKr: "컵 기사", keywords: ["로맨티스트", "제안", "평화"],
        todayAdvice: "달콤하고 매력적인 제안이 당신을 설레게 할 수 있는 날입니다. 품격 있는 태도로 다가오는 인연을 반겨주세요.",
        interpretations: { love: "로맨틱 연애, 프러포즈", money: "도움 되는 제안, 금전 소식", work: "중재자 역할, 부드러운 전진", reversed: "사기성 제안, 변덕" },
        advice: { love: { past: "매력적인 구애를 받았었군요.", present: "부드럽게 당신의 마음을 전하세요.", future: "매력적인 연인이 당신에게 다가와요." }, money: { past: "좋은 투자 제안이 있었네요.", present: "기분 좋은 수익 소식을 기대하세요.", future: "금전적으로 유리한 소식이 올 거예요." }, work: { past: "중재를 잘 해서 일이 풀렸었군요.", present: "품격 있게 일을 처리하는 게 좋아요.", future: "협상에서 당신이 주도권을 잡게 돼요." } }
    },
    {
        id: 48, name: "Queen of Cups", nameKr: "컵 여왕", keywords: ["자애", "직관", "공감"],
        todayAdvice: "자애로운 마음과 예민한 직관이 빛나는 하루입니다. 주변 사람들의 아픔을 어루만져 주며 따뜻한 사랑을 나누세요.",
        interpretations: { love: "깊은 모성애, 따뜻한 연애", money: "직관적 소비, 조력", work: "경청하는 리더, 예술적 성과", reversed: "감정 기복, 과도한 의존" },
        advice: { love: { past: "포용력 있게 사랑을 했었군요.", present: "따뜻한 공감으로 상대를 대하세요.", future: "정서적으로 아주 깊은 사랑을 해요." }, money: { past: "마음이 가는 곳에 돈을 썼었네요.", present: "주변을 돌보는 데 돈을 써보세요.", future: "당신의 선의가 큰 복으로 돌아와요." }, work: { past: "동료의 말을 잘 들어줬었군요.", present: "당신의 직관을 믿고 업무를 하세요.", future: "감수성이 필요한 일에서 대성공해요." } }
    },
    {
        id: 49, name: "King of Cups", nameKr: "컵 왕", keywords: ["평정", "현명", "관대"],
        todayAdvice: "감정의 파도를 평온하게 다스릴 줄 아는 성숙한 하루입니다. 지혜롭고 관대한 리더십으로 사람들의 신뢰를 얻으세요.",
        interpretations: { love: "성숙한 사랑, 평온한 관계", money: "현명한 지출, 금전적 안정", work: "노련한 리더, 감정 조절", reversed: "교활, 감정 폭발" },
        advice: { love: { past: "성숙하게 관계를 이끌었었군요.", present: "감정을 잘 다스리며 상대를 대하세요.", future: "지혜롭고 평온한 사랑이 지속돼요." }, money: { past: "돈 관리를 아주 현명하게 했었네요.", present: "여유를 가지고 자금을 운용하세요.", future: "재정적으로 매우 안정된 상태가 돼요." }, work: { past: "침착하게 일해서 성공했었군요.", present: "냉철함과 따뜻함을 동시에 갖추세요.", future: "업계에서 존경받는 리더가 될 거예요." } }
    }
];

// --- 4. SWORDS (50 - 63) ---
const SWORDS: TarotCard[] = [
    {
        id: 50, name: "Ace of Swords", nameKr: "검 에이스", keywords: ["결단", "돌파", "명확"],
        todayAdvice: "막혔던 고민이 시원하게 풀리고 새로운 돌파구가 보이는 날입니다. 명확한 결단력으로 상황을 주도하세요.",
        interpretations: { love: "이성적 정리, 명확한 관계", money: "단호한 결정, 투자 승부수", work: "난제 해결, 새로운 계획", reversed: "판단 착오, 혼란" },
        advice: { love: { past: "단호하게 마음을 정했었군요.", present: "애매한 태도를 버리고 결단하세요.", future: "오해가 뚫리고 진실이 보일 거예요." }, money: { past: "확실한 판단으로 돈을 지켰었네요.", present: "객관적인 정보로 수익을 내보세요.", future: "금전적인 문제가 명쾌하게 풀려요." }, work: { past: "어려운 과제를 잘 해결했었군요.", present: "날카로운 판단력으로 승부하세요.", future: "당신의 능력이 돌파구를 만들 거예요." } }
    },
    {
        id: 51, name: "Two of Swords", nameKr: "검 2번", keywords: ["교착", "선택 보류", "균형"],
        todayAdvice: "두 가지 선택지 사이에서 팽팽한 균형을 유지해야 하는 날입니다. 아직은 때가 아니니 눈을 가리고 내면을 먼저 살피세요.",
        interpretations: { love: "결정장애, 마음 닫음", money: "자금 융통 보류, 평팽함", work: "딜레마, 갈등 지연", reversed: "정보 과잉, 결정 강요" },
        advice: { love: { past: "결정을 못 해 고민이 많았었군요.", present: "눈을 가리지 말고 진실을 보세요.", future: "갈등이 끝나고 선택의 순간이 와요." }, money: { past: "돈 문제로 팽팽하게 맞섰었네요.", present: "지금은 결정을 잠시 미뤄도 좋아요.", future: "둘 중 하나를 택해야 할 때가 와요." }, work: { past: "어느 쪽도 택하기 힘들었었군요.", present: "내면의 평화를 찾고 분석해 보세요.", future: "막혔던 상황이 서서히 풀릴 거예요." } }
    },
    {
        id: 52, name: "Three of Swords", nameKr: "검 3번", keywords: ["상처", "슬픔", "단절"],
        todayAdvice: "예상치 못한 말이나 행동으로 마음이 아플 수 있는 날입니다. 고통스러운 진실이라도 담담하게 받아들이고 상처를 보듬어 주세요.",
        interpretations: { love: "심적 고통, 이별, 말다툼", money: "금전적 손실, 배신 주의", work: "비난, 스트레스, 계약 파기", reversed: "상처 치유, 고통의 끝" },
        advice: { love: { past: "사랑 때문에 마음이 많이 아팠군요.", present: "슬픈 진실을 담담하게 받아들이세요.", future: "아픔을 딛고 더 단단해질 거예요." }, money: { past: "돈 때문에 배신감을 느꼈었네요.", present: "손실을 인정하고 마음을 추스르세요.", future: "금전적인 상처가 서서히 아물 거예요." }, work: { past: "일 때문에 스트레스가 컸었군요.", present: "냉정하게 상황을 직시해야 해요.", future: "비 온 뒤 땅이 굳듯 좋아질 거예요." } }
    },
    {
        id: 53, name: "Four of Swords", nameKr: "검 4번", keywords: ["휴식", "회복", "정지"],
        todayAdvice: "활동을 멈추고 에너지를 충전해야 하는 명상의 시간입니다. 지친 몸과 마음을 쉬게 하며 다음을 위한 평온을 찾으세요.",
        interpretations: { love: "연애 휴식기, 거리 두기", money: "자금 정체, 관망 시기", work: "업무 일시 정지, 번아웃", reversed: "활동 재개, 휴식 끝" },
        advice: { love: { past: "사랑에 지쳐 쉬고 싶었었군요.", present: "잠시 거리를 두고 혼자 있어 보세요.", future: "에너지를 충전한 뒤 다시 시작해요." }, money: { past: "돈을 쓰지 않고 지켜봤었네요.", present: "지금은 투자를 멈추고 쉬어야 해요.", future: "자금 흐름이 다시 돌기 시작해요." }, work: { past: "일에 지쳐 쉬었던 적이 있군요.", present: "명상이나 휴식으로 몸을 돌보세요.", future: "다시 활기차게 일할 날이 올 거예요." } }
    },
    {
        id: 54, name: "Five of Swords", nameKr: "검 5번", keywords: ["비겁한 승리", "패배감", "불화"],
        todayAdvice: "이기고도 기분이 좋지 않은 상처뿐인 승리가 생길 수 있습니다. 누군가를 비난하기보다 관계의 회복에 더 힘을 쏟으세요.",
        interpretations: { love: "상처뿐인 승리, 비겁함", money: "부정한 이득 주의, 손실", work: "신뢰 상실, 비난, 고립", reversed: "화해 시도, 갈등 종료" },
        advice: { love: { past: "싸워서 이겨도 마음이 안 좋았군요.", present: "이기려만 하지 말고 상대를 보세요.", future: "갈등을 멈추고 화해의 길을 찾아요." }, money: { past: "수단 방법을 안 가렸었네요.", present: "부정한 이익은 나중에 독이 돼요.", future: "정직하게 벌어야 부가 유지돼요." }, work: { past: "주변을 적으로 만들었었군요.", present: "비난을 겸허히 받아들이고 고치세요.", future: "신뢰를 회복하는 게 급선무예요." } }
    },
    {
        id: 55, name: "Six of Swords", nameKr: "검 6번", keywords: ["이동", "회복 중", "해결"],
        todayAdvice: "힘들었던 상황을 뒤로하고 조금 더 평온한 곳으로 서서히 이동하는 날입니다. 고비는 넘겼으니 안심하고 나아가세요.",
        interpretations: { love: "갈등 극복, 평온한 이동", money: "상황 호전, 부채 해결 중", work: "문제 국면 전환, 이직", reversed: "문제 회귀, 지연" },
        advice: { love: { past: "힘든 시간을 지나왔었군요.", present: "조금 더 평온한 곳으로 나아가세요.", future: "안정적인 사랑의 항구에 도착해요." }, money: { past: "돈 문제를 서서히 풀어왔었네요.", present: "상황이 좋아지고 있으니 힘내세요.", future: "금전적 어려움에서 완전히 벗어나요." }, work: { past: "일을 해결하려 애썼었군요.", present: "새로운 환경으로 옮겨보는 건 어때요?", future: "더 나은 직장이나 업무를 맡게 돼요." } }
    },
    {
        id: 56, name: "Seven of Swords", nameKr: "검 7번", keywords: ["기만", "은밀함", "책임 회피"],
        todayAdvice: "솔직하지 못한 태도가 나중에 화를 부를 수 있는 날입니다. 요행을 바라거나 책임을 회피하기보다 정공법을 택하세요.",
        interpretations: { love: "솔직하지 못함, 숨김", money: "편법 투자 주의, 도난", work: "잔머리, 기만적인 성과", reversed: "고백, 비밀 폭로" },
        advice: { love: { past: "상대에게 무언가 숨겼었군요.", present: "속임수는 관계를 망칠 수 있어요.", future: "진실을 밝히고 떳떳해져야 해요." }, money: { past: "편법으로 이득을 보려 했었네요.", present: "요행을 바라지 말고 정직하게 사세요.", future: "숨겼던 돈 문제가 드러날 수 있어요." }, work: { past: "책임을 피하려고만 했었군요.", present: "정공법으로 문제를 해결해 보세요.", future: "잔꾀가 아닌 실력으로 승부하세요." } }
    },
    {
        id: 57, name: "Eight of Swords", nameKr: "검 8번", keywords: ["속박", "무력감", "제약"],
        todayAdvice: "스스로 만든 틀에 갇혀 무력감을 느끼기 쉬운 날입니다. 눈을 가린 안대를 벗기만 하면 자유의 길이 바로 앞에 있습니다.",
        interpretations: { love: "자신을 가둔 사랑, 제약", money: "자금 묶임, 곤경", work: "환경 탓, 사고의 정체", reversed: "속박 해제, 돌파" },
        advice: { love: { past: "사랑에 눈이 멀어 갇혔었군요.", present: "스스로 만든 틀에서 걸어 나오세요.", future: "자유를 찾고 더 넓은 세상을 봐요." }, money: { past: "돈 때문에 꼼짝 못 했었네요.", present: "상황을 비관만 하지 말고 찾으세요.", future: "막혔던 자금 줄이 곧 풀릴 거예요." }, work: { past: "스스로 한계를 정했었군요.", present: "안대를 벗고 진실된 기회를 보세요.", future: "답답한 상황을 뚫고 성공할 거예요." } }
    },
    {
        id: 58, name: "Nine of Swords", nameKr: "검 9번", keywords: ["악몽", "불안", "과도한 걱정"],
        todayAdvice: "불안함과 과도한 걱정으로 잠 못 이루는 괴로운 날일 수 있습니다. 하지만 걱정의 실체는 당신의 상상일 뿐이니 마음을 다스리세요.",
        interpretations: { love: "불면증, 의심, 걱정", money: "금전 스트레스, 불안", work: "실수 압박, 정신적 고통", reversed: "불안 해소, 직면" },
        advice: { love: { past: "밤잠 설칠 정도로 걱정했었군요.", present: "마음속 괴물은 실체가 없어요.", future: "불안함이 사라지고 평온해질 거예요." }, money: { past: "돈 걱정에 밤을 지새웠었네요.", present: "최악의 상황은 머릿속에만 있어요.", future: "재정적 공포에서 곧 벗어날 거예요." }, work: { past: "일 때문에 너무 괴로웠었군요.", present: "압박감을 내려놓고 마음을 쉬세요.", future: "문제의 핵심을 보고 해결하게 돼요." } }
    },
    {
        id: 59, name: "Ten of Swords", nameKr: "검 10번", keywords: ["파국", "끝", "바닥"],
        todayAdvice: "바닥을 치는 힘든 상황이 마무리되는 고통의 끝자락입니다. 이제 더 나빠질 곳은 없으니 다시 일어설 준비를 하세요.",
        interpretations: { love: "이별, 상처의 끝", money: "완전한 파산, 손실 끝", work: "프로젝트 종료, 실패", reversed: "회복의 시작, 새로운 날" },
        advice: { love: { past: "바닥까지 가는 이별을 했었군요.", present: "이제 더 나빠질 수 없으니 웃으세요.", future: "고통이 끝나고 새 태양이 떠올라요." }, money: { past: "금전적으로 완전히 망했었네요.", present: "미련을 버리고 0에서 시작해 보세요.", future: "새로운 부를 쌓을 날이 올 거예요." }, work: { past: "일이 완전히 수포로 돌아갔었군요.", present: "완벽한 끝은 완벽한 시작을 뜻해요.", future: "이전과는 다른 새 길이 열릴 거예요." } }
    },
    {
        id: 60, name: "Page of Swords", nameKr: "검 시종", keywords: ["경계", "관찰", "소식"],
        todayAdvice: "주변 상황을 예리하게 관찰하고 정보를 수집해야 하는 기민한 날입니다. 경계심을 늦추지 말고 다가올 소식을 기다리세요.",
        interpretations: { love: "탐색 중, 미숙한 고백", money: "정보 수집, 신중한 투자", work: "예리한 판단, 새로운 정보", reversed: "성급함, 비난" },
        advice: { love: { past: "상대를 몰래 관찰했었군요.", present: "예리하게 상황을 지켜봐야 해요.", future: "궁금했던 사랑의 소식이 올 거예요." }, money: { past: "돈 정보를 열심히 모았었네요.", present: "투명하지 않은 곳은 주의하세요.", future: "금전적 정보를 잘 활용하게 돼요." }, work: { past: "일머리가 좋다는 말을 들었군요.", present: "주변 상황을 잘 살피며 일하세요.", future: "당신의 관찰력이 큰 도움이 돼요." } }
    },
    {
        id: 61, name: "Knight of Swords", nameKr: "검 기사", keywords: ["돌진", "급함", "논리적 공격"],
        todayAdvice: "목표를 향해 거침없이 달려가는 속도감이 느껴지는 하루입니다. 하지만 성급한 말 한마디가 화를 부를 수 있으니 주의하세요.",
        interpretations: { love: "성급한 구애, 말다툼", money: "신속한 투자, 위험", work: "추진력, 독단적 처리", reversed: "무모함, 중도 좌절" },
        advice: { love: { past: "성격 급하게 다가갔었군요.", present: "말 한마디로 상처 주지 않게 하세요.", future: "사랑을 향해 용기 있게 달려가요." }, money: { past: "돈을 위해 빠르게 움직였었네요.", present: "속도도 좋지만 방향이 중요해요.", future: "단호한 투자 결정이 수익을 내요." }, work: { past: "거침없이 일을 처리했었군요.", present: "분석보다는 실행이 필요한 때예요.", future: "목표를 향해 강력하게 전진하세요." } }
    },
    {
        id: 62, name: "Queen of Swords", nameKr: "검 여왕", keywords: ["독립", "냉철", "판단력"],
        todayAdvice: "독립적이고 냉철한 판단력이 돋보이는 날입니다. 감정에 휘둘리지 말고 공과 사를 명확히 구분하여 실속을 챙기세요.",
        interpretations: { love: "공사 구분, 냉정함", money: "철저한 관리, 낭비 없음", work: "전문가 포스, 분석적 리더", reversed: "비정함, 독설" },
        advice: { love: { past: "혼자서도 잘 지내는 편이었군요.", present: "감정보다 머리로 사랑을 보세요.", future: "지혜롭고 독립적인 연애를 해요." }, money: { past: "돈 관리가 아주 엄격했었네요.", present: "낭비를 줄이고 실속을 챙기세요.", future: "재정적으로 아주 단단해질 거예요." }, work: { past: "일을 똑 부러지게 했었군요.", present: "비평가적인 시각으로 일을 보세요.", future: "업계에서 권위자로 대우받을 것임." } }
    },
    {
        id: 63, name: "King of Swords", nameKr: "검 왕", keywords: ["지성", "전략", "이성"],
        todayAdvice: "전략적이고 이성적인 사고가 필요한 날입니다. 객관적인 사실을 근거로 당당하게 사람들을 설득하고 리드해 보세요.",
        interpretations: { love: "지적 교감, 엄격한 관계", money: "체계적 자산, 윤리", work: "전략적 리더, 공정", reversed: "아집, 잔인함" },
        advice: { love: { past: "성숙한 대화를 원했었군요.", present: "논리적으로 상대와 소통해 보세요.", future: "신뢰할 수 있는 리더와 사랑을 해요." }, money: { past: "돈을 계획적으로 불려왔었네요.", present: "이성적인 전략이 필요한 시점이에요.", future: "재정적인 질서가 완벽히 잡혀요." }, work: { past: "전략적으로 조직을 이끌었었군요.", present: "객관적인 사실로 사람들을 설득하세요.", future: "최고의 전략가로 인정받게 돼요." } }
    }
];

// --- 5. PENTACLES (64 - 77) ---
const PENTACLES: TarotCard[] = [
    {
        id: 64, name: "Ace of Pentacles", nameKr: "펜타클 에이스", keywords: ["결실", "번영", "기회"],
        todayAdvice: "실질적인 이득이나 새로운 번영의 기회가 찾아오는 길한 날입니다. 당신의 가치를 증명할 확실한 기회를 놓치지 마세요.",
        interpretations: { love: "안정적 연애, 선물", money: "수익 발생, 풍요", work: "기회 포착, 실질적 성과", reversed: "기회 상실, 손실" },
        advice: { love: { past: "기반이 튼튼한 사랑을 했었군요.", present: "실질적인 도움을 상대에게 주세요.", future: "행복하고 풍요로운 연애가 시작돼요." }, money: { past: "돈 벌 기회를 잘 잡았었네요.", present: "눈앞의 이익을 확실하게 잡으세요.", future: "큰 재산이 들어올 문이 열릴 거예요." }, work: { past: "성실하게 일해서 성과를 냈었군요.", present: "당신의 가치를 돈으로 증명하세요.", future: "실질적인 보상을 받게 될 거예요." } }
    },
    {
        id: 65, name: "Two of Pentacles", nameKr: "펜타클 2번", keywords: ["균형", "유연성", "변동"],
        todayAdvice: "여러 가지 일을 동시에 조율해야 하는 바쁜 하루입니다. 유연한 태도로 균형을 잘 맞춘다면 무리 없이 소화할 수 있습니다.",
        interpretations: { love: "일과 사랑 조율, 변동", money: "자금 융통, 유동성", work: "멀티태스킹, 적응력", reversed: "관리 불능, 불균형" },
        advice: { love: { past: "두 가지를 다 잡으려 애썼었군요.", present: "유연하게 상황에 대처해 보세요.", future: "변화 속에서도 즐거운 연애를 해요." }, money: { past: "돈을 굴리느라 바빴었네요.", present: "수입과 지출의 리듬을 잘 맞추세요.", future: "자금 상황이 유동적으로 잘 돌아가요." }, work: { past: "여러 일을 동시에 했었군요.", present: "즐겁게 일하는 자세가 중요해요.", future: "변화에 잘 적응해서 성과를 내요." } }
    },
    {
        id: 66, name: "Three of Pentacles", nameKr: "펜타클 3번", keywords: ["협력", "기술", "인정"],
        todayAdvice: "팀원들과 한마음으로 협동하여 실질적인 성과를 내는 보람찬 날입니다. 당신의 기술과 전문성을 주변에 증명해 보이세요.",
        interpretations: { love: "주변 도움받는 사랑, 성실", money: "전문 조언 수익, 기술직", work: "팀워크, 숙련된 업무", reversed: "기술 부족, 불화" },
        advice: { love: { past: "함께 취미를 즐기며 사랑했었군요.", present: "주변 사람의 조언에 귀 기울이세요.", future: "서로에게 배우며 성장하는 사랑." }, money: { past: "전문 지식으로 돈을 벌었었네요.", present: "투자에 대해 더 많이 공부하세요.", future: "당신의 실력이 재산을 불려줄 거예요." }, work: { past: "협동하여 일을 성공했었군요.", present: "팀워크를 발휘해서 결과물을 만드세요.", future: "업계에서 당신의 기술을 인정받아요." } }
    },
    {
        id: 67, name: "Four of Pentacles", nameKr: "펜타클 4번", keywords: ["소유욕", "인색", "집착"],
        todayAdvice: "가진 것을 잃지 않으려 방어적인 태도를 보이기 쉬운 날입니다. 재정적 안정은 중요하지만 가끔은 마음의 빗장을 열 필요도 있습니다.",
        interpretations: { love: "집착, 변화 거부", money: "지나친 절약, 축재", work: "안정 고수, 매너리즘", reversed: "개방성, 지출 시작" },
        advice: { love: { past: "상대를 꽉 쥐고 있으려 했었군요.", present: "마음을 조금 열어야 사랑이 숨을 쉬어요.", future: "소유욕보다는 믿음이 더 커질 거예요." }, money: { past: "돈을 모으는 데만 집중했었네요.", present: "나갈 땐 나가는 게 나중에 도움이 돼요.", future: "재정적 안정을 지키되 인색하지 마세요." }, work: { past: "현상 유지에만 급급했었군요.", present: "새로운 제안을 긍정적으로 보세요.", future: "변화를 수용해야 더 큰 부가 생겨요." } }
    },
    {
        id: 68, name: "Five of Pentacles", nameKr: "펜타클 5번", keywords: ["결핍", "고난", "소외"],
        todayAdvice: "현실적인 고난이나 외로움이 느껴질 수 있는 날입니다. 혼자 끙끙 앓기보다 곁에 있는 사람의 손을 잡고 시련을 이겨내세요.",
        interpretations: { love: "현실적 고난, 외로움", money: "금전 곤경, 파산 위기", work: "소외감, 고군분투", reversed: "회복, 도움의 손길" },
        advice: { love: { past: "가난했지만 사랑으로 버텼었군요.", present: "어려운 시기일수록 서로 의지하세요.", future: "시련을 이겨내고 더 단단해질 거예요." }, money: { past: "돈 때문에 서러웠던 적이 있네요.", present: "자존심 버리고 도움을 청해 보세요.", future: "조만간 누군가의 금전적 도움을 받아요." }, work: { past: "일터에서 소외감을 느꼈었군요.", present: "혼자 끙끙 앓지 말고 손을 내미세요.", future: "어려운 상황이 서서히 풀려나갈 거예요." } }
    },
    {
        id: 69, name: "Six of Pentacles", nameKr: "펜타클 6번", keywords: ["관용", "베풂", "자선"],
        todayAdvice: "베푸는 만큼 더 큰 복이 돌아오는 따뜻한 하루입니다. 경제적으로든 마음으로든 주변의 어려운 이들에게 손을 내밀어 보세요.",
        interpretations: { love: "헌신적 돌봄, 물질적 지원", money: "보상, 자금 지원, 자선", work: "공정한 대가, 후원자", reversed: "불공정한 분배" },
        advice: { love: { past: "상대를 많이 챙겨줬었군요.", present: "상대에게 관대한 마음을 보여주세요.", future: "받은 만큼 돌려주는 사랑을 하게 돼요." }, money: { past: "돈을 나누며 보람을 느꼈었네요.", present: "베푸는 만큼 나중에 크게 돌아와요.", future: "재정적으로 후한 대접을 받게 돼요." }, work: { past: "정당한 보상을 받았었군요.", present: "후배나 동료에게 아낌없이 나누세요.", future: "당신을 도와줄 후원자가 나타날 거예요." } }
    },
    {
        id: 70, name: "Seven of Pentacles", nameKr: "펜타클 7번", keywords: ["인내", "수확 대기", "성찰"],
        todayAdvice: "노력한 성과를 거두기 직전의 중간 점검의 시간입니다. 조급하게 열매를 따려 하기보다 더 큰 수확을 위해 조금 더 인내하세요.",
        interpretations: { love: "관계 성찰기, 인내", money: "투자 결실 대기, 수익 고민", work: "중간 점검, 보상 지연", reversed: "불만족, 조급함" },
        advice: { love: { past: "이 사랑이 맞나 고민했었군요.", present: "서두르지 말고 결과를 지켜보세요.", future: "노력한 만큼 사랑의 결실을 봐요." }, money: { past: "돈이 자라기를 기다렸었네요.", present: "지금까지의 성과를 냉정히 따져보세요.", future: "참아온 인내의 대가로 돈이 들어와요." }, work: { past: "꾸준히 일하며 기회를 엿봤었군요.", present: "효율성을 따져보고 잠시 숨을 고르세요.", future: "열심히 일한 보람을 곧 느낄 거예요." } }
    },
    {
        id: 71, name: "Eight of Pentacles", nameKr: "펜타클 8번", keywords: ["성실", "노력", "장인"],
        todayAdvice: "한 땀 한 땀 정성을 들이는 장인 정신이 필요한 날입니다. 본업에 성실하게 충실한다면 재물은 자연스럽게 따라올 것입니다.",
        interpretations: { love: "신뢰 구축, 성실한 사랑", money: "성실한 저축, 본업 수익", work: "기술 연마, 전문성 확보", reversed: "지루함, 실력 부족" },
        advice: { love: { past: "성실하게 마음을 쌓아왔었군요.", present: "꾸준하게 진심을 보여주는 게 중요해요.", future: "노력하는 모습에 상대가 감동할 거예요." }, money: { past: "차곡차곡 돈을 모아왔었네요.", present: "본업에 충실하면 돈은 따라올 거예요.", future: "성실함이 최고의 재산이 될 시기예요." }, work: { past: "장인 정신으로 일했었군요.", present: "당신의 기술을 더 날카롭게 닦으세요.", future: "전문가로 인정받아 몸값이 뛸 거예요." } }
    },
    {
        id: 72, name: "Nine of Pentacles", nameKr: "펜타클 9번", keywords: ["풍요", "독립", "우아함"],
        todayAdvice: "경제적 자립과 우아한 여유를 만끽할 수 있는 최고의 날입니다. 스스로를 위해 작은 사치를 부리며 풍요로운 시간을 즐기세요.",
        interpretations: { love: "독립적 행복, 우아함", money: "풍족한 생활, 자수성가", work: "최고 성과, 안정적 위치", reversed: "허영심, 금전 불안" },
        advice: { love: { past: "혼자서도 참 잘 지냈었군요.", present: "당신을 먼저 사랑하고 꾸며보세요.", future: "품격 있고 우아한 사랑을 하게 돼요." }, money: { past: "돈 걱정 없이 우아하게 살았었네요.", present: "스스로를 위한 작은 사치를 해보세요.", future: "경제적으로 완전한 자립을 이뤄요." }, work: { past: "남의 도움 없이 혼자 성공했었군요.", present: "당신의 높은 가치를 당당히 드러내세요.", future: "업계에서 부러움을 사는 위치에 서요." } }
    },
    {
        id: 73, name: "Ten of Pentacles", nameKr: "펜타클 10번", keywords: ["유산", "가족", "부유함"],
        todayAdvice: "안정된 기반 위에서 가족이나 가까운 이들과 평온한 부를 누리는 날입니다. 대물림되는 풍요로움에 감사하며 행복을 나누세요.",
        interpretations: { love: "안정된 가정, 축복", money: "부동산 소유, 가업 번창", work: "안정 기반, 장기 프로젝트", reversed: "가족 갈등, 유산 분쟁" },
        advice: { love: { past: "가족들의 축복을 받았었군요.", present: "안정된 기반 위에서 사랑을 가꾸세요.", future: "평생을 함께할 든든한 짝을 만나요." }, money: { past: "집안 대대로 부유했었네요.", present: "가까운 이들과 부를 나누며 사세요.", future: "재정적으로 완벽한 기반을 닦을 거예요." }, work: { past: "회사가 참 든든했었군요.", present: "전통을 지키며 성실하게 일하세요.", future: "오랫동안 안정적으로 일할 환경이 돼요." } }
    },
    {
        id: 74, name: "Page of Pentacles", nameKr: "펜타클 시종", keywords: ["학습", "신중", "기회"],
        todayAdvice: "새로운 공부나 신중한 저축 계획을 세우기에 아주 좋은 날입니다. 작은 시작이 나중에 큰 부를 가져다주는 초석이 될 것입니다.",
        interpretations: { love: "신중한 시작, 진실함", money: "저축 계획, 소액 투자", work: "실무 기술 습득, 학구적", reversed: "학업 지연, 무책임" },
        advice: { love: { past: "조심스럽게 다가갔었군요.", present: "신중하고 성실하게 상대를 대해보세요.", future: "당신의 진심이 상대에게 닿을 거예요." }, money: { past: "작은 돈부터 아꼈었네요.", present: "재테크 공부를 새로 시작해 보세요.", future: "작은 시작이 큰 돈이 되어 돌아와요." }, work: { past: "일을 배우는 자세가 좋았었군요.", present: "기초를 튼튼히 다지는 게 중요해요.", future: "성실함을 인정받아 기회가 생겨요." } }
    },
    {
        id: 75, name: "Knight of Pentacles", nameKr: "펜타클 기사", keywords: ["성실", "보수적", "책임감"],
        todayAdvice: "느리지만 가장 확실한 길을 가야 하는 성실한 하루입니다. 맡은 일을 끝까지 완벽하게 처리하는 당신의 우직함이 곧 성취로 이어집니다.",
        interpretations: { love: "한결같은 사랑, 믿음", money: "안전자산 선호, 꾸준함", work: "철저한 업무, 완벽주의", reversed: "융통성 없음, 정체" },
        advice: { love: { past: "한결같이 자리를 지켰었군요.", present: "느리지만 확실하게 마음을 전하세요.", future: "변치 않는 든든한 사랑을 하게 돼요." }, money: { past: "돈을 참 성실하게 굴려왔었네요.", present: "요행 바라지 말고 차근차근 모으세요.", future: "재정적으로 아주 단단한 성이 쌓여요." }, work: { past: "책임감이 아주 강했었군요.", present: "맡은 일은 끝까지 완벽하게 처리하세요.", future: "당신의 우직함이 큰 성공을 가져와요." } }
    },
    {
        id: 76, name: "Queen of Pentacles", nameKr: "펜타클 여왕", keywords: ["실속", "풍요", "보살핌"],
        todayAdvice: "실속 있는 관리와 따뜻한 보살핌이 조화를 이루는 날입니다. 당신이 머무는 공간을 풍요롭게 가꾸며 주변을 너그럽게 돌보세요.",
        interpretations: { love: "따뜻한 배려, 현모양처", money: "알뜰한 관리, 부유함", work: "실용적 리더, 실력자", reversed: "의심, 인색함" },
        advice: { love: { past: "상대를 따뜻하게 챙겨줬었군요.", present: "포용력 있는 마음으로 상대를 보세요.", future: "몸과 마음이 편안한 사랑을 해요." }, money: { past: "지갑 관리를 참 잘 했었네요.", present: "현실적이고 실속 있게 투자하세요.", future: "재정적으로 매우 풍족하고 여유로워요." }, work: { past: "살림꾼처럼 일을 잘 했었군요.", present: "주변 동료들을 따뜻하게 돌봐주세요.", future: "당신이 맡은 곳이 풍요롭게 변해요." } }
    },
    {
        id: 77, name: "King of Pentacles", nameKr: "펜타클 왕", keywords: ["권력", "성공", "재력"],
        todayAdvice: "금전적인 성취와 강력한 권위가 따르는 날입니다. 당신의 능력을 믿고 대담하게 행동하여 부의 정점을 향해 나아가세요.",
        interpretations: { love: "듬직한 연인, 안정적 리드", money: "최고 부 성취, 권위", work: "비즈니스 성공, 성공적 사업", reversed: "물질 만능, 부패" },
        advice: { love: { past: "듬직하게 사랑을 지켜왔었군요.", present: "현실적인 안정을 상대에게 약속하세요.", future: "최고로 안정된 사랑을 누리게 돼요." }, money: { past: "돈을 버는 능력이 아주 좋았네요.", present: "대담하지만 신중하게 큰 돈을 굴리세요.", future: "부의 정점에 올라 여유롭게 살 거예요." }, work: { past: "비즈니스에서 큰 성공을 했었군요.", present: "당신의 능력으로 조직을 풍요롭게 하세요.", future: "업계에서 최고의 영향력을 갖게 돼요." } }
    }
];

// --- 최종 데이터 통합 ---
export const TAROT_DATA: TarotCard[] = [
    ...MAJOR_ARCANA,
    ...WANDS,
    ...CUPS,
    ...SWORDS,
    ...PENTACLES
];