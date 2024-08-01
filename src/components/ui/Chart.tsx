import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface BarDataPoint {
  model: string;
  base: number;
  withRAG: number;
}

const barData: BarDataPoint[] = [
  { model: "GPT-3.5", base: 44, withRAG: 71 },
  { model: "Gemini 1.0", base: 46, withRAG: 75 },
  { model: "GPT-4", base: 51, withRAG: 72 },
];


const ragImprovementData = [
  { model: 'Claude', withoutRAG: 23.47, withRAG: 68.74 },
  { model: 'Gemini', withoutRAG: 46.62, withRAG: 57.06 },
  { model: 'GPT-4', withoutRAG: 56.40, withRAG: 66.86 },
];

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{value: number, name: string}>;
  label?: string;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-slate-950">{label}</p>
        <p className="text-slate-700">Standard: {payload[0].value}%</p>
        <p className="text-blue-600">Forbedret: {payload[1].value}%</p>
      </div>
    );
  }
  return null;
};

interface StudyInfoDialogProps {
  studieNavn: string;
  studieDetaljer: string;
  studieLink?: string;
}

const StudyInfoDialog: React.FC<StudyInfoDialogProps> = ({ studieNavn, studieDetaljer, studieLink }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="text-[7px] text-blue-500 hover:text-blue-700 cursor-pointer">Se mere.</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{studieNavn}</AlertDialogTitle>
          <AlertDialogDescription>
            {studieDetaljer}
            {studieLink && (
              <div className="mt-4">
                <a href={studieLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Læs mere om studiet her
                </a>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Luk</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const CustomRAGTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length === 2) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-slate-950">{label}</p>
        <p className="text-slate-700">Standard: {payload[0].value.toFixed(2)}%</p>
        <p className="text-blue-600">Forbedret: {payload[1].value.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const XAxisWithDefaults = ({ stroke = "#888", tick = { fontSize: 10 }, ...props }) => (
  <XAxis stroke={stroke} tick={tick} {...props} />
);

const YAxisWithDefaults = ({ stroke = "#888", tick = { fontSize: 10 }, ...props }) => (
  <YAxis stroke={stroke} tick={tick} {...props} />
);

export const ChartForSmallCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-grow min-h-[185px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
            <XAxis dataKey="model" stroke="#888" tick={{fontSize: 10}} />
            <YAxis stroke="#888" tick={{fontSize: 10}} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="base" fill="#64748b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="withRAG" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 mr-2">
        <span className="text-[7px] text-slate-500 mr-1">
          *Repræsentative tal baseret på videnskabeligt studie.
        </span>
        <StudyInfoDialog 
          studieNavn="RAG-teknologi øger AI's nøjagtighed med 29% i teknisk dokumentanalyse" 
          studieDetaljer="Et studie fra 2024 af førende spanske universiteter, herunder Universitat Pompeu Fabra og Centre Tecnologic de Telecomunicacions de Catalunya, viste, at selv førende AI-modeller havde svært ved at besvare komplekse tekniske spørgsmål præcist, selv når de fik adgang til relevante PDF'er. Forskerne tog derfor en lidt anderledes metode i brug - kaldet RAG (Retrieval-Augmented Generation), som endte med at forbedre svarenes nøjagtighed med 29%.
Lingvist bruger samme RAG-arkitektur, og har bygget en brugerflade der gør det nemt at bruge. Når du uploader din PDF, bliver det AI'ens primære informationskilde. Systemet finder simpelthen derefter de mest relevante afsnit i din PDF for hvert spørgsmål, så du får præcise svar baseret direkte på dit dokument, ikke generelle svar fra AI'ens brede viden. Resultatet er pænt godt, må man sige. 29% mere nøjagtighed og relevans i svarene du får, det er værd at tage med.
"
          studieLink="https://arxiv.org/abs/2406.01768"
        />
      </div>
    </div>
  );
}

export const RAGImprovementChart: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart
            layout="vertical"
            data={ragImprovementData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
            <XAxis type="number" domain={[0, 100]} stroke="#888" tick={{fontSize: 10}} />
            <YAxis dataKey="model" type="category" stroke="#888" tick={{fontSize: 10}} width={35} />
            <Tooltip content={<CustomRAGTooltip />} />
            <Bar dataKey="withoutRAG" fill="#64748b" radius={[0, 4, 4, 0]} />
            <Bar dataKey="withRAG" fill="#2563eb" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-0 mr-2">
        <span className="text-[7px] text-slate-500 mr-1">
          *Repræsentative tal baseret på videnskabeligt studie.
        </span>
        <StudyInfoDialog 
          studieNavn="2024-studie viser at RAG gør dokumentsøgning 22% mere præcis" 
          studieDetaljer="Studiet viste, at hvis du leder efter meget præcise svar i en lang rapport, kontrakt eller afhandling med spørgsmål som 'Hvilke metoder blev brugt i eksperiment X?' eller 'Hvad for nogle krav er der til brugerfladen i x-system?', så er standard AI'er ikke de bedste værktøjer. Tværtimod er RAG-arkitektur op til 22% bedre i gennemsnit på tværs af de standard AI-modeller, som blev testet.
Lingvist har så at sige gjort RAG tilgængeligt for alle, og giver en brugerflade der er nem og enkel. Den gør dine dokumenter til den primære informationskilde, og hjælper derfor AI-modellerne til at holde opmærksomheden på de mest relevante dele af dine dokumenter. Med faktuelle spørgsmål især er der mærkbare forbedringer i skarpheden af svar. Det er værd at prøve - og gratis, ikke mindst."
        studieLink="https://arxiv.org/abs/2407.07321"
        />
      </div>
    </div>
  );
}

export default ChartForSmallCard;