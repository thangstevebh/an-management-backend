import { Schema, Document, Model } from "mongoose";

// Extend HydratedDocument to include soft delete properties
export interface SoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt: Date | null;
  softDelete(): Promise<this>;
  restore(): Promise<this>;
}

export interface SoftDeleteModel<T extends SoftDeleteDocument> extends Model<T> {
  findDeleted(): Promise<T[]>;
  restoreDeleted(query: any): Promise<T[]>;
}

export function softDeletePlugin(schema: Schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  // 2. Override default find methods to exclude soft-deleted documents
  const findMethods = [
    "find",
    "findOne",
    "findOneAndUpdate",
    "findOneAndDelete",
    "findOneAndReplace",
  ];

  findMethods.forEach((method) => {
    schema.pre(method as any, function (this: any) {
      if (this.getOptions().withDeleted) {
        // Allow specific queries to include deleted documents
        return;
      }
      // Default behavior: exclude soft-deleted documents
      this.where({ isDeleted: false });
    });
  });

  // 3. Instance method to soft delete a document
  schema.methods.softDelete = async function (this: SoftDeleteDocument) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
    return this;
  };

  // 4. Instance method to restore a soft-deleted document
  schema.methods.restore = async function (this: SoftDeleteDocument) {
    this.isDeleted = false;
    this.deletedAt = null;
    await this.save();
    return this;
  };

  // 5. Static method to find only soft-deleted documents
  schema.statics.findDeleted = function <T extends SoftDeleteDocument>(this: Model<T>) {
    return this.find({ isDeleted: true });
  };

  // 6. Static method to restore multiple soft-deleted documents based on a query
  schema.statics.restoreDeleted = async function <T extends SoftDeleteDocument>(
    this: Model<T>,
    query: any,
  ) {
    const docs = await this.find({ ...query, isDeleted: true });
    const restoredDocs: T[] = [];
    for (const doc of docs) {
      doc.isDeleted = false;
      doc.deletedAt = null;
      await doc.save();
      restoredDocs.push(doc);
    }
    return restoredDocs;
  };

  // schema.methods.remove = function (this: SoftDeleteDocument, callback?: Function) {
  //   if (callback) {
  //     this.softDelete()
  //       .then((doc) => callback(null, doc))
  //       .catch((err) => callback(err));
  //   } else {
  //     return this.softDelete();
  //   }
  // };
}
