import { useState, useEffect } from "react";

const STANFORD_RED = "#8C1515";
const UT_BURNT_ORANGE = "#BF5700";
const WARM_CREAM = "#FDF6F0";
const DEEP_CHARCOAL = "#1A1A1A";
const ACCENT_GOLD = "#D4A853";
const MUTED_ROSE = "#C4898A";

const sections = [
  { id: "overview", label: "Overview", icon: "◎" },
  { id: "ch2", label: "Ch 2 · Foundations", icon: "02" },
  { id: "ch4", label: "Ch 4 · Attitudes", icon: "04" },
  { id: "ch5", label: "Ch 5 · TPB", icon: "05" },
  { id: "ch6", label: "Ch 6 · Functions", icon: "06" },
  { id: "ch10", label: "Ch 10 · ELM", icon: "10" },
  { id: "morrison", label: "Morrison et al.", icon: "JA" },
  { id: "strategy", label: "Exam Strategy", icon: "✦" },
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.error(e); }
  }, [key, value]);
  return [value, setValue];
}

function TermCard({ term, definition, korean, example, highlight, onToggleReviewed, isReviewed, onToggleFavorite, isFavorite, searchTerm }) {
  const [open, setOpen] = useState(false);
  const hl = (text) => {
    if (!searchTerm || !text) return text;
    const r = new RegExp(`(${searchTerm})`, 'gi');
    return String(text).split(r).map((p, i) => r.test(p) ? <mark key={i} style={{ background: '#FFE066', padding: '0 2px', borderRadius: 2 }}>{p}</mark> : p);
  };
  return (
    <div style={{ background: open ? "white" : "rgba(255,255,255,0.7)", border: open ? `1.5px solid ${STANFORD_RED}` : "1.5px solid rgba(140,21,21,0.12)", borderRadius: 10, padding: "16px 20px", marginBottom: 10, cursor: "pointer", transition: "all 0.25s ease", boxShadow: open ? "0 4px 20px rgba(140,21,21,0.08)" : "none", opacity: isReviewed ? 0.5 : 1 }} className="term-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }} onClick={() => setOpen(!open)}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: open ? 8 : 0, letterSpacing: "-0.01em" }}>
            {highlight && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: STANFORD_RED, marginRight: 8, verticalAlign: "middle" }} />}
            {hl(term)}
          </div>
          {open && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14.5, lineHeight: 1.7, color: "#3A3A3A", marginBottom: korean || example ? 10 : 0 }}>{hl(definition)}</div>
              {korean && <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, lineHeight: 1.7, color: "#6B6B6B", padding: "8px 12px", background: "rgba(140,21,21,0.03)", borderRadius: 6, borderLeft: `2px solid ${MUTED_ROSE}`, marginBottom: example ? 10 : 0 }}>{hl(korean)}</div>}
              {example && <div style={{ fontSize: 13, color: STANFORD_RED, fontStyle: "italic", fontFamily: "'Source Serif 4', Georgia, serif" }}>↳ {hl(example)}</div>}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 12, flexShrink: 0 }}>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4, color: isFavorite ? ACCENT_GOLD : "#CCC" }}>{isFavorite ? "★" : "☆"}</button>
          <button onClick={(e) => { e.stopPropagation(); onToggleReviewed?.(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 4, color: isReviewed ? STANFORD_RED : "#CCC" }}>{isReviewed ? "✓" : "○"}</button>
          <span onClick={() => setOpen(!open)} style={{ fontSize: 14, color: STANFORD_RED, opacity: 0.5, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease", padding: 4 }}>+</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13.5 }}>
        <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 14px", borderBottom: `2px solid ${STANFORD_RED}`, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.03em", color: STANFORD_RED }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? "rgba(140,21,21,0.02)" : "transparent" }}>{row.map((cell, j) => <td key={j} style={{ padding: "10px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)", lineHeight: 1.6, color: j === 0 ? DEEP_CHARCOAL : "#4A4A4A", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function DiagramBox({ title, items, color }) {
  return (
    <div style={{ background: "white", border: `1.5px solid ${color || STANFORD_RED}`, borderRadius: 10, padding: "14px 18px", marginBottom: 12 }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: color || STANFORD_RED, marginBottom: 8 }}>{title}</div>
      {items.map((item, i) => <div key={i} style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13.5, lineHeight: 1.6, color: "#4A4A4A", paddingLeft: 12, borderLeft: `2px solid ${color || "rgba(140,21,21,0.15)"}`, marginBottom: i < items.length - 1 ? 6 : 0, marginLeft: 4 }}>{item}</div>)}
    </div>
  );
}

function FlowArrow() { return <div style={{ textAlign: "center", color: STANFORD_RED, fontSize: 20, margin: "4px 0", opacity: 0.4 }}>↓</div>; }

function SectionHeader({ number, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED_ROSE, marginBottom: 4 }}>{number}</div>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: DEEP_CHARCOAL, margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{title}</h2>
      {subtitle && <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, color: "#7A7A7A", marginTop: 6, lineHeight: 1.5 }}>{subtitle}</div>}
    </div>
  );
}

