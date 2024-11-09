
'use client';

import useLoginModal from '@/src/hooks/useLoginModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import useRegisterModal from '@/src/hooks/useRegisterModal';

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