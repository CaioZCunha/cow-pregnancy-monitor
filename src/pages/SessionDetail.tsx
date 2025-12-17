import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Heart, Stethoscope, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioAnalyzer from "@/components/AudioAnalyzer";
import CowTable from "@/components/CowTable";
import SearchBar from "@/components/SearchBar";

interface Session {
  id: string;
  name: string;
  cowCount: number;
  createdAt: string;
  records: Record<number, Record<string, "S" | "N" | null>>;
}

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedCow, setSelectedCow] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS[new Date().getMonth()]);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  useEffect(() => {
    const storedSessions = localStorage.getItem("sessions");
    if (storedSessions) {
      const sessions: Session[] = JSON.parse(storedSessions);
      const found = sessions.find((s) => s.id === id);
      if (found) {
        setSession(found);
      } else {
        navigate("/dashboard");
      }
    }
  }, [id, navigate]);

  const updateRecord = (cowNumber: number, month: string, status: "S" | "N") => {
    if (!session) return;

    const updatedRecords = {
      ...session.records,
      [cowNumber]: {
        ...session.records[cowNumber],
        [month]: status,
      },
    };

    const updatedSession = { ...session, records: updatedRecords };
    setSession(updatedSession);

    const storedSessions = localStorage.getItem("sessions");
    if (storedSessions) {
      const sessions: Session[] = JSON.parse(storedSessions);
      const updatedSessions = sessions.map((s) => (s.id === id ? updatedSession : s));
      localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    }
  };

  const handleAnalysisComplete = (result: "S" | "N") => {
    if (selectedCow !== null && selectedMonth) {
      updateRecord(selectedCow, selectedMonth, result);
      toast({
        title: result === "S" ? "Gravidez detectada! 🎉" : "Não grávida",
        description: `Vaca ${selectedCow} - ${selectedMonth}: ${result === "S" ? "Grávida" : "Não grávida"}`,
      });
      setIsAnalyzerOpen(false);
      setSelectedCow(null);
    }
  };

  const startAnalysis = (cowNumber: number) => {
    setSelectedCow(cowNumber);
    setIsAnalyzerOpen(true);
  };

  const getStats = () => {
    if (!session) return { pregnant: 0, notPregnant: 0, pending: 0 };
    
    let pregnant = 0;
    let notPregnant = 0;
    let pending = 0;

    Object.values(session.records).forEach((cowRecords) => {
      const lastCheck = Object.values(cowRecords).filter(Boolean).pop();
      if (lastCheck === "S") pregnant++;
      else if (lastCheck === "N") notPregnant++;
      else pending++;
    });

    return { pregnant, notPregnant, pending };
  };

  const downloadReport = () => {
    if (!session) return;

    let csv = "Vaca," + MONTHS.join(",") + "\n";
    
    for (let i = 1; i <= session.cowCount; i++) {
      const row = [i.toString()];
      MONTHS.forEach((month) => {
        row.push(session.records[i]?.[month] || "-");
      });
      csv += row.join(",") + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.name.replace(/\s+/g, "_")}_relatorio.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório baixado!",
      description: "O arquivo CSV foi salvo com sucesso.",
    });
  };

  const stats = getStats();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden pb-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-green-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{session.name}</h1>
              <p className="text-sm text-white/80">{session.cowCount} vacas</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={downloadReport}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{stats.pregnant}</p>
              <p className="text-xs text-gray-500">Grávidas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.notPregnant}</p>
              <p className="text-xs text-gray-500">Não grávidas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Month Selector */}
        <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-800">Mês da verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {MONTHS.map((month) => (
                <Badge
                  key={month}
                  variant={selectedMonth === month ? "default" : "secondary"}
                  className={`cursor-pointer shrink-0 px-3 py-1.5 transition-all ${
                    selectedMonth === month 
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0" 
                      : "bg-white/80 text-gray-600 hover:bg-emerald-50 border border-gray-200"
                  }`}
                  onClick={() => setSelectedMonth(month)}
                >
                  {month}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cow Table */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CowTable
            session={session}
            onStartAnalysis={startAnalysis}
            selectedMonth={selectedMonth}
            onUpdateRecord={updateRecord}
          />
        </div>
      </main>

      {/* Audio Analyzer Dialog */}
      <Dialog open={isAnalyzerOpen} onOpenChange={setIsAnalyzerOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border border-white/80">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Análise de Áudio - Vaca {selectedCow}</DialogTitle>
            <DialogDescription>
              Conecte o dispositivo de ultrassom e inicie a captura do áudio
            </DialogDescription>
          </DialogHeader>
          <AudioAnalyzer
            onComplete={handleAnalysisComplete}
            cowNumber={selectedCow || 0}
            month={selectedMonth}
          />
        </DialogContent>
      </Dialog>

      {/* Search Bar */}
      <SearchBar />
    </div>
  );
};

export default SessionDetail;
