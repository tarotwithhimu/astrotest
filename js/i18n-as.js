// Assamese completion layer.
// Translates app-generated English headings, notes and sentence templates that have no entry in the main
// dictionary (i18n.js). Runs only when the interface language is Assamese. BPHS yoga wording for chapters 35, 37, 38 and 75 is translated through data/bphs-as.json; the chapter summaries and other yoga chapters still come from the source language.
(function(){
const EXm=new Map(),RULES=[];
const add=pairs=>pairs.forEach(p=>EXm.set(p[0],p[1]));
const rule=(re,fn)=>RULES.push([re,fn]);
const T=s=>{const r=trText(s);return r==null?s:r};
const PL=s=>(typeof tx=='function'?tx(s):s);
const ORD={1:'1ম',2:'2য়',3:'3য়',4:'4ৰ্থ',5:'5ম',6:'6ষ্ঠ',7:'7ম',8:'8ম',9:'9ম',10:'10ম',11:'11তম',12:'12তম'};
const ord=n=>ORD[+n]||(n+'ম');
add([
['Scheme','পদ্ধতি'],
['7 karakas (no nodes)','7 কাৰক (ৰাহু-কেতু নোহোৱাকৈ)'],
['8 karakas (with Rahu)','8 কাৰক (ৰাহুসহ)'],
['Rahu + Ketu both','ৰাহু আৰু কেতু দুয়োটা'],
['Ranked by full degree-minute-second value, not whole degrees. 7-karaka: Sun to Saturn; 8-karaka: adds Rahu; 9-body: adds Ketu too. Rahu and Ketu use reversed degree (30° minus degree in sign), so Ketu ties with Rahu and is shown without a karaka name beyond the eighth. Karakamsa is the Atmakaraka’s Navamsa sign; this is a placement reference, not a full Jaimini interpretation.','সম্পূৰ্ণ অংশ-কলা-বিকলা মানৰ ভিত্তিত ক্ৰম কৰা হৈছে, কেৱল পূৰ্ণ অংশৰ ভিত্তিত নহয়। 7-কাৰক: সূৰ্যৰ পৰা শনিলৈ; 8-কাৰক: ৰাহু যোগ হয়; 9-গ্ৰহ: কেতুও যোগ হয়। ৰাহু আৰু কেতুৱে উলটা অংশ (30° বিয়োগ ৰাশিৰ অংশ) ব্যৱহাৰ কৰে, সেয়ে কেতু ৰাহুৰ সৈতে সমান হয় আৰু অষ্টমৰ পিছত কাৰকৰ নাম অবিহনে দেখুওৱা হয়। কাৰকাংশ হৈছে আত্মকাৰকৰ নৱাংশ ৰাশি; এয়া অৱস্থানৰ উল্লেখ, সম্পূৰ্ণ জৈমিনী ব্যাখ্যা নহয়।'],
['Natal placements on the fixed-sign Tripataki chakra (Taurus is always the centre flag; signs run anticlockwise from the top right).','নিৰ্দিষ্ট-ৰাশিৰ ত্ৰিপতাকী চক্ৰত জন্মৰ অৱস্থান (বৃষ সদায় মাজৰ পতাকা; ৰাশিবোৰ ওপৰৰ সোঁফালৰ পৰা বাওঁফালে ঘড়ীৰ বিপৰীত দিশত চলে)।'],
['Linked signs','সংযুক্ত ৰাশিসমূহ'],
['Vedha links follow the lines of the Tripataki chakra: two signs are linked when one straight line joins them. The Dhoom→Vyatipat→Parivesh→Chap→Upaketu chain and Gulika (Mandi) follow the supplied BPHS Ch. 3 rules. BPHS describes the Upagrahas as malefic by nature; this panel shows placements only. Gulika uses the app’s sunrise model and entered fixed UTC offset. This is not a complete PRC timing analysis: Dandesh/Ardhayamesh and age-specific rules are omitted. No childhood-harm, disease, disability, longevity or death prediction is produced.','বেধ-সংযোগবোৰ ত্ৰিপতাকী চক্ৰৰ ৰেখা অনুসৰি: দুটা ৰাশিক এডাল সৰল ৰেখাই সংযোগ কৰিলে সিহঁত সংযুক্ত। ধূম→ব্যতীপত→পৰিবেশ→চাপ→উপকেতু শৃঙ্খলা আৰু গুলিকা (মাণ্ডী) যোগান ধৰা BPHS অধ্যায় 3 ৰ নিয়ম অনুসৰি। BPHS য়ে উপগ্ৰহসমূহক স্বভাৱত অশুভ বুলি বৰ্ণনা কৰিছে; এই পেনেলে কেৱল অৱস্থান দেখুৱায়। গুলিকাৰ বাবে এপৰ সূৰ্যোদয় নমুনা আৰু দিয়া নিৰ্দিষ্ট UTC অফছেট ব্যৱহাৰ কৰা হৈছে। এয়া সম্পূৰ্ণ PRC সময়-বিশ্লেষণ নহয়: দণ্ডেশ/অৰ্ধযামেশ আৰু বয়স-নিৰ্দিষ্ট নিয়ম বাদ দিয়া হৈছে। শৈশৱৰ ক্ষতি, ৰোগ, অক্ষমতা, আয়ুস বা মৃত্যুৰ কোনো পূৰ্বাভাস দিয়া হোৱা নাই।'],
['Tripataki chakra','ত্ৰিপতাকী চক্ৰ'],
]);

// ---------- interface chrome
add([
['Vedic astrology · Lahiri ayanamsha','বৈদিক জ্যোতিষ · লাহিড়ী অয়নাংশ'],
['Jyotish Kundli home','জ্যোতিষ কুণ্ডলীৰ মূল পৃষ্ঠা'],
['Display preferences','প্ৰদৰ্শনৰ পছন্দ'],
['Light / dark','পোহৰ / আন্ধাৰ'],
['Light or dark theme','পোহৰ বা আন্ধাৰ থীম'],
['Place suggestions','স্থানৰ পৰামৰ্শ'],
['Sections','অংশসমূহ'],
['Try: bhava, dasha, yoga, ashtakavarga…','চেষ্টা কৰক: ভাৱ, দশা, যোগ, অষ্টকবৰ্গ…'],
['Ayana / Ritu','অয়ন / ঋতু'],
['Moon & Sun combinations','চন্দ্ৰ আৰু সূৰ্যৰ সংযোগ'],
['Ayanamsha (table)','অয়নাংশ (তালিকা)'],
['Moon daily motion','চন্দ্ৰৰ দৈনিক গতি'],
['Sunrise / sunset in table (IST)','তালিকাত সূৰ্যোদয় / সূৰ্যাস্ত (IST)'],
['Star lord no.','নক্ষত্ৰপতিৰ ক্ৰম'],
['Textbox10Other (unidentified)','Textbox10 অন্য (চিনাক্ত কৰা হোৱা নাই)'],
['Adhika flag (TextBox41)','অধিক চিহ্ন (TextBox41)'],
['Ayanamsha as printed (TextBox22)','মুদ্ৰিত অয়নাংশ (TextBox22)'],
['Table rows (Recnum)','তালিকাৰ শাৰী (Recnum)'],
['Events (ghati:pala:vipala after sunrise → IST clock)','ঘটনা (সূৰ্যোদয়ৰ পিছত ঘটী:পল:বিপল → IST সময়)'],
['Chart positions come from this table, interpolated to the birth time.','কুণ্ডলীৰ গ্ৰহস্থিতি এই তালিকাৰ পৰা লোৱা হৈছে আৰু জন্মৰ সময়লৈ আন্তৰ্বেশন কৰা হৈছে।'],
['Hindi','হিন্দী'],
['Print / save PDF','প্ৰিণ্ট / PDF ৰূপে সংৰক্ষণ'],
['Debilitation','নীচ'],['debilitated','নীচ'],['Exaltation','উচ্চ'],['Own sign(s)','স্বক্ষেত্ৰ'],
['Present','আছে'],
]);
const CITY={Guwahati:'গুৱাহাটী',Kolkata:'কলকাতা',Bengaluru:'বেঙ্গালুৰু',Delhi:'দিল্লী',Mumbai:'মুম্বাই',Chennai:'চেন্নাই',Hyderabad:'হায়দ্ৰাবাদ',Varanasi:'বাৰাণসী',London:'লণ্ডন',Custom:'নিজৰ পছন্দৰ'};
rule(/^(\d{4}-\d\d-\d\d · \d\d:\d\d) · (.+)$/,m=>`${m[1]} · ${CITY[m[2]]||m[2]}`);
const SM={Prabhava:'প্ৰভৱ',Vibhava:'বিভৱ',Shukla:'শুক্ল',Pramoda:'প্ৰমোদ',Prajapati:'প্ৰজাপতি',Angirasa:'অঙ্গিৰা',Srimukha:'শ্ৰীমুখ',Bhava:'ভাৱ',Yuva:'যুৱা',Dhatri:'ধাতৃ',Ishvara:'ঈশ্বৰ',Bahudhanya:'বহুধান্য',Pramathi:'প্ৰমাথী',Vikrama:'বিক্ৰম',Vrisha:'বৃষ',Chitrabhanu:'চিত্ৰভানু',Subhanu:'সুভানু',Tarana:'তাৰণ',Parthiva:'পাৰ্থিৱ',Vyaya:'ব্যয়',Sarvajit:'সৰ্বজিৎ',Sarvadhari:'সৰ্বধাৰী',Virodhi:'বিৰোধী',Vikriti:'বিকৃতি',Khara:'খৰ',Nandana:'নন্দন',Vijaya:'বিজয়',Jaya:'জয়',Manmatha:'মন্মথ',Durmukhi:'দুৰ্মুখী',Hevilambi:'হেৱিলম্বী',Vilambi:'বিলম্বী',Vikari:'বিকাৰী',Sharvari:'শাৰ্বৰী',Plava:'প্লৱ',Shubhakrit:'শুভকৃত',Shobhakrit:'শোভকৃত',Krodhi:'ক্ৰোধী',Vishvavasu:'বিশ্বাৱসু',Parabhava:'পৰাভৱ',Plavanga:'প্লৱঙ্গ',Kilaka:'কীলক',Saumya:'সৌম্য',Sadharana:'সাধাৰণ',Virodhikrit:'বিৰোধকৃত',Paridhavi:'পৰিধাৱী',Pramadicha:'প্ৰমাদীচ',Ananda:'আনন্দ',Rakshasa:'ৰাক্ষস',Nala:'নল',Pingala:'পিঙ্গল',Kalayukta:'কালযুক্ত',Siddharthi:'সিদ্ধাৰ্থী',Raudra:'ৰৌদ্ৰ',Durmati:'দুৰ্মতি',Dundubhi:'দুন্দুভি',Rudhirodgari:'ৰুধিৰোদ্গাৰী',Raktakshi:'ৰক্তাক্ষী',Krodhana:'ক্ৰোধন',Akshaya:'অক্ষয়'};
rule(/^(\d{3,4}) ([A-Za-z]+)( \(table\))?$/,m=>SM[m[2]]?`${m[1]} ${SM[m[2]]}${m[3]?' (তালিকা)':''}`:null);
rule(/^(.+) \(table\)$/,m=>/[A-Za-z]{3,}/.test(m[1])&&!trText(m[1])?null:`${T(m[1])} (তালিকা)`);
rule(/^(\d{4}-\d\d-\d\d \d\d:\d\d) UT \(table row (\d+) of (\d+)\)$/,m=>`${m[1]} UT (তালিকাৰ ${m[3]} শাৰীৰ ভিতৰত ${m[2]} নং শাৰী)`);
rule(/^(\d) \((Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\)$/,m=>`${m[1]} (${PL(m[2])})`);
rule(/^Gauhati, (.+), Hindi$/,m=>`গুৱাহাটী, ${m[1].replace(/:N\b/,':উ').replace(/:E\b/g,':পূ').replace('meridian','মধ্যৰেখা')}, হিন্দী`);
rule(/^Day-part times in ghati from sunrise \(meaning of these six columns not identified\): (.*)$/,m=>`সূৰ্যোদয়ৰ পৰা ঘটীত দিনৰ অংশৰ সময় (এই ছটা স্তম্ভৰ অৰ্থ চিনাক্ত কৰা হোৱা নাই): ${m[1]}`);
rule(/^table text: (.*)$/,m=>`তালিকাৰ মূল পাঠ: ${m[1]}`);

// ---------- yogas, house groups
const YN={Sunapha:'সুনফা',Anapha:'অনফা',Duradhara:'দুৰুধৰা','Kema Druma':'কেমদ্ৰুম',Ubhayachari:'উভয়চাৰী',Vesi:'বেশী',Vosi:'বোশী',Gada:'গদা',Sakata:'শকট',Vihaga:'বিহগ',Shringataka:'শৃঙ্গাটক',Nauka:'নৌকা',Koot:'কূট',Chatr:'ছত্ৰ',Chap:'চাপ','Ardh Candr':'অৰ্ধচন্দ্ৰ',Vapi:'বাপী',Kamala:'কমল',Chakra:'চক্ৰ',Samudra:'সমুদ্ৰ',Rajju:'ৰজ্জু',Musala:'মুসল',Nala:'নল',Gola:'গোল',Yuga:'যুগ',Soola:'শূল',Kedara:'কেদাৰ',Paasha:'পাশ',Daama:'দাম',Veena:'বীণা',Hal:'হল',Shar:'শৰ',Shakti:'শক্তি',Danda:'দণ্ড',Yup:'যূপ'};
const YK=Object.keys(YN).join('|');
rule(new RegExp(`^(${YK}) Yoga$`),m=>`${YN[m[1]]} যোগ`);
rule(new RegExp(`^(${YK}) Nabhasa pattern$`),m=>`${YN[m[1]]} নাভস যোগ`);
rule(new RegExp(`^(${YK}) Sankhya pattern$`),m=>`${YN[m[1]]} সংখ্যা যোগ`);
rule(/^Kema Druma basic pattern$/,()=>'কেমদ্ৰুম মূল গঠন');
add([['Basic pattern','মূল গঠন'],['Nabhasa pattern','নাভস গঠন'],['Sankhya pattern','সংখ্যা গঠন'],['Nabhasa patterns','নাভস গঠনসমূহ'],
['Kendra','কেন্দ্ৰ'],['Panaphara','পণফৰ'],['Apoklima','আপোক্লিম']]);
rule(/^Moon from Sun: (Kendra|Panaphara|Apoklima)$/,m=>`সূৰ্যৰ পৰা চন্দ্ৰ: ${T(m[1])}`);
rule(/^Moon occupies house (\d+) by sign-count from the Sun\.$/,m=>`ৰাশি গণনাত সূৰ্যৰ পৰা চন্দ্ৰ ভাৱ ${m[1]}ত আছে।`);
rule(/^One or more eligible planets occur in the (\d+)(?:st|nd|rd|th) sign from the (Moon|Sun)\.$/,m=>`এক বা একাধিক যোগ্য গ্ৰহ ${PL(m[2])}ৰ পৰা ${ord(m[1])} ৰাশিত আছে।`);
rule(/^Eligible planets occur in both the (\d+)(?:st|nd|rd|th) and (\d+)(?:st|nd|rd|th) signs from the (Moon|Sun)\.$/,m=>`যোগ্য গ্ৰহ ${PL(m[3])}ৰ পৰা ${ord(m[1])} আৰু ${ord(m[2])} দুয়ো ৰাশিত আছে।`);
rule(/^(\d+)(?:st|nd|rd|th): ([A-Za-z, ]+?) · (\d+)(?:st|nd|rd|th): ([A-Za-z, ]+)$/,m=>{const L=x=>x.split(', ').map(PL).join(', ');return `${ord(m[1])}: ${L(m[2])} · ${ord(m[3])}: ${L(m[4])}`});
rule(/^The seven classical planets occupy (\d+) distinct signs\.$/,m=>`সাতটা শাস্ত্ৰীয় গ্ৰহে ${m[1]}টা পৃথক ৰাশি অধিকাৰ কৰিছে।`);
rule(/^Signs represented: (.+)\.$/,m=>`প্ৰতিনিধিত্ব কৰা ৰাশি: ${m[1]}।`);
add([
['No Graha other than the Sun is with the Moon, in the 2nd or 12th from the Moon, or in a kendra from the Lagna.','সূৰ্যৰ বাহিৰে আন কোনো গ্ৰহ চন্দ্ৰৰ লগত, চন্দ্ৰৰ পৰা 2য় বা 12তম ভাৱত, অথবা লগ্নৰ পৰা কেন্দ্ৰত নাই।'],
['Conjunction check and kendra check use all modeled non-Sun Grahas, including Rahu/Ketu. Other strength or exception rules are not assessed.','যুতি আৰু কেন্দ্ৰ পৰীক্ষাত ৰাহু/কেতুসহ সূৰ্য বাদে সকলো গ্ৰহ ধৰা হৈছে। আন বল বা ব্যতিক্ৰমৰ নিয়ম বিচাৰ কৰা হোৱা নাই।'],
['Placement classification only; no result is inferred here.','কেৱল অৱস্থানৰ শ্ৰেণীবিভাজন; ইয়াত কোনো ফল অনুমান কৰা হোৱা নাই।'],
['The seven classical planets occupy seven continuous houses beginning at a non-kendra house.','সাতটা শাস্ত্ৰীয় গ্ৰহে কেন্দ্ৰ নোহোৱা ভাৱৰ পৰা আৰম্ভ হৈ সাতটা অবিচ্ছিন্ন ভাৱ অধিকাৰ কৰিছে।'],
['All seven classical planets are confined to the Apoklima or Panaphara houses.','সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে কেৱল আপোক্লিম বা পণফৰ ভাৱত আছে।'],
['All seven classical planets are confined to the four kendras (1, 4, 7, 10).','সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে কেৱল চাৰিটা কেন্দ্ৰত (1, 4, 7, 10) আছে।'],
['All seven classical planets are confined to alternating odd houses.','সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে একান্তৰ বিজোড় ভাৱত আছে।'],
['All seven classical planets are confined to alternating even houses.','সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে একান্তৰ যুগ্ম ভাৱত আছে।'],
['No listed Moon/Sun placement pattern was detected. This does not assess aspect-based yogas or other cancellation rules.','তালিকাভুক্ত চন্দ্ৰ/সূৰ্যৰ অৱস্থান-গঠন কোনো পোৱা নগ’ল। ইয়াত দৃষ্টিভিত্তিক যোগ বা আন ভঙ্গ-নিয়ম বিচাৰ কৰা হোৱা নাই।'],
['No strict Nabhasa pattern was detected for the seven classical planets.','সাতটা শাস্ত্ৰীয় গ্ৰহৰ বাবে কোনো কঠোৰ নাভস গঠন পোৱা নগ’ল।'],
['BPHS Ch. 37 follows “Graha other than Sūrya” literally, including the app’s Rahu/Ketu positions. Ch. 38 says “Graha among Mangala etc.” without enumerating the full set, so its detector conservatively checks Mars–Saturn only. The cited traditional outcomes are shown with their qualifications.','BPHS অধ্যায় 37 ত “সূৰ্য বাহিৰে আন গ্ৰহ” শব্দটো আক্ষৰিকভাৱে অনুসৰণ কৰা হৈছে, এই এপৰ ৰাহু/কেতুৰ স্থিতিসহ। অধ্যায় 38 ত “মঙ্গল আদি গ্ৰহ” বুলি সম্পূৰ্ণ তালিকা দিয়া হোৱা নাই; সেয়ে ইয়াৰ ডিটেক্টৰে সতৰ্কভাৱে কেৱল মঙ্গল–শনি পৰীক্ষা কৰে। উদ্ধৃত পাৰম্পৰিক ফলসমূহ তাৰ শৰ্তসহ দেখুওৱা হৈছে।'],
['BPHS result:','BPHS ফল:'],
['A result entry for this detected formation was not matched in the source index.','চিনাক্ত হোৱা এই গঠনৰ বাবে উৎস-সূচীত কোনো ফলৰ প্ৰৱিষ্টি মিলা নাই।'],
['[Sensitive health, longevity, or mortality claims omitted.]','[সংবেদনশীল স্বাস্থ্য, আয়ুস বা মৃত্যু-সম্পৰ্কীয় দাবী বাদ দিয়া হৈছে।]'],
['Sensitive health, longevity, or mortality claims are omitted from this view.','সংবেদনশীল স্বাস্থ্য, আয়ুস বা মৃত্যু-সম্পৰ্কীয় দাবী এই দৃশ্যৰ পৰা বাদ দিয়া হৈছে।'],
['Some sensitive qualifications from the cited passage are omitted.','উদ্ধৃত অংশৰ কিছুমান সংবেদনশীল শৰ্ত বাদ দিয়া হৈছে।'],
['Source qualifications:','উৎসৰ শৰ্তসমূহ:'],
['Historical rule (sensitive claims omitted)','ঐতিহাসিক নিয়ম (সংবেদনশীল দাবী বাদ দিয়া হৈছে)'],
['Formation:','গঠন:'],
['Input fit (not a chart detection):','উপাত্তৰ উপযোগিতা (কুণ্ডলীত চিনাক্তকৰণ নহয়):'],
['Yoga / combination formations and results','যোগ / সংযোগৰ গঠন আৰু ফল'],
['No distinct result statement is given in the cited passage.','উদ্ধৃত অংশত কোনো পৃথক ফলৰ বিৱৰণ দিয়া হোৱা নাই।'],
['How to read these traditional results','এই পাৰম্পৰিক ফলসমূহ কেনেকৈ পঢ়িব'],
['Each result states the BPHS interpretation and keeps its source qualifications separate. The text’s asserted outcome is not rewritten as a vague theme, but a detected placement alone does not establish strength, cancellation or timing, nor guarantee an event. The app does not yet evaluate every aspect-based rule, complete Shadbala, divisional confirmation, special Lagna condition or exception.','প্ৰতিটো ফলত BPHS ৰ ব্যাখ্যা দিয়া হৈছে আৰু উৎসৰ শৰ্তসমূহ পৃথকে ৰখা হৈছে। পাঠত কোৱা ফলক অস্পষ্ট বিষয়বস্তুলৈ সলনি কৰা হোৱা নাই, কিন্তু কেৱল চিনাক্ত হোৱা অৱস্থানে বল, ভঙ্গ বা সময় নিৰ্ধাৰণ নকৰে, আৰু কোনো ঘটনাৰ নিশ্চয়তাও নিদিয়ে। এই এপে এতিয়ালৈ প্ৰতিটো দৃষ্টিভিত্তিক নিয়ম, সম্পূৰ্ণ ষড়বল, বৰ্গ-সমৰ্থন, বিশেষ লগ্ন অৱস্থা বা ব্যতিক্ৰম মূল্যায়ন কৰা নাই।'],
['Pancha Mahapurusha yogas','পঞ্চ মহাপুৰুষ যোগ'],['Traditional BPHS result','পাৰম্পৰিক BPHS ফল'],
['BPHS Library · all 97 chapters','BPHS পুথিভঁৰাল · সকলো 97 অধ্যায়'],
]);
rule(/^Sensitive health, longevity, or mortality claims are omitted from this view\.\.$/,()=>'সংবেদনশীল স্বাস্থ্য, আয়ুস বা মৃত্যু-সম্পৰ্কীয় দাবী এই দৃশ্যৰ পৰা বাদ দিয়া হৈছে।');
rule(/^Historical BPHS text \(not a prediction\)(.*)$/,m=>`ঐতিহাসিক BPHS পাঠ (ভবিষ্যদ্বাণী নহয়)${m[1]}`);
rule(/^BPHS Ch\. ([\d–\-]+(?: and [\d/]+)?)(?:, (vv?)\. ([\d–\-]+))?(?:([.:]) (.+))?$/,m=>{
 const pre=`BPHS অধ্যায় ${m[1].replace(' and ',' আৰু ')}${m[2]?`, শ্লোক ${m[3]}`:''}`;
 if(!m[5])return pre;
 const r=EXm.get(m[5]);return r?`${pre}${m[4]=='.'?'।':':'} ${r}`:null});
rule(/^Source: supplied BPHS English edition, Chapter (\d+)\.$/,m=>`উৎস: যোগান ধৰা BPHS ইংৰাজী সংস্কৰণ, অধ্যায় ${m[1]}।`);
rule(/^(\d+) chapters$/,m=>`${m[1]} টা অধ্যায়`);
rule(/^(\d+) topics$/,m=>`${m[1]} টা বিষয়`);
rule(/^(\d+) chapters · (\d+) rule-family entries · (\d+) table\/data references · (\d+) source-outcome statements indexed$/,m=>`${m[1]} টা অধ্যায় · ${m[2]} টা নিয়ম-গোটৰ প্ৰৱিষ্টি · ${m[3]} টা তালিকা/উপাত্ত উল্লেখ · ${m[4]} টা উৎস-ফলৰ বিৱৰণ সূচীভুক্ত`);
add([['Topics','বিষয়সমূহ'],['Tables & data','তালিকা আৰু উপাত্ত'],['Limits and cautions','সীমা আৰু সতৰ্কতা'],['Rule families','নিয়ম-গোট'],['Possible app tools','সম্ভাব্য এপ সঁজুলি']]);
add([
['Search a concise, chapter-by-chapter paraphrased guide to topics, rule families, tables, specific yoga results and app-tool possibilities from the supplied edition. This is a reference index, not a copy of the book.','যোগান ধৰা সংস্কৰণৰ বিষয়, নিয়ম-গোট, তালিকা, নিৰ্দিষ্ট যোগফল আৰু এপ-সঁজুলিৰ সম্ভাৱনাৰ অধ্যায়ভিত্তিক সংক্ষিপ্ত সাৰাংশ-সূচী ইয়াত বিচাৰিব পাৰি। এয়া এখন ৰেফাৰেন্স সূচী, কিতাপৰ প্ৰতিলিপি নহয়। টোকা: অধ্যায়ৰ সাৰাংশ আৰু যোগফলৰ বিৱৰণ মূল ইংৰাজী উৎস-পাঠৰ সৈতে মিল ৰাখিবলৈ ইংৰাজীতে ৰখা হৈছে।'],
['Search the chapter guide','অধ্যায়-সূচীত বিচাৰক'],
['Reading the source responsibly','উৎস দায়িত্বশীলভাৱে পঢ়ক'],
['This is a historical astrological text; its traditional claims are not empirically validated. Chapter summaries paraphrase rather than reproduce extended passages, and rule-family/table entries are an index rather than complete calculations—only the labeled Analysis/More tools compute chart values. Yoga results preserve the source’s asserted outcome and qualifications as attributed traditional interpretations, not evidence-based forecasts or guarantees. Remedies and health, longevity, bodily-feature, wealth, relationship or life-event material are not actionable medical, financial or other professional guidance.','এয়া এখন ঐতিহাসিক জ্যোতিষ গ্ৰন্থ; ইয়াৰ পাৰম্পৰিক দাবীসমূহ অভিজ্ঞতাভিত্তিকভাৱে প্ৰমাণিত নহয়। অধ্যায়ৰ সাৰাংশসমূহ দীঘল অংশৰ প্ৰতিলিপি নহয়, ভাবানুবাদ; নিয়ম-গোট/তালিকাৰ প্ৰৱিষ্টি এটা সূচী মাত্ৰ, সম্পূৰ্ণ গণনা নহয়—কেৱল চিহ্নিত বিশ্লেষণ/অধিক সঁজুলিয়েহে কুণ্ডলীৰ মান গণনা কৰে। যোগফলত উৎসৰ কোৱা ফল আৰু শৰ্তসমূহ পাৰম্পৰিক ব্যাখ্যা হিচাপে ৰাখিছে, প্ৰমাণভিত্তিক পূৰ্বাভাস বা নিশ্চয়তা হিচাপে নহয়। প্ৰতিকাৰ আৰু স্বাস্থ্য, আয়ুস, শৰীৰৰ লক্ষণ, ধন, সম্পৰ্ক বা জীৱনৰ ঘটনা-সম্পৰ্কীয় বিষয় চিকিৎসা, আৰ্থিক বা আন পেছাদাৰী পৰামৰ্শ নহয়।'],
['Loading the offline chapter index… If it does not appear, the guide data file may be missing.','অফলাইন অধ্যায়-সূচী লোড হৈ আছে… ই নেদেখিলে নিৰ্দেশিকাৰ উপাত্ত ফাইল নথকাও সম্ভৱ।'],
]);
// BPHS explorer topic names
add([['BPHS divisional-chart explorer','BPHS বৰ্গ-কুণ্ডলী অন্বেষক'],['BPHS topic','BPHS বিষয়'],['Physique and body','শৰীৰৰ গঠন আৰু দেহ'],['Wealth','ধন'],['Siblings and co-born','ভাই-ভনী আৰু সহজাত'],['Fortunes','ভাগ্য'],['Children and grandchildren','সন্তান আৰু নাতি-নাতিনী'],['Spouse','পত্নী/পতি'],['Power and position','ক্ষমতা আৰু পদ'],['Parents','পিতৃ-মাতৃ'],['Conveyances','বাহন'],['Worship','উপাসনা'],['Learning','বিদ্যা'],['Strength and weakness','বল আৰু দুৰ্বলতা'],['Adverse effects','প্ৰতিকূল ফল'],['Auspicious and inauspicious effects','শুভ আৰু অশুভ ফল'],['All indications','সকলো ইংগিত'],
['Chapter 7 describes the subject areas examined through the sixteen Vargas. The matrix below reports each sign placement and flags only exaltation, own-sign and debilitation positions for the seven classical grahas.','অধ্যায় 7 ত ষোড়শ বৰ্গৰ জৰিয়তে পৰীক্ষা কৰা বিষয়ক্ষেত্ৰসমূহৰ বিৱৰণ আছে। তলৰ মেট্ৰিক্সত প্ৰতিটো ৰাশিৰ অৱস্থান দেখুওৱা হৈছে আৰু সাতটা শাস্ত্ৰীয় গ্ৰহৰ কেৱল উচ্চ, স্বক্ষেত্ৰ আৰু নীচ অৱস্থান চিহ্নিত কৰা হৈছে।'],
['Bhava lord explorer','ভাৱপতি অন্বেষক'],['Lord placed','অধিপতিৰ স্থিতি'],['Dignity','মৰ্যাদা'],['House topic','ভাৱৰ বিষয়'],
['Self & body','নিজ আৰু শৰীৰ'],['Wealth & speech','ধন আৰু বাক্'],['Effort & siblings','প্ৰচেষ্টা আৰু ভাই-ভনী'],['Home & foundations','ঘৰ আৰু ভিত্তি'],['Learning & children','বিদ্যা আৰু সন্তান'],['Service & obstacles','সেৱা আৰু বাধা'],['Partnerships','অংশীদাৰিত্ব'],['Change & shared matters','পৰিৱৰ্তন আৰু যৌথ বিষয়'],['Dharma & mentors','ধৰ্ম আৰু পথপ্ৰদৰ্শক'],['Work & status','কাম আৰু মৰ্যাদা'],['Gains & networks','লাভ আৰু সংযোগ'],['Retreat & expenditure','নিভৃতবাস আৰু ব্যয়'],
['A placement summary only: it does not judge complete bhava strength, aspects, argala, divisional support or exceptions.','এয়া কেৱল অৱস্থানৰ সাৰাংশ: ইয়াত সম্পূৰ্ণ ভাৱবল, দৃষ্টি, অৰ্গল, বৰ্গ-সমৰ্থন বা ব্যতিক্ৰম বিচাৰ কৰা হোৱা নাই।'],
['Graha dṛṣṭi · planetary aspects','গ্ৰহ দৃষ্টি · গ্ৰহৰ দৃষ্টিপাত'],['Placed','স্থিত'],['Aspect targets','দৃষ্টিৰ লক্ষ্য'],
['Whole-sign Parāśari aspect targets for the seven visible grahas; special aspects are shown for Mars, Jupiter and Saturn.','দৃশ্যমান সাতটা গ্ৰহৰ সম্পূৰ্ণ-ৰাশি পাৰাশৰী দৃষ্টিৰ লক্ষ্য; মঙ্গল, বৃহস্পতি আৰু শনিৰ বাবে বিশেষ দৃষ্টিও দেখুওৱা হৈছে।'],
['Uses whole-sign aspects; degree strength and node-aspect variants are not assessed.','সম্পূৰ্ণ-ৰাশি দৃষ্টি ব্যৱহাৰ কৰা হৈছে; অংশবল আৰু ৰাহু-কেতুৰ দৃষ্টিৰ বিকল্প বিচাৰ কৰা হোৱা নাই।'],
['Rāśi dṛṣṭi · sign aspects','ৰাশি দৃষ্টি · ৰাশিৰ দৃষ্টিপাত'],['Sign-to-sign aspect map by movable, fixed and dual sign groups.','চৰ, স্থিৰ আৰু দ্বিস্বভাৱ ৰাশি-গোটৰ ভিত্তিত ৰাশিৰ পৰা ৰাশিলৈ দৃষ্টিৰ মানচিত্ৰ।'],['Source sign','উৎস ৰাশি'],['Aspected signs','দৃষ্ট ৰাশিসমূহ'],
['This is sign aspect (rāśi dṛṣṭi), distinct from graha dṛṣṭi.','এয়া ৰাশি দৃষ্টি, গ্ৰহ দৃষ্টিৰ পৰা পৃথক।'],
['Graha lordship table','গ্ৰহৰ অধিপতিত্ব তালিকা'],['Shows the houses each graha owns from this Lagna, separated into kendra and trikona groups for transparent inspection—not a standalone benefic/malefic verdict.','এই লগ্নৰ পৰা প্ৰতিটো গ্ৰহে অধিকাৰ কৰা ভাৱসমূহ কেন্দ্ৰ আৰু ত্ৰিকোণ গোটত ভাগ কৰি স্পষ্টকৈ দেখুওৱা হৈছে—ই এককভাৱে শুভ/অশুভ ৰায় নহয়।'],['Owned houses','অধিকাৰভুক্ত ভাৱ'],
['Functional nature depends on the whole chart and the interpretive tradition used; this table does not assign a universal yoga-kāraka score.','কাৰ্যগত স্বভাৱ সম্পূৰ্ণ কুণ্ডলী আৰু ব্যৱহৃত ব্যাখ্যা-পৰম্পৰাৰ ওপৰত নিৰ্ভৰ কৰে; এই তালিকাই সৰ্বজনীন যোগকাৰক নম্বৰ নিদিয়ে।'],
['Graha sign-dignity reference','গ্ৰহৰ ৰাশি-মৰ্যাদাৰ উল্লেখ'],['Classical seven-graha reference for exaltation, own signs and debilitation.','উচ্চ, স্বক্ষেত্ৰ আৰু নীচৰ বাবে শাস্ত্ৰীয় সাত-গ্ৰহৰ উল্লেখ।'],
['Moolatrikona degrees, friendship tiers, combustion and full Shadbala are not represented here.','মূলত্ৰিকোণ অংশ, মিত্ৰতাৰ স্তৰ, অস্ত আৰু সম্পূৰ্ণ ষড়বল ইয়াত দেখুওৱা হোৱা নাই।'],
['Ex/Own/Deb are sign-state markers, not a Vimshopaka score, Shadbala, or a guaranteed prediction.','উ/স্ব/নী ৰাশি-অৱস্থাৰ চিহ্ন মাত্ৰ; ই বিংশোপক নম্বৰ, ষড়বল বা নিশ্চিত ভৱিষ্যদ্বাণী নহয়।'],
['Deb','নী'],['Ex','উ'],['Own','স্ব'],
]);
rule(/^· Ex (\d+) · Own (\d+) · Deb (\d+)$/,m=>`· উচ্চ ${m[1]} · স্ব ${m[2]} · নীচ ${m[3]}`);
rule(/^Sign-based house sequence from (\S+) Lagna\. Each row shows a house sign, its ruler, the ruler’s placement and basic sign dignity\.$/,m=>`${m[1]} লগ্নৰ পৰা ৰাশি-ভিত্তিক ভাৱক্ৰম। প্ৰতিটো শাৰীয়ে ভাৱৰ ৰাশি, তাৰ অধিপতি, অধিপতিৰ স্থিতি আৰু মূল ৰাশি-মৰ্যাদা দেখুৱায়।`);
rule(/^Kendras ([\d·]+)$/,m=>`কেন্দ্ৰ ${m[1]}`);
rule(/^Trikonas ([\d·]+)$/,m=>`ত্ৰিকোণ ${m[1]}`);
rule(/^Source: supplied BPHS English edition, (Ch\. .+?)\. (Ex\/Own.*)$/,m=>`উৎস: যোগান ধৰা BPHS ইংৰাজী সংস্কৰণ, ${m[1].replace('Ch.','অধ্যায়')}। ${T(m[2])||m[2]} এপৰ বৰ্গ-কুণ্ডলী গণনা-পদ্ধতি আৰু দিগ-ভিত্তিক উৎস-বিষয় পৃথকে চিনাক্ত কৰিব লাগে।`);
rule(/^(.*?) · (debilitated|exalted|own sign)$/,m=>`${m[1]} · ${EXm.get(m[2])}`);
rule(/^(.*?), (debilitated|exalted|own sign)$/,m=>`${m[1]}, ${EXm.get(m[2])}`);
EXm.set('own sign','স্বক্ষেত্ৰ');EXm.set('exalted','উচ্চ');EXm.set('debilitated','নীচ');

// ---------- Jaimini
add([
['Sign-based reference calculators using the current D1 chart. This section adds Arudha Padas, Argala and Chara Dasha. Chara Karakas and rāśi dṛṣṭi also remain available in the app.','বৰ্তমান D1 কুণ্ডলী ব্যৱহাৰ কৰা ৰাশি-ভিত্তিক ৰেফাৰেন্স গণনা-সঁজুলি। এই অংশত আৰুঢ় পদ, অৰ্গল আৰু চৰ দশা যোগ কৰা হৈছে। চৰ কাৰক আৰু ৰাশি দৃষ্টিও এপত উপলব্ধ।'],
['Calculations name their rule source and surface unresolved strength, exception and lineage choices rather than presenting a single universal Jaimini method.','গণনাত নিয়মৰ উৎসৰ নাম উল্লেখ কৰা হৈছে আৰু একক সৰ্বজনীন জৈমিনী পদ্ধতি দেখুওৱাৰ সলনি অমীমাংসিত বল, ব্যতিক্ৰম আৰু পৰম্পৰাৰ বিকল্পসমূহ দেখুওৱা হৈছে।'],
['Eight-karaka ranking used here, including Rahu with reversed degree. Karakamsa is the Atmakaraka’s Navamsa sign; this is a placement reference, not a full Jaimini interpretation.','ইয়াত আঠ-কাৰকৰ ক্ৰম ব্যৱহাৰ কৰা হৈছে, ৰাহুক উলটা অংশৰ সৈতে ধৰি। কাৰকাংশ হৈছে আত্মকাৰকৰ নৱাংশ ৰাশি; এয়া অৱস্থানৰ উল্লেখ, সম্পূৰ্ণ জৈমিনী ব্যাখ্যা নহয়।'],
['(D9 sign of the Atmakaraka).','(আত্মকাৰকৰ D9 ৰাশি)।'],['D9 sign of the Atmakaraka','আত্মকাৰকৰ D9 ৰাশি'],
['All twelve padas are calculated from the natal D1 signs. A1 is Arudha Lagna; A12 is Upapada.','বাৰটা পদ জন্ম D1 ৰাশিৰ পৰা গণনা কৰা হৈছে। A1 আৰুঢ় লগ্ন; A12 উপপদ।'],
['Parent bhava','মূল ভাৱ'],['Lord placement','অধিপতিৰ স্থান'],['Rule applied','প্ৰয়োগ কৰা নিয়ম'],
['Ordinary double count','সাধাৰণ দুগুণ গণনা'],
['BPHS Ch. 29: parent-sign collapse → 10th from the house','BPHS অধ্যায় 29: মূল-ৰাশিত পতন → ভাৱৰ পৰা 10ম'],
['BPHS Ch. 29: seventh-sign collapse → 4th from the house','BPHS অধ্যায় 29: সপ্তম-ৰাশিত পতন → ভাৱৰ পৰা 4ৰ্থ'],
['Both co-lords occupy their shared sign','দুয়ো সহ-অধিপতি নিজৰ সাধাৰণ ৰাশিতে আছে'],
['Convention follows the supplied BPHS English edition, Ch. 29, vv. 1–5. In this edition, a preliminary pada on the parent sign moves to the 10th; one on the 7th moves to the 4th. Other lineages use different corrections. Sign lords use the app’s classical seven-graha lordship table; co-lord strength for Scorpio/Aquarius is not independently ranked for this Pada table.','নিয়ম যোগান ধৰা BPHS ইংৰাজী সংস্কৰণৰ অধ্যায় 29, শ্লোক 1–5 অনুসৰি। এই সংস্কৰণত মূল ৰাশিত পৰা প্ৰাথমিক পদ 10মলৈ যায়; 7মত পৰা পদ 4ৰ্থলৈ যায়। আন পৰম্পৰাত ভিন্ন সংশোধন ব্যৱহাৰ হয়। ৰাশিপতিৰ বাবে এপৰ শাস্ত্ৰীয় সাত-গ্ৰহৰ অধিপতিত্ব তালিকা ব্যৱহাৰ কৰা হৈছে; বৃশ্চিক/কুম্ভৰ সহ-অধিপতিৰ বল এই পদ-তালিকাত পৃথকে ক্ৰম কৰা হোৱা নাই।'],
['Each row treats a natal sign as the target. Primary Argala pairs are 2nd/12th, 4th/10th and 11th/3rd; the secondary pair is 5th/9th.','প্ৰতিটো শাৰীয়ে এটা জন্ম-ৰাশিক লক্ষ্য হিচাপে লয়। প্ৰাথমিক অৰ্গল যোৰ 2য়/12তম, 4ৰ্থ/10ম আৰু 11তম/3য়; গৌণ যোৰ 5ম/9ম।'],
['Target house','লক্ষ্য ভাৱ'],['Count summary','গণনাৰ সাৰাংশ'],
['More primary Argala by count','সংখ্যাত অধিক প্ৰাথমিক অৰ্গল'],['More obstruction by count','সংখ্যাত অধিক বাধা'],['Equal counts','সমান সংখ্যা'],['No placements in listed houses','তালিকাভুক্ত ভাৱত কোনো স্থিতি নাই'],
['Cells show classical planets in the Argala house versus its obstruction house. The text also requires strength comparison, allows special cases and counts Rahu/Ketu in reverse; those node-specific and strength rules are not calculated here. A count comparison is not a final prediction.','ঘৰবোৰে অৰ্গল ভাৱত থকা শাস্ত্ৰীয় গ্ৰহ আৰু তাৰ বাধা-ভাৱত থকা গ্ৰহৰ তুলনা দেখুৱায়। পাঠত বল-তুলনাও লাগে, বিশেষ ক্ষেত্ৰৰ অনুমতি আছে আৰু ৰাহু/কেতু উলটাকৈ গণনা হয়; সেই ৰাহু-কেতু আৰু বলৰ নিয়ম ইয়াত গণনা কৰা হোৱা নাই। সংখ্যা-তুলনা চূড়ান্ত ভৱিষ্যদ্বাণী নহয়।'],
['Current Chara Dasha','বৰ্তমান চৰ দশা'],['Current Chara Dasha:','বৰ্তমান চৰ দশা:'],
['Birth time is in the future; no running Chara Dasha yet.','জন্মৰ সময় ভৱিষ্যতত; এতিয়াও কোনো চলিত চৰ দশা নাই।'],
['Birth time is in the future; current Bhava periods are not available.','জন্মৰ সময় ভৱিষ্যতত; বৰ্তমানৰ ভাৱ-কাল উপলব্ধ নহয়।'],
['Current period could not be resolved for this date.','এই তাৰিখৰ বাবে বৰ্তমান কাল নিৰ্ণয় কৰিব পৰা নগ’ল।'],
['Period sign','কালৰ ৰাশি'],['Lord used','ব্যৱহৃত অধিপতি'],['Grahas in sign','ৰাশিত থকা গ্ৰহ'],['Arudhas / Karakas','আৰুঢ় / কাৰক'],['Duration evidence','কালৰ প্ৰমাণ'],
['Own-sign exception: 12 years','স্বক্ষেত্ৰৰ ব্যতিক্ৰম: 12 বছৰ'],
['BPHS sign-dasha discussion, Ch. 46, vv. 158–167, supplemented by the named convention\'s sign-count rules. Each sign’s duration counts to its lord in the Savya/Apasavya direction, then subtracts one; own-sign periods are 12 years, with dignity adjustments bounded to 1–12. Scorpio/Aquarius use the edition’s dual-lord strength factors. The 12-sign sequence repeats in this implementation. Chara antardashas are omitted because source lineages disagree on their sequence and the cited procedure does not specify it consistently. Period activation is not a guaranteed event.','BPHS ৰ ৰাশি-দশা আলোচনা, অধ্যায় 46, শ্লোক 158–167, নামকৰণ কৰা পদ্ধতিৰ ৰাশি-গণনা নিয়মেৰে সম্পূৰক। প্ৰতিটো ৰাশিৰ কাল সব্য/অপসব্য দিশত তাৰ অধিপতিলৈ গণনা কৰি এক বিয়োগ কৰা হয়; স্বক্ষেত্ৰৰ কাল 12 বছৰ, মৰ্যাদা-সংশোধন 1–12 ৰ ভিতৰত সীমিত। বৃশ্চিক/কুম্ভৰ বাবে সংস্কৰণটোৰ দ্বি-অধিপতি বল-কাৰক ব্যৱহাৰ কৰা হৈছে। এই ৰূপায়ণত 12 ৰাশিৰ ক্ৰম পুনৰাবৃত্তি হয়। চৰ অন্তৰ্দশা বাদ দিয়া হৈছে কিয়নো উৎস-পৰম্পৰাসমূহৰ ক্ৰমত মতানৈক্য আছে আৰু উদ্ধৃত পদ্ধতিয়ে সেয়া সুসংগতভাৱে নিৰ্দিষ্ট কৰা নাই। কালৰ সক্ৰিয়তা নিশ্চিত ঘটনা নহয়।'],
['Jaimini tools','জৈমিনী সঁজুলি'],['Jaimini Chara Dasha','জৈমিনী চৰ দশা'],['Chara Karakas & Karakamsa','চৰ কাৰক আৰু কাৰকাংশ'],['Bhava Padas · Arudha','ভাৱ পদ · আৰুঢ়'],['Argala / Virodhargala','অৰ্গল / বিৰোধাৰ্গল'],['Karakamsa','কাৰকাংশ'],
['Sudarshana Chakra','সুদৰ্শন চক্ৰ'],['Three concentric twelve-house charts: Lagna in the inner ring, Moon in the middle ring and Sun in the outer ring.','তিনিটা কেন্দ্ৰাভিমুখী বাৰ-ভাৱৰ কুণ্ডলী: ভিতৰৰ বৃত্তত লগ্ন, মাজৰ বৃত্তত চন্দ্ৰ আৰু বাহিৰৰ বৃত্তত সূৰ্য।'],
['Three aligned twelve-house rings: inner = Lagna, middle = Moon sign, outer = Sun sign. Compare each house number across the rings; each column marks the same bhava from a different starting sign.','সংৰেখিত তিনিটা বাৰ-ভাৱৰ বৃত্ত: ভিতৰৰ = লগ্ন, মাজৰ = চন্দ্ৰ ৰাশি, বাহিৰৰ = সূৰ্য ৰাশি। বৃত্তকেইটাৰ মাজত প্ৰতিটো ভাৱ-সংখ্যা তুলনা কৰক; প্ৰতিটো স্তম্ভই বেলেগ আৰম্ভণি-ৰাশিৰ পৰা একেটা ভাৱ চিহ্নিত কৰে।'],
['Accessible house-by-house table','ভাৱ অনুসৰি সহজে পঢ়িব পৰা তালিকা'],['Lagna ring','লগ্ন বৃত্ত'],['Moon ring','চন্দ্ৰ বৃত্ত'],['Sun ring','সূৰ্য বৃত্ত'],['Inner · Lagna','ভিতৰৰ · লগ্ন'],['Middle · Moon','মাজৰ · চন্দ্ৰ'],['Outer · Sun','বাহিৰৰ · সূৰ্য'],
['Current Sudarshana Bhava periods','বৰ্তমান সুদৰ্শন ভাৱ-কাল'],['Cycle','চক্ৰ'],['cycle','চক্ৰ'],['years','বছৰ'],
['Formation and bhava alignment: supplied BPHS English edition, Ch. 74, vv. 4–28. The app displays placements and period sequence; it does not automatically predict the classical outcomes or assess all aspects and strengths.','গঠন আৰু ভাৱ-সংৰেখণ: যোগান ধৰা BPHS ইংৰাজী সংস্কৰণ, অধ্যায় 74, শ্লোক 4–28। এপে অৱস্থান আৰু কালক্ৰম দেখুৱায়; ই শাস্ত্ৰীয় ফল নিজে পূৰ্বাভাস নিদিয়ে আৰু সকলো দৃষ্টি আৰু বল বিচাৰ নকৰে।'],
['BPHS · 74','BPHS · 74'],
]);
const BH={Lagna:'লগ্ন',Tanu:'তনু',Dhana:'ধন',Vikrama:'বিক্ৰম',Matru:'মাতৃ',Mantra:'মন্ত্ৰ',Roga:'ৰোগ',Dara:'দাৰা',Marana:'মৰণ',Pitru:'পিতৃ',Karma:'কৰ্ম',Labha:'লাভ',Vyaya:'ব্যয়'};
const BK=Object.keys(BH).join('|');Object.keys(BH).forEach(k=>{if(k!=='Lagna')EXm.set(k,BH[k])});
rule(new RegExp(`^(\\d+) · (${BK}) \\((.+)\\)$`),m=>`${m[1]} · ${BH[m[2]]} (${m[3]})`);
rule(new RegExp(`^(${BK}) · (.+)$`),m=>`${BH[m[1]]} · ${m[2]}`);
rule(/^A(\d+)(?: \/ (AL|Upapada \(UL\)|Dhanapada))?$/,m=>m[2]?`A${m[1]} / ${{AL:'আৰুঢ় লগ্ন (AL)','Upapada (UL)':'উপপদ (UL)',Dhanapada:'ধনপদ'}[m[2]]}`:null);
rule(/^A(\d+) \/ (AL|Dhanapada)$/,m=>`A${m[1]} / ${{AL:'আৰুঢ় লগ্ন (AL)',Dhanapada:'ধনপদ'}[m[2]]}`);
rule(/^A12 \/ Upapada \(UL\)$/,()=>'A12 / উপপদ (UL)');
rule(/^(\S+) · (\d+) signs?$/,m=>`${m[1]} · ${m[2]}টা ৰাশি`);
rule(/^· (\d+) years · (\d{4}-\d\d-\d\d) · cycle (\d+)\.$/,m=>`· ${m[1]} বছৰ · ${m[2]} · চক্ৰ ${m[3]}।`);
rule(/^Cycle (\d+) · (.+)$/,m=>`চক্ৰ ${m[1]} · ${m[2]}`);
rule(/^Primary (\d+) : (\d+)$/,m=>`প্ৰাথমিক ${m[1]} : ${m[2]}`);
rule(/^5th\/9th (\d+) : (\d+)$/,m=>`5ম/9ম ${m[1]} : ${m[2]}`);
rule(/^(ভাৱ \d+) from Lagna$/,m=>`লগ্নৰ পৰা ${m[1]}`);
rule(/^Starts from (\S+); the 9th sign is (\S+) \((odd|even)\), so the 12-sign major-period order runs (forward|reverse)\.$/,m=>`${m[1]}ৰ পৰা আৰম্ভ; 9ম ৰাশি ${m[2]} (${m[3]=='odd'?'বিজোড়':'যুগ্ম'}), সেয়ে 12 ৰাশিৰ মুখ্য-কালৰ ক্ৰম ${m[4]=='forward'?'আগলৈ':'উলটাকৈ'} চলে।`);
rule(/^BPHS\/Neelakantha-style sign periods\. (.*)$/,m=>{const x=m[1].replace(/Starts from (\S+); the 9th sign is (\S+) \((odd|even)\), so the 12-sign major-period order runs (forward|reverse)\./,(_,a,b,c,d)=>`${a}ৰ পৰা আৰম্ভ; 9ম ৰাশি ${b} (${c=='odd'?'বিজোড়':'যুগ্ম'}), সেয়ে 12 ৰাশিৰ মুখ্য-কালৰ ক্ৰম ${d=='forward'?'আগলৈ':'উলটাকৈ'} চলে।`).replace('This schedule uses a 365.25-day year for dates.','এই সময়সূচীত তাৰিখৰ বাবে 365.25 দিনৰ বছৰ ব্যৱহাৰ কৰা হৈছে।');return`BPHS/নীলকণ্ঠ-শৈলীৰ ৰাশি-কাল। ${x}`});
rule(/^Year Dasha: (.+?) · Antardasha: (.+?) · Pratyantar: (.+?)\. Uses the BPHS Ch\. 74 1-year \/ 1-month \/ 2\.5-day rhythm on a 360-day year\.$/,m=>`বৰ্ষ দশা: ${T(m[1])} · অন্তৰ্দশা: ${T(m[2])} · প্ৰত্যন্তৰ: ${T(m[3])}। 360 দিনৰ বছৰত BPHS অধ্যায় 74 ৰ 1 বছৰ / 1 মাহ / 2.5 দিনৰ ছন্দ ব্যৱহাৰ কৰা হৈছে।`);
const JD=ev=>ev.replace(/^(\d+) signs, inclusive, counted (forward \(Savya\)|reverse \(Apasavya\))/,(_,n,d)=>`${n}টা ৰাশি, অন্তৰ্ভুক্ত কৰি, ${d.startsWith('forward')?'আগলৈ (সব্য)':'উলটাকৈ (অপসব্য)'} গণনা`)
 .replace(/−1 = (\d+)/,'−1 = $1').replace('no dignity adjustment','মৰ্যাদা-সংশোধন নাই')
 .replace(/\+1: exalted graha in (\S+)/,'+1: $1ত উচ্চ গ্ৰহ').replace(/[-−]1: debilitated graha in (\S+)/,'−1: $1ত নীচ গ্ৰহ')
 .replace(/conventional duration bound applied \((\d+) years\)/,'প্ৰচলিত কালসীমা প্ৰয়োগ কৰা হৈছে ($1 বছৰ)')
 .replace(/Sign lord (\S+) occupies (\S+)/,(_,p,s)=>`ৰাশিপতি ${PL(p)} ${s}ত আছে`)
 .replace('Stronger occupied sign selected by BPHS Ch. 46 factors: exalted occupant, occupancy count, sign modality, then higher sign','BPHS অধ্যায় 46 ৰ কাৰক অনুসৰি অধিক শক্তিশালী অধিকৃত ৰাশি বাছনি কৰা হৈছে: উচ্চ গ্ৰহ, গ্ৰহৰ সংখ্যা, ৰাশিৰ স্বভাৱ, তাৰ পিছত উচ্চতৰ ৰাশি')
 .replace('Both co-lords occupy their shared sign','দুয়ো সহ-অধিপতি নিজৰ সাধাৰণ ৰাশিতে আছে')
 .replace(/One co-lord is at home; count to the other lord in (\S+)/,'এজন সহ-অধিপতি নিজৰ ঘৰত; $1ত থকা আনজন অধিপতিলৈ গণনা')
 .replace(/Both co-lords occupy (\S+)/,'দুয়ো সহ-অধিপতি $1ত আছে')
 .replace('Own-sign exception: 12 years','স্বক্ষেত্ৰৰ ব্যতিক্ৰম: 12 বছৰ');
rule(/^(\d+ signs, inclusive, counted .+|Sign lord .+ occupies .+|Stronger occupied sign selected .+|Both co-lords .+|One co-lord is at home.+)$/,m=>JD(m[1]));

// ---------- Ashtakavarga
add([
['Seven-graha Bhinnashtakavarga with Sarvashtakavarga; the seven-graha grand total remains 337. Lagna BAV is shown separately and is excluded from SAV.','সাত-গ্ৰহৰ ভিন্নাষ্টকবৰ্গ আৰু সৰ্বাষ্টকবৰ্গ; সাত-গ্ৰহৰ মুঠ যোগফল 337 ই থাকে। লগ্নৰ BAV পৃথকে দেখুওৱা হৈছে আৰু SAV ৰ পৰা বাদ দিয়া হৈছে।'],
['Lagna BAV','লগ্ন BAV'],['Raw BAV','মূল BAV'],['After Trikona','ত্ৰিকোণৰ পিছত'],['After Ekadhipatya','একাধিপত্যৰ পিছত'],['Ashtakavarga to reduce','হ্ৰাস কৰিবলগীয়া অষ্টকবৰ্গ'],
['Trikona and Ekadhipatya Shodhana · BPHS Ch. 67–68','ত্ৰিকোণ আৰু একাধিপত্য শোধন · BPHS অধ্যায় 67–68'],
['Reduce each Bhinnashtakavarga separately. Trikona Shodhana removes the common minimum across each fire/earth/air/water sign trine; if any sign in that trine is zero, leave that trine unchanged. Ekadhipatya is then applied to Mars-, Venus-, Mercury-, Jupiter- and Saturn-owned sign pairs, following occupancy rules. Sun and Moon each own one sign and are not paired.','প্ৰতিটো ভিন্নাষ্টকবৰ্গ পৃথকে হ্ৰাস কৰক। ত্ৰিকোণ শোধনে অগ্নি/পৃথ্বী/বায়ু/জল ৰাশি-ত্ৰিকোণৰ সাধাৰণ নিম্নতম মান আঁতৰায়; সেই ত্ৰিকোণৰ কোনো ৰাশি শূন্য হ’লে ত্ৰিকোণটো সলনি নকৰিব। তাৰ পিছত অধিকাৰ-নিয়ম অনুসৰি মঙ্গল, শুক্ৰ, বুধ, বৃহস্পতি আৰু শনিৰ অধিকাৰভুক্ত ৰাশি-যোৰত একাধিপত্য প্ৰয়োগ কৰা হয়। সূৰ্য আৰু চন্দ্ৰই প্ৰত্যেকে এটা ৰাশিহে অধিকাৰ কৰে, সেয়ে যোৰ নহয়।'],
['Raw, post-trikona and post-ekadhipatya rekhas are displayed side by side. This is the reduction worksheet only; later Pinda calculations and outcome rules are not inferred here. BPHS Ch. 67–68.','মূল, ত্ৰিকোণোত্তৰ আৰু একাধিপত্যোত্তৰ ৰেখাসমূহ কাষে কাষে দেখুওৱা হৈছে। এয়া কেৱল হ্ৰাস-কাৰ্যপত্ৰ; পিছৰ পিণ্ড গণনা আৰু ফল-নিয়ম ইয়াত অনুমান কৰা হোৱা নাই। BPHS অধ্যায় 67–68।'],
['unchanged: a trine sign has zero Rekhas','অপৰিৱৰ্তিত: ত্ৰিকোণৰ এটা ৰাশিত শূন্য ৰেখা আছে'],['equal trine: all reduced to zero','সমান ত্ৰিকোণ: সকলো শূন্যলৈ হ্ৰাস'],
['BPHS Ch. 75: formation is a planet in its own or exalted sign and in a kendra from the Lagna. Textual results are shown as written/paraphrased in the source; strength, exceptions and period activation are not fully calculated.','BPHS অধ্যায় 75: গঠন হৈছে গ্ৰহ নিজৰ বা উচ্চ ৰাশিত আৰু লগ্নৰ পৰা কেন্দ্ৰত থকা। পাঠ্য ফলসমূহ উৎসত লিখা/ভাবানুবাদ কৰা ধৰণে দেখুওৱা হৈছে; বল, ব্যতিক্ৰম আৰু কালৰ সক্ৰিয়তা সম্পূৰ্ণকৈ গণনা কৰা হোৱা নাই।'],
]);

// ---------- Chakra / Pataki / Dasha
add([
['Self, body and health; neutral, avoid starting big ventures','নিজ, শৰীৰ আৰু স্বাস্থ্য; মধ্যম, ডাঙৰ উদ্যোগ আৰম্ভ নকৰা ভাল'],
['Wealth, gains and fulfilment','ধন, লাভ আৰু পূৰ্ণতা'],['Danger, obstacles and accidents','বিপদ, বাধা আৰু দুৰ্ঘটনা'],['Well-being, comfort and stability','কল্যাণ, সুখ আৰু স্থিৰতা'],['Opposition, enemies and delays','বিৰোধিতা, শত্ৰু আৰু বিলম্ব'],['Achievement and success of goals','লক্ষ্য প্ৰাপ্তি আৰু সফলতা'],['Disease, loss and endings; the most inauspicious','ৰোগ, ক্ষতি আৰু সমাপ্তি; সৰ্বাধিক অশুভ'],['Friends, allies and support','বন্ধু, মিত্ৰ আৰু সহায়'],['Greatest well-wishers and protection; most auspicious','শ্ৰেষ্ঠ শুভাকাংক্ষী আৰু ৰক্ষা; সৰ্বাধিক শুভ'],
['Today\'s Moon is in','আজিৰ চন্দ্ৰ আছে'],
['Counted from your Janma nakshatra. Sampat, Kshema, Sadhana, Mitra and Parama Mitra are favourable; Vipat, Pratyari and Naidhana are unfavourable, and Janma is neutral (avoid new starts). Planets of your chart are shown in the tara of the nakshatra they occupy.','আপোনাৰ জন্ম নক্ষত্ৰৰ পৰা গণনা কৰা হৈছে। সম্পৎ, ক্ষেম, সাধনা, মিত্ৰ আৰু পৰম মিত্ৰ শুভ; বিপৎ, প্ৰত্যৰি আৰু নৈধন অশুভ, আৰু জন্ম মধ্যম (নতুন কাম আৰম্ভ নকৰা ভাল)। আপোনাৰ কুণ্ডলীৰ গ্ৰহবোৰ সিহঁতে অধিকাৰ কৰা নক্ষত্ৰৰ তাৰাত দেখুওৱা হৈছে।'],
['Unavailable for this time/location','এই সময়/স্থানৰ বাবে উপলব্ধ নহয়'],
['Natal whole-sign placements on the 12-house Tripataki-style grid.','12-ভাৱৰ ত্ৰিপতাকী-শৈলীৰ গ্ৰিডত জন্মৰ সম্পূৰ্ণ-ৰাশি অৱস্থান।'],
['Highlight vedha to','বেধ হাইলাইট কৰক'],['Lagna and Moon','লগ্ন আৰু চন্দ্ৰ'],['Lagna only','কেৱল লগ্ন'],['Moon only','কেৱল চন্দ্ৰ'],
['Whole-sign houses from the birth ascendant. Lines highlight sign-based vedha links to the selected Lagna and Moon points.','জন্ম লগ্নৰ পৰা সম্পূৰ্ণ-ৰাশি ভাৱ। ৰেখাবোৰে বাছনি কৰা লগ্ন আৰু চন্দ্ৰ বিন্দুলৈ ৰাশি-ভিত্তিক বেধ সংযোগ হাইলাইট কৰে।'],
['Pataki Rishta Chakra twelve-house vedha diagram','পতাকী ৰিষ্ট চক্ৰ বাৰ-ভাৱৰ বেধ চিত্ৰ'],
['Birth Lagna','জন্ম লগ্ন'],['Vedha line','বেধ ৰেখা'],['Vedha in the chart','কুণ্ডলীত বেধ'],
['Lists bodies whose sign-based vedha reaches each focus point. It reports the traditional rule match only, not a forecast.','যিবোৰ বস্তুৰ ৰাশি-ভিত্তিক বেধে প্ৰতিটো কেন্দ্ৰবিন্দুত উপনীত হয়, সেইবোৰ তালিকাভুক্ত কৰে। ই কেৱল পাৰম্পৰিক নিয়মৰ মিল দেখুৱায়, পূৰ্বাভাস নহয়।'],
['Focus','কেন্দ্ৰবিন্দু'],['Vedha bodies','বেধ-কাৰী বস্তু'],['Placement key','অৱস্থানৰ সূচী'],['Vedha signs','বেধ ৰাশি'],['Scope and source note.','পৰিসৰ আৰু উৎসৰ টোকা।'],
['Vedha groups follow the K. N. Rao Pataki Rishta Chakra memory table. The Dhoom→Vyatipat→Parivesh→Chap→Upaketu chain and Gulika (Mandi) follow the supplied BPHS Ch. 3 rules. BPHS describes the Upagrahas as malefic by nature; this panel shows placements only. Gulika uses the app’s sunrise model and entered fixed UTC offset. This is not a complete PRC timing analysis: Dandesh/Ardhayamesh and age-specific rules are omitted. No childhood-harm, disease, disability, longevity or death prediction is produced.','বেধ-গোটবোৰ কে. এন. ৰাও-ৰ পতাকী ৰিষ্ট চক্ৰ স্মৃতি-তালিকা অনুসৰি। ধূম→ব্যতীপত→পৰিবেশ→চাপ→উপকেতু শৃঙ্খলা আৰু গুলিকা (মাণ্ডী) যোগান ধৰা BPHS অধ্যায় 3 ৰ নিয়ম অনুসৰি। BPHS য়ে উপগ্ৰহসমূহক স্বভাৱত অশুভ বুলি বৰ্ণনা কৰিছে; এই পেনেলে কেৱল অৱস্থান দেখুৱায়। গুলিকাৰ বাবে এপৰ সূৰ্যোদয় নমুনা আৰু দিয়া নিৰ্দিষ্ট UTC অফছেট ব্যৱহাৰ কৰা হৈছে। এয়া সম্পূৰ্ণ PRC সময়-বিশ্লেষণ নহয়: দণ্ডেশ/অৰ্ধযামেশ আৰু বয়স-নিৰ্দিষ্ট নিয়ম বাদ দিয়া হৈছে। শৈশৱৰ ক্ষতি, ৰোগ, অক্ষমতা, আয়ুস বা মৃত্যুৰ কোনো পূৰ্বাভাস দিয়া হোৱা নাই।'],
['Traditional themes are indications, not predictions. The displayed period grade is this app’s heuristic—not a canonical BPHS score. This version does not fully assess aspects, planetary strength, cancellations or divisional-chart support.','পাৰম্পৰিক বিষয়বস্তু ইংগিত মাত্ৰ, ভৱিষ্যদ্বাণী নহয়। দেখুওৱা কালৰ গ্ৰেড এই এপৰ অনুমানভিত্তিক মূল্যায়ন—BPHS ৰ প্ৰামাণিক নম্বৰ নহয়। এই সংস্কৰণে দৃষ্টি, গ্ৰহবল, ভঙ্গ আৰু বৰ্গ-কুণ্ডলীৰ সমৰ্থন সম্পূৰ্ণকৈ বিচাৰ নকৰে।'],
['Traditional themes may include authority, visibility, responsibility, and dealings with institutions or mentors.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত কৰ্তৃত্ব, দৃশ্যমানতা, দায়িত্ব আৰু প্ৰতিষ্ঠান বা পথপ্ৰদৰ্শকৰ সৈতে লেনদেন থাকিব পাৰে।'],
['Traditional themes may include home, routines, public life, emotional attention, and comfort.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত ঘৰ, দৈনন্দিন নিয়ম, সামাজিক জীৱন, আৱেগিক মনোযোগ আৰু সুখ থাকিব পাৰে।'],
['Traditional themes may include initiative, effort, property matters, courage, and assertiveness.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত উদ্যোগ, প্ৰচেষ্টা, সম্পত্তিৰ বিষয়, সাহস আৰু দৃঢ়তা থাকিব পাৰে।'],
['Traditional themes may include ambition, unfamiliar settings, unconventional interests, and uncertainty.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত উচ্চাকাংক্ষা, অপৰিচিত পৰিৱেশ, অপ্ৰচলিত আগ্ৰহ আৰু অনিশ্চয়তা থাকিব পাৰে।'],
['Traditional themes may include learning, teaching, ethics, children, resources, and mentors.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত শিক্ষা, শিক্ষাদান, নীতি, সন্তান, সম্পদ আৰু পথপ্ৰদৰ্শক থাকিব পাৰে।'],
['Traditional themes may include discipline, sustained work, service, obligations, and patience.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত নিয়মানুবৰ্তিতা, অবিৰত কাম, সেৱা, দায়বদ্ধতা আৰু ধৈৰ্য থাকিব পাৰে।'],
['Traditional themes may include study, communication, commerce, analysis, and practical skills.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত অধ্যয়ন, যোগাযোগ, বাণিজ্য, বিশ্লেষণ আৰু ব্যৱহাৰিক দক্ষতা থাকিব পাৰে।'],
['Traditional themes may include research, simplification, inward focus, and spiritual interests.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত গৱেষণা, সৰলীকৰণ, অন্তৰ্মুখী মনোযোগ আৰু আধ্যাত্মিক আগ্ৰহ থাকিব পাৰে।'],
['Traditional themes may include relationships, art, comforts, design, and shared enjoyment.','পাৰম্পৰিক বিষয়বস্তুৰ ভিতৰত সম্পৰ্ক, কলা, সুখ-সুবিধা, নকশা আৰু যৌথ আনন্দ থাকিব পাৰে।'],
]);
const PHRASE={'identity and self-direction':'পৰিচয় আৰু আত্মনিৰ্দেশনা','resources, speech and family':'সম্পদ, বাক্ আৰু পৰিয়াল','initiative, effort and siblings':'উদ্যোগ, প্ৰচেষ্টা আৰু ভাই-ভনী','home, family and property':'ঘৰ, পৰিয়াল আৰু সম্পত্তি','learning, creativity and responsibility':'শিক্ষা, সৃজনশীলতা আৰু দায়িত্ব','obligations, service and problem-solving':'দায়বদ্ধতা, সেৱা আৰু সমস্যা সমাধান','partnerships and agreements':'অংশীদাৰিত্ব আৰু চুক্তি','shared matters, change and uncertainty':'যৌথ বিষয়, পৰিৱৰ্তন আৰু অনিশ্চয়তা','belief, learning and mentors':'বিশ্বাস, শিক্ষা আৰু পথপ্ৰদৰ্শক','work, responsibility and public role':'কাম, দায়িত্ব আৰু সামাজিক ভূমিকা','goals, networks and gains':'লক্ষ্য, সংযোগ আৰু লাভ','expenditure, retreat and distant places':'ব্যয়, নিভৃতবাস আৰু দূৰৱৰ্তী স্থান'};
const KW={authority:'কৰ্তৃত্ব',government:'চৰকাৰ',father:'পিতৃ',vitality:'প্ৰাণশক্তি',status:'মৰ্যাদা',mind:'মন',mother:'মাতৃ',public:'জনসাধাৰণ',comforts:'সুখ-সুবিধা',energy:'শক্তি',courage:'সাহস',property:'সম্পত্তি',siblings:'ভাই-ভনী',intellect:'বুদ্ধি',trade:'বাণিজ্য',communication:'যোগাযোগ',learning:'শিক্ষা',wisdom:'প্ৰজ্ঞা',children:'সন্তান',wealth:'ধন',dharma:'ধৰ্ম',teachers:'গুৰুজন',marriage:'বিবাহ',arts:'কলা',vehicles:'বাহন',discipline:'নিয়মানুবৰ্তিতা','hard work':'কঠোৰ পৰিশ্ৰম',service:'সেৱা',patience:'ধৈৰ্য','foreign matters':'বিদেশী বিষয়',ambition:'উচ্চাকাংক্ষা','unconventional gains':'অপ্ৰচলিত লাভ',confusion:'বিভ্ৰান্তি',detachment:'বৈৰাগ্য',spirituality:'আধ্যাত্মিকতা',research:'গৱেষণা',loss:'ক্ষতি'};
const kwList=s=>s.split(', ').map(w=>KW[w]||w).join(', ');
const RELT={'same planet as the mahadasha lord (own sub-period, results intensify)':'মহাদশাপতিৰ সৈতে একে গ্ৰহ (নিজৰ উপ-কাল, ফল তীব্ৰ হয়)','friendly to the mahadasha lord (smooth cooperation)':'মহাদশাপতিৰ প্ৰতি মিত্ৰভাবাপন্ন (সুচাৰু সহযোগ)','unfriendly to the mahadasha lord (friction and mixed results)':'মহাদশাপতিৰ প্ৰতি শত্ৰুভাবাপন্ন (সংঘাত আৰু মিশ্ৰ ফল)','neutral to the mahadasha lord':'মহাদশাপতিৰ প্ৰতি সম'};
const whyPart=p=>{let m;
 if(m=p.match(/^rules houses? ([\d &]+?)(?: \(as (\w+)\))?$/))return`ভাৱ ${m[1].replace(/ & /g,' আৰু ')}ৰ অধিপতি${m[2]?` (${PL(m[2])}ৰ ৰূপে)`:''}`;
 if(p=='rules no house')return'কোনো ভাৱৰ অধিপতি নহয়';
 if(m=p.match(/^placed in house (\d+) \((.+?)\)(, a dusthana)?$/))return`ভাৱ ${m[1]}ত স্থিত (${PHRASE[m[2]]||m[2]})${m[3]?', দুঃস্থান':''}`;
 if(m=p.match(/^(\w[\w ]*) tara from Moon$/))return`চন্দ্ৰৰ পৰা ${PL(m[1])} তাৰা`;
 if(p=='exalted')return'উচ্চ';if(p=='own sign')return'স্বক্ষেত্ৰ';if(p=='debilitated')return'নীচ';
 return p};
const whyList=s=>s.split('; ').map(whyPart).join('; ');
rule(/^(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu|[^\sA-Za-z]\S*) governs (.+?)\. It is (.+?)(?:, and sits (\d+) from the mahadasha lord( \(a strained 6\/8\/12 relation\))?)?\. (.+)\.$/,m=>
 `${/^[A-Z]/.test(m[1])?PL(m[1]):m[1]}ৰ কাৰকত্ব: ${kwList(m[2])}। এই গ্ৰহ ${RELT[m[3]]||m[3]}${m[4]?`, আৰু মহাদশাপতিৰ পৰা ${m[4]} ভাৱত অৱস্থিত${m[5]?' (6/8/12 সম্পৰ্ক, চাপযুক্ত)':''}`:''}। ${whyList(m[6])}।`);
rule(/^(Traditional themes may include [^.]+\.) (rules .+)\.$/,m=>`${EXm.get(m[1])||m[1]} ${whyList(m[2])}।`);
rule(/^(rules (?:houses? [\d &]+|no house).*)\.$/,m=>`${whyList(m[1])}।`);
rule(/^(Traditional themes may include .+)$/,m=>EXm.get(m[1])||null);
rule(/^(rules .+?; placed in house .+)$/,m=>`${whyList(m[1].replace(/\.$/,''))}`);
// Pataki short codes
const PS={Su:'ৰ',Mo:'চ',Ma:'ম',Me:'বু',Ju:'বৃ',Ve:'শু',Sa:'শ',Ra:'ৰা',Ke:'কে',Dh:'ধূ',Vya:'ব্য',Par:'প',Ch:'চা',UpK:'উকে',Gu:'গু'};
const PSK=Object.keys(PS).join('|');
const psTok=t=>PS[t]||t;
rule(new RegExp(`^((?:${PSK})(?:[ ,]+(?:${PSK}|\\+\\d+))*(?: \\+\\d+)?)$`),m=>m[1].replace(new RegExp(`\\b(${PSK})\\b`,'g'),(_,k)=>PS[k]));
rule(new RegExp(`^House (\\d+) · (\\S+)(?: · ((?:${PSK})(?:[ ,]+(?:${PSK}))*(?: \\+\\d+)?))?$`),m=>`ভাৱ ${m[1]} · ${m[2]}${m[3]?' · '+m[3].replace(new RegExp(`\\b(${PSK})\\b`,'g'),(_,k)=>PS[k]):''}`);
rule(new RegExp(`^House (\\d+), (\\S+): (no listed bodies|(?:${PSK})(?:, (?:${PSK}))*)$`),m=>`ভাৱ ${m[1]}, ${m[2]}: ${m[3]=='no listed bodies'?'কোনো তালিকাভুক্ত বস্তু নাই':m[3].replace(new RegExp(`\\b(${PSK})\\b`,'g'),(_,k)=>PS[k])}`);

add([
['BPHS Ch. 29: seventh collapse; lord is in the 4th, use its occupied sign','BPHS অধ্যায় 29: সপ্তম পতন; অধিপতি 4ৰ্থত আছে, তাৰ অধিকৃত ৰাশি ব্যৱহাৰ কৰক'],
['Source: supplied BPHS English edition, Ch. 7 and Ch. 3/27. Ex/Own/Deb are sign-state markers, not a Vimshopaka score, Shadbala, or a guaranteed prediction. The app’s divisional chart algorithm and dignity inputs determine these summaries; moolatrikona degree limits, friendship tiers, and varga-specific exceptions are not calculated.','উৎস: যোগান ধৰা BPHS ইংৰাজী সংস্কৰণ, অধ্যায় 7 আৰু অধ্যায় 3/27। উ/স্ব/নী ৰাশি-অৱস্থাৰ চিহ্ন মাত্ৰ; ই বিংশোপক নম্বৰ, ষড়বল বা নিশ্চিত ভৱিষ্যদ্বাণী নহয়। এই সাৰাংশসমূহ এপৰ বৰ্গ-কুণ্ডলী গণনা-পদ্ধতি আৰু মৰ্যাদা-উপাত্তৰ ওপৰত নিৰ্ভৰশীল; মূলত্ৰিকোণ অংশৰ সীমা, মিত্ৰতাৰ স্তৰ আৰু বৰ্গ-নিৰ্দিষ্ট ব্যতিক্ৰম গণনা কৰা হোৱা নাই।'],
['The detector uses Sun through Saturn for these seven-Graha formations and excludes nodes. Dala, Vajra and Yava rules requiring benefic/malefic classification are not computed. Each detected formation is paired with the chapter’s stated result; strength, cancellations and dasha activation are not assessed. A chart may meet more than one listed pattern.','এই সাত-গ্ৰহৰ গঠনৰ বাবে ডিটেক্টৰে সূৰ্যৰ পৰা শনিলৈ গ্ৰহ ব্যৱহাৰ কৰে আৰু ৰাহু-কেতু বাদ দিয়ে। শুভ/অশুভ শ্ৰেণীবিভাজন লগা দল, বজ্ৰ আৰু যৱ নিয়ম গণনা কৰা হোৱা নাই। চিনাক্ত হোৱা প্ৰতিটো গঠন অধ্যায়ত কোৱা ফলৰ সৈতে যুক্ত কৰা হৈছে; বল, ভঙ্গ আৰু দশাৰ সক্ৰিয়তা বিচাৰ কৰা হোৱা নাই। এখন কুণ্ডলীয়ে তালিকাভুক্ত এটাতকৈ অধিক গঠন পূৰণ কৰিব পাৰে।'],
['Cells show classical planets in the Argala house versus its obstruction house. The text also requires strength comparison, allows special cases and counts Rahu/Ketu in reverse; those node-specific and strength rules are not calculated here. A count comparison is not a final prediction.','ঘৰবোৰে অৰ্গল ভাৱত থকা শাস্ত্ৰীয় গ্ৰহ আৰু তাৰ বাধা-ভাৱত থকা গ্ৰহৰ তুলনা দেখুৱায়। পাঠত বল-তুলনাও লাগে, বিশেষ ক্ষেত্ৰৰ অনুমতি আছে আৰু ৰাহু/কেতু উলটাকৈ গণনা হয়; সেই ৰাহু-কেতু আৰু বলৰ নিয়ম ইয়াত গণনা কৰা হোৱা নাই। সংখ্যা-তুলনা চূড়ান্ত ভৱিষ্যদ্বাণী নহয়।'],
]);

add([['at least two anchors share a sign, so the text directs judgment from the Rashi chart rather than relying on separate Sudarshana references.','কমেও দুটা ভিত্তি-বিন্দু একেটা ৰাশিত থকাৰ বাবে, পাঠে পৃথক সুদৰ্শন উল্লেখৰ ওপৰত নিৰ্ভৰ নকৰি ৰাশি কুণ্ডলীৰ পৰা বিচাৰ কৰিবলৈ নিৰ্দেশ দিয়ে।']]);
rule(/^BPHS Ch\. (\d+), v\. (\d+) \(quoted from Saravali\)$/,m=>`BPHS অধ্যায় ${m[1]}, শ্লোক ${m[2]} (সাৰাৱলীৰ পৰা উদ্ধৃত)`);
rule(/^All seven classical planets occupy (movable|fixed|dual) signs\.$/,m=>`সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে ${{movable:'চৰ',fixed:'স্থিৰ',dual:'দ্বিস্বভাৱ'}[m[1]]} ৰাশিত আছে।`);
rule(/^(\d+) distinct Lagna-relative houses represented\.$/,m=>`লগ্নৰ তুলনাত ${m[1]}টা পৃথক ভাৱ প্ৰতিনিধিত্ব কৰিছে।`);
rule(/^All seven classical planets are confined to houses ([\d, ]+) from the Lagna\.$/,m=>`সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে লগ্নৰ পৰা ভাৱ ${m[1]}ত সীমাবদ্ধ।`);
rule(/^All seven classical planets are confined to the four consecutive houses beginning with (\d+)\.$/,m=>`সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে ভাৱ ${m[1]}ৰ পৰা আৰম্ভ হোৱা চাৰিটা ক্ৰমিক ভাৱত সীমাবদ্ধ।`);
rule(/^All seven classical planets are confined to seven continuous houses beginning with (\d+)\.$/,m=>`সাতটা শাস্ত্ৰীয় গ্ৰহ সকলোৱে ভাৱ ${m[1]}ৰ পৰা আৰম্ভ হোৱা সাতটা অবিচ্ছিন্ন ভাৱত সীমাবদ্ধ।`);
rule(/^Occupied houses: ([\d, ]+?)(?:; qualifying window begins at house (\d+))?\.$/,m=>`অধিকৃত ভাৱ: ${m[1]}${m[2]?`; যোগ্য সীমা ভাৱ ${m[2]}ৰ পৰা আৰম্ভ`:''}।`);
const PN='Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu';
rule(new RegExp(`^((?:${PN})(?:(?:, |/)(?:${PN}))+)$`),m=>m[1].replace(new RegExp(PN,'g'),x=>PL(x)));
rule(/^(.+) \[adhika flag (\d+)\] \(table\)$/,m=>`${m[1]} [অধিক চিহ্ন ${m[2]}] (তালিকা)`);

// ---------- generic engine
function trText(s){
 if(!s||!/[A-Za-z]{2,}/.test(s))return null;
 if(EXm.has(s))return EXm.get(s);
 for(const [re,fn] of RULES){const m=s.match(re);if(m){const r=fn(m);if(r!=null)return r}}
 return null}
function loc(el){
 if(typeof LANG=='undefined'||LANG!=='as')return;
 const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;const todo=[];
 while(n=w.nextNode()){const p=n.parentNode;if(p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName))continue;todo.push(n)}
 todo.forEach(n=>{const v=n.nodeValue,t=v.trim(),r=trText(t);if(r!=null&&r!==t)n.nodeValue=v.replace(t,r)});
 const q=el.nodeType==1?[el,...el.querySelectorAll('[title],[aria-label],[placeholder]')]:[...el.querySelectorAll?.('[title],[aria-label],[placeholder]')||[]];
 q.forEach(e=>['title','aria-label','placeholder'].forEach(a=>{const v=e.getAttribute&&e.getAttribute(a);if(v){const r=trText(v.trim());if(r!=null)e.setAttribute(a,r)}}))}
window.asLocalize=loc;
function start(){
 if(!document.body)return;
 loc(document.body);
 new MutationObserver(ms=>{if(typeof LANG=='undefined'||LANG!=='as')return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType==1)loc(n);else if(n.nodeType==3&&n.parentNode)loc(n.parentNode)}))}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
