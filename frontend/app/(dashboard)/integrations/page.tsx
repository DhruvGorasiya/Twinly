"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Mail, FileText, Table, Video, MessageSquare, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

interface IntegrationCard {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "not_connected";
  href: string;
}

const integrations: IntegrationCard[] = [
  {
    name: "Gmail",
    description:
      "Connect your Gmail account to sync emails and manage communications",
    icon: <Mail className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/gmail/connect",
  },
  {
    name: "Google Docs",
    description: "Access and edit your documents directly from our platform",
    icon: <FileText className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/gdocs/connect",
  },
  {
    name: "Google Sheets",
    description: "Sync and manage spreadsheets seamlessly",
    icon: <Table className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/gsheets/connect",
  },
  {
    name: "Microsoft Teams",
    description: "Collaborate with your team and manage meetings",
    icon: <Video className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/teams/connect",
  },
  {
    name: "Slack",
    description: "Stay connected with your team through Slack integration",
    icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/slack/connect",
  },
  {
    name: "Notion",
    description:
      "Connect your Notion workspace for seamless knowledge management",
    icon: <Book className="h-6 w-6 text-purple-400" />,
    status: "not_connected",
    href: "/api/integrations/notion/connect",
  },
];

export default function IntegrationsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    async function checkIntegrationStatus() {
      if (!user?.id) return;
      
      try {
        // Check Gmail status
        const gmailResponse = await fetch(
          `${BACKEND_URL}/api/v1/integrations/gmail/status`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id })
          }
        );
        const gmailData = await gmailResponse.json();
        
        if (gmailData.status === "connected") {
          setConnectedIntegrations(prev => 
            prev.includes("Gmail") ? prev : [...prev, "Gmail"]
          );
        }

        // Check Notion status
        const notionResponse = await fetch(
          `${BACKEND_URL}/api/v1/integrations/notion/status`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id })
          }
        );
        const notionData = await notionResponse.json();
        
        if (notionData.status === "connected") {
          setConnectedIntegrations(prev => 
            prev.includes("Notion") ? prev : [...prev, "Notion"]
          );
        }
      } catch (error) {
        console.error("Error checking integration status:", error);
      }
    }

    checkIntegrationStatus();
  }, [BACKEND_URL, user?.id]);

  const handleToggle = async (integrationName: string) => {
    console.log("integrationName", integrationName);
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to connect integrations.",
        variant: "destructive",
      });
      return;
    }

    if (integrationName === "Gmail") {
      if (connectedIntegrations.includes("Gmail")) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/integrations/gmail/disconnect`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id })
          });
          setConnectedIntegrations(prev => prev.filter(name => name !== "Gmail"));
        } catch (error) {
          console.error("Error disconnecting Gmail:", error);
        }
      } else {
        const response = await fetch(`${BACKEND_URL}/api/v1/integrations/gmail/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.id })
        });
        const data = await response.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        }
      }
      return;
    }

    if (integrationName === "Notion") {
      console.log("notion", connectedIntegrations);
      if (connectedIntegrations.includes("Notion")) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/integrations/notion/disconnect`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id })
          });
          setConnectedIntegrations(prev => prev.filter(name => name !== "Notion"));
        } catch (error) {
          console.error("Error disconnecting Notion:", error);
        }
      } else {
        console.log("notion auth");
        const response = await fetch(`${BACKEND_URL}/api/v1/integrations/notion/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.id })
        });
        const data = await response.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        }
      }
      return;
    }

    setConnecting(integrationName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnectedIntegrations(prev => 
      prev.includes(integrationName)
        ? prev.filter(name => name !== integrationName)
        : [...prev, integrationName]
    );
    setConnecting(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="absolute left-64 right-0 bottom-0 top-0 bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900 overflow-hidden">
      <motion.div 
        className="w-full max-w-7xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-3xl font-bold text-white mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Integrations
        </motion.h1>
        
        <motion.div 
          className="grid grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {integrations.map((integration) => (
            <motion.div
              key={integration.name}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors duration-200 group border-0 relative overflow-hidden">
                {connecting === integration.name && (
                  <motion.div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-purple-400">Connecting...</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 relative">
                  {integration.icon}
                  {connectedIntegrations.includes(integration.name) && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-purple-500/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.1, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{integration.name}</h2>
                    <AnimatePresence mode="wait">
                      {connecting === integration.name ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-400 text-sm flex items-center gap-2"
                        >
                          <div className="h-3 w-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                          Connecting
                        </motion.div>
                      ) : connectedIntegrations.includes(integration.name) ? (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => handleToggle(integration.name)}
                          className="relative px-4 py-1.5 rounded-full text-sm font-medium text-white group/button disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          disabled={connecting !== null}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-rose-500 opacity-80 group-hover/button:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-red-500 opacity-0 group-hover/button:opacity-90 transition-opacity" />
                          <div className="relative flex items-center gap-2">
                            Disconnect
                          </div>
                        </motion.button>
                      ) : (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => handleToggle(integration.name)}
                          className="relative px-4 py-1.5 rounded-full text-sm font-medium text-white group/button disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          disabled={connecting !== null}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover/button:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover/button:opacity-80 transition-opacity" />
                          <div className="relative">Connect</div>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.p 
                    className="mt-1 text-zinc-400 line-clamp-2 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {integration.description}
                  </motion.p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
