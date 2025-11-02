import { NextResponse } from 'next/server';
import db from '../lib/database';

// Handle user registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(body.username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Insert new user
    const stmt = db.prepare(`
      INSERT INTO users (username, password)
      VALUES (?, ?)
    `);
    
    const result = stmt.run(body.username, body.password);
    
    return NextResponse.json(
      { id: result.lastInsertRowid, username: body.username },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Login endpoint
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists and password matches
    const user = db.prepare('SELECT id, username FROM users WHERE username = ? AND password = ?').get(
      body.username,
      body.password
    ) as { username: string } | undefined;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      user: { username: user.username }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}