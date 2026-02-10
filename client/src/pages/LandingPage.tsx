import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6">
              Master Your Path in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
                Artificial Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop guessing what to learn. Get a personalized, AI-generated roadmap tailored to your goals and current skill level.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-14 px-8 text-lg rounded-full gradient-primary shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300" asChild>
              <a href="/api/login">Start Your Journey</a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-transparent border-white/10 hover:bg-white/5" asChild>
              <a href="#features">Explore Careers</a>
            </Button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BrainCircuit,
              title: "AI-Generated Roadmaps",
              description: "Our AI analyzes market demands to create the perfect curriculum for you."
            },
            {
              icon: Target,
              title: "Targeted Skill Tracking",
              description: "Track your progress skill-by-skill and visualize your journey to mastery."
            },
            {
              icon: Zap,
              title: "Curated Resources",
              description: "Get the best tutorials, courses, and articles for every single topic."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
              className="p-8 rounded-2xl glass-card hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
