// الترجمة الإنجليزية للواجهة. تُطبَّق على النصوص العربية الظاهرة عند اختيار English.
// ما لم يُترجم بعد (مثل نصائح العادات ودروس المنهج) يبقى بالعربية.
let LANG = (() => { try { return localStorage.getItem('masar.lang') || 'ar'; } catch { return 'ar'; } })();
const EN = {
  'اليوم': 'Today', 'الدروس': 'Lessons', 'الخطة': 'Plan', 'المزيد': 'More', 'المشاريع': 'Projects', 'الروتين الأسبوعي': 'Weekly routine',
  'الآن': 'Now', 'التالي': 'Next', 'السابق': 'Previous', 'الآن والتالي': 'Now & next', 'تبقى': 'left', 'بعد': 'in', 'تم': 'Done', 'تمّت': 'Done', 'انتهت': 'Ended',
  'الأحد': 'Sunday', 'الإثنين': 'Monday', 'الثلاثاء': 'Tuesday', 'الأربعاء': 'Wednesday', 'الخميس': 'Thursday', 'الجمعة': 'Friday', 'السبت': 'Saturday',
  'أحد': 'Sun', 'إثنين': 'Mon', 'ثلاثاء': 'Tue', 'أربعاء': 'Wed', 'خميس': 'Thu', 'جمعة': 'Fri', 'سبت': 'Sat',
  'الصباح': 'Morning', 'بعد الظهر': 'Afternoon', 'المساء': 'Evening', 'الليل': 'Night', 'منتهية': 'Finished',
  'فات وقتها': 'Overdue', 'هل فعلتها؟ أكّد ليصحّ حساب يومك.': 'Did you do them? Confirm so your day is counted correctly.',
  'تخطّاها': 'Skipped', 'أجّلها': 'Postpone', 'أجّلتها': 'Postponed', 'لم أفعلها': 'Not done', 'تخطّ': 'Skip', 'ابدأ الآن': 'Start now', 'ابدأ': 'Start',
  'مخطط': 'Planned', 'أنجزت': 'Done', 'ركّزت': 'Focused', 'عرض الجدول': 'Table view', 'الخط الزمني': 'Timeline', 'لا مهام في هذا اليوم': 'No tasks today',
  'تركيز': 'Focus', 'بدأ التركيز، ضع هاتفك جانباً': 'Focus started. Put your phone away.', 'لديك جلسة تركيز جارية': 'You already have a focus session',
  'يوم سابق': 'Past day', 'يوم قادم': 'Upcoming day', 'تلقائي': 'Auto', 'جُدول تلقائياً': 'Auto-scheduled', 'مقترح تلقائياً': 'Suggested',
  'تتداخل مع ما قبلها': 'Overlaps previous', 'لم يحن وقتها بعد': 'Not time yet', 'مستثناة': 'excluded',
  'أهم مهام اليوم': 'Top tasks today', 'أهداف الصحة اليومية': 'Daily health goals', 'عادتي': 'My habits', 'اختر عادة تريد تركها أو بناءها': 'Pick a habit to quit or build',
  'مقفل · افتحه بـ Face ID': 'Locked · open with Face ID', 'مقفل': 'Locked',
  'احفظ نسخة احتياطية أو فعّل المزامنة من «الإعدادات» حتى لا تضيع بياناتك': 'Save a backup or enable sync in Settings so you don\'t lose your data',
  'بطاقة للمراجعة اليوم': 'cards to review today', 'لديك': 'You have', 'بطاقات المراجعة': 'Review cards', 'أظهر الجواب': 'Show answer', 'عرفتها': 'Got it', 'لم أعرفها': 'Missed it', 'أنهيت بطاقات اليوم': 'Done with today\'s cards', 'متبقية اليوم': 'left today',
  // الإعداد
  'أهلاً بك في': 'Welcome to', 'أخبرنا عن يومك، وأضف ما يناسبك. كل شيء قابل للتعديل لاحقاً.': 'Tell us about your day and add what suits you. Everything can be changed later.',
  'أستيقظ': 'I wake up', 'أنام': 'I sleep', 'أضف حزماً جاهزة (اختياري)': 'Add ready-made packs (optional)', 'موادك الدراسية، كل مادة في سطر (اختياري)': 'Your study subjects, one per line (optional)',
  'تخطّي وابدأ فارغاً': 'Skip and start empty', 'مضافة': 'Added', 'تم الإعداد، عدّل أي شيء من «الخطة» و«الإعدادات»': 'All set. Edit anything from Plan and Settings.',
  'الصلوات وورد القرآن': 'Prayers & Quran', 'خمس صلوات وورد يومي، عدّل أوقاتها حسب مدينتك': 'Five prayers and a daily reading; adjust times for your city',
  'الصحة والرياضة': 'Health & fitness', 'تمارين منزلية متوسطة وأهداف يومية وسجل نوم': 'Home workouts, daily goals and a sleep log',
  'الرياضيات من الصفر': 'Math from scratch', 'الإنجليزية (A2 إلى B2)': 'English (A2 to B2)', 'الفرنسية للمبتدئين': 'French for beginners', 'الفيزياء من الصفر': 'Physics from scratch',
  '20 درساً مرتبة باختبارات، وخطة بالأشهر': '20 ordered lessons with quizzes, and a monthly plan', '16 درساً باختبارات، وخطة بالأشهر': '16 lessons with quizzes, and a monthly plan', 'خطة بأهداف كبرى وخطوات، دون دروس': 'A plan with big goals and steps, no lessons',
  'الحزم الجاهزة': 'Ready-made packs', 'فتح الإعداد والحزم': 'Open setup & packs', 'أضف روتيناً أو مادة جاهزة (مناهج واختبارات) إلى حسابك متى شئت.': 'Add a ready routine or subject (curricula and quizzes) any time.',
  // إعدادات
  'الإعدادات': 'Settings', 'اسمك': 'Your name', 'اسم التطبيق': 'App name', 'المظهر': 'Theme', 'حسب الهاتف': 'Auto', 'فاتح': 'Light', 'ليلي': 'Dark', 'العملة': 'Currency', 'اللغة': 'Language',
  'يبدأ اليوم الجديد عند الساعة': 'New day starts at', 'أقصى وقت للجدولة التلقائية يومياً': 'Max auto-scheduled time per day', 'الجدولة التلقائية من': 'Auto-schedule from', 'إلى': 'to',
  'قفل قسم «عادتي» بـ Face ID': 'Lock "My habits" with Face ID', 'حفظ': 'Save', 'وقت مراجعة المساء': 'Evening review time', 'حُفظت الإعدادات': 'Settings saved',
  'الأمان والبيانات': 'Security & data', 'قفل بـ Face ID': 'Face ID lock', 'تغيير كلمة السر': 'Change password', 'تصدير نسخة احتياطية مشفّرة': 'Export encrypted backup', 'استيراد نسخة احتياطية': 'Import backup',
  'تصدير التذكيرات إلى التقويم': 'Export reminders to calendar', 'تسجيل الخروج': 'Log out', 'حذف كل بيانات الحساب من الجهاز': 'Delete all account data from this device',
  'يُطلب عند فتح التطبيق وبعد دقيقة من تركه.': 'Asked on opening the app and after a minute away.',
  // المزيد
  'الأدوات': 'Tools', 'المكتبة': 'Library', 'الإحصائيات': 'Stats', 'الصحة': 'Health', 'المراجعة': 'Review', 'حسابي': 'My account', 'النسخة': 'Version', 'تُحفظ محلياً': 'Saved locally',
  'متزامن مع السحابة': 'Synced to cloud', 'جارٍ المزامنة': 'Syncing',
  // الخطة
  'أضف إلى الروتين': 'Add to routine', 'دراسة': 'Study', 'لا مشاريع بعد. اضغط + لإنشاء مشروعك الأول.': 'No projects yet. Tap + to create your first.',
  'إضافة': 'Add', 'أضف': 'Add', 'حفظ': 'Save', 'حذف': 'Delete', 'إلغاء': 'Cancel', 'تعديل': 'Edit', 'رجوع': 'Back', 'إغلاق': 'Close', 'فتح': 'Open', 'اختر': 'Choose', 'تأكيد': 'Confirm',
  'اسم المهمة': 'Task name', 'من': 'From', 'الأيام': 'Days', 'الأولوية': 'Priority', 'الاسم': 'Name', 'الوصف': 'Description', 'التاريخ': 'Date', 'المدة': 'Duration',
  'تعديل المهمة': 'Edit task', 'مهمة جديدة': 'New task', 'مهمة مرنة': 'Flexible task', 'مهام مرنة': 'Flexible tasks', 'مهمة بوقت محدد': 'Timed task', 'مرنة': 'Flexible',
  // الدروس
  'الكل': 'All', 'المواد الجامعية': 'University subjects', 'الرياضيات': 'Math', 'الإنجليزية': 'English', 'الفرنسية': 'French', 'الفيزياء': 'Physics',
  'درسك التالي': 'Your next lesson', 'مراجعة اليوم': 'Today\'s review', 'تابع من حيث توقفت': 'Continue where you left off', 'اختبار': 'Quiz', 'ابدأ الاختبار': 'Start quiz',
  'تحقق من إجاباتي': 'Check my answers', 'أحسنت، نجحت': 'Well done, you passed', 'لم تجتز بعد': 'Not passed yet', 'أعد الاختبار': 'Retake quiz', 'الدرس التالي': 'Next lesson',
  'السؤال': 'Question', 'ملاحظاتي': 'My notes', 'ملاحظاتي على الدرس': 'My lesson notes', 'شاهد الدرس': 'Watch lesson', 'افتح الدرس في يوتيوب': 'Open lesson on YouTube',
  'الخطة والمراجع والمزيد': 'Plan, references & more', 'أهداف كبرى': 'Big goals', 'خطوة': 'step', 'أهداف': 'goals', 'هدف كبير جديد': 'New big goal', 'أضف هدفاً كبيراً': 'Add a big goal',
  'مادة جامعية جديدة': 'New university subject', 'أضف مادة جامعية': 'Add a university subject', 'اسم المادة': 'Subject name', 'روابط': 'Links', 'ملفات': 'Files', 'دروس مكتوبة': 'Written lessons',
  'المراجع': 'References', 'الروابط والكتب': 'Links & books', 'كتاب مجاني': 'Free book', 'فيديو': 'Video', 'رابط': 'Link',
  // المشاريع
  'مشروع جديد': 'New project', 'إنشاء المشروع': 'Create project', 'اسم المشروع': 'Project name', 'الأهداف': 'Goals', 'المال': 'Money', 'ملاحظات': 'Notes', 'الموعد النهائي': 'Deadline', 'التمارين': 'Workouts', 'الوجبات': 'Meals', 'النوم': 'Sleep',
  'الخطط والمراحل': 'Plans & milestones', 'الصافي': 'Net', 'الإيرادات': 'Revenue', 'التكاليف': 'Costs', 'الأرباح': 'Profit',
  // عادات
  'اختر عاداتك': 'Choose your habits', 'اختر واحدة أو أكثر، أو اكتب عادتك بنفسك.': 'Pick one or more, or type your own.', 'عادات أريد تركها': 'Habits I want to quit', 'عادات أريد بناءها': 'Habits I want to build',
  'عادة أخرى (اكتب اسمها)': 'Other habit (type its name)', 'النوع': 'Type', 'أريد تركها': 'Quit it', 'أريد بناءها': 'Build it', 'ابدأ بعادة واحدة': 'Start with one habit', 'اختيار عادة': 'Choose a habit',
  'اختر عادة تريد تركها أو عادة تريد بناءها، ويُرتَّب لك كل شيء حولها.': 'Pick a habit to quit or build, and everything is organized around it.',
  '+ عادة': '+ Habit', 'أشعر برغبة': 'I feel an urge', 'أفضل سلسلة': 'Best streak', 'رغبات هذا الأسبوع': 'Urges this week', 'تجاوزتها': 'Resisted', 'منذ': 'Since', 'المراحل': 'Milestones', 'خطتي': 'My plan',
  'سجل الانتكاسات': 'Relapse log', 'سجّلت انتكاسة': 'I relapsed', 'إدارة هذه العادة': 'Manage this habit', 'إدارة العادة': 'Manage habit', 'يوم نظيف': 'clean day', 'أيام نظيفة': 'clean days',
  'الهدف التالي': 'Next goal', 'يوماً': 'days', 'يوم': 'day', 'أنجزتها اليوم': 'Done today', 'أنجزتها اليوم (اضغط للتراجع)': 'Done today (tap to undo)', 'إجمالي الأيام': 'Total days', 'آخر 14 يوماً': 'Last 14 days',
  'يوم متتالٍ': 'day streak', 'أيام متتالية': 'day streak', 'الهدف 21 يوماً': 'Goal: 21 days', 'لحظة': 'A moment', 'الرغبة موجة تعلو ثم تهبط. انتظر': 'An urge is a wave that rises then falls. Wait', 'دقائق فقط.': 'minutes only.',
  'ما السبب؟': 'What triggered it?', 'مرّت الرغبة': 'It passed', 'انتكست': 'I relapsed', 'تمرين': 'Exercise', 'تحقق': 'Check', 'التدخين': 'Smoking', 'الإفراط في الهاتف ووسائل التواصل': 'Too much phone & social media',
  'السكريات والحلويات': 'Sugar & sweets', 'السهر': 'Staying up late', 'التسويف': 'Procrastination', 'الإفراط في القهوة والشاي': 'Too much coffee & tea', 'الإفراط في الألعاب': 'Too much gaming',
  'المحتوى الإباحي': 'Adult content', 'المشروبات الغازية': 'Soft drinks', 'الإنفاق الزائد': 'Overspending', 'قضم الأظافر': 'Nail biting', 'شرب الماء': 'Drinking water', 'القراءة': 'Reading', 'المشي': 'Walking',
  'الذكر والقرآن': 'Dhikr & Quran', 'النوم المبكر': 'Sleeping early', 'التأمل': 'Meditation', 'ملل': 'Boredom', 'وحدة': 'Loneliness', 'تعب': 'Tiredness', 'توتر': 'Stress', 'الهاتف': 'Phone', 'أخرى': 'Other',
  'ليل وسرير': 'Night in bed', 'بعد الأكل': 'After eating', 'مع القهوة': 'With coffee', 'مع الأصدقاء': 'With friends',
  'تسجيل انتكاسة': 'Log a relapse', 'ما الذي سأغيّره؟': 'What will I change?', 'حفظ وابدأ من جديد': 'Save and start over', 'حذف العادة وسجلّها': 'Delete habit and its log',
  'اختر عادة أو اكتب اسمها': 'Pick a habit or type a name', 'قم من مكانك الآن': 'Get up now', 'اخرج من الغرفة أو افتح الباب': 'Leave the room or open the door', 'اغسل وجهك أو توضأ': 'Wash your face',
  'اشرب كوب ماء بارد': 'Drink a glass of cold water', 'تنفّس بعمق 10 مرات': 'Breathe deeply 10 times', 'امشِ 5 دقائق': 'Walk for 5 minutes', 'حلّ تمرين الرياضيات بالأسفل': 'Solve the math exercise below',
  // إحصائيات
  'متوسط 14 يوماً': '14-day average', 'أيام متتالية ≥80%': 'Days in a row ≥80%', 'متوسط النوم': 'Average sleep', 'تركيز 7 أيام': 'Focus (7 days)', 'أطول سلسلة عادات': 'Longest habit streak',
  'نسبة الإنجاز اليومية': 'Daily completion', 'أسباب عدم الإنجاز': 'Reasons not done', 'لا شيء مسجّل': 'Nothing logged',
  'لماذا لم تُنجزها؟': 'Why not done?', 'نسيت': 'Forgot', 'المهمة صعبة': 'Task too hard', 'وقت غير كافٍ': 'Not enough time', 'مرض أو عذر': 'Illness or excuse', 'سبب آخر': 'Other reason', 'رغبة أو انتكاسة': 'Urge or relapse',
  'تفاصيل (اختياري)': 'Details (optional)', 'ما الذي حدث؟': 'What happened?',
  // مراجعة
  'مراجعة اليوم وتخطيط الغد': 'Review today & plan tomorrow', 'أهم 3 مهام لغدك': 'Top 3 tasks for tomorrow', 'كيف كان يومك؟': 'How was your day?',
  // تسجيل الدخول
  'دخول': 'Log in', 'حساب جديد': 'New account', 'رقم الهاتف': 'Phone number', 'كلمة السر': 'Password', 'تأكيد كلمة السر': 'Confirm password', 'إنشاء الحساب': 'Create account', 'نسيت كلمة السر': 'Forgot password',
  'أنشئ حسابك': 'Create your account', 'أهلاً بعودتك': 'Welcome back', 'رمز الاسترجاع': 'Recovery code', 'إظهار كلمة السر': 'Show password', 'استرجاع الحساب': 'Recover account', 'مرحباً': 'Welcome',
  'حفظته، ادخل': 'I saved it, enter', 'كلمة السر الحالية': 'Current password', 'كلمة سر جديدة': 'New password',
  'إن نسيت كلمة السر فهذا الرمز هو الطريقة الوحيدة لاسترجاع بياناتك. التقط له صورة أو اكتبه في مكان آمن.': 'If you forget your password, this code is the only way to recover your data. Take a photo or write it somewhere safe.',
  // عامة
  'لا شيء هنا بعد': 'Nothing here yet', 'اكتب': 'Write', 'وصف قصير': 'Short description', 'اللون': 'Color', 'الرمز': 'Symbol', 'اليوم:': 'Today:', 'الموعد': 'Due date', 'آخر موعد': 'Due', 'أيام': 'days', 'ساعة': 'hour', 'دقيقة': 'minute', 'دقائق': 'minutes',
  'صلاة الفجر': 'Fajr prayer', 'ورد القرآن': 'Quran reading', 'صلاة الظهر': 'Dhuhr prayer', 'صلاة العصر': 'Asr prayer', 'صلاة المغرب': 'Maghrib prayer', 'صلاة العشاء': 'Isha prayer', 'الرياضة': 'Workout',
  'أحسنت': 'Well done', 'ممتاز': 'Excellent', 'سُجّل': 'Saved', 'اختيار': 'Choice', 'تعب': 'Tiredness', 'أوقية': 'MRU', 'نعم، أنهيتها': 'Yes, I finished it', 'هل أنهيت': 'Did you finish', 'متأخر': 'Late', 'مؤجّلة': 'Postponed',
  'مناسب للسهر': 'good for night owls', 'أنشئ': 'Create', 'عام': 'General', 'تم': 'Done',
  'خطوتك التالية': 'Your next step', 'التالي:': 'Next:', 'الدرس التالي:': 'Next lesson:', 'جدولة': 'Schedule', 'الجدولة الذكية': 'Smart scheduling', 'لاحقاً': 'Later', 'اليوم كامل': 'All day',
  'نُقلت': 'Moved', 'نُقلت إلى': 'Moved to', 'نُقلت إلى وقت لاحق': 'Moved to a later time', 'لا فراغ كافٍ اليوم، تخطّاها أو أكّدها': 'No free time left today: skip or confirm it',
  'أُعيدت جدولة باقي اليوم': 'Rest of the day rescheduled', 'أعد جدولة باقي اليوم': 'Reschedule rest of day', 'أكّد ما بقي': 'Confirm the rest'
};
let _enRe; function _enBuild() { const _enKeys = Object.keys(EN).sort((a, b) => b.length - a.length);
_enRe = new RegExp('(?<![\\u0600-\\u06FF])(' + _enKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\u0600-\\u06FF])', 'g'); }
_enBuild();
const _ar = /[؀-ۿ]/;
const _RULES = [
  [/(\d+) من (\d+)/g, '$1 of $2'],
  [/ما قيمة الرقم (\d+) في العدد (\d+)؟/g, 'What is the value of the digit $1 in $2?'],
  [/ثمن (\d+) كتب هو (\d+) أوقية\. كم ثمن (\d+) كتب؟/g, '$1 books cost $2 MRU. How much do $3 books cost?'],
  [/ما هو (\d+)% من (\d+)؟/g, 'What is $1% of $2?'],
  [/حوّل (\d+) (كم|م|سم|كغ|غ|ساعة|دقيقة) إلى (كم|م|سم|كغ|غ|ساعة|دقيقة):/g, (m, v, a, b) => `Convert ${v} ${_U[a]} to ${_U[b]}:`],
  [/ما قيمة العبارة عندما x = (\d+)؟/g, 'What is the value of the expression when x = $1?'],
  [/مثلث فيه زاويتان (\d+)° و (\d+)°\. كم الزاوية الثالثة؟/g, 'A triangle has angles $1° and $2°. What is the third angle?'],
  [/مستطيل طوله (\d+) وعرضه (\d+)\. ما (مساحته|محيطه)؟/g, (m, l, w, k) => `A rectangle is ${l} long and ${w} wide. What is its ${k === 'مساحته' ? 'area' : 'perimeter'}?`],
  [/مثلث قائم ضلعاه (\d+) و (\d+)\. كم طول الوتر؟/g, 'A right triangle has legs $1 and $2. How long is the hypotenuse?'],
  [/احسب \(دون تبسيط\):/g, 'Calculate (do not simplify):'], [/احسب:/g, 'Calculate:'], [/بسّط الكسر:/g, 'Simplify the fraction:'], [/أوجد x:/g, 'Solve for x:'], [/أي الكسور التالية أكبر قيمة؟/g, 'Which fraction is the largest?']
];
const _U = { 'كم': 'km', 'م': 'm', 'سم': 'cm', 'كغ': 'kg', 'غ': 'g', 'ساعة': 'hours', 'دقيقة': 'minutes' };
function trText(s) { if (!_ar.test(s)) return s; for (const [re, rep] of _RULES) s = s.replace(re, rep); return _ar.test(s) ? s.replace(_enRe, m => EN[m]) : s; }
function trTree(root) {
  if (LANG !== 'en' || !root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; const list = [];
  while ((n = w.nextNode())) if (_ar.test(n.nodeValue)) list.push(n);
  list.forEach(n => { const t = trText(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; });
  if (root.querySelectorAll) root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => ['placeholder', 'aria-label', 'title'].forEach(a => { const v = el.getAttribute(a); if (v && _ar.test(v)) el.setAttribute(a, trText(v)); }));
}
function setLang(l) {
  LANG = l; try { localStorage.setItem('masar.lang', l); } catch {}
  document.documentElement.lang = l; document.documentElement.dir = l === 'en' ? 'ltr' : 'rtl';
}
let _trQ = false;
new MutationObserver(ms => { if (LANG !== 'en' || _trQ) return; _trQ = true; requestAnimationFrame(() => { _trQ = false; document.body && trTree(document.body); }); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
document.addEventListener('DOMContentLoaded', () => { setLang(LANG); trTree(document.body); });
