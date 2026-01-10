import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  showCloseAlert: boolean;
  setShowCloseAlert: (value: boolean) => void;
  handleConfirmClose: () => void;
};

export function PostCloseAlertDialog({
  showCloseAlert,
  setShowCloseAlert,
  handleConfirmClose,
}: Props) {
  return (
    <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に閉じますか？</AlertDialogTitle>
          <AlertDialogDescription>
            閉じると現在の下書きが全て削除されます
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirmClose}
          >
            閉じる
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
