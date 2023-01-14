import { Id } from 'react-toastify';
import { toast } from 'react-toastify';

export function renderToast(id: Id, updateContent: string, error?: any): void {
  if (error) {
    toast.update(id, {
      render: `${updateContent}.\n${error.code ? `\nError code: ${error.code}\nError message: ` : ''}${
        error.message.length < 300 ? error.message : error.message.slice(0, 300)
      }...`,
      delay: 100,
      type: 'error',
      isLoading: false,
      autoClose: 2000
    });
  } else {
    toast.update(id, {
      render: updateContent,
      delay: 100,
      type: 'success',
      isLoading: false,
      autoClose: 2000
    });
  }
}
