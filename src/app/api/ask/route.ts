import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const rukhFormData = new FormData()
    rukhFormData.append('message', '-')
    rukhFormData.append('model', 'anthropic')
    rukhFormData.append('context', 'eval')
    rukhFormData.append('file', file)

    const response = await fetch('https://rukh.w3hc.org/ask', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: rukhFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Rukh API error: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Rukh API:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