function KeyInsight({ text }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${STANFORD_RED}08, ${STANFORD_RED}04)`, borderLeft: `3px solid ${STANFORD_RED}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 16, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: "#3A3A3A" }}>
      <span style={{ fontWeight: 700, color: STANFORD_RED, marginRight: 6 }}>Key →</span>{text}
    </div>
  );
}

/* Helper to pass enhanced props to TermCard */
function E({ id, term, definition, korean, example, highlight, ctx }) {
  return <TermCard term={term} definition={definition} korean={korean} example={example} highlight={highlight} isReviewed={ctx.reviewed[id]} isFavorite={ctx.favorites[id]} onToggleReviewed={() => ctx.onToggleReviewed(id)} onToggleFavorite={() => ctx.onToggleFavorite(id)} searchTerm={ctx.searchTerm} />;
}

function OverviewSection() {
  return (
    <div>
      <SectionHeader number="ADV382J · Spring 2026" title="Exam 1 Study Guide" subtitle="Persuasion, Attitudes, and Behavior Change" />
      <div style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1.5px solid rgba(140,21,21,0.1)", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 12 }}>Exam Details</div>
        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 2, color: "#4A4A4A" }}>
          <div><strong style={{ color: STANFORD_RED }}>Date:</strong> Monday, Feb 16, 2026 · 10:00–11:15 AM</div>
          <div><strong style={{ color: STANFORD_RED }}>Format:</strong> Closed-book, in class</div>
          <div><strong style={{ color: STANFORD_RED }}>Structure:</strong> 14 MC (0.25 pt each) + 6 Short Answer (5 × 1 pt + 1 × 1.5 pt)</div>
          <div><strong style={{ color: STANFORD_RED }}>Total:</strong> 10 points</div>
        </div>
      </div>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 12 }}>Coverage</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { ch: "Ch 2", title: "Foundations of Persuasion", topics: "Definition, coercion, propaganda, manipulation, borderline cases" },
          { ch: "Ch 4", title: "Attitudes: Definition & Structure", topics: "Attitudes, values, beliefs, symbolic & ideological approaches" },
          { ch: "Ch 5", title: "Attitudes & Behavior", topics: "TPB components, persuasive strategies, attitude-behavior link" },
          { ch: "Ch 6", title: "Attitude Functions", topics: "Six functions, matching hypothesis, dysfunctions" },
          { ch: "Ch 10", title: "Processing Communications", topics: "ELM, central/peripheral routes, inoculation theory" },
          { ch: "Article", title: "Morrison et al.", topics: "TRA model, bidimensional outcome beliefs, Figure 1" },
        ].map((item, i) => (
          <div key={i} style={{ background: "white", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: STANFORD_RED, marginBottom: 4 }}>{item.ch}</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 12.5, color: "#888", lineHeight: 1.5 }}>{item.topics}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", padding: 16, background: `linear-gradient(135deg, ${STANFORD_RED}06, transparent)`, borderRadius: 10, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: "#999", fontStyle: "italic" }}>
        Click any term card to expand · Tap sections in the sidebar to navigate
      </div>
    </div>
  );
}

