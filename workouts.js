// ================= رسوم التمارين (هيكل عظمي مبسّط) =================
// الزوايا مطلقة بالدرجات: 0 يميناً، 90 للأسفل، 180 يساراً، 270 للأعلى. الشخص ينظر يميناً.
const _d = a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)];
const _add = (p, a, l) => { const d = _d(a); return [p[0] + d[0] * l, p[1] + d[1] * l]; };
const LEN = { t: 24, ua: 12, fa: 11, th: 15, sh: 15, ft: 5 };
function skel(p) {
  const hip = p.h || [50, 30], sho = _add(hip, p.t, LEN.t), head = _add(sho, p.hd ?? p.t, 9.5);
  const el = _add(sho, p.ua, LEN.ua), ha = _add(el, p.fa, LEN.fa), kn = _add(hip, p.th, LEN.th), fo = _add(kn, p.sh, LEN.sh), to = _add(fo, p.ft ?? 0, LEN.ft);
  const el2 = _add(sho, p.ua2 ?? p.ua, LEN.ua), ha2 = _add(el2, p.fa2 ?? p.fa, LEN.fa), kn2 = _add(hip, p.th2 ?? p.th, LEN.th), fo2 = _add(kn2, p.sh2 ?? p.sh, LEN.sh), to2 = _add(fo2, p.ft ?? 0, LEN.ft);
  return { hip, sho, head, el, ha, kn, fo, to, el2, ha2, kn2, fo2, to2 };
}
function solvePose(p) {
  p = { ...p, h: p.h || [50, 30] };
  if (p.fit) {
    const [a, b, key, off] = p.fit, get = d => { const q = { ...p }; if (key === 'body') { q.t += d; q.th += d; q.sh += d; if (q.th2 != null) { q.th2 += d; q.sh2 += d; } } else q[key] += d; const s = skel(q); return [q, s[a][1] - s[b][1] - (off || 0)]; };
    let lo = -70, hi = 70, best = get(0);
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2, r = get(m), l = get(lo); if (Math.abs(r[1]) < Math.abs(best[1])) best = r; if ((l[1] > 0) === (r[1] > 0)) lo = m; else hi = m; }
    p = best[0];
  }
  return p;
}
function figSvg(pose, opts = {}) {
  const p = solvePose(pose), s = skel(p), F = 57;
  const pts = [s.fo, s.to, s.fo2, s.to2, s.ha, s.ha2, s.hip, s.sho, s.head, s.kn, s.kn2];
  const gy = p.ground ? Math.max(...p.ground.map(k => s[k][1])) + (p.gdrop||0) : Math.max(s.fo[1], s.to[1], s.fo2[1], s.to2[1]);
  const dy = F - gy - (p.lift || 0), mx = (Math.min(...pts.map(q => q[0])) + Math.max(...pts.map(q => q[0]))) / 2, dx = 50 - mx;
  const T = q => [+(q[0] + dx).toFixed(1), +(q[1] + dy).toFixed(1)], J = {}; for (const k in s) J[k] = T(s[k]);
  const ln = (a, b, c = '') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${c}/>`;
  let g = `<line x1="4" y1="${F + 1.5}" x2="96" y2="${F + 1.5}" class="fg-floor"/>`;
  if (p.prop === 'wall') g += ln([J.hip[0] - 5, 4], [J.hip[0] - 5, F + 1.5], 'class="fg-obj"');
  if (p.prop === 'bench') g += `<rect x="${J.sho[0] - 14}" y="${J.hip[1] + 1.5}" width="${J.kn[0] - J.sho[0] + 18}" height="3" rx="1" class="fg-objf"/>` + ln([J.sho[0] - 8, J.hip[1] + 4.5], [J.sho[0] - 8, F + 1.5], 'class="fg-obj"') + ln([J.kn[0] + 2, J.hip[1] + 4.5], [J.kn[0] + 2, F + 1.5], 'class="fg-obj"');
  if (p.prop === 'chair') { const x = J.ha[0] + 2; g += `<rect x="${x - 3}" y="${J.ha[1] + 1}" width="12" height="3" rx="1" class="fg-objf"/>` + ln([x + 6, J.ha[1] + 4], [x + 6, F + 1.5], 'class="fg-obj"') + ln([x, J.ha[1] + 4], [x, F + 1.5], 'class="fg-obj"'); }
  if (p.prop === 'chairfoot') { const x = J.fo[0]; g += `<rect x="${x - 6}" y="${J.fo[1] - 1}" width="14" height="3" rx="1" class="fg-objf"/>` + ln([x + 5, J.fo[1] + 2], [x + 5, F + 1.5], 'class="fg-obj"') + ln([x - 5, J.fo[1] + 2], [x - 5, F + 1.5], 'class="fg-obj"'); }
  if (p.prop === 'chairback') { const x = J.fo2[0] - 2; g += `<rect x="${x - 6}" y="${J.fo2[1] + 1}" width="14" height="3" rx="1" class="fg-objf"/>` + ln([x + 5, J.fo2[1] + 4], [x + 5, F + 1.5], 'class="fg-obj"') + ln([x - 5, J.fo2[1] + 4], [x - 5, F + 1.5], 'class="fg-obj"'); }
  if (p.prop === 'chairbehind') { const x = J.ha[0]; g += `<rect x="${x - 10}" y="${J.ha[1] + 1}" width="13" height="3" rx="1" class="fg-objf"/>` + ln([x - 9, J.ha[1] + 4], [x - 9, F + 1.5], 'class="fg-obj"') + ln([x + 1, J.ha[1] + 4], [x + 1, F + 1.5], 'class="fg-obj"'); }
  if (p.prop === 'wallf') g += ln([J.ha[0] + 2.5, 4], [J.ha[0] + 2.5, F + 1.5], 'class="fg-obj"');
  if (p.prop === 'step') g += `<rect x="${J.fo[0] - 3}" y="${F - 3}" width="12" height="4.5" rx="1" class="fg-objf"/>`;
  if (p.prop === 'table') { const y = Math.min(J.ha[1], J.ha2[1]) - 3; g += `<rect x="${J.ha[0] - 12}" y="${y}" width="28" height="2.5" rx="1" class="fg-objf"/>` + ln([J.ha[0] - 10, y + 2.5], [J.ha[0] - 10, F + 1.5], 'class="fg-obj"') + ln([J.ha[0] + 14, y + 2.5], [J.ha[0] + 14, F + 1.5], 'class="fg-obj"'); }
  if (p.prop === 'pullbar') { const y = J.ha[1] - 1; g += ln([J.ha[0] - 16, y], [J.ha[0] + 16, y], 'class="fg-bar"') + ln([J.ha[0] - 16, y], [J.ha[0] - 16, 4], 'class="fg-obj"') + ln([J.ha[0] + 16, y], [J.ha[0] + 16, 4], 'class="fg-obj"'); }
  const far = ln(J.hip, J.kn2) + ln(J.kn2, J.fo2) + ln(J.fo2, J.to2) + ln(J.sho, J.el2) + ln(J.el2, J.ha2);
  const near = ln(J.hip, J.sho) + ln(J.hip, J.kn) + ln(J.kn, J.fo) + ln(J.fo, J.to) + ln(J.sho, J.el) + ln(J.el, J.ha);
  let pr = '';
  if (p.prop === 'db') pr = [J.ha, J.ha2].map(h => `<circle cx="${h[0]}" cy="${h[1]}" r="2.6" class="fg-bell"/>`).join('');
  if (p.prop === 'dbone') pr = `<circle cx="${J.ha[0]}" cy="${J.ha[1]}" r="2.6" class="fg-bell"/>`;
  if (p.prop === 'bar' || p.prop === 'bench') pr = `<circle cx="${J.ha[0]}" cy="${J.ha[1]}" r="${p.prop === 'bar' ? 4.2 : 4.2}" class="fg-plate"/>`;
  if (p.prop === 'barback') pr = `<circle cx="${J.sho[0] - 1}" cy="${J.sho[1] - 1}" r="4.2" class="fg-plate"/>`;
  return `<svg viewBox="0 -16 100 80" class="fig" role="img" aria-hidden="true"><g class="fg-far">${far}</g><g class="fg-near">${near}<circle cx="${J.head[0]}" cy="${J.head[1]}" r="5.2" class="fg-head"/></g>${g}${pr}</svg>`;
}
const _pose = (h, t, ua, fa, th, sh, x = {}) => ({ h, t, ua, fa, th, sh, ...x });
const _stand = (x = {}) => _pose([50, 30], 270, 95, 90, 90, 90, x);
const _lieBack = (x = {}) => _pose([50, 54], 180, 100, 100, 315, 65, x);

// ====== أوضاع التمارين: [البداية، النهاية] ======
const _ps = (th, sh, x) => ({ th, sh, ...x });
const POSES = {
  pushup: [_pose([50,30],350,90,90,170,170,{ft:60,ground:['ha','to'],fit:['ha','to','body']}), _pose([50,30],352,125,75,172,172,{ft:60,ground:['ha','to'],fit:['ha','to','body']})],
  kneepush: [_pose([50,30],350,90,90,170,200,{ground:['ha','kn'],fit:['ha','kn','body']}), _pose([50,30],352,125,75,170,200,{ground:['ha','kn'],fit:['ha','kn','body']})],
  wallpush: [_pose([50,30],285,0,0,105,105,{prop:'wallf'}), _pose([50,30],300,50,350,105,105,{prop:'wallf'})],
  row: [_pose([50,30],350,270,270,170,170,{prop:'table',ground:['fo']}), _pose([50,30],350,150,260,170,170,{prop:'table',ground:['fo']})],
  pike: [_pose([50,30],60,85,85,125,125,{ground:['ha','fo'],fit:['ha','fo','t']}), _pose([50,30],70,125,65,125,125,{ground:['ha','fo'],fit:['ha','fo','t']})],
  dips: [_pose([50,30],270,105,100,20,90,{prop:'chairbehind',lift:0}), _pose([50,30],275,130,60,10,85,{prop:'chairbehind'})],
  plank: [_pose([50,30],352,90,0,170,170,{ft:60,ground:['el','to'],fit:['el','to','body']})],
  sideplank: [_pose([50,30],340,90,0,160,160,{ft:60,ground:['el','to'],fit:['el','to','body']})],
  squat: [_stand(), _pose([50,30],300,10,10,5,100)],
  lunge: [_stand(), _pose([50,30],270,95,90,20,95,{th2:125,sh2:175})],
  bridge: [_lieBack(), _pose([50,54],160,0,0,340,95,{ground:['fo','sho'],fit:['sho','fo','t']})],
  slbridge: [_pose([50,54],160,0,0,340,95,{ground:['fo','sho'],fit:['sho','fo','t']}), _pose([50,54],160,0,0,340,95,{th2:335,sh2:335,ground:['fo','sho'],fit:['sho','fo','t']})],
  calf: [_stand({prop:'step'}), _stand({ft:55,prop:'step'})],
  wallsit: [_pose([50,30],270,40,0,0,90,{prop:'wall'})],
  diamond: [_pose([50,30],350,90,90,170,170,{ft:60,ground:['ha','to'],fit:['ha','to','body']}), _pose([50,30],352,125,75,172,172,{ft:60,ground:['ha','to'],fit:['ha','to','body']})],
  decline: [_pose([50,30],350,90,90,170,170,{ft:60,prop:'chairfoot',ground:['ha'],fit:['ha','to','body',-12]}), _pose([50,30],352,125,75,172,172,{ft:60,prop:'chairfoot',ground:['ha'],fit:['ha','to','body',-12]})],
  pullup: [_pose([50,30],270,270,270,95,90,{prop:'pullbar',lift:10}), _pose([50,30],270,110,260,95,90,{prop:'pullbar',lift:18})],
  superman: [_pose([50,30],0,0,0,180,180,{hd:0,lift:1}), _pose([50,30],355,345,345,190,190,{hd:330,lift:1})],
  split: [_stand(), _pose([50,30],270,95,90,15,95,{th2:120,sh2:200,prop:'chairback'})],
  sidelunge: [_stand(), _pose([50,30],285,95,90,35,100,{th2:145,sh2:150})],
  hollow: [_pose([50,40],180,10,10,0,0,{ground:['hip']}), _pose([50,40],195,190,190,340,340,{ground:['hip'],hd:200})],
  crunch: [_lieBack({ua:20,fa:340}), _pose([50,54],200,30,330,315,65,{ground:['fo']})],
  birddog: [_pose([50,30],355,90,90,90,180,{ground:['ha','kn'],fit:['ha','kn','t']}), _pose([50,30],355,90,90,90,180,{ua2:0,fa2:0,th2:175,sh2:175,ground:['ha','kn'],fit:['ha','kn','t']})],
  highknees: [_stand({ua:60,fa:300}), _pose([50,30],270,300,60,0,90,{th2:90,sh2:90,ua2:60,fa2:300})],
  mountain: [_pose([50,30],350,90,90,170,170,{ft:60,ground:['ha','to'],fit:['ha','to','body']}), _pose([50,30],350,90,90,170,170,{ft:60,th2:45,sh2:135,ground:['ha','to'],fit:['ha','to','body']})],
  dbpress: [_lieBack({ua:270,fa:270,prop:'db'}), _lieBack({ua:100,fa:270,prop:'db'})],
  dbshoulder: [_stand({ua:100,fa:270,prop:'db'}), _stand({ua:270,fa:270,prop:'db'})],
  lateral: [_stand({prop:'db',ua:95,fa:95}), _stand({prop:'db',ua:5,fa:5})],
  dbrow: [_pose([50,30],340,90,90,100,80,{prop:'dbone'}), _pose([50,30],340,150,95,100,80,{prop:'dbone'})],
  curl: [_stand({prop:'dbone'}), _stand({prop:'dbone',fa:285})],
  goblet: [_stand({ua:110,fa:330,prop:'dbone'}), _pose([50,30],300,110,330,10,100,{prop:'dbone'})],
  rdl: [_stand({prop:'db'}), _pose([50,30],335,90,90,95,90,{prop:'db'})],
  barsquat: [_stand({ua:125,fa:240,prop:'barback'}), _pose([50,30],300,125,240,10,100,{prop:'barback'})],
  bench: [_lieBack({ua:270,fa:270,prop:'bench'}), _lieBack({ua:100,fa:270,prop:'bench'})],
  ohp: [_stand({ua:100,fa:270,prop:'bar'}), _stand({ua:270,fa:270,prop:'bar'})],
  bentrow: [_pose([50,30],340,90,90,100,80,{prop:'bar'}), _pose([50,30],340,150,95,100,80,{prop:'bar'})],
  deadlift: [_pose([50,30],320,90,90,60,100,{prop:'bar'}), _stand({prop:'bar'})]
};

// ====== بيانات إضافية للتمارين الحالية: اسم إنجليزي، مجموعة، معدّات، مستوى، قيود، شرح إنجليزي ======
const EX_META = {
  pushup:  { en:'Push-up', me:'Chest, shoulders, triceps', g:'push', eq:'none', lvl:2, lim:['wrist','shoulder'], x:{ steps:['Place hands slightly wider than shoulders.','Keep a straight line from head to heels, abs tight.','Lower your chest to just above the floor, elbows about 45° from your body.','Push the floor away until your arms are straight.'], err:['Hips sagging or piking up','Elbows flaring straight out to the sides'], easy:'Knee push-ups or push-ups with hands on a table.', hard:'Slow 3-second lowering, or feet on a chair.' } },
  row:     { en:'Table inverted row', me:'Back, biceps', g:'pull', eq:'none', lvl:2, lim:[], x:{ steps:['Lie under a sturdy table and grip its edge.','Keep your body straight, heels on the floor.','Pull your chest up toward the table edge.','Lower slowly until your arms are straight.'], err:['Using a table that is not stable','Bending at the hips instead of keeping a straight body'], easy:'Bend your knees and keep feet closer.', hard:'Straighten legs fully or raise your feet on a chair.' } },
  pike:    { en:'Pike push-up', me:'Shoulders, triceps', g:'push', eq:'none', lvl:2, lim:['shoulder','wrist'], x:{ steps:['Lift your hips into an inverted V.','Bend your elbows and lower your head between your hands.','Press back up to the V shape.'], err:['Hips dropping into a normal push-up','Hands too close to your feet'], easy:'Do it with hands on a wall at an incline.', hard:'Raise your feet on a chair.' } },
  dips:    { en:'Chair dips', me:'Triceps, chest', g:'push', eq:'none', lvl:2, lim:['shoulder','wrist'], x:{ steps:['Sit on the chair edge, hands beside your hips, then slide off.','Lower until your elbows reach about 90°.','Press up until your arms are almost straight.'], err:['Going too deep and straining the shoulders','Sliding too far from the chair'], easy:'Bend your knees and keep feet close.', hard:'Straighten legs or put feet on another chair.' } },
  plank:   { en:'Forearm plank', me:'Core', g:'core', eq:'none', lvl:1, lim:[], x:{ steps:['Elbows directly under shoulders.','Tighten abs and glutes.','Keep your body straight and breathe steadily.'], err:['Hips sagging toward the floor','Hips lifted too high'], easy:'Plank on your knees.', hard:'Lift one leg or add 10 seconds each week.' } },
  squat:   { en:'Bodyweight squat', me:'Quads, glutes', g:'legs', eq:'none', lvl:1, lim:['knee'], x:{ steps:['Feet shoulder-width apart.','Push your hips back and lower as if sitting on a chair.','Heels stay down, knees track over your toes.','Drive up through your heels.'], err:['Knees collapsing inward','Heels lifting off the floor'], easy:'Squat to a chair and stand back up.', hard:'Slow 3-second descent or add a jump.' } },
  lunge:   { en:'Reverse lunge', me:'Quads, glutes', g:'legs', eq:'none', lvl:1, lim:['knee'], x:{ steps:['Take a big step backward.','Lower until the back knee nearly touches the floor.','Front knee stays above the ankle.','Push through the front heel to stand.'], err:['Front knee drifting far past the toes','Torso leaning forward'], easy:'Hold a wall for balance.', hard:'Add a pause at the bottom or hold weights.' } },
  bridge:  { en:'Glute bridge', me:'Glutes, lower back', g:'legs', eq:'none', lvl:1, lim:[], x:{ steps:['Lie on your back, knees bent, feet flat.','Push through your heels and lift your hips.','Squeeze your glutes at the top, body straight from shoulder to knee.','Lower slowly.'], err:['Arching the lower back','Pushing through the toes'], easy:'Lift only halfway.', hard:'Single-leg bridge.' } },
  calf:    { en:'Calf raise on a step', me:'Calves', g:'legs', eq:'none', lvl:1, lim:[], x:{ steps:['Stand with the balls of your feet on a step.','Rise to the highest point.','Lower slowly below step level.'], err:['Bouncing quickly','Not going through the full range'], easy:'Hold a wall.', hard:'One leg at a time.' } },
  sideplank:{ en:'Side plank', me:'Side core', g:'core', eq:'none', lvl:2, lim:['shoulder'], x:{ steps:['Lie on your side, supported on your forearm.','Lift your hips so your body forms a straight line.','Hold, breathing steadily, then switch sides.'], err:['Hips sagging','Rolling the body forward or back'], easy:'Keep your knees on the floor.', hard:'Lift your top leg.' } },
  diamond: { en:'Diamond push-up', me:'Triceps, chest', g:'push', eq:'none', lvl:3, lim:['wrist','shoulder'], x:{ steps:['Hands close together under your chest, forming a diamond.','Keep elbows close to your body.','Lower and press up.'], err:['Elbows flaring out','Hips sagging'], easy:'Do it on your knees.', hard:'Slow lowering.' } },
  decline: { en:'Decline push-up', me:'Upper chest, shoulders', g:'push', eq:'none', lvl:3, lim:['wrist','shoulder'], x:{ steps:['Feet on a chair, hands on the floor.','Keep a straight body.','Lower and press up.'], err:['Hips sagging','Head dropping forward'], easy:'Regular push-up.', hard:'Higher surface or a pause at the bottom.' } },
  pullup:  { en:'Pull-up (or inverted row)', me:'Back, biceps', g:'pull', eq:'gym', lvl:3, lim:['shoulder'], x:{ steps:['Hang with an overhand grip wider than your shoulders.','Pull until your chin passes the bar.','Lower under control to a full hang.'], err:['Swinging with momentum','Half repetitions'], easy:'Table inverted row, or slow lowering only.', hard:'Add a pause at the top.' } },
  superman:{ en:'Superman', me:'Lower back', g:'pull', eq:'none', lvl:1, lim:['back'], x:{ steps:['Lie face down on the floor.','Lift arms and legs slightly together.','Hold for 2 seconds then lower.'], err:['Lifting too high and straining the back','Jerky movement'], easy:'Lift only the arms, then only the legs.', hard:'Hold for 5 seconds.' } },
  split:   { en:'Bulgarian split squat', me:'Quads, glutes', g:'legs', eq:'none', lvl:3, lim:['knee'], x:{ steps:['Rear foot on a chair behind you.','Lower straight down on the front leg.','Push through the front heel.'], err:['Front foot too close to the chair','Leaning far forward'], easy:'Regular split squat with both feet on the floor.', hard:'Hold weights.' } },
  sidelunge:{ en:'Side lunge', me:'Inner thighs, glutes', g:'legs', eq:'none', lvl:2, lim:['knee'], x:{ steps:['Take a wide step sideways.','Bend the moving leg while the other stays straight.','Push back to the start.'], err:['Heel lifting','Knee collapsing inward'], easy:'Smaller step.', hard:'Hold weights.' } },
  slbridge:{ en:'Single-leg glute bridge', me:'Glutes', g:'legs', eq:'none', lvl:2, lim:[], x:{ steps:['Glute bridge with one leg lifted.','Keep your hips level.','Lower slowly and switch.'], err:['Hips tilting to one side'], easy:'Regular bridge.', hard:'Add a pause at the top.' } },
  wallsit: { en:'Wall sit', me:'Quads', g:'legs', eq:'none', lvl:1, lim:['knee'], x:{ steps:['Back against the wall.','Slide down until thighs are parallel to the floor.','Hold.'], err:['Knees in front of the ankles','Resting hands on thighs'], easy:'Sit higher.', hard:'Extend the time or lift one leg.' } },
  hollow:  { en:'Hollow hold', me:'Abs', g:'core', eq:'none', lvl:2, lim:['back'], x:{ steps:['Lie on your back, lower back pressed to the floor.','Lift shoulders and legs slightly.','Hold.'], err:['Lower back arching off the floor'], easy:'Bend your knees.', hard:'Arms overhead.' } }
};

// ====== تمارين جديدة (عربي + إنجليزي) ======
const _N = (ar, en, m, me, g, eq, lvl, lim, sets, reps, rest, o) => ({ n: ar, en, m, me, g, eq, lvl, lim, sets, reps, rest, ...o });
const EX_NEW = {
  kneepush: _N('ضغط على الركبتين','Knee push-up','الصدر والكتف والترايسبس','Chest, shoulders, triceps','push','none',1,['wrist'],3,[8,15],75,{
    steps:['ضع ركبتيك على الأرض ويديك أوسع قليلاً من الكتفين','الجسم خط مستقيم من الرأس إلى الركبتين','انزل بصدرك نحو الأرض ثم ادفع للأعلى'], err:['هبوط الحوض','فتح المرفقين للجانبين'], easy:'ضغط على الحائط', hard:'ضغط عادي',
    x:{ steps:['Kneel with hands slightly wider than your shoulders.','Keep a straight line from head to knees.','Lower your chest toward the floor, then press up.'], err:['Hips sagging','Elbows flaring out'], easy:'Wall push-up', hard:'Regular push-up' } }),
  wallpush: _N('ضغط على الحائط','Wall push-up','الصدر والكتف','Chest, shoulders','push','none',1,[],3,[10,20],60,{
    steps:['قف أمام الحائط وضع يديك عليه بعرض الكتفين','ابتعد بقدميك خطوة والجسم مستقيم','اثنِ المرفقين وقرّب صدرك من الحائط ثم ادفع'], err:['انحناء الظهر','رفع الكعبين'], easy:'قرّب قدميك من الحائط', hard:'ضغط على الركبتين',
    x:{ steps:['Stand facing a wall, hands on it at shoulder width.','Step your feet back with a straight body.','Bend your elbows to bring your chest to the wall, then push away.'], err:['Arching the back','Lifting the heels'], easy:'Stand closer to the wall', hard:'Knee push-up' } }),
  crunch: _N('كرنش البطن','Crunch','البطن','Abs','core','none',1,['back'],3,[12,20],45,{
    steps:['استلقِ والركبتان مثنيتان والقدمان على الأرض','ضع يديك على جانبي الرأس بلا شد للرقبة','ارفع كتفيك عن الأرض بتقلص البطن ثم انزل ببطء'], err:['شد الرقبة بالأيدي','رفع الظهر كله'], easy:'ارفع قليلاً مع ذراعين ممدودتين', hard:'ثبّت ثانيتين في الأعلى',
    x:{ steps:['Lie on your back, knees bent, feet flat.','Place your hands beside your head without pulling your neck.','Lift your shoulders by contracting your abs, then lower slowly.'], err:['Pulling on the neck','Lifting the whole back'], easy:'Small lift with arms extended', hard:'Pause for 2 seconds at the top' } }),
  birddog: _N('الكلب والطائر','Bird dog','أسفل الظهر والجذع','Lower back, core','core','none',1,['wrist'],3,[8,12],45,{ perSide:true,
    steps:['على اليدين والركبتين، اليدان تحت الكتفين والركبتان تحت الحوض','مدّ ذراعاً أماماً وساقاً مقابلة للخلف','ثبّت ثانيتين مع ظهر مستقيم ثم بدّل'], err:['ميل الحوض','رفع الساق أعلى من الظهر'], easy:'مدّ الساق فقط', hard:'ثبّت 5 ثوانٍ',
    x:{ steps:['Start on hands and knees, hands under shoulders, knees under hips.','Extend one arm forward and the opposite leg back.','Hold 2 seconds with a flat back, then switch.'], err:['Hips rotating','Lifting the leg above back level'], easy:'Extend the leg only', hard:'Hold for 5 seconds' } }),
  highknees: _N('رفع الركبتين (جري في المكان)','High knees','القلب والفخذان','Cardio, hip flexors','cardio','none',1,['knee'],3,[20,40],45,{ unit:'ث',
    steps:['قف باستقامة','ارفع الركبة إلى مستوى الحوض بالتناوب بسرعة','حرّك ذراعيك بالتبادل مع الجري'], err:['الانحناء للخلف','نزول بثقل على الكعبين'], easy:'مشي برفع الركبتين', hard:'زد السرعة',
    x:{ steps:['Stand tall.','Drive each knee up to hip height in a quick alternating rhythm.','Swing your arms in opposition.'], err:['Leaning back','Landing heavily on the heels'], easy:'March in place', hard:'Increase the speed' } }),
  mountain: _N('متسلق الجبال','Mountain climbers','القلب والجذع','Cardio, core','cardio','none',2,['wrist'],3,[20,40],45,{ unit:'ث',
    steps:['وضع ضغط بذراعين مستقيمتين','اسحب ركبة نحو الصدر ثم بدّل بسرعة','حافظ على الحوض ثابتاً'], err:['رفع الحوض عالياً','الذراعان غير ثابتتين'], easy:'أبطئ الإيقاع', hard:'زد السرعة',
    x:{ steps:['Start in a high plank with straight arms.','Drive one knee toward your chest, then switch quickly.','Keep your hips steady.'], err:['Hips too high','Shoulders drifting back'], easy:'Slow the pace', hard:'Increase the speed' } }),
  dbpress: _N('ضغط الدمبل على الأرض','Dumbbell floor press','الصدر والترايسبس','Chest, triceps','push','tools',2,['shoulder'],4,[8,12],90,{
    steps:['استلقِ وبيد كل يد دمبل والمرفقان على الأرض','ادفع الدمبل للأعلى حتى تستقيم الذراعان','انزل ببطء حتى يلمس العضد الأرض'], err:['فتح المرفقين بزاوية 90° عن الجسم','رفع الظهر عن الأرض'], easy:'وزن أخف', hard:'نزول بطيء 3 ثوانٍ',
    x:{ steps:['Lie on your back holding a dumbbell in each hand, elbows on the floor.','Press the dumbbells up until your arms are straight.','Lower slowly until your upper arms touch the floor.'], err:['Elbows flared at 90°','Arching the back'], easy:'Lighter weight', hard:'3-second lowering' } }),
  dbshoulder: _N('ضغط الكتف بالدمبل','Dumbbell shoulder press','الكتفان والترايسبس','Shoulders, triceps','push','tools',2,['shoulder'],3,[8,12],90,{
    steps:['قف والدمبل عند الكتفين','ادفع للأعلى حتى تستقيم الذراعان','انزل ببطء إلى الكتفين'], err:['تقوّس أسفل الظهر','دفع الدمبل للأمام'], easy:'وزن أخف أو جلوس', hard:'ذراع واحدة',
    x:{ steps:['Stand with dumbbells at shoulder height.','Press overhead until your arms are straight.','Lower slowly back to your shoulders.'], err:['Arching the lower back','Pressing the weights forward'], easy:'Lighter weight or seated', hard:'One arm at a time' } }),
  lateral: _N('رفع جانبي بالدمبل','Lateral raise','الكتف الجانبي','Side shoulders','push','tools',1,['shoulder'],3,[10,15],60,{
    steps:['قف والدمبل بجانبيك والمرفقان مثنيان قليلاً','ارفع الذراعين جانباً حتى مستوى الكتف','انزل ببطء'], err:['استخدام زخم الجسم','رفع أعلى من الكتف'], easy:'وزن أخف', hard:'ثبّت ثانية في الأعلى',
    x:{ steps:['Stand with dumbbells at your sides, elbows slightly bent.','Raise your arms out to the sides to shoulder height.','Lower slowly.'], err:['Swinging the body','Raising above shoulder height'], easy:'Lighter weight', hard:'Pause for 1 second at the top' } }),
  dbrow: _N('تجديف بدمبل بذراع واحدة','One-arm dumbbell row','الظهر والبايسبس','Back, biceps','pull','tools',1,['back'],3,[8,12],75,{ perSide:true,
    steps:['ضع يداً وركبة على مقعد أو كرسي والظهر مستقيم','اسحب الدمبل نحو الخاصرة بالمرفق قريباً من الجسم','انزل ببطء'], err:['لف الجذع','سحب بالذراع فقط'], easy:'وزن أخف', hard:'ثبّت ثانية في الأعلى',
    x:{ steps:['Support one hand and knee on a bench or chair with a flat back.','Pull the dumbbell toward your hip, elbow close to your body.','Lower slowly.'], err:['Twisting the torso','Pulling with the arm only'], easy:'Lighter weight', hard:'Pause for 1 second at the top' } }),
  curl: _N('بايسبس بالدمبل','Dumbbell curl','البايسبس','Biceps','pull','tools',1,[],3,[10,15],60,{
    steps:['قف والدمبل بجانبيك والكفان للأمام','اثنِ المرفقين وارفع الدمبل نحو الكتفين','انزل ببطء مع ثبات المرفقين'], err:['تحريك الجسم','تحريك المرفقين للأمام'], easy:'وزن أخف', hard:'نزول بطيء',
    x:{ steps:['Stand with dumbbells at your sides, palms forward.','Curl the dumbbells up toward your shoulders.','Lower slowly with your elbows fixed.'], err:['Swinging the body','Elbows drifting forward'], easy:'Lighter weight', hard:'Slow lowering' } }),
  goblet: _N('قرفصاء كأس بدمبل','Goblet squat','الفخذان والأرداف','Quads, glutes','legs','tools',1,['knee'],4,[10,15],75,{
    steps:['أمسك دمبلاً عند الصدر بيديك','انزل بالقرفصاء والظهر مستقيم والمرفقان بين الركبتين','ادفع بالكعبين للأعلى'], err:['ميل الجذع للأمام','انهيار الركبتين للداخل'], easy:'قرفصاء بوزن الجسم', hard:'وزن أثقل',
    x:{ steps:['Hold a dumbbell at your chest with both hands.','Squat down with a straight back, elbows between your knees.','Drive up through your heels.'], err:['Leaning the torso forward','Knees collapsing inward'], easy:'Bodyweight squat', hard:'Heavier weight' } }),
  rdl: _N('رفعة ميتة رومانية بالدمبل','Dumbbell Romanian deadlift','الخلفية والأرداف','Hamstrings, glutes','legs','tools',2,['back'],3,[8,12],90,{
    steps:['قف والدمبل أمام الفخذين والركبتان مرنتان','ادفع الحوض للخلف وانزل بالدمبل قرب الساقين والظهر مستقيم','ارجع بدفع الحوض للأمام'], err:['تقوّس الظهر','ثني الركبتين كثيراً'], easy:'وزن أخف', hard:'ساق واحدة',
    x:{ steps:['Stand with dumbbells in front of your thighs, knees soft.','Push your hips back and lower the weights close to your legs with a flat back.','Return by driving your hips forward.'], err:['Rounding the back','Bending the knees too much'], easy:'Lighter weight', hard:'Single leg' } }),
  barsquat: _N('قرفصاء بالبار','Barbell back squat','الفخذان والأرداف','Quads, glutes','legs','gym',2,['knee','back'],4,[6,10],120,{
    steps:['ضع البار على أعلى الظهر وقف بعرض الكتفين','انزل حتى توازي الفخذان الأرض والظهر مستقيم','ادفع بالكعبين للأعلى'], err:['ميل الجذع','رفع الكعبين'], easy:'وزن أخف أو قرفصاء كأس', hard:'وزن أثقل',
    x:{ steps:['Rest the bar on your upper back, feet shoulder-width apart.','Lower until your thighs are parallel to the floor with a flat back.','Drive up through your heels.'], err:['Leaning forward','Heels lifting'], easy:'Lighter weight or goblet squat', hard:'Heavier weight' } }),
  bench: _N('ضغط البنش بالبار','Barbell bench press','الصدر والترايسبس','Chest, triceps','push','gym',2,['shoulder'],4,[6,10],120,{
    steps:['استلقِ على البنش والقدمان ثابتتان وامسك البار أوسع من الكتفين','انزل بالبار إلى منتصف الصدر','ادفع للأعلى حتى تستقيم الذراعان'], err:['رفع الأرداف','ارتداد البار عن الصدر'], easy:'دمبل بوزن أخف', hard:'وزن أثقل مع مساعد',
    x:{ steps:['Lie on the bench with feet planted, grip the bar wider than your shoulders.','Lower the bar to mid-chest.','Press up until your arms are straight.'], err:['Lifting the hips','Bouncing the bar off the chest'], easy:'Lighter dumbbells', hard:'Heavier weight with a spotter' } }),
  ohp: _N('ضغط الكتف بالبار','Barbell overhead press','الكتفان والترايسبس','Shoulders, triceps','push','gym',2,['shoulder','back'],3,[6,10],120,{
    steps:['قف والبار عند الترقوة','شد البطن وادفع البار فوق الرأس','انزل ببطء إلى الترقوة'], err:['تقوّس الظهر','دفع البار للأمام'], easy:'دمبل', hard:'وزن أثقل',
    x:{ steps:['Stand with the bar at your collarbone.','Brace your abs and press the bar overhead.','Lower slowly to the collarbone.'], err:['Arching the back','Pressing the bar forward'], easy:'Dumbbells', hard:'Heavier weight' } }),
  bentrow: _N('تجديف بالبار','Barbell bent-over row','الظهر والبايسبس','Back, biceps','pull','gym',2,['back'],4,[6,10],90,{
    steps:['انحنِ من الحوض والظهر مستقيم وامسك البار','اسحب البار نحو أسفل الصدر','انزل ببطء'], err:['تقوّس الظهر','تحريك الجذع'], easy:'دمبل بذراع واحدة', hard:'وزن أثقل',
    x:{ steps:['Hinge at the hips with a flat back and grip the bar.','Pull the bar toward your lower chest.','Lower slowly.'], err:['Rounding the back','Heaving with the torso'], easy:'One-arm dumbbell row', hard:'Heavier weight' } }),
  deadlift: _N('رفعة ميتة','Deadlift','الظهر والخلفية والأرداف','Back, hamstrings, glutes','legs','gym',3,['back'],3,[4,8],150,{
    steps:['قف والبار فوق منتصف القدمين','انحنِ وامسك البار والظهر مستقيم والصدر مرفوع','ادفع بالأرض وافرد الحوض والركبتين معاً','انزل بالبار قريباً من الساقين'], err:['تقوّس الظهر','سحب البار بعيداً عن الجسم'], easy:'رفعة رومانية بدمبل', hard:'وزن أثقل',
    x:{ steps:['Stand with the bar over mid-foot.','Hinge and grip the bar with a flat back and lifted chest.','Push the floor away, extending hips and knees together.','Lower the bar close to your legs.'], err:['Rounding the back','Letting the bar drift away from the body'], easy:'Dumbbell Romanian deadlift', hard:'Heavier weight' } })
};

// دمج: التمارين الحالية تأخذ البيانات الإضافية، والجديدة تُضاف
(function () {
  for (const id in EX_META) Object.assign(EXERCISES[id], EX_META[id]);
  for (const id in EX_NEW) EXERCISES[id] = EX_NEW[id];
  for (const id in EXERCISES) { const e = EXERCISES[id]; e.id = id; e.pose = POSES[id]; if (!e.x) e.x = null; }
})();

// ====== مولّد البرنامج حسب إجابات المستخدم ======
const SESS_TYPES = { full: ['جسم كامل', 'Full body'], upper: ['علوي', 'Upper'], lower: ['سفلي', 'Lower'], push: ['دفع', 'Push'], pull: ['سحب', 'Pull'], legs: ['أرجل', 'Legs'] };
function genProgram(a) {
  const lv = +a.level || 2, n = a.days.length, slots = { 30: 4, 45: 5, 60: 6, 75: 7 }[a.dur] || 5, limits = a.limits || [];
  const T = { 1: ['full'], 2: ['full', 'full'], 3: ['full', 'full', 'full'], 4: ['upper', 'lower', 'upper', 'lower'], 5: ['push', 'pull', 'legs', 'upper', 'lower'], 6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] }[n] || ['full'];
  const SEQ = { full: ['legs', 'push', 'pull', 'legs', 'core', 'push', 'pull'], upper: ['push', 'pull', 'push', 'pull', 'core', 'push', 'pull'], lower: ['legs', 'legs', 'legs', 'legs', 'core', 'legs', 'core'], push: ['push', 'push', 'push', 'push', 'core', 'push', 'push'], pull: ['pull', 'pull', 'pull', 'pull', 'core', 'pull', 'pull'], legs: ['legs', 'legs', 'legs', 'legs', 'core', 'legs', 'core'] };
  const eqOk = { home: ['none'], tools: ['none', 'tools'], gym: ['none', 'tools', 'gym'] }[a.place] || ['none'], eqRank = e => ({ home: { none: 0 }, tools: { tools: 0, none: 1 }, gym: { gym: 0, tools: 1, none: 2 } }[a.place] || { none: 0 })[e.eq] ?? 3;
  const all = Object.values(EXERCISES).filter(e => eqOk.includes(e.eq) && !e.lim.some(l => limits.includes(l)));
  const score = e => eqRank(e) * 10 + (e.lvl > lv ? 20 + (e.lvl - lv) * 5 : lv - e.lvl);
  const used = {}, cnt = {}, tot = {}; T.forEach(t => tot[t] = (tot[t] || 0) + 1);
  const sessions = T.map(t => {
    const prev = used[t] ||= new Set(), mine = new Set(), ex = [], need = SEQ[t].slice(0, slots);
    if (a.goal === 'fat') need[need.length - 1] = 'cardio';
    const pick = g => {
      let cands = all.filter(e => e.g === g && !mine.has(e.id) && e.lvl <= lv + 1); const hi = cands.filter(e => e.lvl >= lv - 1); if (hi.length) cands = hi; cands.sort((x, y) => score(x) - score(y));
      const fresh = cands.filter(e => !prev.has(e.id)); return (fresh[0] || cands[0]);
    };
    for (const g of need) { const e = pick(g) || pick('core') || pick('legs'); if (e) { mine.add(e.id); ex.push(e.id); } }
    mine.forEach(id => prev.add(id)); if (prev.size > 12) used[t] = new Set(mine);
    cnt[t] = (cnt[t] || 0) + 1; const L = tot[t] > 1 ? ' ' + 'ABC'[cnt[t] - 1] : '';
    return { n: SESS_TYPES[t][0] + L, en: SESS_TYPES[t][1] + L, t, ex };
  });
  return { set: 1, goal: a.goal || 'muscle', level: lv, place: a.place || 'home', limits, dur: a.dur, sessions };
}
// مقادير التمرين حسب الهدف والمستوى
function exParams(id, prog) {
  const e = EXERCISES[id], g = prog?.goal || 'muscle', lv = prog?.level || 2; let sets = e.sets, [lo, hi] = e.reps, rest = e.rest;
  if (e.unit === 'ث') { const f = lv === 1 ? .7 : lv === 3 ? 1.3 : 1; lo = Math.round(lo * f); hi = Math.round(hi * f); }
  else if (g === 'strength' && e.eq !== 'none') { lo = 4; hi = 8; rest = Math.round(rest * 1.4); }
  else if (g === 'fat') { lo = Math.round(lo * 1.2); hi = Math.round(hi * 1.3); rest = Math.max(30, Math.round(rest * .7)); }
  if (lv === 1) sets = Math.max(2, sets - 1);
  return { sets, reps: [lo, hi], rest };
}
// رسم التمرين: إطاران (بداية/نهاية)
function exFigs(id) {
  const p = EXERCISES[id]?.pose; if (!p) return '';
  return `<div class="figs">${p.map((x, i) => `<div class="figbox">${figSvg(x)}<small>${LANG === 'en' ? (p.length > 1 ? (i ? 'End' : 'Start') : 'Hold') : (p.length > 1 ? (i ? 'النهاية · End' : 'البداية · Start') : 'الوضعية · Hold')}</small></div>`).join('')}</div>`;
}
