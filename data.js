'use strict';
/* محتوى مسار: الدروس، التمارين الرياضية، النصائح والتشجيع */

const LESSONS = {
  math: [
    {
      id: 'm1', title: 'الباقي: ما يتبقى بعد التوزيع', mins: 20,
      example: 'عندك <b>17</b> حبة حلوى توزعها على <b>5</b> أكياس بالتساوي. كل كيس يأخذ <b>3</b> حبات (5×3=15)، ويتبقى <b>2</b>.<br>نكتب ذلك: <b dir="ltr">17 = 5×3 + 2</b>',
      idea: 'كل قسمة لها <b>ناتج</b> و<b>باقٍ</b>: العدد = المقسوم عليه × الناتج + الباقي.<br>والباقي دائماً <b>أصغر</b> من المقسوم عليه. فالباقي من القسمة على 7 يكون من 0 إلى 6 فقط، ولهذا تتكرر أيام الأسبوع كل 7 أيام.',
      ex: [
        { t: 'num', q: 'ما الباقي من قسمة 23 على 4؟', a: ['3'], h: '4×5=20، فكم يتبقى من 23؟' },
        { t: 'num', q: 'ما الباقي من قسمة 50 على 7؟', a: ['1'], h: '7×7=49' },
        { t: 'num', q: 'ما الباقي من قسمة 100 على 9؟', a: ['1'], h: '9×11=99' },
        { t: 'choice', q: 'اليوم الثلاثاء. ما اليوم بعد 10 أيام؟', o: ['الخميس', 'الجمعة', 'السبت', 'الثلاثاء'], a: 1, h: 'الباقي من 10 على 7 هو 3، فتقدّم 3 أيام' },
        { t: 'num', q: 'ما الباقي من قسمة 38 على 6؟', a: ['2'], h: '6×6=36' }
      ]
    },
    {
      id: 'm2', title: 'الزوجي والفردي', mins: 15,
      example: 'وزّع <b>8</b> أقلام على شخصين: كل واحد 4 ولا يبقى شيء، فالعدد <b>زوجي</b>.<br>وزّع <b>7</b>: كل واحد 3 ويبقى قلم، فالعدد <b>فردي</b>.',
      idea: 'العدد <b>زوجي</b> إن كان الباقي من قسمته على 2 صفراً، و<b>فردي</b> إن كان الباقي 1.<br>ولمعرفة ذلك في الأعداد الكبيرة يكفي النظر إلى <b>آخر رقم</b>: 0، 2، 4، 6، 8 تعني زوجياً.',
      ex: [
        { t: 'choice', q: 'هل 7,358 زوجي أم فردي؟', o: ['زوجي', 'فردي'], a: 0, h: 'انظر إلى آخر رقم' },
        { t: 'choice', q: 'فردي + فردي = ؟', o: ['زوجي', 'فردي'], a: 0, h: 'جرّب 3+5' },
        { t: 'choice', q: '3 × 5 زوجي أم فردي؟', o: ['زوجي', 'فردي'], a: 1 },
        { t: 'choice', q: 'هل 1,000,001 زوجي أم فردي؟', o: ['زوجي', 'فردي'], a: 1 },
        { t: 'choice', q: 'عدد زوجي × أي عدد = ؟', o: ['دائماً زوجي', 'دائماً فردي', 'يتغير'], a: 0, h: 'جرّب 2×3 و2×4' }
      ]
    },
    {
      id: 'm3', title: 'الأعداد الأولية', mins: 20,
      example: 'العدد <b>12</b> يمكن ترتيبه مستطيلاً بأشكال كثيرة: 2×6، 3×4.<br>أما <b>7</b> فلا يُرتب إلا صفاً واحداً 1×7. نسمي مثل 7 عدداً <b>أولياً</b>.',
      idea: 'العدد الأولي أكبر من 1، ولا يقبل القسمة إلا على 1 وعلى نفسه.<br>أولها: 2، 3، 5، 7، 11، 13، 17، 19، 23، 29، 31.<br>للاختبار: جرّب القسمة على 2، 3، 5، 7… حتى يصبح مربع المقسوم عليه أكبر من العدد.',
      ex: [
        { t: 'choice', q: 'هل 21 عدد أولي؟', o: ['نعم', 'لا'], a: 1, h: 'جرّب القسمة على 3' },
        { t: 'choice', q: 'هل 29 عدد أولي؟', o: ['نعم', 'لا'], a: 0 },
        { t: 'choice', q: 'هل 51 عدد أولي؟', o: ['نعم', 'لا'], a: 1, h: '5+1=6، والعدد يقبل القسمة على 3' },
        { t: 'choice', q: 'هل 2 عدد أولي؟', o: ['نعم', 'لا'], a: 0, h: 'يقبل القسمة على 1 وعلى نفسه فقط' },
        { t: 'num', q: 'ما أصغر عدد أولي أكبر من 30؟', a: ['31'] }
      ]
    },
    {
      id: 'm4', title: 'التحليل إلى عوامل أولية', mins: 25,
      example: 'نفكك <b>12</b> كما نفكك قطعة ليغو إلى أصغر قطعها:<br><b dir="ltr">12 = 2 × 6 = 2 × 2 × 3</b><br>ولا يمكن تفكيك 2 و3 أكثر لأنهما أوليان.',
      idea: 'كل عدد أكبر من 1 يُكتب بطريقة واحدة فقط كحاصل ضرب أعداد أولية (بغض النظر عن الترتيب).<br>والعدد الأولي يمكن أن يتكرر، مثل 2×2×3.<br>اكتب الجواب هكذا: <b dir="ltr">2×2×3</b>',
      ex: [
        { t: 'factors', q: 'حلّل 18', a: [2, 3, 3] },
        { t: 'factors', q: 'حلّل 36', a: [2, 2, 3, 3] },
        { t: 'factors', q: 'حلّل 45', a: [3, 3, 5] },
        { t: 'factors', q: 'حلّل 100', a: [2, 2, 5, 5] },
        { t: 'factors', q: 'حلّل 84', a: [2, 2, 3, 7] }
      ]
    },
    {
      id: 'm5', title: 'الضرب الذهني بالتفكيك', mins: 25,
      example: 'كيف نحسب <b dir="ltr">45 × 58</b> في الذهن؟<br>58 قريبة من 60: <b dir="ltr">45×60 = 2700</b>، ثم نطرح <b dir="ltr">45×2 = 90</b><br>النتيجة: <b dir="ltr">2700 − 90 = 2610</b>',
      idea: 'نفكك أحد العددين إلى أجزاء سهلة (عشرات وآحاد، أو عدد قريب ناقص فرق)، ونضرب كل جزء ثم نجمع.<br><b dir="ltr">a×(b+c) = a×b + a×c</b><br>اختر التفكيك الذي يقلل ما تحفظه في رأسك.',
      ex: [
        { t: 'num', q: '25 × 12 = ؟', a: ['300'], h: '25×4=100' },
        { t: 'num', q: '14 × 15 = ؟', a: ['210'], h: '14×10 + 14×5' },
        { t: 'num', q: '49 × 6 = ؟', a: ['294'], h: '50×6 − 6' },
        { t: 'num', q: '99 × 7 = ؟', a: ['693'], h: '100×7 − 7' },
        { t: 'num', q: '63 × 14 = ؟', a: ['882'], h: '63×10 + 63×4' }
      ]
    }
  ],
  physics: [
    {
      id: 'p1', title: 'السرعة', mins: 15,
      example: 'تمشي <b>100</b> متر في <b>20</b> ثانية. كل ثانية تقطع 100÷20 = <b>5</b> أمتار.',
      idea: '<b dir="ltr">السرعة = المسافة ÷ الزمن</b><br>وحدتها متر في الثانية (م/ث) أو كيلومتر في الساعة (كم/س).',
      ex: [
        { t: 'num', q: 'سيارة قطعت 120 كم في ساعتين. ما سرعتها بالكم/س؟', a: ['60'] },
        { t: 'num', q: 'عدّاء قطع 400 م في 80 ثانية. ما سرعته بالم/ث؟', a: ['5'] },
        { t: 'num', q: 'بسرعة 50 كم/س، كم كيلومتراً تقطع في 3 ساعات؟', a: ['150'], h: 'المسافة = السرعة × الزمن' }
      ]
    },
    {
      id: 'p2', title: 'القوة والكتلة والتسارع', mins: 20,
      example: 'دفع عربة فارغة أسهل من دفع عربة ممتلئة لتصل إلى نفس السرعة. الكتلة الأكبر تحتاج قوة أكبر.',
      idea: '<b dir="ltr">F = m × a</b>: القوة (نيوتن) = الكتلة (كغ) × التسارع (م/ث²).',
      ex: [
        { t: 'num', q: 'كتلة 2 كغ وتسارع 3 م/ث². ما القوة بالنيوتن؟', a: ['6'] },
        { t: 'num', q: 'قوة 20 نيوتن على كتلة 4 كغ. ما التسارع؟', a: ['5'] },
        { t: 'num', q: 'قوة 30 نيوتن أعطت تسارع 6. ما الكتلة؟', a: ['5'] }
      ]
    }
  ],
  english: [
    {
      id: 'e1', title: 'التحية والتعارف', mins: 15,
      example: '<b dir="ltr">Hello, I am Ahmed.</b> — مرحباً، أنا أحمد.<br><b dir="ltr">Good morning!</b> — صباح الخير!<br><b dir="ltr">Nice to meet you.</b> — سعدت بلقائك.',
      idea: 'جمل التحية قصيرة ومتكررة، فاحفظها كاملة لا كلمة كلمة، وردّدها بصوت مسموع.',
      ex: [
        { t: 'choice', q: 'Good morning تعني:', o: ['مساء الخير', 'صباح الخير', 'تصبح على خير'], a: 1 },
        { t: 'choice', q: 'كيف تقول «سعدت بلقائك»؟', o: ['See you later', 'Nice to meet you', 'Thank you'], a: 1 },
        { t: 'choice', q: 'Good night تقال:', o: ['عند اللقاء صباحاً', 'قبل النوم أو عند الوداع ليلاً', 'عند الأكل'], a: 1 },
        { t: 'choice', q: 'أكمل: ___ name is Sara.', o: ['I', 'My', 'Me'], a: 1 }
      ]
    },
    {
      id: 'e2', title: 'الضمائر', mins: 15,
      example: '<b dir="ltr">I</b> أنا · <b dir="ltr">you</b> أنت · <b dir="ltr">he</b> هو · <b dir="ltr">she</b> هي · <b dir="ltr">we</b> نحن · <b dir="ltr">they</b> هم',
      idea: 'مع الضمائر يتغير الفعل: <b dir="ltr">I am</b> · <b dir="ltr">you are</b> · <b dir="ltr">he/she is</b> · <b dir="ltr">we/they are</b>',
      ex: [
        { t: 'choice', q: 'She ___ a student.', o: ['am', 'is', 'are'], a: 1 },
        { t: 'choice', q: 'They ___ at home.', o: ['is', 'am', 'are'], a: 2 },
        { t: 'choice', q: '«نحن» بالإنجليزية:', o: ['they', 'we', 'you'], a: 1 },
        { t: 'choice', q: 'I ___ tired.', o: ['am', 'is', 'are'], a: 0 }
      ]
    }
  ]
};

