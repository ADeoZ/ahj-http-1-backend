module.exports =  class Tickets {
  constructor() {
    this.tickets = [];

    this.tickets.push(
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
  }

  allTickets() {
    const ticketsShort = this.tickets.map(({
      id, name, status, created,
    }) => ({
      id, name, status, created,
    }));
    return ticketsShort;
  }

  ticketById(id) {
    return this.tickets.find((ticket) => ticket.id === +id);
  }

  createTicket(name, description) {
    const maxId = this.tickets.reduce((acc, curr) => (acc.id > curr.id ? acc.id : curr.id));
    this.tickets.push(
      {
        id: maxId + 1,
        name,
        description,
        status: 0,
        created: Date.now(),
      },
    );
  }

  deleteTicket(id) {
    const ticketIndex = this.tickets.findIndex((ticket) => ticket.id === id);
    this.tickets.splice(ticketIndex, 1);
  }

  changeStatus(id) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    ticket.status = 1 - ticket.status;
  }

  editTicket(id, name, description) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    ticket.name = name;
    ticket.description = description;
  }
}