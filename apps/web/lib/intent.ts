// Simple deterministic hints; may be replaced by an AOAI classifier.
export async function parseIntent(query: string) {
  const budget = (() => { 
    const m = query.match(/\$\s?(\d{2,6})/); 
    return m ? Number(m[1]) : undefined; 
  })();
  
  const brand = (() => { 
    const m = query.match(/\b(hisense|samsung|lg|sony|apple|hp|dell|lenovo|acer|breville|bosch)\b/i); 
    return m ? m[1] : undefined; 
  })();
  
  const size = (() => { 
    const m = query.match(/(\d{2})["\"]?\s?(?:inch|in|")/i); 
    return m ? Number(m[1]) : undefined; 
  })();
  
  return { budget, brand, size };
}
