export const paginate = async (model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const sort = options.sort || { createdAt: -1 };
  const projection = options.projection || null;
  const populate = options.populate || "";

  const [data, total] = await Promise.all([
    model.find(query, projection).sort(sort).skip(skip).limit(limit).populate(populate),
    model.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};
