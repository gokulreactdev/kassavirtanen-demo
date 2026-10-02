# Task Management Dashboard

A task dashboard built for a timed interview exercise. You can create, edit, delete,
search, and filter tasks. The form adapts to the task type (Bug or Feature).

## Tech stack

- React 19 + TypeScript (Vite)
- Redux Toolkit for state, Redux Saga for side effects
- React Hook Form for the task form, including dynamic field arrays
- MSW (Mock Service Worker) as the mock API, persisted in localStorage

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Features

- Create and edit tasks with validation
- Bug tasks have severity, steps to reproduce, and subtasks
- Feature tasks have acceptance criteria
- Filter by project, assignee, status, and type, plus text search
- Delete with a confirmation prompt
- Tasks persist across page reloads

## Architecture

- `src/mocks`: MSW handlers (`GET/POST/PUT/DELETE /api/tasks`, `GET /api/projects`, `GET /api/users`)
- `src/api`: fetch client and typed API calls
- `src/features/tasks`: slices, sagas, selectors, components, and form utilities
- `src/store`: store setup, root saga, and typed hooks

## Data flow

Component dispatches an action, the saga calls the mock API, then dispatches success or
failure, and the reducer updates the state. The create and update sagas also close the
modal after a successful save.
