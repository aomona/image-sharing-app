import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LoginButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ログイン</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
          <DialogDescription>
            アカウントを作成、またはログイン
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button className="w-full" variant="outline">
            <Image width={16} height={16} src="/google.svg" alt="googlelogo" />
            Googleでログイン
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