/* تمارين منزلية، مستوى متوسط */
const EXERCISES = {
  pushup: { n: 'ضغط عادي', sets: 4, reps: [8, 15], rest: 90, m: 'الصدر والكتف والترايسبس', steps: ['اليدان أوسع قليلاً من الكتفين', 'الجسم خط مستقيم من الرأس إلى الكعبين', 'انزل حتى يقترب صدرك من الأرض ثم ادفع'], err: ['هبوط الحوض أو ارتفاعه', 'فتح المرفقين للجانبين؛ اجعلهما بزاوية 45° تقريباً'], easy: 'ضغط على طاولة أو على الركبتين', hard: 'ضغط مرتفع القدمين' },
  row: { n: 'تجديف تحت طاولة متينة', sets: 4, reps: [8, 12], rest: 90, m: 'الظهر والبايسبس', steps: ['استلقِ تحت طاولة ثابتة وأمسك حافتها', 'شدّ جسمك مستقيماً واسحب صدرك نحو الحافة', 'انزل ببطء'], err: ['سحب الرقبة إلى الأمام', 'ترك الحوض يتدلى'], easy: 'اثنِ الركبتين', hard: 'ارفع القدمين على كرسي' },
  pike: { n: 'ضغط الكتف (Pike)', sets: 3, reps: [6, 12], rest: 90, m: 'الكتفان والترايسبس', steps: ['ارفع الحوض لتصنع شكل حرف V مقلوب', 'انزل برأسك نحو الأرض بين يديك', 'ادفع للأعلى'], err: ['تحويله إلى ضغط عادي بخفض الحوض'], easy: 'قرّب القدمين من اليدين', hard: 'ضع القدمين على كرسي' },
  dips: { n: 'غطس على كرسي', sets: 3, reps: [8, 15], rest: 75, m: 'الترايسبس والصدر', steps: ['ظهرك للكرسي واليدان على حافته', 'انزل حتى يصبح المرفق بزاوية 90°', 'ادفع للأعلى'], err: ['النزول أعمق من اللازم فيُجهد الكتف'], easy: 'اثنِ الركبتين أكثر', hard: 'مدّ الساقين أو ارفعهما' },
  plank: { n: 'بلانك', sets: 3, reps: [30, 60], unit: 'ث', rest: 60, m: 'الجذع', steps: ['المرفقان تحت الكتفين', 'شدّ البطن والأرداف', 'جسم مستقيم وتنفس بهدوء'], err: ['هبوط أسفل الظهر'], easy: 'على الركبتين', hard: 'ارفع ساقاً بالتناوب' },
  squat: { n: 'قرفصاء', sets: 4, reps: [15, 25], rest: 75, m: 'الفخذان والأرداف', steps: ['القدمان بعرض الكتفين', 'ادفع الحوض للخلف وانزل كأنك تجلس', 'الكعبان على الأرض ثم اصعد'], err: ['انحناء الركبتين للداخل', 'رفع الكعبين'], easy: 'اجلس على كرسي وقم', hard: 'قرفصاء بطيئة 3 ثوانٍ نزولاً أو قفز' },
  lunge: { n: 'اندفاع خلفي', sets: 3, reps: [10, 15], rest: 75, m: 'الفخذان والأرداف', perSide: true, steps: ['خطوة واسعة للخلف', 'انزل حتى تقترب الركبة الخلفية من الأرض', 'ادفع بالقدم الأمامية للعودة'], err: ['تقدم الركبة الأمامية كثيراً'], easy: 'أمسك جداراً للتوازن', hard: 'أمسك وزناً أو حقيبة' },
  bridge: { n: 'جسر الأرداف', sets: 3, reps: [12, 20], rest: 60, m: 'الأرداف وأسفل الظهر', steps: ['استلقِ والركبتان مثنيتان', 'ارفع الحوض حتى يستقيم الجسم من الكتف للركبة', 'اثبت ثانية ثم انزل'], err: ['تقوس أسفل الظهر بدل شدّ الأرداف'], easy: 'مدى أقصر', hard: 'جسر على ساق واحدة' },
  calf: { n: 'رفع السمانة على درجة', sets: 3, reps: [15, 25], rest: 45, m: 'السمانة', steps: ['قف بمقدمة القدمين على درجة', 'ارتفع لأعلى نقطة', 'انزل ببطء تحت مستوى الدرجة'], err: ['الحركة السريعة المرتدة'], easy: 'على الأرض المستوية', hard: 'على قدم واحدة' },
  sideplank: { n: 'بلانك جانبي', sets: 3, reps: [20, 40], unit: 'ث', rest: 45, perSide: true, m: 'الجذع الجانبي', steps: ['على المرفق والجنب', 'ارفع الحوض ليستقيم الجسم'], err: ['هبوط الحوض'], easy: 'على الركبة', hard: 'ارفع الساق العليا' },
  diamond: { n: 'ضغط ماسي', sets: 3, reps: [6, 12], rest: 90, m: 'الترايسبس والصدر', steps: ['اليدان متقاربتان تحت الصدر بشكل معيّن', 'المرفقان قريبان من الجسم', 'انزل وادفع'], err: ['فتح المرفقين'], easy: 'على الركبتين', hard: 'إبطاء النزول 3 ثوانٍ' },
  decline: { n: 'ضغط مرتفع القدمين', sets: 3, reps: [8, 12], rest: 90, m: 'أعلى الصدر والكتف', steps: ['القدمان على كرسي واليدان على الأرض', 'جسم مستقيم', 'انزل وادفع'], err: ['هبوط الحوض'], easy: 'ضغط عادي', hard: 'كرسي أعلى' },
  pullup: { n: 'عقلة (أو تجديف تحت الطاولة)', sets: 4, reps: [4, 10], rest: 120, m: 'الظهر والبايسبس', steps: ['تعلق بقبضة أوسع من الكتفين', 'اسحب حتى يتجاوز الذقن العارضة', 'انزل ببطء حتى تستقيم الذراعان'], err: ['الأرجحة', 'نصف المدى'], easy: 'نزول بطيء فقط أو تجديف تحت الطاولة', hard: 'إيقاف ثانيتين في الأعلى' },
  superman: { n: 'سوبرمان', sets: 3, reps: [12, 15], rest: 45, m: 'أسفل الظهر', steps: ['انبطح على بطنك', 'ارفع الذراعين والساقين معاً قليلاً', 'اثبت ثانيتين ثم انزل'], err: ['رفع الرأس بقوة'], easy: 'ارفع الذراعين فقط', hard: 'ثبات أطول' },
  split: { n: 'قرفصاء بلغارية', sets: 3, reps: [8, 12], rest: 90, perSide: true, m: 'الفخذان والأرداف', steps: ['القدم الخلفية على كرسي', 'انزل عمودياً بالقدم الأمامية', 'ادفع للأعلى'], err: ['قدم أمامية قريبة جداً من الكرسي'], easy: 'اندفاع عادي', hard: 'أمسك وزناً' },
  sidelunge: { n: 'اندفاع جانبي', sets: 3, reps: [10, 12], rest: 60, perSide: true, m: 'الفخذ الداخلي والأرداف', steps: ['خطوة واسعة للجانب', 'اثنِ الساق المتحركة والأخرى مستقيمة', 'ادفع للعودة'], err: ['رفع الكعب'], easy: 'مدى أقصر', hard: 'أمسك وزناً' },
  slbridge: { n: 'جسر على ساق واحدة', sets: 3, reps: [10, 15], rest: 60, perSide: true, m: 'الأرداف', steps: ['جسر الأرداف مع رفع ساق واحدة', 'حافظ على استواء الحوض'], err: ['ميل الحوض'], easy: 'جسر بالساقين', hard: 'القدم على كرسي' },
  wallsit: { n: 'جلوس على الحائط', sets: 3, reps: [30, 60], unit: 'ث', rest: 60, m: 'الفخذان', steps: ['الظهر على الحائط', 'انزل حتى يوازي الفخذ الأرض', 'اثبت'], err: ['الركبتان أمام أصابع القدم'], easy: 'زاوية أعلى', hard: 'على ساق واحدة لثوانٍ' },
  hollow: { n: 'تمرين القارب', sets: 3, reps: [20, 40], unit: 'ث', rest: 45, m: 'البطن', steps: ['استلقِ وألصق أسفل الظهر بالأرض', 'ارفع الكتفين والساقين قليلاً', 'اثبت'], err: ['ابتعاد أسفل الظهر عن الأرض'], easy: 'اثنِ الركبتين', hard: 'مدّ الذراعين فوق الرأس' }
};

