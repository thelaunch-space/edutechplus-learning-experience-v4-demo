import type { TapToSelectConfig, QuestionSlideFrame } from '../../../types';
import styles from './TapToSelect.module.css';

interface TapToSelectProps {
  config: TapToSelectConfig;
  frame: QuestionSlideFrame;
  selectedIndex: number | null;
  onOptionTap: (index: number) => void;
}

/** Hardcoded unequal widths to make unfair splits visually obvious */
const UNEQUAL_WIDTHS: Record<number, number[]> = {
  2: [65, 35],
  3: [45, 20, 35],
  4: [35, 15, 30, 20],
  5: [30, 12, 25, 18, 15],
  6: [25, 10, 22, 15, 12, 16],
};

function getWidths(totalPieces: number, isEqual: boolean): number[] {
  if (isEqual) {
    const w = 100 / totalPieces;
    return Array.from({ length: totalPieces }, () => w);
  }
  return UNEQUAL_WIDTHS[totalPieces] ?? Array.from({ length: totalPieces }, () => 100 / totalPieces);
}

function BarDiagram({
  totalPieces,
  highlightedPieces,
  displayedPieces,
  isEqual,
  small,
}: {
  totalPieces: number;
  highlightedPieces: number;
  displayedPieces?: number;
  isEqual: boolean;
  small?: boolean;
}) {
  const actualPieces = displayedPieces ?? totalPieces;
  const widths = getWidths(actualPieces, isEqual);

  return (
    <div className={`${styles.bar} ${small ? styles.barSmall : ''}`}>
      {widths.map((w, i) => (
        <div
          key={i}
          className={`${styles.barSection} ${i < highlightedPieces ? styles.barHighlighted : styles.barEmpty}`}
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export function TapToSelect({
  config,
  frame,
  selectedIndex,
  onOptionTap,
}: TapToSelectProps) {
  const isQuestion = frame === 'question';
  const isScaffold = frame === 'scaffold';
  const isReveal = frame === 'reveal';

  return (
    <div className={styles.slideContainer}>
      {/* Question Pane */}
      <div className={styles.questionArea}>
        <span className={styles.questionIcon}>🔍</span>
        <span className={styles.questionText}>{config.questionText}</span>
      </div>

      {/* Option Cards */}
      <div className={styles.optionsArea}>
        {config.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = option.isCorrect;
          const otherIndex = index === 0 ? 1 : 0;
          const isOther = selectedIndex === otherIndex;

          // Determine card state class
          let cardClass = styles.optionCard;

          if (isReveal) {
            cardClass += isCorrect ? ` ${styles.cardCorrect}` : ` ${styles.cardWrong}`;
          } else if (isScaffold && isSelected && !isCorrect) {
            // Student tapped this wrong option (it was truly incorrect)
            cardClass += ` ${styles.cardWobble}`;
          } else if (isScaffold && isSelected && isCorrect) {
            // Student tapped this but question was "find the mistake" — this was actually correct
            cardClass += ` ${styles.cardCorrect}`;
          } else if (isScaffold && isOther) {
            // The other untapped card — make it pulse stronger
            cardClass += ` ${styles.cardPulseStrong}`;
          } else if (isQuestion) {
            cardClass += ` ${styles.cardTappable}`;
          }

          const isTappable = isQuestion || (isScaffold && !isSelected);

          return (
            <div key={index} className={styles.optionWrapper}>
              <button
                className={cardClass}
                onClick={() => isTappable ? onOptionTap(index) : undefined}
                disabled={!isTappable}
                aria-label={`Option: ${option.label}`}
              >
                {/* Badge on reveal */}
                {isReveal && (
                  <span className={isCorrect ? styles.badgeCorrect : styles.badgeWrong}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
                {/* Checkmark on scaffold if tapped correct */}
                {isScaffold && isSelected && isCorrect && (
                  <span className={styles.badgeCorrect}>✓</span>
                )}

                <span className={styles.optionLabel}>{option.label}</span>

                <BarDiagram
                  totalPieces={option.visual.totalPieces}
                  highlightedPieces={option.visual.highlightedPieces}
                  displayedPieces={option.visual.displayedPieces}
                  isEqual={option.visual.isEqual}
                />
              </button>

              {/* Scaffold hint below wrong-tapped card */}
              {isScaffold && isSelected && !isCorrect && (
                <div className={styles.hintBubble}>
                  <span className={styles.hintText}>{config.wrongFeedback}</span>
                </div>
              )}

              {/* Corrected diagram on reveal for "wrong diagram" options */}
              {isReveal && !isCorrect && option.visual.displayedPieces != null && (
                <div className={styles.correctedArea}>
                  <span className={styles.correctedLabel}>Correct:</span>
                  <BarDiagram
                    totalPieces={option.visual.totalPieces}
                    highlightedPieces={option.visual.highlightedPieces}
                    isEqual={true}
                    small
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback Pane (reveal only) */}
      {isReveal && (
        <div className={styles.feedbackArea}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.answerText}>{config.revealText}</span>
          <span className={styles.sparkle}>✨</span>
        </div>
      )}
    </div>
  );
}
