"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Bot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { VoyageService } from "@/services/service-voyages"
import { DestinationService } from "@/services/service-destinations"
import { Voyage } from "@/types/voyages"
import { Destination } from "@/types/Destinations"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! Je suis votre assistant voyage. Je peux vous aider à trouver des destinations et des voyages. Posez-moi vos questions !",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Remplacez par votre clé API réelle
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  useEffect(() => {
    const loadData = async () => {
      try {
        const [voyagesData, destinationsData] = await Promise.all([
          VoyageService.getVoyages(),
          DestinationService.getDestinations()
        ])
        setVoyages(voyagesData)
        setDestinations(destinationsData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    if (isOpen) loadData()
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateWithGemini = async (userMessage: string): Promise<string> => {
    try {
      // Préparer le contexte avec les données disponibles
      const context = `
      Vous êtes un assistant voyage expert pour une agence de voyages. 
      Voici les informations actuelles que vous pouvez utiliser pour répondre :

      Destinations disponibles (${destinations.length}):
      ${destinations.slice(0, 5).map(d => `${d.nom}, ${d.pays}`).join("\n")}
      ${destinations.length > 5 ? `\nEt ${destinations.length - 5} autres destinations...` : ''}

      Voyages disponibles (${voyages.length}):
      ${voyages.slice(0, 3).map(v => `${v.titre} - ${v.destination_nom} (${v.prix}€)`).join("\n")}
      ${voyages.length > 3 ? `\nEt ${voyages.length - 3} autres voyages...` : ''}

      Question du client: ${userMessage}

      Répondez de manière concise, utile et professionnelle en français.
      Si la question nécessite des données que vous n'avez pas, expliquez-le poliment.
      `

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }]
        }),
      })

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Désolé, je n'ai pas pu générer de réponse. Pouvez-vous reformuler votre question ?"
    } catch (error) {
      console.error("Erreur avec l'API Gemini:", error)
      return "Désolé, je rencontre un problème technique. Pouvez-vous réessayer plus tard ?"
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const botResponse = await generateWithGemini(inputValue)

      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error(error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre demande ?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-teal-600 hover:bg-teal-700 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-xl z-50 flex flex-col h-[500px]">
          <CardHeader className="bg-teal-600 text-white py-3 px-4 flex flex-row justify-between items-center">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <CardTitle className="text-base">Assistant Voyage</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-white hover:bg-teal-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-[370px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/bot-avatar.png" alt="Bot" />
                          <AvatarFallback className="bg-teal-600 text-white">B</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 whitespace-pre-wrap ${message.sender === "user"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800"
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/bot-avatar.png" alt="Bot" />
                        <AvatarFallback className="bg-teal-600 text-white">B</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                ref={inputRef}
                placeholder="Posez votre question sur les voyages..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="bg-teal-600 hover:bg-teal-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}