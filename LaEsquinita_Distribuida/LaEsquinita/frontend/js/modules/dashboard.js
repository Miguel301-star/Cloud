import {state} from './store.js';
const money=n=>`$${Number(n||0).toLocaleString('es-CO')}`;
export function renderDashboard(){
 const inv=state.inventory;const low=inv.filter(x=>x.stock<=x.minStock);
 const receivables=state.fiados.reduce((a,x)=>a+Math.max(0,x.totalDebt-x.paid),0);
 const debtors=state.fiados.filter(x=>x.totalDebt>x.paid).length;
 const payables=state.suppliers.reduce((a,x)=>a+Math.max(0,x.totalAmount-x.paid),0);
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
 set('dash-inv-value',money(inv.reduce((a,x)=>a+x.price*x.stock,0)));set('dash-inv-count',`${inv.length} productos`);
 set('dash-receivables',money(receivables));set('dash-debtors-count',`${debtors} clientes deben`);
 set('dash-payables',money(payables));set('dash-low-stock',low.length);
 const list=document.getElementById('low-stock-list');
 list.innerHTML=low.length?low.map(x=>`<div class="flex justify-between py-3 text-sm"><span>${escapeHTML(x.name)} <b class="text-rose-400">(${x.stock})</b></span><button class="btn-secondary" data-restock="${x.id}">+10 surtir</button></div>`).join(''):'<p class="py-3 text-sm text-slate-500">Todo bien surtido.</p>';
}
export function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
