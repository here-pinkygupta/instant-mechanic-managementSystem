export function pagination(page=1, limit=20) {
  const safePage=Math.max(1, Math.floor(page)||1);
  const safeLimit=Math.min(100, Math.max(1, Math.floor(limit)||20));
  return { page:safePage, limit:safeLimit, skip:(safePage-1)*safeLimit };
}
export function paginationResult(page:number,limit:number,total:number) {
  return { page, limit, total, totalPages:Math.ceil(total/limit) };
}
