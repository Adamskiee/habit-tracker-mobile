# Learnings

## Styling

- To stop issue about modals when I want to disappear it without backdrop flickering, I use this:

  ```tsx
    <Modal
    backdropTransitionOutTiming = {10} // this will let the backdrop animate smoothly
    >
  ```
