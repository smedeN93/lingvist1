import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, LockIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface VectorProps {
  values: number[];
  label?: string;
  color?: string;
}

const Vector: React.FC<VectorProps> = ({ values, label, color = 'bg-black' }) => (
  <div className="flex flex-col items-center">
    {label && <span className="text-xs sm:text-sm font-semibold mb-1">{label}</span>}
    <div className="flex space-x-0.5 sm:space-x-1">
      {values.map((v, i) => (
        <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 ${color} text-white flex items-center justify-center text-[10px] sm:text-xs rounded animate-fade-in`}>
          {v.toFixed(1)}
        </div>
      ))}
    </div>
  </div>
);

interface VectorWordProps {
  word: string;
  vector: number[];
  show: boolean;
}

const VectorWord: React.FC<VectorWordProps> = ({ word, vector, show }) => (
  <span className="inline-block mx-0.5 sm:mx-1 transition-all duration-500 ease-in-out">
    {show ? (
      <Vector values={vector} />
    ) : (
      <span className="bg-yellow-100 px-0.5 py-0.5 text-xs sm:text-sm rounded">{word}</span>
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
    <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-6 bg-white shadow-md max-w-full sm:max-w-3xl mx-auto">
      <h2 className="font-bold text-lg sm:text-xl mb-2 sm:mb-4 text-center">Danmarks Geografi</h2>
      <div className="text-sm sm:text-base leading-relaxed">
        {content.map((item, index) => (
          <React.Fragment key={index}>
            <VectorWord word={item.word} vector={item.vector} show={showVector} />
            {item.word === "." && <br className="my-1 sm:my-2" />}
          </React.Fragment>
        ))}
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
    <p className="text-sm">{content}</p>
    <p className="text-xs text-gray-600">Lighedsscore: {similarity.toFixed(2)}</p>
  </div>
);

interface VectorComparisonProps {
  queryText: string;
  queryVector: number[];
  documentText: string;
  documentVector: number[];
  similarity: number;
}

const VectorComparison: React.FC<VectorComparisonProps> = ({
  queryText,
  queryVector,
  documentText,
  documentVector,
  similarity
}) => (
  <div className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      <div>
        <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Spørgsmål:</p>
        <p className="text-xs sm:text-sm mb-1 sm:mb-2">{queryText}</p>
        <Vector values={queryVector} label="Spørgsmålsvektor" color="bg-blue-500" />
      </div>
      <div>
        <p className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Dokument passage:</p>
        <p className="text-xs sm:text-sm mb-1 sm:mb-2">{documentText}</p>
        <Vector values={documentVector} label="Dokumentvektor" color="bg-green-500" />
      </div>
    </div>
    <p className="text-xs sm:text-sm font-semibold mt-2 sm:mt-4">Lighedsscore: {similarity.toFixed(2)}</p>
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
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
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
      explanation: "Retrieval Augmented Generation (RAG) starter med at vi laver en vidensbase, som er en samling af information, der er blevet behandlet og gemt. Allerede når du uploader din PDF så laver vi denne vidensbase, som vi laver søgbar, ved ikke at gemme dokumenterne som tekst, men som matematiske repræsentationer kaldet vektorer, der så at sige indrammer ordenes betydning. For enkelthedensskyld, så bruger vi her et fiktivt uddrag af et dokument om Danmarks geografi.",
      content: (
        <div>
          <p className="mb-2 sm:mb-4 text-sm sm:text-base">Et givent stykke tekst fra vores dokument:</p>
          <PDFPreview showVector={showVector} />
          <div className="mt-2 sm:mt-4 flex justify-center">
            <button 
              onClick={() => setShowVector(!showVector)} 
              className="px-3 py-1 sm:px-4 sm:py-2 bg-black text-white text-sm sm:text-base rounded transition-all duration-200 ease-in-out hover:bg-gray-800"
            >
              {showVector ? "Vis Tekst" : "Vis Vektorer"}
            </button>
          </div>
        </div>
      )
    },
    { 
      title: "Du stiller et spørgsmål.", 
      explanation: "Selve processen med at finde de mest nøjagtigt svar til dig, begynder selvfølgelig med at du stiller et spørgsmål. Vi bruger basalt set spørgsmålet til at søge i de dokumenter som du har uploadet. Og husk på, at vi gemmer blot dine dokumenter som vektorer - dvs. en lang række tal.",
      content: (
        <div>
          <p className="mb-1 sm:mb-2 text-sm sm:text-base">Eksempel på spørgsmål om Danmarks geografi:</p>
          <div className="relative">
            <input 
              type="text" 
              value={query}
              readOnly
              className="w-full p-1 sm:p-2 pr-6 sm:pr-8 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
            />
            <LockIcon className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Denne forespørgsel er låst til demonstrationsformål.</p>
        </div>
      )
    },
    { 
      title: "Vektorisering.", 
      explanation: "Dit spørgsmål bliver konverteret til en vektor. Dette gør det muligt for os at behandle det effektivt og sammenligne dit spørgsmål med indholdet i dit dokument for at finde det mest sandsynlige korrekte svar.",
      content: (
        <div className="border border-gray-200 rounded-lg p-2 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Spørgsmål:</p>
              <p className="bg-blue-100 p-1 sm:p-2 rounded text-xs sm:text-sm">{query}</p>
            </div>
            <div>
              <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Spørgsmålets vektor:</p>
              <Vector values={queryVector} color="bg-blue-500" />
            </div>
          </div>
        </div>
      )
    },
    { 
      title: "Lighedssøgning.", 
      explanation: "I dette trin sammenligner vi vektoren fra dit spørgsmål med vektorerne fra forskellige passager i dokumentet. Dette gøres ved at beregne lighedsscoren mellem vektorerne. Jo højere lighedsscore, jo mere relevant er passagen for dit spørgsmål. Bemærk, hvordan vektorerne for spørgsmålet og de mest relevante passager ligner hinanden mere. Baseret på disse ligheder henter systemet de mest relevante passager fra dokumentet.",
      content: (
        <div>
          <p className="mb-2 sm:mb-4 text-sm sm:text-base">Sammenligning af spørgsmålsvektor med dokumentpassager:</p>
          {documents.map((doc, index) => (
            <VectorComparison
              key={index}
              queryText={query}
              queryVector={queryVector}
              documentText={doc.content}
              documentVector={doc.vector}
              similarity={doc.similarity}
            />
          ))}
        </div>
      )
    },
    { 
      title: 'Svargenering.', 
      explanation: 'Endelig bruger vi AI på de hentede passager og det originale spørgsmål til at generere et sammenhængende svar. Vi kopierer og indsætter ikke bare, men syntetiserer informationen for direkte at besvare spørgsmålet, baseret på de mest relevante passager fundet i lighedssøgningen.',
      content: (
        <div>
          <p className="text-sm sm:text-base">Genereret svar baseret på fundne passager:</p>
          <p className="font-bold mt-1 sm:mt-2 p-1 sm:p-2 bg-gray-50 border border-gray-300 rounded animate-fade-in text-xs sm:text-sm">Hovedstaden i Danmark er København. Den ligger i Nordeuropa, og Københavns Havn er en populær attraktion i byen.</p>
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
    <div className="p-2 sm:p-4 max-w-full sm:max-w-3xl mx-auto">
      <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6 text-center">Teknikken bag Lingvist.</h3>
      <div className="border border-gray-300 rounded-lg p-3 sm:p-6 bg-white shadow-lg transition-all duration-300 ease-in-out">
        <h3 className="font-bold text-lg sm:text-2xl mb-2 sm:mb-3 transition-opacity duration-300 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>{steps[step].title}</h3>
        <div className="mb-2 sm:mb-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800"
          >
            {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="ml-1">Forklaring</span>
          </button>
          {showExplanation && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 transition-opacity duration-300 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>
              {steps[step].explanation}
            </p>
          )}
        </div>
        <div className="bg-gray-50 p-2 sm:p-4 rounded-lg border border-gray-200 transition-opacity duration-300 ease-in-out min-h-[200px] sm:min-h-[400px]" style={{ opacity: isTransitioning ? 0 : 1 }}>
          {steps[step].content}
        </div>
      </div>
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        {step > 0 ? (
          <button 
            onClick={() => handleStepChange(step - 1)}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-800 transform hover:-translate-x-1 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2" size={16} /> Forrige
          </button>
        ) : (
          <div className="w-full sm:w-auto"></div>
        )}
        <span className="text-xs sm:text-sm text-gray-600">Trin {step + 1} af {steps.length}</span>
        {step < steps.length - 1 ? (
          <button 
            onClick={() => handleStepChange(step + 1)}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-800 transform hover:translate-x-1 text-sm sm:text-base"
          >
            Næste <ArrowRight className="ml-2" size={16} />
          </button>
        ) : (
          <div className="w-full sm:w-auto"></div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveRAGVisualization;