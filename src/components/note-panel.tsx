"use client"

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Note {
  id: number;
  content: string;
}

interface NotesPanelProps {
  openButtonText?: string;
  closeButtonText?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  openButtonText = 'Open Notes',
  closeButtonText = 'Close Notes',
  isOpen,
  onToggle
}) => {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [currentNote, setCurrentNote] = React.useState('');
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    Object.values(textareaRefs.current).forEach(ref => {
      if (ref) autoResizeTextarea(ref);
    });
  }, [notes, isOpen]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
    autoResizeTextarea(e.target);
  };

  const saveNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, { id: Date.now(), content: currentNote.trim() }]);
      setCurrentNote('');
      if (textareaRefs.current['new']) {
        textareaRefs.current['new'].style.height = 'auto';
      }
    }
  };

  const updateNote = (id: number, newContent: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: newContent } : note
    ));
    if (textareaRefs.current[id.toString()]) {
      autoResizeTextarea(textareaRefs.current[id.toString()]!);
    }
  };

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

  const button = (
    <div className="rounded-full border border-zinc-950/10 bg-[rgb(245,245,247)]">
      <div className="p-2">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center h-9 w-28",
            "rounded-lg text-zinc-500",
            "hover:bg-zinc-100 hover:text-zinc-800",
            "transition-colors duration-300",
            "focus:outline-none focus:ring-2 focus:ring-zinc-300",
            isOpen && "bg-zinc-100 text-zinc-800"
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
          className="fixed top-4 right-4 bottom-4 w-full sm:w-[24rem] max-w-full bg-[rgb(245,245,247)] rounded-2xl shadow-lg overflow-hidden flex flex-col border border-zinc-950/10 z-50 sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <div className="bg-white p-4 sm:p-6 border-b border-zinc-950/10 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800">Notes</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="p-2 text-zinc-500 hover:text-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 rounded-full"
                aria-label="Eksportér noter"
              >
                <Download className="h-5 w-5" />
              </button>
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
              <textarea
                value={currentNote}
                onChange={handleNoteChange}
                placeholder="Write your note here..."
                className="w-full min-h-[6rem] sm:min-h-[8rem] p-2 border border-zinc-300 rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent"
                ref={(el) => setTextareaRef(el, 'new')}
              />
              <button
                onClick={saveNote}
                className="w-full px-4 py-2 bg-slate-950 text-white rounded-md hover:bg-slate-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50"
              >
                Save Note
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-3 sm:p-4 bg-white rounded-lg border border-zinc-950/10 shadow-sm">
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    className="w-full p-2 border-none resize-none focus:outline-none focus:ring-0 bg-transparent text-zinc-800"
                    style={{ overflow: 'hidden' }}
                    ref={(el) => setTextareaRef(el, note.id.toString())}
                    rows={1}
                  />
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