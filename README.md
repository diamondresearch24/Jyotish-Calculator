# ज्योतिष यंत्र · Jyotish Calculator

**A comprehensive Vedic Astrology Predictive Engine with educational features**

![Jyotish Calculator](https://img.shields.io/badge/Version-2.0-gold) ![Status](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-Educational-blue)

## 📁 Project Structure

```
Jyotish Calculator/
├── README.md                           # This documentation file
├── index.html                          # Landing page with app launcher
├── jyotish_calculator.html             # Main application (single-page app)
├── .git/                              # Version control
├── .gitattributes                      # Git configuration
├── CNAME                              # Custom domain (if deployed)
└── .DS_Store                          # macOS system file (auto-generated)
```

## 🌟 Overview

ज्योतिष यंत्र (Jyotish Calculator) is a sophisticated browser-based Vedic Astrology calculation and prediction engine. Built as a single-page HTML application, it provides comprehensive astrological calculations, educational content, and predictive analysis entirely in the browser without requiring any server-side processing.

**Version 2.0** introduces a multi-module application structure with dedicated modules for Personal Prediction, Match Making, and Muhurat (auspicious timing), along with enhanced dasha calculations extending to Prana Dasha level.

## ✨ Key Features

### 🔮 **Core Astrological Calculations**
- **Kundli Generation** - Complete birth chart with 16 Vargas (divisional charts)
- **Planetary Positions** - Accurate calculations using Keplerian algorithms
- **Enhanced Dasha System** - Vimshottari Dasha with 5-level nested periods (Mahadasha → Prana Dasha)
- **Transit Analysis** - Gochar calculations for current planetary movements
- **Yoga Detection** - Automatic identification of major astrological combinations
- **Reference Date System** - Check dasha and predictions for any specific date

### 📱 **Multi-Module Application Structure**
- **🧑 Personal Prediction** - Comprehensive life predictions with timing analysis
- **💑 Match Making** - Ashtakoot guna milan compatibility analysis (Coming Soon)
- **🕉 Muhurat** - Auspicious timing for 30+ life events based on Panchanga

### 📚 **Educational Modes**
- **Prediction Mode** - Complete predictive analysis with confidence levels
- **Learning Mode** - Comprehensive educational content for all astrological concepts
- **Charts Mode** - Interactive visualization of all divisional charts
- **Dasha Mode** - Detailed timing analysis with 5-level period breakdowns
- **Transit Mode** - Current planetary influences and predictions
- **Micro-Timing Analysis** - Day/hour-level predictions with Sookshma & Prana dasha

### 🎨 **Enhanced User Experience**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Bilingual Interface** - Hindi (Devanagari) with English support
- **Dark Theme** - Eye-friendly design optimized for extended use
- **City Search** - Instant location lookup with timezone detection
- **Font Size Control** - Adjustable text size for accessibility
- **PDF Export** - Download reports and muhurat analysis as PDF
- **Print Optimization** - Clean, printer-friendly layouts

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or installation required

### Installation & Usage
1. **Download** the project files
2. **Open** `index.html` in any modern web browser
3. **Click "🚀 Launch Jyotish Calculator"** on the landing page
4. **Select your desired module:**
   - **🧑 Personal Prediction** - Enter birth details for comprehensive analysis
   - **🕉 Muhurat** - Find auspicious timing for life events
   - **💑 Match Making** - Compatibility analysis (Coming Soon)
5. **Enter birth details** (date, time, location) for Personal Prediction
6. **Click "रिपोर्ट बनाएँ"** to generate your kundli
7. **Explore different modes** using the navigation buttons

### No Setup Required
- ✅ No installation needed
- ✅ No internet connection required (after initial download)
- ✅ No server dependencies
- ✅ All calculations happen in your browser
- ✅ Works offline once loaded

### Local Development (Optional)
```bash
# For local testing with a server
cd "Jyotish Calculator"
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 🛠️ Technical Architecture

### **Technology Stack**
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Calculations**: Custom JavaScript astronomical algorithms
- **UI Framework**: Custom CSS with CSS Grid and Flexbox
- **Data Storage**: LocalStorage for user preferences
- **External Libraries**: 
  - html2canvas (for PDF generation)
  - jsPDF (for PDF export)
- **Architecture**: Multi-module Single Page Application (SPA)

### **Core Components**
```javascript
// Main calculation engines
- computeChart()     // Core planetary calculations
- buildDasha()       // 5-level Dasha period calculations
- buildTransit()     // Transit calculations
- julianDay()        // Astronomical date conversion

// New in v2.0
- panchangAt()       // Panchanga calculations for muhurat
- muhScore()         // Muhurat scoring algorithm
- chainAt()          // Dasha chain analysis
- garbhScore()       // Garbhadhana muhurat calculations

// UI and interaction
- setMode()          // Mode switching
- showApp()          // Module selection (Personal/Muhurat/Match)
- showMuhurat()      // Muhurat module interface
- buildNav()         // Navigation generation
- run()              // Report generation
```

### **Calculation Accuracy**
- **Algorithm**: Keplerian planetary calculations
- **Ayanamsa**: Lahiri (Chitrapaksha) - Standard in Vedic Astrology
- **Accuracy**: ~0.1-0.5° for planetary positions
- **Coverage**: All major planets, Rahu, Ketu, and lunar nodes
- **Muhurat System**: Based on Muhurta Chintamani, BPHS, Dharma Sindhu

## 📖 Educational Content

### **Learning Modules**
- **Planets** (ग्रह) - Characteristics, significations, and effects
- **Houses** (भाव) - 12 astrological houses and their meanings
- **Signs** (राशि) - 12 zodiac signs and their characteristics
- **Yogas** (योग) - Planetary combinations and their effects
- **Dasha** (दशा) - Timing and predictive periods
- **Remedies** (उपाय) - Traditional astrological remedies

### **Vargas (Divisional Charts)**
- **D1 (Rashi)** - Main birth chart
- **D9 (Navamsa)** - Marriage and fortune
- **D10 (Dashamsa)** - Career and profession
- **D2 (Hora)** - Wealth and finances
- **D3 (Drekkana)** - Siblings and relationships
- **D4 (Chaturthamsa)** - Properties and assets
- **D7 (Saptamsa)** - Children and progeny
- **D12 (Dwadashamsa)** - Parents and ancestors
- **And 8 more specialized charts**

### **🕉 Muhurat Module**
- **30+ Life Events** - Comprehensive muhurat calculations for various activities:
  - Marriage, Job Joining, Business Start, Investment
  - Travel, Vehicle Purchase, Property Registration
  - Education, Medical Procedures, Naming Ceremonies
  - Garbhadhana (conception), Yagya, Temple Visit
- **Panchanga-Based** - Tithi, Vara, Nakshatra, Yoga analysis
- **Classical References** - Based on Muhurta Chintamani, BPHS, Dharma Sindhu
- **Scoring System** - Scientific scoring (0-100%) for each date
- **PDF Export** - Download muhurat reports with detailed analysis
- **45-Day Scan** - Find auspicious dates in the next 45 days
- **Personalization** - Incorporates birth chart for personalized muhurat

## 🎯 Features in Detail

### **Enhanced Prediction Engine**
- **5-Level Dasha Analysis** - Mahadasha → Antardasha → Pratyantar → Sookshma → Prana
- **Micro-Timing** - Day and hour-level predictions
- **Confidence Levels** - Every prediction includes strength indicators
- **Timing Analysis** - Specific timeframes for predictions
- **Multiple Factors** - Considers planets, houses, signs, and dashas
- **Educational References** - Sources and classical references for predictions
- **Reference Date Feature** - Check predictions for any specific date

### **Chart Visualization**
- **Interactive Charts** - Clickable chart elements with detailed information
- **Color Coding** - Visual indicators for exaltation, debilitation, retrogression
- **Status Markers** - Special symbols for planetary conditions
- **Multiple Views** - Different chart styles and layouts

### **Search and Location**
- **Global City Database** - Thousands of cities worldwide
- **Automatic Timezone** - Detects timezone based on location
- **Coordinate Input** - Manual latitude/longitude entry
- **Location Memory** - Saves frequently used locations

## 🔧 Customization

### **User Preferences**
- **Font Size** - Adjustable from 80% to 150%
- **Language** - Hindi primary with English support
- **Theme** - Dark theme optimized for astrological study
- **Layout** - Responsive design adapts to screen size
- **Reference Date** - Set any date for dasha and prediction analysis
- **Module Selection** - Switch between Personal, Muhurat, and Match modules

### **Calculation Settings**
- **Ayanamsa** - Lahiri (standard) - can be modified for other systems
- **Coordinate System** - Decimal degrees for precision
- **Time Format** - 24-hour format with timezone support
- **Dasha Levels** - View up to 5 levels of dasha periods
- **Muhurat Preferences** - Customize event types and scoring parameters

### **Export Options**
- **PDF Reports** - Download complete predictions and muhurat analysis
- **Print Layouts** - Optimized printing with clean formatting
- **Chart Export** - Save charts as images (coming soon)

## 📊 Data & Accuracy

### **Astronomical Data**
- **Planetary Positions** - Calculated using Swiss Ephemeris algorithms
- **House System** - Placidus houses (most commonly used)
- **Node Calculation** - True node calculation for Rahu/Ketu
- **Retrogradation** - Accurate retrograde period calculations

### **Astrological Logic**
- **Classical References** - Based on Vedic astrological texts
- **Modern Interpretation** - Contemporary predictive techniques
- **Educational Focus** - Emphasis on learning and understanding
- **Multiple Systems** - Supports various astrological approaches

## 🌍 Browser Compatibility

### **Supported Browsers**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Opera 70+

### **Mobile Support**
- ✅ iOS Safari 13+
- ✅ Chrome Mobile 80+
- ✅ Samsung Internet 12+
- ✅ Firefox Mobile 79+

## 📝 Development Notes

### **Code Structure**
- **Modular Design** - Organized JavaScript functions
- **Event-Driven** - Modern event listener architecture
- **Responsive CSS** - Mobile-first design approach
- **Performance Optimized** - Efficient calculations and rendering

### **Known Considerations**
- **Lint Warnings** - Template literals may trigger JSX warnings (false positives)
- **Large File Size** - Comprehensive features result in larger HTML file
- **Browser Processing** - All calculations are client-side (browser-dependent)

## 🎓 Educational Purpose

### **Disclaimer**
```
⚠️ शैक्षिक उपकरण; समय-windows सांकेतिक। professional software से मिलान करें; 
निर्णय हेतु योग्य ज्योतिषी से परामर्श लें।

⚠️ Educational tool; time-windows are indicative. Compare with professional software; 
consult qualified astrologer for decisions.
```

### **Intended Use**
- **Educational Learning** - Understanding Vedic astrology concepts
- **Personal Study** - Self-study and research purposes
- **Demonstration** - Teaching and demonstration of astrological principles
- **Reference** - Quick calculations and chart generation

## 🤝 Contributing

### **Development Guidelines**
- **Educational Focus** - Maintain educational and learning orientation
- **Accuracy** - Ensure calculation accuracy and classical references
- **Accessibility** - Keep the interface accessible and user-friendly
- **Documentation** - Update documentation for any new features

### **Areas for Enhancement**
- **Match Making Module** - Complete Ashtakoot guna milan analysis
- **Additional Vargas** - More divisional charts
- **Regional Languages** - Support for more Indian languages
- **Chart Export** - Save charts as images and SVG
- **Advanced Calculations** - More sophisticated predictive techniques
- **Remedies Module** - Detailed remedial measures and gemstone recommendations
- **Transit Alerts** - Personalized transit notifications
- **Cloud Sync** - Save and sync charts across devices (future)

## 📄 License

This project is provided for **educational purposes only**. The astrological calculations and interpretations are intended for learning and research. For professional astrological consultations, please consult qualified practitioners.

## 📞 Support & Feedback

### **Educational Support**
- This is an **educational tool** for learning Vedic astrology
- **Not intended for professional use** or critical life decisions
- **Always consult qualified astrologers** for important matters

### **Technical Issues**
- Ensure you're using a **modern web browser**
- **Clear browser cache** if experiencing issues
- **Check JavaScript is enabled** in your browser settings

## 📋 Version History

### **Version 2.0** (Current)
- ✨ **Multi-Module Architecture** - Personal, Muhurat, and Match modules
- ✨ **Enhanced Dasha System** - 5-level analysis (Mahadasha → Prana Dasha)
- ✨ **Muhurat Module** - 30+ life events with Panchanga-based calculations
- ✨ **Reference Date System** - Check predictions for any specific date
- ✨ **PDF Export** - Download reports and muhurat analysis
- ✨ **Garbhadhana Muhurat** - Specialized conception timing analysis
- ✨ **Micro-Timing** - Day/hour-level predictions
- ✨ **Improved UI** - Enhanced navigation and user experience
- ✨ **Classical References** - Expanded source documentation

### **Version 1.0** (Original)
- 🔮 **Core Astrological Calculations** - Kundli generation with 16 Vargas
- 📚 **Educational Modes** - Prediction, Learning, Charts, Dasha, Transit modes
- 🎨 **Responsive Design** - Mobile-friendly interface
- 🌍 **Offline Support** - Works without internet connection
- 📖 **Comprehensive Documentation** - Educational content for all concepts

## 🔮 Future Roadmap

### **Phase 1** (Near Future)
- Complete **Match Making Module** with Ashtakoot analysis
- **Chart Export** functionality (PNG/SVG)
- **Remedies Module** with detailed recommendations

### **Phase 2** (Mid-term)
- **Regional Language Support** (Tamil, Telugu, Bengali, etc.)
- **Transit Alert System** for personalized notifications
- **Advanced Yoga Detection** with more combinations

### **Phase 3** (Long-term)
- **Cloud Sync** for chart storage across devices
- **Mobile App** (React Native)
- **AI-Powered Insights** for enhanced predictions

---

**ॐ शांति** | **Om Shanti** | **Peace**

*Built with dedication to the ancient science of Vedic Astrology for educational purposes.*

---

## 🙏 Acknowledgments

This project draws inspiration from and is based on the following classical texts:
- **Brihat Parashara Hora Shastra** - The foundational text of Vedic Astrology
- **Muhurta Chintamani** - Classical text on auspicious timing
- **Dharma Sindhu & Nirnaya Sindhu** - Traditional muhurat guidelines
- **Saravali** - Comprehensive astrological principles
- **Phaladeepika** - Predictive astrology techniques

Special thanks to the ancient sages and scholars who preserved this sacred knowledge for humanity.
