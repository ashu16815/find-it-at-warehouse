import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomDateInLast(days: number){ 
  const now=Date.now(); 
  const past=now-days*864e5; 
  return new Date(past + Math.random()*(now-past)); 
}

async function run(){
  await prisma.redirectEvent.deleteMany({});
  
  const domains = [
    { domain:'thewarehouse.co.nz', merchant:'The Warehouse', label:'TWG' },
    { domain:'warehousestationery.co.nz', merchant:'Warehouse Stationery', label:'TWG' },
    { domain:'noelleeming.co.nz', merchant:'Noel Leeming', label:'TWG' },
    { domain:'example-external1.com', merchant:'Retailer A', label:'External' },
    { domain:'example-external2.com', merchant:'Retailer B', label:'External' }
  ];
  
  const events=[] as any[];
  for(let i=0;i<600;i++){
    const d=domains[Math.floor(Math.random()*domains.length)];
    events.push({ 
      ts: randomDateInLast(30), 
      targetUrl:`https://${d.domain}/prod/${i}`, 
      domain:d.domain, 
      merchant:d.merchant, 
      label:d.label, 
      userAgent:'seed', 
      referrer:'seed' 
    });
  }
  
  await prisma.redirectEvent.createMany({ data: events });
  console.log('Seeded', events.length, 'redirects');
}

run().finally(()=>prisma.$disconnect());
