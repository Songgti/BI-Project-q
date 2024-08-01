import {
  ProForm,
  ProFormGroup, ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';

import React, {useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {genchartByAiUsingPost} from "@/services/songgt_BI/chartController";
import {Card, Col, message, Row} from "antd";

/**
 * 添加图表页面
 * @constructor
 */
const AddChart : React.FC = () => {

  const [chart ,setChart] = useState<API.BiResponse>()
  const [option, setOption] = useState<any>();

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <ProForm
              name="addChart"
              initialValues={{
                name: '',
                goal: '',
                chartType: '',
              }}

              //点击提交后执行代码
              //对接后端，上传数据
              onFinish={async (value: any) => {

                // setChart(undefined);
                // setOption(undefined);
                const params = {
                  ...value,
                  file: undefined
                }
                try {
                  const res = await genchartByAiUsingPost(params, {}, value.file[0].originFileObj)
                  if (!res?.data) {
                    message.error('分析失败');
                  } else {
                    message.success('分析成功');
                    const chartOption = JSON.parse(res.data.genChart ?? '');
                    if (!chartOption) {
                      throw new Error('图表解析错误')
                    }else {
                      setChart(res.data);
                      setOption(chartOption);
                    }
                  }
                } catch (e: any) {
                  message.error('分析失败,' + e.message);
                }
              }}
            >
              <ProFormGroup title="分析需求数据">
                <ProFormText width="md" name="name" label="图表名称" placeholder={"请输入图标名称"}
                             rules={[{required: true, message: '必填'}]}/>
                <ProFormText width="md" name="goal" label="分析需求" placeholder={"请输入你的分析需求，如：分析网站人数趋势等"}
                             rules={[{required: true, message: '必填'}]}/>
                <ProFormSelect
                  name="chartType"
                  label="图表类型"
                  valueEnum={{
                    折线图: '折线图',
                    柱状图: '柱状图',
                    饼图: '饼图',
                    雷达图: '雷达图',
                    散点图: '散点图'
                  }}
                  placeholder="请输入图表类型，如：柱状图，折线图等"
                />
              </ProFormGroup>
              <ProFormGroup label="分析目标">
                <ProFormUploadButton
                  name="file"
                  label="原始数据"
                  max={1}
                  fieldProps={{
                    name: 'file',
                    listType: 'picture-card',
                  }}
                  action="/upload.do"
                  extra="上传需要分析的excel"
                />
              </ProFormGroup>
            </ProForm>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.getResult ?? <div>请先在左侧进行提交</div>}
          </Card>
          <Card title="生成图表">
            {
              option ? <ReactECharts option={option}/> : <div>请先在左侧进行提交</div>
            }
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;



