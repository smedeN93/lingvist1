import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, LockIcon } from 'lucide-react';

interface VectorProps {
  values: number[];
}

const Vector: React.FC<VectorProps> = ({ values }) => (
  <div className="flex space-x-1">
    {values.map((v, i) => (
      <div key={i} className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs rounded animate-fade-in">
        {v.toFixed(1)}
      </div>
    ))}
  </div>
);

interface VectorWordProps {
  word: string;
  vector: number[];
  show: boolean;
}

const VectorWord: React.FC<VectorWordProps> = ({ word, vector, show }) => (
  <span className="inline-block mx-1 transition-all duration-500 ease-in-out">
    {show ? (
      <Vector values={vector} />
    ) : (
      <span className="bg-yellow-100 px-1 py-0.5 rounded">{word}</span>
    )}
  </span>
);

interface PDFPreviewProps {
  showVector: boolean;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ showVector }) => {
  const content: Array<{ word: string; vector: number[] }> = [
    { word: "København", vector: [0.2, 0.3, 0.5] },
    { word: "er", vector: [0.1, 0.1] },
    { word: "hovedstaden", vector: [0.4, 0.5, 0.3] },
    { word: "i", vector: [0.0, 0.1] },
    { word: "Danmark", vector: [0.3, 0.4, 0.2] },
    { word: ".", vector: [0.0] },
    { word: "Byen", vector: [0.2, 0.1, 0.3] },
    { word: "er", vector: [0.1, 0.1] },
    { word: "kendt", vector: [0.3, 0.2, 0.4] },
    { word: "for", vector: [0.1, 0.2] },
    { word: "sin", vector: [0.1, 0.1] },
    { word: "cykelkultur", vector: [0.5, 0.4, 0.6] },
    { word: "og", vector: [0.1, 0.0] },
    { word: "arkitektur", vector: [0.4, 0.5, 0.3] },
    { word: ".", vector: [0.0] },
  ];

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-md max-w-2xl mx-auto">
      <p className="font-bold text-lg mb-2">Københavns Geografi</p>
      <div className="text-sm space-y-2">
        <p>
          {content.map((item, index) => (
            <VectorWord key={index} word={item.word} vector={item.vector} show={showVector} />
          ))}
        </p>
      </div>
    </div>
  );
};

interface DocumentProps {
  content: string;
  similarity: number;
}

const Document: React.FC<DocumentProps> = ({ content, similarity }) => (
  <div className="border border-gray-300 p-2 rounded mt-2 bg-gray-50 animate-slide-in">
    <p>{content}</p>
    <p className="text-sm text-gray-600">Lighedsscore: {similarity.toFixed(2)}</p>
  </div>
);

interface Step {
  title: string;
  explanation: string;
  content: React.ReactNode;
}

