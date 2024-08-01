import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPost} from "@/services/songgt_BI/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@umijs/max";;

/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {

  const initSearchParams = {
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'desc'
  }

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏 title
        if(res.data.records){
          res.data.records.forEach(data => {
            if(data.status === 'succeed'){
              const chartOption = JSON.parse(data.genchart ?? '{}')
              chartOption.title = undefined;
              data.genchart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败' + e.message)
    }
  }
  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <List
        // itemLayout="vertical"
        grid={{gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 4,
        }}
        dataSource={chartList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.name}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
                title={item.name}
                description={item.chartType ? ('图表类型：' + item.chartType) : undefined}
              />
              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="图表待生成"
                      subTitle={item.execMessage ?? '当前图表生成繁忙,请耐心等候'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div style={{marginBottom: 16}}/>
                    {'分析目标' + item.goal}
                    <div style={{marginBottom: 16}}/>
                    <ReactECharts option={item.genchart && JSON.parse(item.genchart)}/>
                  </>
                }
                {
                  item.status === 'failed' && <>
                  <Result
                    status="error"
                    title="图表生成失败"
                    subTitle={item.execMessage}
                  />
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  );
};
export default MyChart;



