let currentTheme = 'matrix';
const THEME_KEY = 'app-theme';
let menuOpen = false;
let currentLang = 'en';
let srcMode = 'lightshade';
let tgtMode = 'lsai';
let currentConvertedIR = null;
let currentConvertedString = "";

// === THEME ===
function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (['matrix','skeuomorphic','cli'].includes(saved)) currentTheme = saved;
    applyTheme(currentTheme, false);
}
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme, true);
    updateMenuThemeOpts();
    updateUI();
    if (menuOpen) toggleMenu();
}
function applyTheme(theme, animate) {
    document.body.classList.remove('theme-matrix','theme-skeuomorphic','theme-cli');
    document.body.classList.add('theme-' + theme);
    const canvas = document.getElementById('matrix');
    canvas.style.opacity = (theme === 'skeuomorphic' || theme === 'cli') ? '0' : '0.08';
    updateStatusColors(document.getElementById('status').dataset.statusType || 'neutral');
    if (animate && theme !== 'cli') {
        const t = document.querySelector('.theme-transition');
        t.classList.remove('theme-transition');
        void t.offsetWidth;
        t.classList.add('theme-transition');
    }
}

// === MENU ===
function toggleMenu() {
    menuOpen = !menuOpen;
    const dd = document.getElementById('menuDropdown');
    const btn = document.getElementById('menuBtn');
    dd.classList.toggle('open', menuOpen);
    btn.classList.toggle('menu-open', menuOpen);
    btn.setAttribute('aria-expanded', String(menuOpen));
}
document.addEventListener('click', (e) => {
    if (menuOpen && !e.target.closest('#menuBtn') && !e.target.closest('#menuDropdown')) toggleMenu();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) toggleMenu();
});
function updateMenuThemeOpts() {
    document.querySelectorAll('[data-theme-opt]').forEach(el => el.classList.toggle('active', el.dataset.themeOpt === currentTheme));
}

// === MATRIX CANVAS ===
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let drops = [];
const chars = "0101アイウエオカキクケコサシスセソﾊﾐﾑﾒﾓABCDEFGHIJKLMNOPQRSTUVWXYZ<>;[]{}()*/+-=░▒▓◆◇■□";

