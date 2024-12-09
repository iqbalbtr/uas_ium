import db from "@db/index"
import excel from "@libs/excel"
import { getDateFormat } from "@libs/utils"

export const getOrderExcel = async(start?: Date, end?: Date) => {
    const main = new excel.Workbook("Laporan Penmbelian")

    const orders = await db.query.orders.findMany({
        where: (od, {lte, gte, and}) => and(
            start ? gte(od.order_date, start) : undefined,
            end ? lte(od.order_date, end) : undefined
        ),
        orderBy: (sl, { desc }) => desc(sl.order_date)
    })

    main.titleRow({
        position: "A1:B2",
        value: "Logo",
        center: true
    })

    main.titleRow({
        position: "C1:J1",
        value: "Laporan Pembelian",
        center: true
    })

    main.headRow({
        position: "C2:F2",
        value: `Tanggal : ${getDateFormat(start!, "-")} - ${getDateFormat(end!, "-")}`
    })

    main.headRow({
        position: "A3:A4",
        value: "No",
        center: true
    })

    main.headRow({
        position: "B3:B4",
        value: "Kode",
        center: true
    })

    main.headRow({
        position: "C3:C4",
        value: `Tanggal`,
        center: true
    })

    main.headRow({
        position: "D3:E3",
        value: "Status",
        center: true
    })

    main.headRow({
        position: "D4",
        value: "Pembayaran",
        center: true
    })

    main.headRow({
        position: "E4",
        value: "Permintaan",
        center: true
    })

    main.headRow({
        position: "F3:F4",
        value: "Supplier",
        center: true
    })

    main.headRow({
        position: "G3:G4",
        value: "Pajak",
        center: true
    })

    main.headRow({
        position: "H3:H4",
        value: "Diskon",
        center: true
    })


    main.headRow({
        position: "I3:I4",
        value: "Total",
        center: true
    })

    main.headRow({
        position: "J3:J4",
        value: "Total item",
        center: true
    })

    main.headRow({
        position: "K3:K4",
        value: "Item sudah diterima",
        center: true
    })

    const payload = orders.map((item, i) => {
        const payloadArray: any[] = [];

        const resultItem = [
            (++i), 
            item.order_code, 
            item.order_date, 
            item.payment_status, 
            item.request_status, 
            item.supplier, 
            item.tax, 
            item.discount, 
            item.total,
            item.total_item,
            item.total_item_received,
        ]

        resultItem.forEach(itemData => {
            payloadArray.push(itemData);
        })
        return payloadArray;
    })

    main.dataRow<any>(payload);

    const buffer = await main.write();

    return buffer
}