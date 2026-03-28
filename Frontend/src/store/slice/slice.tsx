import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
  discription: string;
  status: 'yet' | 'ongoing' | 'completed';
  dueDate: string;
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {

    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

  updateTask: (state, action: PayloadAction<Task>) => {
  state.tasks = state.tasks.map(task =>
    Number(task.id) === Number(action.payload.id) ? action.payload : task);
  },
  deleteTask: (state, action: PayloadAction<number>) => {
  state.tasks = state.tasks.filter(t => Number(t.id) !== Number(action.payload));
},
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
