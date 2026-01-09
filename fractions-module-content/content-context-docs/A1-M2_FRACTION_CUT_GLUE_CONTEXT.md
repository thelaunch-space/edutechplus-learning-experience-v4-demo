# A1.M2 - Fraction Cut and Glue Practice: LLM Context Document

## Concept Overview
This interactive applet teaches fraction concepts through hands-on cutting and coloring activities. Students learn to:
- Understand fractions as parts of a whole through physical manipulation
- Experience how one fraction relates to another (1/2 → 1/4 → 1/6)
- Visualize the concept of "equal parts" through cutting operations
- Connect concrete actions (cutting) to abstract fraction notation

## Core Mathematical Concepts

### 1/4 Formation Journey
- **Starting Point**: Whole square (represents 1 whole)
- **First Action**: Cut whole into 2 equal parts using "scissors-2" (creates two 1/2 pieces)
- **Second Action**: Cut one of the halves using scissors-2 again (dividing 1/2 into two 1/4 pieces)
- **Result**: 3 physical pieces total, but conceptually 4 equal parts (the uncut half represents two 1/4 parts virtually)
- **Visual Reinforcement**: Students color one of the actual quarter pieces to emphasize 1/4

### 1/6 Formation Journey
- **Starting Point**: Whole square
- **First Action**: Cut whole into 2 equal parts using "scissors-2" (creates two 1/2 pieces)
- **Second Action**: Cut each half into 3 equal parts using "scissors-3" (transforming 1/2 into three 1/6 pieces)
- **Result**: 4 physical pieces total, but conceptually 6 equal parts (the uncut half represents three 1/6 parts virtually)
- **Visual Reinforcement**: Students color one of the actual sixth pieces to emphasize 1/6

## Sequential Learning Steps

### Phase 1: Introducing 1/4 (Steps 0-6)

**Step 0 - Introduction**
- Hook: "We know one cut with scissors-2 gave us 1/2"
- Curiosity question: "What happens if we use scissors-2 a second time?"
- Purpose: Builds on prior knowledge and creates anticipation

**Step 1 - Setup and First Cut**
- Interface provides: Pre-cut paper showing 2 equal halves (visual grid)
- Available tools: Scissors-2 and Scissors-3 (but Scissors-3 is a distractor)
- Color palette hidden (not needed yet)
- Instruction: "Use the same scissors-2 again — this time to cut any of the two parts"

**Step 2 - Second Cut Implementation**
- Student must: Click scissors-2 tool, then click on one of the visible half pieces
- Action: The selected half gets cut into 2 smaller equal parts (creating physical quarters)
- Result: 3 visible pieces (2 quarters + 1 remaining half)
- Key pedagogical point: The uncut half represents two virtual quarters

**Step 3 - Coloring Activity**
- Interface shows: Color palette becomes active
- Available colors: Yellow, Red, Pink, Purple
- Instruction: "Pick a color and click on the part you just split"
- Purpose: Creates visual anchor for the fraction concept

**Step 4 - Comprehension Check (Multiple Choice)**
- Question: "How many of the equal parts form the whole?"
- Options: 3, 4, 5
- Correct Answer: 4
- Learning verification: Ensures student understands that the uncut half counts as 2 equal parts

**Step 5 - Conceptual Observation**
- Interface shows: Numbered sequence appears on all pieces
- Purpose: Makes the 4-part structure explicit and visible

**Step 6 - Fraction Introduction**
- Key moment: "One out of four equal parts is colored — that represents 1/4"
- Bridge to abstraction: Connects concrete (colored piece) to symbolic (1/4 notation)

### Phase 2: Introducing 1/6 (Steps 7-13)

**Step 7 - Transition**
- Hook: "You discovered 1/4!"
- Challenge: "Now let's create a new fraction, 1/6, by using scissors-2 and scissors-3"
- Purpose: Builds confidence and introduces next challenge

**Step 8 - Setup for 1/6**
- Fresh interface: New whole square
- Available tools: Both scissors-2 and scissors-3 (both needed this time)
- Strategic element: Students must understand when to use which tool

**Step 9 - First Cut for 1/6**
- Action: Use scissors-2 to cut whole square into 2 equal halves
- Result: Two 1/2 pieces visible (same as first phase)

**Step 10 - Second Cut for 1/6**
- Critical thinking: Must switch to scissors-3 (scissors-2 would be incorrect)
- Action: Use scissors-3 to cut each remaining half into 3 equal parts
- Visual complexity: This creates more physical pieces than the 1/4 example
- Error handling: If student uses wrong scissors, clear feedback guides correction

**Step 11 - Coloring for 1/6**
- Similar to phase 1: Choose color and apply to one of the smaller pieces
- Reinforcement: One colored piece out of six equal parts

**Step 12 - Comprehension Check**
- Question: "You filled in one part out of 6 equal parts — What fraction is that?"
- Options: 1/4, 1/6, 1/2
- Correct Answer: 1/6
- Purpose: Confirms understanding of the more complex 1/6 concept

**Step 13 - Conclusion**
- Summary: Reiterates discovery of both 1/4 and 1/6
- Achievement celebration: Positive reinforcement of learning success
- Loop option: "Start Over" allows repetition for reinforcement

## Instructional Strategies

### Scaffolding Approach
1. **Concrete First**: Always starts with physical manipulation (cutting)
2. **Visual Reinforcement**: Immediate coloring to create visual memory
3. **Abstract Connection**: Fraction notation introduced only after concrete experience
4. **Verification**: Multiple choice questions ensure comprehension

### Error Prevention & Feedback
- **Tool-specific scissors**: Scissors-2 vs Scissors-3 with distinct behaviors
- **Immediate correction**: Wrong tool selection triggers helpful error message
- **Reset functionality**: Allows fresh attempt without penalty
- **Character feedback**: Animated character provides emotional support

### Multiple Representation Strategy
- **Visual**: Physical cutting of paper pieces
- **Numerical**: Numbered sequence showing parts
- **Symbolic**: Standard fraction notation (1/4, 1/6)
- **Linguistic**: Clear verbal instructions connecting actions to concepts

## Error Scenarios & Learning Moments

### Common Student Misconceptions Addressed
1. **"Only visible pieces count"**: The applet explicitly addresses this by numbering virtual parts
2. **"Any cut creates equal parts"**: Demonstrates that specific tools create specific numbers of equal parts
3. **"Bigger pieces mean bigger fractions"**: Shows that 1/6 pieces are smaller than 1/4 pieces but represent smaller fractions

### Adaptive Feedback System
- **Wrong tool selection**: Clear explanation of why tool is inappropriate
- **Incorrect MCQ answer**: Allows multiple attempts without penalty
- **Progressive hinting**: Interface guides attention to correct next step

## Technical Implementation Notes

### State Management
- Current step tracking (0-13)
- Tool selection state (scissors-2, scissors-3, colors)
- Paper piece state (original, cut, colored)
- Animation state management (prevents disruption during transitions)

### Visual Design Elements
- **Grid System**: Uses CSS grid to maintain equal proportions during cuts
- **Color Coding**: Consistent use of blue paper with orange borders
- **Animation Timing**: 0.5-1 second delays create smooth, comprehensible transitions
- **Character Integration**: Cavy character provides emotional connection and feedback

This applet serves as foundational experience for understanding unit fractions (1/n) through concrete manipulation, preparing students for more complex fraction concepts in subsequent applets.
