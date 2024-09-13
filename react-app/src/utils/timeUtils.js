// Converts relative time string to minutes for comparison
const parseRelativeTime = (relativeTime) => {
    const timeMapping = {
        min: 1,
        h: 60,
        d: 1440, 
        w: 10080, 
        m: 43830,
        y: 525960
    };
    const match = relativeTime.match(/^(\d+)([mhdw])$/);
    if (match) {
        const [, value, unit] = match;
        return parseInt(value) * timeMapping[unit];
    }
    // Ensure contacts with no messages are sorted at the bottom
    if (relativeTime === '') {
        return Infinity; 
    }
    return 0; 
};

// Parses a time string (e.g. 10:00 AM) into a Date object
const parseTime = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    const isPM = period === 'PM';
    const adjustedHours = isPM ? (hours % 12) + 12 : hours % 12;

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), adjustedHours, minutes);
};

// Formats a Date object into a relative time string (e.g. 1h, 1d, ...)
const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date); // Calculate the difference in milliseconds
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
        return `${diffInYears}y`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths}m`;
    } else if (diffInDays > 0) {
        return `${diffInDays}d`;
    } else if (diffInHours > 0) {
        return `${diffInHours}h`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}min`;
    } else {
        return 'now'; 
    }
};



// Formats a Date object into a time string (e.g. 10:00 AM)
const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;

    
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0'); 

    const period = isPM ? 'PM' : 'AM';

    return `${displayHours}:${displayMinutes} ${period}`;
};

export {parseRelativeTime, formatRelativeTime, formatTime};