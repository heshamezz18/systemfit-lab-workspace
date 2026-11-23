'use strict';
let lang='ar';
try {lang=localStorage.getItem('systemfit-lab-language')==='en'?'en':'ar'}catch{}
const words=Object.fromEntries(`معمل د. ياسر الدويك | Dr. Yasser El Dowik Laboratory
إدارة المعمل | Lab management
شعار المعمل التخصصي لتحاليل الأورام والأنسجة | S.P.C.L. pathology laboratory logo
لتحاليل الأنسجة والأورام | Surgical pathology and cytology
جناكليس · الإسكندرية | Gianaclis · Alexandria
نسخة عرض تجريبية | Demo workspace
التنقل الرئيسي | Main navigation
لوحة المتابعة | Overview
سجل الحالات | Case register
الحسابات والخزينة | Finance & cash desk
نموذج مقترح للعرض ببيانات وأسعار تجريبية | Demonstration with fictional records and prices
إغلاق | Close
فحص الأنسجة | Histopathology
فحص خلوي للسوائل | Fluid cytology
صبغات مناعية | Immunohistochemistry
عينة بإبرة دقيقة | Fine needle aspiration
تم الاستلام | Received
تحت الفحص | In examination
مراجعة التقرير | Report review
جاهز للتسليم | Ready for release
تم التسليم | Released
مريم سامي | Mariam Sami
علي حسن | Ali Hassan
سلمى أحمد | Salma Ahmed
عمر طارق | Omar Tarek
نور محمود | Nour Mahmoud
أحمد أمين | Ahmed Amin
عيادة تجريبية | Demo clinic
إحالة مباشرة | Direct referral
مستلزمات تشغيل تجريبية | Demo operating supplies
نقدي | Cash
بطاقة | Card
قبض | Receipt
صرف | Expense
التخزين المحلي غير متاح | Local storage unavailable
المعمل التخصصي لتحاليل الأورام والأنسجة | Specialized Pathology & Cytology Laboratory
لا توجد سجلات مطابقة. | No matching records.
رقم العينة | Specimen ID
الاسم والفحص | Patient and test
مرحلة العينة | Specimen stage
المتبقي | Balance
لوحة متابعة المعمل | Laboratory overview
تسجيل حالة جديدة | Register a case
الحالات المسجلة | Registered cases
متحصلات الوردية | Shift collections
بانتظار مراجعة التقرير | Reports awaiting review
مستحقات على الحالات | Outstanding balances
أحدث الحالات | Recent cases
عرض السجل | View register
مراحل العينات | Specimen workflow
سجل الحالات والعينات | Cases and specimens
بحث | Search
بحث بالاسم أو رقم العينة | Search by patient or specimen ID
كل المراحل | All stages
الحركة | Entry
البيان | Description
الطريقة | Method
المبلغ | Amount
تسجيل مصروف | Record expense
مقبوضات نقدية | Cash receipts
مقبوضات البطاقات | Card receipts
مصروفات نقدية | Cash expenses
صافي نقدية الوردية | Net shift cash
حركة الوردية | Shift activity
تقفيل الوردية | Close shift
فواتير عليها رصيد | Outstanding invoices
الورديات المقفلة | Closed shifts
الوردية | Shift
الصافي المتوقع | Expected cash
النقدية المعدودة | Counted cash
الفرق | Difference
ملف العينة | Specimen record
قيمة الفاتورة | Invoice total
إجمالي المدفوع | Total paid
الرصيد المستحق | Outstanding balance
تحصيل دفعة | Collect payment
نقل إلى | Move to
الدفعات المسجلة | Payment history
طريقة الدفع | Payment method
استخدم اسمًا افتراضيًا أثناء العرض. | Use a fictional name for this demo.
اسم الحالة | Patient name
جهة الإحالة | Referral source
الفحص المطلوب | Requested test
قيمة الفاتورة التجريبية بالجنيه | Demo invoice total (EGP)
المدفوع عند التسجيل بالجنيه | Paid at registration (EGP)
حفظ الحالة والفاتورة | Save case and invoice
راجع الاسم والمبلغ المدفوع | Check the name and payment amount
تم تسجيل الحالة | Case registered
المستحق | Amount due
قيمة الدفعة بالجنيه | Payment amount (EGP)
تسجيل الدفعة | Record payment
راجع قيمة الدفعة | Check the payment amount
تم تسجيل الدفعة | Payment recorded
تسجيل مصروف نقدي | Record cash expense
بيان المصروف | Expense description
المبلغ بالجنيه | Amount (EGP)
حفظ المصروف | Save expense
أدخل البيان ومبلغًا أكبر من صفر | Enter a description and a positive amount
تم تسجيل المصروف | Expense recorded
صافي النقدية المتوقع | Expected net cash
النقدية المعدودة بالجنيه | Counted cash (EGP)
يُحفظ فرق الجرد وتبدأ وردية جديدة برصيد افتتاحي صفر. | The difference is recorded and a new shift opens with a zero cash balance.
تأكيد التقفيل | Confirm close
تم تقفيل الوردية وفتح الوردية التالية | Shift closed and next shift opened
تم تحديث مرحلة العينة | Specimen stage updated
حركات الوردية | Shift entries
النتيجة | Result
تاريخ الاستلام | Received on
تاريخ التسليم | Released on
قيد الإعداد | In preparation
لم يُسلّم بعد | Awaiting release
غير مسجل | Unrecorded
إضافة نتيجة | Add result
تعديل النتيجة | Edit result
ملخص النتيجة | Result summary
حفظ النتيجة | Save result
تم حفظ النتيجة | Result saved
سجّل ملخص النتيجة قبل تجهيز التقرير للتسليم | Enter a result before marking the report ready
تسليم التقرير | Release report
تأكيد التسليم | Confirm release
تم تسليم التقرير | Report released
التقارير والنتائج | Reports & results
تقارير للمراجعة | Awaiting review
تقارير جاهزة | Ready reports
تقارير مسلّمة | Released reports
كل التقارير | All reports
التواريخ والنتيجة | Dates and result
آخر تحديث للنتيجة | Result last updated
تغيرات التهابية مزمنة — مثال تدريبي | Chronic inflammatory changes — demo finding
نسيج حميد — مثال تدريبي | Benign tissue — demo finding
خلايا تفاعلية — مثال تدريبي | Reactive cells — demo finding
مسودة | Draft
ملخص التقرير التجريبي | Demo report summary
تاريخ استلام العينة | Specimen receipt date
الشركاء | Partners
شركاء الإحالة | Referral partners
إضافة شريك | Add partner
اسم الشريك | Partner name
نوع الجهة | Organization type
عيادة | Clinic
مستشفى | Hospital
معمل | Laboratory
جهة الاتصال | Contact person
بيانات التواصل | Contact details
خصم الفحوصات | Test discount
حفظ الشريك | Save partner
تم حفظ الشريك | Partner saved
اسم الشريك مستخدم بالفعل | Partner name already exists
أدخل اسم الشريك | Enter a partner name
شريك الإحالة | Referral partner
بدون شريك | No partner
ربط الحالة بشريك | Assign referral partner
حفظ الربط | Save assignment
تم تحديث الشريك | Partner assignment updated
الشركاء المسجلون | Registered partners
حالات محالة | Referred cases
جاهزة للتسليم | Ready to release
رصيد الحالات المحالة | Referred case balance
حالات الشريك | Partner cases
إجمالي الفواتير | Total invoiced
إجمالي التحصيل | Total collected
المبلغ المتبقي | Balance due
كشف حساب الحالات | Case statement
طباعة الكشف | Print statement
تعديل بيانات الشريك | Edit partner
كل الشركاء | All partners
مركز الأنسجة التجريبي | Demo Tissue Centre
عيادة جناكليس التجريبية | Demo Gianaclis Clinic
مستشفى الإسكندرية التجريبي | Demo Alexandria Hospital
مكتب التحويلات | Referrals desk
منسق العينات | Specimen coordinator
استقبال العيادة | Clinic reception
الخصم المقترح عند التسجيل | Suggested registration discount
بحث عن شريك | Search partners
رقم مرجعي | Reference
تاريخ الكشف | Statement date
بيانات تجريبية | Demo data
حالات مفتوحة | Open cases
عرض ملف الشريك | Open partner profile
جهات الإحالة وحسابات الحالات | Referral network and case balances
`.trim().split('\n').map(line=>line.split(' | ')));
Object.assign(words,{'اسم المعمل':'Lab name','هوية المعمل':'Lab identity','متابعة التشغيل':'Operations','المهام':'Tasks','المحادثات':'Conversations','إعدادات المعمل':'Lab settings'});
const phrases=Object.keys(words).sort((a,b)=>b.length-a.length);
const phrasePattern=new RegExp(phrases.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function translate(s){return lang==='en'?s.replace(phrasePattern,k=>words[k]):s}
function localizeTree(root){
 if(lang!=='en')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 for(let n=walker.nextNode();n;n=walker.nextNode()){
  if(!n.parentElement.closest('[data-literal],script,style'))n.nodeValue=translate(n.nodeValue)
 }
 for(const node of root.querySelectorAll('[aria-label],[placeholder],[alt]')){
  for(const attr of ['aria-label','placeholder','alt'])if(node.hasAttribute(attr))node.setAttribute(attr,translate(node.getAttribute(attr)))
 }
}
