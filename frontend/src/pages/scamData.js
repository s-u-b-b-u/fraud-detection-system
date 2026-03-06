// ── Complete Scam Knowledge Base ─────────────────────────────────────────────
// Each entry is a full-detail document for one scam type.
// Update any entry with your own document content.

const scamData = {
    'upi-bank-fraud': {
        title: 'UPI & Bank Fraud',
        emoji: '🏦',
        color: '#3b82f6',
        tagline: 'The most common digital theft in rural India',
        overview: `UPI and bank fraud involves criminals tricking people into handing over their UPI PIN, OTP, 
        bank account credentials, or authorizing fraudulent transactions. Scammers often pose as bank officials, 
        customer care agents, or government representatives. In rural areas, where digital literacy is still developing, 
        these frauds cause devastating losses.`,
        howItWorks: [
            'Scammer calls pretending to be from your bank (SBI, PNB, UCO Bank, etc.)',
            'They claim your account/KYC is expiring and needs urgent update',
            'They ask you to share your OTP, ATM PIN, or card number',
            'Sometimes they send a link to a fake bank website to steal your login',
            'In UPI scams, they send a "collect request" and tell you to enter your PIN to "receive" ₹'
        ],
        warningSigns: [
            'Anyone asking for your OTP, PIN, or CVV — real banks NEVER ask for this',
            'Urgency pressure: "Your account will close in 24 hours"',
            'Requests to install remote-access apps like AnyDesk or TeamViewer',
            'Links that don\'t end in .sbi.co.in, .pnb.in, or the bank\'s official domain',
            'Calls from +92 or other foreign numbers claiming to be Indian banks'
        ],
        realCases: [
            {
                title: 'Rajasthan Farmer Loses ₹1.4 Lakh (2022)',
                description: 'A 58-year-old farmer from Barmer, Rajasthan received a call saying his PM-Kisan money was stuck. The caller asked for his Aadhaar-linked bank account OTP. Within minutes, ₹1.4 lakh was transferred out of his account across 3 transactions.',
                source: 'Rajasthan Police Cybercrime Cell'
            },
            {
                title: 'UP Village Woman Defrauded via Fake SBI Call (2023)',
                description: 'A 45-year-old woman in Gorakhpur received a call from "SBI Customer Care" saying her debit card was being misused. She shared her card details and OTP, losing ₹68,000 — her entire savings.',
                source: 'UP Cybercrime Unit'
            },
            {
                title: 'Jharkhand UPI Collect Scam (2023)',
                description: 'Multiple farmers in Jharkhand\'s Hazaribagh district received UPI collect requests labeled as "crop insurance refund." Believing they were receiving money, they entered their PINs — instead, ₹ was debited from their accounts.',
                source: 'Jharkhand Economic Offences Wing'
            }
        ],
        whatToDo: [
            'Hang up immediately if asked for OTP or PIN',
            'Never approve a UPI collect request from an unknown number',
            'Report on cybercrime.gov.in or call 1930 within minutes',
            'Call your bank\'s official helpline (on back of your card) to verify any claim',
            'Block your card immediately through your mobile banking app'
        ],
        helplines: ['Cybercrime: 1930', 'RBI Ombudsman: 14448', 'SBI Helpline: 1800 11 2211']
    },

    'fake-government-scheme': {
        title: 'Fake Government Scheme Fraud',
        emoji: '🏛',
        color: '#f59e0b',
        tagline: 'Exploiting trust in PM schemes and Aadhaar',
        overview: `Criminals impersonate government officials and claim to offer benefits under real schemes like 
        PM-Kisan, PM Awas Yojana, Ujjwala Yojana, Ayushman Bharat, or Aadhaar updates. They target rural 
        beneficiaries who genuinely depend on these programs, extracting money as "processing fees" or 
        stealing personal documents.`,
        howItWorks: [
            'Caller claims to be from the PM-Kisan helpdesk or block office',
            'Says your subsidy/payment is held due to incomplete Aadhaar/bank linking',
            'Asks for a small "processing fee" (₹100–₹500) to release the payment',
            'Or asks you to share Aadhaar number, OTP, and bank account details',
            'Sometimes they visit villages physically with fake ID cards and collect fees'
        ],
        warningSign: [
            'Government schemes NEVER charge fees to release payments',
            'No government official calls your personal number to update Aadhaar',
            'Official PM-Kisan status can be checked on pmkisan.gov.in — not via phone',
            'Anyone claiming a one-time fee to unlock government money is a criminal'
        ],
        realCases: [
            {
                title: 'PM-Kisan Fee Scam — Bihar (2022)',
                description: '47 farmers in Saran district, Bihar paid ₹500 each to scammers who promised to "unblock" their PM-Kisan installment. Total loss: ₹23,500+. The "helpdesk number" was a prepaid SIM bought from another state.',
                source: 'Bihar Police'
            },
            {
                title: 'Fake Ayushman Bharat Camp — MP (2023)',
                description: 'A group set up fake "Ayushman Bharat registration camps" in 3 villages in Hoshangabad, MP. They collected ₹200-₹500 per family for "health card processing." Over 300 families were cheated before police intervened.',
                source: 'Madhya Pradesh Cybercrime'
            },
            {
                title: 'Aadhaar Deactivation Threat Scam (2023-Ongoing)',
                description: 'Nationwide scam where scammers call claiming the victim\'s Aadhaar will be "deactivated in 2 hours" unless they share OTP to a "UIDAI verification officer." Used to steal bank accounts linked to Aadhaar.',
                source: 'UIDAI & Ministry of Home Affairs'
            }
        ],
        whatToDo: [
            'Verify any scheme claim at the official website (pmkisan.gov.in, myscheme.gov.in)',
            'Visit your nearest Common Service Centre (CSC) for all government scheme help',
            'Report fake officials to your local police station immediately',
            'UIDAI helpline: 1947 — report Aadhaar fraud here',
            'Never pay any fee to receive government benefits'
        ],
        helplines: ['UIDAI Helpline: 1947', 'PM-Kisan Helpline: 155261', 'Cybercrime: 1930']
    },

    'lottery-prize-scam': {
        title: 'Lottery & Prize Scam',
        emoji: '🎰',
        color: '#8b5cf6',
        tagline: 'You cannot win a lottery you never entered',
        overview: `Lottery and prize scams trick victims into believing they have won a large sum of money 
        or a valuable prize. The scammer uses trusted brands (KBC, Amazon, TATA) to make it seem 
        legitimate. Victims are then asked to pay taxes, customs, or processing fees before receiving 
        their "prize" — which never arrives. These scams are particularly effective in rural areas 
        where awareness of online fraud is lower.`,
        howItWorks: [
            'You receive an SMS, WhatsApp message, or call announcing a prize win',
            'The message uses KBC, Amazon, Reliance, or government logos to appear official',
            'You are asked to send a "tax fee" or "delivery charge" to claim the prize',
            'Once you pay, they ask for more fees (customs, insurance, etc.) — this repeats',
            'In advanced cases they ask for your bank details to "deposit" the prize'
        ],
        warningSign: [
            'You cannot win a contest you never entered',
            'Real prize schemes never ask you to PAY to receive your winnings',
            'KBC never contacts winners via WhatsApp or personal mobile numbers',
            'Winning notices sent over WhatsApp or SMS from unknown numbers are always fake'
        ],
        realCases: [
            {
                title: 'KBC WhatsApp Scam — Uttar Pradesh (2022)',
                description: 'Over 200 people in eastern UP received WhatsApp messages claiming they had won KBC prizes of ₹25 lakh. 40+ people paid between ₹5,000–₹50,000 as "tax deposits." Total fraud: over ₹18 lakh, zero prizewinners.',
                source: 'Lucknow Cybercrime Police'
            },
            {
                title: 'Amazon Spin-Wheel Lottery Scam (2023)',
                description: 'A viral WhatsApp link mimicking Amazon\'s website claimed to offer prizes for completing a "customer survey." At least 1,000 rural users clicked and shared personal details and UPI IDs. Several lost money after being asked for a ₹99 "shipping fee."',
                source: 'Amazon India & MHA Cybercrime Wing'
            },
            {
                title: 'Reliance Jio Lucky Draw Scam — Gujarat (2023)',
                description: 'Fake SMS campaigns claimed Jio subscribers had won a free smartphone. Victims were asked to pay ₹250 courier charges. Losses totaled ₹8+ lakh across 600+ victims in Surat, Rajkot, and rural areas.',
                source: 'Gujarat ATS Cybercrime'
            }
        ],
        whatToDo: [
            'Simply delete and ignore any prize/lottery message from unknown contacts',
            'Check the real KBC/company website — they will NEVER contact you via WhatsApp',
            'Report the WhatsApp number at cybercrime.gov.in',
            'Warn your family: any prize that requires payment first is always a scam',
            'Call 1930 immediately if you have already sent money'
        ],
        helplines: ['Cybercrime: 1930', 'National Consumer Helpline: 1800-11-4000']
    },

    'job-employment-fraud': {
        title: 'Job & Employment Fraud',
        emoji: '💼',
        color: '#22c55e',
        tagline: 'False hopes and stolen savings',
        overview: `Fraudsters exploit the desperation of unemployed youth and rural workers by advertising 
        fake jobs — government posts, IT/BPO positions, factory work, or overseas employment. 
        They collect registration fees, document charges, and training fees before disappearing. 
        Fake recruitment agencies are a massive problem in states like Bihar, UP, Jharkhand, and Odisha.`,
        howItWorks: [
            'Ad posted on WhatsApp groups, local newspapers, or village notice boards',
            'Promises high-paying government or private sector jobs without requirements',
            'Victim is called for a "telephonic interview" — always selected immediately',
            'Asked to pay: registration fee, file fee, uniform deposit, background check fee',
            'Sometimes victim is asked to travel to a city, where more fees are collected'
        ],
        warningSign: [
            'Government recruitment ONLY happens through official portals (ssc.gov.in, ncs.gov.in)',
            'No genuine employer charges any fee for job registration or document processing',
            'Interviews conducted purely over WhatsApp call are suspicious',
            'Offers of unusually high salaries (₹50,000+ for unskilled work) are red flags'
        ],
        realCases: [
            {
                title: 'Fake SSC Recruitment Racket — Bihar (2022)',
                description: 'A gang in Patna collected ₹10,000–₹30,000 each from over 500 youth claiming to secure government postal/SSC jobs. Victims received fake appointment letters. Total fraud: ₹2.5 crore. 7 arrested by Bihar STF.',
                source: 'Bihar Special Task Force'
            },
            {
                title: 'Gulf Job Scam — Jharkhand (2023)',
                description: 'A "travel agent" in Ranchi collected ₹40,000–₹60,000 from 35 men, promising construction jobs in Oman and Dubai. Fake visas were issued. Victims stranded at airports with rejected documents.',
                source: 'Jharkhand Police & MEA'
            },
            {
                title: 'Online Data Entry Job Scam (Ongoing Nationwide)',
                description: '"Work from home" ads on Facebook and Instagram promise ₹15,000/month for simple data entry. Victims pay ₹500–₹2,000 for training material. Work is given, but payment is always "pending verification" and eventually the scammer disappears.',
                source: 'MHA Cybercrime, Multiple FIRs'
            }
        ],
        whatToDo: [
            'NEVER pay any fee for job registration — any employer asking is fraudulent',
            'Verify government jobs only on official websites (ssc.nic.in, upsc.gov.in)',
            'Check NCS portal (ncs.gov.in) for legitimate employment listings for free',
            'For overseas jobs, verify the agency\'s license on emigrate.gov.in',
            'Report fake job ads to cybercrime.gov.in with screenshots'
        ],
        helplines: ['NCS Helpline: 1800-425-1514', 'Cybercrime: 1930', 'MEA Overseas: 1800-11-8797']
    },

    'loan-app-fraud': {
        title: 'Illegal Loan App Fraud',
        emoji: '📱',
        color: '#ef4444',
        tagline: 'Instant loans, permanent harassment',
        overview: `Illegal digital lending apps offer instant personal loans with no documentation, 
        targeting people in financial distress. Once installed, these apps harvest all contacts, 
        photos, and personal data. When repayment is demanded, often within days at extremely 
        high interest, borrowers face harassment calls, threats, and morphed obscene photos 
        sent to their contacts. Several suicides have been linked to these apps in India.`,
        howItWorks: [
            'App advertised on WhatsApp, YouTube, or Facebook as "Instant Loan — No Documents"',
            'User installs app, grants access to all contacts, camera, storage, and gallery',
            'Small loan (₹2,000-₹10,000) approved in minutes — less is actually disbursed after "processing fee"',
            'Repayment demanded within 7 days at 200-500% annual interest',
            'If unable to repay, morphed photos with vulgar captions sent to all contacts'
        ],
        warningSign: [
            'Apps that ask permission to access all contacts, photos, and videos before giving you a loan',
            'No registered NBFC or bank name associated with the app',
            'Repayment periods of less than 30 days violate RBI\'s digital lending guidelines',
            'Any app not listed on the RBI\'s official registered NBFC list'
        ],
        realCases: [
            {
                title: 'Hyderabad Loan App Suicides (2020)',
                description: 'At least 3 people died by suicide in Hyderabad after Chinese-backed illegal loan apps sent morphed obscene photos of borrowers to their family and contacts as repayment threats. Triggered RBI crackdown on digital lenders.',
                source: 'Telangana Police & RBI Report'
            },
            {
                title: 'Maharashtra Farmer Targeted — Nashik (2022)',
                description: 'A farmer borrowed ₹5,000 from an illegal app. Despite repaying ₹7,000, the app demanded ₹12,000 more showing fabricated "interest." Obscene morphed images of his wife\'s photo were sent to his village contacts.',
                source: 'Maharashtra Cybercrime Wing'
            },
            {
                title: 'RBI Action: 600+ Illegal Apps Removed (2023)',
                description: 'RBI and MHA coordinated with Google to remove over 600 illegal loan apps from the Play Store. An estimated 2 million Indians had been victimized, many in Tier-2 and Tier-3 cities and rural areas.',
                source: 'RBI & Ministry of Home Affairs'
            }
        ],
        whatToDo: [
            'Check if the lender is on RBI\'s registered NBFC list at rbi.org.in before borrowing',
            'Never install apps that ask for access to your contacts and gallery for money',
            'If harassed, do not pay more — file a police complaint immediately',
            'File complaint on cybercrime.gov.in with app name and screenshots',
            'Call 1930 to report and freeze transactions to the scam app'
        ],
        helplines: ['Cybercrime: 1930', 'RBI: 14448', 'National Legal Services: 15100']
    },

    'sim-swap-fraud': {
        title: 'SIM Swap Fraud',
        emoji: '📲',
        color: '#0d9488',
        tagline: 'Your number is stolen without touching your phone',
        overview: `SIM swap fraud (or SIM cloning) happens when a criminal convinces your telecom operator 
        to issue a new SIM card for your number. Once they have your SIM, they receive all OTPs 
        meant for you and can access all your bank accounts, UPI apps, and email. The victim 
        knows something is wrong only when their phone loses signal entirely.`,
        howItWorks: [
            'Scammer calls pretending to be from Airtel/Jio/BSNL, asks you to press 1 to improve signal',
            'This unknowingly registers your number for a SIM swap at a service center',
            'Or: they visit a telecom store with your fake/stolen documents and request a duplicate SIM',
            'Once new SIM is activated, your original SIM is deactivated — you lose all network',
            'They then access your bank accounts using OTPs sent to your (now stolen) SIM'
        ],
        warningSign: [
            'Your phone suddenly loses all network signal for a long period',
            'OTPs stop arriving for your accounts unexpectedly',
            'You receive SMS saying "SIM swap successful" or "new SIM activated"',
            'Bank or UPI alerts stop sending to your phone'
        ],
        realCases: [
            {
                title: 'Pune Businessman Loses ₹1.86 Crore (2021)',
                description: 'A Pune businessman\'s SIM was swapped after scammers bribed a local Airtel dealer. Over 16 hours, ₹1.86 crore was drained from multiple accounts using OTPs sent to the cloned SIM. Arrested: 3 including the dealer.',
                source: 'Maharashtra Cybercrime'
            },
            {
                title: 'UP Teacher Loses Life Savings (2022)',
                description: 'A school teacher from Prayagraj lost ₹4.2 lakh after a SIM swap. Scammers had gathered his Aadhaar details from a land registration fraud earlier. SIM was swapped using fake ID at a village CSC.',
                source: 'UP STF Cybercrime'
            }
        ],
        whatToDo: [
            'If your signal drops for hours, call your operator IMMEDIATELY from another phone',
            'Enable SIM lock and port-in block through your telecom operator',
            'Set up login alerts on all bank accounts (email + SMS dual alert)',
            'Register a complaint with TRAI if your SIM is swapped without consent',
            'File cybercrime complaint: cybercrime.gov.in and call 1930 immediately'
        ],
        helplines: ['Cybercrime: 1930', 'TRAI: 1800-110-999', 'BSNL: 198', 'Jio: 199', 'Airtel: 121']
    },

    'qr-code-scam': {
        title: 'QR Code Scam',
        emoji: '📱',
        color: '#f97316',
        tagline: 'You never scan a QR code to receive money',
        overview: `QR Code scams exploit a fundamental misunderstanding: people think QR codes can both 
        send AND receive money. In reality, scanning a QR code always initiates a payment FROM your account. 
        Scammers send QR codes claiming they are "sending" money to the victim, then instruct them 
        to scan it and enter their UPI PIN — which transfers money OUT of the victim's account.`,
        howItWorks: [
            'Scammer sends a QR code via WhatsApp saying "scan this to receive your payment"',
            'When victim scans it, a UPI payment request pops up on their screen',
            'Victim assumes entering PIN will receive money — actually it sends money',
            'In OLX/marketplace scams: buyer sends QR to "pay" the seller — actually debits them',
            'Sometimes used to gain access to merchant UPI accounts'
        ],
        warningSign: [
            'Anyone asking you to scan a QR code to RECEIVE money',
            'QR codes sent by strangers on WhatsApp or Telegram',
            'UPI payment screens that show a deduction amount when scanned',
            'Buyers on OLX/Facebook who insist on paying via a QR code they send to you'
        ],
        realCases: [
            {
                title: 'OLX QR Code Fraud — Army Impersonation (2021)',
                description: 'Scammers posing as Army officers buying second-hand goods on OLX sent sellers QR codes claiming to be "payment codes." Hundreds of sellers across India lost between ₹5,000–₹60,000 each. This became one of India\'s most documented QR frauds.',
                source: 'Delhi Police Cybercrime & ET'
            },
            {
                title: 'Rajasthan Kirana Shop Owner (2023)',
                description: 'A grocery store owner received a QR code from a "customer" who said the code would transfer ₹10,000 as advance payment for goods. Owner scanned and entered PIN — ₹10,000 was debited from his account immediately.',
                source: 'Rajasthan Cybercrime Cell'
            }
        ],
        whatToDo: [
            'NEVER scan a QR code from someone to "receive" money — it doesn\'t work that way',
            'As a seller: generate your own QR from your UPI app — do not scan buyer\'s QR',
            'If you accidentally scanned someone\'s QR, report to 1930 immediately',
            'Educate family members about this: especially elderly and rural shopkeepers',
            'Reverse transaction requests can be filed at cybercrime.gov.in within 72 hours'
        ],
        helplines: ['Cybercrime: 1930', 'NPCI Helpline: 1800-120-1740']
    },

    'fake-insurance-fraud': {
        title: 'Fake Insurance Fraud',
        emoji: '📋',
        color: '#ec4899',
        tagline: 'Fake premiums, no coverage',
        overview: `Fake insurance agents and fraudulent schemes target rural people by offering drastically 
        cheaper health, life, or crop insurance policies. Victims pay premiums for years, 
        often through cash or agents, without ever receiving official documents or policy numbers. 
        When a claim is needed, the policy doesn't exist and the agent has disappeared.`,
        howItWorks: [
            'Local "insurance agent" visits village offering very cheap health/life/crop insurance',
            'Premiums collected in cash or UPI — no official receipt or policy document given',
            'Policy number provided is either fake or belongs to a real but different person',
            'Company name is either a dissolved firm or a completely fake entity',
            'When claim is filed, IRDA has no record — victim loses all premiums paid'
        ],
        warningSign: [
            'Agent not registered with IRDA (Insurance Regulatory and Development Authority)',
            'No official policy document/e-policy or policy number after premium payment',
            'Premiums collected in cash without company receipts',
            'Policies that claim to cover "everything" at unbelievably low premiums',
            'No mention of a well-known insurance company name on documents'
        ],
        realCases: [
            {
                title: 'Fake Crop Insurance Racket — Punjab (2022)',
                description: 'A gang of 12 posing as LIC and PMFBY agents collected crop insurance premiums from 1,400+ farmers in Amritsar, Gurdaspur, and Ludhiana. Total fraud: ₹3.2 crore. None of the farmers\' crops were actually insured.',
                source: 'Punjab Police Economic Wing'
            },
            {
                title: 'Ayushman Bharat Fake Cards — MP (2023)',
                description: 'Fraudsters sold fake Ayushman Bharat cards for ₹500 each, promising free hospital treatment up to ₹5 lakhs. Over 800 families bought them. Cards were rejected at empanelled hospitals.',
                source: 'National Health Authority India'
            }
        ],
        whatToDo: [
            'Verify any insurance agent\'s license on IRDA\'s website: irdai.gov.in',
            'Check Ayushman Bharat eligibility free at pmjay.gov.in — never pay for the card',
            'Always demand an official policy document and keep it safe',
            'For crop insurance, verify enrollment on pmfby.gov.in using your application number',
            'First Information Report (FIR) + complaint to IRDA: grievance.irdai.gov.in'
        ],
        helplines: ['IRDA Grievance: 155255', 'PMJAY: 14555', 'Cybercrime: 1930']
    },

    'investment-ponzi-fraud': {
        title: 'Investment & Ponzi Scheme Fraud',
        emoji: '📈',
        color: '#6366f1',
        tagline: 'Double your money — lose everything',
        overview: `Ponzi and pyramid schemes promise extraordinary returns (2x–10x in weeks) through 
        investments in gold, land, cryptocurrencies, or multi-level marketing. Early investors 
        receive "returns" paid from new investors' money — building trust — until the scheme 
        collapses and everyone loses. These are catastrophic for rural communities, sometimes 
        wiping out entire villages' savings.`,
        howItWorks: [
            'Someone trusted in the village (teacher, ex-sarpanch) introduces the scheme',
            'Initial investors receive promised returns on time — word spreads fast',
            'Hundreds more join, investing savings, livestock sale money, and loans',
            'New investor money pays old investor "returns" — scheme grows unsustainably',
            'When too many withdraw simultaneously, the scheme collapses and organizers flee'
        ],
        warningSign: [
            'Returns promised over 15% per month are illegal and impossible legitimately',
            'Scheme is introduced by word of mouth with no SEBI registration',
            'Pressure to recruit more investors to earn commissions (pyramid structure)',
            'No written legal contract or regulated financial institution backing the scheme',
            'Company not registered with SEBI or RBI'
        ],
        realCases: [
            {
                title: 'Rose Valley Chit Fund Scam — West Bengal & Odisha (2016)',
                description: 'Rose Valley Group collected approximately ₹17,000 crore from over 60 lakh small investors across WB, Odisha, Jharkhand, and Assam — mostly rural depositors. Promised 12-15% annual returns. Collapsed in 2013. Founders arrested; most victims never recovered money.',
                source: 'SEBI & CBI India'
            },
            {
                title: 'Amway/QNet-Style MLM Fraud — Rural Karnataka (2022)',
                description: 'A fake health product MLM scheme spread through 200 villages in Kolar and Tumkur districts. Farmers and daily-wage workers invested ₹20,000–₹2 lakh each. Top 8 organizers collected ₹7 crore and disappeared.',
                source: 'Karnataka High Court & EOW'
            },
            {
                title: 'Crypto Ponzi — Bitconnect India Victims (2022)',
                description: 'Thousands of rural investors from Gujarat, Rajasthan, and MP lost savings through Bitconnect India promoters who promised 40% monthly crypto returns. RBI had warned against crypto investments; victims lost over ₹500 crore nationally.',
                source: 'ED India & SEBI Warning'
            }
        ],
        whatToDo: [
            'Verify any investment scheme is SEBI-registered at sebi.gov.in',
            'Any return above 12% per annum is suspect — there is no guaranteed doubling of money',
            'Do not invest based on friend/relative recommendation without independent verification',
            'File complaint with SEBI SCORES: scores.sebi.gov.in',
            'Report to local Economic Offences Wing (EOW) and cybercrime.gov.in'
        ],
        helplines: ['SEBI: 1800-266-7575', 'Cybercrime: 1930', 'EOW (contact local police)']
    },

    'impersonation-scam': {
        title: 'Impersonation & Social Engineering',
        emoji: '🎭',
        color: '#84cc16',
        tagline: 'Scammers wear many faces',
        overview: `Impersonation scams involve criminals pretending to be someone trusted — a police officer, 
        CBI agent, electricity board official, court bailiff, or even a family member in distress. 
        They use fear, authority, or emotional manipulation to extract money or information. 
        This "social engineering" bypasses all technical security because it targets human psychology.`,
        howItWorks: [
            '"Police/CBI officer" calls saying you or your family member has been named in a crime case',
            'Offer to "settle" the case by paying a fine over UPI to avoid arrest',
            'Power/electricity department calls saying connection will be cut in 2 hours unless payment',
            'Trusted family member voice is cloned using AI and used to request emergency cash',
            'Fake delivery agent demands COD payment for a parcel you didn\'t order'
        ],
        warningSign: [
            'Police, CBI, or court officials NEVER demand payment over phone to drop cases',
            'Electricity board will send written notice, not demand immediate UPI payment',
            'Any "emergency" requiring money transfer in the next 1-2 hours is always a scam',
            'Voice of family member asking for money — always call back on their saved number'
        ],
        realCases: [
            {
                title: '"Digital Arrest" Scam — Pan India (2023-2024)',
                description: 'India\'s most feared new fraud: Scammers pose as Supreme Court judges, CBI officers, and Narcotics Bureau officials via video call. They put victims under "digital arrest" (told to stay on video call for hours/days) and demand ₹5–50 lakh to avoid jail. PM Modi publicly warned about this scam in Mann Ki Baat.',
                source: 'MHA India & PM Mann Ki Baat (Oct 2024)'
            },
            {
                title: 'Electricity Bill Scam — West Bengal, Bihar (2022)',
                description: 'Thousands of rural households received calls threatening power disconnection in 2 hours unless ₹900–₹1,500 was paid immediately to a provided UPI ID. Over 10,000 complaints filed across both states in one month.',
                source: 'WBSEDCL & Bihar Police'
            },
            {
                title: 'AI Voice Clone Family Scam (2024-Emerging)',
                description: 'A new trend: scammers clone a relative\'s voice from public social media videos and call elderly victims saying their son/daughter is in a hospital or police station. Several cases of ₹50,000–₹2 lakh transferred within minutes before victims realized. AI voice cloning has made this dramatically more convincing.',
                source: 'India Today AI Crime Report 2024'
            }
        ],
        whatToDo: [
            'Hang up on any call creating fear of arrest/disconnection and demanding immediate payment',
            'Call your family member on their actual saved phone number before sending any money',
            'Real police/courts send written notices — no case can be settled over a phone call',
            'For "digital arrest" attempts: simply disconnect the video call and call 1930',
            'Report with full call details, phone number, and UPI ID at cybercrime.gov.in'
        ],
        helplines: ['Cybercrime: 1930', 'National Consumer Helpline: 1800-11-4000', 'Sanchar Saathi: 1800-116-456']
    }
}

export default scamData
