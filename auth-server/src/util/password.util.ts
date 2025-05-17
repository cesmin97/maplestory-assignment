/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

/**
 * 비밀번호 해싱
 *
 * @param password
 * @param saltRounds
 * @returns 해시된 비밀번호
 */
export const hashPassword = async (
  password: string,
  saltRounds = 10,
): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * 비밀번호 비교
 *
 * @param password
 * @param hashedPassword
 * @returns 일치 여부 (true || false)
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
