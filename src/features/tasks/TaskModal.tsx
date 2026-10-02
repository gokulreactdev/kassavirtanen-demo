import { useCallback } from 'react';
import Modal from '../../components/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import TaskForm from './TaskForm';
import { selectEditingTask } from './selectors';
import { closeModal } from './uiSlice';

export default function TaskModal() {
  const dispatch = useAppDispatch();
  const editingTask = useAppSelector(selectEditingTask);
  const onClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  return (
    <Modal title={editingTask ? 'Edit Task' : 'Create New Task'} onClose={onClose}>
      <TaskForm task={editingTask} onCancel={onClose} />
    </Modal>
  );
}