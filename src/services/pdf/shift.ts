import { getApotek } from "@/actions/apotek";
import { getShiftById } from "@/actions/shift";
import Shift from "@components/pdf/Shift";
import { printPdf } from "@components/pdf/util";
import { Apotek } from "@models/apotek";

export async function getShiftPdf(id: number) {
    const toko = await getApotek();
    const shift = await getShiftById(id);
    if (shift && toko) {
        await printPdf(Shift({ shift: shift as any, apotek: toko as Apotek }), "Shift")
    }
}