function Ch2Section({ ctx }) {
  return (
    <div>
      <SectionHeader number="Chapter 02" title="Foundations of Persuasion" subtitle="Definition, coercion, propaganda, manipulation, and borderline cases" />
      <E id="ch2-persuasion" ctx={ctx} highlight term="Persuasion" definition='A symbolic process in which communicators try to convince other people to change their own attitudes or behaviors regarding an issue through the transmission of a message in an atmosphere of free choice.' korean="상징적 과정을 통해 메시지를 전달하여, 자유로운 선택 분위기에서 태도나 행동을 변화시키도록 유도하는 것." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 20, marginBottom: 12 }}>Five Key Components</div>
      <E id="ch2-symbolic" ctx={ctx} term="1 · Symbolic Process" definition="Relies on symbols — language, images, signs with rich psychological/cultural meaning. Symbols are ambiguous and shift over time (e.g., the Confederate flag)." korean="상징에 의존 — 언어, 이미지, 기호. 의미는 시간에 따라 변함." />
      <E id="ch2-attempt" ctx={ctx} term="2 · Attempt to Influence" definition="Persuasion is deliberate — the communicator must intend to change attitudes/behavior. Distinguishes persuasion from social influence (observational learning without intent)." korean="설득은 의도적 — 사회적 영향(관찰 학습)과 구별됨." />
      <E id="ch2-self" ctx={ctx} term="3 · Self-Persuasion" definition="Communicators provide the 'bait,' but individuals choose to change. 'You can't force people to be persuaded.' Therapy is a prime example." korean="소통자는 미끼를 제공하지만, 변화의 선택은 개인의 몫." />
      <E id="ch2-message" ctx={ctx} term="4 · Transmission of a Message" definition="There must be a communicative message (verbal or nonverbal). Distinct from mere behavioral observation." korean="언어적 또는 비언어적 메시지가 필요." />
      <E id="ch2-freechoice" ctx={ctx} term="5 · Free Choice" definition="The individual must have the ability to act otherwise — to reflect critically and reject the message." korean="비판적 사고와 거부의 자유가 보장되어야 함." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>Key Distinctions</div>
      <ComparisonTable headers={["Concept", "Free Choice?", "Intent", "Key Feature"]} rows={[["Persuasion", "Yes", "Open/Honest", "Symbolic message, self-persuasion"],["Coercion", "No", "Overt threat", "Believable threat, removes autonomy"],["Manipulation", "Yes", "Hidden/Deceptive", "Disguised goals, tricks consent"],["Propaganda", "Restricted", "Hidden source", "Mass media control, deceptive, one-sided"]]} />
      <E id="ch2-coercion" ctx={ctx} highlight term="Coercion" definition="Occurs when the influence agent: (a) delivers a believable threat of significant harm, (b) deprives the individual of autonomy, and (c) attempts to induce the individual to act contrary to their preferences. Exists on a continuum with persuasion." korean="강압: 믿을 만한 위협 + 자율성 박탈 + 선호에 반하는 행동 유도." example="Boss threatening to fire an employee for not donating to charity; #MeToo situations" />
      <E id="ch2-propaganda" ctx={ctx} highlight term="Propaganda" definition="A communication system where the communicator has near/total control over information flow, relies on mass/social media, and uses deceptive messages with hidden sources. Dissent is prohibited." korean="프로파간다: 정보 흐름의 완전한 통제 + 대중매체 + 기만적 메시지 + 숨겨진 출처." example="North Korea's state media; Russian interference in 2016 US election via fake accounts" />
      <E id="ch2-manipulation" ctx={ctx} term="Manipulation" definition="A technique where a communicator hides their true persuasive goals, delivering an overt message that disguises true intent. Unlike coercion, free choice remains — but the person is tricked into saying yes." korean="조종: 숨겨진 의도로 상대를 속여 동의하게 함. 강압과 달리 자유 의지는 존재." example="Flattery, sweet talk, false promises" />
      <E id="ch2-borderline" ctx={ctx} term="Borderline Cases" definition="Activities where the primary intent may be expression or information, but persuasion occurs as a secondary effect. Includes art (self-expression → attitude change), news (informing → shaping attitudes), and entertainment (packaging persuasion as story)." korean="예술, 뉴스, 엔터테인먼트 — 일차 목적은 다르지만 부차적으로 설득이 발생하는 경우." example="Guernica, Don't Look Up, investigative journalism" />
    </div>
  );
}

function Ch4Section({ ctx }) {
  return (
    <div>
      <SectionHeader number="Chapter 04" title="Attitudes: Definition & Structure" subtitle="Definitions, values, beliefs, symbolic and ideological approaches" />
      <E id="ch4-attitude" ctx={ctx} highlight term="Attitude (Definition)" definition="A learned, global evaluation of an object (person, place, or issue) that influences thought and action. A 'hypothetical construct' — not directly observable." korean="태도: 대상에 대한 학습된 전반적 평가. 직접 관찰할 수 없는 가설적 구성개념." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 20, marginBottom: 12 }}>The Cognitive Hierarchy</div>
      <DiagramBox title="Values (가치)" items={["Macro, guiding life principles", "e.g., Freedom, Equality, Health"]} color={STANFORD_RED} />
      <FlowArrow />
      <DiagramBox title="Attitudes (태도)" items={["Global evaluations of specific objects", "e.g., 'I support recycling'"]} color={UT_BURNT_ORANGE} />
      <FlowArrow />
      <DiagramBox title="Beliefs (신념)" items={["Specific cognitions about an object", "e.g., 'Recycling saves trees' (descriptive) or 'People should recycle' (prescriptive)"]} color={ACCENT_GOLD} />
      <KeyInsight text="Values encompass attitudes, which in turn incorporate beliefs. Values are broadest; beliefs are most specific." />
      <E id="ch4-symbolic" ctx={ctx} highlight term="Symbolic Approach" definition="Attitudes dominated by emotional reactions (affect) and symbolic meanings rather than logical beliefs. Built on emotional associations with symbols/labels." korean="상징적 접근: 논리적 신념보다 감정적 반응과 상징적 의미에 기반한 태도 형성." example="Attitudes toward masks during COVID — driven by what masks symbolized, not just efficacy data" />
      <E id="ch4-ideological" ctx={ctx} highlight term="Ideological Approach" definition="Attitudes organized 'top-down' from broad ideological principles (e.g., conservative vs. liberal worldviews on liberty vs. fairness). Your ideology shapes your specific attitudes." korean="이데올로기적 접근: 보수 vs. 진보 같은 광범위한 세계관에서 하향식으로 형성되는 태도." />
      <E id="ch4-implicit" ctx={ctx} term="Implicit vs. Explicit Attitudes" definition="Implicit: automatic, associative, unconscious (amygdala-driven). Explicit: deliberative, propositional, conscious (prefrontal cortex). These can be dissociated — e.g., implicit prejudice alongside explicit egalitarian beliefs." korean="암묵적: 자동적, 무의식적 (편도체). 명시적: 의도적, 의식적 (전전두엽)." />
      <E id="ch4-valence" ctx={ctx} term="Valence vs. Arousal" definition="Valence = direction (positive/negative). Arousal = intensity of activation (calm ↔ excited). Extreme attitudes (high valence) often correlate with high arousal; neutral attitudes with low arousal." korean="방향성(긍정/부정) vs. 각성도(차분 ↔ 흥분). 극단적 태도는 높은 각성도와 상관." />
      <E id="ch4-biology" ctx={ctx} term="Biology vs. Socialization" definition="Ideology (conservative/liberal) has ~40–50% heritability, linked to biological personality traits. Party Identification is primarily environmental — learned from parents/socialization." korean="이데올로기: 40-50% 유전적. 정당 동일시: 주로 환경적(부모/사회화로 학습)." />
      <E id="ch4-sjt" ctx={ctx} highlight term="Social Judgment Theory" definition="People evaluate messages relative to their 'anchor' (current position). Three latitudes: Acceptance (agree), Rejection (find offensive), Non-commitment (neutral). Assimilation = pulling a close message toward your anchor. Contrast = pushing a distant message further away." korean="사회 판단 이론: 수용 영역 / 거부 영역 / 불확정 영역. 동화 효과 vs. 대조 효과." />
    </div>
  );
}

