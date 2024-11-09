
'use client';

import useLoginModal from '@/hooks/useLoginModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import useRegisterModal from '@/hooks/useRegisterModal';

const AuthModals = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  return (
    <>
      {loginModal.isOpen && <LoginModal />}
      {registerModal.isOpen && <RegisterModal />}
    </>
  );
};

export default AuthModals;