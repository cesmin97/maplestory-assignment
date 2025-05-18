/* eslint-disable prettier/prettier */

/**
 * UTC 시간에 9시간을 더해 KST 시간으로 변경
 * MongoDB가 시간대 설정을 지원하지 않아 직접 구현
 *
 * @param time
 * @returns
 */
export const toKstTime = (time: Date) => {
  return new Date(time.setHours(time.getHours() + 9));
};
