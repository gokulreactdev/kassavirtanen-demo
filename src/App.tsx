import { useEffect } from "react";
import {
  fetchMetaRequest,
  fetchTasksRequest,
} from "./features/tasks/taskSlice";
import { openCreateModal } from "./features/tasks/uiSlice";
import { useAppDispatch } from "./store/hooks";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMetaRequest());
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="panel header">
        <h1>Task Management Dashboard</h1>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(openCreateModal())}
        >
          + Create Task
        </button>
      </header>
    </div>
  );
}
