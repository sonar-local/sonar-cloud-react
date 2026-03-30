import { useState, useEffect } from 'react'

function Greeting() {
    const [name, setName] = useState('')
    const [greetings, setGreetings] = useState<string[]>([])
    const [language, setLanguage] = useState('en')
    const [isValid, setIsValid] = useState(true)

    useEffect(() => {
        setIsValid(name.length > 0 && /^[a-zA-Z\s]+$/.test(name))
    }, [name])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isValid && name.trim()) {
            const greeting = getGreeting(language, name.trim())
            setGreetings(prev => [...prev, greeting])
            setName('')
        }
    }

    const getGreeting = (lang: string, n: string) => {
        switch (lang) {
            case 'es': return `¡Hola, ${n}!`
            case 'fr': return `Bonjour, ${n}!`
            case 'de': return `Hallo, ${n}!`
            default: return `Hello, ${n}!`
        }
    }

    const clearHistory = () => {
        setGreetings([])
    }

    const exportGreetings = () => {
        const data = greetings.join('\n')
        const blob = new Blob([data], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'greetings.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="greeting">
            <h2>Greeting Component</h2>
            <div>
                <label>Language: </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                </select>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ borderColor: isValid ? 'green' : 'red' }}
                />
                {!isValid && <p style={{ color: 'red' }}>Name must contain only letters and spaces</p>}
                <button type="submit" disabled={!isValid}>Greet</button>
            </form>
            <div>
                <button onClick={clearHistory}>Clear History</button>
                <button onClick={exportGreetings} disabled={greetings.length === 0}>Export Greetings</button>
            </div>
            <ul>
                {greetings.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
        </div>
    )
}

export default Greeting