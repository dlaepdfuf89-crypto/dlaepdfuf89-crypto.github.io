/* Survive 60 / game-ac.com Japanese hosted-browser enhancement.
 * Applies only inside the partner iframe. Native Toss/ONEplay bundles unchanged.
 */
(() => {
  const qs = new URLSearchParams(location.search);
  const locale = (qs.get("lang") || navigator.language || "ko").toLowerCase();
  let refHost = "";
  try { refHost = new URL(document.referrer).hostname.toLowerCase(); } catch {}
  const portal = qs.get("embed") === "gameac" || refHost === "game-ac.com" || refHost.endsWith(".game-ac.com");
  if (window.self === window.top || !portal || !/^ja(?:-|$)/.test(locale)) return;

  document.documentElement.classList.add("s60-gameac-polished");
  document.documentElement.lang="ja";
  // The free international build has no payable ONEplay store or rewarded ads.
  const css=document.createElement("style");
  css.textContent=`
    html.s60-gameac-polished .lobbyTabs button:first-child,
    html.s60-gameac-polished .rewardDock,
    html.s60-gameac-polished .oneplayIapCatalog,
    html.s60-gameac-polished .overlay.upgrade .transcendPick,
    html.s60-gameac-polished .overlay.result .rewardBtn,
    html.s60-gameac-polished .overlay.revive .reviveBtn,
    html.s60-gameac-polished .lobbyQuickReward { display:none!important; }
    html.s60-gameac-polished .overlay.upgrade button:focus-visible {
      outline:3px solid #a1f5ff!important;outline-offset:3px;
      box-shadow:0 0 0 6px rgba(22,174,250,.28)!important;
    }
  `;
  document.head.appendChild(css);
  const words = new Map([
    ["▶ 60초 전투 시작","▶ 60秒チャレンジ開始"],
    ["일반 전투","60秒サバイバル"],
    ["전투기 스킨","機体スキン"],
    ["광고 준비 중","広告は利用できません"],
    ["광고 0/5회 · 준비 중","広告は利用できません"],
    ["광고 0/10회 · 준비 중","広告は利用できません"],
    ["보스 피해량","ボスダメージ"],
    ["오늘의 던전:","本日のチャレンジ:"],
    ["내 보스 최고 피해:","ボス最高ダメージ:"],
    ["내 무제한 최고 기록:","エンドレス最高記録:"],
    ["전투","バトル"],["시작","開始"],["회 클리어","回クリア"],
    ["누적","累計"],["교환","交換"],["다음","次の"],
    ["보스","ボス"],["등장","登場"],["첫 보상","初回報酬"],
    ["보스 연속전","ボス連戦"],
    ["혜성 추격전","彗星追撃戦"],["강철 요새","鋼鉄要塞"],
    ["양면 포위전","両側包囲戦"],["집중 포격전","集中砲撃戦"],
    ["초고속 회피전","超高速回避戦"],["철벽 방어전","鉄壁防衛戦"],
    ["고속 적기 24기 격추","高速敵機24機撃墜"],
    ["장갑 적기 10기 파괴","装甲機10機撃破"],
    ["고속 적기 20기 격추","高速敵機20機撃墜"],
    ["보스 누적 피해 2,200","ボス累計ダメージ2,200"],
    ["75초 끝까지 살아남기","75秒生き残る"],
    ["90초 끝까지 살아남기","90秒生き残る"],
    ["보스 2기 격파","ボス2体撃破"],
    ["가속 돌진 · 고속 적기 편대","高速突撃・敵機編隊"],
    ["느리지만 튼튼한 장갑 편대","装甲機編隊が襲来"],
    ["좌우 번갈아 등장하는 측면 기습","左右からの奇襲"],
    ["시작 8초부터 보스 집중 포격","開始8秒からボス砲撃"],
    ["고속 적기 러시 · 내 기체 이동 +18%","敵機ラッシュ・移動速度+18%"],
    ["장갑 편대 압박 · 20초마다 체력 12 회복","装甲機戦・20秒ごとHP+12"],
    ["8초·38초·68초 보스 등장","8秒・38秒・68秒ボス登場"],
    ["전투 지원 코인","戦闘支援コイン"],
    ["오늘의 던전","本日のチャレンジ"],
    ["광고 보고 다음 판 공격 +40%","広告で次の攻撃力+40%"],
    ["광고 보고 다음 판 받는 피해 -50%","広告で次の被ダメージ-50%"],
    ["광고 상자 +300 코인","広告宝箱+300コイン"],
    ["영구 강화","永続強化"],
    ["강화","強化"],["초월","超越"],["각성","覚醒"],
    ["다음 무기 진화","次の武器進化"],
    ["1회 클리어","1回クリア"],
    ["최고 티어 달성","最高ランク達成"],
    ["이번 판","今回"],
    ["킬 · 내 기록을 넘을 수 있을까?","キル・この記録を超えられる？"],
    ["내 기록을 넘을 수 있을까?","この記録を超えられる？"],
    ["다음 랭크까지","次のランクまであと"],
    ["이번 생존 기록","今回の記録"],
    ["처치","撃破"],["획득","獲得"],["최고","ベスト"],
    ["기록 더 올리기","記録更新に挑戦"],["바로 재도전","もう一度挑戦"],
    ["코인 상점 · 영구 강화 바로가기","機体を強化する"],
    ["클리어","回クリア"],
    ["이번 기록으로 끝내기","この記録で終了"],
    ["이번 생존 기록","今回の記録"],
    ["LEVEL UP","レベルアップ"],
    ["WEAPON EVOLUTION","武器進化"],
    ["SPREAD","スプレッド"],["RAIL","レール"],["ARC","アーク"],["BEAM","ビーム"],
    ["하나를 고르세요","1つ選択"],
    ["한 번에 3발을 퍼뜨립니다","3方向に射撃"],
    ["강한 단발 화력으로 진화합니다","高威力の単発射撃"],
    ["레일건보다 약 19% 높은 지속 화력","継続火力+約19%"],
    ["최종 진화 · 아크보다 약 18% 높은 보스 화력","最終進化・対ボス火力+約18%"],
    ["한 방 강화","威力UP"],
    ["더 빠르게","射撃間隔↓"],
    ["즉시 회복","即回復"],
    ["연사 증가","連射UP"],
    ["연사 증가 ","連射UP "],
    ["공격 +6","攻撃+6"],
    ["체력 +35","HP+35"],
    ["보스 피해량 정산","ボスダメージ結果"],
    ["생존 기록 정산","サバイバル結果"],
    ["요일 던전 결과","デイリー結果"],
    ["친구에게 도전장 보내기","友達に挑戦状を送る"],
    ["↗ 친구에게 도전장 보내기","↗ 友達に挑戦状"],
    ["최고 티어","最高ランク"],
    ["최고 티어 달성","最高ランク到達"],
    ["최고 랭크 달성","最高ランク到達"],
    ["오늘 미션 완료 ✓","今日のミッション達成 ✓"],
    ["오늘 완료 · 내일 다시 도전","今日の挑戦は完了"],
    ["✓ 오늘 완료 · 내일 다시 도전","✓ 今日の挑戦は完了"],
    ["오늘 클리어 완료 · 내일 새 던전 개방","本日クリア済・明日更新"],
    ["오늘 첫 클리어 1회 · 내일 새 던전 개방","初回クリアで報酬・毎日更新"],
    ["▶ 보스 던전 시작","▶ ボスバトル開始"],
    ["▶ 무제한 도전 시작","▶ エンドレス開始"],
    ["▶ 요일 던전 시작","▶ デイリー開始"],
    ["⚡ 강화 출격 · 60초 전투","⚡ 強化出撃・60秒チャレンジ"],
    ["60초 생존 · 30초 보스전","60秒生存・30秒ボス戦"],
    ["90초 화력전 · 탄막 회피 · 누적 피해량 보상","90秒火力戦・弾幕回避・ダメージ報酬"],
    ["시간 무제한 · 20초부터 생존 코인 보상","無制限・20秒から生存コイン獲得"],
    ["오늘의 던전","本日のチャレンジ"],
    ["광고 혜택","広告報酬"],
    ["기체 선택","機体を選ぶ"],
    ["코인 충전 · 강화","強化"],
    ["코인 강화","コイン強化"],
    ["기록 · 시즌","記録・シーズン"],
    ["전투 지원","バトル支援"],
    ["내 기체 강화소","機体強化"],
    ["코인 상점","コインストア"],
    ["영구 강화","永続強化"],
    ["엔드게임 강화","エンドゲーム強化"],
    ["코인으로 계속 강해집니다","コインで機体を強化"],
    ["코인으로 공격·체력을 강화하세요. 유료 보급은 결제 및 영수증 검증 연결 후 개방합니다.","コインで攻撃力・HPを強化できます。"],
    ["내 티어 ·","現在のランク ·"],
    ["전체 티어표 보기 ▼","ランク一覧を見る ▼"],
    ["전체 티어표 닫기 ▲","ランク一覧を閉じる ▲"],
    ["티어 누적 혜택","ランクボーナス"],
    ["누적 업적","累計実績"],
    ["월간 시즌","シーズン"],
    ["오늘의 던전","本日のチャレンジ"],
    ["첫 판을 완료하면 기록이 저장됩니다.","1回プレイすると記録が保存されます。"],
    ["이 기기의 개인 기록 · 전체 사용자 순위 아님","この端末の記録・全体ランキングではありません"],
    ["🏆 내 최고 기록 TOP 5","🏆 自己ベスト TOP 5"],
    ["내 최고 기록 TOP 5","自己ベスト TOP 5"],
    ["↗ 최고기록 공유","↗ 記録をシェア"],
    ["↗ 기록 공유하기","↗ 記録をシェア"],
    ["광고 준비 중 · 초월 강화","広告準備中 · 超越強化"],
    ["이번 판 1회 · 공격 +8 + 체력 +20","1プレイ1回・攻撃+8／HP+20"],
    ["무료 · 광고 해금 · 프리미엄","無料・広告解放・プレミアム"],
    ["장착","装備する"],
    ["공격형","攻撃型"],["방어형","防御型"],
    ["3회 클리어","3回クリア"],["10회 클리어","10回クリア"],
    ["광고 보상 준비 완료 · 검증 후 적용됩니다.","広告報酬は利用できません"],
    ["광고 재고 확인 중 · 버튼은 준비되면 활성화됩니다.","広告報酬は利用できません"],
    ["↗ 토스 정식판에서 새로 도전","↗ Toss版で再挑戦"]
  ]);
  const rules = [
    [/LEVEL UP/g,"レベルアップ"],
    [/이번 판\s*(\d+)킬\s*·\s*내 기록을 넘을 수 있을까\?/g,"今回$1キル・この記録を超えられる？"],
    [/오늘 미션까지\s*(\d+)킬/g,"今日のミッションまであと$1キル"],
    [/다음 랭크까지\s*(\d+)킬/g,"次のランクまであと$1キル"],
    [/시즌\s*(\d+)P/g,"シーズン$1P"],
    [/오늘 미션 완료/g,"今日のミッション達成"],
    [/랭크/g,"ランク"],
    [/미션/g,"ミッション"],
    [/시즌/g,"シーズン"],
    [/킬/g,"キル"],
    [/내 보스 최고 피해:/g,"ボス最高ダメージ:"],
    [/내 무제한 최고 기록:/g,"エンドレス最高記録:"],
    [/오늘의 던전:/g,"本日のチャレンジ:"],
    [/일반 전투/g,"60秒サバイバル"],
    [/전투기 스킨/g,"機体スキン"],
    [/광고\s*(\d+\s*\/\s*\d+)회\s*·\s*준비 중/g,"広告は利用できません"],
    [/준비 중/g,"利用できません"],
    [/([+＋]?[\d,.]+)\s*공격/g,(_m,amount)=>"攻撃"+(amount.startsWith("+")?amount:"+"+amount)],
    [/([+＋]?[\d,.]+)\s*체력/g,(_m,amount)=>"HP"+(amount.startsWith("+")?amount:"+"+amount)],
    [/전투 시작/g,"チャレンジ開始"],
    [/보스 연속전/g,"ボス連戦"],
    [/보스 등장/g,"ボス登場"],
    [/첫 보상/g,"初回報酬"],
    [/누적/g,"累計"],
    [/교환/g,"交換"],
    [/강화/g,"強化"],
    [/([0-9]+)회 클리어/g,"$1回クリア"],
    [/회 클리어/g,"回クリア"],
    [/다음 ([A-Z]+)까지/g,"次の$1まで"],
    [/다음 ([A-Z]+)까지 ([0-9]+)回クリア/g,"次の$1まであと$2回クリア"],
    [/([0-9]+) 클리어/g,"$1回クリア"],
    [/([0-9]+)회/g,"$1回"],
    [/([0-9]+)번/g,"$1回"],
    [/광고/g,"広告"],
    [/피해/g,"ダメージ"],
    [/보상/g,"報酬"],
    [/공격/g,"攻撃"],
    [/전투/g,"バトル"],
    [/시작/g,"開始"],
    [/오늘/g,"今日"],
    [/다음/g,"次の"],
    [/부터/g,"から"],
    [/초마다/g,"秒ごと"],
    [/까지/g,"まで"],
    [/개방/g,"解放"],
    [/기록/g,"記録"],
    [/코인/g,"コイン"],
    [/(\d+)클리어/g,"$1回クリア"],
    [/(\d+)회 클리어/g,"$1回クリア"],
    [/오늘의 던전:\s*/g,"本日のチャレンジ: "],
    [/내 보스 최고 피해:\s*/g,"ボス最高ダメージ: "],
    [/내 무제한 최고 기록:\s*/g,"エンドレス最高記録: "],
    [/오늘 미션까지\s*(\d+)킬/g,"今日のミッションまであと$1キル"],
    [/이번 판\s*(\d+)킬\s*·\s*내 기록을 넘을 수 있을까\?/g,"今回$1キル・この記録を超えられる？"],
    [/다음 랭크까지\s*(\d+)킬/g,"次のランクまであと$1キル"],
    [/다음\s+([A-Z]+)\s+(\d+)회/g,"次の$1まであと$2回"],
    [/시즌\s*(\d+)P/g,"シーズン$1P"],
    [/(\d+)킬/g,"$1キル"],
    [/(\d+)코인/g,"$1コイン"],
    [/(\d+)초/g,"$1秒"],
    [/([+＋]?[\d,.]+)\s*공격/g,"攻撃+$1"],
    [/([+＋]?[\d,.]+)\s*체력/g,"HP+$1"],
    [/공격력/g,"攻撃力"],
    [/체력/g,"HP"],
    [/연사 속도/g,"連射速度"],
    [/획득 코인/g,"獲得コイン"],
    [/누적 피해/g,"累計ダメージ"],
    [/다음 무기 진화\s*·\s*Lv\./g,"次の武器進化 · Lv."],
    [/보스 출현\s*·\s*(\d+)秒/g,"ボス登場 · $1秒"],
    [/코인으로 계속 강해집니다/g,"コインで機体を強化"],
    [/^공격\s+Lv\./g,"攻撃 Lv."],
    [/^체력\s+Lv\./g,"HP Lv."],
    [/^영구 강화$/g,"永続強化"],
    [/^내 티어\s*·/g,"現在のランク ·"],
    [/^오늘의 던전/g,"本日のチャレンジ"],
    [/·\s*(\d+)위/g," · $1位"],
    [/(\d+)위/g,"$1位"]
  ];
  const zones = ".shell.lobbyMode,.overlay.upgrade,.overlay.result,.overlay.revive,.hud,.hint";
  let pending = false;
  const targetedObservers = new Map();

  function translateText(text) {
    let result = text, trimmed = text.trim();
    const exact = words.get(trimmed);
    if (exact !== undefined) return text.replace(trimmed, exact);
    if (!/[가-힣]/.test(trimmed)) return text;
    for (const [pattern,replacement] of rules) result=result.replace(pattern,replacement);
    return result;
  }
  function localizeTree(el) {
    if(el.matches(".shell.lobbyMode")){
      // Do not advertise an unusable ONEplay-only payment catalogue to Japanese
      // free-browser players; their real in-game coin upgrades remain available.
      for(const block of el.querySelectorAll(".oneplayIapCatalog,.rewardDock,.lobbyPanelIntro.premiumStatus")){
        if(block.matches(".lobbyPanelIntro.premiumStatus"))continue;
        block.style.setProperty("display","none","important");
        block.setAttribute("aria-hidden","true");
      }
      for(const tab of el.querySelectorAll(".lobbyTabs button:first-child")){
        tab.style.setProperty("display","none","important");
        tab.setAttribute("aria-hidden","true");
        tab.tabIndex=-1;
      }
    }
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n=walker.nextNode())) {
      const src=n.nodeValue||"";
      const dst=translateText(src);
      if (src!==dst) n.nodeValue=dst;
    }
    if(el.matches(".overlay.upgrade")){
      // This hosted demo has no supported rewarded-ad provider.
      for(const b of el.querySelectorAll("button.transcendPick")){
        b.hidden=true;
        b.style.display="none";
        b.setAttribute("aria-hidden","true");
      }
      for(const b of el.querySelectorAll(".statPicks button,.weaponPick")){
        if(!b.disabled && !b.hasAttribute("data-s60-jp-key")){
          b.setAttribute("data-s60-jp-key","1");
        }
      }
    }
    // Rewarded ads are unavailable on the free hosted version.
    for(const b of el.querySelectorAll(".overlay.result button.rewardBtn[disabled],.overlay.revive button.reviveBtn[disabled],button.lobbyQuickReward[disabled]")){
      b.style.display="none";b.setAttribute("aria-hidden","true");
    }
  }
  function attachObservers(elements) {
    for (const el of elements) if (!targetedObservers.has(el)) {
      const obs = new MutationObserver(schedule);
      obs.observe(el,{childList:true,subtree:true,characterData:true});
      targetedObservers.set(el,obs);
    }
    for (const [el,obs] of targetedObservers) if (!el.isConnected) {
      obs.disconnect(); targetedObservers.delete(el);
    }
  }
  function render(){
    pending=false;
    const root=document.getElementById("root");
    if (!root) return;
    const elements=Array.from(root.querySelectorAll(zones));
    attachObservers(elements);
    for(const el of elements)localizeTree(el);
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(render);
  }
  function install(){
    const root=document.getElementById("root");
    if(!root){setTimeout(install,25);return;}
    new MutationObserver(schedule).observe(root,{childList:true,subtree:false});
    document.addEventListener("click",e=>{
      if(e.target instanceof Element && e.target.closest(".lobbyTabs,.runModeSelector,.overlay.upgrade,.overlay.result"))schedule();
    },true);
    document.addEventListener("keydown",e=>{
      const overlay=document.querySelector(".overlay.upgrade");
      if(!overlay || e.altKey || e.ctrlKey || e.metaKey)return;
      const choices=Array.from(overlay.querySelectorAll(".weaponPick:not([disabled]),.statPicks button:not([disabled])"));
      if(!choices.length)return;
      const key=e.key;
      if(key==="ArrowDown" || key==="ArrowRight" || key==="ArrowUp" || key==="ArrowLeft"){
        e.preventDefault(); e.stopImmediatePropagation();
        const current=choices.indexOf(document.activeElement);
        const next= key==="ArrowDown"||key==="ArrowRight"?1:-1;
        const idx=(current<0?(next===1?-1:0):current)+next;
        choices[(idx+choices.length)%choices.length].focus();
      } else if(key===" " || key==="Spacebar"){
        if(choices.includes(document.activeElement)){
          e.preventDefault();e.stopImmediatePropagation();
          document.activeElement.click();
        }
      }
    },true);
    schedule();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
