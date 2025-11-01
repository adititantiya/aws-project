"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select"
import { useToast } from "../hooks/use-toast"

interface CategorySelectorProps {
  selectedCategoryId?: string | null
  onChange: (categoryId: string | null) => void
}

export default function CategorySelector({
  selectedCategoryId,
  onChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // --- Fetch all categories ---
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error loading categories",
        description: "Could not load categories. Try again later.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // --- Add a new category ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (!res.ok) throw new Error("Failed to create category")
      const created = await res.json()

      // Update UI
      setCategories((prev) => [...prev, created])
      onChange(created.id)
      setNewCategory("")
      setIsAdding(false)

      toast({
        title: "Category added",
        description: `"${created.name}" created successfully.`,
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error adding category",
        description: "Failed to create new category.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectChange = (value: string) => {
    if (value === "__new__") {
      // 👇 ensure dropdown closes before switching UI
      setTimeout(() => setIsAdding(true), 50)
    } else {
      onChange(value)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {isAdding ? (
        <div className="flex gap-2 items-center">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="w-[180px]"
          />
          <Button
            onClick={handleAddCategory}
            disabled={!newCategory.trim() || isSaving}
          >
            {isSaving ? "Adding..." : "Add"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIsAdding(false)
              setNewCategory("")
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Select value={selectedCategoryId || ""} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
            <SelectItem value="__new__">➕ Add new category</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