function Ch5Section({ ctx }) {
  return (
    <div>
      <SectionHeader number="Chapter 05" title="Theory of Planned Behavior" subtitle="Attitudes, behaviors, and the predictive model" />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 12 }}>The Attitude–Behavior Link</div>
      <E id="ch5-correlation" ctx={ctx} term="Attitude-Behavior Correlation" definition="Attitudes don't always predict behavior, but generally do (r ≈ .52). Three moderators: (1) Situational factors (context/norms/roles), (2) Personal characteristics (self-monitoring), (3) Qualities of the attitude (direct experience, specificity)." />
      <E id="ch5-selfmon" ctx={ctx} term="Self-Monitoring" definition="High self-monitors adjust behavior to fit the situation → lower attitude-behavior consistency. Low self-monitors act on inner feelings → higher attitude-behavior consistency." korean="고자기감시자: 상황에 맞게 행동 조정. 저자기감시자: 내면 감정에 따라 행동." />
      <E id="ch5-compat" ctx={ctx} term="Compatibility Principle" definition="To predict behavior accurately, measure the attitude at the same level of specificity as the behavior. General attitudes predict aggregate behaviors; specific attitudes predict specific actions." korean="행동 예측을 위해 태도와 행동의 구체성 수준을 일치시켜야 함." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>TPB Model (Reasoned Action Approach)</div>
      <KeyInsight text="Behavior is not just a result of attitude — it follows intention, which is formed by three components working together." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <DiagramBox title="Attitude toward Behavior" items={["Personal evaluation: good or bad?", "= Behavioral Beliefs × Outcome Evaluations"]} color={STANFORD_RED} />
        <DiagramBox title="Perceived Norm" items={["Injunctive: what others think you should do", "Descriptive: what others actually do"]} color={UT_BURNT_ORANGE} />
        <DiagramBox title="PBC" items={["Perceived Behavioral Control", "'Can I actually do this?'", "Psychological ability + resources"]} color={ACCENT_GOLD} />
      </div>
      <FlowArrow />
      <DiagramBox title="Behavioral Intention" items={["The plan/intent to perform the behavior", "Immediate predictor of behavior"]} color={DEEP_CHARCOAL} />
      <FlowArrow />
      <DiagramBox title="Behavior" items={["The actual action in context"]} color={DEEP_CHARCOAL} />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>Four Persuasive Strategies Based on TPB</div>
      <E id="ch5-s1" ctx={ctx} highlight term="1 · Target Relevant Beliefs" definition="Identify and address specific behavioral beliefs. If misinformation exists, use evidence or pre-bunking (inoculation). If beliefs are correct but evaluations negative, change the evaluation." korean="구체적인 행동 신념을 파악하고 교정. 잘못된 정보 → 증거 제시. 부정적 평가 → 평가 변화 시도." />
      <E id="ch5-s2" ctx={ctx} highlight term="2 · Appeal to Social Norms" definition="Highlight that important referent people support the behavior. If attitude is hard to change, focus on the norm. Descriptive norms (peers doing it) often more effective than injunctive for teens." korean="중요 인물이 해당 행동을 지지함을 강조. 태도 변화가 어려우면 규범에 집중." example="Telling teens their friends are getting vaccinated > telling them parents want them to" />
      <E id="ch5-s3" ctx={ctx} highlight term="3 · Target PBC" definition="If the barrier is 'I can't do it,' remove the obstacle or increase self-efficacy. Provide how-to information, easy access, or testimonials from similar others who succeeded." korean="장벽이 '할 수 없다'이면, 장애 제거 또는 자기효능감 증가." />
      <E id="ch5-s4" ctx={ctx} highlight term="4 · Close the Intention–Behavior Gap" definition="People intend to act but forget or procrastinate. Use reminders (texts, emails) or prompt a specific plan: date, time, location." korean="의도는 있지만 실행하지 못하는 경우 → 알림 또는 구체적 계획(날짜, 시간, 장소) 요청." />
    </div>
  );
}

