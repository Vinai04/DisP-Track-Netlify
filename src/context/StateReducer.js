import { reducerCases } from "./Constants";

export const initialState = {
  fileInfo: undefined,
  contract: undefined,
  retrieved_data: undefined,
  redirect_page: false,
  transaction_status: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_FILE_DATA: {
      return {
        ...state,
        fileInfo: action.fileInfo,
      };
    }
    case reducerCases.SET_CONTRACT: {
      return {
        ...state,
        contract: action.contract,
      };
    }
    case reducerCases.SET_RETRIEVED_DATA: {
      return {
        ...state,
        retrieved_data: action.retrieved_data,
      };
    }
    case reducerCases.SET_REDIRECT: {
      return {
        ...state,
        redirect_page: action.redirect_page,
      };
    }
    case reducerCases.SET_TRANSACTION_STATUS: {
      return {
        ...state,
        transaction_status: action.transaction_status,
      };
    }
  }
};

export default reducer;
