/* WORKFLOW_PACK CSV engine v0.1 — standard library only. No network or storage calls. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WorkflowPackCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HEADERS = ['거래일','거래처코드','거래처','상품코드','상품명','수량','단가'];
  const MAX_FILE_BYTES = 10 * 1024 * 1024, MAX_ROWS = 10000, MAX_FILES = 5, MAX_TOTAL_BYTES = 20 * 1024 * 1024;

  function parseDelimited(text, delimiter) {
    if (typeof text !== 'string') throw Error('문자열 CSV가 아닙니다.');
    if (text.startsWith('\uFEFF')) text = text.slice(1);
    if (text.includes('\0')) throw Error('NUL 바이트가 감지되었습니다. 파일 인코딩을 확인하세요.');
    const rows = []; let row = [], field = '', quoted = false, closedQuote = false, line = 1, startLine = 1, haveData = false;
    const pushField = () => { row.push(field); field = ''; closedQuote = false; };
    const pushRow = () => { pushField(); rows.push({cells:row, line:startLine}); row = []; startLine = line; haveData = false; };
    for (let i=0;i<text.length;i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"') { if (text[i+1] === '"') { field += '"'; i++; } else { quoted = false; closedQuote = true; } }
        else if (c === '\r') { if (text[i+1] === '\n') i++; field += '\n'; line++; }
        else { field += c; if (c === '\n') line++; }
      } else if (c === delimiter) { pushField(); haveData = true; }
      else if (c === '\r' || c === '\n') { if(c === '\r' && text[i+1] === '\n') i++; pushRow(); line++; startLine = line; }
      else if (c === '"') { if (field.length || closedQuote) throw Error(`${line}행: 따옴표 위치가 잘못되었습니다.`); quoted = true; haveData = true; }
      else { if (closedQuote) throw Error(`${line}행: 닫는 따옴표 뒤에 다른 문자가 있습니다.`); field += c; haveData = true; }
    }
    if (quoted) throw Error(`${line}행: 닫히지 않은 따옴표입니다.`);
    if (haveData || field.length || row.length || closedQuote) pushRow();
    return rows;
  }
  function parseCSV(text) { return parseDelimited(text, ','); }
  function parseTSV(text) { return parseDelimited(text, '\t'); }
  // Normalizes pasted Excel/TSV tables without guessing transaction identity or financial values.
  // Generated IDs are temporary, name-based grouping keys for this single paste only.
  function prepareExcelTable(rows) {
    if (!Array.isArray(rows) || rows.length<2) throw Error('제목 행과 거래 데이터가 최소 1행 이상 필요합니다.');
    const aliases={
      '거래일':['거래일','거래일자','거래날짜','일자','날짜','주문일','주문일자','판매일'],
      '거래처코드':['거래처코드','거래처ID','고객코드','업체코드','고객사코드'],
      '거래처':['거래처','거래처명','거래처이름','업체','업체명','고객사','고객사명','고객명'],
      '상품코드':['상품코드','상품ID','상품번호','품목코드','제품코드','SKU'],
      '상품명':['상품명','상품','품목명','품목','제품명','제품'],
      '수량':['수량','판매수량','주문수량','출고수량'],
      '단가':['단가','판매단가','개당금액','개당가격','상품단가']
    };
    const tidy=x=>String(x??'').replace(/\uFEFF/g,'').replace(/[\s_-]+/g,'').toLowerCase();
    const mapping=new Map();
    for(const [name,words] of Object.entries(aliases))for(const word of words)mapping.set(tidy(word),name);
    const first=rows[0].cells.map(x=>String(x??'').trim());
    const seen=new Map(), source=new Map();
    first.forEach((h,i)=>{
      const canon=mapping.get(tidy(h));
      if(!canon)return;
      if(seen.has(canon))throw Error('같은 의미의 열 이름이 중복됩니다: '+first[seen.get(canon)]+' / '+h);
      seen.set(canon,i);source.set(canon,h);
    });
    const required=['거래일','거래처','상품명','수량','단가'];
    const missing=required.filter(x=>!seen.has(x));
    if(missing.length)throw Error('필수 열을 찾지 못했습니다: '+missing.join(', ')+'. 날짜·거래처·상품명·수량·단가 열 제목을 확인해 주세요.');
    const autoVendor=!seen.has('거래처코드'),autoProduct=!seen.has('상품코드');
    const vendorIds=new Map(),productIds=new Map();
    const getId=(store,label,prefix)=>{
      const k=label.trim();
      if(!k)return '';
      if(!store.has(k))store.set(k,'WFP-'+prefix+String(store.size+1).padStart(5,'0'));
      return store.get(k);
    };
    const normalized=rows.slice(1).map(r=>{
      if(r.cells.length!==first.length)return r.cells; // Let the validator report a malformed row.
      const field=name=>seen.has(name)?String(r.cells[seen.get(name)]??'').trim():'';
      const v=Object.fromEntries(HEADERS.map(name=>[name,field(name)]));
      if(autoVendor)v['거래처코드']=getId(vendorIds,v['거래처'],'C');
      if(autoProduct)v['상품코드']=getId(productIds,v['상품명'],'P');
      const date=v['거래일'].match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})\.?$/);
      if(date)v['거래일']=date[1]+'-'+date[2].padStart(2,'0')+'-'+date[3].padStart(2,'0');
      for(const k of ['수량','단가']){
        const value=v[k].replace(/^\s*₩\s*/,'').trim();
        if(/^\d{1,3}(,\d{3})+$/.test(value))v[k]=value.replace(/,/g,'');
        else if(/^\d+$/.test(value))v[k]=value;
      }
      return HEADERS.map(name=>v[name]);
    });
    const ignored=first.filter(x=>!mapping.has(tidy(x))).length;
    return {headers:HEADERS,rows:normalized,autoVendor,autoProduct,ignored,mapped:source};
  }
  function validDate(x) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(x)) return false;
    const [y,m,d]=x.split('-').map(Number);
    const date=new Date(Date.UTC(y,m-1,d));
    return date.getUTCFullYear()===y && date.getUTCMonth()===m-1 && date.getUTCDate()===d;
  }
  function safeText(x) { return String(x ?? '').replace(/\u0000/g,''); }
  // CSV spreadsheet formula injection protection: escape formula-like text, including tab/newline leading characters.
  function safeCell(x) {
    let s = safeText(x);
    if (/^[=+@\-\t\r\n]/.test(s) || /^\s+[=+@\-]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g,'""') + '"';
  }
  function toCSV(headers, rows) {
    return [headers,...rows].map(r=>r.map(safeCell).join(',')).join('\r\n')+'\r\n';
  }
  function processFiles(files) {
    if (!Array.isArray(files) || files.length===0) throw Error('CSV 파일을 하나 이상 선택하세요.');
    if (files.length>MAX_FILES) throw Error(`한 번에 최대 ${MAX_FILES}개 파일을 처리합니다.`);
    const normalized=[], errors=[], summary=new Map(), vendorNames=new Map(), seen=[];
    let totalBytes=0, totalRows=0, excludedRows=0, fileErrors=0, duplicateFiles=0, validFiles=0;
    const addError = (file,line,reason,raw='')=>errors.push({file,line,reason,raw});
    for (const f of files) {
      const filename = String(f.name || '이름 없음');
      if (typeof f.text!=='string') {fileErrors++;addError(filename,'파일','문자 인코딩 해석 실패 또는 입력 형식 오류');continue;}
      const bytes = typeof f.bytes==='number'?f.bytes:new TextEncoder().encode(f.text).length;
      totalBytes += bytes;
      if(totalBytes>MAX_TOTAL_BYTES) throw Error('총 파일 크기가 20MB 상한을 초과합니다. 처리하지 않았습니다.');
      if(bytes>MAX_FILE_BYTES){fileErrors++;addError(filename,'파일','파일당 10MB를 초과했습니다.');continue;}
      let rawRows;
      try {rawRows=parseCSV(f.text);} catch (e) {fileErrors++;addError(filename,'파일',e.message);continue;}
      if (rawRows.length===0) {fileErrors++;addError(filename,'파일','빈 파일입니다.');continue;}
      const data = rawRows.slice(1);
      if (totalRows+data.length>MAX_ROWS) throw Error('전체 데이터가 10,000행 상한을 초과했습니다. 처리하지 않았습니다.');
      totalRows+=data.length;
      if (seen.includes(f.text)) {duplicateFiles++;excludedRows+=data.length;data.forEach(r=>addError(filename,r.line,'동일한 내용의 파일이 중복 선택되어 제외됨',r.cells.join(' | ')));continue;}
      seen.push(f.text);
      const header = rawRows[0].cells.map(x=>x.trim());
      const headerSet=new Set(header);
      if(headerSet.size!==header.length || HEADERS.some(x=>!headerSet.has(x))) {
        fileErrors++;excludedRows+=data.length;
        const missing=HEADERS.filter(x=>!headerSet.has(x));
        const why=missing.length ? `필수 열 누락: ${missing.join(', ')}` : '동일한 열 이름 중복';
        data.forEach(r=>addError(filename,r.line,why,r.cells.join(' | ')));
        if(!data.length) addError(filename,1,why);
        continue;
      }
      validFiles++;
      for (const r of data) {
        const cells=r.cells;
        if (cells.length!==header.length) {excludedRows++;addError(filename,r.line,`열 개수 불일치: 기대 ${header.length}, 실제 ${cells.length}`,cells.join(' | '));continue;}
        const obj=Object.fromEntries(header.map((key,i)=>[key,cells[i].trim()]));
        if(Object.values(obj).every(x=>x==='')) {excludedRows++;addError(filename,r.line,'빈 행', '');continue;}
        let problem='';
        if (!validDate(obj['거래일'])) problem='날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다.';
        else if(!obj['거래처코드'] || !obj['거래처'] || !obj['상품코드'] || !obj['상품명']) problem='거래처·품목 식별 필드 빈칸';
        else if(obj['수량']==='') problem='수량 빈칸(0과 다름)';
        else if(!/^\d+$/.test(obj['수량']) || !Number.isSafeInteger(Number(obj['수량'])) || Number(obj['수량'])===0) problem='수량은 양의 정수만 허용, 취소·반품·음수는 확인 필요';
        else if(obj['단가']==='') problem='단가 빈칸(0원은 허용)';
        else if(!/^\d+$/.test(obj['단가']) || !Number.isSafeInteger(Number(obj['단가']))) problem='단가는 0 이상의 정수 원 단위만 허용';
        const qty=Number(obj['수량']), price=Number(obj['단가']);
        const amount=qty*price;
        if(!problem && !Number.isSafeInteger(amount)) problem='계산 결과가 안전한 정수 범위를 초과함';
        const key=JSON.stringify([obj['거래처코드'],obj['상품코드']]);
        const current=summary.get(key);
        if(!problem && vendorNames.has(obj['거래처코드']) && vendorNames.get(obj['거래처코드'])!==obj['거래처']) problem='동일 거래처코드의 거래처명이 서로 달라 확인 필요';
        if(!problem && current && (current['거래처']!==obj['거래처']||current['상품명']!==obj['상품명'])) problem='동일 코드의 거래처명/상품명이 서로 달라 확인 필요';
        if(problem){excludedRows++;addError(filename,r.line,problem,cells.join(' | '));continue;}
        const clean = {'거래일':obj['거래일'],'거래처코드':obj['거래처코드'],'거래처':obj['거래처'],'상품코드':obj['상품코드'],'상품명':obj['상품명'],'수량':qty,'단가':price,'금액':amount,'원본파일':filename,'원본행':r.line};
        normalized.push(clean);
        vendorNames.set(obj['거래처코드'],obj['거래처']);
        if(current){current['총수량']+=qty;current['총금액']+=amount;
          if(!Number.isSafeInteger(current['총수량'])||!Number.isSafeInteger(current['총금액']))throw Error('집계값 정수 범위 초과: 결과가 저장되지 않았습니다.');
        } else summary.set(key,{'거래처코드':obj['거래처코드'],'거래처':obj['거래처'],'상품코드':obj['상품코드'],'상품명':obj['상품명'],'총수량':qty,'총금액':amount});
      }
    }
    const totalQuantity=normalized.reduce((s,r)=>s+r['수량'],0);
    const totalAmount=normalized.reduce((s,r)=>s+r['금액'],0);
    if(!Number.isSafeInteger(totalQuantity)||!Number.isSafeInteger(totalAmount))throw Error('총계 정수 범위 초과');
    const stats={fileCount:files.length,validFiles,fileErrors,duplicateFiles,totalRows,includedRows:normalized.length,excludedRows,totalQuantity,totalAmount,partial:errors.length>0||fileErrors>0};
    if(totalRows!==normalized.length+excludedRows)throw Error('내부 수량 검산 실패');
    return {normalized,summary:[...summary.values()].sort((a,b)=>a['거래처코드'].localeCompare(b['거래처코드'],'ko')||a['상품코드'].localeCompare(b['상품코드'],'ko')),errors,stats};
  }
  const COLS={normalized:['거래일','거래처코드','거래처','상품코드','상품명','수량','단가','금액','원본파일','원본행'],summary:['거래처코드','거래처','상품코드','상품명','총수량','총금액'],errors:['원본파일','원본행','문제','원본요약']};
  function exportCSV(result,kind) {
    if(kind==='errors') return toCSV(COLS.errors,result.errors.map(x=>[x.file,x.line,x.reason,x.raw]));
    if(!['summary','normalized'].includes(kind))throw Error('알 수 없는 결과 형식');
    return toCSV(COLS[kind],result[kind].map(x=>COLS[kind].map(k=>x[k])));
  }
  return {HEADERS,MAX_FILE_BYTES,MAX_ROWS,MAX_FILES,parseCSV,parseTSV,prepareExcelTable,toCSV,safeCell,processFiles,exportCSV,COLS};
});