function Ch6Section({ ctx }) {
  return (
    <div>
      <SectionHeader number="Chapter 06" title="Attitude Functions" subtitle="Functional theory — why we hold attitudes, not just what" />
      <KeyInsight text="Two people can hold the exact same attitude for completely different reasons. Functional theory asks WHY, not WHAT." />
      <E id="ch6-knowledge" ctx={ctx} highlight term="1 · Knowledge Function" definition="Helps make sense of the world and explain baffling events. Provides a framework to interpret ambiguous stimuli." example="After 9/11 or COVID: religious attitudes as 'plan of salvation.' QAnon as simple explanation for frustrations." />
      <E id="ch6-utilitarian" ctx={ctx} highlight term="2 · Utilitarian Function" definition="Based on behavioral learning — helps obtain rewards and avoid punishments." example="Positive attitude toward a harsh coach → minimizes wrath, gets playing time." />
      <E id="ch6-adjustive" ctx={ctx} highlight term="3 · Social Adjustive Function" definition="Helps people 'adjust to' reference groups — attitudes adopted to fit in, gain acceptance, avoid ostracism." example="Listening to alternative bands because cool friends do; attending protests because friends are passionate." />
      <E id="ch6-identity" ctx={ctx} highlight term="4 · Social Identity Function" definition="Communicates who a person is and what they aspire to be. About self-expression and uniqueness." example="Hard Rock Café shirts, tattoos ('Forever Free' after abuse), iPhones as identity extensions." />
      <E id="ch6-ego" ctx={ctx} highlight term="5 · Ego-Defensive Function" definition="Protects self-esteem against internal fears or external threats." example="Hostile attitude toward an ex to defend against pain; scapegoating minorities to displace frustration." />
      <E id="ch6-value" ctx={ctx} highlight term="6 · Value-Expressive Function" definition="Expresses deep-seated values and humanitarian concerns. Identified in Clary & Snyder volunteering study." example="Volunteering to 'act on' humanitarian values — not for résumé, but for moral expression." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>The Matching Hypothesis</div>
      <KeyInsight text="A persuasive message is most effective when it matches the underlying function the attitude serves for the individual." />
      <E id="ch6-clary" ctx={ctx} highlight term="Clary & Snyder Volunteering Study" definition="Students with utilitarian motives were persuaded by utilitarian appeals ('gain skills'). Students with value-expressive motives were persuaded by value-expressive appeals ('help others'). Mismatched appeals generally fail." korean="기능이 일치하는 설득 메시지가 효과적. 불일치 시 실패." />
      <E id="ch6-dysfunction" ctx={ctx} term="Attitude Dysfunctions" definition="Attitudes can be functional for the individual but dysfunctional for health/society. Smoking serves stress coping but kills. Prejudice soothes ego but harms society. Gun marketing appeals to masculinity insecurity but amplifies violence." korean="개인에게는 기능적이지만 건강/사회에는 역기능적일 수 있음." />
      <E id="ch6-qanon" ctx={ctx} term="QAnon Case Study" definition="Knowledge: explains a confusing world. Social Identity: followers feel 'smart' and 'superior.' Social Adjustive: provides community. Implication: fact-checking alone fails because it doesn't address the psychological needs. Must help find healthier outlets." korean="음모론은 다중 기능을 충족 → 팩트체크만으로 불충분. 심리적 필요를 대체할 건강한 출구 필요." />
    </div>
  );
}

