import { PortfolioData } from './types';

export const INITIAL_DATA: PortfolioData = {
  name: "Vinit Mevada",
  title: "Cyber Security Analyst | Penetration Tester",
  about: "A dedicated Penetration Tester specializing in offensive security. Skilled in identifying vulnerabilities, performing security assessments, and implementing solutions to strengthen systems. Passionate about ethical hacking, bug bounty hunting, and continuously learning the latest security techniques to stay ahead in the cybersecurity landscape.",
  location: "Bengaluru, India",
  availability: "Open to Work",
  systemStatus: "SYSTEM STATUS: ONLINE",
  // Initial placeholder - can be updated via the UI
  profileImage: "https://avatars.githubusercontent.com/u/211708191?v=4&color=fff&size=400",
  hallOfFameStyle: 'cyber',
  skills: [
    "Penetration Testing",
    "Network Security",
    "Python & Scripting",
    "Burp Suite",
    "Metasploit",
    "Linux Administration",
    "Vulnerability Assessment",
    "OWASP Top 10",
    "Wireshark",
    "SQL Injection Analysis"
  ],
  tools: [
    {
      id: "tool-1",
      name: "Burp Suite",
      logo: "https://imgs.search.brave.com/vh47b3T6-glQA5FIHMzIUe5UfgWbKOTsBrB8ogtfP6M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/a2FsaS5vcmcvdG9v/bHMvYnVycHN1aXRl/L2ltYWdlcy9idXJw/c3VpdGUtbG9nby5z/dmc"
    },
    {
      id: "tool-2",
      name: "Metasploit",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/Metasploit_logo_and_wordmark.png"
    },
    {
      id: "tool-3",
      name: "Wireshark",
      logo: "https://imgs.search.brave.com/6fl3XpvNGuh8nLzJjVXFEjHec_0qQ2px25siJEE50Vw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS44MTU4/NTM5MzMuOTIwMi9y/YWYsMzYweDM2MCww/NzUsdCxmYWZhZmE6/Y2E0NDNmNDc4Ni51/Mi5qcGc"
    },
    {
      id: "tool-4",
      name: "Kali Linux",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kali_Linux_2.0_wordmark.svg/500px-Kali_Linux_2.0_wordmark.svg.png"
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Cyber Security Internship",
      company: "Way2Reach",
      period: "Jul 2025 - Sep 2025",
      description: "Conducted OWASP ZAP scans and comprehensive vulnerability scanning to secure web applications. Identified critical flaws and provided remediation strategies.",
      logo: "https://way2reach.in/images/logo/white-logo.png"
    },
    {
      id: "exp-2",
      role: "Cyber Security Intern",
      company: "The Red Users",
      period: "May 2025 - May 2025",
      description: "Focused on Network Security and WebGoat exercises. Gained hands-on experience in identifying common web vulnerabilities and securing network perimeters.",
      logo: "https://imgs.search.brave.com/vdkTRHXQnsIaYoWyk0_UoHtIQX52ZLP8oxpthYY24sc/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvNGJiMWY5M2My/MDE5MjFmNzI5ZTIx/MWVmYmM1OGExMDIz/MWRkMTY3NWFjYjky/YjJlOTNiZThmYTNi/YTdlZGViMi90aGVy/ZWR1c2Vycy50ZWNo/Lw"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Automated Vulnerability Scanner",
      technologies: ["Bash", "Nmap", "Nikto"],
      description: "A shell script wrapper that automates the initial reconnaissance phase of penetration testing, generating a comprehensive HTML report of open ports and potential vulnerabilities.",
      link: "https://github.com/Vinit09-M/Vinit_Auto_Recon",
      logo: "https://avatars.githubusercontent.com/u/211708191?v=4"
    }
  ],
  hallOfFame: [
    {
      id: "hof-1",
      company: "NASA",
      logo: "https://imgs.search.brave.com/G7Pdv37Qk8BiVws0YjSL3z03dbKryOlz3fx_PHbYEW4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9l/L2U1L05BU0FfbG9n/by5zdmc",
      date: "2025"
    },
    {
      id: "hof-2",
      company: "Cisco Meraki",
      logo: "https://imgs.search.brave.com/HPrN0vfMpCJcdwjQuGCGcHxxSYH8embgm03ETsZHCRw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/d2lrLmNvbS9jb250/ZW50L3VwbG9hZHMv/aW1hZ2VzL2Npc2Nv/LW1lcmFraTI0ODYu/anBn",
      date: "2025"
    },
    {
      id: "hof-3",
      company: "New Balance",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/330px-New_Balance_logo.svg.png",
      date: "2025"
    },
    {
      id: "hof-4",
      company: "US GSA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/US-GeneralServicesAdministration-Logo.svg/330px-US-GeneralServicesAdministration-Logo.svg.png",
      date: "2025"
    },
    {
      id: "hof-5",
      company: "CMS",
      logo: "https://imgs.search.brave.com/A5g37vYNFNn7bg6-bmq9_FYPSSF6xKnCsEIOqaoWHpk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8yLzJhL0Nl/bnRlcnNfZm9yX01l/ZGljYXJlX2FuZF9N/ZWRpY2FpZF9TZXJ2/aWNlc19sb2dvLnN2/Zy8yNTBweC1DZW50/ZXJzX2Zvcl9NZWRp/Y2FyZV9hbmRfTWVk/aWNhaWRfU2Vydmlj/ZXNfbG9nby5zdmcu/cG5n",
      date: "2025"
    },
    {
      id: "hof-6",
      company: "Santos",
      logo: "https://imgs.search.brave.com/cZLnPJUVct3J3UZ-H4S2CQjuCZyPz50_NukZ3oEK9xc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/c2FudG9zLnN2Zw",
      date: "2025"
    },
    {
      id: "hof-7",
      company: "Interwell Health",
      logo: "https://imgs.search.brave.com/RTycDJpJbfaa7IENCmXHZtbdskib5mGdRRqnzLHqHr0/rs:fit:200:200:1:0/g:ce/aHR0cHM6Ly95dDMu/Z29vZ2xldXNlcmNv/bnRlbnQuY29tL3c3/MHd4QVNUMkUxTHFB/M0YxNjB0Wnh5OTJ6/T2FpeFQycXp5QjdS/Q29aYzZtdzQyanBr/UkRxTUJPbFB3dTB0/VlpBZ2N6NU5pMkRO/ST1zOTAwLWMtay1j/MHgwMGZmZmZmZi1u/by1yag",
      date: "2025"
    },
    {
      id: "hof-8",
      company: "Magnolia",
      logo: "https://docs.magnolia-cms.com/_/img/rebrand-logo-dark-new.png",
      date: "2025"
    },
    {
      id: "hof-9",
      company: "Tlu",
      logo: "https://www.tlu.ee/themes/tlu/logo.svg",
      date: "2025"
    },
    {
      id: "hof-10",
      company: "Voiceofgeereans",
      logo: "https://voiceofgeereans.com/wp-content/uploads/2025/08/Logo_G.-Rio-School.png",
      date: "2025"
    }
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/vinit-mevada/",
    github: "https://github.com/Vinit09-M",
    email: "vinitharsh20@gmail.com"
  }
};