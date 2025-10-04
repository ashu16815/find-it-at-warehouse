import Header from '../../components/Layout/Header';
import TWGStrip from '../../components/Product/TWGStrip';
import ExternalSection from '../../components/Product/ExternalSection';
import EmptyState from '../../components/UI/EmptyState';

async function fetchResults(q: string) {
  const url = new URL('/api/search', typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin);
  url.searchParams.set('q', q);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  return res.json();
}

export default async function Results({ searchParams }: any) {
  const q = searchParams?.q ?? '';
  
  if (!q) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="mx-auto max-w-[1200px] px-6 py-8">
          <EmptyState 
            title="No search query"
            message="Please enter a search term to see results"
          />
        </main>
      </div>
    );
  }
  
  const data = await fetchResults(q);
  const hasResults = (data.twg?.length > 0) || (data.external?.length > 0);
  
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-semibold text-ink mb-2">
            Search Results
          </h1>
          <p className="text-body text-ink-muted">
            Showing results for <strong className="text-ink">{q}</strong>
          </p>
        </div>
        
        {hasResults ? (
          <>
            {/* TWG Results */}
            <TWGStrip items={data.twg || []} />
            
            {/* External Results */}
            <ExternalSection items={data.external || []} />
          </>
        ) : (
          <EmptyState 
            title="No results found"
            message="We couldn't find any products matching your search"
            examples={[
              "55\" TV under $1,000",
              "School laptop under $600",
              "Office desk and chair"
            ]}
          />
        )}
      </main>
    </div>
  );
}