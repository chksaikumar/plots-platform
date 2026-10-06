// INR formatting helpers: lakh and crore for Indian real estate.

export function formatINR(amount) {
  if (amount == null || isNaN(amount)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Short form: 2400000 -> "₹24 L", 8400000 -> "₹84 L", 15000000 -> "₹1.5 Cr"
export function formatINRShort(amount) {
  if (amount == null || isNaN(amount)) return "-";
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/0$/, "")} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(2).replace(/0$/, "")} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `₹${amount}`;
}

export function formatPerSqYd(amount) {
  if (amount == null || isNaN(amount)) return "-";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}/sq.yd.`;
}

export function statusLabel(status) {
  if (status === "available") return "Available";
  if (status === "few-left") return "Few left";
  if (status === "sold-out") return "Sold out";
  return status;
}
