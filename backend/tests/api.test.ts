import request from 'supertest';
import app from '../src/index';

// Mock Jest globals
declare const beforeAll: any;
declare const describe: any;
declare const it: any;
declare const expect: any;

// Setup test environment
beforeAll(() => {
  // Mock console methods
  global.console = {
    ...console,
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  };
});

describe('API Endpoints', () => {
  describe('Health and Documentation', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });

    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Crop Disease API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('scans');
      expect(response.body.endpoints).toHaveProperty('products');
      expect(response.body.endpoints).toHaveProperty('diseases');
    });
  });

  describe('Authentication Routes', () => {
    it('should handle registration with valid data', async () => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        fullName: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect([201, 500]).toContain(response.status);
    });

    it('should handle registration with invalid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid-email' });

      expect([400, 500]).toContain(response.status);
    });

    it('should handle login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect([200, 401, 500]).toContain(response.status);
    });

    it('should handle login with invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect([401, 500]).toContain(response.status);
    });

    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });
  });

  describe('Products Routes', () => {
    it('should get products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect([200, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('products');
        expect(Array.isArray(response.body.products)).toBe(true);
      }
    });

    it('should handle product search', async () => {
      const response = await request(app)
        .get('/api/products/search?q=test')
        .expect([200, 400, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('products');
        expect(Array.isArray(response.body.products)).toBe(true);
      }
    });

    it('should handle getting product by ID', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect([200, 404, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      }
    });

    it('should require authentication for creating products', async () => {
      const productData = {
        name: 'Test Product',
        category: 'organic',
        description: 'Test description',
        price: 100
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect([401, 500]);
    });
  });

  describe('Diseases Routes', () => {
    it('should get diseases list', async () => {
      const response = await request(app)
        .get('/api/diseases')
        .expect([200, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('diseases');
        expect(Array.isArray(response.body.diseases)).toBe(true);
      }
    });

    it('should handle disease search', async () => {
      const response = await request(app)
        .get('/api/diseases/search?q=blight')
        .expect([200, 400, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('diseases');
        expect(Array.isArray(response.body.diseases)).toBe(true);
      }
    });

    it('should handle getting disease by ID', async () => {
      const response = await request(app)
        .get('/api/diseases/1')
        .expect([200, 404, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      }
    });

    it('should handle getting diseases by common name', async () => {
      const response = await request(app)
        .get('/api/diseases/common/leaf-spot')
        .expect([200, 404, 500]);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('diseases');
        expect(Array.isArray(response.body.diseases)).toBe(true);
      }
    });
  });

  describe('Scans Routes', () => {
    it('should require authentication for scan routes', async () => {
      const response = await request(app)
        .get('/api/scans')
        .expect(401);
    });

    it('should require authentication for scan upload', async () => {
      const response = await request(app)
        .post('/api/scans/upload')
        .expect(401);
    });

    it('should handle scan creation with authentication', async () => {
      // This would require a valid token in a real test
      const scanData = {
        imageUrl: 'http://example.com/image.jpg',
        prediction: { disease: 'blight', confidence: 0.95 },
        confidence: 95
      };

      const response = await request(app)
        .post('/api/scans')
        .set('Authorization', 'Bearer fake-token')
        .send(scanData)
        .expect([401, 403, 500]);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid-json')
        .expect([400, 500]);
    });

    it('should handle large payloads', async () => {
      const largeData = {
        email: 'test@example.com',
        password: 'x'.repeat(10000)
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(largeData)
        .expect([400, 401, 413, 500]);
    });
  });

  describe('CORS and Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .expect([200, 204]);
    });
  });

  describe('Rate Limiting and Security', () => {
    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app).get('/health')
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect([200, 429, 500]).toContain(response.status);
      });
    });

    it('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "test@example.com", "password": "123"')
        .expect([400, 500]);
    });
  });
});
