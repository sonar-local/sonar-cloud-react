import { useState, useEffect } from 'react'

interface Todo {
    id: number
    text: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
    editing: boolean
}

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [input, setInput] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
    const [sortBy, setSortBy] = useState<'priority' | 'text' | 'date'>('priority')

    useEffect(() => {
        const saved = localStorage.getItem('todos')
        if (saved) {
            setTodos(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    const addTodo = () => {
        if (input.trim()) {
            const newTodo: Todo = {
                id: Date.now(),
                text: input.trim(),
                completed: false,
                priority,
                editing: false
            }
            setTodos(prev => [...prev, newTodo])
            setInput('')
        }
    }

    const removeTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    const startEditing = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, editing: true } : todo
        ))
    }

    const saveEdit = (id: number, newText: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: newText, editing: false } : todo
        ))
    }

    const cancelEdit = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, editing: false } : todo
        ))
    }

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed))
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
    }).sort((a, b) => {
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        if (sortBy === 'text') return a.text.localeCompare(b.text)
        return a.id - b.id
    })

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'red'
            case 'medium': return 'orange'
            case 'low': return 'green'
            default: return 'black'
        }
    }

    return (
        <div className="todo-list">
            <h2>Todo List Component</h2>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a todo"
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button onClick={addTodo}>Add</button>
            </div>
            <div>
                <label>Filter: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
                <label>Sort by: </label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="priority">Priority</option>
                    <option value="text">Text</option>
                    <option value="date">Date</option>
                </select>
                <button onClick={clearCompleted}>Clear Completed</button>
            </div>
            <ul>
                {filteredTodos.map((todo) => (
                    <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        {todo.editing ? (
                            <div>
                                <input
                                    type="text"
                                    defaultValue={todo.text}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit(todo.id, (e.target as HTMLInputElement).value)
                                        if (e.key === 'Escape') cancelEdit(todo.id)
                                    }}
                                />
                                <button onClick={() => saveEdit(todo.id, (document.querySelector(`input[value="${todo.text}"]`) as HTMLInputElement)?.value || todo.text)}>Save</button>
                                <button onClick={() => cancelEdit(todo.id)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
                                <span style={{ color: getPriorityColor(todo.priority) }}>{todo.text}</span>
                                <button onClick={() => startEditing(todo.id)}>Edit</button>
                                <button onClick={() => removeTodo(todo.id)}>Remove</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList