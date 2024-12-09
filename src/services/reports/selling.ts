import db from "@db/index"
import excel from "@libs/excel"
import { getDateFormat } from "@libs/utils"

export const getSellingExcel = async (start?: Date, end?: Date) => {
    const main = new excel.Workbook("Laporan Penjualan")

    const orders = await db.query.transactions.findMany({
        where: (od, { lte, gte, and }) => and(
            start ? gte(od.transaction_date, start) : undefined,
            end ? lte(od.transaction_date, end) : undefined
        ),
        with: {
            user: {
                columns: {
                    username: true
                }
            },
            items: {
                columns: {
                    quantity: true
                }
            }
        },
        orderBy: (sl, { desc }) => desc(sl.transaction_date)
    })

    // Membuat judul
    main.titleRow({
        position: "C1:J1",
        value: "Laporan Penjualan",
        center: true,
    });
    
    // Menambahkan keterangan tanggal
    main.headRow({
        position: "C2:G2",
        value: `Tanggal : ${getDateFormat(start!, "-")} - ${getDateFormat(end!, "-")}`,
    });
    
    // Menambahkan header tabel
    main.headRow({ position: "A3:A4", value: "No", center: true });
    main.headRow({ position: "B3:B4", value: "kode", center: true });
    main.headRow({ position: "C3:C4", value: "tanggal", center: true });
    main.headRow({ position: "D3:D4", value: "pembeli", center: true });
    
    // Header `Pembayaran` dengan sub-header
    main.headRow({ position: "E3:G3", value: "Pembayaran", center: true });
    main.headRow({ position: "E4", value: "tanggal", center: true });
    main.headRow({ position: "F4", value: "metode", center: true });
    main.headRow({ position: "G4", value: "status", center: true });
    
    main.headRow({ position: "H3:H4", value: "Kadaluarsa", center: true });
    main.headRow({ position: "I3:I4", value: "pajak", center: true });
    main.headRow({ position: "J3:J4", value: "Diskon", center: true });
    main.headRow({ position: "K3:K4", value: "total", center: true });
    main.headRow({ position: "L3:L4", value: "total item", center: true });
    main.headRow({ position: "M3:M4", value: "Kasir", center: true });

    const payload = orders.map((item, i) => {
        const payloadArray: any[] = [];

        const resultItem = [
            (++i),
            item.code_transaction,
            item.transaction_date,
            item.buyer,
            item.payment_date,
            item.payment_method,
            item.payment_status,
            item.payment_expired,
            item.tax,
            item.discount,
            item.total,
            item.items.reduce((acc, pv) => acc += pv.quantity, 0),
            item.user?.username,
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