let columns = 0;
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    columns = Math.floor(window.innerWidth / 18);
    drops = Array(columns).fill().map(() => Math.random() * -30);
}
let lastTime = 0;
const fpsInterval = 1000 / 18;
function drawMatrix(timestamp) {
    requestAnimationFrame(drawMatrix);
    const elapsed = timestamp - lastTime;
    if (elapsed < fpsInterval) return;
    lastTime = timestamp - (elapsed % fpsInterval);
    ctx.fillStyle = 'rgba(9,9,11,0.15)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = '14px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = 1;
        ctx.fillText(text, i * 18, drops[i] * 18);
        ctx.globalAlpha = 1;
        if (drops[i] * 18 > window.innerHeight && Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawMatrix);

// === TRANSLATIONS ===
const translations = {
    en: { subtitle:"chat-to-chat structure compiler",badge:"Local & Private",warning_title:"All calculations are processed completely offline inside your browser.",warning_text:"Your files, prompts, and conversation data never leave your local workspace.",sample_btn:"sample",upload_btn:"upload",compile_btn:"convert to {target}",reset_btn:"reset",copy_btn:"copy",download_btn:"download",placeholder_output:"Awaiting valid data...",preview_header:"Visual Live Chat Preview (Top 4 messages)",preview_fallback:"No converted conversation loaded. Transform some data to preview dialogue bubbles...",preview_empty:"Converted list is empty.",footer_text:"developed for flawless chat migrations • local execution env • v2.0",status_ready:"Local terminal ready • Upload file or load demo template",status_success_sample:"Sample chat loaded successfully",status_error_empty:"Paste some data inside input space first",status_error_invalid:"Compilation aborted — Invalid formatting",status_success_convert:"Conversion success: Compiled {count} messages",status_success_download:"Saved exported file as {file}",status_success_copy:"✓ Data copied to clipboard buffer",status_reset:"Workspace refreshed",status_error_txt:"Please upload a .json, .txt, or .jsonl file",placeholder_input_lightshade:"Paste your old Lightshade exported JSON file here...",placeholder_input_sillytavern:"Paste your SillyTavern JSONL file here...",placeholder_input_lsai:"Paste your LSAI formatted JSON file here..." },
    ru: { subtitle:"мультиконвертер структуры диалогов",badge:"Локально и приватно",warning_title:"Все вычисления происходят полностью локально в вашем браузере.",warning_text:"Ваши файлы, промпты и данные диалогов никогда не пркинут локальное рабочее пространство.",sample_btn:"пример",upload_btn:"загрузить",compile_btn:"конвертировать в {target}",reset_btn:"сбросить",copy_btn:"копировать",download_btn:"скачать",placeholder_output:"Ожидание корректных данны�...",preview_header:"Предпросмотр чата (первые 4 сообщения)",preview_fallback:"Сконвертированный диалог не загружен. Преобразуйте данные, чтобы увидеть пузыри сообщений...",preview_empty:"Список сообщений пуст.",footer_text:"разработано для бесшовного переноса чатов • локальная среда • v2.0",status_ready:"Локальный терминал готов • Загрузите файл или запустите пример",status_success_sample:"Пример диалога успешно загружен",status_error_empty:"Сначала вставьте структуру диалога в поле ввода",status_error_invalid:"Компиляция отменена — некорректный формат",status_success_convert:"Успешная конвертация: скомпилировано {count} сообщений",status_success_download:"Экспортированный файл сохранен как {file}",status_success_copy:"✓ Данные скопированы в буфер обмена",status_reset:"Рабочая область сброшена",status_error_txt:"Пожалуйста, загрузите файл .json, .jsonl или .txt",placeholder_input_lightshade:"Вставьте ваш экспортированный файл JSON из Lightshade...",placeholder_input_sillytavern:"Вставьте ваш файл JSONL из SillyTavern здесь...",placeholder_input_lsai:"Вставьте ваш файл JSON из LSAI здесь..." },
    vi: { subtitle:"trình biên dịch cấu trúc lịch sử chat",badge:"Nội bộ & Riêng tư",warning_title:"Tất cả tính toán được xử lý hoàn toàn ngoại tuyến trong trình duyệt của ạn.",warning_text:"Tệp tin, câu lệnh và 仯 liệu cuộc trò chuyện không bao giờ rời khỏi ộ nhớ ộnh ộc bộ.",sample_btn:"mẫu",upload_btn:"tải lên",compile_btn:"chuyển sang {target}",reset_btn:"reset",copy_btn:"sao chép",download_btn:"tải xuống",placeholder_output:"Đang chờ 仯 liệu hợp 뻇...",preview_header:"Xem trước trực quan cuộc trò chuyện",preview_fallback:"Chưa có 仯 liệu nào được chuyển đổi...",preview_empty:"Danh sách trống.",footer_text:"di chuyển mượt mà • môi trường ục ộ • v2.0",status_ready:"Thiết bị ục ộ đã sẵn sàng • Tải �p lên",status_success_sample:"Tải �ẫu �ônh công",status_error_empty:"Vui lòng dán 仯 liệu vào trường nhập trước",status_error_invalid:"Biên 介ch ị hủy — Định 亡ng không �ợp lệ",status_success_convert:"Thành công: Đã 介ch {count} tin nhắn",status_success_download:"Đã lưu �p dưới 両ng {file}",status_success_copy:"✓ Đã sao chép vào ộ nhớ đệm",status_reset:"Đã làm �ới",status_error_txt:"Vui lòng tải �p .json, .jsonl",placeholder_input_lightshade:"Dán �p Lightshade JSON �i đây...",placeholder_input_sillytavern:"Dán �p SillyTavern JSONL �i đây...",placeholder_input_lsai:"Dán �p LSAI JSON �i đây..." },
    tr: { subtitle:"sohbet geçmişi yapısı derleyici",badge:"Yerel & Gizli",warning_title:"Tüm işlemler tarayıcı�ı��� tamamen çevrimdışı??? gerçekleştirilir.",warning_text:"Dosyalarınız, komutlarınız ve konuşma verileriniz asla dışarı çıkmaz.",sample_btn:"örnek",upload_btn:"yükle",compile_btn:"{target}'e dönüştür",reset_btn:"sıfırla",copy_btn:"kopyala",download_btn:"indir",placeholder_output:"Geçerli veri bekleniyor...",preview_header:"Görsel Sohbet Önizlemesi",preview_fallback:"Sohbet yüklenmedi. Dönüştürme işlemini yapın...",preview_empty:"Liste boş.",footer_text:"sorunsuz geçişler için geliştirildi • yerel ortam • v2.0",status_ready:"Yerel terminal hazır",status_success_sample:"Örnek sohbet başarıyla yüklendi",status_error_empty:"Önce giriş alanına veri yapıştırın",status_error_invalid:"Geçersiz biçimlendirme",status_success_convert:"Başarılı: {count} mesaj derlendi",status_success_download:"Veri {file} olarak kaydedildi",status_success_copy:"✓ Kopyalandı",status_reset:"Yenilendi",status_error_txt:"Lütfen .json veya .jsonl dosyası yükleyin",placeholder_input_lightshade:"Lightshade JSON dosyasını buraya yapıştırın...",placeholder_input_sillytavern:"SillyTavern JSONL dosyasını buraya yapıştırın...",placeholder_input_lsai:"LSAI JSON dosyasını buraya yapıştırın..." },
    pl: { subtitle:"kompilator struktury historii czatu",badge:"Lokalnie & Prywatnie",warning_title:"Wszystkie obliczenia są przetwarzane całkowicie offline w Twojej przeglądarce.",warning_text:"Twoje pliki, prompty i dane konwersacji nigdy nie opuszczają lokalnego komputera.",sample_btn:"przykład",upload_btn:"prześlij",compile_btn:"konwertuj do {target}",reset_btn:"reset",copy_btn:"kopiuj",download_btn:"pobierz",placeholder_output:"Oczekiwanie na poprawne dane...",preview_header:"Wizualny podgląd czatu na żywo",preview_fallback:"Brak skonwertowanej konwersacji...",preview_empty:"Lista jest pusta.",footer_text:"stworzone dla bezproblemowej migracji • środowisko lokalne • v2.0",status_ready:"Gotowy • Prześlij plik",status_success_sample:"Pomyślnie załadowano przykład",status_error_empty:"Najpierw wklej dane",status_error_invalid:"Nieprawidłowy format",status_success_convert:"Sukces: Skompilowano {count} wiadomości",status_success_download:"Zapisano jako {file}",status_success_copy:"✓ Skopiowano do schowka",status_reset:"Zresetowano",status_error_txt:"Prześlij plik .json lub .jsonl",placeholder_input_lightshade:"Wklej plik Lightshade JSON...",placeholder_input_sillytavern:"Wklej plik SillyTavern JSONL...",placeholder_input_lsai:"Wklej plik LSAI JSON..." }
};

const sampleMathIR = [
    { sender:"user", texts:["Hello! Can you help me find the derivative of the function f(x) = x^3 + 2x^2 - 5x + 7 and then integrate the result back to verify it?"], timestamp:"2026-06-16T12:01:23Z" },
    { sender:"character", texts:["Of course! Let's solve this step by step.\n\nFirst, we'll find the derivative f'(x) using the power rule:\n\nf'(x) = d/dx(x^3) + d/dx(2x^2) - d/dx(5x) + d/dx(7)\nf'(x) = 3x^2 + 4x - 5\n\nNow, let's integrate f'(x) back:\n\n∫(3x^2 + 4x - 5) dx = x^3 + 2x^2 - 5x + C\n\nSince C is the constant of integration, it matches the original constant '7' from your function. It works perfectly!"], timestamp:"2026-06-16T12:02:45Z" },
    { sender:"user", texts:["That makes total sense! Thank you so much for the clear and quick explanation."], timestamp:"2026-06-16T12:04:10Z" }
];

function getModeTitle(m) { return m === 'lightshade' ? 'lightshade' : m === 'sillytavern' ? 'silly tavern' : 'lsai'; }
function getI18nStr(key, args = {}) { let str = translations[currentLang][key] || translations['en'][key] || ''; for (const [k,v] of Object.entries(args)) str = str.replace(`{${k}}`, v); return str; }

// === UI ===
function updateUI() {
    document.querySelectorAll('.src-seg .seg-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === srcMode));
    document.querySelectorAll('.tgt-seg .seg-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === tgtMode));
    document.getElementById('main-title').innerHTML = `${getModeTitle(srcMode)} <span class="title-arrow mx-1">→</span> ${getModeTitle(tgtMode)}`;
    document.getElementById('btn-convert').textContent = getI18nStr('compile_btn', {target: getModeTitle(tgtMode)});
    document.getElementById('inputArea').setAttribute('placeholder', getI18nStr(`placeholder_input_${srcMode}`));
}
function changeLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-lang]').forEach(el => el.classList.toggle('active', el.dataset.lang === lang));
    document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if (translations[lang] && translations[lang][k]) el.textContent = translations[lang][k]; });
    updateUI();
    if (currentConvertedIR) { renderLiveChatPreview(currentConvertedIR); showStatus(getI18nStr('status_success_convert', {count: currentConvertedIR.length}), 'success'); }
    else { showStatus(getI18nStr('status_ready')); const pf = document.querySelector('[data-i18n="preview_fallback"]'); if (pf) pf.textContent = translations[lang]['preview_fallback']; }
}
function setSourceMode(mode) { if (mode === tgtMode) tgtMode = mode === 'lightshade' ? 'lsai' : 'lightshade'; srcMode = mode; if (document.getElementById('inputArea').value.trim()) resetAll(); updateUI(); }
function setTargetMode(mode) { if (mode === srcMode) srcMode = mode === 'lightshade' ? 'lsai' : 'lightshade'; tgtMode = mode; if (document.getElementById('inputArea').value.trim()) resetAll(); updateUI(); }

