import {API_BASE} from '../config.js';
export async function request(path,options={}) {
  const response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||`Error API ${response.status}`);}
  if(response.status===204)return null;
  return response.json();
}
export const api={
  list: resource=>request(`/${resource}`),
  create: (resource,data)=>request(`/${resource}`,{method:'POST',body:JSON.stringify(data)}),
  update: (resource,id,data)=>request(`/${resource}/${encodeURIComponent(id)}`,{method:'PUT',body:JSON.stringify(data)}),
  remove: (resource,id)=>request(`/${resource}/${encodeURIComponent(id)}`,{method:'DELETE'})
};
