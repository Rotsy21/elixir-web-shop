
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      text: "Bonjour! Comment puis-je vous aider aujourd'hui?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Ici, nous simulons l'envoi à un backend Python
    // Dans une application réelle, cela ferait un appel API à votre service de chatbot Python
    setTimeout(() => {
      const botMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        text: "Je suis un chatbot de démonstration. Pour un vrai chatbot Python, vous devrez configurer un backend avec une API.",
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton du chatbot */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Fenêtre du chatbot */}
      <div 
        className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Entête du chatbot */}
        <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Assistant Elixir</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4" id="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {message.text}
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barre de saisie */}
        <div className="p-4 border-t">
          <div className="flex">
            <Input
              type="text"
              placeholder="Écrivez votre message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-r-none"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="rounded-l-none"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-center text-gray-500 border-t">
          Propulsé par Elixir AI - Démo
        </div>
      </div>
    </>
  );
}
