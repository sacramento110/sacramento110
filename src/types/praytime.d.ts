declare module 'praytime' {
  export class PrayTime {
    constructor(method?: string);
    getTimes(date: Date, location: number[], timezone: number): any;
    method(method: string): void;
    location(coordinates: number[]): void;
    timezone(timezone: string): void;
    utcOffset(offset: number): void;
  }
  
  const PrayTime: any;
  export default PrayTime;
}
