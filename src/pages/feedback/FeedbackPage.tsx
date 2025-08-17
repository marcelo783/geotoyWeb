import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

const FeedbackPage = () => {
  const [rating, setRating] = useState({
    atendimento: 0,
    tempoEntrega: 0,
    qualidadeMaterial: 0
  });
  const [comentario, setComentario] = useState('');

  const handleRatingChange = (category: keyof typeof rating, value: number) => {
    setRating(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar o feedback
    console.log({ rating, comentario });
  };

  const RatingStars = ({ 
    category, 
    label 
  }: { 
    category: keyof typeof rating; 
    label: string 
  }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{label}</h3>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none"
          >
            <Star
              size={28}
              className={star <= rating[category] ? 
                "fill-[#ec4899] text-[#ec4899]" : 
                "fill-gray-300 text-gray-300"}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {rating[category] === 0 && "Selecione uma avaliação"}
        {rating[category] === 1 && "Ruim"}
        {rating[category] === 2 && "Regular"}
        {rating[category] === 3 && "Bom"}
        {rating[category] === 4 && "Muito bom"}
        {rating[category] === 5 && "Ótimo"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] py-8 px-6 text-center">
          <img 
            src="https://i.postimg.cc/vZ7q8w62/Camada-1.png" 
            alt="Logo Geotoy" 
            className="h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-white">Avalie sua experiência</h1>
          <p className="text-[#cbd5e1] mt-2">
            Sua opinião nos ajuda a melhorar cada vez mais!
          </p>
        </div>

        {/* Conteúdo */}
        <div className="  p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <RatingStars 
              category="atendimento" 
              label="Atendimento" 
            />
            
            <RatingStars 
              category="tempoEntrega" 
              label="Tempo de entrega" 
            />
            
            <RatingStars 
              category="qualidadeMaterial" 
              label="Qualidade do material" 
            />

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Deixe seu comentário ou sugestão
              </h3>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="O que podemos melhorar? Conte para nós!"
                className="min-h-[120px]"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity shadow-lg"
                disabled={
                  rating.atendimento === 0 || 
                  rating.tempoEntrega === 0 || 
                  rating.qualidadeMaterial === 0
                }
              >
                Enviar Avaliação
              </Button>
            </div>
          </form>
        </div>

        {/* Rodapé */}
        <div className="bg-[#0f172a] text-[#cbd5e1] text-center py-6 px-4 text-sm">
          <img 
            src="https://i.postimg.cc/9QHgjQzq/cropped-A-1.png" 
            alt="Geotoy Logo" 
            className="h-10 mx-auto mb-3 opacity-80"
          />
          <p>© 2024 - Geotoy LTDA</p>
          <p className="mt-1">Cada toy art é uma obra de arte única</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;