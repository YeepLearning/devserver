import { Code } from '@/components/ui/code'

async function getEvents() {
    const res = await fetch('http://localhost:3000/api/events', {
        cache: 'no-store'
    })
    return res.json()
}

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Event Logs</h1>
            <Code className="w-full p-4 bg-black/90 text-green-400">
                {JSON.stringify(events, null, 2)}
            </Code>
        </div>
    )
} 