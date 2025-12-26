# Tasks: Feature 003 - Ranking Element

## Phase 1: Setup
- [x] T001 Create `src/lib/elements/types/RankingItem.tsx` skeleton
- [x] T002 Create `src/lib/__tests__/ranking.test.tsx` skeleton

## Phase 2: Foundational
- [x] T003 [P] Add CSS variables for ranking in `src/style.css`
- [x] T004 Refactor `src/lib/elements/types/RankingElement.tsx` to prepare for Reorder components

## Phase 3: User Story 1 - Drag & Drop (P1)
**Goal**: Enable drag-and-drop reordering using `motion/react`.
**Independent Test**: Verify items can be reordered and `question.value` updates.

- [x] T005 [US1] Implement `RankingItem` with `Reorder.Item` in `src/lib/elements/types/RankingItem.tsx`
- [x] T006 [US1] Implement `RankingElement` with `Reorder.Group` in `src/lib/elements/types/RankingElement.tsx`
- [x] T007 [US1] Implement `onReorder` logic to update SurveyJS model in `src/lib/elements/types/RankingElement.tsx`
- [x] T008 [US1] Add unit test for basic ranking behavior in `src/lib/__tests__/ranking.test.tsx`

## Phase 4: User Story 2 - Select to Rank Mode (P2)
**Goal**: Implement alternative selection mode with two lists (Source/Target).
**Independent Test**: Verify items move between lists on click.

- [x] T009 [US2] Update `RankingElement` to handle `selectToRankEnabled` logic in `src/lib/elements/types/RankingElement.tsx`
- [x] T010 [US2] Implement Source (Unranked) and Target (Ranked) lists rendering in `src/lib/elements/types/RankingElement.tsx`
- [x] T011 [US2] Update `RankingItem` to support click interactions (add/remove) in `src/lib/elements/types/RankingItem.tsx`
- [x] T012 [US2] Implement layout styles (horizontal/vertical) for select-to-rank in `src/style.css`
- [x] T013 [US2] Add unit test for select-to-rank behavior in `src/lib/__tests__/ranking.test.tsx`

## Phase 5: User Story 3 - Mobile Long Tap (P3)
**Goal**: Prevent accidental drags on mobile by requiring long tap.
**Independent Test**: Verify drag only starts after long press when configured.

- [x] T014 [US3] Add `longTap` prop handling in `RankingElement` and pass to `RankingItem` in `src/lib/elements/types/RankingElement.tsx`
- [x] T015 [US3] Implement `useDragControls` and long press logic in `src/lib/elements/types/RankingItem.tsx`
- [x] T016 [US3] Add unit test for long tap configuration in `src/lib/__tests__/ranking.test.tsx`

## Phase 6: Polish & Cross-Cutting Concerns
- [x] T017 Verify accessibility attributes (aria-labels, roles) in `src/lib/elements/types/RankingItem.tsx`
- [x] T018 Final style adjustments for ranking visuals in `src/style.css`

## Dependencies
- US1 (Drag & Drop) is the base implementation.
- US2 (Select to Rank) branches logic in the main component.
- US3 (Long Tap) enhances the item component.

## Parallel Execution
- T003 (CSS) can be done alongside T001/T002.
- T012 (Layout Styles) can be done alongside T009/T010.
