"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "offer";
}

interface Conversation {
  id: string;
  seller: {
    name: string;
    avatar: string;
    online: boolean;
  };
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  lastMessage: string;
  timestamp: Date;
  unread: number;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    seller: {
      name: "TechHub Store",
      avatar: "T",
      online: true,
    },
    product: {
      id: "1",
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: 299,
      image: "/products/headphones.jpg",
    },
    lastMessage: "Sure, I can meet tomorrow at Dubai Mall",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
    messages: [
      {
        id: "m1",
        content: "Hi! Is this still available?",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        content: "Yes, it's still available! Are you interested?",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        status: "read",
        type: "text",
      },
      {
        id: "m3",
        content: "Yes! Can we meet for pickup? I'm located near Dubai Mall.",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "read",
        type: "text",
      },
      {
        id: "m4",
        content: "Sure, I can meet tomorrow at Dubai Mall",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "2",
    seller: {
      name: "SneakerWorld",
      avatar: "S",
      online: false,
    },
    product: {
      id: "3",
      name: "Nike Air Max 270 Sneakers",
      price: 120,
      image: "/products/sneakers.jpg",
    },
    lastMessage: "What size do you need?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
    messages: [
      {
        id: "m1",
        content: "Hello, is the size 10 available?",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        content: "What size do you need?",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "3",
    seller: {
      name: "Home Essentials",
      avatar: "H",
      online: true,
    },
    product: {
      id: "4",
      name: "Dyson V15 Detect Vacuum Cleaner",
      price: 649,
      image: "/products/vacuum.jpg",
    },
    lastMessage: "I can do $600 if you pick up today",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
    messages: [
      {
        id: "m1",
        content: "Would you accept $550?",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
        status: "read",
        type: "text",
      },
      {
        id: "m2",
        content: "I can do $600 if you pick up today",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "read",
        type: "text",
      },
    ],
  },
];

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    // In a real app, this would send to a backend
    setNewMessage("");
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMobileShowChat(true);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
      <div className="bg-card sm:rounded-xl border-x sm:border border-border overflow-hidden h-[calc(100dvh-8rem)] sm:h-[calc(100vh-200px)]">
        <div className="flex h-full w-full">
          {/* Conversations List */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r border-border flex flex-col h-full shrink-0",
              mobileShowChat && "hidden md:flex"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
              <h1 className="font-serif text-xl font-bold mb-3">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-secondary border-none h-9"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border/50">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={cn(
                      "w-full p-4 flex gap-3 hover:bg-secondary/50 transition-colors text-left",
                      selectedConversation?.id === conv.id && "bg-secondary"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                          {conv.seller.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conv.seller.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">
                          {conv.seller.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(conv.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conv.product.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate-1">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col h-full min-w-0",
              !mobileShowChat && "hidden md:flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3 sm:p-4 border-b border-border flex items-center gap-3 bg-card sticky top-0 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-2 h-9 w-9"
                    onClick={() => setMobileShowChat(false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {selectedConversation.seller.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.seller.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold truncate text-sm sm:text-base">
                      {selectedConversation.seller.name}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {selectedConversation.seller.online
                        ? "Online"
                        : "Last seen 2h ago"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                {/* Product Preview */}
                <div className="px-4 py-2 border-b border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground shrink-0 border border-border">
                      Item
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {selectedConversation.product.name}
                      </p>
                      <p className="text-primary font-bold text-xs sm:text-sm">
                        ${selectedConversation.product.price}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 h-8 text-xs px-3"
                    >
                      View
                    </Button>
                  </div>
                </div>

                {/* Messages - h-0 flex-1 is critical for internal scrolling */}
                <ScrollArea className="flex-1 h-0 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "me"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                            message.sender === "me"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-secondary rounded-bl-md border border-border/50"
                          )}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 mt-1 opacity-70",
                              message.sender === "me"
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="text-[10px]">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.sender === "me" && (
                              <span>
                                {message.status === "read" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                </ScrollArea>

                {/* Quick Actions - Scrollable */}
                <div className="px-3 py-2 border-t border-border bg-card w-full">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 text-[11px] h-8 rounded-full snap-start"
                    >
                      Is this still available?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 text-[11px] h-8 rounded-full snap-start"
                    >
                      What&apos;s your best price?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 text-[11px] h-8 rounded-full snap-start gap-1"
                    >
                      <MapPin className="h-3 w-3 text-primary" />
                      Suggest meetup
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 text-[11px] h-8 rounded-full snap-start gap-1"
                    >
                      <Clock className="h-3 w-3 text-primary" />
                      Schedule pickup
                    </Button>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-border bg-card">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hidden sm:flex">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="pr-10 bg-secondary/80 border-none h-10 rounded-full focus-visible:ring-1 focus-visible:ring-primary/20"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-full transition-all",
                        newMessage.trim()
                          ? "bg-primary text-primary-foreground scale-100 shadow-lg shadow-primary/20"
                          : "bg-secondary text-muted-foreground scale-95"
                      )}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="font-serif text-xl font-bold mb-2">
                    Your Messages
                  </h2>
                  <p className="text-muted-foreground">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
