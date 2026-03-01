import ActivityLog from '../models/ActivityLog.js';

export const requestLogger = async (req, res, next) => {
  const originalSend = res.send;

  res.send = async function(data) {
    try {
      if (req.user && req.path.startsWith('/api/')) {
        const logData = {
          user: req.user._id,
          action: `${req.method} ${req.path}`,
          entityType: req.body.entityType,
          entityId: req.body.entityId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          status: res.statusCode >= 400 ? 'failure' : 'success'
        };

        if (req.body && Object.keys(req.body).length > 0) {
          logData.changes = req.body;
        }

        ActivityLog.create(logData).catch(err => console.error('Error logging activity:', err));
      }
    } catch (error) {
      console.error('Logger error:', error);
    }

    originalSend.call(this, data);
  };

  next();
};
