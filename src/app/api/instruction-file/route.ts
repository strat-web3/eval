import { NextRequest, NextResponse } from 'next/server'

const RUKH_BASE_URL = 'https://rukh.w3hc.org'
const CONTEXT_PASSWORD = 'eval'
const CONTEXT_NAME = 'eval'

export async function GET() {
  try {
    const response = await fetch(
      `${RUKH_BASE_URL}/context/${CONTEXT_NAME}/file/instruction-file.md`,
      {
        headers: {
          accept: 'application/json',
          'x-context-password': CONTEXT_PASSWORD,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to fetch instruction file: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.text()
    return NextResponse.json({ content: data })
  } catch (error) {
    console.error('Error fetching instruction file:', error)
    return NextResponse.json({ error: 'Failed to fetch instruction file' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    // Create a blob from the content
    const blob = new Blob([content], { type: 'text/markdown' })
    const file = new File([blob], 'instruction-file.md', { type: 'text/markdown' })

    const formData = new FormData()
    formData.append('contextName', CONTEXT_NAME)
    formData.append('fileDescription', 'Instructions for evaluation')
    formData.append('file', file)

    const response = await fetch(`${RUKH_BASE_URL}/context/upload`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-context-password': CONTEXT_PASSWORD,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to update instruction file: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating instruction file:', error)
    return NextResponse.json({ error: 'Failed to update instruction file' }, { status: 500 })
  }
}