function Ch10Section({ ctx }) {
  return (
    <div>
      <SectionHeader number="Chapter 10" title="Processing Persuasive Communications" subtitle="ELM, systematic vs. heuristic processing, inoculation theory" />
      <E id="ch10-inoculation" ctx={ctx} highlight term="Inoculation Theory" definition="Medical analogy: like a vaccine, exposing individuals to a 'weak dose' of counter-arguments and then refuting them builds psychological immunity. Two components: (1) Threat — make the person feel their belief is vulnerable (motivation), (2) Refutational Preemption — provide and refute counter-arguments (ability/cognitive ammunition)." korean="접종 이론: 약한 반론에 노출 → 반박 제공 → 심리적 면역력 형성." example="Prevent teen smoking: expose to 'smoking is cool' then refute ('it makes you smell bad, creates dependency')." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>Elaboration Likelihood Model (ELM)</div>
      <KeyInsight text="'Elaboration' = the extent to which a person thinks about or mentally modifies arguments. You cannot understand persuasion without understanding the process." />
      <ComparisonTable headers={["Feature", "Central Route", "Peripheral Route"]} rows={[["Processing", "Deep, careful, cognitive elaboration", "Quick, surface-level, cue-based"],["Triggers", "High Motivation + High Ability", "Low Motivation OR Low Ability"],["What persuades?", "Argument quality (strong, logical)", "Peripheral cues (attractiveness, expertise, # of arguments)"],["Outcome", "Long-lasting, resistant, predicts behavior", "Temporary, susceptible, weak predictor"]]} />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>The "Switch": Motivation × Ability</div>
      <E id="ch10-motivation" ctx={ctx} highlight term="Motivation to Process" definition="Involvement (personal relevance) is the most important determinant. High involvement → Central Route. Need for Cognition (NFC): a personality trait. High NFC enjoy thinking, process centrally even with low involvement. Low NFC rely on peripheral cues." korean="관여도(개인적 관련성)가 가장 중요한 결정 요인. 인지 욕구(NFC)도 역할." />
      <E id="ch10-ability" ctx={ctx} term="Ability to Process" definition="Even if motivated, can't process centrally without ability. Reduces: distraction, time pressure, complexity, lack of knowledge. Increases: repetition, clear structure." korean="동기가 있어도 능력 없이는 중심 경로 처리 불가." />
      <E id="ch10-petty" ctx={ctx} highlight term="Petty, Cacioppo & Goldman (1981)" definition="THE classic ELM experiment. Manipulated: (1) Involvement (exam next year vs. 10 years), (2) Argument Quality (strong vs. weak), (3) Source Expertise (Carnegie Commission vs. high school class). High involvement → argument quality mattered, source didn't. Low involvement → source expertise mattered, arguments didn't." korean="고관여 → 논증의 질이 중요. 저관여 → 출처의 전문성이 중요." />
      <E id="ch10-hsm" ctx={ctx} term="Systematic vs. Heuristic (HSM)" definition="Systematic = comprehensive argument consideration (≈ Central). Heuristic = cognitive shortcuts (≈ Peripheral). Key difference: HSM says both can occur simultaneously. Heuristics: 'Experts are usually right,' 'Length implies strength,' 'Bandwagon.'" korean="HSM은 두 처리가 동시에 발생 가능 — ELM과의 핵심 차이." />
      <E id="ch10-multiple" ctx={ctx} term="Multiple Functions Postulate" definition="A single variable can serve different functions by situation. Attractiveness: peripheral cue under low involvement ('agree because she's pretty'), argument under high involvement (beauty cream ad)." korean="하나의 변수가 상황에 따라 다른 기능. 매력도: 저관여 시 주변 단서, 고관여 시 논증." />
      <E id="ch10-biased" ctx={ctx} term="Biased Processing" definition="Central processing is not always objective. If a message threatens a core value, a person may process centrally but with heavy bias — easily accepting supporting views while heavily critiquing opposing ones." korean="중심 경로 처리가 항상 객관적이지는 않음. 핵심 가치 위협 시 편향적 처리." />
    </div>
  );
}

