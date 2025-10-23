// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useUsuario } from '@/hooks/useUsuario';

const LoginForm = () => {
  const navigate = useNavigate();
  const { fetchUsuario } = useUsuario();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    senha: '',
    confirmSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    if (isLogin) {
      await axios.post(
        "http://localhost:3000/auth/login",
        { email: formData.email, senha: formData.senha },
        { withCredentials: true }
      );

      // 👉 Agora só navega quando já atualizou o usuário
      await fetchUsuario();

      toast.success("Login realizado com sucesso!");
      navigate("/ordens");
    } else {
      if (formData.senha !== formData.confirmSenha) {
        throw new Error("As senhas não coincidem");
      }

      await axios.post("http://localhost:3000/auth/register", {
        name: formData.name,
        email: formData.email,
        senha: formData.senha,
      });

      setSuccess("Usuário criado com sucesso! Faça login");
      setIsLogin(true);
      setFormData((prev) => ({
        ...prev,
        senha: "",
        confirmSenha: "",
      }));
    }
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Ocorreu um erro";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <img 
              src="/cropped-A.png" 
              alt="Logo da Empresa" 
              width={80} 
              height={80}
              className="mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </h2>
        </div>
        <div className="bg-[#11172D] rounded-2xl shadow-xl overflow-hidden border border-purple-600/30">
          <div className="p-8">
            {success && (
              <div className="mb-6 p-3 rounded-lg bg-green-900/20 border border-green-700 text-green-300">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-900/20 border border-red-700 text-red-300">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-1">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-purple-700/50 text-white placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Digite seu nome"
                  />
                </div>
              )}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F172A] border border-purple-700/50 text-white placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Campo de Senha com ícone */}
              <div className="mb-5 relative">
                <label htmlFor="Senha" className="block text-sm font-medium text-purple-300 mb-1">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type={showSenha ? 'text' : 'senha'}
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#0F172A] border border-purple-700/50 text-white placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={isLogin ? "Sua senha" : "Crie uma senha segura"}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((prev) => !prev)}
                  className="absolute right-4 top-[38px] text-purple-400 hover:text-white"
                >
                  {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Campo de confirmação de senha com ícone */}
              {!isLogin && (
                <div className="mb-6 relative">
                  <label htmlFor="confirmSenha" className="block text-sm font-medium text-purple-300 mb-1">
                    Confirmar senha
                  </label>
                  <input
                    id="confirmSenha"
                    name="confirmSenha"
                    type={showConfirmSenha ? 'text' : 'Senha'}
                    required
                    value={formData.confirmSenha}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-[#0F172A] border border-purple-700/50 text-white placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmSenha((prev) => !prev)}
                    className="absolute right-4 top-[38px] text-purple-400 hover:text-white"
                  >
                    {showConfirmSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#11172D]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processando...
                  </span>
                ) : isLogin ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
          </div>
         
        </div>
        <div className="mt-8 text-center text-sm text-purple-400">
          <p>© {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
