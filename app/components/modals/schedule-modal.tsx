
'use client';

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleUpdated?: () => void;
}

export default function ScheduleModal({ open, onOpenChange, onScheduleUpdated }: ScheduleModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Schedule Modal</h2>
        <p className="text-muted-foreground mb-4">This is a placeholder modal for scheduling.</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border rounded hover:bg-muted"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onScheduleUpdated?.();
              onOpenChange(false);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
