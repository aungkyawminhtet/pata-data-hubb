export const HUB_GROUNDING_CONTEXT = `
PROJECT: Together Mae Sai (Shared Tourism Data Hub for Mae Sai District, Chiang Rai, Thailand)
PROTOTYPE HONESTY RULE: All numbers, charts, and sample datasets in this hub are illustrative demo data ("Demo data — not official Mae Sai statistics"). Always state clearly when a figure or prediction is an illustrative estimate/projection based on the hub's sample data, and never claim official government verification unless verified.
ACCESS GOVERNANCE RULE: Datasets have three access levels: "Open", "Members only", and "Restricted". For "Restricted" datasets (ms-tourism-planning-reference, ms-accommodation-occupancy-panel), NEVER invent or expose private contents—only describe their public metadata, purpose, and stewardship status.

=== DATASETS IN THE CATALOG (12 SAMPLE DATASETS) ===
1. [id: ms-visitor-trend-snapshot] "Mae Sai Visitor Trend Snapshot" | Type: Statistics | Access: Open | Sub-district: Mae Sai & Wiang Phang Kham | Updated: 2025-11-15 | Source: Illustrative sample — source to verify
   Summary: Quarterly illustrative visitor footfall index across border market, hillside coffee trails, and cave park zones.
   Data rows (2025 Demo):
   - Q1 (Jan-Mar): Border Market 84 pts, Hillside & Coffee Trails 78 pts, Cave & Nature 69 pts (Cool season & dry trails)
   - Q2 (Apr-Jun): Border Market 62 pts, Hillside & Coffee Trails 48 pts, Cave & Nature 51 pts (Songkran peak then early rain)
   - Q3 (Jul-Sep): Border Market 45 pts, Hillside & Coffee Trails 39 pts, Cave & Nature 34 pts (Monsoon season caution)
   - Q4 (Oct-Dec): Border Market 91 pts, Hillside & Coffee Trails 88 pts, Cave & Nature 76 pts (Winter highland season)

2. [id: ms-local-attractions-photos] "Local Attractions Photo Collection" | Type: Photos | Access: Open | Sub-district: Pong Pha, Wiang Phang Kham & Mae Sai | Updated: 2025-11-08 | Source: Community contribution — demo
   Summary: 4 attributed visual plates (Morning Mist at Doi Pha Hee Ridge, Wat Phra That Doi Wao Panorama, Mae Sai Border Crossing Lane, Khun Nam Nang Non Emerald Pool Trail).

3. [id: ms-local-experience-video] "Mae Sai Local Experience Video" | Type: Video | Access: Open | Sub-district: Mae Sai & Pong Pha | Updated: 2025-11-04 | Source: Visitor contribution — demo
   Summary: 04:18 morning coffee-and-market walk clip with 4 chapters (Pha Hee ridge viewpoint, scenic descent, Doi Wao steps, Sai River market). Transcript notes need for a shared songthaew pickup timetable back to main highway.

4. [id: ms-community-events-notes] "Community Events and Festival Notes" | Type: Text & Feedback | Access: Members only | Sub-district: Multiple sub-districts | Updated: 2025-11-12 | Source: Community group — demo
   Summary: Shared local calendar notes for Ban Pha Hee coffee harvest weekend (Dec 6 demo), Wiang Phang Kham Lanna lantern market (Dec 20 demo), and Ko Chang cycling & orchard open-house (Jan 18 demo).

5. [id: ms-business-services-directory] "Local Business Services Directory" | Type: Directory data | Access: Open | Sub-district: Mae Sai, Pong Pha & Wiang Phang Kham | Updated: 2025-11-14 | Source: Business contribution — demo
   Summary: Standardized sample directory of 5 local hospitality listings with verified hours, languages, and payment options (TH/EN, Thai QR, Cash, Card).

6. [id: ms-tourism-planning-reference] "Tourism Planning Reference Document" | Type: Report / document | Access: Restricted | Sub-district: District-wide (Mae Sai) | Updated: 2025-10-30 | Source: Public agency source — verify before use
   Summary: Metadata-only entry demonstrating restricted agency document cataloging. Contents are intentionally withheld.

7. [id: ms-doi-pha-hee-trail-log] "Highland Coffee Trail Footfall Sample" | Type: Statistics | Access: Open | Sub-district: Pong Pha (Pha Hee / Pha Mi) | Updated: 2025-11-11 | Source: Community & business sample — demo
   Data rows (Arrival Window):
   - 07:00-09:00: Weekday avg 24 visitors, Weekend avg 68 visitors (Parking pressure: Low-Moderate)
   - 09:00-11:00: Weekday avg 42 visitors, Weekend avg 135 visitors (Parking pressure: High on narrow bends)
   - 11:00-13:00: Weekday avg 38 visitors, Weekend avg 110 visitors (Parking pressure: Moderate)
   - 13:00-15:00: Weekday avg 29 visitors, Weekend avg 74 visitors (Parking pressure: Low)
   - 15:00-17:30: Weekday avg 21 visitors, Weekend avg 58 visitors (Parking pressure: Low, sunset window)

8. [id: ms-tham-luang-seasonal-notes] "Tham Luang & Nature Park Seasonal Access Log" | Type: Text & Feedback | Access: Open | Sub-district: Pong Pha | Updated: 2025-11-01 | Source: Public agency & ranger notes — demo
   Summary: Monsoon months (Jul-Sep) close inner cave chambers due to water levels while outer visitor center stays accessible on clear days; Oct-Nov maintenance prepares cool-season loop.

9. [id: ms-flood-resilience-access] "Sai River Corridor Seasonal Recovery Notes" | Type: Text & Feedback | Access: Members only | Sub-district: Mae Sai & Koh Sai | Updated: 2025-11-06 | Source: Community & business network — demo
   Summary: Coordination notes on Sai Lom Joy market cleanup, electrical checks, and morning delivery van access before 08:30.

10. [id: ms-visitor-accessibility-notes] "Visitor Wayfinding & Language Feedback Log" | Type: Text & Feedback | Access: Open | Sub-district: District-wide (Mae Sai) | Updated: 2025-11-13 | Source: Visitor contribution — demo
    Summary: Anonymized PDPA-aligned visitor notes highlighting missing bilingual signage at Wiang Phang Kham bus stop and uncertainty over international card vs. Thai QR payment at hillside cafés.

11. [id: ms-ko-chang-cycling-directory] "Rural Cycling & Homestay Route Directory" | Type: Directory data | Access: Open | Sub-district: Ko Chang | Updated: 2025-11-05 | Source: Community contribution — demo
    Summary: Flatland cycling loops: Morning Paddy Loop (11.4 km, 06:30-09:30), Orchard & Canal Path (8.2 km, 15:30-17:45), Temple Heritage Connector (6.5 km).

12. [id: ms-accommodation-occupancy-panel] "District Accommodation Capacity & Booking Window (Restricted Sample)" | Type: Report / document | Access: Restricted | Sub-district: District-wide (Mae Sai) | Updated: 2025-11-10 | Source: Business association sample
    Summary: Metadata-only record showing sensitive commercial hospitality indicators stay restricted.

=== CHART & FRICTION SUMMARY (DEMO DATA) ===
- Activity Interest (Peak vs Green season demo index 0-100): Highland Coffee & Cafés (88 vs 54), Border Market & Town (79 vs 61), Temples & Viewpoints (72 vs 49), Caves & Nature Trails (65 vs 32), Rural Cycling & Crafts (51 vs 38).
- Reported Visitor Information Pain Points (% of sample notes): Unclear local transit times (64%), Outdated shop/café hours (58%), Seasonal trail/cave status (47%), Payment options QR vs Cash (41%), Bilingual directional signs (36%).

=== KEY HUB INSIGHTS ===
1. Visitor interest varies significantly by activity type and season (highland coffee and border market hold steady across more months while caves/nature drop sharply in monsoon Q3).
2. Practical transit and opening-hour gaps matter more than lack of attractions.
3. Morning crowding (09:00-11:00) on hillside roads leaves afternoon capacity (14:00-17:30) underused.

=== EXPLORE MAE SAI MAP LOCATIONS (8 SAMPLE PINS) ===
Border Crossing & Market Corridor (Mae Sai), Wat Phra That Doi Wao Viewpoint (Wiang Phang Kham), Wiang Phang Kham Town & Transit Hub, Ko Chang Rice-Paddy Cycling Loop, Tham Luang - Khun Nam Nang Non Park (Pong Pha), Ban Pha Hee Highland Coffee Village (Pong Pha), Ban Pha Mi Cultural & Coffee Trail (Wiang Phang Kham), Southern Ridge & Doi Tung Gateway.
`;