const WORKOUTS = {
  UA: { n: 'علوي A', ex: ['pushup', 'row', 'pike', 'dips', 'plank'] },
  LA: { n: 'سفلي A', ex: ['squat', 'lunge', 'bridge', 'calf', 'sideplank'] },
  UB: { n: 'علوي B', ex: ['diamond', 'pullup', 'decline', 'superman', 'plank'] },
  LB: { n: 'سفلي B', ex: ['split', 'sidelunge', 'slbridge', 'wallsit', 'hollow'] }
};
/* getDay(): 0 الأحد … 6 السبت */
const WORKOUT_DAYS = { 6: 'UA', 0: 'LA', 2: 'UB', 3: 'LB' };
const WARMUP = 'إحماء 5 دقائق: دوران المفاصل، 30 ثانية جري في المكان، 10 قرفصاء خفيفة، 10 ضغط على الحائط.';
const COOLDOWN = 'إطالة 5 دقائق للعضلات التي تمرّنت، 30 ثانية لكل عضلة، وتنفّس بهدوء.';

const TIPS = [
  'ابدأ بالمهمة الأصعب حين يكون ذهنك صافياً، وغالباً يكون ذلك صباحاً.',
  'جلسة دراسة واحدة بلا هاتف أنفع من ثلاث جلسات مقطّعة.',
  'اترك الهاتف خارج غرفة النوم؛ النوم الجيد هو أساس التركيز.',
  'إن لم تفهم شرحاً، اطلب مثالاً ملموساً، فالأمثلة طريق الفهم لا علامة ضعف.',
  'التكرار المتباعد يثبّت المعلومة أكثر من المذاكرة الطويلة مرة واحدة.',
  'اكتب الحل بيدك ولو كان سهلاً، فالكتابة تكشف ما ظننت أنك فهمته.',
  'خمس دقائق من البدء تكسر مقاومة البداية، فقط ابدأ.',
  'الضوء الطبيعي صباحاً يساعد على ضبط ساعة نومك.',
  'قلّل الكافيين بعد العصر لينام جسمك في موعده.',
  'المشي 10 دقائق يعيد لك التركيز أكثر من تصفح الهاتف.',
  'قسّم المهمة الكبيرة حتى تصبح أول خطوة فيها واضحة وصغيرة.',
  'راجع أخطاءك قبل أن تراجع ما تعرفه.',
  'اشرب الماء؛ العطش الخفيف يُضعف التركيز دون أن تشعر.',
  'لا تقارن نفسك اليوم بأفضل يوم لك، قارنه بالأمس.',
  'الإنجاز اليومي الصغير المستمر يتفوق على الحماس المؤقت.',
  'حين تتعب، الراحة القصيرة المقصودة أفضل من التشتت الطويل.',
  'اسأل نفسك آخر اليوم: ما الذي سهّل يومي؟ وكرّره غداً.',
  'نم واستيقظ في وقت ثابت حتى في الإجازات قدر الإمكان.'
];

const QUIT_TIPS = [
  'الرغبة موجة: تعلو ثم تهبط خلال دقائق إن لم تُطعمها.',
  'الهاتف خارج الغرفة ليلاً يقطع أكثر طرق الانتكاس شيوعاً.',
  'اعرف أوقات ضعفك: الليل، الوحدة، الملل، التعب. وجهّز بديلاً لكل منها.',
  'الانتكاس ليس نهاية الطريق، بل معلومة: متى؟ ولماذا؟ وماذا أغيّر؟',
  'قم من مكانك فور شعورك بالرغبة، فتغيير المكان يغيّر الحالة.',
  'املأ الفراغ بشيء تحبه: مشروع، رياضة، تعلّم.',
  'تجنّب البقاء في السرير مستيقظاً مع الهاتف.',
  'كل يوم نظيف يعيد لدماغك قدرته على التركيز والاستمتاع بالأشياء العادية.'
];

