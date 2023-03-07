/* eslint-env node */
import process from 'node:process';
import path from 'path';

import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import staticServe from '@fastify/static'


import open, { Options as OpenOptions } from 'open';

import { getSubLogger } from "../shared/utils/log";

const log = getSubLogger({ context: 'dev-server' });

interface DevServerOptions {
    port?: number;
    browser?: 'Brave Browser';
    public: string;
}

const devServer = async (options: DevServerOptions) => {
    try {
        console.log('');
        console.log('------- ------- ------- ------- ------- -------');
        log.info('START', { options });

        const fastify = Fastify({
            // logger: true
        });

        await fastify.register(websocket, {
            // errorHandler: function (error, conn /* SocketStream */, req /* FastifyRequest */, reply /* FastifyReply */) {
            //     // Do stuff
            //     // destroy/close connection
            //     conn.destroy(error)
            // },
            options: {
                // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
                maxPayload: 1048576,
                // handle: (conn, req) => {
                //     conn.pipe(conn) // creates an echo server
                // },
                // verifyClient: function (info, next) {
                //     log.info(`verifyClient()`, { info });
                //
                //     if (info.req.headers['x-fastify-header'] !== 'fastify is awesome !') {
                //         return next(false) // the connection is not allowed
                //     }
                //     next(true) // the connection is allowed
                // }
            },
        });

        // web socket set up
        fastify.get('/ws', { websocket: true }, (connection, req) => {
            // Client connect
            log.info('Client connected');

            // Client message
            connection.socket.on('message', (message: any) => {
                log.info('client message', { message });
                connection.socket.send('hi from server');
            });
            // Client disconnect
            connection.socket.on('close', () => {
                log.info(`connection.socket.on('close')`, 'client disconnected');
            });
        });



        // fastify.get('/ws', { websocket: true }, (connection, request) => {
        //     // const sessionPromise = request.getSession(); // example async session getter, called synchronously to return a promise
        //
        //     log.info(`fastify.get('/ws/*'`);
        //
        //     // connection.socket.
        //     connection.socket.on('message', async (message: any) => {
        //         // const session = await sessionPromise();
        //         // do something with the message and session
        //
        //         // testing...
        //         log.info('connection.socket.on.message', { message });
        //         connection.socket.send('hi from server');
        //
        //     })
        // });


        await fastify.register(staticServe, {
            root: options.public,
        });





        // route(s)
        // fastify.get('/', (request, reply) => {
        //     reply.send({ hello: 'world' })
        // })

        // run server
        fastify.listen({ port: options?.port || 3000 }, (err, address) => {
            if (err) throw err
            log.info('server running');
            // Server is now listening on ${address}
            open(address, {
                app: {
                    name: options?.browser || open.apps.chrome,
                }
            });
        })

        process.on('beforeExit', (code) => {
            log.info('Process beforeExit event with code: ', {code});
        });

        process.on('exit', (code) => {
            log.info('Process exit event with code: ', {code});
            switch (code) {
                case 143:
                    log.silly('TODO:', 'on exit of process during a reload from', '[tsx] rerunning');
                    break;
            }
        });
        log.info('DONE');
    } catch (error) {
        log.error(error);
        throw error;
    }
};

export default devServer;
export type { DevServerOptions };
