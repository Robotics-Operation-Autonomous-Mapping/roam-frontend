-- Preview seed data for /team (5 leads + 10 members).
-- Safe to wipe: all emails end with @seed.schulichroam.local

-- Optional cleanup first:
-- DELETE FROM public.members WHERE email LIKE '%@seed.schulichroam.local';

INSERT INTO public.members (
  full_name, email, role, subteam, title, bio, interesting_thing,
  linkedin_url, portfolio_url, is_public, sort_order
) VALUES
-- Subteam leads (5)
(
  'Aisha Rahman',
  'aisha.rahman@seed.schulichroam.local',
  'lead',
  'software',
  'Software Lead',
  'Owns autonomy stack, perception pipelines, and rover software integration.',
  'Debugged a path planner at 2am with only cold brew.',
  'https://linkedin.com/in/example',
  'https://example.com',
  true,
  10
),
(
  'Noah Keller',
  'noah.keller@seed.schulichroam.local',
  'lead',
  'electrical',
  'Electrical Lead',
  'Power distribution, sensor harnesses, and board bring-up for ATLAS-1.',
  'Collects vintage multimeters.',
  'https://linkedin.com/in/example',
  NULL,
  true,
  20
),
(
  'Maya Chen',
  'maya.chen@seed.schulichroam.local',
  'lead',
  'mechanical',
  'Mechanical Lead',
  'Chassis, suspension, and manufacturable designs that survive Calgary winters.',
  'CNC''d a phone stand for fun.',
  'https://linkedin.com/in/example',
  'https://example.com',
  true,
  30
),
(
  'Leo Santos',
  'leo.santos@seed.schulichroam.local',
  'lead',
  'geomatics',
  'Geomatics Lead',
  'LiDAR workflows, map products, and survey-grade validation.',
  'Has a favourite coordinate system (it''s UTM).',
  'https://linkedin.com/in/example',
  NULL,
  true,
  40
),
(
  'Priya Nair',
  'priya.nair@seed.schulichroam.local',
  'lead',
  'business_operations',
  'Business Operations Lead',
  'Sponsorships, ops cadence, and keeping the crew mission-ready.',
  'Runs on Notion and iced matcha.',
  'https://linkedin.com/in/example',
  'https://example.com',
  true,
  50
),

-- Members (10)
(
  'Jordan Blake',
  'jordan.blake@seed.schulichroam.local',
  'member',
  'software',
  'Software',
  'Working on teleop UI and rover state visualization.',
  'Speedruns Zelda in spare cycles.',
  'https://linkedin.com/in/example',
  NULL,
  true,
  100
),
(
  'Sam Ortiz',
  'sam.ortiz@seed.schulichroam.local',
  'member',
  'software',
  'Software',
  'Perception helpers and dataset tooling.',
  'Trains models named after cats.',
  NULL,
  'https://example.com',
  true,
  110
),
(
  'Riley Park',
  'riley.park@seed.schulichroam.local',
  'member',
  'electrical',
  'Electrical',
  'Harness routing and connector sanity checks.',
  'Solders to lo-fi beats.',
  'https://linkedin.com/in/example',
  NULL,
  true,
  120
),
(
  'Casey Wu',
  'casey.wu@seed.schulichroam.local',
  'member',
  'electrical',
  'Electrical',
  'Battery monitoring and telemetry sensors.',
  'Owns three identical USB-C cables (none work).',
  NULL,
  NULL,
  true,
  130
),
(
  'Taylor Brooks',
  'taylor.brooks@seed.schulichroam.local',
  'member',
  'mechanical',
  'Mechanical',
  'CAD for mounting plates and wheel assemblies.',
  'Prints failed prototypes as desk art.',
  'https://linkedin.com/in/example',
  'https://example.com',
  true,
  140
),
(
  'Quinn Adler',
  'quinn.adler@seed.schulichroam.local',
  'member',
  'mechanical',
  'Mechanical',
  'Tolerance stackups and fab drawings.',
  'Can spot a bad fillet from across the lab.',
  NULL,
  NULL,
  true,
  150
),
(
  'Harper Diaz',
  'harper.diaz@seed.schulichroam.local',
  'member',
  'geomatics',
  'Geomatics',
  'Point cloud cleanup and map tiling experiments.',
  'Took a scenic detour for “ground truth.”',
  'https://linkedin.com/in/example',
  NULL,
  true,
  160
),
(
  'Morgan Lee',
  'morgan.lee@seed.schulichroam.local',
  'member',
  'content_and_events',
  'Content & Events',
  'Recaps, photo docs, and event logistics.',
  'Camera roll is 90% rover angles.',
  'https://linkedin.com/in/example',
  'https://example.com',
  true,
  170
),
(
  'Avery Kim',
  'avery.kim@seed.schulichroam.local',
  'member',
  'content_and_events',
  'Content & Events',
  'Social clips and workshop coordination.',
  'Has a signature thumbnail style.',
  NULL,
  NULL,
  true,
  180
),
(
  'Jamie Flores',
  'jamie.flores@seed.schulichroam.local',
  'member',
  'business_operations',
  'Business Operations',
  'Sponsor packets and outreach follow-ups.',
  'Color-codes everything.',
  'https://linkedin.com/in/example',
  NULL,
  true,
  190
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  subteam = EXCLUDED.subteam,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  interesting_thing = EXCLUDED.interesting_thing,
  linkedin_url = EXCLUDED.linkedin_url,
  portfolio_url = EXCLUDED.portfolio_url,
  is_public = EXCLUDED.is_public,
  sort_order = EXCLUDED.sort_order;

-- Cleanup later:
-- DELETE FROM public.members WHERE email LIKE '%@seed.schulichroam.local';
