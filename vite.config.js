import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiMiddleware = async (req, res, next) => {
  if (req.url && req.url.startsWith('/api/')) {
    const pathname = req.url.split('?')[0];
    let handlerModule = null;

    // M-Pesa Endpoints
    if (pathname === '/api/mpesa/stkpush') {
      handlerModule = await import('./api/mpesa/stkpush.js');
    } else if (pathname === '/api/mpesa/query') {
      handlerModule = await import('./api/mpesa/query.js');
    } else if (pathname === '/api/mpesa/callback') {
      handlerModule = await import('./api/mpesa/callback.js');
    } 
    // Auth Endpoints
    else if (pathname === '/api/auth/login') {
      handlerModule = await import('./api/auth/login.js');
    } else if (pathname === '/api/auth/verify') {
      handlerModule = await import('./api/auth/verify.js');
    } 
    // Products Endpoints
    else if (pathname === '/api/products' || pathname === '/api/products/') {
      handlerModule = await import('./api/products/index.js');
    } else if (pathname === '/api/products/item') {
      handlerModule = await import('./api/products/item.js');
    } else if (pathname === '/api/products/order') {
      handlerModule = await import('./api/products/order.js');
    } 
    // Upload Endpoints
    else if (pathname === '/api/upload' || pathname === '/api/upload/') {
      handlerModule = await import('./api/upload/index.js');
    }
    // Customer Account Endpoints
    else if (pathname === '/api/customer/register') {
      handlerModule = await import('./api/customer/register.js');
    } else if (pathname === '/api/customer/login') {
      handlerModule = await import('./api/customer/login.js');
    } else if (pathname === '/api/customer/orders' || pathname === '/api/checkout') {
      handlerModule = await import('./api/customer/orders.js');
    } else if (pathname === '/api/customer/profile') {
      handlerModule = await import('./api/customer/profile.js');
    }
    // Admin Endpoints
    else if (pathname === '/api/admin/orders') {
      handlerModule = await import('./api/admin/orders.js');
    }

    if (handlerModule && handlerModule.default) {
      let body = {};
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawData = Buffer.concat(buffers).toString();
        try {
          body = rawData ? JSON.parse(rawData) : {};
        } catch (e) {
          body = {};
        }
      }
      req.body = body;

      const urlObj = new URL(req.url, 'http://localhost');
      req.query = Object.fromEntries(urlObj.searchParams);

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };

      return handlerModule.default(req, res);
    }
  }
  next();
};

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(apiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), apiDevServerPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
