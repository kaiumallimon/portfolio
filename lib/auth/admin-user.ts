import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/models";

// Finds a user by email using MongoDB User collection
export async function findUserByEmail(
  email: string,
): Promise<{ id: string } | null> {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return user ? { id: user._id.toString() } : null;
  } catch {
    return null;
  }
}
