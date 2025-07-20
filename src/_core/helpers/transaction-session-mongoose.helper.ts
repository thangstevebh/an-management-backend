import { ClientSession, Connection } from "mongoose";

export const runInTransaction = async <T>(
  connection: Connection,
  callback: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  const session = await connection.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
