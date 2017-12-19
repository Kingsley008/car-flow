import {queryRangeByLaneAndTime ,queryAllCrossID} from '../services/flow';


export default {
  namespace: 'flowTableTwo',
  state: {
    flow: [],
    crossID:[],
    total_page:0,
    loading:false,
  },

  effects: {
    * fetchCrossID(_, {call, put}){
      const response = yield call(queryAllCrossID);
      yield put({
        type:'saveCrossID',
        payload:response
      })
    },

    * fetchFlowByRange({payload}, {call, put}) {
      console.log('fetch');
      yield put({
        type:'addLoading',
      });
      // param playload.cross_id  playload.lane_start playload.lane_end playload.time_start playload.time_end
      const response = yield call(queryRangeByLaneAndTime,payload);

      let  res = [];
      let total_count = response.pop().total_count;
      console.log(response, total_count);

      response.forEach((v)=>{
        res.push(v.CrossTrafficData)
      });

      yield put({
        type: 'saveRangeFlow',
        payload: res,
      });

      yield put({
        type: 'savePageCount',
        payload: total_count,
      });
      yield put({
        type:'hideLoading',
      });
    },
  },

  reducers: {
    saveRangeFlow(state, action) {
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
    savePageCount(state, action) {

      state.total_page = 0;
      console.log(action);
      return {
        ...state,
        total_page: action.payload
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
    }
  },
};
