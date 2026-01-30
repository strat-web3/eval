'use client'

import { useState } from 'react'
import { Text, VStack, Box, Heading, Spinner, HStack } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { LuCopy, LuCheck } from 'react-icons/lu'

export default function Home() {
  const [response, setResponse] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file extension
    const validExtensions = ['.md', '.csv']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      alert('Please upload a .md or .csv file')
      event.target.value = ''
      return
    }

    setFileName(file.name)
    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/ask', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to get response')
        return
      }

      setResponse(data.output || JSON.stringify(data, null, 2))
    } catch (err) {
      setError('Failed to process file')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack gap={8} align="stretch" py={20}>
      <Box textAlign="center">
        <Heading as="h1" size="4xl" mb={8}>
          Eval
        </Heading>

        <Box mb={8}>
          <input
            type="file"
            accept=".md,.csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={isLoading}
          />
          <label htmlFor="file-upload">
            <Button as="span" colorPalette="blue" cursor="pointer" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Upload File (.md or .csv)'}
            </Button>
          </label>
          {fileName && (
            <Text mt={2} color="gray.400" fontSize="sm">
              Uploaded: {fileName}
            </Text>
          )}
        </Box>

        {isLoading && (
          <Box mt={6}>
            <Spinner size="lg" color="blue.500" />
            <Text mt={2} color="gray.400">
              Analyzing file...
            </Text>
          </Box>
        )}

        {error && (
          <Box mt={6} p={4} borderRadius="md" bg="red.900" borderWidth="1px" borderColor="red.600">
            <Text color="red.200">{error}</Text>
          </Box>
        )}

        {response && !isLoading && (
          <Box
            mt={6}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.600"
            bg="gray.800"
            textAlign="left"
            maxH="500px"
            overflowY="auto"
            position="relative"
          >
            <HStack justify="space-between" align="start" mb={2}>
              <Box flex={1} />
              <IconButton
                aria-label="Copy to clipboard"
                size="xs"
                variant="ghost"
                onClick={handleCopy}
              >
                {copied ? <LuCheck /> : <LuCopy />}
              </IconButton>
            </HStack>
            <Text whiteSpace="pre-wrap" fontFamily="mono" fontSize="sm">
              {response}
            </Text>
          </Box>
        )}
      </Box>
    </VStack>
  )
}
