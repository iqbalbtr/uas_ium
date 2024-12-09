import db from "@db/index"
import excel from "@libs/excel"
import { getDateFormat } from "@libs/utils"

export const getShiftExcel = async (start?: Date, end?: Date) => {
    const main = new excel.Workbook("Laporan Penmbelian")

    const shift = await db.query.shift.findMany({
        where: (od, { lte, gte, and }) => and(
            start ? gte(od.start_shift, start) : undefined,
            end ? lte(od.start_shift, end) : undefined
        ),
        orderBy: (sl, { desc }) => desc(sl.start_shift),
        with: {
            holder: {
                columns: {
                    username: true
                }
            },
        }
    })

    main.titleRow({
        position: "C2:M2",
        value: "Laporan Shift",
        center: true
    });
    
    main.headRow({
        position: "A3:A4",
        value: "No",
    });
    
    main.headRow({
        position: "B3:C3",
        value: "Waktu",
        center: true
    });

    main.headRow({
        position: "C4",
        value: "Mulai",
    });
    
    main.headRow({
        position: "C4",
        value: "Akhir",
    });
    
    main.headRow({
        position: "D3:E3",
        value: "Retur",
        center: true
    });
    
    main.headRow({
        position: "D4",
        value: "Total Retur Item",
    });
    
    main.headRow({
        position: "E4",
        value: "Total Retur",
    });
    
    main.headRow({
        position: "F3:H3",
        value: "Saldo",
        center: true
    });
    
    main.headRow({
        position: "F4",
        value: "Awal",
    });
    
    main.headRow({
        position: "G4",
        value: "Akhir",
    });
    
    main.headRow({
        position: "H4",
        value: "Selisih",
    });
    
    main.headRow({
        position: "I3:I4",
        value: "Catatan",
    });
    
    main.headRow({
        position: "J3:J4",
        value: "Total Pendapatan",
    });
    
    main.headRow({
        position: "K3:K4",
        value: "Total Transaksi",
    });
    
    main.headRow({
        position: "L3:L4",
        value: "Status Shift",
    });
    
    main.headRow({
        position: "M3:M4",
        value: "Pemegang Saldo",
    });
    
    const payload = shift.map((item, i) => {
        const payloadArray: any[] = [];

        const resultItem = [
            (++i),
            item.start_shift,
            item.end_shift,
            item.retur_item_total,
            item.retur_total,
            item.begining_balance,
            item.ending_balance,
            item.balance_different,
            item.notes,
            item.income_total,
            item.transaction_total,
            item.status_shift,
            item.holder.username,
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