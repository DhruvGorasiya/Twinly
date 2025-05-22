'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Lock,
  Mail,
  Clock,
  ListTodo,
  Users,
  Zap,
  Shield,
  Database,
  Wrench
} from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { GradientButton } from "@/components/gradient-button";
import { ScrollButton } from "@/components/scroll-button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative bg-black h-screen flex items-center"
      >
        {/* Enhanced background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />

        {/* Animated floating shapes with better positioning and effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Subtle grid overlay for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="w-full px-6 relative z-10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="space-y-10 max-w-5xl mx-auto">
              {/* Enhanced badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-4 hover:bg-white/15 transition-colors duration-200 animate-fade-in">
                <Sparkles className="h-5 w-5 mr-2 text-amber-300 animate-pulse" />
                <span>Meet your AI twin assistant</span>
              </div>

              {/* Enhanced heading with gradient and animation */}
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 leading-tight tracking-tight animate-fade-in-up">
                Your Personal AI Twin
              </h1>

              {/* Enhanced description with better contrast */}
              <p className="text-2xl md:text-3xl text-white/90 max-w-3xl leading-relaxed animate-fade-in-up delay-200">
                Twinly learns your preferences, manages your tasks, and handles
                your communications—just like you would.
              </p>

              {/* Button group */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity duration-200"
                  onClick={() => router.push("/dashboard")}
                >
                  Try Twinly Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ScrollButton targetId="features" variant="dark" />
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="h-screen flex items-center relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
      >
        {/* Interactive background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />

        {/* Colorful orbs */}
        <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -right-20 top-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-2000" />
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-pink-400 rounded-full animate-float animation-delay-4000" />
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-blue-200 rounded-xl rotate-12 animate-spin-slow" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-purple-200 rotate-45 animate-spin-slow animation-delay-2000" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 backdrop-blur-sm text-sm font-medium text-blue-700 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500 animate-pulse" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 [background-size:200%_auto] animate-gradient py-2">
              Meet Your Digital Twin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Twinly learns how you work, communicate, and organize your life to
              become your perfect digital companion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
              title="Natural Conversations"
              description="Chat naturally with Twinly as it learns your communication style and preferences over time."
              gradient="from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
            />

            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-green-600" />}
              title="Task Management"
              description="Delegate tasks to Twinly and let it handle follow-ups, reminders, and organization."
              gradient="from-green-500/10 to-emerald-500/10"
            />

            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-indigo-600" />}
              title="Calendar Optimization"
              description="Twinly manages your schedule, suggests optimal meeting times, and prevents double-bookings."
              gradient="from-indigo-500/10 to-blue-500/10"
            />

            <FeatureCard
              icon={<Brain className="h-8 w-8 text-amber-500" />}
              title="Adaptive Memory"
              description="The more you interact with Twinly, the better it understands your preferences and habits."
              gradient="from-amber-500/20 to-orange-500/20"
            />

            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-pink-500" />}
              title="Proactive Suggestions"
              description="Receive intelligent suggestions based on your behavior patterns and upcoming events."
              gradient="from-pink-500/20 to-rose-500/20"
            />

            <FeatureCard
              icon={<ArrowRight className="h-8 w-8 text-indigo-500" />}
              title="Seamless Integrations"
              description="Connect Twinly with your favorite tools and services for a unified experience."
              gradient="from-indigo-500/20 to-purple-500/20"
            />
          </div>
        </div>
      </section>
      {/* Product Showcase Section */}
      <section
        id="product"
        className="h-screen flex items-center relative bg-black"
      >
        {/* Enhanced background gradient - same as hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />

        {/* Animated floating shapes - same as hero section */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Subtle grid overlay - same as hero section */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              {/* Interactive Feature Cards replacing the static image */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "💬",
                    title: "Smart Chat",
                    desc: "Natural conversations with context awareness",
                  },
                  {
                    icon: "🎯",
                    title: "Precision",
                    desc: "Accurate responses tailored to your needs",
                  },
                  {
                    icon: "⚡",
                    title: "Speed",
                    desc: "Lightning-fast responses when you need them",
                  },
                  {
                    icon: "🔄",
                    title: "Adaptable",
                    desc: "Learns and evolves with your preferences",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Designed for Humans, Powered by AI
              </h2>
              <p className="text-xl text-white/80">
                Twinly&apos;s interface is intuitive and beautiful, making AI
                assistance a delightful experience rather than a technical
                challenge.
              </p>

              <ul className="space-y-4">
                {[
                  "Clean, distraction-free interface",
                  "Personalized dashboard that adapts to your usage",
                  "Seamless transitions between different tasks",
                  "Beautiful visualizations of your productivity data",
                  "Accessible on all your devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-3 text-lg text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <GradientButton
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Link href="/dashboard" className="flex items-center">
                    Explore the Interface
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* What Others Don't, We Do Section */}
      <section
        id="what-others-dont"
        className="h-screen flex items-center relative bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden"
      >
        {/* Dynamic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/dots.svg')] bg-repeat opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-blue-100/20" />
        </div>
        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10 flex items-center justify-center">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/30 backdrop-blur-sm text-sm font-medium text-purple-700 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-5 w-5 mr-2 text-purple-500 animate-pulse" />
              <span>What Others Don&apos;t, We Do</span>
            </motion.div>
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 [background-size:200%_auto] animate-gradient py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Productivity, Reimagined
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Most tools focus on automation. Twinly goes further—building context, continuity, and a memory graph that truly understands you.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                {
                  icon: <Sparkles className="h-7 w-7 text-purple-500 animate-bounce" />,
                  title: "Context & Continuity",
                  color: "purple-700",
                  border: "border-purple-100",
                  text: "We don't just automate tasks. Twinly learns your mental model, so every action fits your unique way of working.",
                  delay: 0.5,
                },
                {
                  icon: <Brain className="h-7 w-7 text-blue-500 animate-pulse" />,
                  title: "Long-Term Memory",
                  color: "blue-700",
                  border: "border-blue-100",
                  text: "Twinly builds a memory graph of your digital life, enabling decisions that match your habits and preferences.",
                  delay: 0.6,
                },
                {
                  icon: <Zap className="h-7 w-7 text-pink-500 animate-bounce" />,
                  title: "Fewer Prompts, More Results",
                  color: "pink-700",
                  border: "border-pink-100",
                  text: "No more juggling 10 prompts for one task. Twinly understands intent and handles complexity for you.",
                  delay: 0.7,
                },
                {
                  icon: <Shield className="h-7 w-7 text-amber-500 animate-pulse" />,
                  title: "A True Second Brain",
                  color: "amber-700",
                  border: "border-amber-100",
                  text: "Twinly isn't just an assistant—it's a proactive, evolving digital twin that thinks and acts like you.",
                  delay: 0.8,
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  className={`p-6 rounded-xl bg-white/70 border ${item.border} shadow-md hover:shadow-xl transition group`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.6, type: "spring" }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px 0 rgba(80, 80, 200, 0.15)",
                    borderColor: "#a78bfa",
                  }}
                >
                  <div className="mb-3">{item.icon}</div>
                  <h3 className={`text-xl font-semibold text-${item.color} mb-2`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* What is Twinly Section */}
      <section
        id="what-is-twinly"
        className="h-screen flex items-center relative bg-black"
      >
        {/* Enhanced background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />

        {/* Animated floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              <span>What is Twinly?</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Your AI Cognitive Twin
            </h2>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Twinly is an AI-powered cognitive twin that learns from your
              digital footprint, connects to your favorite tools, and helps you
              work smarter by remembering everything important and taking
              actions on your behalf.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Wrench className="h-6 w-6" />,
                  title: "Connects to Your Tools",
                  desc: "Seamlessly integrates with Gmail, Slack, Notion, and more",
                },
                {
                  icon: <Database className="h-6 w-6" />,
                  title: "Remembers Everything",
                  desc: "Creates a searchable memory of your digital interactions",
                },
                {
                  icon: <ListTodo className="h-6 w-6" />,
                  title: "Prioritizes Tasks",
                  desc: "Helps organize and summarize your daily activities",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Takes Action",
                  desc: "Handles emails, notes, and tasks autonomously",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-purple-400 mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-12 bg-white text-violet-600 hover:bg-white/90 transition-all duration-200"
              onClick={() => router.push('/dashboard')}
            >
              See Twinly in Action
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      {/* How It Works Section - Light Theme */}
      <section
        id="how-it-works"
        className="h-screen flex items-center relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
      >
        {/* Interactive background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />

        {/* Colorful orbs */}
        <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -right-20 top-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 backdrop-blur-sm text-sm font-medium text-blue-700 mb-6">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <span>How It Works</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              Three Simple Steps to Get Started
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Connect Your Tools",
                  desc: "Securely connect your Gmail, Slack, Notion, and other apps",
                  icon: <Wrench className="h-12 w-12" />,
                },
                {
                  step: "02",
                  title: "Chat with Twinly",
                  desc: "Interact naturally through our intuitive chat interface",
                  icon: <MessageSquare className="h-12 w-12" />,
                },
                {
                  step: "03",
                  title: "Let It Act",
                  desc: "Watch as Twinly handles tasks and communications for you",
                  icon: <Zap className="h-12 w-12" />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-purple-600 mb-6">{item.icon}</div>
                  <div className="text-purple-600 text-sm font-medium mb-4">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section
        id="use-cases"
        className="h-screen flex items-center relative bg-black"
      >
        {/* Enhanced background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />

        {/* Animated floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              <span>Use Cases</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
              What Can Twinly Do For You?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Mail />,
                  title: "Email Management",
                  desc: "Summarize unread emails and draft contextual responses",
                },
                {
                  icon: <MessageSquare />,
                  title: "Meeting Memory",
                  desc: "Recall and summarize past meeting discussions",
                },
                {
                  icon: <Calendar />,
                  title: "Smart Planning",
                  desc: "Plan your week based on pending tasks and priorities",
                },
                {
                  icon: <ListTodo />,
                  title: "Task Automation",
                  desc: "Convert Slack threads into Notion checklists",
                },
                {
                  icon: <Clock />,
                  title: "Schedule Management",
                  desc: "Find optimal meeting slots and send invites",
                },
                {
                  icon: <Brain />,
                  title: "Knowledge Base",
                  desc: "Build your personal searchable knowledge base",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-purple-400 mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Privacy & Trust Section - Light Theme */}
      <section
        id="privacy"
        className="h-screen flex items-center relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
      >
        {/* Interactive background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />

        {/* Colorful orbs */}
        <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -right-20 top-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-2000" />
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-pink-400 rounded-full animate-float animation-delay-4000" />
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-blue-200 rounded-xl rotate-12 animate-spin-slow" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-purple-200 rotate-45 animate-spin-slow animation-delay-2000" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 backdrop-blur-sm text-sm font-medium text-blue-700 mb-6">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              <span>Privacy & Trust</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              Your Data, Your Control
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Lock />,
                  title: "End-to-End Encryption",
                  desc: "Your data is encrypted at rest and in transit",
                },
                {
                  icon: <Shield />,
                  title: "No Training Data",
                  desc: "Your data is never used to train our models",
                },
                {
                  icon: <Database />,
                  title: "Local-First Coming Soon",
                  desc: "Option to run Twinly entirely on your device",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-purple-600 mb-6">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Vision Section - Dark Theme */}
      <section id="vision" className="relative bg-black py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10" />

        <div className="w-full px-4 max-w-screen-2xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <blockquote className="text-3xl md:text-4xl font-bold text-white leading-relaxed">
              &quot;We&apos;re building more than an assistant — we&apos;re
              building your digital memory.&quot;
            </blockquote>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        id="cta"
        className="h-screen flex items-center relative bg-black"
      >
        {/* Enhanced background gradient - same as hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 pointer-events-none" />

        {/* Animated floating shapes - same as hero section */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Subtle grid overlay - same as hero section */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="w-full px-4 relative z-10 max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
              Ready to Meet Your Digital Twin?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Join thousands of users who are revolutionizing their productivity
              with Twinly.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-violet-600 transition-all duration-200 ease-out hover:bg-white/90 hover:scale-105 active:scale-98"
              >
                <Link href="/dashboard" className="flex items-center">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 backdrop-blur-sm text-white transition-all duration-200 ease-out hover:bg-white/10 hover:scale-105 active:scale-98"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer id="footer" className="bg-slate-900 text-white py-12">
        <div className="w-full px-4 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="ml-2 text-xl font-semibold">Twinly</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <Link href="#" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                Pricing
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                Blog
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>

            <div className="mt-6 md:mt-0">
              <p className="text-gray-400">
                © 2025 Twinly. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
