"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Check, Clock, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import TaskModal from "@/components/task-modal"
import type { Task } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error loading tasks",
        description: "Could not fetch your tasks. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = () => {
    setCurrentTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      
      // Update local state after successful deletion
      setTasks(tasks.filter(task => task.id !== taskId))
      
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list."
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error deleting task",
        description: "Could not delete the task. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }
      
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      
      // Update local state after successful update
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error updating task",
        description: "Could not update the task. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSaveTask = () => {
    // Refresh the tasks after saving
    fetchTasks()
    setIsModalOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "3":
        return "bg-red-500 hover:bg-red-600"
      case "2":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "1":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate
  }

  // Format date and time from ISO string
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return null
    
    const dateTime = new Date(dateTimeString)
    
    // Format date
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }
    const formattedDate = dateTime.toLocaleDateString(undefined, dateOptions)
    
    // Format time
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }
    const formattedTime = dateTime.toLocaleTimeString(undefined, timeOptions)
    
    return { date: formattedDate, time: formattedTime }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed
          </span>
          <Button variant="ghost" size="sm" onClick={fetchTasks} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Loading tasks...
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No tasks yet. Click "Add Task" to create your first task.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks
            .sort((a, b) => {
              // Sort by completion status first
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1
              }
              // Then by due date
              return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
            })
            .map((task) => {
              const formattedDateTime = task.dueDate ? formatDateTime(task.dueDate) : null;
              
              return (
                <Card key={task.id} className={`${task.completed ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="mt-0.5 h-5 w-5 rounded-full"
                          onClick={() => handleToggleComplete(task)}
                        >
                          {task.completed ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="h-3 w-3 rounded-full border border-primary" />
                          )}
                        </Button>
                        <div>
                          <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex flex-wrap items-center mt-2 gap-2">
                            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                              {task.priority === "1" && "Low"}
                              {task.priority === "2" && "Medium"}
                              {task.priority === "3" && "High"}
                              {task.priority !== "1" && task.priority !== "2" && task.priority !== "3" &&
                                task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                            {formattedDateTime && (
                              <Badge
                                variant="outline"
                                className={`flex items-center ${isOverdue(task.dueDate) && !task.completed ? "text-red-500 border-red-500" : ""}`}
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                {formattedDateTime.date} at {formattedDateTime.time}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={handleSaveTask}
        task={currentTask}
      />
    </div>
  )
}