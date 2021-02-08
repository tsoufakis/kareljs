const server = require('../src/server');

test('Process exits if mongo connection times out', () => {
    console.log('starting test');
    const mockExit = jest.spyOn(server.process, 'exit').mockImplementation(() => {});
    const app = server.createApp({
        mongodb_uri: 'mongodb://fakedb:27017/molemarch',
        mongoConnTimeoutMS: 1000
    });
    expect(mockExit).toHaveBeenCalled();
});