import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

interface QuestionPopupProps {
  onSubmit: (question: string) => void;
  noteId: string;
  updateNoteContent: (noteId: string, newContent: string, aiResponse?: string) => void;
  setNoteUpdatingByAI: (noteId: string, isUpdating: boolean) => void;
}

export default function QuestionPopup({ onSubmit, noteId, updateNoteContent, setNoteUpdatingByAI }: QuestionPopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [question, setQuestion] = useState<string>('')
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { mutate: sendQuestion, isPending } = useMutation({
    mutationFn: async ({ question }: { question: string }) => {
      setNoteUpdatingByAI(noteId, true);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, message: question }),
      })

      if (!response.ok) {
        throw new Error('Fejl ved opdatering af note')
      }

      return response.body
    },
    onMutate: () => {
      toast.loading('Opdaterer note...', {
        position: "bottom-right",
        duration: Infinity,
      })
    },
    onSuccess: async (stream) => {
      if (!stream) {
        throw new Error('Stream er null')
      }
  
      const reader = stream.getReader()
      let accResponse = '';
      const decoder = new TextDecoder();
  
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const chunkValue = decoder.decode(value, { stream: true });
          accResponse += chunkValue;
          updateNoteContent(noteId, accResponse, accResponse); // Opdater både indhold og AI-svar
        }
      } catch (error) {
        console.error('Fejl ved læsning af stream:', error);
      } finally {
        reader.releaseLock();
        setNoteUpdatingByAI(noteId, false);
      }

      onSubmit(question)
      setQuestion('')
      setIsOpen(false)
      toast.success('Note opdateret', {
        position: "bottom-right",
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error('Fejl ved indsendelse af spørgsmål:', error)
      toast.error('Fejl ved opdatering af note', {
        position: "bottom-right",
        duration: 3000,
      })
      setNoteUpdatingByAI(noteId, false);
    },
    onSettled: () => {
      toast.dismiss()
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      sendQuestion({ question })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block">
      <Button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)} 
        className="rounded-full w-8 h-8 p-0 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center border border-zinc-950/10"
      >
        <Sparkles className="h-4 w-4" />
      </Button>

      {isOpen && (
  <div 
    ref={popupRef}
    className="absolute bottom-full mb-2 right-[-2rem] w-80 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 ease-out z-50"
    style={{
      animation: 'fadeIn 0.3s ease-out',
    }}
  >
          <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
            <span className="font-semibold text-m text-gray-800">Stil et spørgsmål</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Luk</span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Skriv dit spørgsmål..."
              value={question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              className="flex-grow border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            />
            <Button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 rounded-lg"
              disabled={!question.trim() || isPending}
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Behandler...
                </span>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </form>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}