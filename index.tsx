import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Data ---

const CLUB_INSTAGRAMS = [
  "https://www.instagram.com/ubcpmc/",
  "https://www.instagram.com/ubcwics/",
  "https://www.instagram.com/ubcaiclub/",
  "https://www.instagram.com/ams_ubc/",
  "https://www.instagram.com/amsevents_/",
  "https://www.instagram.com/ubc_studentlife/",
  "https://www.instagram.com/ubcgss/",
  "https://www.instagram.com/cusubc/",
  "https://www.instagram.com/ubcbsu/",
  "https://www.instagram.com/recovery_ubc/",
  "https://www.instagram.com/ubc.cvc/",
  "https://www.instagram.com/ubcaccounting/",
  "https://www.instagram.com/ubctenniscircle/",
  "https://www.instagram.com/ubcvolleyballclub/",
  "https://www.instagram.com/ubcvoc/",
  "https://www.instagram.com/ubcsc/",
  "https://www.instagram.com/ubcskiandboard/",
  "https://www.instagram.com/ubcclimbingclub/",
  "https://www.instagram.com/ubcrunningclub/",
  "https://www.instagram.com/ubcknitandsew/",
  "https://www.instagram.com/ubcphotosoc/",
  "https://www.instagram.com/ubcbhangraclub/",
  "https://www.instagram.com/ubcbhangra/",
  "https://www.instagram.com/ubcxisc/",
  "https://www.instagram.com/ubcplayersclub/",
  "https://www.instagram.com/ubcsurfclub/",
  "https://www.instagram.com/ams_nest/",
  "https://www.instagram.com/ubcelectronica/",
  "https://www.instagram.com/ubcsailing/",
  "https://www.instagram.com/ubcdebate/",
  "https://www.instagram.com/ubcpremedsociety/",
  "https://www.instagram.com/ubcsmcc/",
  "https://www.instagram.com/ubc.fa/",
  "https://www.instagram.com/ubcma/",
  "https://www.instagram.com/ywibubc/",
  "https://www.instagram.com/ubcopenrobotics/",
  "https://www.instagram.com/ubcsubbots/",
  "https://www.instagram.com/ubcrover/",
  "https://www.instagram.com/ubcagrobot/",
  "https://www.instagram.com/ubctradinggroup/",
  "https://www.instagram.com/ubcconsulting/",
  "https://www.instagram.com/ubc_sci/",
  "https://www.instagram.com/enactusubc/",
  "https://www.instagram.com/ubcmun/",
  "https://www.instagram.com/ubcmunsa/",
  "https://www.instagram.com/ubcstartups/",
  "https://www.instagram.com/ewb_ubc/",
  "https://www.instagram.com/ubclifting/",
  "https://www.instagram.com/ubctabletennisclub/",
  "https://www.instagram.com/ubcdanceclub/"
];

// --- Types ---

interface EventData {
  title: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
  link?: string;
  instagramLink?: string;
  isRealEvent: boolean; // Distinguish confirmed specific dates from general info
  category: 'Event' | 'Deadline' | 'Spotlight'; // Added to distinguish types
}

// --- Components ---

const Header = () => (
  <header className="ubc-blue text-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-xl font-bold tracking-tight">UBC Event Scout</span>
      </div>
      <div className="text-sm font-medium text-yellow-400">Beta</div>
    </div>
  </header>
);

