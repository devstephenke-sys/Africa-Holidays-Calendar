import { prisma } from './prisma.ts';

export async function getOrCreateUser(uid: string, email: string) {
  try {
    // Check if the user is devstephen.ke@gmail.com to assign admin role
    const role = (email === 'devstephen.ke@gmail.com') ? 'admin' : 'user';

    return await prisma.user.upsert({
      where: { uid },
      update: {
        email,
        role,
      },
      create: {
        uid,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Failed to sync user with database:", error);
    // Return a fallback object so authentication doesn't completely block the user
    return { uid, email, role: email === 'devstephen.ke@gmail.com' ? 'admin' : 'user' };
  }
}
