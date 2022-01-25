const INITIAL_STATE = {
  userLogged: [],
};

function userLoggedNow(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "USER_LOG":
      const newUserArr = [];
      newUserArr.unshift(action.payload);

      return {
        userLogged: newUserArr,
      };
  }

  return state;
}

export default userLoggedNow;
