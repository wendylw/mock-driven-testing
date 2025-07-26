/**
 * Authentication & Authorization API Routes
 * Handles employee login, PIN verification, permissions, and session management
 */

const express = require('express');
const crypto = require('crypto');

module.exports = (stateManager, config) => {
  const router = express.Router();

  // Helper functions
  const generateToken = (employee) => {
    const payload = {
      id: employee.id,
      email: employee.email,
      storeId: employee.storeId,
      role: employee.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 hours
    };
    
    // Simple base64 encoding for mock token
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  };

  const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  };

  const generateSalt = () => {
    return crypto.randomBytes(32).toString('hex');
  };

  const validatePin = (pin, hashedPin, salt) => {
    return hashPassword(pin, salt) === hashedPin;
  };

  // Employee login with email/password
  router.post('/login', async (req, res) => {
    try {
      const { email, password, storeId, registerId } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing credentials',
          message: 'Email and password are required'
        });
      }

      // Find employee
      const employees = await stateManager.query('employees', {
        where: { email: email.toLowerCase(), active: true }
      });

      if (employees.length === 0) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Employee not found or inactive'
        });
      }

      const employee = employees[0];

      // Validate password
      if (!validatePin(password, employee.passwordHash, employee.salt)) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Incorrect password'
        });
      }

      // Check store access
      if (storeId && employee.allowedStores && !employee.allowedStores.includes(storeId)) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'Employee does not have access to this store'
        });
      }

      // Generate token
      const token = generateToken(employee);

      // Create session
      const session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employee.id,
        storeId: storeId || employee.defaultStoreId,
        registerId: registerId || null,
        token,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        active: true
      };

      await stateManager.create('sessions', session);

      // Update last login
      await stateManager.update('employees', employee.id, {
        lastLogin: new Date().toISOString(),
        loginCount: (employee.loginCount || 0) + 1
      });

      // Response without sensitive data
      const response = {
        success: true,
        data: {
          token,
          employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            storeId: session.storeId,
            registerId: session.registerId,
            permissions: employee.permissions || [],
            profileImage: employee.profileImage
          },
          session: {
            id: session.id,
            loginTime: session.loginTime,
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
          }
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login'
      });
    }
  });

  // PIN-based login (for quick access)
  router.post('/pin', async (req, res) => {
    try {
      const { pin, storeId, registerId } = req.body;

      if (!pin || !storeId) {
        return res.status(400).json({
          error: 'Missing credentials',
          message: 'PIN and store ID are required'
        });
      }

      // Find employee by PIN and store
      const employees = await stateManager.query('employees', {
        where: { 
          storeId,
          active: true,
          pinEnabled: true
        }
      });

      let authenticatedEmployee = null;
      for (const employee of employees) {
        if (employee.pinHash && validatePin(pin, employee.pinHash, employee.pinSalt)) {
          authenticatedEmployee = employee;
          break;
        }
      }

      if (!authenticatedEmployee) {
        return res.status(401).json({
          error: 'Invalid PIN',
          message: 'PIN not found or incorrect'
        });
      }

      // Generate token and create session
      const token = generateToken(authenticatedEmployee);
      const session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId: authenticatedEmployee.id,
        storeId,
        registerId: registerId || null,
        token,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        loginMethod: 'pin',
        ipAddress: req.ip,
        active: true
      };

      await stateManager.create('sessions', session);

      res.json({
        success: true,
        data: {
          token,
          employee: {
            id: authenticatedEmployee.id,
            name: authenticatedEmployee.name,
            role: authenticatedEmployee.role,
            storeId,
            registerId: session.registerId,
            permissions: authenticatedEmployee.permissions || []
          },
          session: {
            id: session.id,
            loginTime: session.loginTime
          }
        }
      });

    } catch (error) {
      console.error('PIN login error:', error);
      res.status(500).json({
        error: 'PIN login failed',
        message: 'An error occurred during PIN authentication'
      });
    }
  });

  // Logout
  router.post('/logout', async (req, res) => {
    try {
      const token = req.authToken;

      if (token) {
        // Find and deactivate session
        const sessions = await stateManager.query('sessions', {
          where: { token, active: true }
        });

        if (sessions.length > 0) {
          await stateManager.update('sessions', sessions[0].id, {
            active: false,
            logoutTime: new Date().toISOString()
          });
        }
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout'
      });
    }
  });

  // Refresh token
  router.post('/refresh', async (req, res) => {
    try {
      const token = req.authToken;

      if (!token) {
        return res.status(401).json({
          error: 'No token provided',
          message: 'Authentication token required'
        });
      }

      // Find active session
      const sessions = await stateManager.query('sessions', {
        where: { token, active: true }
      });

      if (sessions.length === 0) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Session not found or expired'
        });
      }

      const session = sessions[0];
      
      // Get employee data
      const employee = await stateManager.findById('employees', session.employeeId);
      if (!employee || !employee.active) {
        return res.status(401).json({
          error: 'Employee inactive',
          message: 'Employee account is inactive'
        });
      }

      // Generate new token
      const newToken = generateToken(employee);

      // Update session
      await stateManager.update('sessions', session.id, {
        token: newToken,
        lastActivity: new Date().toISOString()
      });

      res.json({
        success: true,
        data: {
          token: newToken,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        error: 'Token refresh failed',
        message: 'An error occurred during token refresh'
      });
    }
  });

  // Get current user info
  router.get('/me', async (req, res) => {
    try {
      const token = req.authToken;

      if (!token) {
        return res.status(401).json({
          error: 'No token provided',
          message: 'Authentication token required'
        });
      }

      // Find session and employee
      const sessions = await stateManager.query('sessions', {
        where: { token, active: true }
      });

      if (sessions.length === 0) {
        return res.status(401).json({
          error: 'Invalid session',
          message: 'Session not found or expired'
        });
      }

      const session = sessions[0];
      const employee = await stateManager.findById('employees', session.employeeId);

      if (!employee || !employee.active) {
        return res.status(401).json({
          error: 'Employee inactive',
          message: 'Employee account is inactive'
        });
      }

      res.json({
        success: true,
        data: {
          employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            storeId: session.storeId,
            registerId: session.registerId,
            permissions: employee.permissions || [],
            profileImage: employee.profileImage,
            preferences: employee.preferences || {}
          },
          session: {
            id: session.id,
            loginTime: session.loginTime,
            lastActivity: session.lastActivity
          }
        }
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Failed to get user info',
        message: 'An error occurred while fetching user information'
      });
    }
  });

  // Get user permissions
  router.get('/permissions', async (req, res) => {
    try {
      const token = req.authToken;
      const { storeId } = req.query;

      if (!token) {
        return res.status(401).json({
          error: 'No token provided',
          message: 'Authentication token required'
        });
      }

      // Find session and employee
      const sessions = await stateManager.query('sessions', {
        where: { token, active: true }
      });

      if (sessions.length === 0) {
        return res.status(401).json({
          error: 'Invalid session'
        });
      }

      const session = sessions[0];
      const employee = await stateManager.findById('employees', session.employeeId);

      if (!employee || !employee.active) {
        return res.status(401).json({
          error: 'Employee inactive'
        });
      }

      // Get role-based permissions
      const role = await stateManager.findById('roles', employee.roleId);
      const rolePermissions = role ? role.permissions || [] : [];

      // Combine with individual permissions
      const allPermissions = [
        ...rolePermissions,
        ...(employee.permissions || [])
      ];

      // Remove duplicates
      const uniquePermissions = [...new Set(allPermissions)];

      res.json({
        success: true,
        data: {
          permissions: uniquePermissions,
          role: employee.role,
          storeAccess: employee.allowedStores || []
        }
      });

    } catch (error) {
      console.error('Get permissions error:', error);
      res.status(500).json({
        error: 'Failed to get permissions',
        message: 'An error occurred while fetching permissions'
      });
    }
  });

  // Verify manager PIN for elevated operations
  router.post('/verify-manager-pin', async (req, res) => {
    try {
      const { pin, storeId } = req.body;

      if (!pin || !storeId) {
        return res.status(400).json({
          error: 'Missing data',
          message: 'PIN and store ID are required'
        });
      }

      // Find managers with PIN access
      const managers = await stateManager.query('employees', {
        where: { 
          storeId,
          role: { $in: ['manager', 'assistant_manager'] },
          active: true,
          pinEnabled: true
        }
      });

      let validManager = null;
      for (const manager of managers) {
        if (manager.pinHash && validatePin(pin, manager.pinHash, manager.pinSalt)) {
          validManager = manager;
          break;
        }
      }

      if (!validManager) {
        return res.status(401).json({
          error: 'Invalid manager PIN',
          message: 'PIN not found or incorrect'
        });
      }

      // Create temporary elevated session
      const elevatedSession = {
        id: `elevated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        managerId: validManager.id,
        storeId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        permissions: ['manager.override', 'manager.void', 'manager.discount', 'manager.refund']
      };

      await stateManager.create('elevated_sessions', elevatedSession);

      res.json({
        success: true,
        data: {
          sessionId: elevatedSession.id,
          manager: {
            id: validManager.id,
            name: validManager.name,
            role: validManager.role
          },
          permissions: elevatedSession.permissions,
          expiresAt: elevatedSession.expiresAt
        }
      });

    } catch (error) {
      console.error('Manager PIN verification error:', error);
      res.status(500).json({
        error: 'Verification failed',
        message: 'An error occurred during manager PIN verification'
      });
    }
  });

  // Change password
  router.post('/change-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.authToken;

      if (!token) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Missing passwords',
          message: 'Current and new passwords are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Password too short',
          message: 'Password must be at least 6 characters long'
        });
      }

      // Find session and employee
      const sessions = await stateManager.query('sessions', {
        where: { token, active: true }
      });

      if (sessions.length === 0) {
        return res.status(401).json({
          error: 'Invalid session'
        });
      }

      const employee = await stateManager.findById('employees', sessions[0].employeeId);

      if (!employee) {
        return res.status(401).json({
          error: 'Employee not found'
        });
      }

      // Verify current password
      if (!validatePin(currentPassword, employee.passwordHash, employee.salt)) {
        return res.status(401).json({
          error: 'Invalid current password'
        });
      }

      // Generate new password hash
      const newSalt = generateSalt();
      const newPasswordHash = hashPassword(newPassword, newSalt);

      // Update employee
      await stateManager.update('employees', employee.id, {
        passwordHash: newPasswordHash,
        salt: newSalt,
        passwordChangedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Password change failed',
        message: 'An error occurred while changing password'
      });
    }
  });

  // Get available roles
  router.get('/roles', async (req, res) => {
    try {
      const roles = await stateManager.getAll('roles');
      
      res.json({
        success: true,
        data: roles.map(role => ({
          id: role.id,
          name: role.name,
          displayName: role.displayName,
          description: role.description,
          level: role.level,
          permissions: role.permissions || []
        }))
      });

    } catch (error) {
      console.error('Get roles error:', error);
      res.status(500).json({
        error: 'Failed to get roles',
        message: 'An error occurred while fetching roles'
      });
    }
  });

  return router;
};