import { HelpDesk } from "@/types/helpDeskProps";

// Helper function to convert callDuration string to seconds
const parseCallDuration = (duration: string): number => {
  const hoursMatch = duration.match(/(\d+)hrs/);
  const minsMatch = duration.match(/(\d+)mins/);
  const secsMatch = duration.match(/(\d+)secs/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  const seconds = secsMatch ? parseInt(secsMatch[1], 10) : 0;

  return hours * 3600 + minutes * 60 + seconds;
};

// Helper function to convert seconds to hrs-mins-secs format and round off values to one decimal place
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const roundedHours = (hours + (minutes / 60) + (seconds / 3600)).toFixed(0);
  const roundedMinutes = ((hours * 60) + minutes + (seconds / 60)).toFixed(0);
  const roundedSeconds = (totalSeconds).toFixed(0);

  return `${roundedHours}hrs - ${roundedMinutes}mins - ${roundedSeconds}secs`;
};

export const processHelpDeskData = (data: HelpDesk[]) => {
  if (!data.length) return {};

  // Log the input data
  console.log("Input data:", data);

  // Filter out invalid callDurations and parse them to seconds
  const callDurations = data
    .map(d => {
      const duration = d.callDuration ? parseCallDuration(d.callDuration) : undefined;
      // Log each parsed callDuration
      console.log("Parsed callDuration in seconds:", duration);
      return duration;
    })
    .filter((d): d is number => d !== undefined);

  // Log the filtered callDurations
  console.log("Filtered callDurations:", callDurations);

  if (callDurations.length === 0) {
    console.warn("No valid callDurations found");
    return {};
  }

  const shortestCall = Math.min(...callDurations);
  const longestCall = Math.max(...callDurations);
  const totalTimeSpent = callDurations.reduce((a, b) => a + b, 0);
  const resolvedCount = data.filter(d => d.status === 'Resolved').length;
  const freshdeskCount = data.filter(d => d.status === 'FreshDesk').length;
  const totalTickets = data.length;



  return {
    shortestCall: formatDuration(shortestCall),
    longestCall: formatDuration(longestCall),
    totalTimeSpent: formatDuration(totalTimeSpent),
    averageTimeSpent: formatDuration(totalTimeSpent / totalTickets),
    resolvedPercentage: ((resolvedCount / totalTickets) * 100).toFixed(0),
    freshdeskPercentage: ((freshdeskCount / totalTickets) * 100).toFixed(0),

  };
};
