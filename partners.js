'use strict';
const partnerTypes=['عيادة','مستشفى','معمل'];
let selectedPartner=0;
let partnerQuery='';
if(!Array.isArray(state.partners)){
 state.partners=[
  {id:1,name:'عيادة جناكليس التجريبية',type:'عيادة',contact:'استقبال العيادة',address:'',discount:10,demo:true},
  {id:2,name:'مستشفى الإسكندرية التجريبي',type:'مستشفى',contact:'مكتب التحويلات',address:'',discount:15,demo:true},
  {id:3,name:'مركز الأنسجة التجريبي',type:'معمل',contact:'منسق العينات',address:'',discount:5,demo:true}
 ];
 // Only seed the built-in clinic referrals. Preserve direct referrals and user cases.
 for(const r of state.cases){
  if(r.ref==='عيادة تجريبية'&&[102,104,106].includes(r.id))r.partnerId={102:3,104:2,106:1}[r.id];
 }
}
const partnerName=p=>p.demo?esc(p.name):literal(p.name);
const partnerCases=id=>state.cases.filter(r=>r.partnerId===id);
function partnerSelect(id){
 return '<label>شريك الإحالة<select name="partnerId"><option value="0">بدون شريك</option>'+
 state.partners.map(p=>'<option '+(p.demo?'':'data-literal ')+'value="'+p.id+'" '+(p.id===id?'selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select></label>'
}
function partnerCaseField(r){
 const p=state.partners.find(p=>p.id===r.partnerId);
 return field('شريك الإحالة',p?partnerName(p):'بدون شريك')+'<button class="link" data-assign="'+r.id+'">ربط الحالة بشريك</button>'
}
function assignPartner(id){
 const r=state.cases.find(r=>r.id===id);
 form('ربط الحالة بشريك · '+code(id),partnerSelect(r.partnerId),'حفظ الربط',f=>{
  r.partnerId=Number(f.get('partnerId'));save('تم تحديث الشريك');detail(id)
 })
}
function partnerForm(id){
 const p=state.partners.find(p=>p.id===id);
 form(p?'تعديل بيانات الشريك':'إضافة شريك',
 '<label>اسم الشريك<input name="name" required maxlength="80" value="'+esc(p?.name||'')+'"></label>'+
 '<label>نوع الجهة<select name="type">'+partnerTypes.map(t=>'<option value="'+t+'" '+(t===p?.type?'selected':'')+'>'+t+'</option>').join('')+'</select></label>'+
 '<label>جهة الاتصال<input name="contact" maxlength="80" value="'+esc(p?.contact||'')+'"></label>'+
 '<label>بيانات التواصل<input name="address" maxlength="120" value="'+esc(p?.address||'')+'"></label>'+
 '<label>الخصم المقترح عند التسجيل (%)<input name="discount" type="number" min="0" max="100" step="0.01" required value="'+(p?.discount||0)+'"></label>',
 'حفظ الشريك',f=>{
  const name=f.get('name').trim();
  if(!name||state.partners.some(other=>other.id!==id&&other.name.toLowerCase()===name.toLowerCase())){
   const input=$('#modal input[name=name]');input.setCustomValidity(translate(name?'اسم الشريك مستخدم بالفعل':'أدخل اسم الشريك'));input.reportValidity();input.oninput=()=>input.setCustomValidity('');return
  }
  const record={id:p?.id||Math.max(0,...state.partners.map(x=>x.id))+1,name,type:f.get('type'),contact:f.get('contact').trim(),address:f.get('address').trim(),discount:Number(f.get('discount')),demo:!!p?.demo&&p.name===name};
  if(p)Object.assign(p,record);else state.partners.push(record);
  selectedPartner=record.id;save('تم حفظ الشريك')
 })
}
function partnerCards(){
 const matches=state.partners.filter(p=>(p.name+' '+(p.demo?translate(p.name):'')+' '+translate(p.type)).toLowerCase().includes(partnerQuery.toLowerCase()));
 return matches.map(p=>{
  const rows=partnerCases(p.id);
  return '<article class="box partner"><div class="bar"><span class="chip">'+p.type+'</span><bdi>PT-'+p.id+'</bdi></div><h2>'+partnerName(p)+'</h2>'+field('حالات محالة',number(rows.length))+field('جاهزة للتسليم',number(rows.filter(r=>r.stage===3).length))+field('رصيد الحالات المحالة',money(sum(rows,balance)))+'<button class="primary" data-partner="'+p.id+'">عرض ملف الشريك</button></article>'
 }).join('')||'<p class="empty">لا توجد سجلات مطابقة.</p>'
}
function partnersView(){
 const p=state.partners.find(p=>p.id===selectedPartner);
 if(!p){
  const rows=state.cases.filter(r=>r.partnerId);
  return hero('شركاء الإحالة','إضافة شريك','partner-new')+'<div class="tiles">'+tile('الشركاء المسجلون',number(state.partners.length))+tile('حالات محالة',number(rows.length))+tile('حالات مفتوحة',number(rows.filter(r=>r.stage<4).length))+tile('رصيد الحالات المحالة',money(sum(rows,balance)))+'</div><div class="bar"><h2>جهات الإحالة وحسابات الحالات</h2><input id="partner-search" aria-label="بحث عن شريك" placeholder="بحث عن شريك" value="'+esc(partnerQuery)+'"></div><div id="partner-list" class="partnerGrid">'+partnerCards()+'</div>'
 }
 const rows=partnerCases(p.id);
 return '<div class="actions"><button class="link" data-act="partner-list">كل الشركاء</button></div>'+hero(partnerName(p),'تسجيل حالة جديدة','partner-case')+
 '<div class="tiles">'+tile('حالات محالة',number(rows.length))+tile('إجمالي الفواتير',money(sum(rows,r=>r.fee)))+tile('إجمالي التحصيل',money(sum(rows,r=>paid(r.id))))+tile('رصيد الحالات المحالة',money(sum(rows,balance)))+'</div>'+
 '<div class="box"><div class="bar"><h2>'+p.type+' · <bdi>PT-'+p.id+'</bdi></h2><button class="link" data-act="partner-edit">تعديل بيانات الشريك</button></div>'+field('جهة الاتصال',p.demo?esc(p.contact||'—'):literal(p.contact||'—'))+field('بيانات التواصل',literal(p.address||'—'))+field('خصم الفحوصات',number(p.discount)+'%')+'</div>'+
 '<section class="box"><div class="bar"><h2>حالات الشريك</h2><button class="alt" data-act="statement">كشف حساب الحالات</button></div>'+casesTable(rows,true)+'</section>'
}
function statement(){
 const p=state.partners.find(p=>p.id===selectedPartner);
 const rows=partnerCases(p.id);
 modal('كشف حساب الحالات','<div class="statement"><h2>'+partnerName(p)+'</h2><p>بيانات تجريبية · تاريخ الكشف '+dateView(today())+'</p>'+table(['رقم العينة','تاريخ الاستلام','قيمة الفاتورة','إجمالي المدفوع','المتبقي'],rows.map(r=>'<tr><td>'+code(r.id)+'</td><td>'+dateView(r.received)+'</td><td>'+money(r.fee)+'</td><td>'+money(paid(r.id))+'</td><td>'+money(balance(r))+'</td></tr>'))+field('إجمالي الفواتير',money(sum(rows,r=>r.fee)))+field('إجمالي التحصيل',money(sum(rows,r=>paid(r.id))))+field('المبلغ المتبقي',money(sum(rows,balance)))+'</div><button class="primary" data-act="print">طباعة الكشف</button>')
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page==='partners'){selectedPartner=0;render()}
 if(b.dataset.partner){selectedPartner=Number(b.dataset.partner);render();window.scrollTo(0,0)}
 if(b.dataset.assign)assignPartner(Number(b.dataset.assign));
 switch(b.dataset.act){
  case 'partner-list':selectedPartner=0;render();break;
  case 'partner-new':partnerForm(0);break;
  case 'partner-edit':partnerForm(selectedPartner);break;
  case 'partner-case':newCase(selectedPartner);break;
  case 'statement':statement();break;
  case 'print':window.print();break;
 }
});
document.addEventListener('input',e=>{if(e.target.id==='partner-search'){partnerQuery=e.target.value;$('#partner-list').innerHTML=partnerCards();localizeTree($('#partner-list'))}});

