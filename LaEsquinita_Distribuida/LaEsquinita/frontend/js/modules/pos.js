import {state,updateRecord} from './store.js';
import {addFiado} from './fiados.js';
import {escapeHTML} from './dashboard.js';
const money=n=>`$${Number(n).toLocaleString('es-CO')}`;
export function renderPOS(){
 const q=(document.getElementById('pos-search').value||'').toLowerCase();
 document.getElementById('pos-product-grid').innerHTML=state.inventory.filter(p=>p.stock>0&&p.name.toLowerCase().includes(q)).map(p=>`<button class="product-tile" data-add-cart="${p.id}"><b>${escapeHTML(p.name)}</b><p class="text-emerald-400">${money(p.price)}</p><small>${p.stock} und.</small></button>`).join('');
 renderCart();
}
export function addToCart(id){const p=state.inventory.find(x=>x.id===id);if(!p||p.stock<=0)return;const c=state.cart.find(x=>x.id===id);if(c){if(c.qty<p.stock)c.qty++;}else state.cart.push({id:p.id,name:p.name,price:p.price,qty:1});renderCart();}
export function renderCart(){
 let total=0;document.getElementById('pos-cart-items').innerHTML=state.cart.map(x=>{total+=x.price*x.qty;return `<div class="flex justify-between py-2 text-xs"><span>${escapeHTML(x.name)} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`}).join('')||'<p class="muted py-5">Agrega productos para cobrar.</p>';
 document.getElementById('pos-cart-total').textContent=money(total);
}
export async function checkout(credit=false){
 if(!state.cart.length)return;
 for(const item of state.cart){const p=state.inventory.find(x=>x.id===item.id);if(!p||p.stock<item.qty)throw new Error(`Stock insuficiente: ${item.name}`);}
 const total=state.cart.reduce((a,x)=>a+x.price*x.qty,0);
 for(const item of state.cart){const p=state.inventory.find(x=>x.id===item.id);await updateRecord('inventory',p.id,{stock:p.stock-item.qty});}
 if(credit){
  const name=prompt('Nombre del cliente para registrar el fiado:');if(name)await addFiado({neighbor:name,phone:'Sin teléfono',detail:state.cart.map(x=>`${x.qty} ${x.name}`).join(', '),totalDebt:total});
 }
 state.cart=[];renderCart();document.getElementById('pos-modal').close();
}
