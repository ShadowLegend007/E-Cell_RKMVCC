import Papa from 'papaparse';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
}

export interface TeamGroup {
  name: string;
  members: TeamMember[];
}

export const LEADER: TeamMember = {
  id: 'leader',
  name: 'Soumalya Pahari',
  role: 'Leader',
  avatarUrl: '/team/soumalya.jpg',
  linkedin: '#',
  instagram: '#',
};

export const CO_LEADER: TeamMember = {
  id: 'co-leader',
  name: 'Sankha Ghosh',
  role: 'Co-Leader',
  avatarUrl: '/team/sankha.jpg',
  linkedin: '#',
  instagram: '#',
};

export const MANAGEMENT_HEAD: TeamMember = {
  id: 'management',
  name: 'Rajdeep Pal',
  role: 'Management Head',
  avatarUrl: '/team/rajdeep.jpg',
  linkedin: '#',
  instagram: '#',
};

export const SUB_TEAMS: TeamGroup[] = [
  {
    name: 'Social Media Handling & Public Relations',
    members: [
      {
        id: 'sm1',
        name: 'Surajit Mandal',
        role: 'Member',
        avatarUrl: '/team/surajit.jpg',
        linkedin: '#',
        instagram: '#',
      },
      {
        id: 'sm2',
        name: 'Subhodeep Mondal',
        role: 'Member',
        avatarUrl: '/team/subhodeep.jpg',
        linkedin: '#',
        instagram: '#',
      },
    ],
  },
  {
    name: 'Photography & Editing Team',
    members: [
      {
        id: 'pe1',
        name: 'Abhradeep Ghosh',
        role: 'Member',
        avatarUrl: '/team/abhradeep.jpg',
        linkedin: '#',
        instagram: '#',
      },
      {
        id: 'pe2',
        name: 'Palash Pal',
        role: 'Member',
        avatarUrl: '/team/palash.jpg',
        linkedin: '#',
        instagram: '#',
      },
      {
        id: 'pe3',
        name: 'Avishek Das',
        role: 'Member',
        avatarUrl: '/team/avishek.jpg',
        linkedin: '#',
        instagram: '#',
      },
    ],
  },
  {
    name: 'Web Development & Management',
    members: [
      {
        id: 'wd1',
        name: 'Subhodeep Mondal',
        role: 'Member',
        avatarUrl: '/team/subhodeep.jpg',
        linkedin: '#',
        instagram: '#',
      },
      {
        id: 'wd2',
        name: 'Rahul Roy',
        role: 'Member',
        avatarUrl: '/team/rahul.jpg',
        linkedin: '#',
        instagram: '#',
      },
    ],
  },
  {
    name: 'Content Writer',
    members: [
      {
        id: 'cw1',
        name: 'Toulik Ghosh',
        role: 'Member',
        avatarUrl: '/team/toulik.jpg',
        linkedin: '#',
        instagram: '#',
      },
      {
        id: 'cw2',
        name: 'Dhrubajyoti Roy',
        role: 'Member',
        avatarUrl: '/team/dhrubajyoti.jpg',
        linkedin: '#',
        instagram: '#',
      },
    ],
  },
];

export interface TeamData {
  leader: TeamMember;
  coLeader: TeamMember;
  management: TeamMember;
  subTeams: TeamGroup[];
}

export const fetchTeamData = async (): Promise<TeamData> => {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1pNUBHkEfGBUEes0P04XSa-_vuyvxQ1B0xt9QoBlqUy8/export?format=csv';
  
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as any[];
          
          let leader = LEADER;
          let coLeader = CO_LEADER;
          let management = MANAGEMENT_HEAD;
          const subTeamsMap = new Map<string, TeamMember[]>();
          
          const expectedTeams = ['Social Media Handling & Public Relations', 'Photography & Editing Team', 'Web Development & Management', 'Content Writer'];
          expectedTeams.forEach(t => subTeamsMap.set(t, []));

          rows.forEach((row, idx) => {
            const role = row['Role in Team']?.trim() || '';
            const name = row['Full Name']?.trim() || '';
            if (!name) return;

            const member: TeamMember = {
              id: `live_${idx}`,
              name: name,
              role: role,
              avatarUrl: '/team/' + name.split(' ')[0].toLowerCase() + '.jpg',
              linkedin: row['LinkedIn Profile URL']?.trim(),
              instagram: row['Instagram Handle']?.trim(),
              portfolio: row['Portfolio Link (If not valid, write NA)']?.trim()
            };
            
            if (role === 'Leader') {
              leader = member;
            } else if (role === 'Co-Leader') {
              coLeader = member;
            } else if (role === 'Management Head' || name.toLowerCase() === 'rajdeep pal') {
              management = { ...member, role: 'Management Head' };
            } else {
              const roleLower = role.toLowerCase();
              if (roleLower.includes('social media')) {
                subTeamsMap.get('Social Media Handling & Public Relations')?.push({...member, role: 'Member'});
              } 
              if (roleLower.includes('web development')) {
                subTeamsMap.get('Web Development & Management')?.push({...member, role: 'Member'});
              }
              if (roleLower.includes('video editing') || roleLower.includes('photography') || roleLower.includes('graphics')) {
                subTeamsMap.get('Photography & Editing Team')?.push({...member, role: 'Member'});
              }
              if (roleLower.includes('content')) {
                subTeamsMap.get('Content Writer')?.push({...member, role: 'Member'});
              }
            }
          });
          
          const subTeams: TeamGroup[] = expectedTeams.map(name => ({
            name,
            members: subTeamsMap.get(name) || []
          }));

          resolve({ leader, coLeader, management, subTeams });
        },
        error: (err: any) => {
          console.error('Error parsing CSV', err);
          resolve({ leader: LEADER, coLeader: CO_LEADER, management: MANAGEMENT_HEAD, subTeams: SUB_TEAMS });
        }
      });
    });
  } catch (error) {
    console.error('Failed to fetch team data', error);
    return { leader: LEADER, coLeader: CO_LEADER, management: MANAGEMENT_HEAD, subTeams: SUB_TEAMS };
  }
};
