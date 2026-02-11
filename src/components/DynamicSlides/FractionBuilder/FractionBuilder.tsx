import type { FractionBuilderConfig, QuestionSlideFrame } from '../../../types';
import styles from './FractionBuilder.module.css';

interface FractionBuilderProps {
  config: FractionBuilderConfig;
  frame: QuestionSlideFrame;
  tappedPieces: number[];
  numeratorFilled: boolean;
  denominatorFilled: boolean;
  onPieceTap: (index: number) => void;
}

// Get the order number for a tapped piece (1-based)
function getTapOrder(index: number, tappedPieces: number[]): number | null {
  const position = tappedPieces.indexOf(index);
  return position >= 0 ? position + 1 : null;
}

// Build an SVG path for a pizza wedge slice
function pizzaSlicePath(index: number, total: number, radius: number, cx: number, cy: number): string {
  const angleStart = (index / total) * 2 * Math.PI - Math.PI / 2;
  const angleEnd = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2;
  const x1 = cx + radius * Math.cos(angleStart);
  const y1 = cy + radius * Math.sin(angleStart);
  const x2 = cx + radius * Math.cos(angleEnd);
  const y2 = cy + radius * Math.sin(angleEnd);
  const largeArc = total <= 2 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// Get the center point of a pizza slice for placing badges
function sliceCenter(index: number, total: number, radius: number, cx: number, cy: number): { x: number; y: number } {
  const angleMid = ((index + 0.5) / total) * 2 * Math.PI - Math.PI / 2;
  const r = radius * 0.55;
  return {
    x: cx + r * Math.cos(angleMid),
    y: cy + r * Math.sin(angleMid),
  };
}

export function FractionBuilder({
  config,
  frame,
  tappedPieces,
  numeratorFilled,
  denominatorFilled,
  onPieceTap,
}: FractionBuilderProps) {
  const { shape, totalPieces, highlightedPieces, fractionAnswer, fractionLabel, questionText } = config;
  const [numerator, denominator] = fractionAnswer.split('/');

  const isScaffold = frame === 'scaffold';
  const isReveal = frame === 'reveal';

  // Determine which phase of scaffold we're in
  const scaffoldPhase: 'numerator' | 'denominator' | 'done' =
    isScaffold && !numeratorFilled ? 'numerator' :
    isScaffold && !denominatorFilled ? 'denominator' : 'done';

  // Determine scaffold instruction text
  const scaffoldText =
    scaffoldPhase === 'numerator' ? 'Tap the colored pieces to count!' :
    scaffoldPhase === 'denominator' ? 'Now tap ALL pieces!' : '';

  // Determine if a piece is tappable
  function isPieceTappable(index: number): boolean {
    if (tappedPieces.includes(index)) return false;
    if (frame === 'question') return false;
    if (isReveal) return false;

    if (isScaffold) {
      if (scaffoldPhase === 'numerator') return index < highlightedPieces;
      if (scaffoldPhase === 'denominator') return true;
      return false;
    }
    return false;
  }

  // Determine pulse strength
  function getPulseClass(index: number): string {
    if (!isPieceTappable(index)) return '';
    if (isScaffold) {
      return shape === 'pizza' ? styles.pizzaSliceStrongPulse : styles.barSectionStrongPulse;
    }
    return shape === 'pizza' ? styles.pizzaSlicePulse : styles.barSectionPulse;
  }

  // Render pizza shape
  function renderPizza() {
    const svgSize = 200;
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    const radius = 90;

    return (
      <div className={styles.pizzaContainer}>
        <svg className={styles.pizzaSvg} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          {Array.from({ length: totalPieces }, (_, i) => {
            const isHighlighted = i < highlightedPieces;
            const isTapped = tappedPieces.includes(i);
            const tappable = isPieceTappable(i);
            const tapOrder = getTapOrder(i, tappedPieces);
            const center = sliceCenter(i, totalPieces, radius, cx, cy);
            const pulseClass = getPulseClass(i);

            return (
              <g key={i}>
                <path
                  d={pizzaSlicePath(i, totalPieces, radius, cx, cy)}
                  className={[
                    styles.pizzaSlice,
                    isHighlighted ? styles.pizzaSliceHighlighted : styles.pizzaSliceMuted,
                    tappable ? styles.pizzaSliceTappable : '',
                    isTapped ? styles.pizzaSliceTapped : '',
                    pulseClass,
                  ].filter(Boolean).join(' ')}
                  onClick={tappable ? () => onPieceTap(i) : undefined}
                  role={tappable ? 'button' : undefined}
                  tabIndex={tappable ? 0 : undefined}
                  aria-label={tappable ? `Tap piece ${i + 1}` : undefined}
                />
                {tapOrder !== null && (
                  <>
                    <circle
                      className={styles.numberBadgeBg}
                      cx={center.x}
                      cy={center.y}
                      r={14}
                    />
                    <text
                      className={styles.numberBadge}
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {tapOrder}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Render bar shape
  function renderBar() {
    return (
      <div className={styles.barContainer}>
        {Array.from({ length: totalPieces }, (_, i) => {
          const isHighlighted = i < highlightedPieces;
          const isTapped = tappedPieces.includes(i);
          const tappable = isPieceTappable(i);
          const tapOrder = getTapOrder(i, tappedPieces);
          const pulseClass = getPulseClass(i);

          return (
            <div
              key={i}
              className={[
                styles.barSection,
                isHighlighted ? styles.barSectionHighlighted : styles.barSectionMuted,
                tappable ? styles.barSectionTappable : '',
                isTapped ? styles.barSectionTapped : '',
                pulseClass,
              ].filter(Boolean).join(' ')}
              onClick={tappable ? () => onPieceTap(i) : undefined}
              role={tappable ? 'button' : undefined}
              tabIndex={tappable ? 0 : undefined}
              aria-label={tappable ? `Tap piece ${i + 1}` : undefined}
            >
              {tapOrder !== null && (
                <div className={styles.barBadge}>{tapOrder}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Determine what to show in fraction slots
  const showNumerator = numeratorFilled || isReveal;
  const showDenominator = denominatorFilled || isReveal;

  return (
    <div className={styles.slideContainer}>
      {/* Question Pane */}
      <div className={styles.questionArea}>
        <span className={styles.questionIcon}>🤔</span>
        <span className={styles.questionText}>{questionText}</span>
      </div>

      {/* Scaffold instruction */}
      {isScaffold && scaffoldPhase !== 'done' && (
        <div className={styles.scaffoldLabel}>{scaffoldText}</div>
      )}

      {/* Visual Area */}
      <div className={styles.visualArea}>
        {shape === 'pizza' ? renderPizza() : renderBar()}

        {/* Fraction Builder */}
        <div className={`${styles.fractionBuilder} ${isReveal ? styles.fractionBuilderGlow : ''}`}>
          <span className={`${styles.fractionSlot} ${showNumerator ? styles.fractionSlotFilled : styles.fractionSlotEmpty}`}>
            {showNumerator ? numerator : '___'}
          </span>
          <span className={styles.fractionDivider}>/</span>
          <span className={`${styles.fractionSlot} ${showDenominator ? styles.fractionSlotFilled : styles.fractionSlotEmpty}`}>
            {showDenominator ? denominator : '___'}
          </span>
        </div>
      </div>

      {/* Answer Pane - only on reveal */}
      {isReveal && (
        <div className={styles.answerArea}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.answerText}>{fractionLabel}</span>
          <span className={styles.sparkle}>✨</span>
        </div>
      )}
    </div>
  );
}
