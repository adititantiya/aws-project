"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Task } from "@/lib/types"
import { generateTaskSuggestions } from "@/lib/ai-helpers"
import { Loader2 } from "lucide-react"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskSaved: () => void // Callback to refresh task list
  task: Task | null
}

export default function TaskModal({ isOpen, onClose, onTaskSaved, task }: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("2")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState("")
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority || "2")
      
      // Format date and time from the stored ISO string
      if (task.dueDate) {
        const dueDateTime = new Date(task.dueDate)
        setDueDate(dueDateTime.toISOString().split("T")[0])
        
        // Format time as HH:MM
        const hours = dueDateTime.getHours().toString().padStart(2, '0')
        const minutes = dueDateTime.getMinutes().toString().padStart(2, '0')
        setDueTime(`${hours}:${minutes}`)
      } else {
        setDueDate("")
        setDueTime("")
      }
    } else {
      setTitle("")
      setDescription("")
      setPriority("2")
      setDueDate("")
      setDueTime("")
    }
    setAiSuggestions("")
  }, [task, isOpen])

  const handleSave = async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      // Combine date and time for the ISO string
      let dueDateTimeISO = null
      if (dueDate) {
        const dateTimeString = `${dueDate}T${dueTime || '00:00'}`
        dueDateTimeISO = new Date(dateTimeString).toISOString()
      }

      const taskData = {
        title,
        description,
        priority,
        dueDate: dueDateTimeISO,
        completed: task?.completed || false
      }

      const url = "/api/tasks"
      const method = task ? "PUT" : "POST"

      console.log(task ? { ...taskData, id: task.id } : taskData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task ? { ...taskData, id: task.id } : taskData)
      })

      if (!response.ok) throw new Error("Failed to save task")

      onTaskSaved() // Call the callback to refresh task list
      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Failed to save task. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateSuggestions = async () => {
    if (!title.trim()) return

    setIsGeneratingSuggestions(true)
    try {
      const suggestions = await generateTaskSuggestions(title)
      setAiSuggestions(suggestions)
      if (suggestions && !description) setDescription(suggestions)
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setIsGeneratingSuggestions(false)
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
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateSuggestions}
                disabled={!title.trim() || isGeneratingSuggestions}
              >
                {isGeneratingSuggestions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs">AI</span>
                )}
              </Button>
            </div>
          </div>

          {/* Description Textarea with AI Suggestions */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
            {aiSuggestions && (
              <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded-md">
                <p className="font-medium text-xs mb-1">AI Suggestion:</p>
                {aiSuggestions}
              </div>
            )}
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
                <RadioGroupItem value="1" id="low" />
                <Label htmlFor="low" className="text-green-500">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="2" id="medium" />
                <Label htmlFor="medium" className="text-yellow-500">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="3" id="high" />
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
            <div className="grid gap-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input 
                id="dueTime" 
                type="time" 
                value={dueTime} 
                onChange={(e) => setDueTime(e.target.value)} 
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