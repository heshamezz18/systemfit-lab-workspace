'use strict';
const tr=(ar,en)=>lang==='ar'?ar:en;
const molecular=['IGHV','EGFR','ALL RAS','MSI','17P','BRCA'];
Object.assign(services,Object.fromEntries(molecular.map((test,i)=>[test,[2400,3200,3500,2600,1900,4200][i]])));
const statuses=['New','Pending documents','Received','In progress','Recollection','Ready for review','Completed','Rejected'];
const arStatuses=['جديد','مستندات ناقصة','تم الاستلام','جارٍ العمل','إعادة سحب','جاهز للمراجعة','مكتمل','مرفوض'];
const statusText=v=>tr(arStatuses[statuses.indexOf(v)]||v,v);
const fields=[
 ['sampleId','كود العينة الخارجي','External sample ID'],['company','الشركة / الحساب','Company / account'],
 ['direction','اتجاه الإحالة','Referral direction',['Incoming','Outgoing']],['branch','الفرع','Branch'],
 ['status','حالة التشغيل','Workflow status',statuses],['nationalId','رقم هوية تجريبي','Demo ID'],
 ['physician','الطبيب المحول','Referring physician'],['registration','تاريخ التسجيل','Registration date','date'],
 ['due','الموعد المتوقع','Due date','date'],['cbcDate','تاريخ CBC / Flow','CBC / Flow date','date'],
 ['assignee','المسؤول','Assigned to'],['sampleType','نوع العينة','Specimen type'],['missing','المستندات الناقصة','Missing documents'],
 ['nextStep','الخطوة التالية','Next step'],['presentation','التشخيص المبدئي','Presentation'],['notes','ملاحظات','Notes']
];
const relativeDay=n=>{const d=new Date(today()+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
if(!state.workspaceVersion){
 state.workspaceVersion=1;state.brand={name:'',logo:''};state.audit=[];
 for(const [i,test] of molecular.entries()){
  state.cases.unshift({id:107+i,name:'Demo '+(i+1),service:test,fee:services[test]*100,stage:[0,0,1,1,2,4][i],
   received:relativeDay(-i-1),registration:relativeDay(-i-1),due:relativeDay(i-2),updated:i>=4?today():'',released:i===5?today():'',
   result:i>=4?'Demo report • RF-'+(107+i):'',partnerId:1+i%3,ref:'عيادة تجريبية',company:'Demo account '+(1+i%2),
   status:statuses[[1,0,3,4,5,6][i]],missing:i===0?'CBC / Flow Cytometry':'',assignee:'Team '+(i%2+1),direction:i%2?'Incoming':'Outgoing',branch:'Demo branch'});
 }
 state.tasks=[{id:1,title:'CBC / Flow Cytometry',caseId:107,owner:'Team 1',due:today(),done:false}];
 state.messages=[{caseId:107,text:'CBC / Flow Cytometry?',internal:false,at:new Date().toISOString()}];
 state.docs=[{caseId:111,name:'RF-111',category:'Result',released:false,example:true}];
}
const brandLabel=()=>state.brand.name?literal(state.brand.name):tr('اسم المعمل','Your laboratory');
function updateBrand(){
 $('#brandName').textContent=state.brand.name||tr('اسم المعمل','Your laboratory');
 $('#brandName').dataset.literal='';
 $('#logoSlot').innerHTML=state.brand.logo?'<img alt="" src="'+esc(state.brand.logo)+'">':'✚';
 document.title=(state.brand.name||'SystemFit')+' | Lab Workspace';
}
const choose=(value,options,display=x=>x)=>options.map(v=>'<option value="'+esc(v)+'" '+(v===value?'selected':'')+'>'+esc(display(v))+'</option>').join('');
const directionText=v=>v==='Outgoing'?tr('صادر','Outgoing'):tr('وارد','Incoming');
function workflowFields(r){
 return '<details class="wf" '+(r.id?'open':'')+'><summary>'+tr('بيانات التشغيل والمتابعة','Workflow details')+'</summary><div class="fieldgrid">'+fields.map(([k,ar,en,type])=>{
 let v=r[k]||(k==='registration'?today():'');
 return '<label>'+tr(ar,en)+(Array.isArray(type)?'<select name="'+k+'">'+choose(v,type,k==='status'?statusText:directionText)+'</select>':'<input name="'+k+'" type="'+(type||'text')+'" maxlength="180" value="'+esc(v)+'">')+'</label>';
 }).join('')+'</div></details>';
}
function readWorkflow(f){return Object.fromEntries(fields.map(([k])=>[k,String(f.get(k)||'').trim()]))}
function validateSample(f,id){const val=String(f.get('sampleId')||'').trim().toLowerCase();if(val&&state.cases.some(r=>r.id!==id&&[r.sampleId,code(r.id)].some(x=>x?.toLowerCase()===val))){alert(tr('كود العينة مستخدم','Sample ID already exists'));return false}return true}
const isLate=r=>r.due&&r.due<today()&&!['Rejected','Completed'].includes(r.status)&&r.stage<4;
const filterState={service:'',company:'',status:'',assignee:'',received:''};
const matchesFilters=r=>Object.entries(filterState).every(([k,v])=>!v||(r[k]||(k==='status'?'Received':''))===v);
function caseFilters(){return Object.keys(filterState).map((k,i)=>{
 const label=tr(['كل الفحوص','كل الحسابات','كل حالات التشغيل','كل المسؤولين','تاريخ الاستلام'][i],['All tests','All accounts','All workflow statuses','All assignees','Received date'][i]);
 if(k==='received')return '<label>'+label+'<input type="date" data-filter="'+k+'" value="'+esc(filterState[k])+'"></label>';
 const opts=k==='status'?statuses:[...new Set(state.cases.map(r=>r[k]).filter(Boolean))];
 return '<select aria-label="'+label+'" data-filter="'+k+'"><option value="">'+label+'</option>'+choose(filterState[k],opts,k==='status'?statusText:translate)+'</select>';
}).join('')}
const act=(action,label,id='',cls='alt')=>'<button type="button" class="'+cls+'" data-work="'+action+'" data-id="'+id+'">'+label+'</button>';
const navLink=(to,label)=>'<button class="link" data-page="'+to+'">'+label+' ←</button>';
function overviewAlerts(){return '<section class="quick">'+navLink('operations',tr('تنبيهات التشغيل','Operational alerts')+' · '+state.cases.filter(r=>isLate(r)||r.missing||r.status==='Recollection').length)+navLink('tasks',tr('مهام مفتوحة','Open tasks')+' · '+state.tasks.filter(x=>!x.done).length)+navLink('reports',tr('نتائج للمراجعة','Reports to review')+' · '+state.cases.filter(r=>r.stage===2).length)+'</section>'}
const heading=(ar,en,action='')=>'<section class="hero"><p>'+brandLabel()+'</p><h1>'+tr(ar,en)+'</h1>'+action+'</section>';
const box=(title,body)=>'<section class="box"><h2>'+title+'</h2>'+body+'</section>';
const caseLink=id=>'<button class="link" data-case="'+id+'">'+code(id)+'</button>';
const empty=()=>'<p class="empty">'+tr('لا توجد سجلات','No records')+'</p>';
function workspacePage(){
 if(page==='operations'){
 const alertRows=state.cases.filter(r=>isLate(r)||r.missing||r.status==='Recollection');
 return heading('متابعة التشغيل','Operations')+box(tr('الحالات التي تحتاج متابعة','Cases requiring attention'),table([tr('العينة','Sample'),tr('الفحص','Test'),tr('حالة التشغيل','Workflow status'),tr('سبب المتابعة','Follow-up'),tr('المسؤول','Owner')],alertRows.map(r=>'<tr><td>'+caseLink(r.id)+'</td><td>'+esc(r.service)+'</td><td>'+statusText(r.status||'Received')+'</td><td>'+[isLate(r)?tr('تجاوز الموعد','Overdue'):'',esc(r.missing||''),r.status==='Recollection'?tr('تنسيق إعادة السحب','Arrange recollection'):''].filter(Boolean).join(' · ')+'</td><td>'+literal(r.assignee||'—')+'</td></tr>')))+box(tr('سجل النشاط','Activity log'),state.audit.slice(0,50).map(a=>field(esc(a.message),new Date(a.at).toLocaleString(lang))).join('')||empty());
 }
 if(page==='tasks')return heading('مهام الفريق','Team tasks',act('task',tr('إضافة مهمة','New task'),'','light'))+box(tr('قائمة المتابعة','Follow-up list'),table([tr('المهمة','Task'),tr('العينة','Sample'),tr('المسؤول','Owner'),tr('تاريخ الاستحقاق','Due'),tr('الحالة','Status')],state.tasks.map(t=>'<tr><td>'+literal(t.title)+'</td><td>'+(t.caseId?caseLink(t.caseId):'—')+'</td><td>'+literal(t.owner||'—')+'</td><td>'+dateView(t.due)+'</td><td>'+act('toggle',t.done?tr('مكتملة · إعادة فتح','Completed · reopen'):tr('تحديد كمكتملة','Mark complete'),t.id)+'</td></tr>')));
 if(page==='messages')return heading('محادثات الحالات','Case conversations')+box(tr('التحديثات والملاحظات','Updates and notes'),state.messages.slice().reverse().map(m=>field(caseLink(m.caseId)+' · '+messageType(m),literal(m.text))).join('')||empty());
 return heading('إعدادات المعمل','Lab settings')+box(tr('هوية المعمل','Lab identity'),'<form id="branding"><label>'+tr('اسم المعمل','Laboratory name')+'<input name="name" maxlength="70" value="'+esc(state.brand.name)+'"></label><label>'+tr('شعار المعمل','Laboratory logo')+' (PNG / JPG / WebP · 512 KB)<input name="logo" type="file" accept="image/png,image/jpeg,image/webp"></label><label class="inline"><input type="checkbox" name="remove">'+tr('إزالة الشعار','Remove logo')+'</label><button class="primary">'+tr('حفظ الهوية','Save branding')+'</button></form>')+box(tr('بيئة العرض','Demo workspace'),'<p>'+tr('البيانات تجريبية وتُحفظ في المتصفح على هذا الجهاز. التشغيل الداخلي المشترك والصلاحيات يحتاجان خادم المعمل.','Use fictional data. Edits stay in this browser. Shared operations and staff permissions require a laboratory server.')+'</p>');
}
const messageType=m=>m.internal?tr('ملاحظة داخلية','Internal note'):tr('رسالة للشريك · تجريبية','Partner message · demo');
function workspaceDetail(r){
 return '<h3>'+tr('تشغيل العينة','Sample workflow')+'</h3>'+field(tr('حالة التشغيل','Workflow status'),statusText(r.status||'Received'))+fields.filter(([k])=>k!=='status'&&r[k]).map(([k,ar,en])=>field(tr(ar,en),k==='direction'?directionText(r[k]):literal(r[k]))).join('')+'<div class="actions">'+act('edit',tr('تعديل بيانات الحالة','Edit case'),r.id)+act('barcode',tr('طباعة باركود','Print barcode'),r.id)+act('documents',tr('مستندات الحالة','Case files'),r.id)+act('message',tr('محادثة الحالة','Case conversation'),r.id)+act('invoice',tr('طباعة فاتورة','Print invoice'),r.id)+(r.result?act('report',tr('طباعة التقرير','Print report'),r.id):'')+'</div>';
}
const textField=(name,label,value='',required=false)=>'<label>'+label+'<input name="'+name+'" maxlength="160" '+(required?'required':'')+' value="'+esc(value)+'"></label>';
function editCase(r){
 form(tr('تعديل الحالة','Edit case')+' · '+code(r.id),textField('name',tr('اسم الحالة','Patient name'),r.name,true)+'<label>'+tr('الفحص','Test')+'<select name="service">'+choose(r.service,Object.keys(services),translate)+'</select></label><label>'+tr('تاريخ الاستلام','Received date')+'<input type="date" required name="received" max="'+today()+'" value="'+esc(r.received)+'"></label>'+workflowFields(r),tr('حفظ','Save'),f=>{
 if(!validateSample(f,r.id)||!f.get('name').trim())return;
 Object.assign(r,readWorkflow(f),{name:f.get('name').trim(),service:f.get('service'),received:f.get('received')});save(tr('تم تحديث الحالة','Case updated'));detail(r.id);
 });
}
function taskForm(){form(tr('مهمة جديدة','New task'),textField('title',tr('المهمة','Task'),'',true)+textField('owner',tr('المسؤول','Owner'))+'<label>'+tr('العينة','Sample')+'<select name="caseId"><option value="">—</option>'+state.cases.map(r=>'<option value="'+r.id+'">'+code(r.id)+'</option>').join('')+'</select></label><label>'+tr('تاريخ الاستحقاق','Due date')+'<input name="due" type="date" required value="'+today()+'"></label>',tr('حفظ','Save'),f=>{if(!f.get('title').trim())return;state.tasks.unshift({...Object.fromEntries(f),caseId:Number(f.get('caseId')),id:Date.now(),done:false});save(tr('تمت إضافة مهمة','Task added'))})}
function conversation(r){form(tr('محادثة الحالة','Case conversation')+' · '+code(r.id),state.messages.filter(m=>m.caseId===r.id).map(m=>field(messageType(m),literal(m.text))).join('')+'<label>'+tr('رسالة جديدة','New message')+'<textarea name="text" maxlength="800" required></textarea></label><label class="inline"><input type="checkbox" name="internal">'+tr('ملاحظة داخلية','Internal note')+'</label>',tr('حفظ الرسالة','Save message'),f=>{const text=f.get('text').trim();if(!text)return;state.messages.push({caseId:r.id,text,internal:f.has('internal'),at:new Date().toISOString()});save(tr('تمت إضافة رسالة','Message added'));conversation(r)})}
const fileData=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)});
function filesView(r){
 const docs=state.docs.map((d,i)=>({d,i})).filter(({d})=>d.caseId===r.id);
 form(tr('ملفات الحالة','Case files')+' · '+code(r.id),docs.map(({d,i})=>field(d.example?act('report',esc(d.name),r.id):'<a download="'+esc(d.name)+'" href="'+esc(d.data)+'">'+literal(d.name)+'</a>',esc(d.category)+' '+(d.category==='Result'?(d.released?tr('تمت الإتاحة','Released'):act('release',tr('إتاحة','Release'),i)) :''))).join('')+'<label>'+tr('نوع الملف','Category')+'<select name="category">'+choose('', ['CBC','Flow Cytometry','ID','Document','Result'])+'</select></label><label>'+tr('ملف تجريبي فقط','Demo file only')+' · PDF / JPG / PNG · 512 KB<input name="file" required type="file" accept=".pdf,.png,.jpg,.jpeg"></label>',tr('حفظ الملف محليًا','Save local file'),async f=>{
 const file=f.get('file');if(file.size>512*1024||!['application/pdf','image/jpeg','image/png'].includes(file.type))return alert(tr('راجع نوع وحجم الملف','Check file type and size'));
 const doc={caseId:r.id,category:f.get('category'),name:file.name,data:await fileData(file),released:false};state.docs.push(doc);
 try{localStorage.setItem(key,JSON.stringify(state))}catch{state.docs.pop();return alert(tr('مساحة التخزين غير كافية','Browser storage is full'))}save(tr('تم حفظ الملف','File saved'));filesView(r);
 });
}
function reportLibrary(){
 const results=state.docs.filter(d=>d.category==='Result');
 return box(tr('مكتبة ملفات النتائج','Result file library'),table([tr('العينة','Sample'),tr('ملف النتيجة','Result file'),tr('حالة الملف','File status')],results.map(d=>'<tr><td>'+caseLink(d.caseId)+'</td><td>'+act('documents',esc(d.name),d.caseId,'link')+'</td><td>'+(d.released?tr('متاح','Released'):tr('بانتظار الإتاحة','Awaiting release'))+'</td></tr>')));
}
const barPatterns={0:'bsbSBsBsb',1:'BsbSbsbsB',2:'bsBSbsbsB',3:'BsBSbsbsb',4:'bsbSBsbsB',5:'BsbSBsbsb',6:'bsBSBsbsb',7:'bsbSbsBsB',8:'BsbSbsBsb',9:'bsBSbsBsb',P:'bsBsBsbSb',S:'bsBsbsBSb','-':'bSbsbsBsB','*':'bSbsBsBsb'};
function barcode(id){let x=12,bars='';for(const c of '*'+code(id)+'*'){for(const mark of barPatterns[c]){const w=mark===mark.toUpperCase()?3:1;if(mark.toLowerCase()==='b')bars+='<rect x="'+x+'" width="'+w+'" height="45"/>';x+=w}x++}return '<svg role="img" aria-label="'+code(id)+'" viewBox="0 0 '+(x+12)+' 45" width="280" height="80">'+bars+'</svg>'}
function printView(r,kind){const title=kind==='invoice'?tr('فاتورة الحالة','Case invoice'):kind==='report'?tr('تقرير النتيجة','Result report'):tr('ملصق العينة','Specimen label');
 modal(title,'<article class="statement"><small>SystemFit · DEMO</small><h2>'+brandLabel()+'</h2><h3>'+title+'</h3>'+field(code(r.id),caseName(r))+field(tr('الفحص','Test'),esc(r.service))+(kind==='barcode'?barcode(r.id):kind==='report'?field(tr('النتيجة','Result'),summary(r))+field(tr('مرحلة التقرير','Report stage'),translate(stages[r.stage])):field('قيمة الفاتورة',money(r.fee))+field('إجمالي المدفوع',money(paid(r.id)))+field('الرصيد المستحق',money(balance(r))))+'</article>'+act('print-document',tr('طباعة / PDF','Print / PDF'),'','primary'))}
