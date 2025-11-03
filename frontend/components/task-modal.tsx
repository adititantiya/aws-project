"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import type { Task } from "../lib/types"
import { Loader2 } from "lucide-react"
import { API_BASE_URL } from "../lib/api";


interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskSaved: () => void // Callback to refresh task list
  task: Task | null
}

export default function TaskModal({ isOpen, onClose, onTaskSaved, task }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority || "2")
      
      // Format date from the stored ISO string
      if (task.dueDate) {
        const dueDateTime = new Date(task.dueDate)
        setDueDate(dueDateTime.toISOString().split("T")[0])
        
      } else {
        setDueDate("")
      }
    } else {
      setTitle("")
      setDescription("")
      setPriority("2")
      setDueDate("")
    }
  }, [task, isOpen])

  const handleSave = async () => {
  if (!title.trim()) return

  setIsSaving(true)
  try {
    // Combine date for ISO format
    let dueDateTimeISO = null
    if (dueDate) {
      const dateTimeString = `${dueDate}`
      dueDateTimeISO = new Date(dateTimeString).toISOString()
    }

    const categoryId = 1;
    // Task payload
    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDateTimeISO,
      completed: task?.completed || false,
      status: task?.status || "TODO",
    }
    console.log("Saving task with data:", taskData)

    // ✅ Correct API URL and method
    const url = task
  ? `${API_BASE_URL}/api/tasks/${task.id}/update`
  : `${API_BASE_URL}/api/tasks`


    const method = task ? "PUT" : "POST"
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) throw new Error("Failed to save task")

    onTaskSaved() // Refresh list
    onClose()
  } catch (error) {
    console.error("Error saving task:", error)
    alert("Failed to save task. Please try again.")
  } finally {
    setIsSaving(false)
  }
}



  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title Input with AI Button */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <div className="flex gap-2">
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Task title" 
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>

          {/* Priority Radio Group */}
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <RadioGroup 
              value={priority.toString()}
              onValueChange={(value) => setPriority(value)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="LOW" id="low" />
                <Label htmlFor="low" className="text-green-500">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="MEDIUM" id="medium" />
                <Label htmlFor="medium" className="text-yellow-500">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="HIGH" id="high" />
                <Label htmlFor="high" className="text-red-500">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Due Date and Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}