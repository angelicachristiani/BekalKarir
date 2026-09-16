import { MOCK_JOBS } from '@/data/mock-jobs';
import { calculateFallbackMatch } from '@/services/ai-matching';
import { NextResponse } from 'next/server';

// GET - returns all jobs matched against MOCK_USER_PROFILE (server-side fallback)
export async function GET() {
  try {
    const { MOCK_USER_PROFILE } = await import('@/data/mock-profile');
    const matchedJobs = MOCK_JOBS.map((job) => {
      const match = calculateFallbackMatch(MOCK_USER_PROFILE, job);
      return { job, match };
    });
    matchedJobs.sort((a, b) => b.match.totalScore - a.match.totalScore);
    return NextResponse.json(matchedJobs);
  } catch (error) {
    console.error('Error fetching matched jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch matched jobs' }, { status: 500 });
  }
}

// POST - accepts userProfile from client and runs matching
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userProfile = body?.userProfile;

    if (!userProfile) {
      return NextResponse.json({ error: 'Missing userProfile' }, { status: 400 });
    }

    const matchedJobs = MOCK_JOBS.map((job) => {
      const match = calculateFallbackMatch(userProfile, job);
      return { job, match };
    });
    matchedJobs.sort((a, b) => b.match.totalScore - a.match.totalScore);
    return NextResponse.json(matchedJobs);
  } catch (error) {
    console.error('Error matching jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
