export interface Shift {
    id: number
    start_shift: Date
    end_shift: Date
    begining_balance: number
    retur_item_total: number
    retur_total: number
    notes: string
    ending_balance: number
    balance_different: number
    income_total: number
    transaction_total: number
    status_shift: string
    cashier_balance: number
    balance_holder: number
    holder: Holder,
    receivables_total: number,
    sales_total: number;
}

export interface Holder {
    name: string
    username: string
}
