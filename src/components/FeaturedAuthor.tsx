import React, { useState, useEffect } from 'react';
import { AuthorItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  getStoredAuthors,
  subscribeToAuthorsUpdate
} from '../data/authorsData';

interface QuoteSelection {
  author: AuthorItem;
  quoteText: string;
  quoteSource: string;
}

/**
 * Sorteia um escritor ativo e uma de suas frases registradas.
 * Chamado toda vez que a página abre ou quando solicitado manualmente.
 */
function pickRandomWriterAndQuote(authors: AuthorItem[]): QuoteSelection | null {
  const activeAuthors = authors.filter((a) => a.active !== false);
  const pool = activeAuthors.length > 0 ? activeAuthors : authors;
  if (!pool || pool.length === 0) return null;

  // Escolhe aleatoriamente um escritor
  const randomAuthor = pool[Math.floor(Math.random() * pool.length)];

  // Reúne todas as frases cadastradas para este escritor
  const quotesList: { text: string; source: string }[] = [];
  if (randomAuthor.featuredQuote && randomAuthor.featuredQuote.trim()) {
    quotesList.push({
      text: randomAuthor.featuredQuote.trim(),
      source: randomAuthor.quoteSource?.trim() || ''
    });
  }
  if (Array.isArray(randomAuthor.additionalQuotes)) {
    for (const q of randomAuthor.additionalQuotes) {
      if (q && q.text && q.text.trim()) {
        quotesList.push({
          text: q.text.trim(),
          source: q.source?.trim() || randomAuthor.quoteSource?.trim() || ''
        });
      }
    }
  }

  const selectedQuote =
    quotesList.length > 0
      ? quotesList[Math.floor(Math.random() * quotesList.length)]
      : {
          text: randomAuthor.featuredQuote || 'Sentia mais prazer de brincar com as palavras do que de pensar com elas',
          source: randomAuthor.quoteSource || ''
        };

  return {
    author: randomAuthor,
    quoteText: selectedQuote.text,
    quoteSource: selectedQuote.source
  };
}

export const FeaturedAuthor: React.FC = () => {
  const { isDark } = useTheme();

  // Lista de escritores sincronizada com o banco / ADM
  const [authorsList, setAuthorsList] = useState<AuthorItem[]>(() => getStoredAuthors());

  // TODA VEZ QUE A PÁGINA ABRE: seleciona aleatoriamente um escritor e uma frase
  const [selection, setSelection] = useState<QuoteSelection | null>(() => {
    const list = getStoredAuthors();
    return pickRandomWriterAndQuote(list);
  });

  const [imageError, setImageError] = useState(false);

  // Escuta alterações feitas no CRUD do ADM em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToAuthorsUpdate(() => {
      const updatedList = getStoredAuthors();
      setAuthorsList(updatedList);
      // Se não havia autor ou se o atual foi removido/desativado, sorteia novamente
      setSelection((prev) => {
        if (!prev) return pickRandomWriterAndQuote(updatedList);
        const stillActive = updatedList.find((a) => a.id === prev.author.id && a.active !== false);
        return stillActive ? prev : pickRandomWriterAndQuote(updatedList);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Quando o autor mudar, reseta o erro de imagem
  useEffect(() => {
    setImageError(false);
  }, [selection?.author?.id, selection?.author?.photoUrl]);

  if (!selection || !selection.author) return null;

  const { author, quoteText, quoteSource } = selection;

  return (
    <div
      id="featured-author-poster"
      className="relative w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#2d2116]/80 bg-[#0d0906]"
      style={{
        backgroundColor: '#0d0906'
      }}
    >
      {/* 1. FOTO DO ESCRITOR */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1.15/1] overflow-hidden bg-[#18110b]">
        {!imageError && author.photoUrl ? (
          <img
            key={author.id}
            src={author.photoUrl}
            alt={author.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#d5ba82]/70 bg-gradient-to-b from-[#18110b] to-[#0d0906]">
            <span className="text-4xl mb-2">✍️</span>
            <span className="font-serif italic text-base font-bold text-[#e6cf9f]">
              {author.name}
            </span>
            {author.role && (
              <span className="text-[11px] text-[#a48858] mt-1 max-w-xs font-sans">
                {author.role}
              </span>
            )}
          </div>
        )}

        {/* Gradiente sutil inferior na transição da foto para o bloco da frase */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0906] to-transparent pointer-events-none" />
      </div>

      {/* 2. FRASE ALEATÓRIA DOS ESCRITORES (Tipografia dourada/sépia clássica) */}
      <div className="p-6 sm:p-7 text-center flex flex-col items-center justify-center space-y-3 relative z-10 bg-[#0d0906]">
        {/* Citação Inspiradora com aspas elegantes */}
        <blockquote className="text-[#ecd39f] font-serif text-lg sm:text-xl font-bold leading-relaxed tracking-normal max-w-sm">
          <span className="text-[#c79b4b] mr-1.5 text-2xl font-serif leading-none select-none">
            ❝
          </span>
          {quoteText}
          <span className="text-[#c79b4b] ml-1.5 text-2xl font-serif leading-none select-none">
            ❞
          </span>
        </blockquote>

        {/* Nome do Autor e Obra de Origem */}
        <div className="pt-1.5 space-y-0.5">
          <h3 className="text-[#d8be8d] font-serif text-sm sm:text-base font-semibold tracking-wide">
            {author.name},
          </h3>
          {quoteSource ? (
            <p className="text-[#a48858] font-serif italic text-xs sm:text-sm font-normal">
              em {quoteSource}
            </p>
          ) : (
            author.role && (
              <p className="text-[#a48858] font-serif italic text-xs font-normal">
                {author.role}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};
