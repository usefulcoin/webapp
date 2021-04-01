import * as React from 'react'
import {Line} from 'react-chartjs-2'
import { colors } from 'src/styles';
import styled from 'styled-components'
import {HOUR, MINUTE} from "src/constants";

const SPriceChart = styled.div`
  width: 100%;
  
  padding: 20px;
  color: white;
  border: 1px solid rgb(${colors.grey});
  border-radius: 8px;
  background-color: rgb(${colors.white});
`
const SHelper = styled.div`
    font-size: x-small;
`

const SInActiveTimeFrame = styled.span`
  cursor: pointer;
`

interface IPriceChartState {
  pendingRequest: boolean;
  data: any;
  error: string;
  priceInterval: any;
  timeFrame: string;
}

const INITIAL_STATE: IPriceChartState = {
  pendingRequest: false,
  error: "",
  data: {},
  priceInterval: null,
  timeFrame: HOUR
};

class ITCOChart extends React.Component<any, any> {

  public state: IPriceChartState;

    constructor(props: any) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    public componentDidMount() {
        this.getInitialData();
        this.setState({
          priceInterval : setInterval(() => {
            this.getInitialData()
        }, 5000)
        });
    }


    public componentWillUnmount() {
      clearInterval(this.state.priceInterval);
    }

    public componentDidUpdate(prevProps: any) {
      if (this.props !== prevProps) {
        clearInterval(this.state.priceInterval);
        this.getInitialData();
        this.setState({
          priceInterval : setInterval(() => {
            this.getInitialData()
        }, 5000)
        });
      }
    }

    public async getInitialData() {
      
      try {
        this.setState({pendingRequest: true, error: ""});
     

        this.setState({pendingRequest: false,
          
            data: {
          labels: ["Tier 1","Tier 2","Tier 3","Tier 4","Tier 5","Tier 6",],
          datasets: [
            {
              label: ``,
              fill: false,
              lineTension: 0.1,
              backgroundColor: `rgb(${colors.blue},1)`,
              borderColor: `rgb(${colors.blue},0.4)`,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: `rgb(${colors.blue},1)`,
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: `rgb(${colors.blue},1)`,
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [100, 200, 300, 400, 500, 600]
            }
          ]
        }}); 
      } catch(e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            this.setState({pendingRequest: false, error: "Request failed"});

      }
    }

public setTimeFrame(setting: string) {

  this.setState({
    timeFrame: setting
  });
}

 public renderTimeFrame() {
   const {timeFrame} = this.state;
   switch(timeFrame) {
     case MINUTE:
      return <><SInActiveTimeFrame onClick={() => this.setTimeFrame(HOUR)}>HOUR</SInActiveTimeFrame> <b>MINUTE</b></>
     default:
       // Hour
       return <><b>HOUR</b> <SInActiveTimeFrame onClick={() => this.setTimeFrame(MINUTE)}>MINUTE</SInActiveTimeFrame></>
   }
 }

  public render() {
    const {data, error} = this.state;
    return (
      <SPriceChart>
        {
          error !== "" ?
          <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
          :
          <>
          <SHelper style={{color: `rgb(${colors.black})`}}>{this.renderTimeFrame()}</SHelper>
          <div style={{width:"100%", height: "300px"}}>
          <Line data={data} />
          </div>
          </>
        }
       
      </SPriceChart>
    )
  }
 
}

export default ITCOChart
