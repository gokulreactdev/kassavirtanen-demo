import { useEffect } from "react";
import TaskFilters from "./features/tasks/TaskFilters";
import TaskList from "./features/tasks/TaskList";
import TaskModal from "./features/tasks/TaskModal";
import {
  fetchMetaRequest,
  fetchTasksRequest,
} from "./features/tasks/tasksSlice";
import { openCreateModal } from "./features/tasks/uiSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((s) => s.ui.modal.isOpen);

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

      <TaskFilters />
      <TaskList />
      {isModalOpen && <TaskModal />}
    </div>
  );
}
