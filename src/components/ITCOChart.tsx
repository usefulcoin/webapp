import * as React from 'react'
import { colors } from 'src/styles';
import styled from 'styled-components'
import { Chart } from "react-google-charts";
import {greaterThanOrEqual, divide} from "../helpers/bignumber";

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


interface IPriceChartState {
  pendingRequest: boolean;
  data: any;
  error: string;
}

const INITIAL_STATE: IPriceChartState = {
  pendingRequest: false,
  error: "",
  data: {},
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
    }



    public async getInitialData() {
      
      try {
        this.setState({pendingRequest: true, error: ""});

        const {tier} = this.props;
        const prices = [80000000000000, 90000000000000, 100000000000000, 110000000000000, 120000000000000, 130000000000000];
     
        const x: any = [ ['Tier Number', '', ''],];
        for (let i = 1; i < 7; i++) {
          x.push([i, greaterThanOrEqual(tier, i) ? parseFloat(divide(prices[i-1], 1000000000000000000)) : parseFloat("0"), greaterThanOrEqual(tier, i) ? parseFloat("0") : parseFloat(divide(prices[i-1], 1000000000000000000))])
        }

            // tslint:disable-next-line:no-console
            console.log("set graph data to:");
            // tslint:disable-next-line:no-console
            console.log(x);

            // tslint:disable-next-line:no-console
            console.log(`tier is : ${tier} type ${typeof(tier)}`);
        this.setState({ 
            pendingRequest: false,
            data: x,
          }); 
      } catch(e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            this.setState({pendingRequest: false, error: "Request failed"});

      }
    }


  public render() {
    const {error, data} = this.state;
    return (
      <SPriceChart>
        {
          error !== "" ?
          <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
          :
          <>
          <div style={{width:"100%", height: "300px"}}>
          
          <Chart
            width={this.props.width}
            height={(this.props.width/5)*3}
            chartType="SteppedAreaChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
              title: "IBCO Tiers",
              vAxis: { title: 'ETH/BIOP' },
              isStacked: true,
            }}
            rootProps={{ 'data-testid': '1' }}
          />
          </div>
          </>
        }
       
      </SPriceChart>
    )
  }
 
}

export default ITCOChart
