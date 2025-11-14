# Planner task ordering manual test

These steps confirm that tasks without a due date remain at the end of the planner list.

1. Launch the application and navigate to the Planner screen.
2. Create three tasks with the following properties:
   - Task A: set a due date in the past (e.g. yesterday).
   - Task B: set a due date in the future (e.g. tomorrow).
   - Task C: leave the due date empty.
3. Observe the list ordering:
   - Task A appears first because it is overdue but not marked as done.
   - Task B appears after Task A because it has a due date in the future.
   - Task C appears last because tasks without due dates are sorted to the end of the list.
4. Mark Task A as done and verify the ordering updates to:
   - Task B first (undone with a due date).
   - Task C last (no due date).
5. Optionally add more undated tasks and confirm they continue to appear after all tasks with due dates when they share the same completion state.

This validates that the `ORDER BY done ASC, due_at IS NULL ASC, due_at ASC, id DESC` clause keeps undated tasks at the end.
