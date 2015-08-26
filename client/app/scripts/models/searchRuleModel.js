// client side only model
const SearchRuleModel = Backbone.Model.extend({
  parse (data) {
    console.log('parsing model');
    const leftOperand = _.keys(data)[0];
    const operator = _.keys(data[leftOperand])[0];
    const rightOperand = data[leftOperand][operator];
    return { leftOperand, operator, rightOperand };
  },
  // return object that looks like ...
  // {
  //   this.leftOperand: {
  //     this.operator: this.rightOperand
  //   }
  // }
  // this is the format expected by the server (sequelize)
  getWhereQuery () {
    const json = `{
      "${ this.get('leftOperand') }": {
        "${ this.get('operator') }": ${ this.get('rightOperand') }
      }
    }`;
    return JSON.parse(json);
  }
});

export default SearchRuleModel;