const ComprehensiveRAGVisualization: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showVector, setShowVector] = useState<boolean>(false);
  const query = "Hvad er hovedstaden i Danmark?";

  const queryVector: number[] = [0.2, 0.3, 0.5];
  const documents: Array<{ content: string; vector: number[]; similarity: number }> = [
    { content: "København er hovedstaden i Danmark.", vector: [0.2, 0.3, 0.5], similarity: 1.0 },
    { content: "Danmark ligger i Nordeuropa.", vector: [0.1, 0.2, 0.4], similarity: 0.8 },
    { content: "Københavns Havn er en populær attraktion.", vector: [0.0, 0.1, 0.3], similarity: 0.6 },
  ];

  const steps: Step[] = [
    {
      title: "Vi danner en vidensbase.",
      explanation: "RAG starter med en vidensbase, som er en samling af information, der er blevet behandlet og gemt. Når du uploader din PDF, så gemmes den ikke som tekst, men som matematiske repræsentationer kaldet vektorer, der så at sige indrammer ordenes betydning. I Lingvist tilfælde, er vidensbasen dine dokumenter. For enkelthedensskyld, så bruger vi her et fiktivt uddrag af et dokument om Københavns geografi.",
      content: (
        <div>
          <p className="mb-4">Et givent stykke tekst fra vores dokument:</p>
          <PDFPreview showVector={showVector} />
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setShowVector(!showVector)} 
              className="px-4 py-2 bg-black text-white rounded transition-all duration-200 ease-in-out hover:bg-gray-800"
            >
              {showVector ? "Vis Tekst" : "Vis Vektorer"}
            </button>
          </div>
        </div>
      )
    },
    { 
      title: "Du stiller et spørgsmål.", 
      explanation: "Selve processen med at finde de mest nøjagtigt svar til dig, begynder selvfølgelig med at du stiller et spørgsmål. Dette spørgsmål vil blive brugt til at søge i vores vidensbase efter relevant information. Husk på, at vores vidensbase af dokumenter, blot er vektorer - dvs. en lang række tal.",
      content: (
        <div>
          <p className="mb-2">Eksempel på spørgsmål om Københavns geografi:</p>
          <div className="relative">
            <input 
              type="text" 
              value={query}
              readOnly
              className="w-full p-2 pr-8 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <LockIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          </div>
          <p className="text-sm text-gray-500 mt-1">Denne forespørgsel er låst til demonstrationsformål.</p>
        </div>
      )
    },
    { 
      title: "Vektorisering.", 
      explanation: "Også dit spørgsmål bliver derfor konverteret til vektorer. Det tillader simpelthen at AI kan behandle det effektivt, og sammenligne dit spørgsmål med resten af dit dokument og finde det mest sandsynlige korrekte svar.",
      content: (
        <div>
          <p>Spørgsmål: &quot;{query}&quot;</p>
          <p className="mt-2">Vektor-repræsentation:</p>
          <Vector values={queryVector} />
        </div>
      )
    },
    { 
      title: "Lighedssøgning.", 
      explanation: "Næste skridt er nu at søge efter vektorer i vidensbasen, der ligner vektorene fra dit spørgsmål. Dette gøres ved at sammenligne spørgsmålvektorene med vektorerne af passager i dokumentet. Ligheden beregnes matematisk, ofte ved hjælp af en metode kaldet cosinuslighed.",
      content: (
        <div>
          <p>Finder lignende vektorer i vores dokumentet om Københavns geografi...</p>
          {documents.map((doc, index) => (
            <div key={index} className="mt-2">
              <Vector values={doc.vector} />
              <p className="text-sm">Lighedsscore: {doc.similarity.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )
    },
    { 
      title: "Relevante passager fra dokumentet hentes.", 
      explanation: 'Baseret på lighedssøgningen henter systemet de mest relevante passager fra dokumentet. Det er tekststykker, hvis betydning mest nøjagtigt matcher spørgsmålets betydning, ifølge deres vektor-repræsentationer.',
      content: (
        <div>
          <p>Hentede passager fra dokumentet:</p>
          {documents.map((doc, index) => (
            <Document key={index} {...doc} />
          ))}
        </div>
      )
    },
    { 
      title: 'Svargenering.', 
      explanation: 'Endelig bruger vi AI på de hentede passager og det originale spørgsmål til at generere et sammenhængende svar. Men altså, vi kopierer og indsætter ikke bare, men syntetiserer informationen for direkte at besvare spørgsmålet.',
      content: (
        <div>
          <p>Genereret svar baseret på fundne passager:</p>
          <p className="font-bold mt-2 p-2 bg-gray-50 border border-gray-300 rounded animate-fade-in">Hovedstaden i Danmark er København. Den ligger i Nordeuropa, og Københavns Havn er en populær attraktion i byen.</p>
        </div>
      )
    }
  ];

  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-center">Teknikken bag Lingvist.</h3>
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg transition-all duration-300 ease-in-out">
        <h3 className="font-bold text-2xl mb-3 transition-opacity duration-300 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>{steps[step].title}</h3>
        <p className="text-gray-600 mb-4 transition-opacity duration-300 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>{steps[step].explanation}</p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-opacity duration-300 ease-in-out min-h-[400px]" style={{ opacity: isTransitioning ? 0 : 1 }}>
          {steps[step].content}
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        {step > 0 && (
          <button 
            onClick={() => handleStepChange(step - 1)}
            className="px-4 py-2 bg-black text-white rounded flex items-center transition-all duration-200 ease-in-out hover:bg-gray-800 transform hover:-translate-x-1"
          >
            <ArrowLeft className="mr-2" /> Forrige
          </button>
        )}
        {step === 0 && <div></div>}
        <span className="text-gray-600">Trin {step + 1} af {steps.length}</span>
        {step < steps.length - 1 && (
          <button 
            onClick={() => handleStepChange(step + 1)}
            className="px-4 py-2 bg-black text-white rounded flex items-center transition-all duration-200 ease-in-out hover:bg-gray-800 transform hover:translate-x-1"
          >
            Næste <ArrowRight className="ml-2" />
          </button>
        )}
        {step === steps.length - 1 && <div></div>}
      </div>
    </div>
  );
};

export default ComprehensiveRAGVisualization;