import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { useNoteStore } from '../store/useNoteStore';
import { Github, Mail, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import Logo from './Logo';

export default function Login() {
  const { isDarkMode } = useNoteStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-500 font-sans",
      isDarkMode 
        ? "bg-[#0A0A0B] text-white" 
        : "bg-notion-secondary text-notion-ink"
    )}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        <div className={cn(
          "p-8 md:p-10 rounded-[32px] shadow-2xl border backdrop-blur-xl transition-all duration-500",
          isDarkMode 
            ? "bg-white/[0.03] border-white/10 shadow-black/40" 
            : "bg-white border-notion-border shadow-xl shadow-slate-200/50"
        )}>
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <Logo size={64} className="shadow-2xl shadow-purple-500/20 rounded-3xl" />
            </motion.div>
            
            <h1 className="text-3xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Welcome to Notium
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Your intelligent workspace for ideas and writing
            </p>
          </div>

          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold transition-all shadow-lg",
                isDarkMode 
                  ? "bg-white text-black hover:bg-gray-100 shadow-white/5" 
                  : "bg-[#111827] text-white hover:bg-gray-800 shadow-black/10"
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className={cn("px-4", isDarkMode ? "bg-[#141415] text-gray-500" : "bg-white/80 text-gray-400")}>
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                whileHover={{ y: -1, backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all font-medium",
                  isDarkMode ? "border-white/10 text-gray-300" : "border-gray-200 text-gray-600"
                )}
              >
                <Github size={18} />
                <span className="text-sm">GitHub</span>
              </motion.button>
              <motion.button 
                whileHover={{ y: -1, backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all font-medium",
                  isDarkMode ? "border-white/10 text-gray-300" : "border-gray-200 text-gray-600"
                )}
              >
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </motion.button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
              By continuing, you agree to our <br />
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:underline">Terms of Service</a> and <a href="#" className="text-gray-600 dark:text-gray-300 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
        
       
      </motion.div>
    </div>
  );
}
