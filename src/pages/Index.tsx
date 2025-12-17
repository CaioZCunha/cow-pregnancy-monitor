import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, BarChart3, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />

        <div className="absolute top-40 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl animate-pulse delay-500" />

      </div>


      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg">

            <Heart className="w-5 h-5 text-white" />

          </div>

          <div>

            <h1 className="text-lg font-bold text-gray-800">BovCheck</h1>

            <p className="text-xs text-emerald-600 font-medium">by Trinca P&D</p>

          </div>

        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          Entrar
        </Button>

      </header>


      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium border border-emerald-200">

              <Sparkles className="w-4 h-4" />
              
              <span>
                Tecnologia em pesquisa e inovação veterinária
              </span>

            </span>

          </div>


          {/* Main Title */}
          <div className="space-y-6 mb-12">

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">

              Detecção de Gravidez
              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Bovina Inteligente
              </span>

            </h2>

            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">

              Plataforma de pesquisa para apoio à análise de sinais de ultrassom na detecção de gestação bovina de forma rápida, precisa e eficiente

            </p>

          </div>


          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">

            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/50 group"
            >
              Começar Gratuitamente
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Conheça o sistema
            </Button>

          </div>


          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-3 gap-6 mb-16">

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4 mx-auto">

                <Stethoscope className="w-6 h-6 text-white" />

              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">

                Análise por Ultrassom

              </h3>

              <p className="text-gray-600 text-sm">

                Processa áudio de ultrassom em tempo real para detectar batimentos cardíacos do feto

              </p>

            </div>


            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 mx-auto">

                <Heart className="w-6 h-6 text-white" />

              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">

                Detecção Precisa

              </h3>

              <p className="text-gray-600 text-sm">

                Auxilia na interpretação da presença de um ou mais batimentos cardíacos batendo

              </p>

            </div>


            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center mb-4 mx-auto">

                <BarChart3 className="w-6 h-6 text-white" />

              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">

                Relatórios Completos

              </h3>

              <p className="text-gray-600 text-sm">

                Gera planilhas mensais e histórico completo de todas as verificações

              </p>

            </div>

          </div>


          {/* Benefits List */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/60 mb-16">

            <h3 className="text-xl font-semibold text-gray-800 mb-6">

              Por que escolher o BovCheck?

            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-left">

              {[
                "Interface amigável e intuitiva",
                "Gestão ilimitada de sessões",
                "Acompanhamento mensal detalhado",
                "Busca avançada de registros",
                "Exportação de relatórios em CSV",
                "Sistema 100% seguro e confiável"
              ].map((benefit, index) => (

                <div key={index} className="flex items-center gap-3 text-gray-700">

                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                  {benefit}

                </div>

              ))}

            </div>

          </div>


          {/* Social Proof */}
          <div className="text-center">

            <p className="text-sm text-gray-500 mb-4">

              Desenvolvido por

            </p>

            <div className="inline-flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold">

                T

              </div>

              <span className="text-gray-800 font-semibold">
                Trinca Pesquisa & Desenvolvimento
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-2">

              Inovação e tecnologia para o agronegócio

            </p>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-100 bg-white/50 backdrop-blur-sm">

        <div className="container mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-gray-600">

              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">

                <Heart className="w-3 h-3 text-white" />

              </div>

              <span className="text-sm">
                © 2024 BovCheck - Trinca P&D
              </span>

            </div>

            <p className="text-sm text-gray-500">

              Sistema de detecção de gestação bovina por ultrassom

            </p>

          </div>

        </div>

      </footer>

    </div>

  );
};

export default Index;
