import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mic, Activity, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AudioAnalyzerProps {
  onComplete: (result: "S" | "N") => void;
  cowNumber: number;
  month: string;
}

type AnalysisState = "idle" | "recording" | "analyzing" | "complete";

const AudioAnalyzer = ({ onComplete, cowNumber, month }: AudioAnalyzerProps) => {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<"S" | "N" | null>(null);
  const [heartbeats, setHeartbeats] = useState<number>(0);

  const startRecording = () => {
    setState("recording");
    setResult(null);
    setHeartbeats(0);

    // Simulate recording time
    setTimeout(() => {
      setState("analyzing");
      
      // Simulate analysis
      setTimeout(() => {
        // Random result for demo - in production this would be real analysis
        const detected = Math.random() > 0.4 ? "S" : "N";
        const beats = detected === "S" ? 2 : 1;
        setHeartbeats(beats);
        setResult(detected);
        setState("complete");
      }, 2000);
    }, 3000);
  };

  const handleConfirm = () => {
    if (result) {
      onComplete(result);
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setHeartbeats(0);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Visualization Area */}
      <Card className="border-0 bg-muted/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            {state === "idle" && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground">Conecte o dispositivo e inicie a captura</p>
              </div>
            )}

            {state === "recording" && (
              <div className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse-ring">
                    <Mic className="w-12 h-12 text-destructive" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                    </span>
                  </div>
                </div>
                <p className="text-foreground font-medium mt-4">Gravando áudio...</p>
                <p className="text-sm text-muted-foreground">Mantenha o dispositivo estável</p>
                
                {/* Audio wave visualization */}
                <div className="flex items-center justify-center gap-1 mt-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-wave"
                      style={{
                        height: `${Math.random() * 30 + 10}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {state === "analyzing" && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Activity className="w-12 h-12 text-accent animate-pulse" />
                </div>
                <p className="text-foreground font-medium">Analisando batimentos...</p>
                <p className="text-sm text-muted-foreground">Detectando padrões cardíacos</p>
                <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto mt-4" />
              </div>
            )}

            {state === "complete" && result && (
              <div className="text-center w-full">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  result === "S" ? "bg-success/20" : "bg-warning/20"
                }`}>
                  {result === "S" ? (
                    <CheckCircle className="w-12 h-12 text-success" />
                  ) : (
                    <XCircle className="w-12 h-12 text-warning" />
                  )}
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  result === "S" ? "text-success" : "text-warning"
                }`}>
                  {result === "S" ? "GRÁVIDA" : "NÃO GRÁVIDA"}
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {Array.from({ length: heartbeats }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-6 h-6 ${result === "S" ? "text-success" : "text-warning"} animate-pulse`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground">
                  {heartbeats === 2 
                    ? "Dois batimentos detectados (mãe + feto)" 
                    : "Apenas um batimento detectado"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>Vaca: <strong className="text-foreground">{cowNumber}</strong></span>
        <span>Mês: <strong className="text-foreground">{month}</strong></span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {state === "idle" && (
          <Button onClick={startRecording} className="flex-1" size="lg">
            <Mic className="w-4 h-4 mr-2" />
            Iniciar Captura
          </Button>
        )}

        {(state === "recording" || state === "analyzing") && (
          <Button disabled className="flex-1" size="lg" variant="secondary">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {state === "recording" ? "Gravando..." : "Analisando..."}
          </Button>
        )}

        {state === "complete" && (
          <>
            <Button onClick={handleReset} variant="outline" className="flex-1" size="lg">
              Repetir
            </Button>
            <Button 
              onClick={handleConfirm} 
              variant={result === "S" ? "success" : "accent"}
              className="flex-1" 
              size="lg"
            >
              Confirmar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioAnalyzer;
