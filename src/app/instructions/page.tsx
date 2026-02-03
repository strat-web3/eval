'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Flex, Textarea, Stack, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { brandColors } from '@/theme'
import ReactMarkdown from 'react-markdown'

export default function InstructionFilePage() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    fetchInstructionFile()
  }, [])

  const fetchInstructionFile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/instruction-file')
      if (!response.ok) {
        throw new Error('Failed to fetch instruction file')
      }
      const data = await response.json()
      setContent(data.content)
    } catch (error) {
      console.error('Error fetching instruction file:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to load instruction file',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setEditedContent(content)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedContent('')
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/instruction-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      })

      if (!response.ok) {
        throw new Error('Failed to update instruction file')
      }

      const data = await response.json()

      if (data.message === 'File updated successfully') {
        toaster.create({
          title: 'Success',
          description: 'Instruction file updated successfully',
          type: 'success',
          duration: 3000,
        })
        setIsEditing(false)
        // Fetch the updated content
        await fetchInstructionFile()
      }
    } catch (error) {
      console.error('Error updating instruction file:', error)
      toaster.create({
        title: 'Error',
        description: 'Failed to update instruction file',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Box py={8}>
        <Heading size="xl" mb={6}>
          Instruction File
        </Heading>
        <Text>Loading...</Text>
      </Box>
    )
  }

  return (
    <Box py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">Instructions</Heading>
        <Flex gap={2}>
          {!isEditing ? (
            <Button
              bg={brandColors.primary}
              color="white"
              _hover={{ bg: brandColors.secondary }}
              onClick={handleEdit}
              size="sm"
            >
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} size="sm" disabled={isSaving}>
                Cancel
              </Button>
              <Button
                bg={brandColors.primary}
                color="white"
                _hover={{ bg: brandColors.secondary }}
                onClick={handleSave}
                size="sm"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      <Stack gap={4}>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            minH="500px"
            fontFamily="mono"
            fontSize="sm"
            p={4}
            bg="gray.900"
            border="1px solid"
            borderColor="gray.700"
            _focus={{
              borderColor: brandColors.primary,
              outline: 'none',
            }}
          />
        ) : (
          <Box
            p={6}
            bg="gray.900"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="md"
            minH="500px"
            css={{
              '& h1': {
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                marginTop: '1.5rem',
                lineHeight: '1.3',
              },
              '& h2': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                marginTop: '1.25rem',
                lineHeight: '1.3',
              },
              '& h3': {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                marginTop: '1rem',
                lineHeight: '1.3',
              },
              '& p': { marginBottom: '1rem', lineHeight: '1.7' },
              '& ul': {
                marginBottom: '1rem',
                paddingLeft: '1.5rem',
                listStyleType: 'disc',
                listStylePosition: 'outside',
              },
              '& ol': {
                marginBottom: '1rem',
                paddingLeft: '1.5rem',
                listStyleType: 'decimal',
                listStylePosition: 'outside',
              },
              '& li': {
                marginBottom: '0.5rem',
                lineHeight: '1.6',
                display: 'list-item',
              },
              '& li p': { marginBottom: '0.5rem' },
              '& code': {
                backgroundColor: 'var(--chakra-colors-gray-800)',
                paddingLeft: '0.375rem',
                paddingRight: '0.375rem',
                paddingTop: '0.125rem',
                paddingBottom: '0.125rem',
                borderRadius: '0.125rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              },
              '& pre': {
                backgroundColor: 'var(--chakra-colors-gray-800)',
                padding: '1rem',
                borderRadius: '0.375rem',
                overflow: 'auto',
                marginBottom: '1rem',
              },
              '& pre code': { backgroundColor: 'transparent', padding: 0 },
              '& a': { color: brandColors.accent, textDecoration: 'underline' },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: brandColors.primary,
                paddingLeft: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                fontStyle: 'italic',
              },
            }}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