// === STATUS ===
function updateStatusColors(type) {
    const s = document.getElementById('status'), dot = s.querySelector('span:first-child');
    const isSk = currentTheme === 'skeuomorphic';
    if (type === 'success') { if(dot) dot.className='w-2 h-2 rounded-full inline-block shrink-0 bg-emerald-400'; s.style.color = isSk?'#34c759':'#34d399'; }
    else if (type === 'error') { if(dot) dot.className='w-2 h-2 rounded-full inline-block shrink-0 bg-rose-400'; s.style.color = isSk?'#ff3b30':'#f87171'; }
    else { if(dot) dot.className='w-2 h-2 rounded-full inline-block shrink-0 bg-zinc-500 animate-pulse'; s.style.color='#a1a1aa'; }
}
function showStatus(msg, type = 'neutral') {
    const s = document.getElementById('status'); s.dataset.statusType = type; s.innerHTML = '';
    s.appendChild(document.createElement('span'));
    const t = document.createElement('span'); t.className='truncate'; t.textContent=msg; s.appendChild(t);
    updateStatusColors(type);
    const a = currentTheme==='skeuomorphic'?'ios6-spring':'fade-in';
    s.classList.add(a); setTimeout(()=>s.classList.remove(a), 600);
}

// === PARSERS ===
function normalizeContent(v) { if(Array.isArray(v)) return v.map(x=>typeof x==='string'?x:JSON.stringify(x)); if(typeof v==='string') return [v]; if(v===null||v===undefined) return [""]; return [typeof v==='object'?JSON.stringify(v):String(v)]; }
function parseLightshade(t) { const i=JSON.parse(t); let m=[]; if(Array.isArray(i)) m=i; else if(i&&i.messages&&Array.isArray(i.messages)) m=i.messages; else throw new Error("Could not find messages array"); return m.map(msg=>({sender:(msg.role==="assistant"||msg.sender==="assistant")?"character":(msg.sender||msg.role||"user"),texts:normalizeContent(msg.content??msg.texts??""),timestamp:msg.timestamp||msg.created_at||new Date().toISOString(),...(msg.name?{name:msg.name}:{})})); }
function parseSillyTavern(t) { const lines=t.split('\n').map(l=>l.trim()).filter(l=>l); const msgs=[]; for(const l of lines){const p=JSON.parse(l); if(p.mes===undefined)continue; msgs.push({sender:p.is_user?"user":"character",texts:normalizeContent(p.mes),timestamp:p.send_date?new Date(Number(p.send_date)).toISOString():new Date().toISOString(),...(p.name?{name:p.name}:{})});} if(!msgs.length) throw new Error("No readable messages found"); return msgs; }
function parseLSAI(t) { const i=JSON.parse(t); if(!Array.isArray(i)) throw new Error("LSAI format must be a JSON array"); return i.map(msg=>({sender:msg.sender||(msg.role==='assistant'?'character':msg.role)||"user",texts:normalizeContent(msg.texts??msg.content??""),timestamp:msg.timestamp||new Date().toISOString(),...(msg.name?{name:msg.name}:{})})); }

