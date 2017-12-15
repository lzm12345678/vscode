import { UserStatePipe } from './user-state.pipe';

describe('UserStatePipe', () => {
  it('create an instance', () => {
    const pipe = new UserStatePipe();
    expect(pipe).toBeTruthy();
  });
});
