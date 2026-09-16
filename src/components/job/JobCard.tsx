"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { type JobOpportunity } from "@/data/mock-jobs";
import { type MatchResult } from "@/services/ai-matching";

interface JobCardProps {
  job: JobOpportunity;
  match: MatchResult;
}

export default function JobCard({ job, match }: JobCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]") as string[];
    setSaved(savedJobs.includes(job.id));
  }, [job.id]);

  const toggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]") as string[];
    const updated = saved
      ? savedJobs.filter((id) => id !== job.id)
      : [...savedJobs, job.id];
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <Card className="mb-4 shadow-lg hover:shadow-2xl transition-shadow">
      <CardHeader>
        <CardTitle>{job.title} – {job.company}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{job.location} | {job.type}</p>
        <p className="mt-2 text-sm">
          Score: <span className="font-bold text-teal-700">{match.totalScore}</span>/100
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          onClick={toggleSave}
          className={buttonVariants({ variant: "outline" })}
        >
          {saved ? "Unsimpan" : "Simpan"}
        </button>
        <Link href={`/jobs/${job.id}`} className={buttonVariants({})}>
          Lihat Detail
        </Link>
      </CardFooter>
    </Card>
  );
}