// === FORMATTERS ===
function formatToLightshade(ir) { return JSON.stringify({character:"Assistant",created_at:new Date().toISOString(),messages:ir.map(m=>({role:m.sender==="character"?"assistant":m.sender,content:m.texts.join('\n'),timestamp:m.timestamp}))},null,2); }
function formatToSillyTavern(ir) { let o=`{"user_name":"You","character_name":"Assistant","create_date":${Date.now()}}\n`; ir.forEach(m=>{const u=m.sender==="user"||m.sender==="You"; o+=JSON.stringify({name:m.name||(u?"You":"Assistant"),is_user:u,is_name:true,send_date:m.timestamp?new Date(m.timestamp).getTime():Date.now(),mes:m.texts.join('\n')})+"\n";}); return o.trim(); }
function formatToLSAI(ir) { return JSON.stringify(ir,null,2); }

// === CORE ===
function loadSample() {
    const el = document.getElementById('inputArea');
    if (srcMode === 'lightshade') el.value = formatToLightshade(sampleMathIR);
    else if (srcMode === 'sillytavern') el.value = formatToSillyTavern(sampleMathIR);
    else el.value = formatToLSAI(sampleMathIR);
    convertChat();
    showStatus(getI18nStr('status_success_sample'), "success");
}

function convertChat() {
    const outputPanel = document.querySelector('.panel-output');
    const previewBox = document.querySelector('.preview-box');
    const txt = document.getElementById('inputArea').value.trim();
    if (!txt) { showStatus(getI18nStr('status_error_empty'), "error"); return; }

    outputPanel.classList.add('panel-blur');
    previewBox.classList.add('panel-blur');

    // Use rAF to let the blur paint before the synchronous work
    requestAnimationFrame(() => {
        setTimeout(() => {
            try {
                let ir;
                if (srcMode === 'lightshade') ir = parseLightshade(txt);
                else if (srcMode === 'sillytavern') ir = parseSillyTavern(txt);
                else ir = parseLSAI(txt);
                currentConvertedIR = ir;
                if (tgtMode === 'lightshade') currentConvertedString = formatToLightshade(ir);
                else if (tgtMode === 'sillytavern') currentConvertedString = formatToSillyTavern(ir);
                else currentConvertedString = formatToLSAI(ir);
                document.getElementById('outputArea').textContent = currentConvertedString;
                document.getElementById('outputPlaceholder').classList.add('hidden');
                const o = document.getElementById('outputArea');
                o.classList.add('fade-in');
                setTimeout(() => o.classList.remove('fade-in'), 400);
                document.getElementById('downloadBtn').disabled = false;
                document.getElementById('copyBtn').disabled = false;
                renderLiveChatPreview(ir);
                showStatus(getI18nStr('status_success_convert', { count: ir.length }), "success");
            } catch (e) {
                showStatus(getI18nStr('status_error_invalid') + " " + e.message, "error");
            }
            outputPanel.classList.remove('panel-blur');
            previewBox.classList.remove('panel-blur');
        }, 60);
    });
}