function MorrisonSection({ ctx }) {
  return (
    <div>
      <SectionHeader number="Journal Article" title="Morrison et al." subtitle="Positive/negative outcome beliefs in predicting behavioral intention" />
      <KeyInsight text="This is critical — likely the 1.5-point short answer question. Know Figure 1 inside and out." />
      <E id="mor-overview" ctx={ctx} highlight term="Study Overview" definition="Applies the Theory of Reasoned Action (TRA) to adolescent mothers' marijuana use decisions. Core: Intention is the best predictor of behavior, determined by Attitude and Perceived Social Norms." korean="TRA를 10대 어머니들의 대마초 사용 의사결정에 적용. 의도 = 태도 + 사회적 규범." />
      <E id="mor-bidim" ctx={ctx} highlight term="Bidimensional Outcome Beliefs" definition="Standard TRA sums all beliefs into one score. This study found beliefs are bidimensional — Positive Outcome Beliefs (relaxing, forgetting problems, getting high, fitting in) and Negative Outcome Beliefs (addiction, health harm, trouble, cost). This distinction is the key contribution." korean="결과 신념은 양방향적: 긍정적(이완, 흥미) vs. 부정적(중독, 건강 위해)." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>Figure 1 — Path Model</div>
      <div style={{ background: "white", borderRadius: 12, padding: 24, border: "1.5px solid rgba(140,21,21,0.15)", marginBottom: 20 }}>
        {[
          { path: "Positive Beliefs → Attitude", result: "SIGNIFICANT", color: STANFORD_RED, bold: true },
          { path: "Negative Beliefs → Attitude", result: "NOT SIGNIFICANT (ns)", color: "#999", bold: false },
          { path: "Attitude → Intention", result: "SIGNIFICANT (strong)", color: STANFORD_RED, bold: true },
          { path: "Norms → Intention", result: "SIGNIFICANT (weaker)", color: UT_BURNT_ORANGE, bold: false },
          { path: "Intention → Use (6 months)", result: "SIGNIFICANT", color: STANFORD_RED, bold: true },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: item.bold ? "rgba(140,21,21,0.03)" : "transparent", borderRadius: 6, borderLeft: `3px solid ${item.color}`, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, fontWeight: item.bold ? 600 : 400, color: DEEP_CHARCOAL }}>{item.path}</span>
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: item.color, fontWeight: 600 }}>{item.result}</span>
          </div>
        ))}
      </div>
      <E id="mor-implication" ctx={ctx} highlight term="The Crucial Implication" definition="For this population, attitudes toward marijuana are driven by perceived BENEFITS (stress relief, fun), NOT perceived costs/risks. Fear-based health campaigns are ineffective because negative beliefs don't drive attitude. Interventions should address the perceived benefits instead." korean="태도는 인지된 '이점'이 결정. 부정적 결과 신념은 무의미. 위험성 경고보다 이점 반박이 효과적." />
      <div style={{ background: `linear-gradient(135deg, ${STANFORD_RED}06, ${UT_BURNT_ORANGE}04)`, borderRadius: 10, padding: "16px 20px", marginTop: 16, border: "1px solid rgba(140,21,21,0.1)" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: STANFORD_RED, marginBottom: 8 }}>1.5-pt Short Answer Template:</div>
        <ol style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "#3A3A3A", margin: 0, paddingLeft: 20 }}>
          <li>Outcome beliefs are <strong>bidimensional</strong> (positive vs. negative), not unidimensional</li>
          <li>Only <strong>Positive Outcome Beliefs</strong> predicted attitude</li>
          <li><strong>Negative Outcome Beliefs</strong> failed to predict attitude</li>
          <li>Intention driven by <strong>desire for benefits</strong>, not fear of consequences</li>
          <li>Translation: fear-based campaigns will fail for this population</li>
        </ol>
      </div>
    </div>
  );
}

