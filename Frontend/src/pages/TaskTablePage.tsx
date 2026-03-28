import { useAppSelector } from "../store/hooks";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ListTodo, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { themes } from "../lib/themes";
import { useTheme } from "../context/ThemeContext";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TaskTable() {
  const tasks = useAppSelector(state => state.task.tasks);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'yet': return { label: 'To Do', icon: <ListTodo className="w-3 h-3" />, color: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
      case 'ongoing': return { label: 'In Progress', icon: <Clock className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'completed': return { label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-green-50 text-green-600 border-green-100' };
      default: return { label: status, icon: null, color: 'bg-gray-100' };
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans transition-colors duration-300"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter" style={{ color: theme.colors.text }}>Task Directory</h1>
            <p className="text-sm opacity-60 font-medium">A detailed overview of all your tasks</p>
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
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 font-black uppercase text-[10px]">
              <ArrowLeft className="w-4 h-4" /> Back to Board
            </Button>
          </div>
        </header>

        <div className="bg-card rounded-xl shadow-xl shadow-black/5 border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest text-muted-foreground">Task Title</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Description</TableHead>
                <TableHead className="w-[150px] font-black uppercase text-[10px] tracking-widest text-muted-foreground">Due Date</TableHead>
                <TableHead className="w-[150px] font-black uppercase text-[10px] tracking-widest text-muted-foreground px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground/50 italic font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <ListTodo className="w-8 h-8 opacity-10" />
                      <p>No tasks available in the list.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map(task => {
                  const statusInfo = getStatusInfo(task.status);
                  return (
                    <TableRow key={task.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold text-sm uppercase italic tracking-tight py-4">
                        {task.title}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground italic font-medium max-w-xs truncate py-4">
                        {task.discription}
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-orange-500/80 uppercase py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 font-black uppercase text-[9px] tracking-tighter ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}