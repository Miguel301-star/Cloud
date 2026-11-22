import {Router} from 'express';
import {pool} from '../db.js';
const router=Router();
const config={
 inventory:{table:'inventory',columns:['name','category','price','stock','min_stock'],map:r=>({...r,minStock:r.min_stock})},
 fiados:{table:'fiados',columns:['neighbor','phone','total_debt','paid','detail'],map:r=>({...r,totalDebt:r.total_debt})},
 suppliers:{table:'suppliers',columns:['name','detail','total_amount','paid','day'],map:r=>({...r,totalAmount:r.total_amount})}
};
const allowed=new Set(Object.keys(config));
function normalize(resource,b){if(resource==='inventory')return [b.name,b.category,b.price,b.stock,b.minStock];if(resource==='fiados')return [b.neighbor,b.phone,b.totalDebt,b.paid,b.detail||''];return [b.name,b.detail,b.totalAmount,b.paid,b.day||''];}
router.get('/:resource',async(req,res,next)=>{try{const c=config[req.params.resource];if(!c)return res.status(404).json({error:'Recurso no válido'});const {rows}=await pool.query(`SELECT * FROM ${c.table} ORDER BY created_at DESC`);res.json(rows.map(c.map));}catch(e){next(e);}});
router.post('/:resource',async(req,res,next)=>{try{const resource=req.params.resource,c=config[resource];if(!c)return res.status(404).json({error:'Recurso no válido'});const b=req.body;const id=b.id||crypto.randomUUID();const vals=normalize(resource,b);const cols=['id',...c.columns];const placeholders=vals.map((_,i)=>`$${i+2}`).join(',');const names=cols.join(',');const {rows}=await pool.query(`INSERT INTO ${c.table} (${names}) VALUES ($1,${placeholders}) ON CONFLICT(id) DO NOTHING RETURNING *`,[id,...vals]);res.status(201).json(c.map(rows[0]||{id,...b}));}catch(e){next(e);}});
router.put('/:resource/:id',async(req,res,next)=>{try{const resource=req.params.resource,c=config[resource];if(!c)return res.status(404).json({error:'Recurso no válido'});const vals=normalize(resource,req.body);const sets=c.columns.map((col,i)=>`${col}=$${i+2}`).join(',');const {rows}=await pool.query(`UPDATE ${c.table} SET ${sets},updated_at=NOW() WHERE id=$1 RETURNING *`,[req.params.id,...vals]);if(!rows[0])return res.status(404).json({error:'Registro no encontrado'});res.json(c.map(rows[0]));}catch(e){next(e);}});
router.delete('/:resource/:id',async(req,res,next)=>{try{const c=config[req.params.resource];if(!c)return res.status(404).json({error:'Recurso no válido'});await pool.query(`DELETE FROM ${c.table} WHERE id=$1`,[req.params.id]);res.status(204).end();}catch(e){next(e);}});
export default router;
