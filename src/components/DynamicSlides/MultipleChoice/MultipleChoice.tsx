import type { MultipleChoiceConfig, QuestionSlideFrame } from '../../../types';
import styles from './MultipleChoice.module.css';

interface MultipleChoiceProps {
  config: MultipleChoiceConfig;
  frame: QuestionSlideFrame;
  selectedIndex: number | null;
  eliminatedIndices: number[];
  onChoiceTap: (index: number) => void;
}

function CakeVisual({
  totalPieces,
  highlightedPieces,
  pulse,
}: {
  totalPieces: number;
  highlightedPieces: number;
  pulse: boolean;
}) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  const slices = [];
  for (let i = 0; i < totalPieces; i++) {
    const startAngle = (i / totalPieces) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / totalPieces) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const isHighlighted = i < highlightedPieces;

    slices.push(
      <path
        key={i}
        d={`M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
        fill={isHighlighted ? 'var(--coral)' : '#e8e0f0'}
        stroke="var(--purple)"
        strokeWidth="2"
        className={isHighlighted && pulse ? styles.piecePulse : undefined}
      />
    );
  }

  return (
    <svg
      className={`${styles.visual} ${pulse ? styles.visualZoom : ''}`}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
    >
      {slices}
    </svg>
  );
}

function BarVisual({
  totalPieces,
  highlightedPieces,
  pulse,
}: {
  totalPieces: number;
  highlightedPieces: number;
  pulse: boolean;
}) {
  const width = 200;
  const height = 80;
  const sectionWidth = width / totalPieces;

  const sections = [];
  for (let i = 0; i < totalPieces; i++) {
    const isHighlighted = i < highlightedPieces;
    sections.push(
      <rect
        key={i}
        x={i * sectionWidth}
        y={0}
        width={sectionWidth}
        height={height}
        fill={isHighlighted ? 'var(--coral)' : '#f8f4ff'}
        stroke="var(--purple)"
        strokeWidth="2"
        className={isHighlighted && pulse ? styles.piecePulse : undefined}
      />
    );
  }

  return (
    <svg
      className={`${styles.visual} ${pulse ? styles.visualZoom : ''}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      {sections}
    </svg>
  );
}

function FractionDisplay({
  fractionDisplay,
  highlightPosition,
  frame,
  revealLabel,
  bonusLabel,
}: {
  fractionDisplay: string;
  highlightPosition: 'numerator' | 'denominator';
  frame: QuestionSlideFrame;
  revealLabel: string;
  bonusLabel?: string;
}) {
  const [numerator, denominator] = fractionDisplay.split('/');
  const isReveal = frame === 'reveal';

  return (
    <div className={styles.fractionDisplay}>
      {/* Numerator */}
      <div className={styles.fractionRow}>
        {isReveal && highlightPosition === 'numerator' && (
          <span className={styles.revealLabel}>{revealLabel}</span>
        )}
        {isReveal && bonusLabel && highlightPosition === 'denominator' && (
          <span className={`${styles.revealLabel} ${styles.bonusLabel}`}>{bonusLabel}</span>
        )}
        <span
          className={`${styles.fractionNumber} ${
            highlightPosition === 'numerator' ? styles.highlightedNumber : styles.mutedNumber
          }`}
        >
          {numerator}
          {!isReveal && highlightPosition === 'numerator' && (
            <span className={styles.questionMark}>?</span>
          )}
        </span>
      </div>

      {/* Line */}
      <div className={styles.fractionLine} />

      {/* Denominator */}
      <div className={styles.fractionRow}>
        {isReveal && highlightPosition === 'denominator' && (
          <span className={styles.revealLabel}>{revealLabel}</span>
        )}
        {isReveal && bonusLabel && highlightPosition === 'numerator' && (
          <span className={`${styles.revealLabel} ${styles.bonusLabel}`}>{bonusLabel}</span>
        )}
        <span
          className={`${styles.fractionNumber} ${
            highlightPosition === 'denominator' ? styles.highlightedNumber : styles.mutedNumber
          }`}
        >
          {denominator}
          {!isReveal && highlightPosition === 'denominator' && (
            <span className={styles.questionMark}>?</span>
          )}
        </span>
      </div>
    </div>
  );
}

export function MultipleChoice({
  config,
  frame,
  selectedIndex,
  eliminatedIndices,
  onChoiceTap,
}: MultipleChoiceProps) {
  const isScaffold = frame === 'scaffold';
  const isReveal = frame === 'reveal';

  return (
    <div className={styles.slideContainer}>
      {/* Question Pane */}
      <div className={styles.questionArea}>
        <span className={styles.questionIcon}>🤔</span>
        <span className={styles.questionText}>{config.questionText}</span>
      </div>

      {/* Center Area: Visual + Fraction */}
      <div className={styles.centerArea}>
        <div className={styles.visualSide}>
          {config.visual.type === 'cake' ? (
            <CakeVisual
              totalPieces={config.visual.totalPieces}
              highlightedPieces={config.visual.highlightedPieces}
              pulse={isScaffold}
            />
          ) : (
            <BarVisual
              totalPieces={config.visual.totalPieces}
              highlightedPieces={config.visual.highlightedPieces}
              pulse={isScaffold}
            />
          )}

          {/* Scaffold hint bubble — shows per-choice feedback after a wrong tap */}
          {isScaffold && eliminatedIndices.length > 0 && (() => {
            const lastEliminated = eliminatedIndices[eliminatedIndices.length - 1];
            const hint = config.choiceHints?.[lastEliminated] || config.scaffoldHint;
            return (
              <div className={styles.hintBubble} key={`hint-${lastEliminated}`}>
                <span className={styles.hintText}>{hint}</span>
              </div>
            );
          })()}
        </div>

        <div className={styles.fractionSide}>
          <FractionDisplay
            fractionDisplay={config.fractionDisplay}
            highlightPosition={config.highlightPosition}
            frame={frame}
            revealLabel={config.revealLabel}
            bonusLabel={config.bonusLabel}
          />
        </div>
      </div>

      {/* Choice Buttons */}
      <div className={styles.choicesRow}>
        {config.choices.map((choice, index) => {
          const isEliminated = eliminatedIndices.includes(index);
          const isCorrectReveal = isReveal && index === config.correctIndex;
          const isJustEliminated =
            isEliminated && selectedIndex === index;

          let buttonClass = styles.choiceButton;
          if (isCorrectReveal) buttonClass += ` ${styles.correctChoice}`;
          else if (isEliminated) buttonClass += ` ${styles.eliminatedChoice}`;
          if (isJustEliminated) buttonClass += ` ${styles.wobbleAnim}`;

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => onChoiceTap(index)}
              disabled={isEliminated || isReveal}
              aria-label={`Choice: ${choice}`}
            >
              <span className={styles.choiceText}>
                {isCorrectReveal && <span className={styles.checkmark}>✓ </span>}
                {choice}
              </span>
            </button>
          );
        })}
      </div>

      {/* Answer Pane (reveal) */}
      {isReveal && (
        <div className={styles.feedbackArea}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.answerText}>
            That&apos;s right! {config.revealLabel}
          </span>
          <span className={styles.sparkle}>✨</span>
        </div>
      )}
    </div>
  );
}
