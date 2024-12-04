import { pdf } from "@react-pdf/renderer";

export const printPdf = async (data: JSX.Element, label: string) => {
    const blob = await pdf(data).toBlob();
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url);
    if (printWindow) {
        printWindow.onload = () => {
            printWindow.print();
        };
    }
};