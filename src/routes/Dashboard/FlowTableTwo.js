import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Form, InputNumber, Select, Table, DatePicker} from 'antd';
import {total} from "../../components/Charts/Pie/index";
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;

const columns = [{
  title: '检测截至时间',
  dataIndex: 'DateTime',
  key: 'DateTime',
},
  {
    title: '车道号',
    dataIndex: 'LaneNO',
    key: 'LaneNO',
  },
  {
  title: '交通流量（辆）',
  dataIndex: 'Volume',
  key: 'Volume',
}, {
  title: '平均占有时间（毫秒）',
  dataIndex: 'AvgOccupancy',
  key: 'AvgOccupancy',
},
  {
    title: '平均车头时距（毫秒）',
    dataIndex: 'AvgHeadTime',
    key: 'AvgHeadTime',

  },
  {
    title: '平均车长（米）',
    dataIndex: 'AvgLength',
    key: 'AvgLength',

  },
  {
    title: '平均速度（KM/H）',
    dataIndex: 'AvgSpeed',
    key: 'AvgSpeed',
  },
  /*  {
      title: '饱和度',
      dataIndex: 'Saturation',
      key: 'Saturation',

    },
    {
    title: '密度',
    dataIndex:'Density',
    key: 'Density',
    }*/
];


@connect((state) => ({
  flowState: state.flowTableTwo.flow,
  crossID: state.flowTableTwo.crossID,
  total: state.flowTableTwo.total_page,
}))
@Form.create()
export default class FlowTableOne extends Component {
  constructor(props) {
    super(props);
    // DatePicker
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
    // 获取cross id
    this.props.dispatch({
      type: 'flowTableTwo/fetchCrossID',
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        // Should format date value before submit.
        const rangeTimeValue = fieldsValue['range_time_picker'];
        const values = {
          ...fieldsValue,
          'range_time_picker': [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          ],
        };

        console.log('Received values of form: ', values);
        values.time_start = values.range_time_picker[0];
        values.time_end = values.range_time_picker[1];

        this.props.dispatch({
          type: 'flowTableTwo/fetchFlowByRange',
          payload: values,
        });
      }
    });
  };

  // 处理表单提交
  render() {
    console.log(this.props.total);
    //  TODO  Loding  const {submitting} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // 设置CrossID
    let crossIDs = this.props.crossID || [];
    let crossOption = <Option key={1}>数据请求中</Option>;
    let laneNO = [];

    if (crossIDs != 0) {
      crossOption = crossIDs.map(id => <Option key={id}>{id}</Option>);
    }
    // 设置车道号 TODO 暂时写死
    for (let i = 1; i <= 25; i++) {

      if(i >= 10){
        i = '0' + i
      } else if(i >= 20){
        i = '0' + i
      } else {
        i = '00'+ i;
      }
      laneNO.push(i)
    }
    const laneOption = laneNO.map(i => <Option key={i}>{i}</Option>);

    // 设置Table数据
    const dataSource = [];
    let orginalSource = this.props.flowState;
    orginalSource.forEach((v, i) => {
      let tempData = v.DataList.Data;
      let obj = {
        key: i,
        DateTime: v.DateTime,
        Volume: tempData.Volume,
        AvgOccupancy: tempData.AvgOccupancy,
        AvgHeadTime: tempData.AvgHeadTime,
        AvgLength: tempData.AvgLength,
        AvgSpeed: tempData.AvgSpeed,
        LaneNO:tempData.LaneNO,
      };
      dataSource.push(obj)
    });

    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          layout="inline"
        >

          <div style={{marginBottom: 50}}>
            <FormItem
              label="Cross-ID"
            >
              {getFieldDecorator('cross_id', {
                rules: [{
                  required: true, message: '请输入CrossID',
                }],
              })(
                <Select style={{width: 120}}>
                  {crossOption}
                </Select>
              )}
            </FormItem>
            <FormItem
              label="开始车道号"
            >
              {getFieldDecorator('lane_start', {
                rules: [{
                  required: true, message: '请选择车道号',
                }],
              })(
                <Select style={{width: 120, marginRight: 20}}>
                  {laneOption}
                </Select>
              )}
            </FormItem>

            <FormItem
              label="结束车道号"
            >
              {getFieldDecorator('lane_end', {
                rules: [{
                  required: true, message: '请选择车道号',
                }],
              })(
                <Select style={{width: 120, marginRight: 20}}>
                  {laneOption}
                </Select>
              )}
            </FormItem>

            <FormItem>
              <FormItem
                label="时间段"
              >
                {getFieldDecorator('range_time_picker', rangeConfig)(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
            </FormItem>

            <FormItem>
              <Button style={{ marginRight: 20}} type="primary" htmlType="submit">Search</Button>
            </FormItem>

          </div>
        </Form>
        {/*  TODO 分页   Pagination ={} */}
        <Table columns={columns} dataSource={dataSource}/>
      </div>
    )
  }
}
