import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const questions = [
  {
    id: "interest",
    question: "What areas of AI interest you the most?",
    options: [
      { label: "Building models & algorithms", value: "ml-engineer" },
      { label: "Analyzing data & insights", value: "data-scientist" },
      { label: "AI ethics & product strategy", value: "product-manager" },
      { label: "Language & communication", value: "nlp-engineer" },
    ],
  },
  {
    id: "skill",
    question: "What is your current level of programming experience?",
    options: [
      { label: "None - I'm just starting", value: "beginner" },
      { label: "Some - I know basic Python/JS", value: "intermediate" },
      { label: "Expert - I'm a professional dev", value: "advanced" },
    ],
  },
  {
    id: "goal",
    question: "What is your primary goal?",
    options: [
      { label: "Get a high-paying job", value: "career" },
      { label: "Build my own AI startup", value: "entrepreneur" },
      { label: "Research and academic work", value: "researcher" },
    ],
  },
];

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Complete assessment and redirect to results with params
      const params = new URLSearchParams(newAnswers);
      setLocation(`/career-results?${params.toString()}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Career Assessment</h1>
        <p className="text-muted-foreground">Help us understand your interests to find your perfect AI path.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card border-border shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">Step {step + 1} of {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
                  ))}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{questions[step].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions[step].options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="w-full h-16 text-lg justify-between px-6 hover:border-primary/50 hover:bg-primary/5 group"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
          className="text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
