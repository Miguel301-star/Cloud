import {getAll,put,remove} from '../db/local-db.js';
import {queueMutation} from '../db/sync.js';
const seed={
 inventory:[
  {id:'10000000-0000-4000-8000-000000000001',name:'Arroz Roa 1kg',category:'Abarrotes',price:4200,stock:24,minStock:6},
  {id:'10000000-0000-4000-8000-000000000002',name:'Aceite Gourmet 900ml',category:'Abarrotes',price:14500,stock:8,minStock:3},
  {id:'10000000-0000-4000-8000-000000000003',name:'Coca-Cola 1.5L',category:'Bebidas',price:5500,stock:15,minStock:5},
  {id:'10000000-0000-4000-8000-000000000004',name:'Cerveza Águila Lata',category:'Bebidas',price:3000,stock:48,minStock:12},
  {id:'10000000-0000-4000-8000-000000000005',name:'Leche Colanta 1L',category:'Lácteos',price:4300,stock:4,minStock:6},
  {id:'10000000-0000-4000-8000-000000000006',name:'Papas Margarita Pollo',category:'Snacks',price:2500,stock:20,minStock:8}],
 fiados:[
  {id:'20000000-0000-4000-8000-000000000001',neighbor:'Don Pedro (Taller)',phone:'311 456 7890',totalDebt:34500,paid:10000,history:[{date:'2026-11-20',detail:'2 Cervezas, 1 Papas',amount:8500}]},
  {id:'20000000-0000-4000-8000-000000000002',neighbor:'Doña Martha (C.14)',phone:'300 987 6543',totalDebt:18200,paid:0,history:[{date:'2026-11-21',detail:'Leche Colanta, Pan',amount:18200}]}],
 suppliers:[
  {id:'30000000-0000-4000-8000-000000000001',name:'Bavaria',detail:'4 Cajas Cerveza Águila',totalAmount:180000,paid:80000,day:'Jueves'},
  {id:'30000000-0000-4000-8000-000000000002',name:'Coca-Cola',detail:'3 Cajas 1.5L',totalAmount:120000,paid:0,day:'Martes'}]
};
export const state={inventory:[],fiados:[],suppliers:[],cart:[]};
export async function initStore(){
 for(const resource of Object.keys(seed)){
  let rows=await getAll(resource);
  if(!rows.length){for(const row of seed[resource])await put(resource,row);rows=seed[resource];}
  state[resource]=rows;
 }
}
export async function save(resource,record,isNew=false){
 const exists=state[resource].some(x=>x.id===record.id);
 const operation=isNew||!exists?'create':'update';
 const idx=state[resource].findIndex(x=>x.id===record.id);
 if(idx>=0)state[resource][idx]=record;else state[resource].push(record);
 await put(resource,record);await queueMutation(resource,operation,record);
}
export async function deleteRecord(resource,id){
 state[resource]=state[resource].filter(x=>x.id!==id);await remove(resource,id);await queueMutation(resource,'delete',{id});
}
export async function updateRecord(resource,id,patch){
 const row=state[resource].find(x=>x.id===id);if(!row)return null;
 const updated={...row,...patch};await save(resource,updated);return updated;
}
