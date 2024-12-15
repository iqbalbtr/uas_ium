"use client"
import { getApotek } from "@/actions/apotek";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import useFetch from "@hooks/use-fetch";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function InformasiApotek() {

  const {data} = useFetch({
    url: getApotek,
    defaultValue: undefined
  })

  return (
    <Card className="w-full h-[90vh] ">
      <div className="relative w-full h-[35%]">
        <Image
          src="/images/apotek.jpg"
          alt="Pharmacy storefront"
          layout="fill"
          objectFit="cover"
          className=" rounded-t-lg"
          onLoadingComplete={(image: any) =>
            image.classList.remove("opacity-0")
          }
        />
      </div>
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">
          {data?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {data?.alamat}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {data?.phone}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {data?.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
