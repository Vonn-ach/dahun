Typed access to course content. UI code reads language text only through here.

- `schema.generated.ts`: types for the content files, generated from `schemas/` (`npm run gen:types`; a test fails if it is stale).
- `types.ts`: the bundle the app loads, which is the content files after the status filter (`scripts/build-content.ts`).
- `ContentProvider` + `useCourse(code)` / `useCurrentCourse()`: load a course. They suspend while its bundle loads, so a `<Suspense>` boundary is needed above them (the app layout has one).
- `Course`: `getEntry(id)`, `getUnit(id)`, `getLesson(id)`, `getSentence(id)`, `unitOfEntry(id)`, `getDialect(id)`, `getSource(key)`.
- `generatedSource.ts`: the real bundles in `src/generated/`. Only `App.tsx` imports it; tests pass fixture bundles from `src/test/content.ts` instead.