const CHEERS = [
  'أحسنت، خطوة أخرى في الطريق.', 'ممتاز! هكذا يُبنى اليوم.', 'تم، واصل بنفس الهدوء.', 'رائع، الإنجاز الصغير يصنع الفرق.',
  'عمل جميل، استمر.', 'أنجزتها، فخور بثباتك.', 'خطوة واضحة إلى الأمام.', 'جميل! يومك يتشكل كما أردت.',
  'التزام يستحق التقدير.', 'تقدّم حقيقي، أكمل.'
];
const MISS_MSG = [
  'لا بأس، المهم أن نعرف السبب ونسهّل الغد.', 'يوم واحد لا يحدد طريقك، غداً فرصة جديدة.',
  'سجّلنا السبب، وسنعدّل الخطة لتناسبك.', 'لا لوم، فقط ما الذي سيجعلها أسهل غداً؟'
];
const QUIT_MILESTONES = [3, 7, 14, 30, 60, 90];
const MILESTONE_MSG = {
  3: '3 أيام! أصعب البدايات صارت خلفك.', 7: 'أسبوع كامل! هذا ثبات حقيقي.', 14: 'أسبوعان! عاداتك الجديدة تترسخ.',
  30: 'شهر كامل! إنجاز كبير، احمد الله عليه.', 60: 'شهران! أنت شخص مختلف عن البداية.', 90: '90 يوماً! عادة جديدة بُنيت بالكامل.'
};

// خطط المواد الأولية: [هدف كبير، عدد الأشهر من اليوم (0 = بلا موعد)، [الأهداف الصغيرة]]
const PLAN_SEED = {
  math: [
    ['الحساب الأساسي', 2, ['الأعداد الصحيحة وقيمة الخانة', 'الجمع والطرح بسرعة', 'الضرب وجدول الضرب كاملاً', 'القسمة الطويلة', 'الكسور البسيطة', 'العمليات على الكسور', 'اختبار ذاتي في الحساب الأساسي']],
    ['سرعة الحساب الذهني', 2, ['جدول الضرب بسرعة (10 ثوانٍ للسؤال)', 'جمع عددين من رقمين ذهنياً', 'طرح عددين من رقمين ذهنياً', 'الضرب في 10 و100 و5 و11 ذهنياً', 'مربعات الأعداد حتى 20', 'تمرين يومي بمؤقّت 10 دقائق لمدة 14 يوماً']],
    ['النسب والمئويات والوحدات', 3, ['النسبة والتناسب', 'النسبة المئوية', 'تحويل الوحدات', 'مسائل كلامية على النسب']],
    ['الجبر الأول', 4, ['المجهول والمتغير', 'المعادلة من الدرجة الأولى', 'المتباينات البسيطة', 'مسائل كلامية تؤول إلى معادلة']],
    ['الهندسة الأساسية', 5, ['الزوايا والمستقيمات', 'المثلثات', 'المحيط والمساحة', 'فيثاغورس']],
    ['الدوال والمعادلات من الدرجة الثانية', 7, ['مفهوم الدالة والتمثيل البياني', 'الدالة الخطية', 'التحليل إلى عوامل', 'حل المعادلة من الدرجة الثانية']]
  ],
  french: [
    ['النطق والأساس', 1, ['الأبجدية والنطق', 'الأعداد من 0 إلى 100', 'التحيات والتعريف بالنفس', 'أول 100 كلمة']],
    ['أول 300 كلمة', 3, ['الأسرة والأشخاص', 'الطعام والأماكن', 'الأفعال الأكثر استعمالاً', '300 كلمة مراجَعة']],
    ['جمل الحياة اليومية', 5, ['في المتجر والمطعم', 'السؤال عن الاتجاهات', 'الحديث عن اليوم والوقت', 'أن تقدّم نفسك في دقيقة']],
    ['القواعد الأولى والمحادثة البسيطة', 7, ['être وavoir', 'الأفعال المنتهية بـ er', 'النفي والسؤال', 'محادثة قصيرة بالفرنسية']]
  ],
  english: [
    ['تثبيت مستوى B1', 2, ['مراجعة الأزمنة الأساسية', 'تصحيح أخطائك المتكررة', '500 كلمة شائعة', 'قراءة نص B1 بلا ترجمة']],
    ['الاستماع', 3, ['نصف ساعة استماع يومياً لمدة 14 يوماً', 'فهم فيديو قصير دون ترجمة', 'تدوين 10 كلمات جديدة أسبوعياً']],
    ['الكتابة', 3, ['فقرة قصيرة أسبوعياً', 'رسالة رسمية', 'تصحيح كتابتك ومراجعتها']],
    ['مفردات الرياضيات والفيزياء', 4, ['مصطلحات الحساب والجبر', 'مصطلحات الهندسة', 'قراءة درس رياضيات بالإنجليزية']],
    ['اختبار تجريبي B2', 5, ['امتحان استماع', 'امتحان قراءة', 'امتحان كتابة', 'مراجعة نتيجتك']]
  ],
  physics: [
    ['الوحدات والقياس', 0, ['الكميات والوحدات', 'تحويل الوحدات', 'الأرقام المعبّرة']],
    ['الحركة', 0, ['السرعة', 'التسارع', 'الحركة المنتظمة']],
    ['القوى وقوانين نيوتن', 0, ['مفهوم القوة', 'قوانين نيوتن الثلاثة', 'الوزن والاحتكاك']],
    ['الطاقة والشغل', 0, ['الشغل', 'الطاقة الحركية والكامنة', 'حفظ الطاقة']]
  ]
};

