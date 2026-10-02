import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  all,
  call,
  put,
  takeEvery,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";
import { metaApi, tasksApi } from "../../api/tasksApi";
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchMetaRequest,
  fetchMetaSuccess,
  fetchMetaFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
} from "./tasksSlice";
import type { Project, Task, TaskPayload, User } from "./types";
import { closeModal } from "./uiSlice";

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

function* fetchTasksWorker(): SagaIterator {
  try {
    const tasks: Task[] = yield call(tasksApi.getAll);
    yield put(fetchTasksSuccess(tasks));
  } catch (err) {
    yield put(fetchTasksFailure(errorMessage(err)));
  }
}

function* fetchMetaWorker(): SagaIterator {
  try {
    const [projects, users]: [Project[], User[]] = yield all([
      call(metaApi.getProjects),
      call(metaApi.getUsers),
    ]);
    yield put(fetchMetaSuccess({ projects, users }));
  } catch (err) {
    yield put(fetchMetaFailure(errorMessage(err)));
  }
}

function* createTaskWorker({
  payload,
}: PayloadAction<TaskPayload>): SagaIterator {
  try {
    const task: Task = yield call(tasksApi.create, payload);
    yield put(createTaskSuccess(task));
    yield put(closeModal());
  } catch (err) {
    yield put(createTaskFailure(errorMessage(err)));
  }
}

function* updateTaskWorker({
  payload,
}: PayloadAction<{ id: string; data: TaskPayload }>): SagaIterator {
  try {
    const task: Task = yield call(tasksApi.update, payload.id, payload.data);
    yield put(updateTaskSuccess(task));
    yield put(closeModal());
  } catch (err) {
    yield put(updateTaskFailure(errorMessage(err)));
  }
}

function* deleteTaskWorker({
  payload: id,
}: PayloadAction<string>): SagaIterator {
  try {
    yield call(tasksApi.remove, id);
    yield put(deleteTaskSuccess(id));
  } catch (err) {
    yield put(deleteTaskFailure(errorMessage(err)));
  }
}

export default function* tasksSaga(): SagaIterator {
  yield takeLatest(fetchTasksRequest.type, fetchTasksWorker);
  yield takeLatest(fetchMetaRequest.type, fetchMetaWorker);
  yield takeLeading(createTaskRequest.type, createTaskWorker); // blocks double submit
  yield takeLeading(updateTaskRequest.type, updateTaskWorker);
  yield takeEvery(deleteTaskRequest.type, deleteTaskWorker);
}
