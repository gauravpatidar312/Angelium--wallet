export const COSMIC_THEME = {
  name: 'cosmic',
  base: 'default',
  variables: {

    temperature: [
      '#2ec7fe',
      '#31ffad',
      '#7bff24',
      '#fff024',
      '#f7bd59',
    ],

    solar: {
      gradientLeft: '#7bff24',
      gradientRight: '#2ec7fe',
      shadowColor: '#19977E',
      radius: ['70%', '90%'],
    },

    traffic: {
      colorBlack: '#000000',
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipBorderColor: '#00d977',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 4px 16px;',
      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',

      lineBg: '#d1d1ff',
      lineShadowBlur: '14',
      itemColor: '#BEBBFF',
      itemBorderColor: '#ffffff',
      itemEmphasisBorderColor: '#ffffff',
      shadowLineDarkBg: '#655ABD',
      shadowLineShadow: 'rgba(33, 7, 77, 0.5)',
      gradFrom: 'rgba(118, 89, 255, 0.4)',
      gradTo: 'rgba(164, 84, 255, 0.5)',
    },

    electricity: {
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipLineColor: 'rgba(255, 255, 255, 0.1)',
      tooltipLineWidth: '1',
      tooltipBorderColor: '#00d977',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',

      axisLineColor: 'rgba(161, 161 ,229, 0.3)',
      xAxisTextColor: '#a1a1e5',
      yAxisSplitLine: 'rgba(161, 161 ,229, 0.2)',

      itemBorderColor: '#ffffff',
      lineStyle: 'dotted',
      lineWidth: '6',
      lineGradFrom: '#00ffaa',
      lineGradTo: '#fff835',
      lineShadow: 'rgba(14, 16, 48, 0.4)',

      areaGradFrom: 'rgba(188, 92, 255, 0.5)',
      areaGradTo: 'rgba(188, 92, 255, 0)',
      shadowLineDarkBg: '#a695ff',
    },

    bubbleMap: {
      titleColor: '#ffffff',
      areaColor: '#2c2961',
      areaHoverColor: '#a1a1e5',
      areaBorderColor: '#654ddb',
    },

    profitBarAnimationEchart: {
      textColor: '#ffffff',

      firstAnimationBarColor: '#0088ff',
      secondAnimationBarColor: '#7659ff',

      splitLineStyleOpacity: '0.06',
      splitLineStyleWidth: '1',
      splitLineStyleColor: '#000000',

      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',
      tooltipFontSize: '16',
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipBorderColor: '#00d977',
      tooltipBorderWidth: '3',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 4px 16px;',
    },

    trafficBarEchart: {
      gradientFrom: '#fc0',
      gradientTo: '#ffa100',
      shadow: '#ffb600',
      shadowBlur: '5',

      axisTextColor: '#a1a1e5',
      axisFontSize: '12',

      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipBorderColor: '#00d977',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 4px 16px;',
      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',
    },

    countryOrders: {
      countryBorderColor: '#525dbd',
      countryFillColor: '#4f41a6',
      countryBorderWidth: '2',
      hoveredCountryBorderColor: '#00f9a6',
      hoveredCountryFillColor: '#377aa7',
      hoveredCountryBorderWidth: '3',

      chartAxisLineColor: 'rgba(161, 161 ,229, 0.3)',
      chartAxisTextColor: '#a1a1e5',
      chartAxisFontSize: '16',
      chartGradientTo: '#00c7c7',
      chartGradientFrom: '#00d977',
      chartAxisSplitLine: 'rgba(161, 161 ,229, 0.2)',
      chartShadowBarColor: '#2f296b',

      chartLineBottomShadowColor: '#00977e',

      chartInnerLineColor: '#2f296b',
    },

    echarts: {
      bg: '#3d3780',
      textColor: '#ffffff',
      axisLineColor: '#a1a1e5',
      splitLineColor: '#342e73',
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: '#6a7985',
      areaOpacity: '1',
    },

    chartjs: {
      axisLineColor: '#a1a1e5',
      textColor: '#ffffff',
    },

    orders: {
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipLineColor: 'rgba(255, 255, 255, 0.1)',
      tooltipLineWidth: '1',
      tooltipBorderColor: '#00d977',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',
      tooltipFontSize: '20',

      axisLineColor: 'rgba(161, 161 ,229, 0.3)',
      axisFontSize: '16',
      axisTextColor: '#a1a1e5',
      yAxisSplitLine: 'rgba(161, 161 ,229, 0.2)',

      itemBorderColor: '#ffffff',
      lineStyle: 'solid',
      lineWidth: '4',

      // first line
      firstAreaGradFrom: 'rgba(78, 64, 164, 1)',
      firstAreaGradTo: 'rgba(78, 64, 164, 1)',
      firstShadowLineDarkBg: '#018dff',

      // second line
      secondLineGradFrom: '#00bece',
      secondLineGradTo: '#00da78',

      secondAreaGradFrom: 'rgba(38, 139, 145, 0.8)',
      secondAreaGradTo: 'rgba(38, 139, 145, 0.5)',
      secondShadowLineDarkBg: '#2c5a85',

      // third line
      thirdLineGradFrom: 'rgb(110, 0, 239)',
      thirdLineGradTo: 'rgb(156, 72, 255)',

      thirdAreaGradFrom: 'rgba(38, 139, 145, 0.8)',
      thirdAreaGradTo: 'rgba(38, 139, 145, 0.5)',
      thirdShadowLineDarkBg: '#2c5a85',

      // fourth line
      fourthLineGradFrom: 'rgba(38, 139, 145, 0.8)',
      fourthLineGradTo: 'rgba(38, 139, 145, 0.8)',

      fourthAreaGradFrom: 'rgb(139, 195, 74)',
      fourthAreaGradTo: 'rgb(139, 195, 74)',
      fourthShadowLineDarkBg: '#2c5a85',

      // fifth line
      fifthLineGradFrom: 'rgba(38, 139, 145, 0.8)',
      fifthLineGradTo: 'rgba(38, 139, 145, 0.8)',

      fifthAreaGradFrom: 'rgba(38, 139, 145, 0.8)',
      fifthAreaGradTo: 'rgba(38, 139, 145, 0.5)',
      fifthShadowLineDarkBg: '#2c5a85',

      // six line
      sixLineGradFrom: 'rgb(3, 160, 42)',
      sixLineGradTo: 'rgb(0, 255, 64)',

      // sixAreaGradFrom: 'rgba(38, 139, 145, 0.8)',
      // sixAreaGradTo: 'rgba(38, 139, 145, 0.5)',
      sixShadowLineDarkBg: '#018dff',

      // seventh line
      seventhLineGradFrom: 'rgb(1, 113, 103)',
      seventhLineGradTo: 'rgb(0, 150, 136)',

      seventhAreaGradFrom: 'rgba(38, 139, 145, 0.8)',
      seventhAreaGradTo: 'rgba(38, 139, 145, 0.5)',
      seventhShadowLineDarkBg: '#018dff',
    },

    profit: {
      bg: '#3d3780',
      textColor: '#ffffff',
      axisLineColor: '#a1a1e5',
      splitLineColor: '#342e73',
      areaOpacity: '1',

      axisFontSize: '16',
      axisTextColor: '#a1a1e5',

      // first bar
      firstLineGradFrom: '#00bece',
      firstLineGradTo: '#00da78',
      firstLineShadow: 'rgba(14, 16, 48, 0.4)',

      // second bar
      secondLineGradFrom: '#8069ff',
      secondLineGradTo: '#8357ff',
      secondLineShadow: 'rgba(14, 16, 48, 0.4)',

      // third bar
      thirdLineGradFrom: '#4e40a4',
      thirdLineGradTo: '#4e40a4',
      thirdLineShadow: 'rgba(14, 16, 48, 0.4)',
    },

    orderProfitLegend: {
      firstItem: 'linear-gradient(90deg, #00c7c7 0%, #00d977 100%)',
      secondItem: 'linear-gradient(90deg, #a454ff 0%, #7659ff 100%)',
      thirdItem: '#4e40a4',
      fourItem: '#a1a1e5',
      fiveItem: '#2c5a85',
      sixItem: '#00bece',
      sevenItem: '#ff894a',
      eightItem: '#ffcc10',
    },

    visitors: {
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipLineColor: 'rgba(255, 255, 255, 0.1)',
      tooltipLineWidth: '1',
      tooltipBorderColor: '#00d977',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',

      axisLineColor: 'rgba(161, 161 ,229, 0.3)',
      axisFontSize: '16',
      axisTextColor: '#a1a1e5',
      yAxisSplitLine: 'rgba(161, 161 ,229, 0.2)',

      itemBorderColor: '#ffffff',
      lineStyle: 'dotted',
      lineWidth: '6',
      lineGradFrom: '#ffffff',
      lineGradTo: '#ffffff',
      lineShadow: 'rgba(14, 16, 48, 0.4)',

      areaGradFrom: 'rgba(188, 92, 255, 1)',
      areaGradTo: 'rgba(188, 92, 255, 0.5)',
      shadowLineDarkBg: '#a695ff',

      innerLineStyle: 'solid',
      innerLineWidth: '1',

      innerAreaGradFrom: 'rgba(59, 165, 243, 1)',
      innerAreaGradTo: 'rgba(4, 133, 243 , 1)',
    },

    visitorsLegend: {
      firstIcon: 'linear-gradient(90deg, #0088ff 0%, #3dafff 100%)',
      secondIcon: 'linear-gradient(90deg, #a454ff 0%, #7659ff 100%)',
    },

    visitorsPie: {
      firstPieGradientLeft: '#7bff24',
      firstPieGradientRight: '#2ec7fe',
      firstPieShadowColor: '#19977E',
      firstPieRadius: ['70%', '90%'],

      secondPieGradientLeft: '#ff894a',
      secondPieGradientRight: '#ffcc10',
      secondPieShadowColor: '#cf7c1c',
      secondPieRadius: ['60%', '95%'],
      shadowOffsetX: '0',
      shadowOffsetY: '3',
    },

    visitorsPieLegend: {
      firstSection: 'linear-gradient(90deg, #ffcb17 0%, #ff874c 100%)',
      secondSection: 'linear-gradient(90deg, #00c7c7 0%, #00d977 100%)',
    },

    earningPie: {
      radius: ['65%', '100%'],
      center: ['50%', '50%'],

      fontSize: '22',

      firstPieGradientLeft: '#00d77f',
      firstPieGradientRight: '#00d77f',
      firstPieShadowColor: 'rgba(0, 0, 0, 0)',

      secondPieGradientLeft: '#7756f7',
      secondPieGradientRight: '#7756f7',
      secondPieShadowColor: 'rgba(0, 0, 0, 0)',

      thirdPieGradientLeft: '#ffca00',
      thirdPieGradientRight: '#ffca00',
      thirdPieShadowColor: 'rgba(0, 0, 0, 0)',
    },

    earningLine: {
      gradFrom: 'rgba(118, 89, 255, 0.4)',
      gradTo: 'rgba(164, 84, 255, 0.5)',

      tooltipTextColor: '#ffffff',
      tooltipFontWeight: 'normal',
      tooltipFontSize: '16',
      tooltipBg: 'rgba(0, 255, 170, 0.35)',
      tooltipBorderColor: '#00d977',
      tooltipBorderWidth: '3',
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 4px 16px;',
    },
  },
};
