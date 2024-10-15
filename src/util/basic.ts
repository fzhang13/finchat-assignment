export function hasLatestEarningsTranscriptBeenPublished(
  transcripts: [number, number, string][]
): boolean {
  // Get the current date and time
  const currentDate = new Date();

  // Extract the latest earnings transcript date from the array
  let latestTranscriptDateStr = transcripts[0][2];

  // Check if the latest transcript date is in the future, if so, use the next one
  if (
    new Date(latestTranscriptDateStr) > currentDate &&
    transcripts.length > 1
  ) {
    latestTranscriptDateStr = transcripts[1][2];
  }

  // Parse the date string into a Date object
  const latestTranscriptDate = new Date(latestTranscriptDateStr);

  // Compare the current date with the parsed date
  return currentDate >= latestTranscriptDate;
}
