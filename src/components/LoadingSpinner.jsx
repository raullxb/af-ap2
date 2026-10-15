import { Loader2 } from 'lucide-react';

/**
 * Componente LoadingSpinner
 * Exibe um indicador visual de carregamento com mensagem customizável.
 *
 * @param {Object} props
 * @param {string} [props.message="Carregando dados meteorológicos..."]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 */
export default function LoadingSpinner({ message = 'Carregando previsões...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-cyan-500/20 blur-md animate-pulse"></div>
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-cyan-400 animate-spin`} />
      </div>
      <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}
