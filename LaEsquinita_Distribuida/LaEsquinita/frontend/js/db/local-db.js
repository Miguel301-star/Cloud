const DB_NAME='la-esquinita-local'; const DB_VERSION=1;
let dbPromise;
function openDB(){ if(dbPromise) return dbPromise; dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;['inventory','fiados','suppliers','queue'].forEach(s=>{if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:'id'});});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
export async function getAll(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
export async function put(store,value){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error);});}
export async function remove(store,id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
export async function clear(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