// مصادر كل هدف كبير: ت = نوع (v فيديو، b كتاب، s موقع)، روابط البحث تفتح فيديوهات القناة المطلوبة في يوتيوب
const YT = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const CH = {
  bbc: 'https://www.youtube.com/user/bbclearningenglish', lucy: 'https://www.youtube.com/c/EnglishwithLucy',
  mmm: 'https://www.youtube.com/c/mmmEnglish_Emma', oxford: 'https://www.youtube.com/c/Oxfordonlineenglish1',
  alexa: 'https://www.youtube.com/user/ohlalafrench', bc: 'https://learnenglish.britishcouncil.org/', voa: 'https://learningenglish.voanews.com/',
  ox: 'https://openstax.org/details/books/prealgebra-2e', oxm: 'https://openstax.org/subjects/math',
  gen: 'https://www.gutenberg.org/browse/languages/en', gfr: 'https://www.gutenberg.org/browse/languages/fr'
};
const R_ = (k, t, u) => ({ k, t, u });
const PLAN_RES = {
  'الحساب الأساسي': [R_('v', 'خان أكاديمي: الحساب (فيديو)', YT('خان أكاديمي الحساب الأعداد الجمع الطرح الضرب القسمة')), R_('v', 'الأستاذ عبد الباسط: سلسلة أساسيات الرياضيات', YT('الأستاذ عبد الباسط سلسلة أساسيات الرياضيات العمليات على الكسور')), R_('b', 'كتاب Prealgebra المجاني (OpenStax)', CH.ox)],
  'سرعة الحساب الذهني': [R_('v', 'الأستاذ علي بوسيف: الحساب الذهني السريع', YT('الأستاذ علي بوسيف الحساب الذهني fast math')), R_('v', 'طرق حساب ذهني سريعة', YT('الحساب الذهني الضرب السريع طرق'))],
  'النسب والمئويات والوحدات': [R_('v', 'خان أكاديمي: النسبة والتناسب والنسبة المئوية', YT('خان أكاديمي النسبة والتناسب النسبة المئوية')), R_('b', 'كتاب Prealgebra: النسب والمئويات', CH.ox)],
  'الجبر الأول': [R_('v', 'الأستاذ عبد الباسط: المعادلات من الدرجة الأولى', YT('الأستاذ عبد الباسط المعادلات والمتراجحات من الدرجة الأولى')), R_('v', 'خان أكاديمي: مقدمة في الجبر', YT('خان أكاديمي مقدمة في الجبر المتغيرات المعادلات')), R_('b', 'كتب الرياضيات المجانية (OpenStax)', CH.oxm)],
  'الهندسة الأساسية': [R_('v', 'خان أكاديمي: الهندسة الأساسية', YT('خان أكاديمي الهندسة الزوايا المثلثات المساحة')), R_('v', 'نظرية فيثاغورس بالعربية', YT('نظرية فيثاغورس شرح بالعربية'))],
  'الدوال والمعادلات من الدرجة الثانية': [R_('v', 'الدالة الخطية والتمثيل البياني', YT('الدالة الخطية والتمثيل البياني شرح من الصفر')), R_('v', 'حل المعادلة من الدرجة الثانية', YT('حل المعادلات من الدرجة الثانية شرح'))],
  'النطق والأساس': [R_('v', 'قناة Learn French with Alexa', CH.alexa), R_('v', 'الأبجدية والنطق الفرنسي', YT('Learn French with Alexa French alphabet pronunciation beginners')), R_('v', 'الأرقام والتحيات', YT('Learn French with Vincent numbers greetings beginner'))],
  'أول 300 كلمة': [R_('v', 'أكثر الكلمات شيوعاً', YT('Learn French with Alexa most common French words beginners')), R_('v', 'حلقات مرتبة من Coffee Break French', YT('Coffee Break French season 1 lesson 1'))],
  'جمل الحياة اليومية': [R_('v', 'للمبتدئين مع Français avec Pierre', YT('Français avec Pierre beginner French conversation')), R_('v', 'مقابلات في الشارع بترجمة من Easy French', YT('Easy French street interviews beginner'))],
  'القواعد الأولى والمحادثة البسيطة': [R_('v', 'قواعد A1 من Learn French with Vincent', YT('Learn French with Vincent grammar A1 être avoir')), R_('v', 'للمستوى المتوسط لاحقاً من innerFrench', YT('innerFrench podcast intermediate French'))],
  'تثبيت مستوى B1': [R_('v', 'قناة English with Lucy', CH.lucy), R_('v', 'قواعد A2–B2 من engVid', YT('engVid Emma grammar intermediate')), R_('s', 'قراءة واستماع حسب المستوى من British Council', CH.bc)],
  'الاستماع': [R_('v', 'قناة BBC Learning English', CH.bbc), R_('v', 'مقابلات حقيقية بترجمة من Easy English', YT('Easy English street interviews')), R_('s', 'أخبار مبسّطة بصوت من VOA Learning English', CH.voa)],
  'الكتابة': [R_('s', 'مهارات الكتابة من British Council', CH.bc), R_('v', 'الكتابة مع English with Lucy', YT('English with Lucy how to write paragraph'))],
  'مفردات الرياضيات والفيزياء': [R_('v', 'Maths vocabulary in English', YT('maths vocabulary in English fractions algebra geometry')), R_('b', 'كتاب Prealgebra بالإنجليزية', CH.ox)],
  'اختبار تجريبي B2': [R_('v', 'قناة Oxford Online English', CH.oxford), R_('s', 'تدريبات حسب المستوى من British Council', CH.bc), R_('v', 'قناة mmmEnglish', CH.mmm)]
};
// مراجع المادة العامة (قنوات وكتب)
const REF_SEED = {
  math: [R_('b', 'كتاب Prealgebra 2e (مجاني ورسمي، ويمكن تنزيله PDF)', CH.ox), R_('b', 'مكتبة OpenStax للرياضيات', CH.oxm), R_('v', 'خان أكاديمي بالعربية', YT('خان أكاديمي بالعربية الرياضيات')), R_('v', 'الأستاذ علي بوسيف: حساب ذهني', YT('الأستاذ علي بوسيف الحساب الذهني')), R_('v', 'الأستاذ عبد الباسط: أساسيات الرياضيات', YT('الأستاذ عبد الباسط سلسلة أساسيات الرياضيات'))],
  english: [R_('v', 'BBC Learning English', CH.bbc), R_('v', 'English with Lucy', CH.lucy), R_('v', 'mmmEnglish', CH.mmm), R_('v', 'Oxford Online English', CH.oxford), R_('s', 'British Council LearnEnglish', CH.bc), R_('s', 'VOA Learning English', CH.voa), R_('b', 'كتب إنجليزية مجانية (Project Gutenberg)', CH.gen)],
  french: [R_('v', 'Learn French with Alexa', CH.alexa), R_('v', 'Français avec Pierre', YT('Français avec Pierre')), R_('v', 'Learn French with Vincent', YT('Learn French with Vincent')), R_('v', 'Coffee Break French', YT('Coffee Break French')), R_('v', 'Easy French', YT('Easy French')), R_('v', 'innerFrench (متوسط)', YT('innerFrench')), R_('b', 'كتب فرنسية مجانية (Project Gutenberg)', CH.gfr)]
};

