import { useState } from 'react';
import { UserWithRole } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { canDeleteClinics } from '@/utils/permissions';

interface DeleteProgress {
  current: number;
  total: number;
}

export const useDeleteOperations = (user: UserWithRole | null) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<DeleteProgress | null>(
    null
  );

  const deleteSingleClinic = async (clinicId: string, clinicName: string) => {
    try {
      setIsDeleting(true);

      // First check if we have permission
      if (!user || !canDeleteClinics(user)) {
        throw new Error('You do not have permission to delete clinics');
      }

      // First try to fetch the clinic to verify it exists and we can access it
      const { data: clinicData, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicId)
        .single();

      if (fetchError) {
        throw new Error('Failed to verify clinic exists');
      }

      if (!clinicData) {
        throw new Error('Clinic not found');
      }

      // Use the API endpoint for deletion
      const response = await fetch('/api/admin/clinics/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete clinic');
      }

      toast.success(`Clinic "${clinicName}" deleted successfully`);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete clinic';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteBulkClinics = async (clinicIds: string[]) => {
    try {
      setIsDeleting(true);
      setDeleteProgress({ current: 0, total: clinicIds.length });

      for (let i = 0; i < clinicIds.length; i++) {
        const { error } = await supabase
          .from('clinics')
          .delete()
          .eq('id', clinicIds[i]);
        if (error) throw error;
        setDeleteProgress((_prev) => ({
          current: i + 1,
          total: clinicIds.length,
        }));
      }

      toast.success(`${clinicIds.length} clinics deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting clinics:', error);
      toast.error('Failed to delete some clinics');
      return { success: false };
    } finally {
      setIsDeleting(false);
      setDeleteProgress(null);
    }
  };

  const softDeleteClinic = async (clinicId: string, clinicName: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('clinics')
        .update({ verification_status: 'archived' })
        .eq('id', clinicId);

      if (error) throw error;

      toast.success(`Clinic "${clinicName}" archived successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error archiving clinic:', error);
      toast.error('Failed to archive clinic');
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteProgress,
    deleteSingleClinic,
    deleteBulkClinics,
    softDeleteClinic,
  };
};

export const DeleteProgressIndicator = ({
  current,
  total,
  message,
}: {
  current: number;
  total: number;
  message: string;
}) => {
  const progress = (current / total) * 100;

  return (
    <div className='fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80'>
      <p className='text-sm font-medium mb-2'>{message}</p>
      <Progress value={progress} className='mb-2' />
      <p className='text-xs text-gray-500 text-right'>
        {current} of {total}
      </p>
    </div>
  );
};

export const BulkDeleteActions = ({
  selectedCount,
  onDelete,
  onSoftDelete,
  isDeleting,
}: {
  selectedCount: number;
  onDelete: () => void;
  onSoftDelete: () => void;
  isDeleting: boolean;
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className='flex items-center gap-2 p-4 bg-gray-50 rounded-lg'>
      <span className='text-sm text-gray-600'>{selectedCount} selected</span>
      <Button
        variant='outline'
        size='sm'
        onClick={onSoftDelete}
        disabled={isDeleting}
      >
        Archive Selected
      </Button>
      <Button
        variant='destructive'
        size='sm'
        onClick={onDelete}
        disabled={isDeleting}
      >
        Delete Selected
      </Button>
    </div>
  );
};

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'single' | 'bulk' | 'soft';
  isLoading: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={type === 'soft' ? 'default' : 'destructive'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? 'Processing...'
              : type === 'soft'
              ? 'Archive'
              : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
