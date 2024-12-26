import { useState, useEffect } from "react";

interface UseCarouselProps {
  totalImages: number;
  interval?: number;
}

export const useCarousel = ({
  totalImages,
  interval = 5000,                                            // intervalo de tempo entre as imagens
}: UseCarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);    // setamos a imagem atual como a próxima imagem em módulo do total de imagens
    }, interval);                                             // o módulo do total de imagens serve para criar um ciclo

    return () => clearInterval(timer);
  }, [totalImages, interval]);

  return currentImage;                                        // retornamos o número da imagem atual, que muda a cada 5 segundos
};
