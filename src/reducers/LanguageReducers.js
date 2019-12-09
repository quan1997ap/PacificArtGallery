//state không thay đổi, chỉ trả về giá trị cuối cùng
const changeLangReducers = (lang = 'vi', action) => {
  switch (action.type) {
    case 'CHANGELANGUAGE':
      // console.log('change  ' + action.language);
      return action.language;

    default:
      return lang;
   
  }
};

export default changeLangReducers;
