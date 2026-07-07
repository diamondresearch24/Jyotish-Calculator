# ज्योतिष यंत्र · Jyotish Calculator

**A comprehensive Vedic Astrology Predictive Engine with educational features**

![Jyotish Calculator](https://img.shields.io/badge/Version-1.0-gold) ![Status](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-Educational-blue)

## 📁 Project Structure

```
Jyotish Calculator/
├── README.md                           # This documentation file
├── jyotish_calculator .html            # Main application (single-page app)
└── .DS_Store                          # macOS system file (auto-generated)
```

## 🌟 Overview

ज्योतिष यंत्र (Jyotish Calculator) is a sophisticated browser-based Vedic Astrology calculation and prediction engine. Built as a single-page HTML application, it provides comprehensive astrological calculations, educational content, and predictive analysis entirely in the browser without requiring any server-side processing.

## ✨ Key Features

### 🔮 **Core Astrological Calculations**
- **Kundli Generation** - Complete birth chart with 16 Vargas (divisional charts)
- **Planetary Positions** - Accurate calculations using Keplerian algorithms
- **Dasha System** - Vimshottari Dasha with full nested periods (Pratyantar Dasha)
- **Transit Analysis** - Gochar calculations for current planetary movements
- **Yoga Detection** - Automatic identification of major astrological combinations

### 📚 **Educational Modes**
- **Prediction Mode** - Complete predictive analysis with confidence levels
- **Learning Mode** - Comprehensive educational content for all astrological concepts
- **Charts Mode** - Interactive visualization of all divisional charts
- **Dasha Mode** - Detailed timing analysis with period breakdowns
- **Transit Mode** - Current planetary influences and predictions
- **Subtle Mode** - Advanced predictive techniques and subtle analysis

### 🎨 **User Experience**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Bilingual Interface** - Hindi (Devanagari) with English support
- **Dark Theme** - Eye-friendly design optimized for extended use
- **City Search** - Instant location lookup with timezone detection
- **Font Size Control** - Adjustable text size for accessibility

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or installation required

### Installation & Usage
1. **Download** the `jyotish_calculator .html` file
2. **Open** the file in any modern web browser
3. **Enter birth details** (date, time, location)
4. **Click "रिपोर्ट बनाएँ"** to generate your kundli
5. **Explore different modes** using the mode buttons

### No Setup Required
- ✅ No installation needed
- ✅ No internet connection required (after initial download)
- ✅ No server dependencies
- ✅ All calculations happen in your browser

## 🛠️ Technical Architecture

### **Technology Stack**
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Calculations**: Custom JavaScript astronomical algorithms
- **UI Framework**: Custom CSS with CSS Grid and Flexbox
- **Data Storage**: LocalStorage for user preferences
- **Architecture**: Single Page Application (SPA)

### **Core Components**
```javascript
// Main calculation engines
- computeChart()     // Core planetary calculations
- buildDasha()       // Dasha period calculations
- buildTransit()     // Transit calculations
- julianDay()        // Astronomical date conversion

// UI and interaction
- setMode()          // Mode switching
- show()             // Content display
- buildNav()         // Navigation generation
- run()              // Report generation
```

### **Calculation Accuracy**
- **Algorithm**: Keplerian planetary calculations
- **Ayanamsa**: Lahiri (Chitrapaksha) - Standard in Vedic Astrology
- **Accuracy**: ~0.1-0.5° for planetary positions
- **Coverage**: All major planets, Rahu, Ketu, and lunar nodes

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

## 🎯 Features in Detail

### **Prediction Engine**
- **Confidence Levels** - Every prediction includes strength indicators
- **Timing Analysis** - Specific timeframes for predictions
- **Multiple Factors** - Considers planets, houses, signs, and dashas
- **Educational References** - Sources and classical references for predictions

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
- **Font Size** - Adjustable from 100% to 150%
- **Language** - Hindi primary with English support
- **Theme** - Dark theme optimized for astrological study
- **Layout** - Responsive design adapts to screen size

### **Calculation Settings**
- **Ayanamsa** - Lahiri (standard) - can be modified for other systems
- **Coordinate System** - Decimal degrees for precision
- **Time Format** - 24-hour format with timezone support

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
- **Additional Vargas** - More divisional charts
- **Regional Languages** - Support for more Indian languages
- **Export Features** - PDF/chart export capabilities
- **Advanced Calculations** - More sophisticated predictive techniques

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

---

**ॐ शांति** | **Om Shanti** | **Peace**

*Built with dedication to the ancient science of Vedic Astrology for educational purposes.*
