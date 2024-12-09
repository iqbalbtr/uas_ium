import { getApotek } from "@/actions/apotek";
import { getTransactionByCode } from "@/actions/transaction";
import Invoice from "@components/pdf/Invoice";
import { printPdf } from "@components/pdf/util";
import { Apotek } from "@models/apotek";

export const getInvoicePdf = async(code: string) => {
      const toko = await getApotek();
      const trans = await getTransactionByCode(code);
      if (trans && toko) {
        await printPdf(await Invoice({ transaksi: trans as any, toko: toko as Apotek }), "Invoice")
      }
}