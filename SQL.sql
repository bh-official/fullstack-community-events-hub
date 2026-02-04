CREATE TABLE events (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_name TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    attending_users TEXT
);
INSERT INTO events 
(event_name, location, event_date, start_time, end_time, description, attending_users)
VALUES
('Community Tech Meetup',
 'British Library, 96 Euston Road, London NW1 2DB',
 '2026-03-10','18:30','21:30',
 'Evening of tech talks and networking.','1,3'),

('Morning Yoga in Hyde Park',
 'Hyde Park, Serpentine Road, London W2 2UH',
 '2026-03-15','08:30','10:00',
 'Relaxing outdoor yoga session.','2'),

('Charity Bake Sale',
 'Westminster Community Hall, London SW1A 0AA',
 '2026-03-20','10:00','14:00',
 'Local charity fundraiser with homemade treats.','1,2,4'),

('Coding Bootcamp Workshop',
 'King’s College London, Strand, London WC2R 2LS',
 '2026-03-25','13:00','17:00',
 'Hands-on full-stack coding workshop.',''),

('Open Mic Night',
 'Soho Cafe, 45 Dean Street, London W1D 4QB',
 '2026-04-02','19:00','22:00',
 'Local artists perform live.','5,6'),

('Book Club Meetup',
 'Waterstones Piccadilly, London W1J 0DG',
 '2026-04-05','17:30','19:30',
 'Monthly book discussion group.','3,7'),

('Art & Craft Fair',
 'Camden Market, London NW1 8AH',
 '2026-04-08','10:00','16:00',
 'Handmade crafts from local artists.','1,8'),

('Street Food Festival',
 'Southbank Centre, London SE1 8XX',
 '2026-04-12','12:00','20:00',
 'Food stalls from around the world.','2,5,9'),

('Football Practice',
 'Clapham Common, London SW4 9DE',
 '2026-04-15','15:30','17:30',
 'Friendly community football session.','4,6'),

('Photography Walk',
 'River Thames Walk, London SE1 7PB',
 '2026-04-18','07:30','10:30',
 'Morning nature photography walk.','7'),

('Dance Fitness Class',
 'PureGym Stratford, London E15 1XA',
 '2026-04-20','18:00','19:30',
 'High-energy dance workout.','3,10'),

('Gardening Workshop',
 'Kew Gardens, Richmond, London TW9 3AE',
 '2026-04-22','10:00','13:00',
 'Learn urban gardening tips.','1,11'),

('Career Networking Event',
 'Canary Wharf Business Hub, London E14 5AB',
 '2026-04-25','18:00','21:00',
 'Meet young professionals.','2,8,12'),

('Kids Science Day',
 'Science Museum, London SW7 2DD',
 '2026-04-28','11:00','15:00',
 'Fun science experiments for children.','4,9'),

('Cooking Masterclass',
 'Borough Market Kitchen, London SE1 9AL',
 '2026-05-01','14:00','17:00',
 'Learn quick healthy recipes.','6,13'),

('Local History Talk',
 'British Museum, London WC1B 3DG',
 '2026-05-05','17:00','19:00',
 'Talk on London heritage.','7,14'),

('Cycling Group Ride',
 'Richmond Park, London TW10 5HS',
 '2026-05-08','07:00','10:00',
 'Casual group cycling route.','3,15'),

('Meditation Session',
 'Wellness Centre Camden, London NW1 7AA',
 '2026-05-10','18:30','20:00',
 'Guided relaxation session.','2,16'),

('Startup Pitch Night',
 'Google Campus, King’s Cross, London N1C 4AG',
 '2026-05-12','18:00','21:00',
 'Students pitch their startup ideas.','1,5,17'),

('Community Cleanup',
 'Greenwich Park, London SE10 8QY',
 '2026-05-15','09:00','12:00',
 'Volunteer litter cleanup drive.','4,6,18');
