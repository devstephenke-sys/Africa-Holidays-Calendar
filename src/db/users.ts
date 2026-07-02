import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string) {
  try {
    // Check if the user is devstephen.ke@gmail.com to assign admin role
    const role = (email === 'devstephen.ke@gmail.com') ? 'admin' : 'user';

    const result = await db.insert(users)
      .values({
        uid,
        email,
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          role, // Ensure role is updated if the email is changed/updated
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to sync user with database:", error);
    // Return a fallback object so authentication doesn't completely block the user
    return { uid, email, role: email === 'devstephen.ke@gmail.com' ? 'admin' : 'user' };
  }
}