// ================= منهج الدروس المرتبة =================
// كل درس: [المعرّف، العنوان، القناة، عبارة البحث في القناة، المرحلة، الاختبار]
// الاختبار: اسم مولّد (رياضيات) أو أسئلة نصها: «السؤال|الصحيح|خطأ1|خطأ2|خطأ3»
const CURR_RAW = {
  math: [
    ['m01', 'الأعداد الصحيحة وقيمة الخانة', 'خان أكاديمي', 'قيمة المنزلة الأعداد الصحيحة', 'الأعداد والعمليات', 'place'],
    ['m02', 'الجمع بسرعة', 'الأستاذ علي بوسيف', 'الجمع الذهني السريع', 'الأعداد والعمليات', 'add'],
    ['m03', 'الطرح', 'خان أكاديمي', 'الطرح مع الاستلاف', 'الأعداد والعمليات', 'sub'],
    ['m04', 'جدول الضرب', 'الأستاذ علي بوسيف', 'جدول الضرب الحساب الذهني', 'الأعداد والعمليات', 'mul'],
    ['m05', 'الضرب في عدد من رقمين', 'خان أكاديمي', 'الضرب في عدد من رقمين', 'الأعداد والعمليات', 'mul2'],
    ['m06', 'القسمة البسيطة', 'خان أكاديمي', 'القسمة البسيطة', 'الأعداد والعمليات', 'div'],
    ['m07', 'القسمة الطويلة', 'خان أكاديمي', 'القسمة الطويلة', 'الأعداد والعمليات', 'div2'],
    ['m08', 'مقارنة الكسور', 'الأستاذ عبد الباسط', 'الكسور مقارنة الكسور', 'الكسور', 'fraccmp'],
    ['m09', 'تبسيط الكسور', 'الأستاذ عبد الباسط', 'تبسيط الكسور', 'الكسور', 'fracsimp'],
    ['m10', 'جمع الكسور', 'الأستاذ عبد الباسط', 'جمع الكسور', 'الكسور', 'fracadd'],
    ['m11', 'ضرب الكسور', 'الأستاذ عبد الباسط', 'ضرب الكسور', 'الكسور', 'fracmul'],
    ['m12', 'النسبة والتناسب', 'خان أكاديمي', 'النسبة والتناسب', 'النسب والمئويات', 'ratio'],
    ['m13', 'النسبة المئوية', 'خان أكاديمي', 'النسبة المئوية', 'النسب والمئويات', 'pct'],
    ['m14', 'تحويل الوحدات', 'خان أكاديمي', 'تحويل الوحدات', 'النسب والمئويات', 'units'],
    ['m15', 'المجهول والعبارات الجبرية', 'الأستاذ عبد الباسط', 'العبارات الجبرية', 'الجبر الأول', 'var'],
    ['m16', 'المعادلة البسيطة', 'الأستاذ عبد الباسط', 'المعادلات من الدرجة الأولى', 'الجبر الأول', 'eq1'],
    ['m17', 'المعادلة بخطوتين', 'الأستاذ عبد الباسط', 'حل معادلة من خطوتين', 'الجبر الأول', 'eq2'],
    ['m18', 'زوايا المثلث', 'خان أكاديمي', 'مجموع زوايا المثلث', 'الهندسة', 'angle'],
    ['m19', 'المحيط والمساحة', 'خان أكاديمي', 'محيط ومساحة المستطيل', 'الهندسة', 'area'],
    ['m20', 'نظرية فيثاغورس', 'خان أكاديمي', 'نظرية فيثاغورس', 'الهندسة', 'pyth']
  ],
  english: [
    ['e01', 'Present Simple', 'English with Lucy', 'present simple', 'قواعد A2–B1', [
      `She ___ to school every day.|goes|go|going|gone`, `They ___ football on Fridays.|play|plays|playing|played`, `He ___ not like coffee.|does|do|is|has`, `___ you work here?|Do|Does|Are|Is`, `Water ___ at 100 degrees.|boils|boil|boiling|boiled`]],
    ['e02', 'Past Simple', 'English with Lucy', 'past simple regular irregular', 'قواعد A2–B1', [
      `Yesterday I ___ a movie.|watched|watch|watching|watches`, `She ___ to Paris last year.|went|goes|go|gone`, `We ___ not see him.|did|do|does|were`, `What time ___ you wake up?|did|do|does|were`, `He ___ a new car in 2020.|bought|buy|buyed|buys`]],
    ['e03', 'Present Perfect', 'English with Lucy', 'present perfect', 'قواعد A2–B1', [
      `I ___ never been to Japan.|have|has|had|am`, `She ___ finished her work.|has|have|had|is`, `We have lived here ___ 2015.|since|for|during|from`, `They have lived here ___ ten years.|for|since|ago|from`, `___ you ever eaten sushi?|Have|Did|Do|Has`]],
    ['e04', 'Future: will and going to', 'English with Lucy', 'will vs going to', 'قواعد A2–B1', [
      `Look at those clouds! It ___ rain.|is going to|will to|is going|goes to`, `She ___ pass the exam, I'm sure.|will|going|is going|did`, `We ___ to visit Rome next month.|are going|will|go|went`, `Tomorrow I ___ my teacher.|will meet|met|meeting|meets`, `___ you going to travel this summer?|Are|Do|Will to|Is`]],
    ['e05', 'Modal verbs: can, must, should', 'engVid', 'modal verbs can must should', 'قواعد A2–B1', [
      `You ___ wear a seatbelt. It's the law.|must|can|might|would`, `She ___ swim when she was five.|could|can|must|should`, `You ___ see a doctor. You look ill.|should|must to|can to|would to`, `___ I open the window?|Can|Do|Must|Am`, `You ___ not park here. It's forbidden.|must|should be|would|do`]],
    ['e06', 'Comparatives and superlatives', 'English with Lucy', 'comparatives and superlatives', 'قواعد A2–B1', [
      `My car is ___ than yours.|faster|fast|fastest|more fast`, `This is the ___ film I have seen.|best|better|good|most good`, `She is ___ than her brother.|more intelligent|intelligenter|most intelligent|intelligent`, `Math is ___ difficult than English for me.|more|most|much|very`, `He is the ___ student in class.|tallest|taller|more tall|tall`]],
    ['e07', 'Articles: a, an, the', 'engVid', 'articles a an the', 'قواعد A2–B1', [
      `I saw ___ elephant at the zoo.|an|a|the|some`, `She is ___ doctor.|a|an|the|some`, `___ sun rises in the east.|The|A|An|Some`, `He plays ___ guitar.|the|a|an|some`, `She wants to be ___ engineer.|an|a|the|some`]],
    ['e08', 'Prepositions: in, on, at', 'BBC Learning English', 'prepositions in on at', 'قواعد A2–B1', [
      `The meeting is ___ Monday.|on|in|at|by`, `I was born ___ 1998.|in|on|at|by`, `See you ___ 5 o'clock.|at|on|in|to`, `The book is ___ the table.|on|in|at|between`, `She lives ___ London.|in|on|at|to`]],
    ['e09', 'First conditional', 'English with Lucy', 'first conditional', 'قواعد B1–B2', [
      `If I ___ time, I will help you.|have|will have|had|would have`, `If it rains tomorrow, we ___ at home.|will stay|stayed|would stay|staying`, `If you study hard, you ___ the exam.|will pass|would pass|passed|pass`, `If she ___ early, she will catch the bus.|leaves|will leave|left|leaving`, `What will you do if you ___ the test?|fail|will fail|failed|failing`]],
    ['e10', 'Second conditional', 'English with Lucy', 'second conditional', 'قواعد B1–B2', [
      `If I ___ rich, I would travel the world.|were|am|will be|was being`, `If she ___ more time, she would learn French.|had|has|will have|have`, `I ___ help you if I could.|would|will|did|am`, `If I were you, I ___ take that job.|would|will|did|am`, `What ___ you do if you won the lottery?|would|will|did|are`]],
    ['e11', 'Passive voice', 'engVid', 'passive voice', 'قواعد B1–B2', [
      `The letter ___ yesterday.|was written|wrote|is writing|has wrote`, `English ___ all over the world.|is spoken|speaks|is speaking|spoke`, `The windows ___ every week.|are cleaned|clean|cleaned are|cleaning`, `This book ___ by a famous author.|was written|wrote|writes|has write`, `The cake ___ by my mother.|was made|made|was make|making`]],
    ['e12', 'Common phrasal verbs', 'BBC Learning English', 'phrasal verbs', 'قواعد B1–B2', [
      `«Give up» means:|stop trying|start|continue|win`, `Please ___ your shoes before entering.|take off|take in|take on|take up`, `I'm looking ___ my keys.|for|at|up|out`, `«Turn down the music» means:|make it quieter|make it louder|stop it|change it`, `We ran ___ of milk.|out|off|away|over`]],
    ['e13', 'Reported speech', 'English with Lucy', 'reported speech', 'قواعد B1–B2', [
      `He said, "I am tired." → He said that he ___ tired.|was|is|were|has been`, `She said, "I live in Rome." → She said she ___ in Rome.|lived|lives|live|was lived`, `"I will call you." → He said he ___ call me.|would|will|did|can`, `"Do you like pizza?" → She asked me if I ___ pizza.|liked|like|likes|do like`, `"Where is the station?" → He asked where the station ___.|was|is|were|be`]],
    ['e14', 'Linking words', 'English with Lucy', 'linking words however although', 'قواعد B1–B2', [
      `I was tired, ___ I kept working.|but|so|because|or`, `___ it was raining, we went out.|Although|Because|So|But`, `I stayed home ___ I was sick.|because|although|but|however`, `He studied hard; ___, he failed.|however|because|so|and`, `It was cold, ___ I wore a coat.|so|because|although|but`]],
    ['e15', 'Relative clauses', 'engVid', 'relative clauses who which whose', 'قواعد B1–B2', [
      `The man ___ lives next door is a doctor.|who|which|whose|where`, `This is the book ___ I told you about.|which|who|whose|where`, `She is the girl ___ brother is a pilot.|whose|who|which|whom`, `That's the town ___ I was born.|where|who|which|whose`, `The car, ___ was very expensive, broke down.|which|who|where|whose`]],
    ['e16', 'مفردات الرياضيات بالإنجليزية', 'English with Lucy', 'math vocabulary in English', 'مفردات تخصصية', [
      `ما معنى «fraction»؟|كسر|جذر|مجموع|معادلة`, `ما معنى «equation»؟|معادلة|مثلث|ضرب|نسبة`, `ما معنى «divide»؟|يقسم|يضرب|يطرح|يجمع`, `ما معنى «triangle»؟|مثلث|دائرة|مربع|زاوية`, `ما معنى «percentage»؟|نسبة مئوية|كسر|مجموع|متوسط`]]
  ],
  french: [
    ['f01', 'الأبجدية والنطق', 'Learn French with Alexa', 'French alphabet pronunciation', 'البداية', [
      `كيف يُنطق حرف r في الفرنسية غالباً؟|من الحلق|راء مرقّقة كالعربية|مثل الزاي|مثل الذال`, `الحرف h في كلمة hôtel:|صامت لا يُنطق|هاء قوية|خاء|حاء`, `كلمة ou تُنطق:|و طويلة|أ|ي|ع`, `أي الحروف المركبة تُنطق «ش»؟|ch|th|ph|qu`, `كلمة eau (ماء) تُنطق:|أو|إيو|أي|أه`]],
    ['f02', 'التحيات', 'Learn French with Alexa', 'French greetings', 'البداية', [
      `ما معنى Bonjour؟|صباح الخير أو مرحباً|مع السلامة|شكراً|عفواً`, `ما معنى Merci؟|شكراً|عفواً|مرحباً|آسف`, `ما معنى Au revoir؟|إلى اللقاء|صباح الخير|من فضلك|أهلاً`, `ما معنى S'il vous plaît؟|من فضلك|شكراً|آسف|حسناً`, `تحية المساء في الفرنسية:|Bonsoir|Bonjour|Salut|Merci`]],
    ['f03', 'الأعداد من 0 إلى 20', 'Learn French with Vincent', 'French numbers 1 to 20', 'البداية', [
      `ما معنى trois؟|3|2|4|13`, `ما معنى sept؟|7|6|8|17`, `كيف نقول 5؟|cinq|six|sept|quatre`, `ما معنى douze؟|12|2|20|11`, `كيف نقول 10؟|dix|neuf|huit|onze`]],
    ['f04', 'الأعداد من 20 إلى 100', 'Learn French with Vincent', 'French numbers 20 to 100', 'البداية', [
      `ما معنى vingt؟|20|2|200|30`, `ما معنى trente؟|30|13|3|33`, `ما معنى quarante؟|40|14|4|44`, `ما معنى quatre-vingts؟|80|40|90|24`, `ما معنى soixante-dix؟|70|60|17|80`]],
    ['f05', 'التعريف بالنفس', 'Learn French with Alexa', 'se présenter en français', 'البداية', [
      `كيف تقول «اسمي محمد»؟|Je m'appelle Mohamed|Tu t'appelles Mohamed|Il s'appelle Mohamed|Je suis appelle Mohamed`, `ما معنى Comment tu t'appelles ?|ما اسمك؟|كم عمرك؟|أين تسكن؟|كيف حالك؟`, `كيف تقول «عمري 20 سنة»؟|J'ai vingt ans|Je suis vingt ans|J'ai vingt|Je vingt ans`, `ما معنى Enchanté؟|تشرفت بمعرفتك|مع السلامة|شكراً|آسف`, `كيف تقول «أنا من موريتانيا»؟|Je suis de Mauritanie|J'ai de Mauritanie|Je vais Mauritanie|Je m'appelle Mauritanie`]],
    ['f06', 'الفعل être (يكون)', 'Learn French with Vincent', 'verbe être', 'القواعد والمفردات الأولى', [
      `Je ___ étudiant.|suis|es|est|sont`, `Tu ___ fatigué.|es|suis|est|êtes`, `Nous ___ à la maison.|sommes|êtes|sont|suis`, `Ils ___ amis.|sont|est|sommes|es`, `Vous ___ prêts ?|êtes|sommes|es|suis`]],
    ['f07', 'الفعل avoir (يملك)', 'Learn French with Vincent', 'verbe avoir', 'القواعد والمفردات الأولى', [
      `J'___ un livre.|ai|as|a|ont`, `Tu ___ faim.|as|ai|a|avez`, `Elle ___ une voiture.|a|as|ai|ont`, `Nous ___ deux enfants.|avons|avez|ont|a`, `Ils ___ du temps.|ont|a|avons|as`]],
    ['f08', 'أدوات التعريف والتنكير', 'Learn French with Alexa', 'articles définis indéfinis le la les un une', 'القواعد والمفردات الأولى', [
      `___ livre (مذكر معرّف).|le|la|les|une`, `___ table (مؤنث معرّف).|la|le|les|un`, `___ enfants (جمع معرّف).|les|le|la|une`, `Elle a ___ chat. (مذكر نكرة)|un|une|des|la`, `J'ai ___ amie. (مؤنث نكرة)|une|un|des|le`]],
    ['f09', 'العائلة', 'Coffee Break French', 'la famille vocabulaire', 'القواعد والمفردات الأولى', [
      `ما معنى frère؟|أخ|أخت|أب|أم`, `ما معنى mère؟|أم|أب|جدة|عمة`, `كيف تقول «أب»؟|père|mère|fils|oncle`, `ما معنى fille في العائلة؟|ابنة|ابن|أخت|جدة`, `كيف تقول «جد»؟|grand-père|grand-mère|petit-fils|oncle`]],
    ['f10', 'الطعام والشراب', 'Coffee Break French', 'nourriture vocabulaire', 'القواعد والمفردات الأولى', [
      `ما معنى pain؟|خبز|ماء|حليب|جبن`, `ما معنى eau؟|ماء|حليب|عصير|خبز`, `ما معنى lait؟|حليب|خبز|ماء|جبن`, `ما معنى pomme؟|تفاحة|موزة|برتقالة|عنب`, `ما معنى fromage؟|جبن|لحم|سمك|أرز`]],
    ['f11', 'أفعال er: parler', 'Learn French with Vincent', 'verbes en er présent parler', 'أفعال وجمل الحياة', [
      `Je ___ français.|parle|parles|parlons|parlent`, `Tu ___ anglais.|parles|parle|parlez|parlent`, `Nous ___ arabe.|parlons|parlez|parlent|parle`, `Vous ___ bien.|parlez|parlons|parle|parles`, `Ils ___ vite.|parlent|parle|parlons|parlez`]],
    ['f12', 'النفي', 'Learn French with Alexa', 'la négation ne pas', 'أفعال وجمل الحياة', [
      `كيف تنفي Je parle؟|Je ne parle pas|Je pas parle|Je non parle|Je parle ne pas`, `ما معنى Je ne sais pas؟|لا أعرف|أعرف|لا أريد|لا أستطيع`, `Il ___ mange pas.|ne|non|pas|n'est`, `Nous ___ avons pas de temps.|n'|ne|non|pas`, `ما معنى Elle n'est pas là؟|هي ليست هنا|هي هنا|هي ذهبت|هي سعيدة`]],
    ['f13', 'أدوات الاستفهام', 'Français avec Pierre', 'mots interrogatifs où quand comment', 'أفعال وجمل الحياة', [
      `ما معنى Où؟|أين|متى|لماذا|من`, `ما معنى Pourquoi؟|لماذا|كيف|أين|متى`, `ما معنى Comment؟|كيف|كم|من|ماذا`, `ما معنى Qui؟|من|متى|أين|لماذا`, `ما معنى Quand؟|متى|أين|كم|لماذا`]],
    ['f14', 'الأيام والوقت', 'Coffee Break French', 'jours de la semaine heure', 'أفعال وجمل الحياة', [
      `lundi هو يوم:|الإثنين|الثلاثاء|الأحد|الجمعة`, `vendredi هو يوم:|الجمعة|الخميس|السبت|الأربعاء`, `dimanche هو يوم:|الأحد|السبت|الإثنين|الجمعة`, `ما معنى Quelle heure est-il ?|كم الساعة؟|ما اليوم؟|أين أنت؟|ما اسمك؟`, `Il est huit heures تعني:|الساعة الثامنة|الساعة السابعة|الساعة التاسعة|الساعة الثانية`]],
    ['f15', 'في المتجر والمطعم', 'Easy French', 'au restaurant au magasin vocabulaire', 'أفعال وجمل الحياة', [
      `ما معنى Combien ça coûte ?|بكم هذا؟|أين المتجر؟|ما اسمك؟|هل تعمل؟`, `ما معنى Je voudrais un café|أريد قهوة|عندي قهوة|أحب القهوة|لا أريد قهوة`, `L'addition, s'il vous plaît تعني:|الحساب من فضلك|القائمة من فضلك|الماء من فضلك|شكراً جزيلاً`, `ما معنى C'est trop cher|هذا غالٍ جداً|هذا رخيص|هذا لذيذ|هذا كبير`, `la carte في المطعم:|قائمة الطعام|الفاتورة|الطاولة|الطبق`]],
    ['f16', 'الاتجاهات', 'Easy French', 'demander son chemin directions', 'أفعال وجمل الحياة', [
      `ما معنى tout droit؟|مباشرة للأمام|إلى اليسار|إلى اليمين|خلفاً`, `ما معنى à gauche؟|إلى اليسار|إلى اليمين|للأمام|قف`, `ما معنى à droite؟|إلى اليمين|إلى اليسار|للأمام|خلفاً`, `ما معنى Où est la gare ?|أين المحطة؟|أين المطار؟|متى القطار؟|كم الساعة؟`, `ما معنى près d'ici؟|قريب من هنا|بعيد عن هنا|فوق هنا|هنا فقط`]]
  ]
};
const CURR = Object.fromEntries(Object.entries(CURR_RAW).map(([sid, arr]) => [sid, arr.map(([id, t, ch, q, g, quiz]) => ({ id, t, ch, q, g, quiz }))]));

