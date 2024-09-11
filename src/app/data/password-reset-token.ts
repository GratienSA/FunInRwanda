import prismadb from '../libs/prismadb'

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await prismadb.passwordResetToken.findUnique({
      where: { token }
    });
    return passwordToken;
  } catch (error) {
    console.error("Error in getPasswordResetTokenByToken:", error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await prismadb.passwordResetToken.findFirst({
      where: { email }
    });
    return passwordToken;
  } catch (error) {
    console.error("Error in getPasswordResetTokenByEmail:", error);
    return null;
  }
};