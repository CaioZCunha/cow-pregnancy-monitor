import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Heart, Calendar } from "lucide-react";

interface Session {
  id: string;
  name: string;
  cowCount: number;
  createdAt: string;
  records: Record<number, Record<string, "S" | "N" | null>>;
}

interface SearchResult {
  sessionId: string;
  sessionName: string;
  cowNumber: number;
  status: "S" | "N" | "pending";
  firstCheck: string | null;
  lastCheck: string | null;
}

const SearchBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [results, setResults] = useState<SearchResult[]>([]);

  const performSearch = () => {
    const storedSessions = localStorage.getItem("sessions");
    if (!storedSessions) return;

    const sessions: Session[] = JSON.parse(storedSessions);
    const searchResults: SearchResult[] = [];

    sessions.forEach((session) => {
      if (sessionFilter !== "all" && session.id !== sessionFilter) return;

      for (let i = 1; i <= session.cowCount; i++) {
        // Check cow number match
        if (searchQuery && !i.toString().includes(searchQuery)) continue;

        const cowRecords = session.records[i] || {};
        const recordEntries = Object.entries(cowRecords).filter(([_, v]) => v !== null);
        
        // Determine status
        const lastStatus = recordEntries.length > 0 
          ? recordEntries[recordEntries.length - 1][1] 
          : null;
        
        let status: "S" | "N" | "pending" = "pending";
        if (lastStatus === "S") status = "S";
        else if (lastStatus === "N") status = "N";

        // Filter by status
        if (statusFilter !== "all" && status !== statusFilter) continue;

        // Get first and last check dates
        const firstCheck = recordEntries.length > 0 ? recordEntries[0][0] : null;
        const lastCheck = recordEntries.length > 0 ? recordEntries[recordEntries.length - 1][0] : null;

        searchResults.push({
          sessionId: session.id,
          sessionName: session.name,
          cowNumber: i,
          status,
          firstCheck,
          lastCheck,
        });
      }
    });

    setResults(searchResults.slice(0, 20)); // Limit results
  };

  const getSessions = (): Session[] => {
    const storedSessions = localStorage.getItem("sessions");
    return storedSessions ? JSON.parse(storedSessions) : [];
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-elevated z-30">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="secondary" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Buscar vacas...
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Busca Avançada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label>Número da vaca</Label>
              <Input
                placeholder="Ex: 15"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sessão</Label>
                <Select value={sessionFilter} onValueChange={setSessionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as sessões</SelectItem>
                    {getSessions().map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="S">Grávidas</SelectItem>
                    <SelectItem value="N">Não grávidas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={performSearch} className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Clique em "Buscar" para ver resultados</p>
              </div>
            ) : (
              results.map((result, index) => (
                <Card
                  key={`${result.sessionId}-${result.cowNumber}`}
                  className="cursor-pointer hover:shadow-medium transition-all border-0 shadow-soft"
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/session/${result.sessionId}`);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">
                          Vaca {result.cowNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.sessionName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          result.status === "S" 
                            ? "bg-success/10 text-success" 
                            : result.status === "N"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <Heart className="w-3 h-3" />
                          {result.status === "S" ? "Grávida" : result.status === "N" ? "Não grávida" : "Pendente"}
                        </div>
                      </div>
                    </div>
                    {(result.firstCheck || result.lastCheck) && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {result.firstCheck && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            1ª: {result.firstCheck}
                          </span>
                        )}
                        {result.lastCheck && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Última: {result.lastCheck}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBar;
