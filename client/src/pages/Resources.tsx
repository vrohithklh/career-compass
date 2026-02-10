import { useRoadmaps } from "@/hooks/use-roadmaps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, ExternalLink, Loader2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function Resources() {
  const { data: roadmaps, isLoading } = useRoadmaps();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">Resource Library</h1>
          <p className="text-muted-foreground mt-2">Curated learning materials from your generated roadmaps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!roadmaps?.length ? (
          <div className="col-span-full text-center py-20 bg-card/20 rounded-2xl border-2 border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No resources yet</h3>
            <p className="text-muted-foreground mb-8">Generate a roadmap to get curated learning materials.</p>
            <Button asChild className="gradient-primary">
              <Link href="/generate">Generate Roadmap</Link>
            </Button>
          </div>
        ) : (
          roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                <Bookmark className="w-5 h-5 text-primary" />
                {roadmap.role}
              </h2>
              {/* Note: In a real app we'd fetch resources for the roadmap here. 
                  For now we direct users to the roadmap detail where resources are listed. */}
              <Card className="bg-card border-border hover:border-primary/30 transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">View Curated Resources</CardTitle>
                  <CardDescription>Explore specific courses, articles, and videos for this career path.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/roadmap/${roadmap.id}`}>
                      Open Roadmap
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
