import {state,save,updateRecord} from './store.js';
import {escapeHTML} from './dashboard.js';
const money=n=>`$${Number(n).toLocaleString('es-CO')}`;
export function renderSuppliers(){
 document.getElementById('suppliers-cards-container').innerHTML=state.suppliers.map(s=>{const debt=Math.max(0,s.totalAmount-s.paid);return `<article class="data-card"><div class="flex justify-between"><h3>${escapeHTML(s.name)}</h3><b class="text-rose-400">${money(debt)}</b></div><p>${escapeHTML(s.detail)}</p><p>Pago: ${escapeHTML(s.day||'Sin definir')}</p><button class="btn-primary w-full" data-pay-supplier="${s.id}" ${debt?'':'disabled'}>${debt?'Marcar factura pagada':'Pagada'}</button></article>`}).join('');
}
export async function addSupplier(data){await save('suppliers',{id:crypto.randomUUID(),...data,paid:0},true);}
export async function paySupplier(id){const s=state.suppliers.find(x=>x.id===id);if(s)await updateRecord('suppliers',id,{paid:s.totalAmount});}
