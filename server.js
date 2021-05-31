const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

// CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

// Body Parsers
app.use(koaBody({
  urlencoded: true,
}));

const tickets = [];

tickets.push(
  {
    id: 1,
    name: 'Поменять краску в принтере',
    description: 'Закончилась чёрная краска в белом принтере, надо срочно поменять, а то бухи не выдают зарплату',
    status: '0',
    created: '1622302072617',
  },
  {
    id: 2,
    name: 'Переустановить Windows',
    description: 'Менеджеры жалуются, что Windows 98 уже плохо поддерживает их приложения. Надо подумать об обновлении.',
    status: '0',
    created: '1622302072917',
  },
  {
    id: 3,
    name: 'Подключить роутер',
    description: 'После того, как на корпоративе финдир запутался в проводах роутера и вырвал их из сети, интернет не работает. А YouTube посмотреть хочется.',
    status: '1',
    created: '1622302073617',
  },
);

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  const { name, description, curid } = ctx.request.body;
  ctx.response.body = method;

  switch (method) {
    case 'allTickets': {
      const ticketsShort = tickets.map(({
        id, name, status, created,
      }) => ({
        id, name, status, created,
      }));
      ctx.response.body = ticketsShort;
      return;
    }
    case 'ticketById': {
      const ticketById = tickets.find((ticket) => ticket.id === +id);
      if (ticketById) {
        ctx.response.body = ticketById;
      } else {
        ctx.throw(404, 'Correct ticket ID required');
      }
      return;
    }
    case 'createTicket': {
      const maxId = tickets.reduce((acc, curr) => acc.id > curr.id ? acc.id : curr.id);
      tickets.push(
        {
          id: maxId + 1,
          name,
          description,
          status: 0,
          created: Date.now(),
        },
      );
      ctx.response.body = 'Ok';
      ctx.response.status = 200;
      return;
    }
    case 'removeTicket': {
      const ticketId = tickets.findIndex((ticket) => ticket.id === +curid);
      tickets.splice(ticketId, 1);
      ctx.response.body = 'Ok';
      ctx.response.status = 200;
      return;
    }
    case 'ticketStatus': {
      const ticket = tickets.find((ticket) => ticket.id === +curid);
      ticket.status = 1 - ticket.status;
      ctx.response.body = 'Ok';
      ctx.response.status = 200;
      return;
    }
    case 'editTicket': {
      const ticket = tickets.find((ticket) => ticket.id === +curid);
      ticket.name = name;
      ticket.description = description;
      ctx.response.body = 'Ok';
      ctx.response.status = 200;
      return;
    }
    default: {
      ctx.response.status = 404;
      return;
    }
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port)