const Hero = ({ onSearch, loading }: { onSearch: (query: string) => void, loading: boolean }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <div className="relative overflow-hidden bg-white border-b border-gray-200">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#002145_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold ubc-blue-text mb-6">
          Find Real UBC Club Events & Deadlines
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We scan <span className="font-semibold text-[#002145]">50+ Top UBC Club Instagrams</span> to find upcoming events, recruitment deadlines, and opportunities for you.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., Robotics, Hiring, Dance, Socials"
            className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-[#002145] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'ubc-blue hover:bg-blue-900'}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span>Try:</span>
          <button onClick={() => onSearch("Tech & Coding")} className="hover:text-blue-700 underline">Tech & Coding</button>
          <button onClick={() => onSearch("Hiring & Executives")} className="hover:text-blue-700 underline">Hiring & Execs</button>
          <button onClick={() => onSearch("Business & Finance")} className="hover:text-blue-700 underline">Business</button>
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: EventData }> = ({ event }) => {
  // Extract day and month for the date badge
  let day = "—";
  let month = "—";
  let isDateValid = false;
  
  if (event.date && event.date.toLowerCase() !== "check instagram" && event.date.toLowerCase() !== "tbd") {
     const dateObj = new Date(event.date);
     if (!isNaN(dateObj.getTime())) {
        day = dateObj.getDate().toString();
        month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
        isDateValid = true;
     } else {
        // Fallback parsing for fuzzy dates returned by AI
        const parts = event.date.split(' ');
        if (parts.length > 0) {
            const possibleMonth = parts[0].substring(0, 3).toUpperCase();
            if (['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].includes(possibleMonth)) {
                month = possibleMonth;
                day = parts[1] ? parts[1].replace(',', '') : day;
                isDateValid = true;
            }
        }
     }
  }

  // Determine styles based on category
  const isDeadline = event.category === 'Deadline';
  const isSpotlight = event.category === 'Spotlight';
  
  let borderColor = 'border-gray-100';
  let badgeColor = 'bg-blue-50 text-blue-800';
  let dateBoxColor = isDateValid ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200';
  let dateTextColor = 'text-[#002145]';

  if (isDeadline) {
      borderColor = 'border-red-200';
      badgeColor = 'bg-red-50 text-red-800';
      dateBoxColor = 'bg-red-50 border-red-200 shadow-sm';
      dateTextColor = 'text-red-700';
  } else if (event.isRealEvent) {
      borderColor = 'border-blue-200';
  }

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${borderColor} flex flex-col h-full transform hover:-translate-y-1`}>
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${badgeColor}`}>
                    {event.clubName}
                </span>
                {isDeadline && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        DEADLINE
                    </span>
                )}
                {!isDeadline && event.isRealEvent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        Confirmed
                    </span>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#002145] transition-colors">
              {event.title}
            </h3>
          </div>
          <div className={`flex-shrink-0 ml-4 flex flex-col items-center justify-center border rounded-lg w-14 h-14 text-center ${dateBoxColor}`}>
            {isDateValid ? (
                <>
                    <span className={`text-xs font-bold uppercase ${isDeadline ? 'text-red-500' : 'text-gray-500'}`}>{isDeadline ? 'DUE' : month}</span>
                    <span className={`text-xl font-bold ${dateTextColor}`}>{day}</span>
                </>
            ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500 mb-6">
          {!isSpotlight && (
             <div className="flex items-center">
                <svg className={`w-4 h-4 mr-2 ${isDeadline ? 'text-red-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className={!event.isRealEvent ? "italic text-gray-400" : ""}>{event.time}</span>
            </div>
          )}
          <div className="flex items-center">
            <svg className={`w-4 h-4 mr-2 ${isDeadline ? 'text-red-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className={!event.isRealEvent ? "italic text-gray-400" : ""}>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
            {event.tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                #{tag}
            </span>
            ))}
        </div>
        <div className="flex gap-2">
            {event.instagramLink && (
                 <a href={event.instagramLink} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold flex items-center bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100 transition-colors ${isDeadline ? 'text-pink-700 hover:text-pink-900 hover:border-pink-300' : 'text-pink-600 hover:text-pink-800 hover:border-pink-300'}`}>
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    {isDeadline ? 'Apply on Insta' : (event.isRealEvent ? 'See Post' : 'Check Instagram')}
                 </a>
            )}
            {event.link && (
                 <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                    Visit Site
                 </a>
            )}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-80">
    <div className="flex justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-14 w-14 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-gray-200 rounded"></div>
      <div className="h-6 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);

  const fetchEvents = async (query: string) => {
    setLoading(true);
    setCurrentQuery(query);
    setHasSearched(true);
    setEvents([]);
    setGroundingChunks([]);

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const formattedToday = today.toDateString();

    try {
      // The prompt is updated to explicitly look for application deadlines.
      const prompt = `
        Current Date: ${formattedToday}
        User Interest: "${query}"
        
        Source List (UBC Club Instagrams):
        ${JSON.stringify(CLUB_INSTAGRAMS)}
        
        TASK:
        1. FILTER: Identify 3-5 clubs from the Source List that are most relevant to "${query}".
        2. SEARCH: For each relevant club, use Google Search to find:
           a) Latest EVENTS (socials, workshops, meetings).
           b) Upcoming DEADLINES (hiring, recruitment, exec applications).
           
           Required Search Queries (perform these via the googleSearch tool):
           - "site:instagram.com ${query} UBC"
           - "{Selected Club Name} UBC events ${currentMonth} ${currentYear}"
           - "{Selected Club Name} UBC recruitment application deadline ${currentYear}"
        
        3. STRICT REALITY CHECK (Verification):
           - You MUST find a post/page describing a SPECIFIC event/deadline occurring AFTER ${formattedToday}.
           - If a search result is from 2023 or earlier, IGNORE IT.
           - If you find a date (e.g., "Due Nov 25th"), verify it is in the future relative to ${formattedToday}.
           
        4. CLASSIFICATION:
           - If it is an application deadline (e.g., "Hiring Execs", "Recruitment"), set 'category' to 'Deadline'.
           - If it is a standard event, set 'category' to 'Event'.
           - If NO specific future date is found, set 'category' to 'Spotlight' and describe the club generally.
        
        Output strictly JSON array.
        
        JSON Structure:
        [
          {
            "title": "Event Name OR 'Hiring: [Role]'",
            "clubName": "Club Name",
            "category": "Event" | "Deadline" | "Spotlight",
            "date": "Specific Date (e.g. 'Oct 24') OR 'Check Instagram'",
            "time": "Time OR '11:59 PM' for deadlines OR 'TBD'",
            "location": "Location OR 'UBC'",
            "description": "Details about the event or role.",
            "tags": ["recruitment", "hiring", "social", "workshop"],
            "instagramLink": "The exact URL from Source List",
            "link": "Optional extra link found (e.g. Linktree)",
            "isRealEvent": true/false (true ONLY if you found a specific date/time)
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      if (response.text) {
        let cleanText = response.text.trim();
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
        
        try {
            const data = JSON.parse(cleanText);
            setEvents(data);
        } catch (e) {
            console.error("Failed to parse JSON:", e);
        }

        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            setGroundingChunks(response.candidates[0].groundingMetadata.groundingChunks);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow">
        <Hero onSearch={fetchEvents} loading={loading} />

        <div className="container mx-auto px-4 py-12">
          {hasSearched && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold ubc-blue-text mb-4">
                {loading ? `Scanning relevant events for "${currentQuery}"...` : `Results for "${currentQuery}"`}
              </h2>
              
              {!loading && groundingChunks.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-2">Verified Sources</p>
                    <div className="flex flex-wrap gap-2">
                        {groundingChunks.map((chunk, idx) => {
                            if (chunk.web?.uri) {
                                return (
                                    <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" 
                                    className="text-xs flex items-center bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors truncate max-w-xs">
                                        <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                                        <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))
              ) : (
                hasSearched && (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-lg text-gray-600 mb-2">We couldn't find specific upcoming events for that interest right now.</p>
                    <p className="text-sm text-gray-500">Try searching for a broader category or check back later.</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} UBC Event Scout. Powered by Google Gemini Search Grounding.</p>
          <p className="text-xs">Not officially affiliated with the University of British Columbia.</p>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);