function renderLiveChatPreview(ir) {
    const c=document.getElementById('chatPreview'); c.innerHTML=''; const sl=ir.slice(0,4);
    if(!sl.length){c.innerHTML=`<div class="text-xs text-zinc-500 italic">${getI18nStr('preview_empty')}</div>`;return;}
    const isSk=currentTheme==='skeuomorphic';
    const anim=isSk?'ios6-slide-up':'fade-in';
    sl.forEach((msg,idx)=>{ const b=document.createElement('div'); b.className=`flex flex-col max-w-[85%] p-4 gap-1.5 transition-all duration-200 border ${anim} rounded-3xl`; b.style.animationDelay=`${idx*0.08}s`;
    if(msg.sender==='character'||msg.sender==='assistant'){b.classList.add('bg-emerald-950/20','border-emerald-500/20','text-zinc-200','self-start');} else {b.classList.add('bg-zinc-900/60','border-zinc-800','text-zinc-300','self-end','ml-auto');}
    const rc=(msg.sender==='character'||msg.sender==='assistant')?(isSk?'text-green-400':'text-emerald-400'):'text-zinc-400';
    const ts=msg.timestamp?`<span class="text-[9px] text-zinc-500 font-normal select-none">${msg.timestamp.split('T')[0]||''}</span>`:'';
    const ns=msg.name?`<span class="text-[9px] font-bold text-zinc-300 ml-1">(${msg.name})</span>`:'';
    b.innerHTML=`<div class="flex items-center gap-2 select-none"><span class="text-[10px] font-bold uppercase tracking-wider ${rc}">${msg.sender} ${ns}</span>${ts}</div><p class="text-xs leading-relaxed whitespace-pre-wrap">${msg.texts[0]||''}</p>`;
    c.appendChild(b);});
}
function downloadOutput() { if(!currentConvertedString)return; const ext=tgtMode==='sillytavern'?'jsonl':'json'; const f=`chat-export-${tgtMode}.${ext}`; const b=new Blob([currentConvertedString],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u;a.download=f;a.click();URL.revokeObjectURL(u); showStatus(getI18nStr('status_success_download',{file:f}),"success"); }
function copyOutput() { if(!currentConvertedString)return; navigator.clipboard.writeText(currentConvertedString).then(()=>showStatus(getI18nStr('status_success_copy'),"success")); }

function resetAll() {
    const blurTargets = document.querySelectorAll('.panel-input, .panel-output, .preview-box');
    blurTargets.forEach(p => p.classList.add('panel-blur'));

    requestAnimationFrame(() => {
        setTimeout(() => {
            document.getElementById('inputArea').value = '';
            document.getElementById('outputArea').textContent = '';
            document.getElementById('outputPlaceholder').classList.remove('hidden');
            currentConvertedIR = null;
            currentConvertedString = "";
            document.getElementById('downloadBtn').disabled = true;
            document.getElementById('copyBtn').disabled = true;
            document.getElementById('chatPreview').innerHTML = `<div data-i18n="preview_fallback" class="text-xs text-zinc-500 italic">${getI18nStr('preview_fallback')}</div>`;
            showStatus(getI18nStr('status_reset'));
            blurTargets.forEach(p => p.classList.remove('panel-blur'));
        }, 60);
    });
}

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.json') && !ext.endsWith('.txt') && !ext.endsWith('.jsonl')) { showStatus(getI18nStr('status_error_txt'), "error"); return; }
    if (ext.endsWith('.jsonl') && srcMode !== 'sillytavern') setSourceMode('sillytavern');
    else if (ext.endsWith('.json') && srcMode === 'sillytavern') setSourceMode('lsai');

    const inputPanel = document.querySelector('.panel-input');
    inputPanel.classList.add('panel-blur');

    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('inputArea').value = ev.target.result;
        inputPanel.classList.remove('panel-blur');
        convertChat();
    };
    reader.readAsText(file);
});

loadTheme(); updateMenuThemeOpts(); updateUI(); changeLang('en');
