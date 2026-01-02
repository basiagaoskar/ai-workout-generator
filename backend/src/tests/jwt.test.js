import { jest } from '@jest/globals';

jest.unstable_mockModule('jsonwebtoken', () => ({
	default: {
		sign: jest.fn(),
	},
}));

const { default: jwt } = await import('jsonwebtoken');
const { setJwtCookie, clearJwtCookie, generateToken } = await import('../utils/jwt.js');

describe('JWT Utilities', () => {
	let mockRes;

	beforeEach(() => {
		mockRes = {
			cookie: jest.fn(),
			clearCookie: jest.fn(),
		};
		jest.clearAllMocks();
	});

	test('generateToken should call jwt.sign with correct payload and secret', () => {
		const userId = 123;
		const fakeToken = 'abc.def.ghi';
		process.env.JWT_SECRET = 'test_secret';

		jwt.sign.mockReturnValue(fakeToken);

		const result = generateToken(userId);

		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId },
			'test_secret',
			{ expiresIn: '7d' }
		);
		expect(result).toBe(fakeToken);
	});

	test('setJwtCookie should set a cookie with correct parameters', () => {
		const token = 'fake-token-123';

		setJwtCookie(mockRes, token);

		expect(mockRes.cookie).toHaveBeenCalledWith(
			'jwt',
			token,
			expect.objectContaining({
				httpOnly: true,
				sameSite: 'strict',
				maxAge: expect.any(Number),
			})
		);
	});

	test('clearJwtCookie should clear the cookie', () => {
		clearJwtCookie(mockRes);

		expect(mockRes.clearCookie).toHaveBeenCalledWith(
			'jwt',
			expect.objectContaining({
				httpOnly: true,
			})
		);
	});
});