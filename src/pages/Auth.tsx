import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication (replace with real auth later)
    if (email && password) {
      toast({
        title: isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!",
        description: isLogin 
          ? "Redirecionando para o dashboard..." 
          : "Sua conta foi criada. Redirecionando...",
      });
      
      // Store user info temporarily
      localStorage.setItem("user", JSON.stringify({ 
        email, 
        name: name || "Usuário",
        farmName: farmName || "Minha Fazenda" 
      }));
      
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header decoration */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
      
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary shadow-elevated mb-4">
              <div className="relative">
                <Heart className="w-10 h-10 text-primary-foreground animate-pulse-ring" />
                <Stethoscope className="w-5 h-5 text-primary-foreground absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">BovCheck</h1>
            <p className="text-muted-foreground">Detecção de gravidez bovina inteligente</p>
          </div>

          {/* Auth Card */}
          <Card className="shadow-elevated border-0 bg-card">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">
                {isLogin ? "Entrar na conta" : "Criar nova conta"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Digite seus dados para acessar o sistema" 
                  : "Preencha os dados para começar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Seu nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmName">Nome da fazenda</Label>
                      <Input
                        id="farmName"
                        type="text"
                        placeholder="Fazenda Boa Vista"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {isLogin ? "Entrar" : "Criar conta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin 
                    ? "Não tem conta? Criar agora" 
                    : "Já tem conta? Fazer login"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Sistema de detecção de gravidez por ultrassom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
