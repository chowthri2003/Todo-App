import { useState, useEffect, useReducer } from 'react';
import { Plus, Trash2, UserPen, TableProperties, GripVertical, Calendar, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { axiosInstance } from '@/lib/axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTasks, addTask, updateTask, deleteTask } from '../store/slice/slice';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { themes } from '../lib/themes';
import { useTheme } from '../context/ThemeContext';
import { useUser, UserButton } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type Status = 'yet' | 'ongoing' | 'completed';

type FormState = {
  open: boolean;
  editingId: number | null;
  title: string;
  desc: string;
  status: Status;
  dueDate: string;
};

type FormAction =
  | { type: "OPEN_NEW" }
  | { type: "OPEN_EDIT"; task: any }
  | { type: "CLOSE" }
  | { type: "SET_TITLE"; value: string }
  | { type: "SET_DESC"; value: string }
  | { type: "SET_STATUS"; value: Status }
  | { type: "SET_DUEDATE"; value: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "OPEN_NEW":
      return { open: true, editingId: null, title: "", desc: "", status: "yet", dueDate: "" };

    case "OPEN_EDIT":
      return {
        open: true,
        editingId: action.task.id,
        title: action.task.title,
        desc: action.task.discription,
        status: action.task.status,
        dueDate: action.task.dueDate ? new Date(action.task.dueDate).toISOString().slice(0, 16) : ""
      };

    case "CLOSE":
      return { ...state, open: false };

    case "SET_TITLE":
      return { ...state, title: action.value };

    case "SET_DESC":
      return { ...state, desc: action.value };

    case "SET_STATUS":
      return { ...state, status: action.value };

    case "SET_DUEDATE":
      return { ...state, dueDate: action.value }

    default:
      return state;
  }
}

