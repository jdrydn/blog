// Lambda Web Function entry file, copied next to the standalone `server.js` when packaging.
// Next.js reads HOSTNAME & PORT, so set them from Lambda's `host:port` before starting the server.
const [host, port] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT ?? 'localhost:3000').split(':');
process.env.HOSTNAME = host;
process.env.PORT = port;

require('./server.js');
