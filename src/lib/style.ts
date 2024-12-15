"use client"
export function getActionClass(type: "update" | "delete" | "create") {
  switch (type) {
    case "create":
      return "bg-green-400/60 text-green-700 border border-green-600";
    case "delete":
      return "bg-red-400/60 text-red-700 border border-red-600";
    case "update":
      return "bg-yellow-400/60 text-yellow-700 border border-yellow-600"
  }
}

export function getStatusClass(type: "pending" | "accepted" | "rejected") {
  switch (type) {
    case "accepted":
      return {
        label: "Diterima",
        class: "p-1 rounded-md bg-green-400/60 text-green-900 border border-green-600"
      }
    case "rejected":
      return {
        label: "DiTolak",
        class: "p-1 rounded-md bg-red-400/60 text-red-900 border border-red-600"
      }
    case "pending":
      return {
        label: "DiTangguhkan",
        class: "p-1 rounded-md bg-yellow-400/60 text-yellow-900 border border-yellow-600"
      }
    default:
      return {
        label: "",
        class: ""
      }
  }
}


export function getPaymentClass(type: "cash" | "installment") {
  switch (type) {
    case "cash":
      return {
        label: "Tunai",
        class: "bg-yellow-400/60 border border-yellow-600 text-yellow-900 p-1 rounded-md "
      }
    case "installment":
      return {
        label: "Jatuh Tempo",
        class: "bg-cyan-400/60 border border-cyan-600 text-cyan-900 p-1 rounded-md "
      }
    default:
      return {
        label: "",
        class: ""
      }
  }
}


export function getStatusTransClass(type: "pending" | "completed" | "cancelled") {
  switch (type) {
    case "completed":
      return {
        label: "Selesai",
        class: "p-1 rounded-md bg-green-400/60 text-green-900 border border-green-600"
      }
    case "cancelled":
      return {
        label: "DiBatalkan",
        class: "p-1 rounded-md bg-red-400/60 text-red-900 border border-red-600"
      }
    case "pending":
      return {
        label: "DiTangguhkan",
        class: "p-1 rounded-md bg-yellow-400/60 text-yellow-900 border border-yellow-600"
      }
  }
}

export function getRequestClass(type: "full" | "not_yet" | "partial") {
  switch (type) {
    case "full":
      return {
        label: "Seluruh",
        class: "bg-green-400/60 border border-green-600 text-green-900 p-1 rounded-md "
      }
    case "not_yet":
      return {
        label: "Belum ada",
        class: "bg-red-400/60 border border-red-600 text-red-900 p-1 rounded-md "
      }
    case "partial":
      return {
        label: "Sebagian",
        class: "bg-yellow-400/60 border border-yellow-600 text-yellow-900 p-1 rounded-md "
      }
    default:
      return {
        label: "",
        class: ""
      }
  }
}