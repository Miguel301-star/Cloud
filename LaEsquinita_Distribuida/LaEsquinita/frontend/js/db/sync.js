import {getAll,put,remove} from './local-db.js';
import {api} from './api.js';
const resources=['inventory','fiados','suppliers'];
export async function queueMutation(resource,operation,record){
  const mutation={id:crypto.randomUUID(),clientMutationId:crypto.randomUUID(),resource,operation,record,createdAt:new Date().toISOString()};
  await put('queue',mutation); updatePendingCount();
  if(navigator.onLine) await syncPending();
}
export async function syncPending(){
  if(!navigator.onLine)return;
  const queue=(await getAll('queue')).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  for(const m of queue){
    try{
      if(m.operation==='delete') await api.remove(m.resource,m.record.id);
      else if(m.operation==='create') await api.create(m.resource,{...m.record,clientMutationId:m.clientMutationId});
      else await api.update(m.resource,m.record.id,{...m.record,clientMutationId:m.clientMutationId});
      await remove('queue',m.id);
    }catch(err){console.warn('Sync pendiente:',err.message);break;}
  }
  updatePendingCount();
  window.dispatchEvent(new CustomEvent('esquinita:sync'));
}
export async function pullRemote(){
  if(!navigator.onLine)return;
  for(const resource of resources){
    try{const rows=await api.list(resource);for(const row of rows)await put(resource,row);}
    catch(err){console.warn(`No se pudo descargar ${resource}:`,err.message);}
  }
}
export async function updatePendingCount(){
  const count=(await getAll('queue')).length;
  const el=document.getElementById('pending-count');if(el)el.textContent=`Cambios pendientes: ${count}`;
}
