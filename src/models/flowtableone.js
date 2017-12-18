import {queryLaneLastMinutes, queryAllCrossID} from '../services/flow';


export default {
  namespace: 'flowTableOne',
  state: {
    flow: [],
  },

  effects: {

    * fetchCrossID(_, {call, put}){
      const response = yield call(queryAllCrossID);
      yield put({
        type:'saveCrossID',
        payload:response
      })
    },

    * fetchFlow({payload}, {call, put}) {
      console.log('fetch');
      // param: cross_id,lane,last
      const response = yield call(queryLaneLastMinutes,payload);
      let  res = [];
      response.forEach((v)=>{
          res.push(v.CrossTrafficData)
      });

      yield put({
        type: 'saveFlow',
        payload: res,
      });

    },
  },

  reducers: {
    saveFlow(state, action) {
      // TODO 解构赋值
      state.flow = null;
      return {
        ...state,
        flow: action.payload,
      };
    },
    saveCrossID(state, action) {
      return {
        ...state,
        crossID:action.payload
      }
    }
  },
};