document.addEventListener('change',e=>{if(e.target.dataset.filter){filterState[e.target.dataset.filter]=e.target.value;render()}});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-work]');if(!b)return;const id=Number(b.dataset.id),r=state.cases.find(c=>c.id===id);
 switch(b.dataset.work){
 case 'edit':editCase(r);break;case 'documents':filesView(r);break;case 'message':conversation(r);break;case 'task':taskForm();break;
 case 'invoice':case 'report':case 'barcode':printView(r,b.dataset.work);break;case 'print-document':window.print();break;
 case 'toggle':{const task=state.tasks.find(t=>t.id===id);task.done=!task.done;save(tr('تم تحديث المهمة','Task updated'));break}
 case 'release':{const doc=state.docs[id];doc.released=true;save(tr('تمت إتاحة النتيجة','Result released'));filesView(state.cases.find(c=>c.id===doc.caseId));break}
 }
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='branding')return;e.preventDefault();const f=new FormData(e.target),file=f.get('logo');let logo=f.has('remove')?'':state.brand.logo;
 if(file.size){if(file.size>512*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))return alert(tr('راجع نوع وحجم الشعار','Check logo type and size'));logo=await fileData(file)}
 const prior=state.brand;state.brand={name:f.get('name').trim(),logo};try{localStorage.setItem(key,JSON.stringify(state))}catch{state.brand=prior;return alert(tr('مساحة التخزين غير كافية','Browser storage is full'))}save(tr('تم حفظ هوية المعمل','Lab identity saved'));
});
applyLanguage();render();
