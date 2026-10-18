// 주문마진 P0: 플랫폼·화면에 의존하지 않는 순수 계산 모듈
export const FIELD_LABELS = Object.freeze({
  yield: '한 배치 생산량', batchCost: '한 배치 재료비', quantity: '주문 수량',
  unitPrice: '개당 판매가', packaging: '개당 포장비', extra: '주문별 기타 비용',
  discount: '전체 할인', feePercent: '수수료율', feeFixed: '정액 수수료',
  laborHours: '본인 총 작업시간', hourlyRate: '본인 시간당 평가액'
});
const REQUIRED = ['yield', 'quantity', 'unitPrice'];
const INTEGER = new Set(['yield','batchCost','quantity','unitPrice','packaging','extra','discount','feeFixed','hourlyRate']);
const MAX = 1_000_000_000_000;

export function validate(raw) {
  const values = {};
  const errors = {};
  const missing = [];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    const original = raw?.[key];
    const s = String(original ?? '').trim().replaceAll(',', '');
    if (s === '') {
      if (REQUIRED.includes(key)) errors[key] = label + '을(를) 입력하세요.';
      else missing.push(key);
      values[key] = null;
      continue;
    }
    // 숫자 이외 기호, 지수 표기, Infinity/NaN을 차단합니다.
    if (!/^\d+(?:\.\d+)?$/.test(s)) {
      errors[key] = label + ': 0 이상의 숫자만 입력할 수 있습니다.';
      continue;
    }
    const num = Number(s);
    if (!Number.isFinite(num) || num > MAX || (INTEGER.has(key) && !Number.isSafeInteger(num))) {
      errors[key] = label + ': 너무 큰 수 또는 원 단위 이하 금액은 입력할 수 없습니다.';
      continue;
    }
    if (INTEGER.has(key) && !Number.isInteger(num)) {
      errors[key] = label + ': 원 단위 정수로 입력하세요.';
      continue;
    }
    if ((key === 'yield' || key === 'quantity') && num < 1) {
      errors[key] = label + ': 1 이상이어야 합니다.';
      continue;
    }
    if (key === 'feePercent' && num >= 100) {
      errors[key] = '수수료율은 100% 미만이어야 합니다.';
      continue;
    }
    values[key] = num;
  }
  if (values.quantity != null && values.unitPrice != null && values.discount != null &&
      values.discount > values.quantity * values.unitPrice) {
    errors.discount = '할인액은 할인 전 주문금액을 넘을 수 없습니다.';
  }
  if (values.yield != null && values.quantity != null &&
      Math.ceil(values.quantity / values.yield) * values.yield > Number.MAX_SAFE_INTEGER) {
    errors.quantity = '생산량이 안전한 계산 범위를 초과했습니다.';
  }
  return {values, errors, missing, valid: Object.keys(errors).length === 0};
}
export function calculate(raw) {
  const parsed = validate(raw);
  if (!parsed.valid) return {...parsed, result: null};
  const v = parsed.values;
  const zero = key => v[key] ?? 0;
  const batches = Math.ceil(v.quantity / v.yield);
  const production = batches * v.yield;
  const leftover = production - v.quantity;
  const materials = batches * zero('batchCost');
  const packing = v.quantity * zero('packaging');
  const gross = v.quantity * v.unitPrice;
  const revenue = gross - zero('discount');
  const fee = Math.round(revenue * zero('feePercent') / 100) + zero('feeFixed');
  const cashRemainder = revenue - materials - packing - zero('extra') - fee;
  const labor = Math.round(zero('laborHours') * zero('hourlyRate'));
  const afterLabor = cashRemainder - labor;
  const rate = zero('feePercent') / 100;
  const minimumPriceRaw = ((materials + packing + zero('extra') + zero('feeFixed') + labor) / (1 - rate) + zero('discount')) / v.quantity;
  const numbers = [production, leftover, materials, packing, gross, revenue, fee, cashRemainder, labor, afterLabor, minimumPriceRaw];
  if (numbers.some(n => !Number.isFinite(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER)) {
    return {...parsed, valid: false, errors:{general:'입력 금액이 안전한 계산 범위를 초과했습니다.'}, result:null};
  }
  // 수수료 반올림을 반영한 진짜 '최소 정수 판매가'. 연속 수수료 공식만 올림하면
  // 실제로 손익 0원인 가격을 1원 이상 높게 표시할 수 있습니다.
  const costToCover = materials + packing + zero('extra') + zero('feeFixed') + labor;
  const netAtPrice = (unitPrice) => {
    const sales = v.quantity * unitPrice - zero('discount');
    if (!Number.isSafeInteger(sales) || sales < 0) return -Infinity;
    return sales - Math.round(sales * zero('feePercent') / 100) - costToCover;
  };
  let low = Math.max(0, Math.ceil(zero('discount') / v.quantity));
  let high = Math.max(low, Math.ceil(minimumPriceRaw));
  if (!Number.isSafeInteger(v.quantity * high) || netAtPrice(high) < 0) {
    return {...parsed, valid: false, errors:{general:'손익분기 가격이 안전한 계산 범위를 초과했습니다.'}, result:null};
  }
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (netAtPrice(mid) >= 0) high = mid;
    else low = mid + 1;
  }
  const minimumPriceWon = low;
  const minimumPrice100 = Math.ceil(low / 100) * 100;
  return {
    ...parsed,
    result: {
      batches, production, leftover, materials, packing, gross, discount:zero('discount'), revenue,
      extra:zero('extra'), fee, feePercent:zero('feePercent'), feeFixed:zero('feeFixed'),
      cashRemainder, labor, afterLabor,
      minimumPriceWon, minimumPrice100,
      incomplete: parsed.missing.length > 0,
      laborTimeNeedsReview:true
    }
  };
}
export const EXAMPLE = Object.freeze({
  yield:12, batchCost:12000, quantity:48, unitPrice:3500,
  packaging:300, extra:8000, discount:0, feePercent:3,
  feeFixed:0, laborHours:3, hourlyRate:15000
});
