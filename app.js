'use strict';
const $=s=>document.querySelector(s);
const services={'فحص الأنسجة':1200,'فحص خلوي للسوائل':650,'صبغات مناعية':1800,'عينة بإبرة دقيقة':850};
const stages=['تم الاستلام','تحت الفحص','مراجعة التقرير','جاهز للتسليم','تم التسليم'];
const key='systemfit-lab-workspace-v1';
const number=n=>new Intl.NumberFormat(lang==='ar'?'ar-EG':'en-GB').format(n);
const money=c=>number(c/100)+(lang==='ar'?' ج.م':' EGP');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sum=(items,fn)=>items.reduce((total,item)=>total+fn(item),0);
const code=id=>'SP-'+String(id).padStart(4,'0');
function seed(){
 const names=['مريم سامي','علي حسن','سلمى أحمد','عمر طارق','نور محمود','أحمد أمين'];
 const cases=names.map((name,i)=>{const service=Object.keys(services)[i%4];return {id:106-i,name,service,fee:services[service]*100,stage:[0,1,2,1,3,4][i],ref:['عيادة تجريبية','إحالة مباشرة'][i%2]}});
 const ledger=cases.map((r,i)=>({id:i+1,caseId:r.id,amount:[40000,65000,80000,20000,120000,65000][i],kind:'قبض',method:i%3===0?'بطاقة':'نقدي',shift:1,note:code(r.id)}));
 ledger.push({id:7,amount:25000,kind:'صرف',method:'نقدي',shift:1,note:'مستلزمات تشغيل تجريبية'});
 return {cases,ledger,shift:1,closed:[]}
}
let state=seed();
try{const saved=localStorage.getItem(key);if(saved)state=JSON.parse(saved)}catch{}
const sampleResults={104:'تغيرات التهابية مزمنة — مثال تدريبي',102:'نسيج حميد — مثال تدريبي',101:'خلايا تفاعلية — مثال تدريبي'};
for(const r of state.cases){
 if(r.received!==undefined)continue;
 const example=r.id>=101&&r.id<=106;
 r.received=example?'2026-11-'+String(16+r.id-101):'';
 r.released=r.id===101?'2026-11-20':'';
 r.result=example?(sampleResults[r.id]||''):'';
 r.exampleResult=!!r.result;
 r.updated=r.result?'2026-11-20':'';
}
function today(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Africa/Cairo'}).format(new Date())}
function dateView(value){return value?new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00')):'غير مسجل'}
const literal=s=>'<bdi data-literal>'+esc(s)+'</bdi>';
const caseName=r=>r.id>=101&&r.id<=106?esc(r.name):literal(r.name);
function summary(r){return r.result?(r.exampleResult?esc(r.result):literal(r.result)):'قيد الإعداد'}
function releaseDate(r){return r.released?dateView(r.released):r.stage===4?'غير مسجل':'لم يُسلّم بعد'}
function field(label,value){return '<div class="row"><span>'+label+'</span><b>'+value+'</b></div>'}
let page='overview',query='',stageFilter='',toastTimer;
const paid=id=>sum(state.ledger.filter(e=>e.caseId===id&&e.kind==='قبض'),e=>e.amount);
const balance=r=>r.fee-paid(r.id);
const entries=()=>state.ledger.filter(e=>e.shift===state.shift);
const totals=(list,kind,method)=>sum(list.filter(e=>e.kind===kind&&(!method||e.method===method)),e=>e.amount);
const cash=list=>totals(list,'قبض','نقدي')-totals(list,'صرف','نقدي');
function toast(msg){$('#notify').textContent=translate(msg);$('#notify').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#notify').hidden=true,3000)}
function save(message){state.audit.unshift({message,at:new Date().toISOString()});try{localStorage.setItem(key,JSON.stringify(state))}catch{message+=' · التخزين المحلي غير متاح'}$('#modal').close();render();toast(message)}
function modal(title,html){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=html;localizeTree($('#modal'));if(!$('#modal').open)$('#modal').showModal()}
$('#dismiss').onclick=()=>$('#modal').close();
function tile(label,value){return '<div class="tile"><span>'+label+'</span><strong>'+value+'</strong></div>'}
function hero(title,button,action){return '<section class="hero"><p>'+brandLabel()+'</p><h1>'+title+'</h1><button class="light" data-act="'+action+'">'+button+'</button></section>'}
function table(headers,rows){return '<div class="scroll"><table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>'+(!rows.length?'<p class="empty">لا توجد سجلات مطابقة.</p>':'')}
function casesTable(rows,expanded=false){const extras=expanded?['النتيجة','تاريخ الاستلام','تاريخ التسليم']:[];return table(['رقم العينة','الاسم والفحص','مرحلة العينة',...extras,'المتبقي'],rows.map(r=>'<tr><td><button class="link" data-case="'+r.id+'"><bdi>'+code(r.id)+'</bdi></button></td><td>'+caseName(r)+'<small>'+esc(r.service)+'</small></td><td><span class="chip">'+stages[r.stage]+'</span></td>'+(expanded?'<td class="summary">'+summary(r)+'</td><td>'+dateView(r.received)+'</td><td>'+releaseDate(r)+'</td>':'')+'<td>'+money(balance(r))+'</td></tr>'))}
function overview(){return hero('لوحة متابعة المعمل','＋ تسجيل حالة جديدة','new')+'<div class="tiles">'+tile('الحالات المسجلة',number(state.cases.length))+tile('متحصلات الوردية',money(totals(entries(),'قبض')))+tile('بانتظار مراجعة التقرير',number(state.cases.filter(r=>r.stage===2).length))+tile('مستحقات على الحالات',money(sum(state.cases,balance)))+'</div>'+overviewAlerts()+'<div class="grid"><section class="box"><div class="bar"><h2>أحدث الحالات</h2><button class="link" data-page="cases">عرض السجل</button></div>'+casesTable(state.cases.slice(0,5))+'</section><section class="box"><div class="bar"><h2>مراحل العينات</h2></div>'+stages.map((s,i)=>{const n=state.cases.filter(r=>r.stage===i).length;return '<div class="row"><span>'+s+'</span><b>'+number(n)+'</b></div><div class="rail"><i style="width:'+n*100/Math.max(state.cases.length,1)+'%"></i></div>'}).join('')+'</section></div>'}
function filtered(){return state.cases.filter(r=>matchesFilters(r)&&(r.name+' '+translate(r.name)+' '+code(r.id)+' '+[r.sampleId,r.assignee,r.branch,r.company].join(' ')+' '+r.service+' '+translate(r.service)).toLowerCase().includes(query.toLowerCase())&&(!stageFilter||r.stage===Number(stageFilter)))}
function casesView(){return hero('سجل الحالات والعينات','＋ تسجيل حالة جديدة','new')+'<section class="box" style="margin-top:18px"><div class="filters"><input id="search" aria-label="بحث" placeholder="بحث بالاسم أو رقم العينة" value="'+esc(query)+'"><select id="stage" aria-label="مرحلة العينة"><option value="">كل المراحل</option>'+stages.map((s,i)=>'<option value="'+i+'" '+(stageFilter===String(i)?'selected':'')+'>'+s+'</option>').join('')+'</select>'+caseFilters()+'</div><div id="results">'+casesTable(filtered(),true)+'</div></section>'}
function ledgerTable(list){return table(['الحركة','البيان','الطريقة','المبلغ'],list.slice().reverse().map(e=>'<tr><td>'+e.kind+'</td><td>'+(e.id===7&&e.note==='مستلزمات تشغيل تجريبية'?esc(e.note):literal(e.note))+'</td><td>'+e.method+'</td><td>'+money(e.amount)+'</td></tr>'))}
function finance(){const l=entries();return hero('الحسابات والخزينة','تسجيل مصروف','expense')+'<div class="tiles">'+tile('مقبوضات نقدية',money(totals(l,'قبض','نقدي')))+tile('مقبوضات البطاقات',money(totals(l,'قبض','بطاقة')))+tile('مصروفات نقدية',money(totals(l,'صرف')))+tile('صافي نقدية الوردية',money(cash(l)))+'</div><section class="box"><div class="bar"><h2>حركة الوردية '+number(state.shift)+'</h2><button class="alt" data-act="close" '+(!l.length?'disabled':'')+'>تقفيل الوردية</button></div>'+ledgerTable(l)+'</section><section class="box"><h2>فواتير عليها رصيد</h2>'+casesTable(state.cases.filter(r=>balance(r)>0))+'</section>'+ (state.closed.length?'<section class="box"><h2>الورديات المقفلة</h2>'+table(['الوردية','الصافي المتوقع','النقدية المعدودة','الفرق'],state.closed.slice().reverse().map(c=>'<tr><td><button class="link" data-shift="'+c.id+'">'+number(c.id)+'</button></td><td>'+money(c.expected)+'</td><td>'+money(c.actual)+'</td><td>'+money(c.actual-c.expected)+'</td></tr>'))+'</section>':'')}
function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('current',b.dataset.page===page));$('#content').innerHTML=page==='overview'?overview():page==='cases'?casesView():page==='reports'?reportsView()+reportLibrary():page==='partners'?partnersView():page==='finance'?finance():workspacePage();localizeTree($('#content'));updateBrand()}
function detail(id){const r=state.cases.find(x=>x.id===id);modal('ملف العينة · '+code(id),'<h3>'+caseName(r)+'</h3><p>'+esc(r.service)+' · '+(r.ref==='إحالة مباشرة'||r.ref==='عيادة تجريبية'?esc(r.ref):literal(r.ref))+'</p><div class="row"><span>مرحلة العينة</span><b>'+stages[r.stage]+'</b></div><h3>التواريخ والنتيجة</h3>'+field('تاريخ الاستلام',dateView(r.received))+field('تاريخ التسليم',releaseDate(r))+field('ملخص النتيجة',summary(r))+(r.result?field('آخر تحديث للنتيجة',dateView(r.updated)):'')+(r.stage<4?'<button class="link" data-result="'+id+'">'+(r.result?'تعديل النتيجة':'إضافة نتيجة')+'</button>':'')+'<div class="row"><span>قيمة الفاتورة</span><b>'+money(r.fee)+'</b></div><div class="row"><span>إجمالي المدفوع</span><b>'+money(paid(id))+'</b></div><div class="row"><span>الرصيد المستحق</span><b>'+money(balance(r))+'</b></div>'+workspaceDetail(r)+partnerCaseField(r)+'<div class="actions">'+(balance(r)>0?'<button class="primary" data-pay="'+id+'">تحصيل دفعة</button>':'')+(r.stage<4?'<button class="alt" data-next="'+id+'">نقل إلى '+stages[r.stage+1]+'</button>':'')+'</div><h3>الدفعات المسجلة</h3>'+ledgerTable(state.ledger.filter(e=>e.caseId===id)))}
function amountInput(name,max,initial){return '<input type="number" required min="0" step="0.01" name="'+name+'" '+(max!=null?'max="'+max+'"':'')+' value="'+initial+'">'}
const methods='<label>طريقة الدفع<select name="method"><option value="نقدي">نقدي</option><option value="بطاقة">بطاقة</option></select></label>';
function form(title,body,submit,handler){modal(title,'<form>'+body+'<button class="primary">'+submit+'</button></form>');$('#modal form').onsubmit=e=>{e.preventDefault();handler(new FormData(e.target))}}
function entry(kind,amount,method,note,caseId){state.ledger.push({id:state.ledger.length+1,kind,amount,method,note,caseId,shift:state.shift})}
const cents=(f,k)=>Math.round(Number(f.get(k))*100);
function newCase(partnerId=0){form('تسجيل حالة جديدة','<p>استخدم اسمًا افتراضيًا أثناء العرض.</p><label>اسم الحالة<input name="name" required maxlength="70"></label><label>تاريخ استلام العينة<input type="date" name="received" required max="'+today()+'" value="'+today()+'"></label>'+partnerSelect(partnerId)+'<label>جهة الإحالة<input name="ref" maxlength="70" placeholder="إحالة مباشرة"></label><label>الفحص المطلوب<select name="service">'+Object.keys(services).map(s=>'<option value="'+s+'">'+s+'</option>').join('')+'</select></label><label>قيمة الفاتورة التجريبية بالجنيه'+amountInput('fee',999999,1200)+'</label><label>المدفوع عند التسجيل بالجنيه'+amountInput('amount',1200,0)+'</label>'+methods+workflowFields({}),'حفظ الحالة والفاتورة',f=>{let name=f.get('name').trim(),fee=cents(f,'fee'),amount=cents(f,'amount');if(!validateSample(f))return;if(!name||amount>fee)return toast('راجع الاسم والمبلغ المدفوع');let id=Math.max(...state.cases.map(r=>r.id))+1;state.cases.unshift({...readWorkflow(f),id,name,fee,partnerId:Number(f.get('partnerId')),received:f.get('received'),result:'',updated:'',released:'',stage:0,service:f.get('service'),ref:f.get('ref').trim()||'إحالة مباشرة'});if(amount)entry('قبض',amount,f.get('method'),code(id),id);save('تم تسجيل الحالة '+code(id));detail(id)});const f=$('#modal form').elements;const price=()=>{const partner=state.partners.find(p=>p.id===Number(f.partnerId.value));f.fee.value=(services[f.service.value]*(100-(partner?.discount||0))/100).toFixed(2);f.amount.max=f.fee.value};f.partnerId.onchange=price;f.service.onchange=price;price();f.fee.oninput=()=>f.amount.max=f.fee.value}
function collect(id){const r=state.cases.find(r=>r.id===id);form('تحصيل دفعة · '+code(id),'<p>المستحق '+money(balance(r))+'</p><label>قيمة الدفعة بالجنيه'+amountInput('amount',balance(r)/100,balance(r)/100)+'</label>'+methods,'تسجيل الدفعة',f=>{const n=cents(f,'amount');if(n<=0||n>balance(r))return toast('راجع قيمة الدفعة');entry('قبض',n,f.get('method'),code(id),id);save('تم تسجيل الدفعة');detail(id)})}
function expense(){form('تسجيل مصروف نقدي','<label>بيان المصروف<input name="note" maxlength="90" required></label><label>المبلغ بالجنيه'+amountInput('amount',999999,'')+'</label>','حفظ المصروف',f=>{const n=cents(f,'amount'),note=f.get('note').trim();if(n<=0||!note)return toast('أدخل البيان ومبلغًا أكبر من صفر');entry('صرف',n,'نقدي',note);save('تم تسجيل المصروف')})}
function closeShift(){const expected=cash(entries());form('تقفيل الوردية '+number(state.shift),'<p>صافي النقدية المتوقع '+money(expected)+'</p><label>النقدية المعدودة بالجنيه'+amountInput('actual',null,'')+'</label><p>يُحفظ فرق الجرد وتبدأ وردية جديدة برصيد افتتاحي صفر.</p>','تأكيد التقفيل',f=>{state.closed.push({id:state.shift,expected,actual:cents(f,'actual')});state.shift++;save('تم تقفيل الوردية وفتح الوردية التالية')})}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.page){page=d.page;render();window.scrollTo(0,0)}if(d.case)detail(+d.case);if(d.pay)collect(+d.pay);if(d.result)editResult(+d.result);if(d.next)advance(+d.next);if(d.shift)modal('حركات الوردية '+number(+d.shift),ledgerTable(state.ledger.filter(e=>e.shift===+d.shift)));if(d.act==='new')newCase();if(d.act==='expense')expense();if(d.act==='close')closeShift()});
document.addEventListener('input',e=>{if(e.target.id==='search'){query=e.target.value;$('#results').innerHTML=casesTable(filtered(),true);localizeTree($('#results'))}});
document.addEventListener('change',e=>{if(e.target.id==='stage'){stageFilter=e.target.value;$('#results').innerHTML=casesTable(filtered(),true);localizeTree($('#results'))}});
let reportStage='';
function reportsView(){
 const reports=state.cases.filter(r=>r.result||r.stage>=2);
 const rows=reports.filter(r=>!reportStage||r.stage===Number(reportStage));
 return hero('التقارير والنتائج','عرض السجل','register')+
 '<div class="tiles">'+[2,3,4].map((n,i)=>tile(['تقارير للمراجعة','تقارير جاهزة','تقارير مسلّمة'][i],number(reports.filter(r=>r.stage===n).length))).join('')+'</div><section class="box"><div class="bar"><h2>ملخص التقرير التجريبي</h2><select id="report-stage" aria-label="مرحلة العينة"><option value="">كل التقارير</option>'+stages.map((s,i)=>'<option value="'+i+'" '+(reportStage===String(i)?'selected':'')+'>'+s+'</option>').join('')+'</select></div>'+casesTable(rows,true)+'</section>'
}
function editResult(id){
 const r=state.cases.find(x=>x.id===id);
 form('ملخص النتيجة · '+code(id),'<label>ملخص النتيجة<textarea data-literal rows="5" maxlength="1200" required name="result" dir="auto">'+esc(r.exampleResult?translate(r.result):r.result)+'</textarea></label>','حفظ النتيجة',f=>{
  const value=f.get('result').trim();
  if(!value){$('#modal textarea').focus();return}
  r.result=value;r.exampleResult=false;r.updated=today();
  save('تم حفظ النتيجة');detail(id)
 })
}
function advance(id){
 const r=state.cases.find(x=>x.id===id);
 if(r.stage>=4)return;
 if(r.stage>=2&&!r.result){editResult(id);toast('سجّل ملخص النتيجة قبل تجهيز التقرير للتسليم');return}
 if(r.stage===3){
  const earliest=[r.received,r.updated].sort().pop()||'';
  form('تسليم التقرير · '+code(id),'<label>تاريخ التسليم<input type="date" name="released" required min="'+earliest+'" max="'+today()+'" value="'+today()+'"></label>','تأكيد التسليم',f=>{
   r.released=f.get('released');r.stage=4;r.status='Completed';save('تم تسليم التقرير');detail(id)
  });return
 }
 r.stage++;r.status=['Received','In progress','Ready for review','Ready for review'][r.stage];save('تم تحديث مرحلة العينة');detail(id)
}
document.addEventListener('change',e=>{if(e.target.id==='report-stage'){reportStage=e.target.value;render()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-act="register"]')){page='cases';render()}});
function applyLanguage(){
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 document.title=(state.brand?.name||'SystemFit')+' | Lab Workspace';
 const toggle=$('#language');
 toggle.textContent=lang==='ar'?'English':'العربية';
 toggle.lang=lang==='ar'?'en':'ar';
 localizeTree(document.body);
}
$('#language').onclick=()=>{
 const next=lang==='ar'?'en':'ar';
 try{localStorage.setItem('systemfit-lab-language',next)}catch{}
 lang=next;
 restoreShell();applyLanguage();render()
};
const shell=[...document.querySelectorAll('header,nav,footer,#dismiss')].map(el=>[el,el.cloneNode(true)]);
function restoreShell(){
 const listener=$('#language').onclick;
 for(const [old,copy] of shell){old.innerHTML=copy.innerHTML;for(const a of copy.attributes)old.setAttribute(a.name,a.value)}
 $('#language').onclick=listener;
}
