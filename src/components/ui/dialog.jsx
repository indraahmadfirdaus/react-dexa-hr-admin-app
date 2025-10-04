import { Dialog as HeadlessDialog } from "@headlessui/react";

export const Dialog = ({ open, onOpenChange, children }) => (
  <HeadlessDialog open={open} onClose={onOpenChange}>
    {children}
  </HeadlessDialog>
);

export const DialogTrigger = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export function DialogPortal({ children }) {
  return <>{children}</>;
}

export const DialogOverlay = ({ className = "", ...props }) => (
  <div
    aria-hidden="true"
    className={("fixed inset-0 bg-black/50 backdrop-blur-sm " + className).trim()}
    {...props}
  />
);

export const DialogContent = ({ className = "", children, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <HeadlessDialog.Panel
        className={
          ("w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-lg border bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-lg " + className).trim()
        }
        {...props}
      >
        {children}
      </HeadlessDialog.Panel>
    </div>
  </DialogPortal>
);

export const DialogHeader = ({ className = "", ...props }) => (
  <div className={("px-4 pt-4 " + className).trim()} {...props} />
);

export const DialogFooter = ({ className = "", ...props }) => (
  <div className={("px-4 pb-4 flex justify-end gap-2 " + className).trim()} {...props} />
);

export const DialogTitle = ({ className = "", ...props }) => (
  <HeadlessDialog.Title
    className={("text-lg font-semibold " + className).trim()}
    {...props}
  />
);

export const DialogDescription = ({ className = "", ...props }) => (
  <HeadlessDialog.Description
    className={("mt-1 text-sm text-[hsl(var(--muted-foreground))] " + className).trim()}
    {...props}
  />
);

export const DialogClose = ({ className = "", ...props }) => (
  <button type="button" className={className} {...props} />
);