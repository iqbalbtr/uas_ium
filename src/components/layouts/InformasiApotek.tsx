"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import React from "react";

export default function InformasiApotek() {
  return (
    <Card className="w-full min-h-screen max-w-md mx-auto ">
      <div className="relative w-full h-48">
        <Image
          src="/images/apotek.jpg"
          alt="Pharmacy storefront"
          layout="fill"
          objectFit="cover"
          className="transition-opacity opacity-0 duration-[1s] rounded-t-lg"
          onLoadingComplete={(image: any) =>
            image.classList.remove("opacity-0")
          }
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Empat Husada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            123 Main Street, Anytown, CA 91234
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <a href="tel:555-123-4567" className="hover:underline">
              555-123-4567
            </a>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <a href="mailto:info@doepharmacy.com" className="hover:underline">
              info@doepharmacy.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
