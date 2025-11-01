import type { Task } from "./types"
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBgnaOuHJtiY3qCJLFuyFESi2-GfAKVa8o", // Only for testing, not recommended for production
});

export async function generateTaskSuggestions(taskTitle: string): Promise<string> {
  try {
    const { text } = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `I'm creating a task with the title: "${taskTitle}". Please suggest a detailed description for this task that would help me complete it effectively. Keep it under 100 words. DO NOT GIVE ANY OTHER TEXT EXCEPT THE DESCRIPTION. You are a helpful AI assistant that specializes in productivity and task management. Provide concise, practical suggestions.`,
    })

    return text!
  } catch (error) {
    console.error("Error generating task suggestions:", error)
    return "Could not generate suggestions at this time."
  }
}

export async function getTaskRecommendations(tasks: Task[]): Promise<string> {
  if (!tasks || tasks.length === 0) {
    return "Add some tasks to get AI recommendations."
  }

  try {
    const formattedTasks = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date",
      completed: task.completed,
    }))

    const { text } = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `Here are my current tasks:
${JSON.stringify(formattedTasks, null, 2)}

Based on these tasks, please provide:
1. Suggestions for optimizing my schedule
2. Recommendations for task prioritization
3. Any insights on how I could improve my productivity
4. Identify any potential bottlenecks or conflicts

Keep your response concise and practical. DO NOT RESPOND WITH ANYTHING OTHER THAN THE RECOMMENDATIONS. You are a helpful AI assistant that specializes in productivity and task management. Don't use any special characters for bold or italics etc.`,
    })

    return text!
  } catch (error) {
    console.error("Error generating task recommendations:", error)
    return "Could not generate recommendations at this time. Please try again later."
  }
}