import type { DynamicSlideTemplate, QuestionSlideFrame, QuestionSlideState } from '../../types';
import { fractionBuilderSlides, multipleChoiceSlides, tapToSelectSlides } from '../../config/dynamicSlideContent';
import { FractionBuilder } from './FractionBuilder/FractionBuilder';
import { MultipleChoice } from './MultipleChoice/MultipleChoice';
import { TapToSelect } from './TapToSelect/TapToSelect';

interface DynamicSlideRendererProps {
  template: DynamicSlideTemplate;
  slideId: string;
  frame: QuestionSlideFrame;
  state: QuestionSlideState;
  onPieceTap: (index: number) => void;
  onChoiceTap: (index: number) => void;
  onOptionTap: (index: number) => void;
}

export function DynamicSlideRenderer({
  template,
  slideId,
  frame,
  state,
  onPieceTap,
  onChoiceTap,
  onOptionTap,
}: DynamicSlideRendererProps) {
  switch (template) {
    case 'fraction-builder': {
      const config = fractionBuilderSlides[slideId];
      if (!config) return null;
      return (
        <FractionBuilder
          config={config}
          frame={frame}
          tappedPieces={state.tappedPieces}
          numeratorFilled={state.numeratorFilled}
          denominatorFilled={state.denominatorFilled}
          onPieceTap={onPieceTap}
        />
      );
    }

    case 'multiple-choice': {
      const config = multipleChoiceSlides[slideId];
      if (!config) return null;
      return (
        <MultipleChoice
          config={config}
          frame={frame}
          selectedIndex={state.selectedIndex}
          eliminatedIndices={state.eliminatedIndices}
          onChoiceTap={onChoiceTap}
        />
      );
    }

    case 'tap-to-select': {
      const config = tapToSelectSlides[slideId];
      if (!config) return null;
      return (
        <TapToSelect
          config={config}
          frame={frame}
          selectedIndex={state.selectedIndex}
          onOptionTap={onOptionTap}
        />
      );
    }

    default:
      return null;
  }
}