// مولّدات أسئلة الرياضيات: تُنتج أرقاماً جديدة في كل محاولة
const _r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const _shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = _r(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const _gcd = (a, b) => b ? _gcd(b, a % b) : a;
function _num(q, e, ans, ds) {
  const set = []; for (const d of ds) if (d !== ans && !set.includes(d)) set.push(d);
  let g = 0; while (set.length < 3 && g++ < 50) { const c = ans + _r(-9, 9); if (c !== ans && !set.includes(c)) set.push(c); }
  const o = _shuf([ans, ...set.slice(0, 3)]); return { q, e, o: o.map(String), a: o.indexOf(ans), ltr: true };
}
function _str(q, e, ans, ds) {
  const set = []; for (const d of ds) if (d !== ans && !set.includes(d)) set.push(d);
  let g = 0; while (set.length < 3 && g++ < 50) { const d = _r(2, 9), n = _r(1, d - 1), c = n + '/' + d; if (c !== ans && !set.includes(c)) set.push(c); }
  const o = _shuf([ans, ...set.slice(0, 3)]); return { q, e, o, a: o.indexOf(ans), ltr: true };
}
const GEN = {
  place() { const d = _shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), n = +d.join(''), k = _r(0, 3), dg = d[3 - k], ans = dg * 10 ** k; return _num(`ما قيمة الرقم ${dg} في العدد ${n}؟`, String(n), ans, [0, 1, 2, 3].map(x => dg * 10 ** x)); },
  add() { const a = _r(120, 899), b = _r(120, 899); return _num('احسب:', `${a} + ${b}`, a + b, [a + b + 10, a + b - 10, a + b + 100, a + b - 1]); },
  sub() { const a = _r(300, 999), b = _r(100, a - 100); return _num('احسب:', `${a} − ${b}`, a - b, [a - b + 10, a - b - 10, a - b + 100, a - b + 1]); },
  mul() { const a = _r(3, 12), b = _r(3, 12); return _num('احسب:', `${a} × ${b}`, a * b, [a * b + a, a * b - a, a * b + b, a * b - b]); },
  mul2() { const a = _r(12, 45), b = _r(3, 9); return _num('احسب:', `${a} × ${b}`, a * b, [a * b + 10, a * b - 10, a * b + b, a * b - a]); },
  div() { const b = _r(3, 12), r = _r(3, 12); return _num('احسب:', `${b * r} ÷ ${b}`, r, [r + 1, r - 1, r + 2, r * 2]); },
  div2() { const b = _r(6, 15), r = _r(12, 60); return _num('احسب:', `${b * r} ÷ ${b}`, r, [r + 1, r - 1, r + 10, r - 10]); },
  fraccmp() { const set = new Map(); let g = 0; while (set.size < 4 && g++ < 200) { const d = [2, 3, 4, 5, 6, 8][_r(0, 5)], n = _r(1, d - 1), v = n / d; if (![...set.values()].some(x => Math.abs(x - v) < 1e-9)) set.set(n + '/' + d, v); } const arr = [...set.entries()]; const best = arr.reduce((m, x) => x[1] > m[1] ? x : m); const o = arr.map(x => x[0]); return { q: 'أي الكسور التالية أكبر قيمة؟', e: '', o, a: o.indexOf(best[0]), ltr: true }; },
  fracsimp() { let p, q; do { q = _r(2, 9); p = _r(1, q - 1); } while (_gcd(p, q) !== 1); const k = _r(2, 5); return _str('بسّط الكسر:', `${p * k}/${q * k}`, `${p}/${q}`, [`${p}/${q + 1}`, `${p + 1}/${q}`, `${p * k}/${q}`, `${p}/${q * k}`]); },
  fracadd() { const d = _r(5, 12), a = _r(1, 4), b = _r(1, 4); return _str('احسب (دون تبسيط):', `${a}/${d} + ${b}/${d}`, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`, `${a + b}/${d + d}`]); },
  fracmul() { const a = _r(1, 4), c = _r(1, 4), b = _r(2, 5), d = _r(2, 5); return _str('احسب (دون تبسيط):', `${a}/${b} × ${c}/${d}`, `${a * c}/${b * d}`, [`${a + c}/${b + d}`, `${a * c}/${b + d}`, `${a * d}/${b * c}`, `${a * c}/${b}`]); },
  ratio() { const u = _r(5, 30), k = _r(2, 6), m = _r(k + 1, 12); return _num(`ثمن ${k} كتب هو ${u * k} أوقية. كم ثمن ${m} كتب؟`, '', u * m, [u * m + u, u * m - u, u * k + m, u * (m - 1) + k]); },
  pct() { const p = [10, 20, 25, 50][_r(0, 3)], N = _r(2, 20) * 20, ans = N * p / 100; return _num(`ما هو ${p}% من ${N}؟`, '', ans, [ans * 2, ans / 2 | 0, N - ans, ans + 10]); },
  units() { const t = _r(0, 3), v = _r(2, 9); const T = [['كم', 'م', 1000], ['م', 'سم', 100], ['كغ', 'غ', 1000], ['ساعة', 'دقيقة', 60]][t]; return _num(`حوّل ${v} ${T[0]} إلى ${T[1]}:`, '', v * T[2], [v * T[2] * 10, v * T[2] / 10, v * T[2] + T[2], v + T[2]]); },
  var() { const a = _r(2, 6), b = _r(1, 9), x = _r(2, 9); return _num(`ما قيمة العبارة عندما x = ${x}؟`, `${a}x + ${b}`, a * x + b, [a + x + b, a * (x + b), a * x - b, a * x]); },
  eq1() { const x = _r(2, 20), b = _r(1, 20); return _num('أوجد x:', `x + ${b} = ${x + b}`, x, [x + b, x + 1, x - 1, x + b + x]); },
  eq2() { const x = _r(2, 9), a = _r(2, 6), b = _r(1, 15); return _num('أوجد x:', `${a}x + ${b} = ${a * x + b}`, x, [x + 1, x - 1, a * x, a * x + b - a]); },
  angle() { const A = _r(30, 80), B = _r(30, 80); return _num(`مثلث فيه زاويتان ${A}° و ${B}°. كم الزاوية الثالثة؟`, '', 180 - A - B, [180 - A, 180 - B, 90 - A, 360 - A - B]); },
  area() { const w = _r(3, 12), h = _r(3, 12) + (_r(0, 1) ? 0 : 0); return Math.random() < .5 ? _num(`مستطيل طوله ${w + 2} وعرضه ${h}. ما مساحته؟`, '', (w + 2) * h, [(w + 2 + h) * 2, (w + 2) * h + h, (w + 2) * h - h, w * h]) : _num(`مستطيل طوله ${w + 2} وعرضه ${h}. ما محيطه؟`, '', (w + 2 + h) * 2, [(w + 2) * h, w + 2 + h, (w + 2 + h) * 2 + 2, (w + 2) * 2 + h]); },
  pyth() { const T = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]][_r(0, 5)]; return _num(`مثلث قائم ضلعاه ${T[0]} و ${T[1]}. كم طول الوتر؟`, '', T[2], [T[0] + T[1], T[2] + 1, T[2] - 1, T[1] + 1]); }
};
function buildQuiz(lesson, n = 5) {
  if (typeof lesson.quiz === 'string') { const out = [], seen = new Set(); let g = 0; while (out.length < n && g++ < 60) { const q = GEN[lesson.quiz](); const k = q.q + '|' + q.e + '|' + q.o.join(','); if (!seen.has(k)) { seen.add(k); out.push(q); } } return out; }
  return _shuf(lesson.quiz).slice(0, n).map(s => { const [q, ok, ...bad] = s.split('|'); const o = _shuf([ok, ...bad]); return { q, e: '', o, a: o.indexOf(ok), ltr: false }; });
}
