import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

const avatars = [
  "/placeholder.svg",
  "https://source.unsplash.com/random/200x200?face=1",
  "https://source.unsplash.com/random/200x200?face=2",
  "https://source.unsplash.com/random/200x200?face=3",
  "https://source.unsplash.com/random/200x200?face=4",
];

const UserProfileContent = () => {
  const [avatarIndex, setAvatarIndex] = useState(0);

  const changeAvatar = () => {
    setAvatarIndex((prevIndex) => (prevIndex + 1) % avatars.length);
  };

  const { data} = useSession()

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative group">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatars[avatarIndex]} alt="Profile picture" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={changeAvatar}
            >
              <Pencil className="h-2 w-2" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{data?.user.name}</h3>
                <Badge variant="outline" className="bg-green-300 font-semibold">
                  {data?.user?.roleName}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Seorang {data?.user.roleName} di Apotek{" "}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileContent;