function StrategySection({ ctx }) {
  return (
    <div>
      <SectionHeader number="Exam Strategy" title="Final Preparation" subtitle="Time allocation, frameworks, and last-minute checklist" />
      <div style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1.5px solid rgba(140,21,21,0.1)", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 12 }}>Time Allocation (75 min)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: `${STANFORD_RED}08`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: STANFORD_RED }}>~25 min</div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: "#666", marginTop: 4 }}>14 Multiple Choice · ~1.5 min each</div>
          </div>
          <div style={{ background: `${UT_BURNT_ORANGE}08`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: UT_BURNT_ORANGE }}>~50 min</div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: "#666", marginTop: 4 }}>6 Short Answer · ~7–8 min each</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 12 }}>Short Answer Framework</div>
      <KeyInsight text="Definition → Apply the concept → Give a specific example. Every short answer should follow this structure." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>High-Yield Topics</div>
      <E id="str-morrison" ctx={ctx} highlight term="Morrison et al. Figure 1 (1.5 pt)" definition="Bidimensional outcome beliefs → positive beliefs predict attitude, negative don't → implications for campaigns." />
      <E id="str-elm" ctx={ctx} term="ELM: Central vs. Peripheral Route" definition="Identify which route a scenario describes. Know Petty, Cacioppo & Goldman (1981) results." />
      <E id="str-tpb" ctx={ctx} term="TPB Persuasive Strategies" definition="Design a campaign: identify which component (Attitude, Norm, PBC) to target and why." />
      <E id="str-coercion" ctx={ctx} term="Coercion vs. Manipulation vs. Propaganda" definition="Know distinguishing features: free choice, intent, threat, media control, hidden source." />
      <E id="str-functions" ctx={ctx} term="Six Attitude Functions + Matching" definition="Match a persuasive appeal to the correct function. Know Clary & Snyder." />
      <E id="str-inoculation" ctx={ctx} term="Inoculation Theory" definition="Vaccine metaphor: threat (motivation) + refutational preemption (ability)." />
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: DEEP_CHARCOAL, marginTop: 24, marginBottom: 12 }}>Quick-Check Flashcards</div>
      <ComparisonTable headers={["Question", "Answer"]} rows={[["Central vs. Peripheral — what decides?", "Motivation (involvement, NFC) × Ability"],["High involvement → what matters?", "Argument quality. Source expertise irrelevant."],["Low involvement → what matters?", "Peripheral cues: source expertise, attractiveness"],["TPB formula?", "Attitude + Norm + PBC → Intention → Behavior"],["Injunctive vs. Descriptive?", "Injunctive = should do. Descriptive = others do."],["Morrison: which beliefs predict?", "Only Positive Outcome Beliefs. Negative = ns."],["Inoculation = ?", "Weak counter-argument + refutation → 'mental antibodies'"],["Ideology vs. Party ID?", "Ideology ~40-50% heritable. Party ID = socialized."],["Assimilation vs. Contrast?", "Assimilation = pull close. Contrast = push far."],["Matching Hypothesis?", "Message effectiveness ↑ when it matches attitude function."]]} />
      <div style={{ textAlign: "center", padding: 24, marginTop: 20, background: `linear-gradient(135deg, ${STANFORD_RED}04, ${UT_BURNT_ORANGE}04)`, borderRadius: 12 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: DEEP_CHARCOAL, marginBottom: 8 }}>Clarity is kindness. Structure is freedom.</div>
        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: "#AAA", marginTop: 12 }}>Prepared by Bella Kang · ADV382J · Spring 2026 · The University of Texas at Austin</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewed, setReviewed] = useLocalStorage("adv382j-reviewed", {});
  const [favorites, setFavorites] = useLocalStorage("adv382j-favorites", {});

  useEffect(() => { setMounted(true); }, []);

  const toggleReviewed = (id) => setReviewed(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  const exportProgress = () => {
    const data = { reviewed: Object.keys(reviewed).filter(k => reviewed[k]), favorites: Object.keys(favorites).filter(k => favorites[k]), exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'adv382j-study-progress.json'; a.click(); URL.revokeObjectURL(url);
  };

  const ctx = { reviewed, favorites, onToggleReviewed: toggleReviewed, onToggleFavorite: toggleFavorite, searchTerm };

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "ch2": return <Ch2Section ctx={ctx} />;
      case "ch4": return <Ch4Section ctx={ctx} />;
      case "ch5": return <Ch5Section ctx={ctx} />;
      case "ch6": return <Ch6Section ctx={ctx} />;
      case "ch10": return <Ch10Section ctx={ctx} />;
      case "morrison": return <MorrisonSection ctx={ctx} />;
      case "strategy": return <StrategySection ctx={ctx} />;
      default: return <OverviewSection />;
    }
  };

  const totalReviewed = Object.values(reviewed).filter(Boolean).length;
  const totalFavorites = Object.values(favorites).filter(Boolean).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: WARM_CREAM, fontFamily: "'Source Serif 4', Georgia, serif", opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Source+Serif+4:wght@300;400;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media print {
          .no-print { display: none !important; }
          .term-card { page-break-inside: avoid; border: 1px solid #ddd !important; margin-bottom: 8px !important; opacity: 1 !important; }
          body { background: white !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(140,21,21,0.15); border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sidebar */}
      <div className="no-print" style={{ width: sidebarOpen ? 220 : 0, minWidth: sidebarOpen ? 220 : 0, background: "white", borderRight: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", transition: "all 0.3s ease", overflow: "hidden", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 800, color: STANFORD_RED, letterSpacing: "-0.02em" }}>ADV 382J</div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#AAA", marginTop: 2 }}>Exam 1 · Spring 2026</div>
          <div style={{ marginTop: 12, fontSize: 11, color: "#888", lineHeight: 1.6 }}>
            <div>Reviewed: {totalReviewed}</div>
            <div>Favorites: {totalFavorites}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {sections.map((s) => (
            <div key={s.id} onClick={() => setActiveSection(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", background: activeSection === s.id ? `${STANFORD_RED}08` : "transparent", borderRight: activeSection === s.id ? `2.5px solid ${STANFORD_RED}` : "2.5px solid transparent", transition: "all 0.15s ease" }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, fontWeight: 700, color: activeSection === s.id ? STANFORD_RED : "#CCC", width: 22, textAlign: "center" }}>{s.icon}</span>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13.5, color: activeSection === s.id ? DEEP_CHARCOAL : "#888", fontWeight: activeSection === s.id ? 600 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 11, color: "#CCC", lineHeight: 1.5 }}>Bella Kang<br />UT Austin · Moody College</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="no-print" style={{ padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(0,0,0,0.04)", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10, flexWrap: "wrap" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#AAA", padding: "4px 8px" }}>
            {sidebarOpen ? "◁" : "▷"}
          </button>
          <input type="text" placeholder="Search terms..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, maxWidth: 300, padding: "6px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, fontFamily: "'Source Serif 4', serif" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()} style={{ padding: "6px 14px", background: STANFORD_RED, color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Source Serif 4', serif" }}>Print</button>
            <button onClick={exportProgress} style={{ padding: "6px 14px", background: UT_BURNT_ORANGE, color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Source Serif 4', serif" }}>Export</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: "32px 40px", maxWidth: 760, margin: "0 auto", width: "100%", animation: "fadeIn 0.3s ease" }} key={activeSection}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
