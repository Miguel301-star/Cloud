export function switchTab(id){
 document.querySelectorAll('.tab-panel').forEach(x=>x.classList.add('hidden'));
 document.getElementById(`tab-${id}`)?.classList.remove('hidden');
 document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));
}
