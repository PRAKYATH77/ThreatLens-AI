const Alert = require('../../models/Alert');

const emitAndSaveAlert = async (alertData, io) => {
    try {
        // 1. Save the alert to MongoDB
        const newAlert = await Alert.create(alertData);
        
        // 2. Broadcast if IO is available
        if (io) {
            io.emit('newAlert', newAlert); 
            console.log(`[ALERT] ${newAlert.type} detected and broadcasted.`);
        } else {
            console.warn(`[ALERT] ${newAlert.type} saved to DB (WebSocket not available).`);
        }
        
        return newAlert;

    } catch (error) {
        console.error('Error saving or emitting alert:', error);
    }
};

module.exports = { emitAndSaveAlert };