import { monetiseExternal } from './monetise';

export function decorate(card: any) {
  const base = card.url;
  const finalUrl = card.label === 'External' ? monetiseExternal(base) : base;
  const meta = encodeURIComponent(JSON.stringify({ 
    brand: card.merchant, 
    domain: card.domain, 
    label: card.label 
  }));
  
  return { 
    ...card, 
    redirect_url: `/api/redirect?u=${encodeURIComponent(finalUrl)}&meta=${meta}` 
  };
}
