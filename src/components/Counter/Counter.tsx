import { useState, useEffect, useCallback } from 'react'

function Counter() {
    const [count, setCount] = useState(0)
    const [history, setHistory] = useState<number[]>([])
    const [minLimit, setMinLimit] = useState(-10)
    const [maxLimit, setMaxLimit] = useState(10)
    const [step, setStep] = useState(1)
    const [soundEnabled, setSoundEnabled] = useState(false)
    const [autoIncrement, setAutoIncrement] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (autoIncrement) {
            interval = setInterval(() => {
                setCount(prev => Math.min(prev + step, maxLimit))
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [autoIncrement, step, maxLimit])

    const playSound = useCallback(() => {
        if (soundEnabled) {
            // Simulate sound - in real app, use Web Audio API
            console.log('Beep!')
        }
    }, [soundEnabled])

    const increment = () => {
        setCount(prev => {
            const newCount = Math.min(prev + step, maxLimit)
            if (newCount !== prev) {
                setHistory(h => [...h, newCount])
                playSound()
            }
            return newCount
        })
    }

    const decrement = () => {
        setCount(prev => {
            const newCount = Math.max(prev - step, minLimit)
            if (newCount !== prev) {
                setHistory(h => [...h, newCount])
                playSound()
            }
            return newCount
        })
    }

    const reset = () => {
        setCount(0)
        setHistory([])
        playSound()
    }

    const undo = () => {
        if (history.length > 0) {
            const lastValue = history[history.length - 1]
            setHistory(h => h.slice(0, -1))
            setCount(lastValue)
        }
    }

    const setCustomValue = (value: number) => {
        const clamped = Math.max(minLimit, Math.min(maxLimit, value))
        setCount(clamped)
        setHistory(h => [...h, clamped])
        playSound()
    }

    const exportHistory = () => {
        const data = history.join('\n')
        const blob = new Blob([data], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'counter-history.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="card">
            <h3>Advanced Counter</h3>
            <div>
                <button onClick={decrement} disabled={count <= minLimit}>-</button>
                <span>count is {count}</span>
                <button onClick={increment} disabled={count >= maxLimit}>+</button>
                <button onClick={reset}>Reset</button>
                <button onClick={undo} disabled={history.length === 0}>Undo</button>
            </div>
            <div>
                <label>Min: </label>
                <input type="number" value={minLimit} onChange={(e) => setMinLimit(Number(e.target.value))} />
                <label>Max: </label>
                <input type="number" value={maxLimit} onChange={(e) => setMaxLimit(Number(e.target.value))} />
                <label>Step: </label>
                <input type="number" value={step} onChange={(e) => setStep(Number(e.target.value))} min="1" />
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
                    Sound
                </label>
                <label>
                    <input type="checkbox" checked={autoIncrement} onChange={(e) => setAutoIncrement(e.target.checked)} />
                    Auto Increment
                </label>
            </div>
            <div>
                <input type="number" placeholder="Set custom value" onKeyDown={(e) => {
                    if (e.key === 'Enter') setCustomValue(Number((e.target as HTMLInputElement).value))
                }} />
                <button onClick={exportHistory} disabled={history.length === 0}>Export History</button>
            </div>
            <div>
                <h4>History ({history.length})</h4>
                <ul>
                    {history.slice(-5).map((val, i) => <li key={i}>{val}</li>)}
                </ul>
            </div>
        </div>
    )
}

export default Counter
