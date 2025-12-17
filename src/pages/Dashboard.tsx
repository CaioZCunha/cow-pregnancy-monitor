import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FolderOpen, Heart, LogOut, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";

interface Session {
  id: string;
  name: string;
  cowCount: number;
  createdAt: string;
  records: Record<number, Record<string, "S" | "N" | null>>;
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [newCowCount, setNewCowCount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; farmName: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));

    const storedSessions = localStorage.getItem("sessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, [navigate]);

  const handleCreateSession = () => {
    if (!newSessionName || !newCowCount || parseInt(newCowCount) < 1) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      });
      return;
    }

    const cowCount = parseInt(newCowCount);
    const initialRecords: Record<number, Record<string, "S" | "N" | null>> = {};
    for (let i = 1; i <= cowCount; i++) {
      initialRecords[i] = {};
    }

    const newSession: Session = {
      id: Date.now().toString(),
      name: newSessionName,
      cowCount,
      createdAt: new Date().toISOString(),
      records: initialRecords,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));

    toast({
      title: "Sessão criada!",
      description: `${newSessionName} com ${cowCount} vacas foi criada.`,
    });

    setNewSessionName("");
    setNewCowCount("");
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getSessionStats = (session: Session) => {
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

  const totalStats = sessions.reduce(
    (acc, session) => {
      const stats = getSessionStats(session);
      return {
        pregnant: acc.pregnant + stats.pregnant,
        notPregnant: acc.notPregnant + stats.notPregnant,
        pending: acc.pending + stats.pending,
        totalCows: acc.totalCows + session.cowCount,
      };
    },
    { pregnant: 0, notPregnant: 0, pending: 0, totalCows: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden pb-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-green-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BovCheck</h1>
                <p className="text-sm text-white/80">{user?.farmName}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">
            Olá, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-gray-500">Gerencie suas sessões de verificação</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
                  <p className="text-xs text-gray-500">Sessões</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalStats.totalCows}</p>
                  <p className="text-xs text-gray-500">Total vacas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{totalStats.pregnant}</p>
                  <p className="text-xs text-gray-500">Grávidas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{totalStats.notPregnant}</p>
                  <p className="text-xs text-gray-500">Não grávidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Suas Sessões</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md shadow-emerald-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Nova Sessão
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm border border-white/80">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Criar Nova Sessão</DialogTitle>
                  <DialogDescription>
                    Defina o nome e a quantidade de vacas para esta sessão
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionName" className="text-gray-700">Nome da sessão</Label>
                    <Input
                      id="sessionName"
                      placeholder="Ex: Lote A - Dezembro 2024"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cowCount" className="text-gray-700">Quantidade de vacas</Label>
                    <Input
                      id="cowCount"
                      type="number"
                      min="1"
                      placeholder="Ex: 50"
                      value={newCowCount}
                      onChange={(e) => setNewCowCount(e.target.value)}
                      className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateSession} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  >
                    Criar Sessão
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {sessions.length === 0 ? (
            <Card className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-emerald-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-1">Nenhuma sessão criada</h4>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Crie sua primeira sessão para começar a registrar verificações
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Criar primeira sessão
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session, index) => {
                const stats = getSessionStats(session);
                return (
                  <Card
                    key={session.id}
                    className="cursor-pointer bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate(`/session/${session.id}`)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-800">{session.name}</CardTitle>
                      <CardDescription>
                        {session.cowCount} vacas • Criada em{" "}
                        {new Date(session.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-gray-500">{stats.pregnant} grávidas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-gray-500">{stats.notPregnant} não</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          <span className="text-gray-500">{stats.pending} pendentes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Search Bar */}
      <SearchBar />
    </div>
  );
};

export default Dashboard;
