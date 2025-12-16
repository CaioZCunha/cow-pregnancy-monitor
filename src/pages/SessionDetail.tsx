import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Heart, Stethoscope, Download, Plus } from "lucide-react";
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

    // Update localStorage
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{session.name}</h1>
              <p className="text-sm text-primary-foreground/80">{session.cowCount} vacas</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={downloadReport}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{stats.pregnant}</p>
              <p className="text-xs text-muted-foreground">Grávidas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{stats.notPregnant}</p>
              <p className="text-xs text-muted-foreground">Não grávidas</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Month Selector */}
        <Card className="border-0 shadow-soft animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mês da verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {MONTHS.map((month) => (
                <Badge
                  key={month}
                  variant={selectedMonth === month ? "default" : "secondary"}
                  className={`cursor-pointer shrink-0 px-3 py-1.5 ${
                    selectedMonth === month 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Análise de Áudio - Vaca {selectedCow}</DialogTitle>
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
