import {state,initStore,save,updateRecord} from './modules/store.js';
import {renderDashboard} from './modules/dashboard.js';
import {renderInventory,changeStock,saveProduct,deleteProduct,editProduct} from './modules/inventory.js';
import {renderFiados,addFiado,addAbono} from './modules/fiados.js';
import {renderSuppliers,addSupplier,paySupplier} from './modules/suppliers.js';
import {renderPOS,addToCart,checkout} from './modules/pos.js';
import {switchTab} from './modules/navigation.js';
import {initPWA} from './pwa.js';
import {syncPending,pullRemote,updatePendingCount} from './db/sync.js';

const $=id=>document.getElementById(id);
function refresh(){renderDashboard();renderInventory();renderFiados();renderSuppliers();updatePendingCount();if($('pos-modal').open)renderPOS();}
function open(id){$(id).showModal();}
function close(id){$(id).close();}
function log(message){const box=$('iaas-logs-box');box.textContent+=`\n[${new Date().toLocaleTimeString()}] ${message}`;box.scrollTop=box.scrollHeight;}
function updateNetwork(){const el=$('network-status');el.textContent=navigator.onLine?'Online — sincronización disponible':'Sin internet — guardado local';el.className=navigator.onLine?'text-xs text-emerald-400':'text-xs text-amber-400';}
function initCharts(){
 if(!window.Chart)return;
 new Chart($('weeklyChart'),{type:'line',data:{labels:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],datasets:[{label:'Fiados (miles COP)',data:[15,28,12,35,42,50,20],borderColor:'#f59e0b'}]},options:{responsive:true,maintainAspectRatio:false}});
 new Chart($('categoryChart'),{type:'doughnut',data:{labels:['Abarrotes','Bebidas','Lácteos','Snacks'],datasets:[{data:[40,25,20,15],backgroundColor:['#10b981','#0ea5e9','#f59e0b','#a855f7']}]},options:{responsive:true,maintainAspectRatio:false}});
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 try{
  if(b.dataset.tab)switchTab(b.dataset.tab);
  if(b.dataset.action==='open-pos'){renderPOS();open('pos-modal');}
  if(b.dataset.action==='open-terminal')open('terminal-modal');
  if(b.dataset.action==='open-product'){ $('product-form').reset();$('prod-id').value='';$('product-modal-title').textContent='Guardar producto';open('product-modal');}
  if(b.dataset.action==='open-fiado')open('fiado-modal');
  if(b.dataset.action==='open-abono'){ $('abono-neighbor-select').innerHTML=state.fiados.filter(f=>f.totalDebt>f.paid).map(f=>`<option value="${f.id}">${f.neighbor} — $${(f.totalDebt-f.paid).toLocaleString('es-CO')}</option>`).join('');open('abono-modal');}
  if(b.dataset.action==='open-supplier')open('supplier-modal');
  if(b.dataset.action==='sync'){await syncPending();await pullRemote();refresh();log('Sincronización solicitada.');}
  if(b.dataset.action==='checkout-cash')await checkout(false);
  if(b.dataset.action==='checkout-credit')await checkout(true);
  if(b.dataset.close)close(b.dataset.close);
  if(b.dataset.stock)await changeStock(b.dataset.id,Number(b.dataset.stock));
  if(b.dataset.restock)await changeStock(b.dataset.restock,10);
  if(b.dataset.edit)editProduct(b.dataset.edit);
  if(b.dataset.delete&&confirm('¿Eliminar este producto?'))await deleteProduct(b.dataset.delete);
  if(b.dataset.addCart)addToCart(b.dataset.addCart);
  if(b.dataset.abono){$('abono-neighbor-select').innerHTML=`<option value="${b.dataset.abono}">${state.fiados.find(x=>x.id===b.dataset.abono)?.neighbor||'Cliente'}</option>`;open('abono-modal');}
  if(b.dataset.paySupplier)await paySupplier(b.dataset.paySupplier);
  refresh();
 }catch(err){alert(err.message);}
});
$('inventory-search').addEventListener('input',renderInventory);
$('inventory-category-filter').addEventListener('change',renderInventory);
$('pos-search').addEventListener('input',renderPOS);
$('product-form').addEventListener('submit',async e=>{
 e.preventDefault();const id=$('prod-id').value||crypto.randomUUID();
 await saveProduct({id,name:$('prod-name').value.trim(),category:$('prod-category').value,price:Number($('prod-price').value),stock:Number($('prod-stock').value),minStock:Number($('prod-min').value)});
 close('product-modal');e.target.reset();refresh();
});
$('fiado-form').addEventListener('submit',async e=>{e.preventDefault();await addFiado({neighbor:$('fiado-neighbor').value.trim(),phone:$('fiado-phone').value.trim(),detail:$('fiado-detail').value.trim(),totalDebt:Number($('fiado-amount').value)});close('fiado-modal');e.target.reset();refresh();});
$('abono-form').addEventListener('submit',async e=>{e.preventDefault();try{await addAbono($('abono-neighbor-select').value,Number($('abono-amount').value));close('abono-modal');e.target.reset();refresh();}catch(err){alert(err.message);}});
$('supplier-form').addEventListener('submit',async e=>{e.preventDefault();await addSupplier({name:$('sup-name').value.trim(),detail:$('sup-detail').value.trim(),totalAmount:Number($('sup-amount').value),day:$('sup-day').value,paid:0});close('supplier-modal');e.target.reset();refresh();});
$('terminal-input').addEventListener('keydown',e=>{if(e.key!=='Enter')return;const cmd=e.target.value.trim().toLowerCase();e.target.value='';const out=$('terminal-output');if(cmd==='clear')out.textContent='';else if(cmd==='help')out.textContent+='\\nComandos: help | stock | fiados | sync | clear';else if(cmd==='stock')out.textContent+=`\\nProductos: ${state.inventory.length}`;else if(cmd==='fiados')out.textContent+=`\\nClientes con saldo: ${state.fiados.filter(f=>f.totalDebt>f.paid).length}`;else if(cmd==='sync'){syncPending().then(()=>pullRemote());out.textContent+='\\nSincronización solicitada.';}else out.textContent+='\\nComando desconocido. Escribe help.';out.scrollTop=out.scrollHeight;});
window.addEventListener('online',async()=>{updateNetwork();await syncPending();await pullRemote();refresh();});
window.addEventListener('offline',updateNetwork);
window.addEventListener('esquinita:sync',updatePendingCount);
await initStore();initPWA();initCharts();updateNetwork();refresh();
if(navigator.onLine){await pullRemote();refresh();}
if(window.lucide)lucide.createIcons();
