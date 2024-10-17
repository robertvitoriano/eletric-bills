import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface DrawerDialogProps {
  trigger?: ReactNode | string;
  title?: string;
  dialogDescription?: string;
  drawerDescription?: string;
  content?: ReactNode;
  footerContent?: ReactNode;
}

export function DrawerDialog({
  trigger = "Drawer Trigger ",
  title = "Drawer Dialog title",
  dialogDescription = "This is the dialog description",
  drawerDescription = "This is the drawer description",
  content,
  footerContent,
}: DrawerDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-secondary">
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
            <DialogDescription className="text-white">{dialogDescription}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="bg-secondary">
        <DrawerHeader>
          <DrawerTitle className="text-white">{title}</DrawerTitle>
          <DrawerDescription className="text-white">{drawerDescription}</DrawerDescription>
        </DrawerHeader>
        {content}
        {footerContent && <DrawerFooter className="pt-2 text-white">{footerContent}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
