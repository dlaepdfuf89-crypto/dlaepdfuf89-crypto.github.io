/* Survive 60 / game-ac.com Japanese hosted-browser enhancement.
 * Applies to explicit ?embed=gameac URLs even when opened directly,
 * or to game-ac.com framed visits. Native Toss/ONEplay bundles unchanged.
 */
(() => {
  const qs = new URLSearchParams(location.search);
  const locale = (qs.get("lang") || navigator.language || "ko").toLowerCase();
  let refHost = "";
  try { refHost = new URL(document.referrer).hostname.toLowerCase(); } catch {}
  const portal = qs.get("embed") === "gameac" || refHost === "game-ac.com" || refHost.endsWith(".game-ac.com");
  if (!portal || !/^ja(?:-|$)/.test(locale)) return;

  document.documentElement.classList.add("s60-gameac-polished");
  document.documentElement.lang="ja";
  document.title="Survive 60 | 60秒サバイバル・シューティング";
  const pageDescription=document.querySelector('meta[name="description"]');
  if(pageDescription)pageDescription.content="無料の60秒サバイバルシューティング。敵の弾幕を回避し、武器を進化させてボスに挑戦しよう。";
  // The free international build has no payable ONEplay store or rewarded ads.
  const css=document.createElement("style");
  css.textContent=`
    html.s60-gameac-polished .oneplayIapCatalog,
    html.s60-gameac-polished .overlay.upgrade .transcendPick,
    html.s60-gameac-polished .overlay.result .rewardBtn,
    html.s60-gameac-polished .overlay.revive .reviveBtn,
    html.s60-gameac-polished .lobbyQuickReward { display:none!important; }
    html.s60-gameac-polished .s60JPMonetizationStatus{margin:9px 0 10px;padding:10px 11px;border:1px solid #48799a;border-radius:11px;background:#102941;color:#dceeff;font-size:11px;line-height:1.55;text-align:left;}
    html.s60-gameac-polished .s60JPMonetizationStatus strong{display:block;color:#ffd58b;font-size:12px;margin-bottom:3px;}
    html.s60-gameac-polished .s60JPShopLink{display:flex;align-items:center;justify-content:center;min-height:44px;border:1px solid #50aad8;border-radius:10px;background:#1c5178;color:#fff;text-decoration:none;font-size:12px;font-weight:800;margin-top:9px;}
    html.s60-gameac-polished .skinCard[data-s60-ad-unavailable="true"]{opacity:.7;cursor:not-allowed;}
    /* Japanese labels are longer; preserve readable card headings and two-column buttons in 350px iframe. */
    /* Fix full leaderboard clipping: source layout collapsed this whole section
       to ~32px while its own content needed >400px (observed on 350px portal). */
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeague{
      box-sizing:border-box;
      display:grid!important;
      grid-auto-rows:max-content;
      height:auto!important;
      min-height:max-content!important;
      max-height:none!important;
      flex:0 0 auto!important;
      overflow:visible!important;
      align-self:stretch;
      padding:12px!important;
      margin:8px 0!important;
    }
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueHeader{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) auto;
      gap:8px;
      align-items:start;
      min-width:0;
    }
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueHeader>div{min-width:0;}
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueHeader strong{
      font-size:14px!important;
      line-height:1.5!important;
      word-break:keep-all;
      overflow-wrap:anywhere;
      white-space:normal;
    }
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueHeader small{
      font-size:10px!important;
      line-height:1.45!important;
      white-space:normal;
      overflow-wrap:anywhere;
    }
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueHeader button{
      box-sizing:border-box;
      min-width:62px;
      max-width:80px;
      white-space:normal;
      padding:7px!important;
      font-size:11px!important;
    }
    html.s60-gameac-polished .lobbyMode .intro .oneplayLeagueListTitle{flex-wrap:wrap;gap:4px;}
    html.s60-gameac-polished .dailyHub,
    html.s60-gameac-polished .weeklyHub{min-width:0;max-width:100%;overflow-wrap:break-word;}
    html.s60-gameac-polished .dailyHubHead,
    html.s60-gameac-polished .weeklyHub header{display:grid!important;grid-template-columns:minmax(0,1fr);gap:3px;min-width:0;justify-content:stretch;text-align:left;}
    html.s60-gameac-polished .dailyHubHead strong,
    html.s60-gameac-polished .weeklyHub header strong{font-size:14px!important;line-height:1.45;word-break:keep-all;overflow-wrap:anywhere;}
    html.s60-gameac-polished .dailyHubHead small,
    html.s60-gameac-polished .weeklyHub header small{font-size:10px!important;line-height:1.5;white-space:normal;word-break:normal;}
    html.s60-gameac-polished .dailyAttend,
    html.s60-gameac-polished .dailyMission,
    html.s60-gameac-polished .weeklyMission{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(104px,43%);gap:8px;align-items:center;min-width:0;}
    html.s60-gameac-polished .dailyAttend>span,
    html.s60-gameac-polished .dailyMission>div,
    html.s60-gameac-polished .weeklyMission>span{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:normal;}
    html.s60-gameac-polished .dailyMission b,
    html.s60-gameac-polished .weeklyMission b{font-size:11px!important;line-height:1.45;}
    html.s60-gameac-polished .dailyAttend button,
    html.s60-gameac-polished .dailyMission button,
    html.s60-gameac-polished .weeklyMission button{box-sizing:border-box;width:100%;min-width:0;max-width:100%;padding:7px 5px;font-size:11px!important;white-space:normal;overflow-wrap:anywhere;word-break:normal;line-height:1.35;text-align:center;}
    html.s60-gameac-polished .top>div:first-child{min-width:0;flex:1;}
    html.s60-gameac-polished .top>div:first-child>span{max-width:100%;white-space:normal;overflow-wrap:anywhere;font-size:10px;}
    html.s60-gameac-polished .overlay.revive p{max-width:100%;white-space:normal;overflow-wrap:anywhere;}
    html.s60-gameac-polished .overlay.upgrade button:focus-visible {
      outline:3px solid #a1f5ff!important;outline-offset:3px;
      box-shadow:0 0 0 6px rgba(22,174,250,.28)!important;
    }
  `;
  document.head.appendChild(css);
  const words = new Map([
    ["▶ 60초 전투 시작","▶ 60秒チャレンジ開始"],
    ["짧게 한 판, 기록은 계속","短い一戦、記録は続く"],
    ["남은 시간","残り時間"],["생존 시간","生存時間"],["레벨","レベル"],
    ["보스 던전","ボスバトル"],["친구에게 60초 기록 대결 초대하기","友達を60秒記録バトルに招待"],
    ["균형형","バランス型"],["장착 중","装備中"],["시청","視聴"],
    ["일","日"],["연속","連続"],["최고","ベスト"],["완료","達成"],
    ["로 즉시 복귀합니다.","で復活します。"],["로 즉시 부활합니다.","で復活します。"],
    ["드래그 이동 · 자동 공격 · 60초 생존","ドラッグで移動 · 自動射撃 · 60秒生存"],
    ["🔥 연속","🔥 連続"],["🏆 최고","🏆 ベスト"],["🎯 오늘","🎯 今日"],
    ["아직 끝내기엔 아깝습니다","まだ諦めないで！"],
    ["한 번 더?","もう一度？"],
    ["체력 60%로 즉시 복귀합니다.","HP60%で復活します。"],
    ["HP 60%로 즉시 부활합니다.","HP60%で復活します。"],
    ["이번 기록으로 끝내기","この記録で終了"],
    ["다음 무기 진화 · Lv.","次の武器進化 · Lv."],
    ["연사 증가","連射速度UP"],["즉시 회복","すぐに回復"],
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
    ["무료 · 광고 해금 · 프리미엄","無料・実績達成・コイン交換"],
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
  // Full Japanese copy for previously overlooked rankings, daily, weekly and monthly panels.
  // Whole-sentence rules precede short generic substitutions to preserve natural Japanese.
  const panelPhrases = [
    [/짧게\s*한\s*판\s*,\s*기록은\s*계속/g,"短い一戦、記録は続く"],
    [/^로\s*즉시\s*(?:복귀|부활)합니다\.?/g,"で復活します。"],
    [/친구에게\s*60(?:초|秒)\s*(?:기록|記録)\s*대결\s*초대하기/g,"友達を60秒記録バトルに招待"],
    [/広告\s*(\d+\s*\/\s*\d+)回\s*·\s*시청/g,"広告 $1回 · 準備中"],
    [/광고\s*(\d+\s*\/\s*\d+)회\s*·\s*시청/g,"広告 $1回 · 準備中"],
    [/(\d+)일\b/g,"$1日"],
    [/드래그\s*이동\s*·\s*자동\s*공격\s*·\s*60(?:초|秒)\s*생존/g,"ドラッグで移動 · 自動射撃 · 60秒生存"],
    [/(?:체력|HP)\s*60%로\s*즉시\s*(?:복귀|부활)합니다\.?/g,"HP60%で復活します。"],
    [/다음\s*무기\s*진화\s*[·-]\s*Lv\./g,"次の武器進化 · Lv."],
    [/광고 보고 다음 판 공격 \+40%/g,"広告視聴で次のプレイ攻撃力+40%"],
    [/광고 보고 다음 판 받는 피해 -50%/g,"広告視聴で次のプレイ被ダメージ-50%"],
    [/광고 상자 \+(\d+) 코인/g,"広告宝箱 +$1コイン"],
    [/60(?:초|秒)\s*만 버텨봐/g,"SURVIVE 60"],
    [/60(?:초|秒)\s*생존 작전/g,"60秒サバイバル作戦"],
    [/전체 이용자 랭킹/g,"全プレイヤーランキング"],
    [/60(?:초|秒)\s*생존 모드\s*·\s*처치 수 기준/g,"60秒サバイバル・撃破数順"],
    [/닉네임을 설정해 주세요/g,"ニックネームを設定してください"],
    [/아직 등록된 (?:기록|記録)이 없습니다\.\s*실제 생존전을 완료해 첫 번째 순위에 도전하세요\./g,"まだ記録がありません。サバイバルをクリアしてランキング1位を目指そう。"],
    [/ONEplay 익명 게임 세션 기준\s*·\s*닉네임은 직접 설정\s*·\s*(?:기록|記録)은 (?:전투|バトル) 종료 후 서버에 등록됩니다\.\s*기기 변경 시 기존 세션의 내 순위가 자동 연결되지는 않습니다\./g,"ONEplay匿名プレイセッション単位。ニックネームは手動設定。記録はバトル終了後に登録されます。別の端末へのランキング引継ぎはできません。"],
    [/기본 (?:보상|報酬)은 (?:광고|広告) 없이 지급\s*·\s*추가 (?:광고|広告) (?:보상|報酬)은 실제 (?:광고|広告) 인증 후 제공/g,"基本報酬に広告視聴は不要です。このブラウザ版では追加の広告報酬は利用できません。"],
    [/추가 (?:광고|広告) (?:보상|報酬)은 플랫폼 검증 후 지원합니다\./g,"このブラウザ版では追加の広告報酬を利用できません。"],
    [/(?:광고|広告)·결제와 무관한 무료 게임 내 (?:보상|報酬)\s*·\s*이 기기에만 저장/g,"広告・決済不要の無料ゲーム内報酬。データはこの端末に保存されます。"],
    [/월요일 초기화\s*·\s*주간 (?:보상|報酬)/g,"毎週月曜更新・ウィークリー報酬"],
    [/매월 1일 초기화/g,"毎月1日に更新"],
    [/보스 HP -31% 증가/g,"ボスHP補正 -31%"],
    [/보스 HP -31%/g,"ボスHP補正 -31%"],
    [/출석\s*·\s*일일 임무/g,"ログイン報酬・デイリーミッション"],
    [/매일 도전해서 성장 자금 (?:획득|獲得)/g,"毎日プレイして強化用コインを獲得"],
    [/(?:오늘|今日) 출석 (?:보상|報酬)/g,"本日のログインボーナス"],
    [/주간 도전/g,"ウィークリーチャレンジ"],
    [/일요일\s*·\s*주간 결산전/g,"日曜日・ウィークリー決戦"],
    [/(?:오늘|今日)의 작전 선택/g,"本日の作戦"],
    [/월간 도전/g,"マンスリーチャレンジ"],
    [/서버에 등록됩니다/g,"サーバーに登録されます"],
    [/기기 변경 시 기존 세션의 내 순위가 자동 연결되지는 않습니다/g,"別の端末では以前のランキング記録を引き継げません"],
    [/아직 등록된 (?:기록|記録)이 없습니다/g,"まだ登録された記録がありません"],
    [/실제 생존전을 완료해 첫 번째 순위에 도전하세요/g,"サバイバルをクリアしてランキング1位を目指そう"],
    [/(?:랭킹|ランキング) 불러오는 중/g,"ランキングを読み込み中"],
    [/첫 (?:기록|記録) 대기/g,"最初の記録を待っています"],
    [/전체 TOP 30/g,"ランキング TOP 30"],
    [/전체 등록 이용자/g,"参加プレイヤー数"],
    [/(?:기록|記録) 등록 이용자/g,"登録プレイヤー数"],
    [/(?:오늘|今日) 미션/g,"本日のミッション"]
  ];
  const panelWords = new Map([
    ["60초만 버텨봐","SURVIVE 60"],["60초 생존 작전","60秒サバイバル作戦"],
    ["탄막을 뚫고 살아남으세요","弾幕をかわして生き残れ！"],["무제한 도전","エンドレス"],
    ["요일 던전","デイリーチャレンジ"],["기본 모드 클리어로 티어 승급","クリアしてランクアップ"],
    ["전체 이용자 랭킹","全プレイヤーランキング"],
    ["공식 전체 랭킹은 토스 출시 후 이용 가능합니다 · 현재 내 기록만 표시","公式ランキングはToss版で利用できます。ここでは端末内の自己記録のみ表示します。"],
    ["새로고침","更新"],["내 순위","自分の順位"],["첫 기록 대기","初回記録待ち"],
    ["내 닉네임","自分のニックネーム"],["닉네임","ニックネーム"],["저장","保存"],
    ["전체 TOP 30","ランキング TOP 30"],["명","人"],["출석 · 일일 임무","ログイン報酬・デイリーミッション"],
    ["매일 도전해서 성장 자금 획득","毎日プレイして強化用コインを獲得"],
    ["오늘 출석 보상","本日のログインボーナス"],["받기","受け取る"],
    ["진행 중","進行中"],["적 30기 격추","敵機を30機撃破"],["적 120기 격추","敵機を120機撃破"],
    ["60초 생존 1회","60秒生存を1回達成"],["60초 생존 3회","60秒生存を3回達成"],
    ["주간 도전","ウィークリーチャレンジ"],["일요일 · 주간 결산전","日曜日・ウィークリー決戦"],
    ["오늘의 작전 선택","本日の作戦を選ぶ"],
    ["월간 도전","マンスリーチャレンジ"],["주간 300킬","週間300キル"],
    ["주간 900킬","週間900キル"],["주간 5회 생존","週間5回生存"],
    ["주간 15회 생존","週間15回生存"],["월간 600킬 달성","月間600キル達成"],
    ["월간 2,000킬 달성","月間2,000キル達成"],
    ["월간 12회 생존","月間12回生存"],["월간 40회 생존","月間40回生存"]
  ]);
  const panelFragments = [
    [/생존전/g,"サバイバル"],[/생존/g,"生存"],[/이용자/g,"プレイヤー"],
    [/닉네임/g,"ニックネーム"],[/등록된/g,"登録された"],[/등록/g,"登録"],
    [/랭킹/g,"ランキング"],[/순위/g,"順位"],[/새로고침/g,"更新"],
    [/설정해 주세요/g,"設定してください"],[/설정/g,"設定"],[/저장/g,"保存"],
    [/첫 번째/g,"1位"],[/번째/g,"位"],[/첫/g,"初回"],
    [/아직/g,"まだ"],[/없습니다/g,"ありません"],[/완료해/g,"完了して"],
    [/도전하세요/g,"挑戦してください"],[/대기/g,"待機中"],[/불러오는 중/g,"読み込み中"],
    [/전체/g,"全体"],[/내 /g,"自分の"],[/익명/g,"匿名"],[/게임 세션/g,"ゲームセッション"],
    [/기준/g,"基準"],[/직접/g,"手動"],[/기기/g,"端末"],[/변경 시/g,"変更時"],
    [/기존/g,"以前の"],[/자동/g,"自動"],[/연결되지는 않습니다/g,"引き継がれません"],
    [/끝나면/g,"終了後"],[/종료 후/g,"終了後"],[/서버에/g,"サーバーに"],
    [/출석/g,"ログイン"],[/일일/g,"デイリー"],[/임무/g,"ミッション"],
    [/매일/g,"毎日"],[/도전해서/g,"挑戦して"],[/성장 자금/g,"強化用コイン"],
    [/받기/g,"受け取る"],[/적\s*(\d+)\s*기\s*격추/g,"敵機$1機撃破"],
    [/적/g,"敵機"],[/격추/g,"撃破"],[/진행 중/g,"進行中"],
    [/주간/g,"週間"],[/월간/g,"月間"],[/도전/g,"チャレンジ"],
    [/월요일/g,"月曜日"],[/일요일/g,"日曜日"],[/초기화/g,"更新"],
    [/결산전/g,"決戦"],[/추가/g,"追加"],[/검증/g,"確認"],[/보고/g,"視聴で"],[/판/g,"プレイ"],[/받는/g,"受ける"],[/상자/g,"宝箱"],
    [/플랫폼/g,"プラットフォーム"],[/지원합니다/g,"対応します"],
    [/달성/g,"達成"],[/매월/g,"毎月"],[/무관한/g,"不要の"],
    [/무료/g,"無料"],[/게임 내/g,"ゲーム内"],[/이 기기에만/g,"この端末だけに"],
    [/보상/g,"報酬"],[/결제/g,"決済"],[/ 없이/g,"なし"],[/지급/g,"支給"],
    [/실제/g,"実際の"],[/인증/g,"認証"],[/후/g,"後"],[/제공/g,"提供"],
    [/완료/g,"完了"],[/처치/g,"撃破"],[/모드/g,"モード"],
    [/보스(?=\s*HP)/g,"ボス"],[/증가/g,"増加"],[/클리어/g,"クリア"],
    [/공격력/g,"攻撃力"],[/력/g,"力"],[/최대/g,"最大"],[/획득/g,"獲得"],
    [/(\d+)\s*명/g,"$1人"],[/명$/g,"人"]
  ];
  // Small persistent headers and footers sit outside .shell.lobbyMode during combat.
  // Include them explicitly so active combat/revive receives the same localization.
  const zones = ".top,.retention,.modeObjectiveBoss,.modeObjectiveDaily,.modeObjectiveEndless,.bossHud,.noticeToast,.shell.lobbyMode,.overlay.upgrade,.overlay.result,.overlay.revive,.hud,.hint";
  let pending = false;
  const targetedObservers = new Map();

  function translateText(text) {
    let result = text, trimmed = text.trim();
    const exact = words.get(trimmed) ?? panelWords.get(trimmed);
    if (exact !== undefined) return text.replace(trimmed, exact);
    if (trimmed === "START") return text.replace(trimmed, "初期");
    if (/^(?:\d+\s*)?CLEAR$/.test(trimmed)) return text.replace(/CLEAR/, "回クリア");
    if (!/[가-힣]/.test(trimmed)) return text;
    for (const [pattern,replacement] of panelPhrases) result=result.replace(pattern,replacement);
    for (const [pattern,replacement] of rules) result=result.replace(pattern,replacement);
    for (const [pattern,replacement] of panelFragments) result=result.replace(pattern,replacement);
    return result;
  }
  function localizeTree(el) {
    if(el.matches(".shell.lobbyMode")){
      // Restore visible ad and shop entry points. The Japanese browser build has
      // no approved rewarded-ad or web-billing provider yet: never simulate a
      // successful ad or take payment from an unsupported SDK.
      const tabs=Array.from(el.querySelectorAll(".lobbyTabs button"));
      const shopTab=tabs[2];
      if(shopTab && shopTab.textContent!=="ショップ・強化")shopTab.textContent="ショップ・強化";
      const adTab=tabs[0];
      if(adTab){
        adTab.style.removeProperty("display");
        adTab.removeAttribute("aria-hidden");
        adTab.tabIndex=0;
      }
      for(const dock of el.querySelectorAll(".rewardDock")){
        dock.style.removeProperty("display");
        dock.removeAttribute("aria-hidden");
        for(const button of dock.querySelectorAll("button")){
          button.disabled=true;
          button.title="日本版ブラウザの報酬広告は配信連携待ちです";
        }
      }
      const activeTab=tabs.findIndex(tab=>tab.getAttribute("aria-pressed")==="true");
      if(activeTab===0){
        const dock=el.querySelector(".rewardDock");
        if(dock && !el.querySelector("#s60JPAdsNotice")){
          const info=document.createElement("aside");
          info.id="s60JPAdsNotice";info.className="s60JPMonetizationStatus";info.setAttribute("role","status");
          info.innerHTML="<strong>広告報酬メニュー</strong>動画広告の配信・報酬付与は現在準備中です。広告事業者との連携が完了するまで視聴できず、コインは付与されません。";
          dock.before(info);
        }
      }
      if(activeTab===2){
        const shop=el.querySelector(".metaShop");
        if(shop && !el.querySelector("#s60JPShopNotice")){
          const info=document.createElement("aside");
          info.id="s60JPShopNotice";info.className="s60JPMonetizationStatus";info.setAttribute("role","status");
          const title=document.createElement("strong");title.textContent="ショップ・プレミアムコイン";
          const desc=document.createElement("span");desc.textContent="下のコイン強化は獲得したゲーム内コインで利用できます。Web版の有料決済は未対応です。";
          const link=document.createElement("a");link.className="s60JPShopLink";link.href="https://onesto.re/oneplay/0001010330";link.target="_blank";link.rel="noopener noreferrer";link.textContent="ONEplay公式版で購入する ↗";
          const note=document.createElement("small");note.textContent="購入は対応端末・地域のONEplayアプリ内でのみ可能です。ここでは決済を行いません。";
          info.append(title,desc,link,note);shop.before(info);
        }
      }
      for(const card of el.querySelectorAll(".skinCard.skin-eclipse,.skinCard.skin-aurora")){
        const owned=/装備|장착/.test(card.textContent||"") && !/広告|광고/.test(card.textContent||"");
        if(!owned){card.disabled=true;card.dataset.s60AdUnavailable="true";card.title="報酬広告の提供待ち";}
        else {card.removeAttribute("data-s60-ad-unavailable");card.disabled=false;}
      }
      // Native ONEplay in-app catalogue cannot process purchases in this free
      // web build. Its unavailable checkout remains hidden while the real coin
      // shop and an optional official ONEplay app route stay visible.
      for(const block of el.querySelectorAll(".oneplayIapCatalog")){
        block.style.setProperty("display","none","important");
        block.setAttribute("aria-hidden","true");
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
    // Upgrade/revive/result overlays are mounted inside .arena, not directly
    // under #root. Observe element additions only, avoiding per-frame text
    // mutation scans in the live battle arena.
    new MutationObserver(changes=>{
      for(const change of changes)for(const node of change.addedNodes){
        if(node.nodeType!==1)continue;
        if(node.classList?.contains("overlay") ||
          ((node.classList?.contains("arena") || node.classList?.contains("shell")) &&
           node.querySelector?.(".overlay.upgrade,.overlay.result,.overlay.revive"))){
          schedule();return;
        }
      }
    }).observe(root,{childList:true,subtree:true});
    document.addEventListener("click",e=>{
      if(e.target instanceof Element && e.target.closest(".lobbyTabs,.runModeSelector,.startBtn,.overlay.upgrade,.overlay.result"))schedule();
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
