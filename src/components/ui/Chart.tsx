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
  studieDetaljer: React.ReactNode;
  studieLink?: string;
}

const StudyInfoDialog: React.FC<StudyInfoDialogProps> = ({ studieNavn, studieDetaljer, studieLink }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="text-[8px] text-blue-500 hover:text-blue-700 cursor-pointer">Se mere.</span>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl w-full text-left">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{studieNavn}</AlertDialogTitle>
          <div className="mt-2 text-sm text-gray-500 space-y-4 text-left">
            {studieDetaljer}
            {studieLink && (
              <div className="mt-4">
                <a href={studieLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Læs mere om studiet her
                </a>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end">
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
        <span className="text-[8px] text-slate-500 mr-1">
          *Repræsentative tal baseret på videnskabeligt studie.
        </span>
        <StudyInfoDialog 
          studieNavn="RAG-teknologi øger AI&apos;s nøjagtighed med 29% i teknisk dokumentanalyse" 
          studieDetaljer={
            <>
              <div>Studiet startede med en undren: selv førende AI-modeller havde svært ved at besvare komplekse tekniske spørgsmål præcist, selv med adgang til relevante PDF&apos;er.</div>
              <div>Forskerne undersøgte dertil hvorvidt en ny form for arkitektur - RAG (Retrieval-Augmented Generation) var bedre.</div>
              <div>Lingvist bruger samme RAG-arkitektur med en brugervenlig grænseflade. Fordelene ved den metode er at:</div>
              <ul className="list-disc pl-5">
                <li>Din PDF bliver AI&apos;ens primære informationskilde.</li>
                <li>Systemet finder de mest relevante afsnit for hvert spørgsmål.</li>
                <li>Du får præcise svar baseret direkte på dit dokument.</li>
              </ul>
              <div> <span className="font-bold">Resultat:</span> 29% mere nøjagtighed og relevans i svarene.</div>
            </>
          }
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
        <span className="text-[8px] text-slate-500 mr-1">
          *Repræsentative tal baseret på videnskabeligt studie.
        </span>
        <StudyInfoDialog 
          studieNavn="2024-studie viser at RAG gør dokumentsøgning 22% mere præcis" 
          studieDetaljer={
            <>
              <div>Studiet undersøgte hvor gode avancerede AI-systemer, er til at læse og forstå lange, komplekse dokumenter, og besvare spørgsmål om dem.</div>
              <div>Det de kunne se var, at hvis du leder efter meget præcise svar i en lang rapport, kontrakt eller afhandling med spørgsmål som &apos;Hvilke metoder blev brugt i eksperiment X?&apos; eller &apos;Hvad for nogle krav er der til brugerfladen i x-system?&apos;, så er standard AI&apos;er (ChatGPT mv.) ikke de bedste værktøjer</div>
              <div>RAG-arkitektur - den samme som Lingvist anvender - var markant bedre til den slags opgaver.</div>
              <div className="font-bold">Nøgleresultater:</div>
              <ul className="list-disc pl-5">
                <li>Standard AI&apos;er var ikke de bedste for specifikke forespørgsler.</li>
                <li>Lingvist arkitketur var særlig effektiv for faktuelle spørgsmål.</li>
                <li>Gør dine dokumenter til den primære informationskilde.</li>
                <li>Bedre til at fokusere på de meste relevante dele af dine dokumenter.</li>
                <li>Undgår forkerte svar som almindelige AI laver.</li>
              </ul>
              <div><span className="font-bold">Resultat:</span> 22% mere præcision og skarphed i faktuelle spørgsmål.</div>
            </>
          }
          studieLink="https://arxiv.org/abs/2407.07321"
        />
      </div>
    </div>
  );
}
export default ChartForSmallCard;