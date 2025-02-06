import { NextResponse } from 'next/server'

// Simple in-memory storage for events
// Note: This will reset when the server restarts
let events: Array<{
    timestamp: string,
    event: string,
    data: any
}> = []

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { event, data } = body

        const eventEntry = {
            timestamp: new Date().toISOString(),
            event,
            data
        }

        events.push(eventEntry)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}

export async function GET() {
    return NextResponse.json(events)
} 