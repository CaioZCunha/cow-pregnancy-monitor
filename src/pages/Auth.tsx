import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
    
    if (email && password) {
      toast({
        title: isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!",
        description: isLogin 
          ? "Redirecionando para o dashboard..." 
          : "Sua conta foi criada. Redirecionando...",
      });
      
      localStorage.setItem("user", JSON.stringify({ 
        email, 
        name: name || "Usuário",
        farmName: farmName || "Minha Fazenda" 
      }));
      
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 shadow-lg shadow-emerald-500/30 mb-4">
              <div className="relative">
                <Heart className="w-10 h-10 text-white animate-pulse" />
                <Stethoscope className="w-5 h-5 text-white absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">BovCheck</h1>
            <p className="text-sm text-emerald-600 font-medium">by Trinca P&D</p>
            <p className="text-gray-500 mt-2">Detecção de gravidez bovina inteligente</p>
          </div>

          {/* Auth Card */}
          <Card className="bg-white/60 backdrop-blur-sm border border-white/80 shadow-xl shadow-emerald-500/5">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl text-gray-800">
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
                      <Label htmlFor="name" className="text-gray-700">Seu nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 bg-white/80 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmName" className="text-gray-700">Nome da fazenda</Label>
                      <Input
                        id="farmName"
                        type="text"
                        placeholder="Fazenda Boa Vista"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="h-11 bg-white/80 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-white/80 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10 bg-white/80 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30" 
                  size="lg"
                >
                  {isLogin ? "Entrar" : "Criar conta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {isLogin 
                    ? "Não tem conta? Criar agora" 
                    : "Já tem conta? Fazer login"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Sistema de detecção de gravidez por ultrassom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
