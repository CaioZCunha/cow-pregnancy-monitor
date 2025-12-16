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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BovCheck</h1>
                <p className="text-sm text-primary-foreground/80">{user?.farmName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/20">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">
            Olá, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted-foreground">Gerencie suas sessões de verificação</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
                  <p className="text-xs text-muted-foreground">Sessões</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalCows}</p>
                  <p className="text-xs text-muted-foreground">Total vacas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{totalStats.pregnant}</p>
                  <p className="text-xs text-muted-foreground">Grávidas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">{totalStats.notPregnant}</p>
                  <p className="text-xs text-muted-foreground">Não grávidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Suas Sessões</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Nova Sessão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Sessão</DialogTitle>
                  <DialogDescription>
                    Defina o nome e a quantidade de vacas para esta sessão
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionName">Nome da sessão</Label>
                    <Input
                      id="sessionName"
                      placeholder="Ex: Lote A - Dezembro 2024"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cowCount">Quantidade de vacas</Label>
                    <Input
                      id="cowCount"
                      type="number"
                      min="1"
                      placeholder="Ex: 50"
                      value={newCowCount}
                      onChange={(e) => setNewCowCount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateSession} className="w-full">
                    Criar Sessão
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {sessions.length === 0 ? (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-1">Nenhuma sessão criada</h4>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Crie sua primeira sessão para começar a registrar verificações
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
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
                    className="cursor-pointer border-0 shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-1"
                    onClick={() => navigate(`/session/${session.id}`)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{session.name}</CardTitle>
                      <CardDescription>
                        {session.cowCount} vacas • Criada em{" "}
                        {new Date(session.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-muted-foreground">{stats.pregnant} grávidas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-warning" />
                          <span className="text-muted-foreground">{stats.notPregnant} não</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <span className="text-muted-foreground">{stats.pending} pendentes</span>
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
