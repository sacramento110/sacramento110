import { useCallback, useState } from 'react';

// Generic type for modal data - can be string or object
type ModalData = string | Record<string, unknown> | null;

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>(null);

  const openModal = useCallback((modalData: ModalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  };
};
