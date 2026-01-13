export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  numericFilter() {
    let queryObj = {};
    if (this.queryStr.numericFilter) {
      const operatorMap = {
        "<": "$lt",
        ">": "$gt",
        "=": "$eq",
        "<=": "$lte",
        ">=": "$gte",
      };

      const regEx = /\b(>=|<=|>|<|=)\b/g;
      //earn>100 -> earn-$gt-100
      let filters = this.queryStr.numericFilter.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );

      const options = ["earn", "rating"];
      //earn-$gt-100 --> [earn,$gt,100] or [field=earn, operator=$gt, value=100]
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");

        if (options.includes(field)) {
          queryObj[field] = { [operator]: Number(value) };
        }

        console.log("queryObj", queryObj);
      });
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(",").join(" "));
    }
    return this;
  }

  selectField() {
    if (this.queryStr.select) {
      this.query = this.query.select(select.split(",").join(" "));
    } else {
      // "-__v" excludes the __v :0 fields which mongo automatically create at the db creation time
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryStr.page || 1);
    const limit = Number(this.queryStr.limit || 10);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
