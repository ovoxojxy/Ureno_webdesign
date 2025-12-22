/**
 * @param {string} operationId
 * @param {Function} pollFunction
 * @param {Object} options
 * @param {Functions} options.onProgress
 * @param {number} options.initialDelay
 * @param {number} options.maxDelay
 * @param {number} options.maxAttempts
 * @returns {Promise<Object>}
 */

export async function pollUntilComplete(
    operationId,
    pollFunction,
    options = {}
) {
    const {
        onProgress,
        initialDelay = 2000,
        maxDelay = 30000,
        maxAttempts = 100
    } = options;

    let attempt = 0;
    let delay = initialDelay;

    await new Promise(resolve => setTimeout(resolve, initialDelay));

    while (attempt < maxAttempts) {
        try {
            const operation = await pollFunction(operationId);

            if (onProgress) {
                onProgress(operation)
            }

            if (operation.done) {
                if (operation.error) {
                    throw new Error(`Operation failed: ${JSON.stringify(operation.error)}`);
                }
                console.log("✅ Operation completed:", operationId);
                return operation;
            }

            console.log(`⏳ Operation in progress (attempt ${attempt + 1}/${maxAttempts})...`);

            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, maxDelay);
            attempt++;
        } catch (error) {
            // If it's an operation error (operation.done = true but has error), throw it
            if (error.message && error.message.includes('Operation failed')) {
                throw error;
            }
            
            // For other errors, log and continue (might be transient network issue)
            console.error(`Polling error (attempt ${attempt + 1}):`, error);
            
            // Still wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            attempt++;
        }
    }

    throw new Error(`Operation did not complete within ${maxAttempts} attempts`);
}

/**
 * Helper function specifically for World Labs operations
 * Uses the pollOperation function from worldLabsService
 * @param {string} operationId - Operation ID
 * @param {Function} pollOperationFn - pollOperation function from worldLabsService
 * @param {Object} options - Polling options (same as pollUntilComplete)
 * @returns {Promise<Object>} Completed operation with world_id
 */
export async function pollWorldOperation(operationId, pollOperationFn, options = {}) {
    return pollUntilComplete(operationId, pollOperationFn, options);
}