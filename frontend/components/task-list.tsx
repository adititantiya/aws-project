"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Plus, Edit, Trash2, Check, Clock, RefreshCw } from "lucide-react"
import { Badge } from "../components/ui/badge"
import TaskModal from "../components/task-modal"
import type { Task } from "../lib/types"
import { useToast } from "../hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import CategorySelector from "../components/category-selector"
import { Input } from "../components/ui/input"
import { API_BASE_URL } from "../lib/api";


export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [filters, setFilters] = useState({
  categoryId: "",
  priority: "",
  status: "",
  q: "",
  from: "",
  to: ""
})

  const { toast } = useToast()

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`)
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])


  const handleStatusChange = async (task: Task, newStatus: string) => {
  try {
    // Create the updated task object
    const updatedTask = { ...task, status: newStatus }

    // Send update to backend
    const response = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/status?status=${newStatus}`, {
      method: "PUT",
    })

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`)
    }

    // Update state locally after success
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    )

    toast({
      title: "Status updated",
      description: `Task "${task.title}" marked as ${newStatus}.`,
    })
  } catch (error) {
    console.error("Error updating task:", error)
    toast({
      title: "Error updating status",
      description: "Could not update task status. Please try again.",
      variant: "destructive",
    })
  }
}


  const handleCategoryChange = async (task: Task, categoryId: string | null) => {
    try {
      const updatedTask = { ...task, category: { id: categoryId } }

      const response = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/category?categoryId=${categoryId}`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Failed to update category")

      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))
      toast({ title: "Category updated", description: "Task category updated successfully." })
    } catch (error) {
      toast({
        title: "Error updating category",
        description: "Could not update task category.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters])

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
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
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
      
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/toggle`, {
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

  if (isLoading) return <p className="text-gray-500">Loading tasks...</p>

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
      <div className="flex flex-wrap gap-2 mb-4">
          {/* Search */}
          <Input
            placeholder="Search tasks..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="rounded-xl"
          />

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border rounded-xl px-2 py-1"
          >
            <option value="" >All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-xl px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Category filter */}
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            className="border rounded-xl px-2 py-1"
          >
            <option value="">All Categories</option>
            {/* Map your categories here */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Date range */}
          <Input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="w-[200px] rounded-xl"
          />
          <Input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="w-[200px] rounded-xl"
          />

          {/* Apply filters */}
          <Button onClick={fetchTasks} className="rounded-xl">Apply Filters</Button>

          {/* Clear filters */}
          <Button variant="ghost" onClick={() => { setFilters({ categoryId: "", priority: "", status: "", q: "", from: "", to: "" }); fetchTasks() }}
            className="border rounded-xl">
            Clear
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
                      <div className="flex-col justify-end gap-2 mt-3">
                        <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                        <div className="flex flex-col gap-2 mt-3">
                          {/* Status dropdown */}
                          <Select onValueChange={(value) => handleStatusChange(task, value)} value={task.status}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TODO">Pending</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Category dropdown */}
                          <CategorySelector
                            selectedCategoryId={task.category?.id ?? null}
                            onChange={(newCategoryId) => handleCategoryChange(task, newCategoryId)}
                          />
                        </div>
                      
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