import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Check, X } from "lucide-react";

interface Session {
  id: string;
  name: string;
  cowCount: number;
  createdAt: string;
  records: Record<number, Record<string, "S" | "N" | null>>;
}

interface CowTableProps {
  session: Session;
  onStartAnalysis: (cowNumber: number) => void;
  selectedMonth: string;
  onUpdateRecord: (cowNumber: number, month: string, status: "S" | "N") => void;
}

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const CowTable = ({ session, onStartAnalysis, selectedMonth, onUpdateRecord }: CowTableProps) => {
  const cows = Array.from({ length: session.cowCount }, (_, i) => i + 1);

  const getStatusBadge = (status: "S" | "N" | null | undefined) => {
    if (!status) return null;
    
    return status === "S" ? (
      <Badge className="bg-success text-success-foreground hover:bg-success/90 font-bold">
        S
      </Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground hover:bg-warning/90 font-bold">
        N
      </Badge>
    );
  };

  const handleManualInput = (cowNumber: number, month: string, currentStatus: "S" | "N" | null | undefined) => {
    // Toggle between S, N, and null
    let newStatus: "S" | "N";
    if (!currentStatus) {
      newStatus = "S";
    } else if (currentStatus === "S") {
      newStatus = "N";
    } else {
      newStatus = "S";
    }
    onUpdateRecord(cowNumber, month, newStatus);
  };

  return (
    <Card className="border-0 shadow-soft overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Registro de Verificações</span>
          <span className="text-sm font-normal text-muted-foreground">
            Toque nas células para editar manualmente
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-20 text-center font-bold sticky left-0 bg-muted/50 z-10">
                  Vaca
                </TableHead>
                {MONTHS.map((month) => (
                  <TableHead
                    key={month}
                    className={`text-center w-14 ${
                      month === selectedMonth ? "bg-primary/10 text-primary font-bold" : ""
                    }`}
                  >
                    {month}
                  </TableHead>
                ))}
                <TableHead className="w-24 text-center sticky right-0 bg-muted/50 z-10">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cows.map((cowNumber) => (
                <TableRow key={cowNumber} className="hover:bg-muted/30">
                  <TableCell className="text-center font-bold sticky left-0 bg-card z-10">
                    {cowNumber}
                  </TableCell>
                  {MONTHS.map((month) => {
                    const status = session.records[cowNumber]?.[month];
                    return (
                      <TableCell
                        key={month}
                        className={`text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                          month === selectedMonth ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleManualInput(cowNumber, month, status)}
                      >
                        {getStatusBadge(status) || (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center sticky right-0 bg-card z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => onStartAnalysis(cowNumber)}
                    >
                      <Stethoscope className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CowTable;
