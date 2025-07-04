export function formatTime(minutes: number): string {
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes - mins) * 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeRange(timeStr: string): { start: string; end: string } | null {
  const match = timeStr.match(/(\d{1,2}:\d{2})\s*(?:AM|PM)?\s*(?:to|-)?\s*(\d{1,2}:\d{2})\s*(?:AM|PM)?/i);
  if (match) {
    return { start: match[1], end: match[2] };
  }
  return null;
}

export function generateTimeSlots(startTime: string, endTime: string, taskCount: number): string[] {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const totalMinutes = endMinutes - startMinutes;
  
  if (totalMinutes <= 0 || taskCount <= 0) return [];
  
  const slotDuration = Math.floor(totalMinutes / taskCount);
  const slots: string[] = [];
  
  for (let i = 0; i < taskCount; i++) {
    const slotStart = startMinutes + (i * slotDuration);
    const slotEnd = startMinutes + ((i + 1) * slotDuration);
    
    const startH = Math.floor(slotStart / 60);
    const startM = slotStart % 60;
    const endH = Math.floor(slotEnd / 60);
    const endM = slotEnd % 60;
    
    slots.push(`${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')} - ${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
  }
  
  return slots;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getThisWeekDates(): string[] {
  const today = new Date();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    week.push(date.toISOString().split('T')[0]);
  }
  return week;
}