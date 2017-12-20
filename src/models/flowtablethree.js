import {queryRangeById, queryAllCrossID} from '../services/flow';


export default {
  namespace: 'flowTableThree',
  state: {
    flow: [],
    loading:false,
    currentPage:1,
  },

  effects: {
    * fetchCrossID(_, {call, put}){
      const response = yield call(queryAllCrossID);
      yield put({
        type:'saveCrossID',
        payload:response
      })
    },

    * fetchFlowById({payload}, {call, put}) {
      console.log('fetch');
      // param: cross_id,lane,last
      yield put({
        type: 'addLoading',
      });
      const response = yield call(queryRangeById,payload);
      let  res = [];
      let total_count = response.pop().total_count;

      response.forEach((v)=>{
        res.push(v.CrossTrafficData)
      });


      yield put({
        type: 'saveFlow',
        payload: res,
      });

      yield put({
        type: 'savePageCount',
        payload: total_count,
      });

      yield put({
        type:'hideLoading',
      })

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
    },
    addLoading(state){
      return{
        ...state,
        loading:true
      }
    },
    hideLoading(state){
      return{
        ...state,
        loading:false
      }
    },
    savePageCount(state, action) {

      state.total_page = 0;
      console.log(action);
      return {
        ...state,
        total_page: action.payload
      }
    },
  },
};
