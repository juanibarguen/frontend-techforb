export interface Indicator {
    unit1: number;
    unit2: number;
    unit3: number;
  }
  
  export interface Plant {
    id: number;
    country: string;
    countryCode: string;
    name: string;
    readings: number;
    mediumAlerts: number;
    redAlerts: number;
    disabledSensors: number;
    indicators: {
      temperatura: Indicator;
      presion: Indicator;
      viento: Indicator;
      niveles: Indicator;
      energia: Indicator;
      tension: Indicator;
      Monóxido_de_carbono: Indicator;
      Otros_gases: Indicator;
    };
  }
  