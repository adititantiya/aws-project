import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { Task, TaskDTO } from '@/types/task';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(task);
        }

        const tasks = db.prepare('SELECT * FROM tasks').all();
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body: TaskDTO = await request.json();

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const stmt = db.prepare(`
            INSERT INTO tasks (title, description, priority, dueDate, completed)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            body.title,
            body.description || '',
            body.priority || '1',
            body.dueDate || null,
            body.completed ? 1 : 0  // Convert boolean to integer
        );

        return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body: Task = await request.json();

        // Validate required fields
        if (!body.id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        // Check if task exists
        const existingTask = db.prepare('SELECT id FROM tasks WHERE id = ?').get(body.id);
        if (!existingTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        const stmt = db.prepare(`
            UPDATE tasks SET
            title = ?,
            description = ?,
            priority = ?,
            dueDate = ?,
            completed = ?
            WHERE id = ?
        `);

        stmt.run(
            body.title,
            body.description || '',
            body.priority || '1',
            body.dueDate || null,
            body.completed ? 1 : 0,  // Convert boolean to integer
            body.id
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing task ID' },
                { status: 400 }
            );
        }

        // Check if task exists
        const existingTask = db.prepare('SELECT id FROM tasks WHERE id = ?').get(id);
        if (!existingTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}