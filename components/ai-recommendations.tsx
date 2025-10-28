"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Sparkles } from "lucide-react"
import { getTaskRecommendations } from "@/lib/ai-helpers"
import type { Task } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Listen for changes to the tasks in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("tasksUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("tasksUpdated", handleStorageChange)
    }
  }, [])

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const result = await getTaskRecommendations(tasks)
      setRecommendations(result)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate recommendations when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      generateRecommendations()
    } else {
      setRecommendations("")
    }
  }, [tasks.length]) // Only regenerate when the number of tasks changes

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <h3 className="font-medium">AI Insights</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={generateRecommendations}
            disabled={isLoading || tasks.length === 0}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Add some tasks to get AI recommendations</p>
          </div>
        ) : recommendations ? (
          <div className="text-sm space-y-4">
            {recommendations.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Click the refresh button to generate recommendations</p>
          </div>
        )}
      </CardContent>
      {recommendations && (
        <CardFooter className="px-4 py-3 border-t text-xs text-muted-foreground">
          Recommendations based on {tasks.length} tasks
        </CardFooter>
      )}
    </Card>
  )
}

