import request from '../utils/request';

const key = 'http://localhost:4002/api/method=get&appkey=436etaq52e57a3cd028ab56b&seckey=sec-mj12Slu12w1Xs1er8ZzmGZqw5qrpFmqw25jHULr13eUZCswA';


export async function queryLaneLastMinutes(playload) {

  return request(`${key}/cross/${playload.cross_id}/lane/${playload.lane}/last/${playload.last}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });
}

export async function queryAllCrossID() {

  return request(`${key}/allcrossid`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });

}
// playload.cross_id  playload.lane_start playload.lane_end playload.time_start playload.time_end
export async function queryRangeByLaneAndTime(playload) {

  return request(`${key}/cross/${playload.cross_id}/lane/lanestart=${playload.lane_start}&laneend=${playload.lane_end}/start=${playload.time_start}&end=${playload.time_end}`,{
    method:'GET',
    mode:'cors',
    credentials: "",
    cache: 'default',
  });

}

