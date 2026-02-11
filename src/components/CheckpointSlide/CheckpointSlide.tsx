import type { CheckpointId, CheckpointFrame } from '../../types';
import { checkpointVisuals } from '../../config/checkpointContent';
import styles from './CheckpointSlide.module.css';

interface CheckpointSlideProps {
  checkpointId: CheckpointId;
  frame: CheckpointFrame;
}

function PizzaVisual({ pieces, highlighted, frame }: { pieces: number; highlighted: number; frame: CheckpointFrame }) {
  const sliceAngle = 360 / pieces;
  const showHighlight = frame === 'scaffold' || frame === 'celebration';

  return (
    <div className={styles.pizzaContainer}>
      <div className={styles.pizza}>
        {Array.from({ length: pieces }).map((_, i) => {
          const isHighlighted = showHighlight && i < highlighted;
          const startAngle = i * sliceAngle;
          const endAngle = startAngle + sliceAngle;
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;
          const x1 = 50 + 50 * Math.cos(startRad);
          const y1 = 50 + 50 * Math.sin(startRad);
          const x2 = 50 + 50 * Math.cos(endRad);
          const y2 = 50 + 50 * Math.sin(endRad);
          const largeArc = sliceAngle > 180 ? 1 : 0;
          const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

          return (
            <svg key={i} className={styles.pizzaSlice} viewBox="0 0 100 100" style={{ animationDelay: `${i * 0.1}s` }}>
              <path
                d={d}
                className={isHighlighted ? styles.sliceHighlighted : styles.sliceNormal}
              />
              <line x1="50" y1="50" x2={x1} y2={y1} stroke="rgba(0,180,255,0.4)" strokeWidth="1" />
            </svg>
          );
        })}
      </div>
    </div>
  );
}

function FractionNotationVisual({ pieces, highlighted, frame }: { pieces: number; highlighted: number; frame: CheckpointFrame }) {
  const showHighlight = frame === 'scaffold' || frame === 'celebration';

  return (
    <div className={styles.notationContainer}>
      <div className={styles.fractionNotation}>
        <span className={`${styles.numerator} ${showHighlight ? styles.numeratorHighlighted : ''}`}>
          {highlighted}
        </span>
        <div className={styles.fractionLine} />
        <span className={styles.denominator}>{pieces}</span>
      </div>
      {showHighlight && (
        <div className={styles.notationLabel}>
          <span className={styles.arrowUp}>&#8593;</span>
          <span className={styles.labelText}>pieces we HAVE</span>
        </div>
      )}
    </div>
  );
}

function ChocolateBarVisual({ pieces, highlighted, frame }: { pieces: number; highlighted: number; frame: CheckpointFrame }) {
  const showHighlight = frame === 'scaffold' || frame === 'celebration';

  return (
    <div className={styles.chocolateContainer}>
      <div className={styles.chocolateBar}>
        {Array.from({ length: pieces }).map((_, i) => {
          const isHighlighted = showHighlight && i < highlighted;
          return (
            <div
              key={i}
              className={`${styles.chocolatePiece} ${isHighlighted ? styles.pieceHighlighted : styles.pieceNormal}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CheckpointSlide({ checkpointId, frame }: CheckpointSlideProps) {
  const visual = checkpointVisuals[checkpointId];

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${frame === 'celebration' ? styles.cardCelebration : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.star}>&#9733;</span>
          <h1 className={styles.title}>Checkpoint!</h1>
          <span className={styles.star}>&#9733;</span>
        </div>

        <div className={styles.divider} />

        {/* Visual object */}
        <div className={`${styles.visualArea} ${frame !== 'intro' ? styles.visualVisible : ''}`}>
          {visual.type === 'pizza' && (
            <PizzaVisual pieces={visual.pieces} highlighted={visual.highlighted} frame={frame} />
          )}
          {visual.type === 'fraction-notation' && (
            <FractionNotationVisual pieces={visual.pieces} highlighted={visual.highlighted} frame={frame} />
          )}
          {visual.type === 'chocolate-bar' && (
            <ChocolateBarVisual pieces={visual.pieces} highlighted={visual.highlighted} frame={frame} />
          )}
        </div>

        {/* Question text - appears in question frame */}
        {(frame === 'question' || frame === 'scaffold' || frame === 'celebration') && (
          <div className={styles.questionBubble}>
            <span className={styles.questionText}>{visual.questionText}</span>
          </div>
        )}

        {/* Scaffold hint */}
        {frame === 'scaffold' && (
          <div className={styles.scaffoldHint}>
            <span className={styles.hintIcon}>&#128161;</span>
            <span className={styles.hintText}>{visual.scaffoldHint}</span>
          </div>
        )}

        {/* Celebration result */}
        {frame === 'celebration' && (
          <div className={styles.celebrationArea}>
            <div className={styles.fractionResult}>
              <span className={styles.resultText}>{visual.celebrationText}</span>
            </div>
            <div className={styles.successBadge}>
              <span className={styles.checkmark}>&#10003;</span>
            </div>
          </div>
        )}

        {/* Prompt */}
        {frame === 'intro' && <p className={styles.prompt}>Listen to Max!</p>}
      </div>
    </div>
  );
}
