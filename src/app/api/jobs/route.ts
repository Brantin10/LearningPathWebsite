import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'MyFutureCareer/1.0' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: res.status });
    }

    const data = await res.json();
    const jobs = data
      .filter((item: any) => item.id && item.position)
      .map((item: any) => ({
        id: String(item.id),
        slug: item.slug || '',
        position: item.position || '',
        company: item.company || '',
        company_logo: item.company_logo || '',
        location: item.location || 'Remote',
        date: item.date || '',
        epoch: item.epoch || 0,
        salary_min: item.salary_min || 0,
        salary_max: item.salary_max || 0,
        tags: item.tags || [],
        description: item.description || '',
        url: item.url || `https://remoteok.com/remote-jobs/${item.slug || item.id}`,
      }));

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
