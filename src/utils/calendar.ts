export function downloadGraduationCalendarEvent(): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Racheal Kache Graduation//Class of 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:racheal-kache-graduation-2026@invitation.local',
    'DTSTAMP:20261123T010000Z',
    'DTSTART:20261204T093000Z',
    'DTEND:20261204T163000Z',
    'SUMMARY:Racheal Kache — Intimate Graduation Celebration',
    'DESCRIPTION:Intimate family graduation celebration for Racheal Kache (B.Sc. in Software Engineering) following her morning matriculation. Join us at our private residence in Nairobi for homemade meals, drinks, heartfelt speeches, and family fun.',
    'LOCATION:Private Residence, PP8H+Q7V, Nairobi, Kenya',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Racheal-Kache-Graduation-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
