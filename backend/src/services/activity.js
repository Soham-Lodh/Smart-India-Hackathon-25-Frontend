import Activity from "../models/Activity.js";

export function createActivity(userId, type, title, description = "", metadata = {}) {
  return Activity.create({
    user: userId,
    type,
    title,
    description,
    metadata,
  });
}
