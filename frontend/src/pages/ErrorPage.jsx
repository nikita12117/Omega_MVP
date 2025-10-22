import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error }) {
  const navigate = useNavigate();
  const routeError = useRouteError();
  const displayError = error || routeError;

  return (
    <div className="min-h-screen bg-[#0a0f1d] relative flex items-center justify-center">
      <div className="noise" />
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4">
            <AlertTriangle className="h-16 w-16 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Něco se pokazilo
          </h1>
          {displayError && (
            <div className="bg-[#0f172a] border border-red-600/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-mono">
                {displayError.message || displayError.statusText || 'Neznámá chyba'}
              </p>
            </div>
          )}
          <p className="text-slate-400 mb-8">
            Omlouváme se za potíže. Vraťte se na hlavní stránku a zkuste to znovu.
          </p>
        </div>

        <Button
          onClick={() => navigate('/education')}
          className="bg-[#06d6a0] text-[#0a0f1d] hover:bg-[#06d6a0]/90 font-semibold px-8 py-6 text-lg"
          data-testid="home-button"
        >
          <Home className="h-5 w-5 mr-2" />
          Home
        </Button>

        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-slate-400 hover:text-[#06d6a0] transition-colors"
          >
            Nebo zkuste obnovit stránku
          </button>
        </div>
      </div>
    </div>
  );
}