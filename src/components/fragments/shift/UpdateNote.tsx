import { updateNoteShift } from "@/actions/shift";
import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import Loading from "@components/ui/loading";
import { TextArea } from "@components/ui/textarea";
import useLoading from "@hooks/use-loading";
import { toast } from "@hooks/use-toast";
import { BadgeCheck, Pen } from "lucide-react";
import React, { useState } from "react";

function UpdateNote({ note, refresh }: { note: string, refresh: () => Promise<void> }) {

    const [notes, setNotes] = useState(note ?? "")
    const [open, setOpen] = useState(false)
    const { isLoading, setLoading } = useLoading()

    async function handle() {
        setLoading("loading")
        try {
            const up = await updateNoteShift(notes)
            if (up) {
                toast({
                    title: "Success",
                    description: up
                })
                await refresh()
                setOpen(false)
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })

        } finally {
            setLoading("idle")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="absolute top-4 right-4">
                    <Pen size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-yellow-100">
                <DialogHeader>
                    <DialogTitle>
                        Catatan
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <TextArea defaultValue={note} onChange={e => setNotes(e.target.value)} className="bg-slate-50" rows={6} ></TextArea>
                </div>
                <Button onClick={handle} disabled={isLoading == "loading"}>
                    <Loading isLoading={isLoading}>
                        Ubah
                    </Loading>
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateNote;
