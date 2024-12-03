import excel from "exceljs";

type RowType = {
    value: string;
    position: string;
    font?: Partial<excel.Font>;
    center?: boolean;
}

class Excel {
    excel;
    constructor() {
        this.excel = new excel.Workbook()
    }
}

class Workbook extends Excel {

    workbook;
    constructor(work: string) {
        super();
        this.workbook = this.excel.addWorksheet(work);
    }

    titleRow({ value, position, font, center }: RowType) {
        try {
            const title = this.workbook.getCell(position);
            title.value = value;
            title.alignment = {
                horizontal: "center",
                vertical: "middle",
            }
            title
            this.workbook.mergeCells(position);
            title.font = {
                size: 16,
                bold: true,
                ...font
            }
        } catch (error) {
            console.error(error);

        }
    }

    headRow<T>({ value, position, font, center }: RowType) {
        try {
            const row = this.workbook.getCell(position);
            row.value = value;
            row.alignment = center ? {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            } : {};
            this.workbook.mergeCells(position);
            row.font = font!;
        } catch (error) {
            console.error(error);

        }
    }

    dataRow<T>(data: T[]) {
        data.forEach((item: T) => {
            this.workbook.addRow(item)
        })
    }

    async write() {
        return this.excel.xlsx.writeBuffer();
    }
}

export default {
    Excel,
    Workbook
}