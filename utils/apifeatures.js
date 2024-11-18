class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // Custom query object
    const q = this.queryStr.q
      ? {
        $text: { $search: this.queryStr.q },
      }
      : {};

    // Perform query
    this.query = this.query.find({ ...q });

    return this;
  }
}

export default ApiFeatures;
