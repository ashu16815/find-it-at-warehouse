// Simple deterministic parser; can be swapped for AOAI classification if needed.
export async function parseIntent(query: string) {
  const budget = (()=>{ 
    const m = query.match(/\$\s?(\d{2,6})/); 
    return m? Number(m[1]) : undefined; 
  })();
  
  const brand = (()=>{ 
    const m = query.match(/\b(hisense|samsung|lg|sony|apple|hp|dell|lenovo|acer|asus|msi|razer|logitech|steelseries|corsair)\b/i); 
    return m? m[1] : undefined; 
  })();
  
  const size = (()=>{ 
    const m = query.match(/(\d{2})["\"]?\s?(?:inch|in|")/i); 
    return m? Number(m[1]) : undefined; 
  })();
  
  const category = (()=>{
    const q = query.toLowerCase();
    if (q.includes('tv') || q.includes('television')) return 'tv';
    if (q.includes('laptop') || q.includes('computer') || q.includes('notebook')) return 'laptop';
    if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) return 'phone';
    if (q.includes('headphone') || q.includes('headset') || q.includes('audio')) return 'audio';
    if (q.includes('keyboard') || q.includes('mouse') || q.includes('peripheral')) return 'peripheral';
    if (q.includes('desk') || q.includes('chair') || q.includes('office')) return 'office';
    if (q.includes('pen') || q.includes('stationery') || q.includes('supplies')) return 'stationery';
    return undefined;
  })();
  
  return { budget, brand, size, category };
}
