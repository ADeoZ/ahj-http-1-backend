const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('koa2-cors');
const Tickets = require('./Tickets');

const app = new Koa();

// Body Parsers
app.use(koaBody({ json: true, text: true, urlencoded: true }));

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

const router = new Router();

const tickets = new Tickets();

router.get('/tickets', async (ctx) => {
  const { method } = ctx.request.query;
  if (method === 'allTickets') {
    ctx.response.body = tickets.allTickets();
  }

  if (method === 'ticketById') {
    const { id } = ctx.request.query;
    ctx.response.body = tickets.ticketById(id);
  }
});

router.post('/tickets', async (ctx) => {
  ctx.response.body = ctx.request.body;
  const { method } = ctx.request.query;
  if (method === 'createTicket') {
    const { name, description } = ctx.request.body;
    tickets.createTicket(name, description);
    ctx.response.status = 204;
  }
});

router.delete('/tickets/:id', async (ctx) => {
  const ticketId = Number(ctx.params.id);
  tickets.deleteTicket(ticketId);
  ctx.response.status = 204;
});

router.put('/tickets/:id', async (ctx) => {
  const ticketId = Number(ctx.params.id);
  const { name, description } = ctx.request.body;
  if (!name || !description) {
    tickets.changeStatus(ticketId);
  } else {
    tickets.editTicket(ticketId, name, description);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('Server started'));
