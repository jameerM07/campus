package com.campusstay.config;

import com.campusstay.entity.*;
import com.campusstay.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final OwnerVerificationRepository ownerVerificationRepository;
    private final SavedPropertyRepository savedPropertyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CollegeRepository collegeRepository,
                           PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           BookingRepository bookingRepository,
                           ReviewRepository reviewRepository,
                           NotificationRepository notificationRepository,
                           OwnerVerificationRepository ownerVerificationRepository,
                           SavedPropertyRepository savedPropertyRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.ownerVerificationRepository = ownerVerificationRepository;
        this.savedPropertyRepository = savedPropertyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Initializing Campus Stay sample dataset with realistic college landmarks and properties...");

        // 1. Seed Users
        String defaultPasswordHash = passwordEncoder.encode("password123");
        String adminPasswordHash = passwordEncoder.encode("admin123");

        // Admin
        User admin = new User("admin@campusstay.com", adminPasswordHash, "System Administrator", "+91 9876543210", Role.ADMIN);
        admin.setAddress("Campus Stay HQ, Connaught Place, New Delhi");
        admin = userRepository.save(admin);

        // 5 Owners
        User oRajesh = new User("owner.rajesh@gmail.com", defaultPasswordHash, "Rajesh Sharma", "+91 9811223344", Role.OWNER);
        oRajesh.setAddress("Hauz Khas Enclave, New Delhi");
        oRajesh = userRepository.save(oRajesh);

        User oSunita = new User("owner.sunita@gmail.com", defaultPasswordHash, "Sunita Reddy", "+91 9822334455", Role.OWNER);
        oSunita.setAddress("Rajarajeshwari Nagar, Bengaluru");
        oSunita = userRepository.save(oSunita);

        User oVikram = new User("owner.vikram@gmail.com", defaultPasswordHash, "Vikram Deshmukh", "+91 9833445566", Role.OWNER);
        oVikram.setAddress("Churchgate, Mumbai");
        oVikram = userRepository.save(oVikram);

        User oAnita = new User("owner.anita@gmail.com", defaultPasswordHash, "Anita Mehta", "+91 9844556677", Role.OWNER);
        oAnita.setAddress("Green Park, New Delhi");
        oAnita = userRepository.save(oAnita);

        User oKarthik = new User("owner.karthik@gmail.com", defaultPasswordHash, "Karthik Gowda", "+91 9855667788", Role.OWNER);
        oKarthik.setAddress("Kengeri Satellite Town, Bengaluru");
        oKarthik = userRepository.save(oKarthik);

        User oRahul = new User("owner.rahul@gmail.com", defaultPasswordHash, "Rahul Joshi", "+91 9866778899", Role.OWNER);
        oRahul.setAddress("Shivajinagar, Pune");
        oRahul = userRepository.save(oRahul);

        User oSuresh = new User("owner.suresh@gmail.com", defaultPasswordHash, "Suresh Reddy", "+91 9877889900", Role.OWNER);
        oSuresh.setAddress("Gachibowli, Hyderabad");
        oSuresh = userRepository.save(oSuresh);

        User oMeenakshi = new User("owner.meenakshi@gmail.com", defaultPasswordHash, "Meenakshi Sundaram", "+91 9888990011", Role.OWNER);
        oMeenakshi.setAddress("Adyar, Chennai");
        oMeenakshi = userRepository.save(oMeenakshi);

        User oAmit = new User("owner.amit@gmail.com", defaultPasswordHash, "Amit Sen", "+91 9899001122", Role.OWNER);
        oAmit.setAddress("Salt Lake City, Kolkata");
        oAmit = userRepository.save(oAmit);

        // 5 Students
        User sAarav = new User("student.aarav@gmail.com", defaultPasswordHash, "Aarav Patel", "+91 9123456780", Role.STUDENT);
        sAarav.setCollegeName("Indian Institute of Technology (IIT) Delhi");
        sAarav.setCourse("B.Tech Computer Science");
        sAarav.setYearOfStudy("2nd Year");
        sAarav.setGender(Gender.MALE);
        sAarav = userRepository.save(sAarav);

        User sPriya = new User("student.priya@gmail.com", defaultPasswordHash, "Priya Nair", "+91 9123456781", Role.STUDENT);
        sPriya.setCollegeName("RV College of Engineering, Bengaluru");
        sPriya.setCourse("B.E. Information Science");
        sPriya.setYearOfStudy("3rd Year");
        sPriya.setGender(Gender.FEMALE);
        sPriya = userRepository.save(sPriya);

        User sRohan = new User("student.rohan@gmail.com", defaultPasswordHash, "Rohan Fernandes", "+91 9123456782", Role.STUDENT);
        sRohan.setCollegeName("St. Xavier's College, Mumbai");
        sRohan.setCourse("B.Sc Economics");
        sRohan.setYearOfStudy("1st Year");
        sRohan.setGender(Gender.MALE);
        sRohan = userRepository.save(sRohan);

        User sSneha = new User("student.sneha@gmail.com", defaultPasswordHash, "Sneha Kapoor", "+91 9123456783", Role.STUDENT);
        sSneha.setCollegeName("Indian Institute of Technology (IIT) Delhi");
        sSneha.setCourse("M.Tech AI & Data Science");
        sSneha.setYearOfStudy("1st Year");
        sSneha.setGender(Gender.FEMALE);
        sSneha = userRepository.save(sSneha);

        User sManish = new User("student.manish@gmail.com", defaultPasswordHash, "Manish Verma", "+91 9123456784", Role.STUDENT);
        sManish.setCollegeName("RV College of Engineering, Bengaluru");
        sManish.setCourse("B.E. Mechanical Engineering");
        sManish.setYearOfStudy("4th Year");
        sManish.setGender(Gender.MALE);
        sManish = userRepository.save(sManish);

        // 2. Seed Colleges (with State, District, and Taluk hierarchy)
        College cIITD = new College(
                "Indian Institute of Technology (IIT) Delhi",
                "IITD",
                "New Delhi",
                "Delhi",
                "South Delhi",
                "Hauz Khas",
                28.5450,
                77.1926,
                "Hauz Khas, New Delhi, Delhi 110016",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cIITD = collegeRepository.save(cIITD);

        College cDU = new College(
                "University of Delhi (North Campus)",
                "DU",
                "New Delhi",
                "Delhi",
                "North Delhi",
                "Civil Lines",
                28.6892,
                77.2098,
                "University Enclave, New Delhi, Delhi 110007",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        );
        cDU = collegeRepository.save(cDU);

        College cJNU = new College(
                "Jawaharlal Nehru University (JNU)",
                "JNU",
                "New Delhi",
                "Delhi",
                "South West Delhi",
                "Vasant Vihar",
                28.5398,
                77.1664,
                "New Mehrauli Road, JNU Ring Rd, New Delhi 110067",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        );
        cJNU = collegeRepository.save(cJNU);

        College cRVCE = new College(
                "RV College of Engineering, Bengaluru",
                "RVCE",
                "Bengaluru",
                "Karnataka",
                "Bengaluru Urban",
                "Bengaluru South (Kengeri)",
                12.9238,
                77.4987,
                "Mysore Road, RV Vidyaniketan Post, Bengaluru, Karnataka 560059",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        );
        cRVCE = collegeRepository.save(cRVCE);

        College cIISC = new College(
                "Indian Institute of Science (IISc)",
                "IISC",
                "Bengaluru",
                "Karnataka",
                "Bengaluru Urban",
                "Bengaluru North (Malleshwaram)",
                13.0219,
                77.5671,
                "CV Raman Rd, Bengaluru, Karnataka 560012",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cIISC = collegeRepository.save(cIISC);

        College cPESU = new College(
                "PES University",
                "PESU",
                "Bengaluru",
                "Karnataka",
                "Bengaluru Urban",
                "Bengaluru South (Banashankari)",
                12.9345,
                77.5345,
                "100 Feet Ring Road, BSK III Stage, Bengaluru, Karnataka 560085",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        );
        cPESU = collegeRepository.save(cPESU);

        College cNITK = new College(
                "NITK Surathkal",
                "NITK",
                "Mangaluru",
                "Karnataka",
                "Dakshina Kannada",
                "Mangaluru (Surathkal)",
                13.0108,
                74.7943,
                "NH 66, Srinivasnagar, Surathkal, Mangaluru, Karnataka 575025",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cNITK = collegeRepository.save(cNITK);

        College cSXC = new College(
                "St. Xavier's College, Mumbai",
                "SXC",
                "Mumbai",
                "Maharashtra",
                "Mumbai City",
                "Fort / Colaba",
                18.9438,
                72.8318,
                "5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Terminus Area, Fort, Mumbai 400001",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        );
        cSXC = collegeRepository.save(cSXC);

        College cIITB = new College(
                "Indian Institute of Technology (IIT) Bombay",
                "IITB",
                "Mumbai",
                "Maharashtra",
                "Mumbai Suburban",
                "Kurla (Powai)",
                19.1334,
                72.9133,
                "Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cIITB = collegeRepository.save(cIITB);

        College cCOEP = new College(
                "College of Engineering Pune (COEP)",
                "COEP",
                "Pune",
                "Maharashtra",
                "Pune",
                "Haveli (Shivajinagar)",
                18.5293,
                73.8565,
                "Wellesley Rd, Shivajinagar, Pune, Maharashtra 411005",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        );
        cCOEP = collegeRepository.save(cCOEP);

        College cSPPU = new College(
                "Savitribai Phule Pune University",
                "SPPU",
                "Pune",
                "Maharashtra",
                "Pune",
                "Haveli (Ganeshkhind)",
                18.5529,
                73.8266,
                "Ganeshkhind, Pune, Maharashtra 411007",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        );
        cSPPU = collegeRepository.save(cSPPU);

        College cIIITH = new College(
                "IIIT Hyderabad",
                "IIITH",
                "Hyderabad",
                "Telangana",
                "Rangareddy",
                "Serilingampally (Gachibowli)",
                17.4455,
                78.3489,
                "Prof. C R Rao Road, Gachibowli, Hyderabad, Telangana 500032",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cIIITH = collegeRepository.save(cIIITH);

        College cIITH = new College(
                "Indian Institute of Technology (IIT) Hyderabad",
                "IITH",
                "Hyderabad",
                "Telangana",
                "Sangareddy",
                "Kandi",
                17.5947,
                78.1230,
                "Near NH-65, Sangareddy, Kandi, Telangana 502285",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        );
        cIITH = collegeRepository.save(cIITH);

        College cIITM = new College(
                "Indian Institute of Technology (IIT) Madras",
                "IITM",
                "Chennai",
                "Tamil Nadu",
                "Chennai",
                "Guindy / Adyar",
                12.9915,
                80.2337,
                "Sardar Patel Rd, Beside C.L.R.I, Adyar, Chennai, Tamil Nadu 600036",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cIITM = collegeRepository.save(cIITM);

        College cANNA = new College(
                "Anna University",
                "ANNA",
                "Chennai",
                "Tamil Nadu",
                "Chennai",
                "Guindy",
                13.0109,
                80.2354,
                "12, Sardar Patel Rd, Guindy, Chennai, Tamil Nadu 600025",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
        );
        cANNA = collegeRepository.save(cANNA);

        College cJU = new College(
                "Jadavpur University",
                "JU",
                "Kolkata",
                "West Bengal",
                "Kolkata",
                "Jadavpur",
                22.4989,
                88.3718,
                "188, Raja S.C. Mallick Rd, Jadavpur, Kolkata, West Bengal 700032",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
        );
        cJU = collegeRepository.save(cJU);

        College cMNIT = new College(
                "Malaviya National Institute of Technology (MNIT)",
                "MNIT",
                "Jaipur",
                "Rajasthan",
                "Jaipur",
                "Sanganer (Malviya Nagar)",
                26.8640,
                75.8110,
                "Jawaharlal Nehru Marg, Jhalana Doongri, Jaipur, Rajasthan 302017",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
        );
        cMNIT = collegeRepository.save(cMNIT);

        // Additional Colleges Across India (Karnataka, Maharashtra, Delhi, Tamil Nadu, UP, WB, Kerala, Gujarat)
        // Karnataka
        collegeRepository.save(new College(
                "BMS College of Engineering", "BMSCE", "Bengaluru", "Karnataka", "Bengaluru Urban", "Bengaluru South (Basavanagudi)",
                12.9411, 77.5655, "Bull Temple Rd, Basavanagudi, Bengaluru, Karnataka 560019",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Ramaiah Institute of Technology", "MSRIT", "Bengaluru", "Karnataka", "Bengaluru Urban", "Bengaluru North (Mathikere)",
                13.0305, 77.5649, "MSR Nagar, Mathikere, Bengaluru, Karnataka 560054",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Manipal Institute of Technology", "MIT-MANIPAL", "Manipal", "Karnataka", "Udupi", "Udupi (Manipal)",
                13.3525, 74.7928, "Eshwar Nagar, Manipal, Karnataka 576104",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "National Institute of Engineering (NIE)", "NIE", "Mysuru", "Karnataka", "Mysuru", "Mysuru (Manandavadi)",
                12.2842, 76.6409, "Manandavadi Road, Mysuru, Karnataka 570008",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        // Maharashtra
        collegeRepository.save(new College(
                "Veermata Jijabai Technological Institute (VJTI)", "VJTI", "Mumbai", "Maharashtra", "Mumbai City", "Matunga",
                19.0222, 72.8561, "H R Mahajani Marg, Matunga, Mumbai, Maharashtra 400019",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Visvesvaraya National Institute of Technology (VNIT)", "VNIT", "Nagpur", "Maharashtra", "Nagpur", "Nagpur Urban",
                21.1255, 79.0519, "South Ambazari Road, Nagpur, Maharashtra 440010",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        // Delhi
        collegeRepository.save(new College(
                "Delhi Technological University (DTU)", "DTU", "New Delhi", "Delhi", "North West Delhi", "Rohini (Shahbad)",
                28.7501, 77.1177, "Shahbad Daulatpur, Main Bawana Road, Delhi 110042",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Netaji Subhas University of Technology (NSUT)", "NSUT", "New Delhi", "Delhi", "South West Delhi", "Dwarka",
                28.6100, 77.0381, "Sector 3, Dwarka, New Delhi, Delhi 110078",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        // Tamil Nadu
        collegeRepository.save(new College(
                "National Institute of Technology (NIT) Trichy", "NITT", "Tiruchirappalli", "Tamil Nadu", "Tiruchirappalli", "Thuvakudi",
                10.7589, 78.8132, "Tanjore Main Road, National Highway 67, Tiruchirappalli, Tamil Nadu 620015",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "PSG College of Technology", "PSG", "Coimbatore", "Tamil Nadu", "Coimbatore", "Coimbatore North (Peelamedu)",
                11.0247, 77.0028, "Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Vellore Institute of Technology (VIT)", "VIT-VELLORE", "Vellore", "Tamil Nadu", "Vellore", "Katpadi",
                12.9692, 79.1559, "Near Katpadi Road, Vellore, Tamil Nadu 632014",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        // Uttar Pradesh
        collegeRepository.save(new College(
                "Indian Institute of Technology (IIT) Kanpur", "IITK", "Kanpur", "Uttar Pradesh", "Kanpur Nagar", "Kalyanpur",
                26.5123, 80.2329, "Kalyanpur, Kanpur, Uttar Pradesh 208016",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Indian Institute of Technology (BHU) Varanasi", "IIT-BHU", "Varanasi", "Uttar Pradesh", "Varanasi", "Lanka",
                25.2677, 82.9913, "Banaras Hindu University Campus, Varanasi, Uttar Pradesh 221005",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        // West Bengal
        collegeRepository.save(new College(
                "Indian Institute of Technology (IIT) Kharagpur", "IITKGP", "Kharagpur", "West Bengal", "Paschim Medinipur", "Kharagpur",
                22.3149, 87.3105, "Kharagpur, West Bengal 721302",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"));

        // Kerala
        collegeRepository.save(new College(
                "National Institute of Technology (NIT) Calicut", "NITC", "Kozhikode", "Kerala", "Kozhikode", "Chathamangalam",
                11.3216, 75.9336, "NIT Campus P.O, Kozhikode, Kerala 673601",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"));

        collegeRepository.save(new College(
                "Cochin University of Science and Technology (CUSAT)", "CUSAT", "Kochi", "Kerala", "Ernakulam", "Kalamassery",
                10.0440, 76.3268, "South Kalamassery, Kalamassery, Kochi, Kerala 682022",
                "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"));

        // Gujarat
        collegeRepository.save(new College(
                "Indian Institute of Technology (IIT) Gandhinagar", "IITGN", "Gandhinagar", "Gujarat", "Gandhinagar", "Palaj",
                23.2114, 72.6842, "Palaj, Gandhinagar, Gujarat 382355",
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"));

        // 3. Seed Owner Verifications
        OwnerVerification ov1 = new OwnerVerification(oRajesh, "Aadhaar Card", "9876-5432-1098", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80");
        ov1.setVerificationStatus(VerificationStatus.VERIFIED);
        ov1.setReviewedAt(LocalDateTime.now());
        ownerVerificationRepository.save(ov1);

        OwnerVerification ov2 = new OwnerVerification(oSunita, "PAN Card", "ABCDE1234F", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80");
        ov2.setVerificationStatus(VerificationStatus.VERIFIED);
        ov2.setReviewedAt(LocalDateTime.now());
        ownerVerificationRepository.save(ov2);

        OwnerVerification ov3 = new OwnerVerification(oVikram, "Passport", "Z1234567", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80");
        ov3.setVerificationStatus(VerificationStatus.VERIFIED);
        ov3.setReviewedAt(LocalDateTime.now());
        ownerVerificationRepository.save(ov3);

        OwnerVerification ov4 = new OwnerVerification(oAnita, "Voter ID", "VTR99887766", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80");
        ov4.setVerificationStatus(VerificationStatus.PENDING);
        ownerVerificationRepository.save(ov4);

        OwnerVerification ov5 = new OwnerVerification(oKarthik, "Aadhaar Card", "4567-8901-2345", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80");
        ov5.setVerificationStatus(VerificationStatus.VERIFIED);
        ov5.setReviewedAt(LocalDateTime.now());
        ownerVerificationRepository.save(ov5);

        // 4. Seed Properties
        // Near IIT Delhi (0.6 km)
        Property p1 = createProp(oRajesh, cIITD, "Green Olive Boys Hostel & PG", PropertyType.HOSTEL,
                "Modern student hostel located right behind IIT Delhi main gate. Includes 3 wholesome meals daily, high-speed fiber internet, and biometric entry.",
                "B-12, Jia Sarai, Near IIT Gate 2", "New Delhi", "Delhi", "110016",
                28.5412, 77.1970, 8500.0, 8500.0, RoomSharingType.DOUBLE, 18, 4,
                GenderPreference.BOYS, true, "North & South Indian meals (Breakfast, Lunch, Dinner)",
                true, true, false, true, "+91 9811223344", PropertyStatus.APPROVED);
        addImages(p1,
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80");

        // Near IIT Delhi (1.2 km)
        Property p2 = createProp(oAnita, cIITD, "Sai Nilayam Luxury Girls PG", PropertyType.PG,
                "Premium safe girls accommodation with 24/7 CCTV, fingerprint security, study tables, air conditioning, and nutritionist-curated meals.",
                "C-45, Hauz Khas Enclave", "New Delhi", "Delhi", "110016",
                28.5525, 77.2015, 11500.0, 15000.0, RoomSharingType.SINGLE, 12, 2,
                GenderPreference.GIRLS, true, "3 hot meals daily + evening snacks & tea",
                true, true, true, true, "+91 9844556677", PropertyStatus.APPROVED);
        addImages(p2,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80");

        // Near IIT Delhi (1.4 km)
        Property p3 = createProp(oRajesh, cIITD, "Campus Edge Shared 2BHK Apartment", PropertyType.APARTMENT,
                "Spacious semi-furnished apartment ideal for 4 students sharing. Walking distance to Metro and IIT campus. Separate kitchen and balcony.",
                "Flat 301, Block 7, Ber Sarai", "New Delhi", "Delhi", "110016",
                28.5350, 77.1850, 14000.0, 20000.0, RoomSharingType.DOUBLE, 4, 1,
                GenderPreference.CO_ED, false, "Self-cooking kitchen with gas stove available",
                true, true, true, true, "+91 9811223344", PropertyStatus.APPROVED);
        addImages(p3, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80");

        // Near IIT Delhi (2.3 km)
        Property p4 = createProp(oAnita, cIITD, "Scholar's Haven Budget PG", PropertyType.RENTAL_ROOM,
                "Affordable quiet rooms for serious students and researchers. Well-ventilated, library quiet zone, power backup.",
                "House 22, Green Park Main Market", "New Delhi", "Delhi", "110016",
                28.5600, 77.2100, 6800.0, 5000.0, RoomSharingType.TRIPLE, 10, 3,
                GenderPreference.BOYS, true, "Homestyle vegetarian meals included",
                true, false, false, false, "+91 9844556677", PropertyStatus.APPROVED);
        addImages(p4, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80");

        // Near IIT Delhi (4.2 km)
        Property p5 = createProp(oRajesh, cIITD, "Metro Residency Student Suites", PropertyType.HOSTEL,
                "Brand new hostel building with recreation zone, gym, rooftop study cafe, and elevator access. Bus and metro nearby.",
                "Plot 88, Safdarjung Enclave", "New Delhi", "Delhi", "110029",
                28.5720, 77.2250, 9500.0, 9500.0, RoomSharingType.DOUBLE, 25, 8,
                GenderPreference.CO_ED, true, "Buffet system multi-cuisine dining",
                true, true, true, true, "+91 9811223344", PropertyStatus.APPROVED);
        addImages(p5, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80");

        // OUTSIDE 5 KM from IIT Delhi (~10.5 km) - Negative test property!
        Property p6 = createProp(oRajesh, cIITD, "Connaught Grand Deluxe Rooms", PropertyType.RENTAL_ROOM,
                "Central Delhi luxury rooms located in CP, far from south campus. Excluded from 5 KM radius search.",
                "Radial Road 4, Connaught Place", "New Delhi", "Delhi", "110001",
                28.6304, 77.2177, 18000.0, 20000.0, RoomSharingType.SINGLE, 8, 2,
                GenderPreference.CO_ED, false, "No food included",
                true, true, true, true, "+91 9811223344", PropertyStatus.APPROVED);
        addImages(p6, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");

        // Near RVCE Bengaluru (0.7 km)
        Property p7 = createProp(oSunita, cRVCE, "RV Pride Boys Hostel", PropertyType.HOSTEL,
                "Right opposite RVCE campus back gate. No transport required. 1 Gbps Wi-Fi, solar hot water, study halls.",
                "No. 15, RV Vidyaniketan, Mysore Road", "Bengaluru", "Karnataka", "560059",
                12.9280, 77.5020, 8800.0, 10000.0, RoomSharingType.DOUBLE, 20, 5,
                GenderPreference.BOYS, true, "South & North Indian hygienic food",
                true, true, true, false, "+91 9822334455", PropertyStatus.APPROVED);
        addImages(p7, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80");

        // Near RVCE Bengaluru (1.5 km)
        Property p8 = createProp(oKarthik, cRVCE, "Royal Orchid Luxury Girls PG", PropertyType.PG,
                "Secured gated community PG for girls with CCTV, resident warden, spacious rooms with study tables and attached bathrooms.",
                "4th Cross, Ideal Homes, RR Nagar", "Bengaluru", "Karnataka", "560098",
                12.9150, 77.5080, 10500.0, 12000.0, RoomSharingType.DOUBLE, 15, 3,
                GenderPreference.GIRLS, true, "Unlimited tasty food with fruit & milk",
                true, true, false, true, "+91 9855667788", PropertyStatus.APPROVED);
        addImages(p8, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80");

        // Near RVCE Bengaluru (3.2 km)
        Property p9 = createProp(oSunita, cRVCE, "TechNest Studio Living", PropertyType.APARTMENT,
                "Fully furnished 1BHK & Studio serviced apartments for college seniors and interns. Rooftop lounge.",
                "Kengeri Satellite Town, Phase 1", "Bengaluru", "Karnataka", "560060",
                12.9350, 77.5250, 14500.0, 15000.0, RoomSharingType.SINGLE, 10, 4,
                GenderPreference.CO_ED, false, "Private kitchenette with microwave and fridge",
                true, true, true, true, "+91 9822334455", PropertyStatus.APPROVED);
        addImages(p9, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80");

        // OUTSIDE 5 KM from RVCE Bengaluru (~12.5 km)
        Property p10 = createProp(oKarthik, cRVCE, "MG Metro Heights Hostel", PropertyType.HOSTEL,
                "Hostel located in central Bangalore CBD near MG Road. Far from RVCE.",
                "Church Street, Off MG Road", "Bengaluru", "Karnataka", "560001",
                12.9740, 77.6060, 16000.0, 16000.0, RoomSharingType.SINGLE, 12, 1,
                GenderPreference.CO_ED, true, "Breakfast included",
                true, true, false, true, "+91 9855667788", PropertyStatus.APPROVED);
        addImages(p10, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80");

        // Near St. Xavier's Mumbai (0.9 km)
        Property p11 = createProp(oVikram, cSXC, "Marine View Student PG", PropertyType.PG,
                "Prime South Mumbai accommodation 10 minutes walk from St. Xavier's College. Beautiful airy sea-breeze rooms.",
                "32, Marine Lines, Near Station", "Mumbai", "Maharashtra", "400002",
                18.9410, 72.8250, 16500.0, 20000.0, RoomSharingType.DOUBLE, 14, 2,
                GenderPreference.CO_ED, true, "Breakfast and dinner homestyle tiffin",
                true, true, false, true, "+91 9833445566", PropertyStatus.APPROVED);
        addImages(p11, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80");

        // Near St. Xavier's Mumbai (1.2 km) - PENDING status for Admin Approval testing!
        Property p12 = createProp(oVikram, cSXC, "Heritage Lane Girls Hostel", PropertyType.HOSTEL,
                "Victorian architecture converted modern hostel. High ceilings, wooden flooring, peaceful courtyard.",
                "18, Waudby Road, Fort", "Mumbai", "Maharashtra", "400001",
                18.9520, 72.8350, 13000.0, 15000.0, RoomSharingType.TRIPLE, 16, 6,
                GenderPreference.GIRLS, true, "Pure veg breakfast and dinner",
                true, true, false, false, "+91 9833445566", PropertyStatus.PENDING);
        addImages(p12, "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80");

        // Near IIT Bombay (0.8 km)
        Property p13 = createProp(oVikram, cIITB, "Powai Lake View Boys Hostel", PropertyType.HOSTEL,
                "Scenic hostel overlooking Powai lake, walking distance from IIT Bombay main gate. Fiber Wi-Fi and study lounge.",
                "Opp. Main Gate, Powai", "Mumbai", "Maharashtra", "400076",
                19.1280, 72.9100, 10500.0, 12000.0, RoomSharingType.DOUBLE, 20, 5,
                GenderPreference.BOYS, true, "Homestyle Maharashtra & North Indian food",
                true, true, true, true, "+91 9833445566", PropertyStatus.APPROVED);
        addImages(p13, "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80");

        // Near IIT Bombay (1.8 km)
        Property p14 = createProp(oVikram, cIITB, "Hiranandani Scholar Suites", PropertyType.APARTMENT,
                "Modern serviced 2BHK flat in upscale Hiranandani Gardens. Modern kitchen, AC in all rooms, gym access.",
                "Central Avenue, Hiranandani Gardens, Powai", "Mumbai", "Maharashtra", "400076",
                19.1190, 72.9260, 16000.0, 20000.0, RoomSharingType.DOUBLE, 6, 2,
                GenderPreference.CO_ED, false, "Self-cooking kitchen equipped",
                true, true, true, true, "+91 9833445566", PropertyStatus.APPROVED);
        addImages(p14, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80");

        // Near DU North Campus (0.9 km)
        Property p15 = createProp(oRajesh, cDU, "Kamla Nagar Student Villa", PropertyType.PG,
                "Popular student PG situated in the vibrant Kamla Nagar hub. Clean rooms, daily housekeeping, 3 nutritious meals.",
                "Block E, Kamla Nagar", "New Delhi", "Delhi", "110007",
                28.6820, 77.2030, 9500.0, 10000.0, RoomSharingType.DOUBLE, 16, 4,
                GenderPreference.CO_ED, true, "3 wholesome meals + evening tea",
                true, true, false, true, "+91 9811223344", PropertyStatus.APPROVED);
        addImages(p15, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80");

        // Near DU North Campus (0.7 km)
        Property p16 = createProp(oAnita, cDU, "Hudson Lane Premium Girls PG", PropertyType.PG,
                "Secured girls accommodation next to DU cafes and metro. High security biometric access and study desks.",
                "Hudson Lane, GTB Nagar", "New Delhi", "Delhi", "110009",
                28.6940, 77.2050, 12500.0, 15000.0, RoomSharingType.SINGLE, 12, 3,
                GenderPreference.GIRLS, true, "Chef-prepared North & South Indian meals",
                true, true, false, true, "+91 9844556677", PropertyStatus.APPROVED);
        addImages(p16, "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80");

        // Near IISc Bengaluru (1.4 km)
        Property p17 = createProp(oSunita, cIISC, "Malleshwaram Academic PG", PropertyType.PG,
                "Peaceful living environment for IISc researchers and postgraduates. High-speed 1Gbps internet, library.",
                "15th Cross, Malleshwaram", "Bengaluru", "Karnataka", "560003",
                13.0080, 77.5680, 10000.0, 12000.0, RoomSharingType.SINGLE, 14, 4,
                GenderPreference.CO_ED, true, "Hygienic vegetarian South Indian food",
                true, true, true, false, "+91 9822334455", PropertyStatus.APPROVED);
        addImages(p17, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80");

        // Near COEP Pune (0.6 km)
        Property p18 = createProp(oRahul, cCOEP, "Shivajinagar Student Heights", PropertyType.HOSTEL,
                "Right opposite COEP grounds. Walking distance to railway station and metro. Power backup, solar water.",
                "JM Road, Shivajinagar", "Pune", "Maharashtra", "411005",
                18.5310, 73.8510, 8500.0, 9000.0, RoomSharingType.DOUBLE, 22, 6,
                GenderPreference.BOYS, true, "Pure veg Maharashtrian & Punjabi thali",
                true, true, true, true, "+91 9866778899", PropertyStatus.APPROVED);
        addImages(p18, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80");

        // Near COEP Pune (1.5 km)
        Property p19 = createProp(oRahul, cCOEP, "FC Road Scholar Living", PropertyType.PG,
                "Vibrant student PG located off Fergusson College Road. Modern furniture, high speed Wi-Fi, laundry service.",
                "Deccan Gymkhana, FC Road", "Pune", "Maharashtra", "411004",
                18.5240, 73.8410, 11000.0, 13000.0, RoomSharingType.DOUBLE, 15, 3,
                GenderPreference.CO_ED, true, "Breakfast and dinner included",
                true, true, false, true, "+91 9866778899", PropertyStatus.APPROVED);
        addImages(p19, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80");

        // Near IIIT Hyderabad (0.9 km)
        Property p20 = createProp(oSuresh, cIIITH, "Gachibowli Cyber Nest PG", PropertyType.PG,
                "State-of-the-art PG for computer science and tech students. Ergo chairs, high speed fiber, 24/7 power.",
                "Telecom Nagar, Gachibowli", "Hyderabad", "Telangana", "500032",
                17.4410, 78.3560, 9500.0, 10000.0, RoomSharingType.DOUBLE, 25, 7,
                GenderPreference.CO_ED, true, "South & North Indian meals (3 times)",
                true, true, true, true, "+91 9877889900", PropertyStatus.APPROVED);
        addImages(p20, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80");

        // Near IIT Madras (1.2 km)
        Property p21 = createProp(oMeenakshi, cIITM, "Adyar Green Student Villa", PropertyType.HOSTEL,
                "Tranquil greenery surrounding the hostel right outside IIT Madras Adyar Gate. Silent study zones.",
                "Gandhi Nagar, Adyar", "Chennai", "Tamil Nadu", "600020",
                12.9980, 80.2450, 9000.0, 9500.0, RoomSharingType.DOUBLE, 18, 5,
                GenderPreference.BOYS, true, "Traditional South Indian meals",
                true, true, false, true, "+91 9888990011", PropertyStatus.APPROVED);
        addImages(p21, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80");

        // Near Jadavpur University Kolkata (0.8 km)
        Property p22 = createProp(oAmit, cJU, "Jadavpur Central Student PG", PropertyType.PG,
                "Convenient student stay 5 minutes walk from 8B Bus Stand and Jadavpur campus. Airy rooms with attached bath.",
                "Central Road, Jadavpur", "Kolkata", "West Bengal", "700032",
                22.4930, 88.3680, 7500.0, 8000.0, RoomSharingType.DOUBLE, 14, 4,
                GenderPreference.CO_ED, true, "Bengali & North Indian meals",
                true, true, false, false, "+91 9899001122", PropertyStatus.APPROVED);
        addImages(p22, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80");

        // Near MNIT Jaipur (1.0 km)
        Property p23 = createProp(oAmit, cMNIT, "Malviya Nagar Student Haven", PropertyType.PG,
                "Spacious student residency near World Trade Park and MNIT campus. Rooftop cafe, solar heating, AC.",
                "Sector 4, Malviya Nagar", "Jaipur", "Rajasthan", "302017",
                26.8580, 75.8150, 8000.0, 8000.0, RoomSharingType.DOUBLE, 20, 6,
                GenderPreference.CO_ED, true, "Homestyle Rajasthani & Punjabi food",
                true, true, true, true, "+91 9899001122", PropertyStatus.APPROVED);
        addImages(p23, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80");

        // 5. Seed Bookings
        Booking b1 = new Booking();
        b1.setProperty(p1);
        b1.setStudent(sAarav);
        b1.setExpectedMoveInDate(LocalDate.now().plusWeeks(2));
        b1.setMessage("Hi Rajesh sir, I am a 2nd year CS student at IIT Delhi looking for double sharing from next month.");
        b1.setStatus(BookingStatus.ACCEPTED);
        b1.setOwnerNotes("Confirmed room 204. Please bring college ID upon check-in.");
        bookingRepository.save(b1);

        Booking b2 = new Booking();
        b2.setProperty(p2);
        b2.setStudent(sSneha);
        b2.setExpectedMoveInDate(LocalDate.now().plusDays(10));
        b2.setMessage("Hello Sunita ma'am, joining M.Tech at IITD. Need single room with Wi-Fi and food.");
        b2.setStatus(BookingStatus.PENDING);
        bookingRepository.save(b2);

        Booking b3 = new Booking();
        b3.setProperty(p7);
        b3.setStudent(sPriya);
        b3.setExpectedMoveInDate(LocalDate.now().plusWeeks(3));
        b3.setMessage("Hi, looking for double sharing accommodation near RVCE.");
        b3.setStatus(BookingStatus.ACCEPTED);
        b3.setOwnerNotes("Welcome Priya! Room 108 is reserved.");
        bookingRepository.save(b3);

        Booking b4 = new Booking();
        b4.setProperty(p8);
        b4.setStudent(sManish);
        b4.setExpectedMoveInDate(LocalDate.now().plusWeeks(1));
        b4.setMessage("Inquiring about availability for boys.");
        b4.setStatus(BookingStatus.REJECTED);
        b4.setOwnerNotes("Apologies, this is strictly a female-only accommodation.");
        bookingRepository.save(b4);

        // 6. Seed Reviews
        Review r1 = new Review();
        r1.setProperty(p1);
        r1.setStudent(sAarav);
        r1.setRating(5);
        r1.setComment("Best hostel near IIT Delhi! The food is genuinely delicious and internet speed is consistently over 100 Mbps.");
        reviewRepository.save(r1);

        Review r2 = new Review();
        r2.setProperty(p7);
        r2.setStudent(sPriya);
        r2.setRating(4);
        r2.setComment("Very close to RVCE gate. Helpful owner and clean washrooms.");
        reviewRepository.save(r2);

        Review r3 = new Review();
        r3.setProperty(p11);
        r3.setStudent(sRohan);
        r3.setRating(5);
        r3.setComment("Unbeatable location in South Mumbai. Sea view from the balcony!");
        reviewRepository.save(r3);

        // 7. Seed Saved Properties
        savedPropertyRepository.save(new SavedProperty(sAarav, p1));
        savedPropertyRepository.save(new SavedProperty(sAarav, p2));
        savedPropertyRepository.save(new SavedProperty(sPriya, p7));
        savedPropertyRepository.save(new SavedProperty(sPriya, p8));

        // 8. Seed Notifications
        notificationRepository.save(new Notification(sAarav, "Booking Confirmed! 🎉",
                "Your booking for Green Olive Boys Hostel & PG has been accepted by owner Rajesh Sharma.",
                "BOOKING", b1.getId()));

        notificationRepository.save(new Notification(sPriya, "Booking Confirmed! 🎉",
                "Your booking for RV Pride Boys Hostel has been accepted by owner Sunita Reddy.",
                "BOOKING", b3.getId()));

        notificationRepository.save(new Notification(sSneha, "Booking Submitted",
                "Your booking request for Sai Nilayam Luxury Girls PG has been sent to the owner.",
                "BOOKING", b2.getId()));

        notificationRepository.save(new Notification(oRajesh, "New Booking Request",
                "Student Aarav Patel has requested a booking for Green Olive Boys Hostel.",
                "BOOKING", b1.getId()));

        notificationRepository.save(new Notification(admin, "Pending Property Listing",
                "New property \"Heritage Lane Girls Hostel\" submitted by Vikram Deshmukh requires your review.",
                "PROPERTY_STATUS", p12.getId()));

        log.info("Campus Stay database seeding completed successfully!");
    }

    private Property createProp(User owner, College college, String title, PropertyType type, String desc,
                                String address, String city, String state, String pin,
                                double lat, double lng, double rent, double deposit,
                                RoomSharingType sharing, int totalRooms, int availRooms,
                                GenderPreference gender, boolean food, String foodDesc,
                                boolean wifi, boolean laundry, boolean parking, boolean ac,
                                String contact, PropertyStatus status) {
        Property p = new Property();
        p.setOwner(owner);
        p.setCollege(college);
        p.setTitle(title);
        p.setPropertyType(type);
        p.setDescription(desc);
        p.setAddress(address);
        p.setCity(city);
        p.setState(state);
        p.setPinCode(pin);
        p.setLatitude(lat);
        p.setLongitude(lng);
        p.setMonthlyRent(BigDecimal.valueOf(rent));
        p.setSecurityDeposit(BigDecimal.valueOf(deposit));
        p.setRoomSharingType(sharing);
        p.setTotalRooms(totalRooms);
        p.setAvailableRooms(availRooms);
        p.setGenderPreference(gender);
        p.setFoodAvailable(food);
        p.setFoodDescription(foodDesc);
        p.setWifi(wifi);
        p.setLaundry(laundry);
        p.setParking(parking);
        p.setAc(ac);
        p.setContactNumber(contact);
        p.setStatus(status);
        return propertyRepository.save(p);
    }

    private void addImages(Property p, String... urls) {
        boolean first = true;
        for (String url : urls) {
            PropertyImage img = new PropertyImage(url, first);
            img.setProperty(p);
            propertyImageRepository.save(img);
            first = false;
        }
    }
}

