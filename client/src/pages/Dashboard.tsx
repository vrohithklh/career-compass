import { useRoadmaps, useDeleteRoadmap } from "@/hooks/use-roadmaps";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, ArrowRight, Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: roadmaps, isLoading } = useRoadmaps();
  const deleteRoadmap = useDeleteRoadmap();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48 bg-card" />
          <Skeleton className="h-10 w-32 bg-card" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl bg-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track and manage your learning paths.</p>
        </div>
        <Button asChild className="gradient-primary shadow-lg shadow-primary/20">
          <Link href="/generate">
            <Plus className="w-4 h-4 mr-2" />
            New Roadmap
          </Link>
        </Button>
      </div>

      {!roadmaps?.length ? (
        <div className="text-center py-24 rounded-2xl border-2 border-dashed border-border/50 bg-card/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No roadmaps yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Create your first AI-generated learning path to start mastering new skills.
          </p>
          <Button asChild size="lg" className="gradient-primary">
            <Link href="/generate">Generate Roadmap</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full bg-card border-border hover:border-primary/50 transition-colors flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-bold line-clamp-1">{roadmap.role}</CardTitle>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Roadmap?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the "{roadmap.role}" roadmap and all tracked progress.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteRoadmap.mutate(roadmap.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {roadmap.goal || "Personalized learning path"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    Created {format(new Date(roadmap.createdAt!), 'MMM d, yyyy')}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild className="w-full bg-primary/10 text-primary-foreground hover:bg-primary/20 border-0">
                    <Link href={`/roadmap/${roadmap.id}`}>
                      View Roadmap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
