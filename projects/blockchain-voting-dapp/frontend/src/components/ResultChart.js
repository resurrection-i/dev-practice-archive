import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { getContract, loadCandidates } from '../utils/web3';
import './ResultChart.css';

function ResultChart() {
  const chartRef = useRef(null);
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载投票数据
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 使用loadCandidates直接获取候选人数据
        const results = await loadCandidates();
        setCandidateData(results);
        setLoading(false);
      } catch (error) {
        console.error("加载投票数据失败:", error);
        setError("加载数据失败: " + error.message);
        setLoading(false);
      }
    };
    
    fetchResults();
  }, []);

  // 初始化图表
  useEffect(() => {
    // 只有在有数据且加载完成后才初始化图表
    if (!loading && candidateData.length > 0 && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: '候选人票数统计',
          left: 'center',
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} 票'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: candidateData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 30 // 如果名称太长，可以旋转
          }
        },
        yAxis: {
          type: 'value',
          name: '票数'
        },
        series: [
          {
            name: '得票数',
            type: 'bar',
            data: candidateData.map(item => parseInt(item.votes)),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      };
      
      chart.setOption(option);
      
      // 响应窗口大小变化
      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      
      // 组件卸载时清理
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [loading, candidateData]);

  // 重新加载数据
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await loadCandidates();
      setCandidateData(results);
      setLoading(false);
    } catch (error) {
      setError("刷新数据失败: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="result-chart-container">
      <div className="chart-header">
        <h2>投票结果统计</h2>
        <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
          {loading ? "加载中..." : "刷新数据"}
        </button>
      </div>
      
      {error && (
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={handleRefresh}>重试</button>
        </div>
      )}
      
      {loading ? (
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>正在加载投票数据...</p>
        </div>
      ) : (
        <div 
          ref={chartRef}
          className="chart-container"
          style={{ width: '100%', height: '500px' }}
        ></div>
      )}
    </div>
  );
}

export default ResultChart;