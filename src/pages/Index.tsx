import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-success/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md text-center animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary shadow-elevated mb-6 animate-float">
            <div className="relative">
              <Heart className="w-12 h-12 text-primary-foreground" />
              <Stethoscope className="w-6 h-6 text-primary-foreground absolute -bottom-1 -right-1" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3">
            BovCheck
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Detecção de gravidez bovina por ultrassom
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="text-center p-4 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Análise de áudio</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Detecção precisa</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">Relatórios</p>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate("/auth")}
            size="xl"
            className="w-full group"
          >
            Começar agora
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            Gerencie suas verificações de forma simples
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          Sistema inteligente de detecção de gravidez bovina
        </p>
      </footer>
    </div>
  );
};

export default Index;
