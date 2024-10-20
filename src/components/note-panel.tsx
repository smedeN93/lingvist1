"use client"

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';
import { debounce } from 'lodash';
import QuestionPopup from './chat/ButtonAskNotes';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  isUpdatingByAI: boolean;
  aiResponse: string | null;
}

interface NotesPanelProps {
  openButtonText?: string;
  closeButtonText?: string;
  isOpen: boolean;
  onToggle: () => void;
  fileId: string;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  openButtonText = 'Open Notes',
  closeButtonText = 'Close Notes',
  isOpen,
  onToggle,
  fileId
}) => {
  //console.log('fileId in NotesPanel:', fileId);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [currentNote, setCurrentNote] = React.useState('');
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const [currentNoteTitle, setCurrentNoteTitle] = React.useState('');

  const { mutate: createNote } = trpc.createNote.useMutation({
    onSuccess: (newNote) => {
      setNotes([{ ...newNote, isUpdatingByAI: false }, ...notes]);
      setCurrentNote('');
      setCurrentNoteTitle('');
      if (textareaRefs.current['new']) {
        textareaRefs.current['new'].style.height = 'auto';
      }
      toast.success('Note gemt', {
        position: "bottom-right",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error('Fejl ved gemning af note', {
        position: "bottom-right",
        duration: 3000,
      });
      console.error('Fejl ved gemning af note:', error);
    }
  });
  const renderMarkdown = (text: string) => {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  };

  const handleFetchedNotes = useCallback((fetchedNotes: Note[]) => {
    if (fetchedNotes) {
      setNotes(fetchedNotes.map(note => ({ ...note, isUpdatingByAI: false })));
    }
  }, []);

  const { data: fetchedNotes, isLoading: isLoadingNotes } = trpc.getNotes.useQuery(
    { fileId },
    {
      enabled: !!fileId && isOpen,
    }
  );
  const { refetch: refetchNotes } = trpc.getNotes.useQuery(
    { fileId },
    {
      enabled: !!fileId && isOpen,
    }
  );

  useEffect(() => {
    if (fetchedNotes) {
      setNotes(fetchedNotes.map(note => ({ ...note, isUpdatingByAI: false })));
    }
  }, [fetchedNotes]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
    autoResizeTextarea(e.target);
  };

  const handleNoteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNoteTitle(e.target.value);
  };

  const { mutate: deleteNote } = trpc.deleteNote.useMutation({
    onSuccess: (_, variables) => {
      setNotes(notes.filter(note => note.id !== variables.id));
      toast.success('Note slettet', {
        position: "bottom-right",
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error('Fejl ved sletning af note', {
        position: "bottom-right",
        duration: 3000,
      });
      console.error('Fejl ved sletning af note:', error);
    }
  });

  const handleDeleteNote = (id: string) => {
    deleteNote({ id });
  };

  const saveNote = () => {
    console.log('Attempting to save note with fileId:', fileId);
    if (!fileId) {
      console.error('fileId is not available');
      toast.error('Kunne ikke gemme noten. Prøv igen senere.');
      return;
    }
    if (currentNote.trim()) {
      createNote({ title: currentNoteTitle.trim(), content: currentNote.trim(), fileId });
    }
  };

  const { mutate: updateNoteMutation } = trpc.updateNote.useMutation({
    onError: (error) => {
      toast.error('Fejl ved opdatering af note', {
        position: "bottom-right",
        duration: 3000,
      });
      console.error('Fejl ved opdatering af note:', error);
    }
  });

  const updateNote = (id: string, newTitle: string, newContent: string, aiResponse?: string | null) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (noteToUpdate && !noteToUpdate.isUpdatingByAI) {
      setNotes(notes.map(note => 
        note.id === id ? { ...note, title: newTitle, content: newContent, aiResponse: aiResponse ?? note.aiResponse } : note
      ));
      if (textareaRefs.current[id]) {
        autoResizeTextarea(textareaRefs.current[id]!);
      }
      debouncedUpdateNote(id, newTitle, newContent, aiResponse);
    } else {
      console.log('Note is currently being updated by AI. Manual update prevented.');
    }
  };
  
  const debouncedUpdateNote = useCallback(
    (id: string, title: string, content: string, aiResponse?: string | null) => {
      debounce((id: string, title: string, content: string, aiResponse?: string | null) => {
        updateNoteMutation({ id, title, content, aiResponse });
      }, 5000)(id, title, content, aiResponse);
    },
    [updateNoteMutation]
  );

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const setTextareaRef = (el: HTMLTextAreaElement | null, key: string) => {
    if (el) {
      textareaRefs.current[key] = el;
    }
  };

  const handleExport = () => {
    console.log('Eksporterer noter...');
    toast.success('Noter eksporteret', {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const handleQuestionSubmit = (question: string) => {
    console.log('Spørgsmål stillet:', question);
  };

  const setNoteUpdatingByAI = (noteId: string, isUpdating: boolean) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isUpdatingByAI: isUpdating } : note
    ));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        Object.values(textareaRefs.current).forEach(textarea => {
          if (textarea) {
            autoResizeTextarea(textarea);
          }
        });
      }, 0);
    }
  }, [isOpen, notes]);

  const button = (
    <div className="rounded-full border border-zinc-950/10 bg-gray-200">
      <div className="p-2">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center h-9 w-28",
            "rounded-lg text-gray-800",
            "transition-colors duration-300",
            isOpen && "bg-gray-200 text-zinc-800"
          )}
          aria-label={isOpen ? closeButtonText : openButtonText}
        >
          <span className="text-sm font-medium truncate mr-1">
            {isOpen ? closeButtonText : openButtonText}
          </span>
          {isOpen && <X className="h-5 w-5 flex-shrink-0" />}
        </button>
      </div>
    </div>
  );

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-[72px] right-6 bottom-8 w-full sm:w-[24rem] max-w-full bg-[#fafafa] rounded-xl shadow-lg overflow-hidden flex flex-col z-50 sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <div className="bg-[#fafafa] p-4 sm:p-6 border-b border-zinc-950/10 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800">Noter</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggle}
                className="text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="flex-grow flex flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
              <div className="bg-white rounded-lg border border-zinc-950/10 p-3 sm:p-4 shadow-sm">
                <input
                  type="text"
                  value={currentNoteTitle}
                  onChange={handleNoteTitleChange}
                  placeholder="Notattitel..."
                  className="w-full p-2 mb-2 border-b border-zinc-300 focus:outline-none focus:border-zinc-500 text-lg font-semibold"
                />
                <textarea
                  value={currentNote}
                  onChange={handleNoteChange}
                  placeholder="Tilføj din note her..."
                  className="w-full min-h-[6rem] sm:min-h-[8rem] p-2 border border-zinc-300 rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
                  ref={(el) => setTextareaRef(el, 'new')}
                />
                <button
                  onClick={saveNote}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 border border-zinc-950/10 font-medium rounded-full hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Gem
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 sm:p-4 bg-white rounded-lg border border-zinc-950/10 shadow-sm relative">
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      <QuestionPopup 
                        onSubmit={handleQuestionSubmit}
                        noteId={note.id}
                        updateNoteContent={(noteId, newContent) => {
                          updateNote(noteId, note.title, newContent);
                          refetchNotes();
                        }}
                        setNoteUpdatingByAI={setNoteUpdatingByAI}
                      />
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="rounded-full p-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center border border-zinc-950/10"
                        aria-label="Slet note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => updateNote(note.id, e.target.value, note.content)}
                      className="w-full mb-2 text-lg font-bold focus:outline-none bg-transparent"
                      placeholder="Uden titel"
                    />
                    <div className="w-full h-px bg-zinc-300 mb-2"></div>
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, note.title, e.target.value)}
                      className="w-full p-2 border-none resize-none focus:outline-none focus:ring-0 bg-transparent text-zinc-800"
                      style={{ overflow: 'hidden' }}
                      ref={(el) => setTextareaRef(el, note.id)}
                      rows={1}
                      disabled={note.isUpdatingByAI}
                    />
                    {note.aiResponse && (
                      <div className="mt-2 p-2 rounded-lg text-sm bg-gray-200 text-gray-900">
                        {renderMarkdown(note.aiResponse)}
                      </div>
                    )}
                  </div>
))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {button}
      {panel}
    </>
  );
};

export default NotesPanel;
