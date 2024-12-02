import { getApotek } from "@/actions/apotek";
import { getDateFormat } from "@libs/utils";
import { Transaction } from "@models/transactions";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const Invoice = async ({
    transaksi
}: {
    transaksi: Transaction
}) => {

    const toko = await getApotek();

    function letterFixes(input: string, num: number) {

        if(input.length > num){
            return input.slice(0, num) + ".."
        }

        return input
    }

    return (
        <Document>
            <Page size={{ height: "auto", width: 350 }} style={styles.body}>
                <View>

                    <View>
                        <Text style={styles.title}>
                            {toko?.name}
                        </Text>
                        <Text style={styles.subTitle}>
                            {toko?.alamat}
                        </Text>
                        <Text style={styles.subTitle}>
                            {toko?.email}
                        </Text>
                    </View>

                    <View style={styles.line}>
                    </View>

                    <View style={styles.labelContent}>
                        <Text>
                            Tanggal
                        </Text>
                        <Text>
                            : {getDateFormat(transaksi.transaction_date!)}
                        </Text>
                    </View>
                    <View style={styles.labelContent}>
                        <Text>
                            Tipe
                        </Text>
                        <Text>
                            : 
                        </Text>
                    </View>
                    <View style={styles.labelContent}>
                        <Text>
                            Pelanggan
                        </Text>
                        <Text>
                            : {transaksi.buyer.charAt(0).toUpperCase() + transaksi.buyer.slice(1)}
                        </Text>
                    </View>
                    <View style={styles.labelContent}>
                        <Text>
                            No Transaksi
                        </Text>
                        <Text>
                            : {transaksi.code_transaction}
                        </Text>
                    </View>



                    <View
                        style={{
                            marginTop: 52
                        }}
                    >
                        {
                            transaksi.items?.map((foo, i) => (
                                <View style={styles.barangContent} key={i}>
                                    <Text style={styles.text}>{`${letterFixes(foo.medicine.name, 8)}}`}</Text>
                                    <Text style={styles.text}>x{foo.quantity}</Text>
                                    <Text style={styles.text}>Rp. {foo.medicine.price}</Text>
                                    <Text style={styles.text}>Rp. {foo.sub_total}</Text>
                                </View>
                            ))
                        }

                        <View style={{
                            ...styles.barangContent,
                            borderTop: 1,
                            margin: "2px 0"
                        }}>
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                            <Text
                                style={{
                                    ...styles.text,
                                    marginTop: 5
                                }}
                            >
                                Rp. {transaksi.items?.reduce((sum, pv) => sum += pv.sub_total, 0)}
                            </Text>
                        </View>

                        <View style={styles.barangContent}>
                            <Text></Text>
                            <Text></Text>
                            <Text style={styles.text}>Pajak</Text>
                            <Text style={styles.text}>{transaksi.tax}%</Text>
                        </View>
                        <View style={styles.barangContent}>
                            <Text></Text>
                            <Text></Text>
                            <Text></Text>
                            <Text style={{
                                ...styles.text,
                                borderTop: .5,
                                margin: "1px 0"
                            }}>Rp. {transaksi.total + transaksi.tax!}</Text>
                        </View>

                        <View style={styles.barangContent}>
                            <Text></Text>
                            <Text></Text>
                            <Text style={styles.text}>Potongan Harga</Text>
                            <Text style={styles.text}>Rp. {transaksi.discount}</Text>
                        </View>

                        <View style={{
                            ...styles.barangContent,
                        }}>
                            <Text></Text>
                            <Text></Text>
                            <Text style={{
                                ...styles.text,
                            }}>Total</Text>
                            <Text style={{
                                ...styles.text,
                                borderTop: .5
                            }}>Rp. </Text>
                        </View>

                    </View>


                    <View style={{
                        ...styles.labelContent,
                        marginTop: 52
                    }}>
                        <Text>
                            Metode    :
                        </Text>
                        <Text>
                            {transaksi.payment_method}
                        </Text>
                    </View>
                    <View style={styles.labelContent}>
                        <Text>
                            Deskripsi :
                        </Text>
                        <Text
                            style={{
                                maxWidth: 150
                            }}
                        >
                        
                        </Text>
                    </View>

                    <View style={styles.line}>
                    </View>

                    <View>
                        <Text style={styles.footerText}>
                            TERIMAKASIH TELAH BERBELANJA DI TOKO {toko?.name}
                        </Text>
                    </View>

                </View>
            </Page>
        </Document>
    )
}

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 15,
        paddingBottom: 15,
        height: "auto",
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 22,
        fontWeight: 800,
        textAlign: "center",
        paddingTop: "12px"
    },
    subTitle: {
        fontSize: 11,
        color: "#475569",
        fontWeight: 800,
        textAlign: "center",
        paddingTop: 4
    },
    labelContent: {
        flexDirection: "row",
        gap: 6,
        fontSize: 12,
        marginTop: 5,
        color: "#475569"
    },
    barangContent: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        fontSize: 14
    },
    line: {
        borderTop: 2,
        width: "100%",
        borderStyle: "dashed",
        margin: "22 0"
    },
    footerText: {
        fontSize: 16,
        fontWeight: 900,
        textAlign: "center",
        maxWidth: "80%",
        alignSelf: "center",
        color: "#475569"
    },
    contactText: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: 900,
        textAlign: "center"
    },
    text: {
        fontSize: 11,
        color: "#475569",
        margin: "2 0"
    }
});

export default Invoice