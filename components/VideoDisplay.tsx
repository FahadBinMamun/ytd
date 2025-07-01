
import React, { useState } from 'react';
import { DownloadIcon } from './Icons';

interface VideoDisplayProps {
  videoId: string;
  onAnalyze: () => void;
}

const DownloadButton: React.FC<{ quality: string, onAnalyze: () => void }> = ({ quality, onAnalyze }) => (
    <button 
      onClick={onAnalyze}
      className="flex items-center justify-between w-full px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
    >
        <span className="font-medium text-gray-200">{quality}</span>
        <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm group-hover:text-white">Get AI Summary</span>
            <DownloadIcon className="w-5 h-5 text-red-500 group-hover:text-red-400"/>
        </div>
    </button>
);

export const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoId, onAnalyze }) => {
    const [showInfo, setShowInfo] = useState<boolean>(false);
    
    const handleAnalyzeClick = () => {
        setShowInfo(true);
        onAnalyze();
    };
    
    return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-fade-in">
        <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">Video Detected</h2>
            <p className="text-gray-400 mb-6">Downloading is not supported. Instead, get an instant AI-powered analysis of the video.</p>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex-shrink-0">
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                        className="w-full h-auto rounded-lg shadow-md aspect-video object-cover"
                    />
                </div>
                <div className="md:w-2/3 flex flex-col gap-3">
                    <p className="text-sm text-gray-400 mb-1">Click a "download" button to generate summary:</p>
                    <DownloadButton quality="1080p Full HD" onAnalyze={handleAnalyzeClick} />
                    <DownloadButton quality="720p HD" onAnalyze={handleAnalyzeClick} />
                    <DownloadButton quality="480p SD" onAnalyze={handleAnalyzeClick} />
                </div>
            </div>
            {showInfo && <p className="text-center mt-6 text-sm text-blue-400 animate-pulse">Requesting analysis from Gemini AI...</p>}
        </div>
    </div>
  );
};
