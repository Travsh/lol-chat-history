import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Copy, Moon, FileText, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const LOLChatViewer = () => {
  const [chatHistory, setChatHistory] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleFile = useCallback((file) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const inputs = text.split("\n");
        let words = "";
        const startKeyWord = "Chat received valid message: ";
        const nameKeyword = "with speaker DisplayName ";
        
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i].includes(startKeyWord)) {
            const chatStartIndex = inputs[i].indexOf(startKeyWord) + startKeyWord.length;
            const chatEndIndex = inputs[i].indexOf(nameKeyword);
            
            const nameStartIndex = inputs[i].lastIndexOf("[");
            const nameEndIndex = inputs[i].length - "</font>".length - 1;
            words += inputs[i].substring(nameStartIndex, nameEndIndex).concat(inputs[i].substring(chatStartIndex, chatEndIndex)).concat("\n");
          }
        }
        setChatHistory(words);
        setError('');
      };
      reader.readAsText(file);
    } else {
      setError("Please upload a .txt file.");
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chatHistory).then(() => {
      setIsCopied(true);
    });
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-400">League of Legend Chat Viewer</h1>
          <p className="text-lg text-gray-400">Dive into your game conversations</p>
        </header>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <p className="mb-4 text-gray-300 flex items-center justify-center">
            <FileText className="mr-2" />
            File location: \Riot Games\League of Legends\Logs\GameLogs\
          </p>
          
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition duration-300 hover:border-blue-400"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file_input').click()}
          >
            <Upload className="mx-auto mb-4 text-blue-400" size={48} />
            <p className="text-lg">Drop r3dlog.txt here or click to upload</p>
            <input 
              type="file" 
              id="file_input" 
              className="hidden" 
              onChange={(e) => handleFile(e.target.files[0])}
              accept=".txt"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900 border-red-700">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-400 flex items-center">
              <Moon /> <span className="ml-2">Chat History</span>
            </h2>
            <button 
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-all duration-200"
            >
              {isCopied ? <Check /> : <Copy />}
              <span className="ml-2">{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <textarea 
            className="w-full h-96 p-4 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={chatHistory}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default LOLChatViewer;