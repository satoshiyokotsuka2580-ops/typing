TYPE//LAB v13 performance update

Overwrite these files in the existing project:
- src/App.jsx
- src/styles.css
- src/romajiEngine.js

Optimizations:
- Direct window keyboard events instead of hidden-input focus processing
- Cached romaji prefix/completion checks
- Memoized kana display conversion
- Reduced expensive backdrop filtering and transitions during play
- Esc during play returns to ready screen
- Existing generated JMdict data and D1 configuration are not included or overwritten
