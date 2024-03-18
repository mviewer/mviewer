
/**
 * 
 * @param {string} name event
 * @param {object} content detail custom event
 */
export const dispatchNewEvent = (name, content) => {
    const mapReadyEvent = new CustomEvent(name, {
        detail: content,
    });
    document.dispatchEvent(mapReadyEvent);
}