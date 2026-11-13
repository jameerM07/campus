-- =======================================================
-- CAMPUS STAY - Seed Data
-- College Accommodation Finder Web Application
-- =======================================================

USE campus_stay_db;

-- 1. Insert Users
-- Standard password for test users: 'password123'
-- BCrypt hash for 'password123': $2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO
-- (Spring DataInitializer also verifies and creates/updates these on startup)

INSERT INTO users (id, email, password, full_name, phone_number, role, college_name, course, year_of_study, gender, address, status) VALUES
-- Admin
(1, 'admin@campusstay.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'System Administrator', '+91 9876543210', 'ADMIN', NULL, NULL, NULL, 'MALE', 'Campus Stay Headquarters, New Delhi', 'ACTIVE'),

-- 5 Accommodation Owners
(2, 'owner.rajesh@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Rajesh Sharma', '+91 9811223344', 'OWNER', NULL, NULL, NULL, 'MALE', 'Hauz Khas Enclave, New Delhi', 'ACTIVE'),
(3, 'owner.sunita@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Sunita Reddy', '+91 9822334455', 'OWNER', NULL, NULL, NULL, 'FEMALE', 'Rajarajeshwari Nagar, Bengaluru', 'ACTIVE'),
(4, 'owner.vikram@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Vikram Deshmukh', '+91 9833445566', 'OWNER', NULL, NULL, NULL, 'MALE', 'Churchgate, Mumbai', 'ACTIVE'),
(5, 'owner.anita@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Anita Mehta', '+91 9844556677', 'OWNER', NULL, NULL, NULL, 'FEMALE', 'Green Park, New Delhi', 'ACTIVE'),
(6, 'owner.karthik@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Karthik Gowda', '+91 9855667788', 'OWNER', NULL, NULL, NULL, 'MALE', 'Kengeri Satellite Town, Bengaluru', 'ACTIVE'),

-- 5 Students
(7, 'student.aarav@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Aarav Patel', '+91 9123456780', 'STUDENT', 'Indian Institute of Technology (IIT) Delhi', 'B.Tech Computer Science', '2nd Year', 'MALE', 'Room 102, Block A, New Delhi', 'ACTIVE'),
(8, 'student.priya@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Priya Nair', '+91 9123456781', 'STUDENT', 'RV College of Engineering, Bengaluru', 'B.E. Information Science', '3rd Year', 'FEMALE', 'Flat 402, RR Nagar, Bengaluru', 'ACTIVE'),
(9, 'student.rohan@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Rohan Fernandes', '+91 9123456782', 'STUDENT', 'St. Xavier''s College, Mumbai', 'B.Sc Economics', '1st Year', 'MALE', 'Marine Lines, Mumbai', 'ACTIVE'),
(10, 'student.sneha@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Sneha Kapoor', '+91 9123456783', 'STUDENT', 'Indian Institute of Technology (IIT) Delhi', 'M.Tech AI & Data Science', '1st Year', 'FEMALE', 'Safdarjung Enclave, New Delhi', 'ACTIVE'),
(11, 'student.manish@gmail.com', '$2a$10$G0N4iGsmQ3tQf2l5jY7R4uQk0oH1x6g4s5.8a0l0/oF.fG9k6p1gO', 'Manish Verma', '+91 9123456784', 'STUDENT', 'RV College of Engineering, Bengaluru', 'B.E. Mechanical Engineering', '4th Year', 'MALE', 'Mysore Road, Bengaluru', 'ACTIVE');

-- 2. Insert Colleges with Real Landmark Coordinates, State, District, and Taluk
INSERT INTO colleges (id, name, code, city, state, district, taluk, latitude, longitude, address, image_url) VALUES
(1, 'Indian Institute of Technology (IIT) Delhi', 'IITD', 'New Delhi', 'Delhi', 'South Delhi', 'Hauz Khas', 28.54500000, 77.19260000, 'Hauz Khas, New Delhi, Delhi 110016', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'),
(2, 'RV College of Engineering, Bengaluru', 'RVCE', 'Bengaluru', 'Karnataka', 'Bengaluru Urban', 'Bengaluru South (Kengeri)', 12.92380000, 77.49870000, 'Mysore Road, RV Vidyaniketan Post, Bengaluru, Karnataka 560059', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'),
(3, 'St. Xavier''s College, Mumbai', 'SXC', 'Mumbai', 'Maharashtra', 'Mumbai City', 'Fort / Colaba', 18.94380000, 72.83180000, '5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Terminus Area, Fort, Mumbai, Maharashtra 400001', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'),
(4, 'University of Delhi (North Campus)', 'DU', 'New Delhi', 'Delhi', 'North Delhi', 'Civil Lines', 28.68920000, 77.20980000, 'University Enclave, New Delhi, Delhi 110007', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'),
(5, 'Jawaharlal Nehru University (JNU)', 'JNU', 'New Delhi', 'Delhi', 'South West Delhi', 'Vasant Vihar', 28.53980000, 77.16640000, 'New Mehrauli Road, JNU Ring Rd, New Delhi 110067', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'),
(6, 'Indian Institute of Science (IISc)', 'IISC', 'Bengaluru', 'Karnataka', 'Bengaluru Urban', 'Bengaluru North (Malleshwaram)', 13.02190000, 77.56710000, 'CV Raman Rd, Bengaluru, Karnataka 560012', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'),
(7, 'PES University', 'PESU', 'Bengaluru', 'Karnataka', 'Bengaluru Urban', 'Bengaluru South (Banashankari)', 12.93450000, 77.53450000, '100 Feet Ring Road, BSK III Stage, Bengaluru, Karnataka 560085', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'),
(8, 'Indian Institute of Technology (IIT) Bombay', 'IITB', 'Mumbai', 'Maharashtra', 'Mumbai Suburban', 'Kurla (Powai)', 19.13340000, 72.91330000, 'Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'),
(9, 'College of Engineering Pune (COEP)', 'COEP', 'Pune', 'Maharashtra', 'Pune', 'Haveli (Shivajinagar)', 18.52930000, 73.85650000, 'Wellesley Rd, Shivajinagar, Pune, Maharashtra 411005', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'),
(10, 'Savitribai Phule Pune University', 'SPPU', 'Pune', 'Maharashtra', 'Pune', 'Haveli (Ganeshkhind)', 18.55290000, 73.82660000, 'Ganeshkhind, Pune, Maharashtra 411007', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'),
(11, 'IIIT Hyderabad', 'IIITH', 'Hyderabad', 'Telangana', 'Rangareddy', 'Serilingampally (Gachibowli)', 17.44550000, 78.34890000, 'Prof. C R Rao Road, Gachibowli, Hyderabad, Telangana 500032', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'),
(12, 'Indian Institute of Technology (IIT) Hyderabad', 'IITH', 'Hyderabad', 'Telangana', 'Sangareddy', 'Kandi', 17.59470000, 78.12300000, 'Near NH-65, Sangareddy, Kandi, Telangana 502285', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'),
(13, 'Indian Institute of Technology (IIT) Madras', 'IITM', 'Chennai', 'Tamil Nadu', 'Chennai', 'Guindy / Adyar', 12.99150000, 80.23370000, 'Sardar Patel Rd, Beside C.L.R.I, Adyar, Chennai, Tamil Nadu 600036', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'),
(14, 'Anna University', 'ANNA', 'Chennai', 'Tamil Nadu', 'Chennai', 'Guindy', 13.01090000, 80.23540000, '12, Sardar Patel Rd, Guindy, Chennai, Tamil Nadu 600025', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'),
(15, 'Jadavpur University', 'JU', 'Kolkata', 'West Bengal', 'Kolkata', 'Jadavpur', 22.49890000, 88.37180000, '188, Raja S.C. Mallick Rd, Jadavpur, Kolkata, West Bengal 700032', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'),
(16, 'Malaviya National Institute of Technology (MNIT)', 'MNIT', 'Jaipur', 'Rajasthan', 'Jaipur', 'Sanganer (Malviya Nagar)', 26.86400000, 75.81100000, 'Jawaharlal Nehru Marg, Jhalana Doongri, Jaipur, Rajasthan 302017', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80');

-- 3. Insert Owner Verifications
INSERT INTO owner_verifications (id, user_id, document_type, document_number, document_url, verification_status, submitted_at, reviewed_at) VALUES
(1, 2, 'Aadhaar Card', '9876-5432-1098', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80', 'VERIFIED', NOW(), NOW()),
(2, 3, 'PAN Card', 'ABCDE1234F', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80', 'VERIFIED', NOW(), NOW()),
(3, 4, 'Passport', 'Z1234567', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80', 'VERIFIED', NOW(), NOW()),
(4, 5, 'Voter ID', 'VTR99887766', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80', 'PENDING', NOW(), NULL),
(5, 6, 'Aadhaar Card', '4567-8901-2345', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80', 'VERIFIED', NOW(), NOW());

-- 4. Insert Properties
-- Properties 1-5 near IIT Delhi (within 5 km)
-- Property 6 near IIT Delhi but 10.5 km away (outside 5 km)
-- Properties 7-9 near RVCE Bengaluru (within 5 km)
-- Property 10 near RVCE but 12 km away (outside 5 km)
-- Properties 11-12 near St. Xavier's Mumbai (within 5 km)
INSERT INTO properties (id, owner_id, college_id, title, property_type, description, address, city, state, pin_code, latitude, longitude, monthly_rent, security_deposit, room_sharing_type, total_rooms, available_rooms, gender_preference, food_available, food_description, wifi, laundry, parking, ac, contact_number, status) VALUES
-- 1. Near IIT Delhi (0.6 km)
(1, 2, 1, 'Green Olive Boys Hostel & PG', 'HOSTEL', 'Modern student hostel located right behind IIT Delhi main gate. Includes 3 wholesome meals daily, high-speed fiber internet, and biometric entry.', 'B-12, Jia Sarai, Near IIT Gate 2', 'New Delhi', 'Delhi', '110016', 28.54120000, 77.19700000, 8500.00, 8500.00, 'DOUBLE', 18, 4, 'BOYS', TRUE, 'North & South Indian meals (Breakfast, Lunch, Dinner)', TRUE, TRUE, FALSE, TRUE, '+91 9811223344', 'APPROVED'),

-- 2. Near IIT Delhi (1.2 km)
(2, 5, 1, 'Sai Nilayam Luxury Girls PG', 'PG', 'Premium safe girls accommodation with 24/7 CCTV, fingerprint security, study tables, air conditioning, and nutritionist-curated meals.', 'C-45, Hauz Khas Enclave', 'New Delhi', 'Delhi', '110016', 28.55250000, 77.20150000, 11500.00, 15000.00, 'SINGLE', 12, 2, 'GIRLS', TRUE, '3 hot meals daily + evening snacks & tea', TRUE, TRUE, TRUE, TRUE, '+91 9844556677', 'APPROVED'),

-- 3. Near IIT Delhi (1.4 km)
(3, 2, 1, 'Campus Edge Shared 2BHK Apartment', 'APARTMENT', 'Spacious semi-furnished apartment ideal for 4 students sharing. Walking distance to Metro and IIT campus. Separate kitchen and balcony.', 'Flat 301, Block 7, Ber Sarai', 'New Delhi', 'Delhi', '110016', 28.53500000, 77.18500000, 14000.00, 20000.00, 'DOUBLE', 4, 1, 'CO_ED', FALSE, 'Self-cooking kitchen with gas stove available', TRUE, TRUE, TRUE, TRUE, '+91 9811223344', 'APPROVED'),

-- 4. Near IIT Delhi (2.3 km)
(4, 5, 1, 'Scholar''s Haven Budget PG', 'RENTAL_ROOM', 'Affordable quiet rooms for serious students and researchers. Well-ventilated, library quiet zone, power backup.', 'House 22, Green Park Main Market', 'New Delhi', 'Delhi', '110016', 28.56000000, 77.21000000, 6800.00, 5000.00, 'TRIPLE', 10, 3, 'BOYS', TRUE, 'Homestyle vegetarian meals included', TRUE, FALSE, FALSE, FALSE, '+91 9844556677', 'APPROVED'),

-- 5. Near IIT Delhi (4.2 km)
(5, 2, 1, 'Metro Residency Student Suites', 'HOSTEL', 'Brand new hostel building with recreation zone, gym, rooftop study cafe, and elevator access. Bus and metro nearby.', 'Plot 88, Safdarjung Enclave', 'New Delhi', 'Delhi', '110029', 28.57200000, 77.22500000, 9500.00, 9500.00, 'DOUBLE', 25, 8, 'CO_ED', TRUE, 'Buffet system multi-cuisine dining', TRUE, TRUE, TRUE, TRUE, '+91 9811223344', 'APPROVED'),

-- 6. OUTSIDE 5 KM from IIT Delhi (~10.5 km) - Should be excluded by 5 KM search
(6, 2, 1, 'Connaught Grand Deluxe Rooms', 'RENTAL_ROOM', 'Central Delhi luxury rooms located far from south campus. Ideal for working professionals.', 'Radial Road 4, Connaught Place', 'New Delhi', 'Delhi', '110001', 28.63040000, 77.21770000, 18000.00, 20000.00, 'SINGLE', 8, 2, 'CO_ED', FALSE, 'No food included', TRUE, TRUE, TRUE, TRUE, '+91 9811223344', 'APPROVED'),

-- 7. Near RVCE Bengaluru (0.7 km)
(7, 3, 2, 'RV Pride Boys Hostel', 'HOSTEL', 'Right opposite RVCE campus back gate. No transport required. 1 Gbps Wi-Fi, solar hot water, study halls.', 'No. 15, RV Vidyaniketan, Mysore Road', 'Bengaluru', 'Karnataka', '560059', 12.92800000, 77.50200000, 8800.00, 10000.00, 'DOUBLE', 20, 5, 'BOYS', TRUE, 'South & North Indian hygienic food', TRUE, TRUE, TRUE, FALSE, '+91 9822334455', 'APPROVED'),

-- 8. Near RVCE Bengaluru (1.5 km)
(8, 6, 2, 'Royal Orchid Luxury Girls PG', 'PG', 'Secured gated community PG for girls with CCTV, resident warden, spacious rooms with study tables and attached bathrooms.', '4th Cross, Ideal Homes, RR Nagar', 'Bengaluru', 'Karnataka', '560098', 12.91500000, 77.50800000, 10500.00, 12000.00, 'DOUBLE', 15, 3, 'GIRLS', TRUE, 'Unlimited tasty food with fruit & milk', TRUE, TRUE, FALSE, TRUE, '+91 9855667788', 'APPROVED'),

-- 9. Near RVCE Bengaluru (3.2 km)
(9, 3, 2, 'TechNest Studio Living', 'APARTMENT', 'Fully furnished 1BHK & Studio serviced apartments for college seniors and interns. Rooftop lounge.', 'Kengeri Satellite Town, Phase 1', 'Bengaluru', 'Karnataka', '560060', 12.93500000, 77.52500000, 14500.00, 15000.00, 'SINGLE', 10, 4, 'CO_ED', FALSE, 'Private kitchenette with microwave and fridge', TRUE, TRUE, TRUE, TRUE, '+91 9822334455', 'APPROVED'),

-- 10. OUTSIDE 5 KM from RVCE Bengaluru (~12.5 km) - Should be excluded by 5 KM search
(10, 6, 2, 'MG Metro Heights Hostel', 'HOSTEL', 'Hostel located in central Bangalore CBD near MG Road.', 'Church Street, Off MG Road', 'Bengaluru', 'Karnataka', '560001', 12.97400000, 77.60600000, 16000.00, 16000.00, 'SINGLE', 12, 1, 'CO_ED', TRUE, 'Breakfast included', TRUE, TRUE, FALSE, TRUE, '+91 9855667788', 'APPROVED'),

-- 11. Near St. Xavier's Mumbai (0.9 km)
(11, 4, 3, 'Marine View Student PG', 'PG', 'Prime South Mumbai accommodation 10 minutes walk from St. Xavier''s College. Beautiful airy sea-breeze rooms.', '32, Marine Lines, Near Station', 'Mumbai', 'Maharashtra', '400002', 18.94100000, 72.82500000, 16500.00, 20000.00, 'DOUBLE', 14, 2, 'CO_ED', TRUE, 'Breakfast and dinner homestyle tiffin', TRUE, TRUE, FALSE, TRUE, '+91 9833445566', 'APPROVED'),

-- 12. Near St. Xavier's Mumbai (1.2 km) - PENDING status for Admin Approval testing!
(12, 4, 3, 'Heritage Lane Girls Hostel', 'HOSTEL', 'Victorian architecture converted modern hostel. High ceilings, wooden flooring, peaceful courtyard.', '18, Waudby Road, Fort', 'Mumbai', 'Maharashtra', '400001', 18.95200000, 72.83500000, 13000.00, 15000.00, 'TRIPLE', 16, 6, 'GIRLS', TRUE, 'Pure veg breakfast and dinner', TRUE, TRUE, FALSE, FALSE, '+91 9833445566', 'PENDING');

-- 5. Insert Property Images
INSERT INTO property_images (property_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', TRUE),
(1, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', FALSE),
(2, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', TRUE),
(2, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', FALSE),
(3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', TRUE),
(4, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', TRUE),
(5, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', TRUE),
(6, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', TRUE),
(7, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', TRUE),
(8, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', TRUE),
(9, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', TRUE),
(10, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', TRUE),
(11, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', TRUE),
(12, 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80', TRUE);

-- 6. Insert Sample Bookings
INSERT INTO bookings (id, property_id, student_id, expected_move_in_date, message, status, owner_notes) VALUES
(1, 1, 7, '2026-12-01', 'Hi Rajesh sir, I am a 2nd year CS student at IIT Delhi looking for double sharing from next month.', 'ACCEPTED', 'Confirmed room 204. Please bring college ID upon check-in.'),
(2, 2, 10, '2026-11-20', 'Hello Sunita maam, joining M.Tech at IITD. Need single room with Wi-Fi and food.', 'PENDING', NULL),
(3, 7, 8, '2026-12-10', 'Hi, looking for double sharing accommodation near RVCE.', 'ACCEPTED', 'Welcome Priya! Room 108 is reserved.'),
(4, 8, 11, '2026-11-25', 'Inquiring about availability for boys.', 'REJECTED', 'Apologies, this is strictly a female-only accommodation.');

-- 7. Insert Sample Reviews
INSERT INTO reviews (property_id, student_id, rating, comment) VALUES
(1, 7, 5, 'Best hostel near IIT Delhi! The food is genuinely delicious and internet speed is consistently over 100 Mbps.'),
(7, 8, 4, 'Very close to RVCE gate. Helpful owner and clean washrooms.'),
(11, 9, 5, 'Unbeatable location in South Mumbai. Sea view from the balcony!');

-- 8. Insert Sample Saved Properties
INSERT INTO saved_properties (student_id, property_id) VALUES
(7, 1),
(7, 2),
(8, 7),
(8, 8);

-- 9. Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, is_read, notification_type, related_id) VALUES
(7, 'Booking Confirmed!', 'Your booking for Green Olive Boys Hostel & PG has been accepted by owner Rajesh Sharma.', TRUE, 'BOOKING', 1),
(8, 'Booking Confirmed!', 'Your booking for RV Pride Boys Hostel has been accepted by owner Sunita Reddy.', FALSE, 'BOOKING', 3),
(10, 'Booking Submitted', 'Your booking request for Sai Nilayam Luxury Girls PG has been sent to the owner.', FALSE, 'BOOKING', 2),
(2, 'New Booking Request', 'Student Aarav Patel has requested a booking for Green Olive Boys Hostel.', TRUE, 'BOOKING', 1),
(1, 'Pending Property Listing', 'New property "Heritage Lane Girls Hostel" submitted by Vikram Deshmukh requires your review.', FALSE, 'PROPERTY_STATUS', 12);

