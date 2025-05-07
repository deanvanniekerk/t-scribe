import Bottleneck from 'bottleneck';

export const limiter = new Bottleneck({ id: 'scriber', minTime: 60000 / 9 });
