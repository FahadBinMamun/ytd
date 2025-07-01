
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { VideoDisplay } from './components/VideoDisplay';
import { AnalysisOutput } from './components/AnalysisOutput';
import { Loader } from './components/Loader';
import { extractVideoId } from './utils/youtube';
import { analyzeVideoContent } from './services/geminiService';
import { AnalysisResult } from './types';
import { YouTubeIcon } from './components/Icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = () => {
    setError(null);
    setAnalysis(null);
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please check and try again.');
      setVideoId(null);
    }
  };

  const handleAnalysisRequest = useCallback(async () => {
    if (!videoId) {
      setError('Cannot perform analysis without a valid video ID.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeVideoContent(videoId);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get AI analysis. The API key might be missing or invalid.');
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
            <UrlInput
              url={url}
              setUrl={setUrl}
              onSubmit={handleUrlSubmit}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {videoId && !error && (
            <VideoDisplay videoId={videoId} onAnalyze={handleAnalysisRequest} />
          )}

          {isLoading && <Loader />}
          
          {analysis && !isLoading && <AnalysisOutput result={analysis} />}

          {!videoId && !isLoading && !error && (
             <div className="text-center mt-12 text-gray-500">
              <YouTubeIcon className="w-24 h-24 mx-auto opacity-20" />
              <p className="mt-4 text-lg">Enter a YouTube URL to begin</p>
             </div>
          )}

        </main>
        <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>Powered by React, Tailwind CSS, and the Google Gemini API.</p>
          <p className="mt-1">This application provides AI-generated summaries and does not download video content.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
