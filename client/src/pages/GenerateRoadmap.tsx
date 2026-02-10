import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGenerateRoadmap } from "@/hooks/use-roadmaps";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  role: z.string().min(2, "Role is required"),
  goal: z.string().min(10, "Please describe your goal in more detail"),
  currentLevel: z.string({ required_error: "Please select your current level" }),
});

export default function GenerateRoadmap() {
  const [, setLocation] = useLocation();
  const generate = useGenerateRoadmap();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      goal: "",
      currentLevel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await generate.mutateAsync(values);
      setLocation("/dashboard");
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Generate Your Roadmap</h1>
          <p className="text-lg text-muted-foreground">
            Tell our AI about your career goals, and we'll build a custom curriculum just for you.
          </p>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Be specific to get the best results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Machine Learning Engineer, AI Product Manager" {...field} className="h-12 text-lg bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50">
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (New to tech)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Some coding experience)</SelectItem>
                          <SelectItem value="advanced">Advanced (Experienced developer)</SelectItem>
                          <SelectItem value="expert">Expert (Looking to specialize)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Goal</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. I want to build LLM applications and understand transformer architecture deeply." 
                          className="min-h-[120px] resize-none text-base bg-background/50"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This helps tailor the resource recommendations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg gradient-primary shadow-lg shadow-primary/25"
                  disabled={generate.isPending}
                >
                  {generate.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Roadmap
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
