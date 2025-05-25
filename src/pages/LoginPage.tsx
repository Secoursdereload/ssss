import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPopupWarning, setShowPopupWarning] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/servers');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      navigate('/servers');
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setShowPopupWarning(false);
      await loginWithGoogle();
      navigate('/servers');
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      if (error.code === 'auth/popup-blocked') {
        setShowPopupWarning(true);
        // Retry with redirect method after a short delay
        setTimeout(async () => {
          try {
            await loginWithGoogle(true); // Pass true to use redirect method
          } catch (redirectError) {
            console.error('Erreur de redirection Google:', redirectError);
          }
        }, 1000);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0518] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?auto=compress&cs=tinysrgb&w=1280')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0518]/90 via-[#1A0F2E]/90 to-[#2D1B4E]/90"></div>
        
        <motion.div 
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-600/20 filter blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-blue-600/20 filter blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <motion.div 
        className="bg-[#1A0F2E]/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLoginMode ? 'Bienvenue' : 'Créer un compte'}
          </h1>
          <p className="text-gray-300">
            {isLoginMode ? 'Connectez-vous pour accéder aux serveurs Discord' : 'Rejoignez notre communauté'}
          </p>
        </div>

        {showPopupWarning && (
          <div className="mb-4 p-3 bg-purple-900/50 rounded-lg">
            <p className="text-amber-300 text-sm text-center">
              Les popups sont bloqués. Nous allons essayer une autre méthode de connexion...
            </p>
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4 text-center">
          Veuillez autoriser les popups dans votre navigateur pour la connexion Google.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center mb-6"
        >
          <Chrome size={20} className="mr-2" />
          Continuer avec Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1A0F2E] text-gray-400">ou</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#2D1B4E] border border-purple-900 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#2D1B4E] border border-purple-900 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>
          
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-[#2D1B4E] border border-purple-900 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <LogIn size={20} className="mr-2" />
            {isLoading ? 'Traitement...' : isLoginMode ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isLoginMode ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mt-6 text-center">
          En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;