import { useCallback } from 'react';
import type { SlideFrame, SlideInteractionState } from '../../types';
import styles from './FractionCompareSlide.module.css';

interface FractionCompareSlideProps {
  frame: SlideFrame;
  interactionState: SlideInteractionState;
  onLeftTap: () => void;
  onRightTap: () => void;
  onLeftHighlight: () => void;
  onRightHighlight: () => void;
}

export function FractionCompareSlide({
  frame,
  interactionState,
  onLeftTap,
  onRightTap,
  onLeftHighlight,
  onRightHighlight,
}: FractionCompareSlideProps) {
  const { leftTapped, rightTapped, leftHighlighted, rightHighlighted } = interactionState;

  // Determine what to show based on frame
  const showRectangles = frame !== 'question';
  const showLeftSplit = leftTapped || frame === 'highlight' || frame === 'compare' || frame === 'celebration';
  const showRightSplit = rightTapped || frame === 'highlight' || frame === 'compare' || frame === 'celebration';
  const showCounts = frame === 'compare' || frame === 'celebration';
  const showAnswer = frame === 'celebration';
  const canTapToSplit = frame === 'cut';
  const canTapToHighlight = frame === 'highlight';

  // Handle rectangle tap based on current frame
  const handleLeftRectTap = useCallback(() => {
    if (canTapToSplit && !leftTapped) {
      onLeftTap();
    } else if (canTapToHighlight && !leftHighlighted) {
      onLeftHighlight();
    }
  }, [canTapToSplit, canTapToHighlight, leftTapped, leftHighlighted, onLeftTap, onLeftHighlight]);

  const handleRightRectTap = useCallback(() => {
    if (canTapToSplit && !rightTapped) {
      onRightTap();
    } else if (canTapToHighlight && !rightHighlighted) {
      onRightHighlight();
    }
  }, [canTapToSplit, canTapToHighlight, rightTapped, rightHighlighted, onRightTap, onRightHighlight]);

  // Render divider lines for split rectangle
  const renderDividers = (count: number) => {
    const dividers = [];
    for (let i = 1; i < count; i++) {
      dividers.push(
        <div
          key={i}
          className={styles.divider}
          style={{ left: `${(i / count) * 100}%` }}
        />
      );
    }
    return dividers;
  };

  // Render the highlighted piece
  const renderHighlightedPiece = (count: number, show: boolean) => {
    if (!show) return null;
    const pieceWidth = 100 / count;
    return (
      <div
        className={styles.highlightedPiece}
        style={{ width: `${pieceWidth}%` }}
      />
    );
  };

  return (
    <div className={styles.slideContainer}>
      {/* Question Area */}
      <div className={styles.questionArea}>
        <span className={styles.questionIcon}>🤔</span>
        <span className={styles.questionText}>Which has MORE pieces?</span>
      </div>

      {/* Visual Area */}
      <div className={styles.visualArea}>
        {/* Left: 1/4 */}
        <div className={styles.fractionColumn}>
          <span className={styles.fractionLabel}>1/4</span>

          {showRectangles && (
            <div
              className={`${styles.rectangle} ${canTapToSplit && !leftTapped ? styles.tapIndicator : ''} ${canTapToHighlight && !leftHighlighted ? styles.tapIndicator : ''}`}
              onClick={handleLeftRectTap}
              role="button"
              tabIndex={0}
              aria-label="Tap to interact with 1/4"
            >
              {showLeftSplit && (
                <div className={styles.splitContainer}>
                  {renderDividers(4)}
                  {renderHighlightedPiece(4, leftHighlighted)}
                </div>
              )}
            </div>
          )}

          {showCounts && (
            <span className={styles.pieceCount}>4 pieces</span>
          )}
        </div>

        {/* Right: 1/6 */}
        <div className={styles.fractionColumn}>
          <span className={styles.fractionLabel}>1/6</span>

          {showRectangles && (
            <div
              className={`${styles.rectangle} ${canTapToSplit && !rightTapped ? styles.tapIndicator : ''} ${canTapToHighlight && !rightHighlighted ? styles.tapIndicator : ''}`}
              onClick={handleRightRectTap}
              role="button"
              tabIndex={0}
              aria-label="Tap to interact with 1/6"
            >
              {showRightSplit && (
                <div className={styles.splitContainer}>
                  {renderDividers(6)}
                  {renderHighlightedPiece(6, rightHighlighted)}
                </div>
              )}
            </div>
          )}

          {showCounts && (
            <span className={styles.pieceCount}>6 pieces</span>
          )}
        </div>
      </div>

      {/* Feedback Area */}
      {showAnswer && (
        <div className={styles.feedbackArea}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.answerText}>1/6 has MORE pieces! 6 is more than 4!</span>
          <span className={styles.sparkle}>✨</span>
        </div>
      )}
    </div>
  );
}
