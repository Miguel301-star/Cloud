import {state,save,updateRecord} from './store.js';
import {escapeHTML} from './dashboard.js';
const money=n=>`$${Number(n).toLocaleString('es-CO')}`;
export function renderFiados(){
 document.getElementById('fiados-cards-container').innerHTML=state.fiados.map(f=>{const debt=Math.max(0,f.totalDebt-f.paid);return `<article class="data-card"><div class="flex justify-between gap-2"><h3>${escapeHTML(f.neighbor)}</h3><b class="text-amber-400">${money(debt)}</b></div><p>${escapeHTML(f.phone)}</p><p>${debt?'Saldo pendiente':'AL DÍA'}</p><button class="btn-primary w-full" data-abono="${f.id}" ${debt?'':'disabled'}>Abonar pago</button></article>`}).join('');
}
export async function addFiado(data){const row={id:crypto.randomUUID(),...data,paid:0,history:[{date:new Date().toISOString().slice(0,10),detail:data.detail,amount:data.totalDebt}]};await save('fiados',row,true);}
export async function addAbono(id,amount){
 const f=state.fiados.find(x=>x.id===id);if(!f)throw new Error('Cliente no encontrado');
 if(!(amount>0)||amount>f.totalDebt-f.paid)throw new Error('El abono debe ser mayor que cero y no superar el saldo.');
 await updateRecord('fiados',id,{paid:f.paid+amount});
}
