import { NextResponse } from 'next/server';
import { MOCK_JOBS } from '@/data/mock-jobs';
import { MOCK_USER_PROFILE } from '@/data/mock-profile';
import { calculateFallbackMatch } from '@/services/ai-matching';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = MOCK_JOBS.find((j) => j.id === id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const match = calculateFallbackMatch(MOCK_USER_PROFILE, job);
    return NextResponse.json({ job, match });
  } catch (error) {
    console.error('Job detail API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
