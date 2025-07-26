/**
 * Simple WebSocket Server for POS Mock
 */

const http = require('http');
const { Server } = require('socket.io');

class POSWebSocketServer {
  constructor(config = {}) {
    this.config = {
      port: config.port || 3001,
      cors: config.cors || { origin: "*" },
      ...config
    };
    
    this.server = null;
    this.io = null;
    this.stateManager = null;
    this.connections = new Map();
  }

  setStateManager(stateManager) {
    this.stateManager = stateManager;
  }

  async start() {
    try {
      this.server = http.createServer();
      this.io = new Server(this.server, {
        cors: this.config.cors
      });

      this.setupNamespaces();
      this.setupEventHandlers();

      await new Promise((resolve, reject) => {
        this.server.listen(this.config.port, (err) => {
          if (err) reject(err);
          else {
            console.log(`WebSocket server started on port ${this.config.port}`);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
      throw error;
    }
  }

  setupNamespaces() {
    // MRS - Multi-Register Sync
    const mrs = this.io.of('/mrs');
    mrs.on('connection', (socket) => {
      console.log('MRS client connected:', socket.id);
      socket.emit('mrs:connected', { timestamp: new Date().toISOString() });
    });

    // KDS - Kitchen Display System
    const kds = this.io.of('/kds');
    kds.on('connection', (socket) => {
      console.log('KDS client connected:', socket.id);
      socket.emit('kds:connected', { timestamp: new Date().toISOString() });
    });

    // NCS - Notification Center Service
    const ncs = this.io.of('/ncs');
    ncs.on('connection', (socket) => {
      console.log('NCS client connected:', socket.id);
      socket.emit('ncs:connected', { timestamp: new Date().toISOString() });
    });

    // CFD - Customer Facing Display
    const cfd = this.io.of('/cfd');
    cfd.on('connection', (socket) => {
      console.log('CFD client connected:', socket.id);
      socket.emit('cfd:connected', { timestamp: new Date().toISOString() });
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      this.connections.set(socket.id, socket);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.connections.delete(socket.id);
      });
    });
  }

  broadcast(event, data, namespace = null) {
    if (namespace) {
      this.io.of(`/${namespace}`).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }

  getStats() {
    return {
      totalConnections: this.connections.size,
      namespaces: ['mrs', 'kds', 'ncs', 'cfd']
    };
  }

  async stop() {
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
    }
  }
}

module.exports = POSWebSocketServer;