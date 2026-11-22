import {state,save,deleteRecord,updateRecord} from './store.js';
import {escapeHTML} from './dashboard.js';
const money=n=>`$${Number(n).toLocaleString('es-CO')}`;
export function renderInventory(){
 const q=(document.getElementById('inventory-search')?.value||'').toLowerCase(),cat=document.getElementById('inventory-category-filter')?.value||'ALL';
 const rows=state.inventory.filter(x=>x.name.toLowerCase().includes(q)&&(cat==='ALL'||x.category===cat));
 document.getElementById('inventory-table-body').innerHTML=rows.map(x=>`<tr><td>${escapeHTML(x.name)}</td><td>${escapeHTML(x.category)}</td><td class="text-right">${money(x.price)}</td><td>${x.stock}</td><td class="text-right">${money(x.price*x.stock)}</td><td><button class="btn-secondary" data-stock="-1" data-id="${x.id}">−</button> <button class="btn-secondary" data-stock="1" data-id="${x.id}">+</button> <button class="btn-secondary" data-edit="${x.id}">Editar</button> <button class="btn-warning" data-delete="${x.id}">Borrar</button></td></tr>`).join('');
}
export async function changeStock(id,qty){const p=state.inventory.find(x=>x.id===id);if(p)await updateRecord('inventory',id,{stock:Math.max(0,p.stock+qty)});}
export async function saveProduct(data){await save('inventory',data, !state.inventory.some(x=>x.id===data.id));}
export async function deleteProduct(id){await deleteRecord('inventory',id);}
export function editProduct(id){
 const p=state.inventory.find(x=>x.id===id);if(!p)return;
 for(const [field,value] of Object.entries({id:p.id,name:p.name,category:p.category,price:p.price,stock:p.stock,min:p.minStock}))document.getElementById(`prod-${field}`).value=value;
 document.getElementById('product-modal-title').textContent='Editar producto';document.getElementById('product-modal').showModal();
}