export default function TaskBoard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tasks = useAppSelector((state) => state.task.tasks);
  const { user } = useUser();
  const [form, dispatchForm] = useReducer(formReducer, {
    open: false,
    editingId: null,
    title: "",
    desc: "",
    status: "yet",
    dueDate: "",
  });

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchTasks();
  }, []);

 const fetchTasks = async () => {
  try {
    const res = await axiosInstance.get("/task");
    dispatch(setTasks(res.data.data));
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to load tasks";

    toast.error(message);
  }
};

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as Status;
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      const updatedTask = { ...task, status: newStatus };
      dispatch(updateTask(updatedTask));

      try {
        await axiosInstance.put(`/task/${taskId}`, { status: newStatus });
      } catch (error) {
        toast.error("Failed to update status");
        fetchTasks();
      }
    }
  };

  const openModal = (task?: any) => {
    if (task) dispatchForm({ type: "OPEN_EDIT", task });
    else dispatchForm({ type: "OPEN_NEW" });
  };

  const saveTask = async () => {
    const data = { title: form.title, discription: form.desc, status: form.status, dueDate: form.dueDate || null };
    try {
      if (form.editingId) {
        const res = await axiosInstance.put(`/task/${form.editingId}`, data);
        dispatch(updateTask(res.data.data));
        toast.success("Task updated successfully");
      } else {
        const res = await axiosInstance.post(`/task`, data);
        dispatch(addTask(res.data.data));
        toast.success("Task created successfully");
      }
      dispatchForm({ type: "CLOSE" });
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  const handleDelete = (id: number) => {
    toast("Delete this task?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axiosInstance.delete(`/task/${id}`);
            dispatch(deleteTask(id));
            toast.success("Task deleted successfully");
          } catch (error) {
            toast.error("Failed to delete task");
          }
        },
      },
    });
  };

  const formatUpperCase = (value: string) => {
    return value
      .replace(/[^A-Za-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart()
      .toUpperCase();
  };
  const formatSentenceCase = (value: string) => {
    if (!value) return '';
    return value
      .replace(/\s+/g, ' ')
      .trimStart()
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
  };
const isFormValid =
  form.title.trim().length > 0 &&
  form.desc.trim().length > 0 &&
  form.dueDate !== "";

  const getStatusInfo = (status: Status) => {
    switch (status) {
      case 'yet': return { label: 'To Do', icon: <ListTodo className="w-4 h-4" />, color: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
      case 'ongoing': return { label: 'In Progress', icon: <Clock className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'completed': return { label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-green-50 text-green-600 border-green-100' };
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans transition-colors duration-300"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
      }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: theme.colors.text }}>
              {user?.firstName}'s Board
            </h1>
            <p className="text-sm opacity-60 font-medium">Manage your daily activities</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-white/5 backdrop-blur-sm p-1 rounded-lg border border-white/10 mr-2">
            {themes.map(t => (
              <button
                key={t.name}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${theme.name === t.name ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                style={{ background: t.colors.accent }}
                title={t.name}
              />
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => navigate('/task')} className="gap-2 font-bold uppercase text-[10px]">
            <TableProperties className="w-4 h-4" /> List View
          </Button>
          
          <Button size="sm" onClick={() => openModal()} className="gap-2 font-bold uppercase text-[10px] bg-primary shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {(['yet', 'ongoing', 'completed'] as Status[]).map(colId => {
            const statusInfo = getStatusInfo(colId);
            const columnTasks = tasks.filter(t => t.status === colId);
            
            return (
              <div key={colId} className="flex flex-col h-full min-h-[600px]">
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-md ${statusInfo.color.split(' ')[0]} ${statusInfo.color.split(' ')[1]}`}>
                      {statusInfo.icon}
                    </span>
                    <h2 className="text-xs font-black uppercase tracking-widest opacity-70">
                      {statusInfo.label}
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold px-2 py-0">
                    {columnTasks.length}
                  </Badge>
                </div>

                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <ScrollArea className="flex-1 -mx-2 px-2">
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 space-y-4 min-h-[500px] transition-all rounded-xl p-2 border-2 border-dashed 
                          ${snapshot.isDraggingOver ? 'bg-primary/5 border-primary/20' : 'border-transparent'}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(p, s) => (
                              <Card
                                ref={p.innerRef}
                                {...p.draggableProps}
                                className={`group relative border-none shadow-sm transition-all hover:shadow-md 
                                  ${s.isDragging ? 'shadow-2xl ring-2 ring-primary scale-[1.02] rotate-1' : ''}`}
                              >
                                <div {...p.dragHandleProps} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground/30 hover:text-primary">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                
                                <CardHeader className="p-4 pb-2 ml-4">
                                  <CardTitle className="text-sm font-bold tracking-tight italic uppercase truncate">
                                    {task.title}
                                  </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="p-4 pt-0 ml-4 pb-4">
                                  <p className="text-xs text-muted-foreground line-clamp-2 italic font-medium">
                                    {task.discription}
                                  </p>
                                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-orange-500/80 uppercase">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                  </div>
                                </CardContent>
                                
                                <CardFooter className="p-2 pt-0 justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all ml-4">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500/70 hover:text-blue-600 hover:bg-blue-50" onClick={() => openModal(task)}>
                                    <UserPen className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(task.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted/20 rounded-xl text-muted-foreground/30">
                            <ListTodo className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Tasks</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <Dialog open={form.open} onOpenChange={(open) => !open && dispatchForm({ type: "CLOSE" })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic tracking-tighter text-xl">
              {form.editingId ? 'Edit Task' : 'Create Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-50 ml-1">Title</label>
              <Input
                value={form.title}
                onChange={e => dispatchForm({ type: "SET_TITLE", value: formatUpperCase(e.target.value) })}
                placeholder="WHAT NEEDS TO BE DONE?"
                className="font-bold uppercase tracking-tight"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-50 ml-1">Status</label>
                <Select value={form.status} onValueChange={(v) => dispatchForm({ type: "SET_STATUS", value: v as Status })}>
                  <SelectTrigger className="font-bold uppercase text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yet" className="font-bold uppercase text-xs">To Do</SelectItem>
                    <SelectItem value="ongoing" className="font-bold uppercase text-xs">In Progress</SelectItem>
                    <SelectItem value="completed" className="font-bold uppercase text-xs">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-50 ml-1">Due Date</label>
                <Input
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={e => dispatchForm({ type: "SET_DUEDATE", value: e.target.value })}
                  className="font-bold text-xs"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase opacity-50 ml-1">Description</label>
              <Textarea
                value={form.desc}
                onChange={e => dispatchForm({ type: "SET_DESC", value: formatSentenceCase(e.target.value) })}
                placeholder="Detailed information about the task..."
                className="min-h-[100px] font-medium"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => dispatchForm({ type: "CLOSE" })} className="font-black uppercase text-[10px]">
              Cancel
            </Button>
            <Button onClick={saveTask} disabled={!isFormValid} className="font-black uppercase text-[10px] px-8">
              {form.editingId ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
