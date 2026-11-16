import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  facilities,
  galleryItems,
  leadership,
  newsEvents,
  noticeCategories,
  notices,
  schoolInfo,
  schoolOverview,
  stats,
  timeline,
  adminModules,
} from './data/siteData';

type Language = 'bn' | 'en';

type Notice = (typeof notices)[number];

type NavItem = {
  label: { bn: string; en: string };
  path: string;
};

const storageKey = 'gcbhs-language';
const formatDate = (date: string, lang: Language) => {
  const dt = new Date(date);
  return Number.isNaN(dt.getTime())
    ? date
    : new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dt);
};

const navItems: NavItem[] = [
  { label: { bn: 'হোম', en: 'Home' }, path: '/' },
  { label: { bn: 'আমাদের সম্পর্কে', en: 'About Us' }, path: '/about' },
  { label: { bn: 'প্রশাসন', en: 'Administration' }, path: '/administration' },
  { label: { bn: 'একাডেমিক', en: 'Academics' }, path: '/academics' },
  { label: { bn: 'ফলাফল', en: 'Results' }, path: '/results' },
  { label: { bn: 'সুবিধা', en: 'Facilities' }, path: '/facilities' },
  { label: { bn: 'নোটিশ', en: 'Notice Board' }, path: '/notices' },
  { label: { bn: 'গ্যালারি', en: 'Gallery' }, path: '/gallery' },
  { label: { bn: 'যোগাযোগ', en: 'Contact' }, path: '/contact' },
  { label: { bn: 'ভর্তি', en: 'Admission' }, path: '/admission' },
];

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === 'en' ? 'en' : 'bn';
  });

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
  }, [language]);

  return (
    <BrowserRouter>
      <AppShell language={language} setLanguage={setLanguage} />
    </BrowserRouter>
  );
}

function AppShell({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (value: Language) => void;
}) {
  const location = useLocation();

  const menuText = (value: { bn: string; en: string }) => (language === 'bn' ? value.bn : value.en);

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <Link to="/" className="brand" aria-label="GCBHS Home">
            <div className="brand-mark">GCBHS</div>
            <div className="brand-copy">
              <strong>{schoolInfo.name[language]}</strong>
              <span>{schoolInfo.shortName}</span>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive || location.pathname.startsWith(item.path) ? 'nav-link active' : 'nav-link')}
              >
                {menuText(item.label)}
              </NavLink>
            ))}
          </nav>

          <div className="utility-actions">
            <button
              type="button"
              className="language-toggle"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              aria-label="Toggle language"
            >
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/about" element={<AboutPage language={language} />} />
          <Route path="/administration" element={<AdministrationPage language={language} />} />
          <Route path="/academics" element={<AcademicsPage language={language} />} />
          <Route path="/results" element={<ResultsPage language={language} />} />
          <Route path="/facilities" element={<FacilitiesPage language={language} />} />
          <Route path="/notices" element={<NoticeBoardPage language={language} />} />
          <Route path="/notices/:noticeId" element={<NoticeDetailPage language={language} />} />
          <Route path="/news-events" element={<NewsEventsPage language={language} />} />
          <Route path="/gallery" element={<PhotoGalleryPage language={language} />} />
          <Route path="/contact" element={<ContactPage language={language} />} />
          <Route path="/admission" element={<AdmissionPage language={language} />} />
          <Route path="/student-information" element={<StudentInformationPage language={language} />} />
          <Route path="/admin" element={<AdminDashboardPage language={language} />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand brand-footer">
              <div className="brand-mark">GCBHS</div>
              <div className="brand-copy">
                <strong>{schoolInfo.name[language]}</strong>
                <span>{schoolInfo.shortName}</span>
              </div>
            </div>
            <p>
              {language === 'bn'
                ? 'সুনামের সঙ্গে উচ্চমানের শিক্ষা, নৈতিকতা, সংস্কৃতি ও লাগাতার অগ্রগতি।'
                : 'A school built on excellence, character, culture, and progressive learning.'}
            </p>
          </div>

          <div>
            <h3>{language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</h3>
            <ul className="footer-links">
              <li><Link to="/about">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</Link></li>
              <li><Link to="/academics">{language === 'bn' ? 'একাডেমিক' : 'Academics'}</Link></li>
              <li><Link to="/notices">{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</Link></li>
              <li><Link to="/contact">{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</Link></li>
            </ul>
          </div>

          <div>
            <h3>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h3>
            <ul className="footer-links">
              <li>{schoolInfo.location[language]}</li>
              <li>{schoolInfo.contact.phone}</li>
              <li>{schoolInfo.contact.complaint}</li>
              <li><a href={schoolInfo.contact.vortiUrl} target="_blank" rel="noreferrer">{schoolInfo.contact.vortiLabel[language]}</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {schoolInfo.shortName} · {language === 'bn' ? 'ডেমো ও কনটেন্ট প্লেসহোল্ডার' : 'Demo content with editable placeholders'}
          </span>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ language }: { language: Language }) {
  const latestNotices = notices.slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              {language === 'bn' ? 'Gazipur Cantonment Board High School' : 'Gazipur Cantonment Board High School'}
            </p>
            <h1>{language === 'bn' ? 'শিক্ষায় উৎকর্ষ, ভবিষ্যৎ গড়ে চলি।' : 'Excellence in Education, Building Tomorrow.'}</h1>
            <p className="lead">
              {language === 'bn'
                ? 'গাজীপুর ক্যান্টনমেন্ট বোর্ড হাই স্কুলে সৃজনশীল শিক্ষা, নৈতিক মূল্যবোধ ও অগ্রগামী দৃষ্টিভঙ্গির মাধ্যমে প্রতিটি শিক্ষার্থীকে নেতৃত্বের জন্য প্রস্তুত করা হয়।'
                : 'GCBHS is a distinguished institution dedicated to nurturing minds, values, and the confidence to lead in a changing world.'}
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/about">
                {language === 'bn' ? 'আমাদের স্কুল দেখুন' : 'Explore Our School'}
              </Link>
              <Link className="secondary-button" to="/notices">
                {language === 'bn' ? 'নোটিশ দেখুন' : 'Latest Notices'}
              </Link>
            </div>
            <ul className="quick-facts">
              {stats.map((stat) => (
                <li key={stat.label.bn}>
                  <strong>{stat.value}</strong>
                  <span>{language === 'bn' ? stat.label.bn : stat.label.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'সাম্প্রতিক নোটিশ' : 'Latest Notices'}
            subtitle={language === 'bn' ? 'শিক্ষাপ্রতিষ্ঠানের গুরুত্বপূর্ণ আপডেট ও বিজ্ঞপ্তি' : 'Important updates from the institution'}
          />
          <div className="notice-grid three-cols">
            {latestNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} language={language} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container split-layout">
          <div className="image-panel">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80" alt="School campus" />
          </div>
          <div className="content-panel">
            <SectionHeader
              title={language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Our School'}
              subtitle={language === 'bn' ? 'একটি ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠান' : 'A respected educational institution'}
            />
            <p>{schoolOverview[language]}</p>
            <div className="feature-list">
              <div>
                <strong>{language === 'bn' ? 'প্রতিষ্ঠা' : 'Established'}</strong>
                <span>{schoolInfo.established}</span>
              </div>
              <div>
                <strong>{language === 'bn' ? 'EIIN' : 'EIIN'}</strong>
                <span>{schoolInfo.eiin}</span>
              </div>
              <div>
                <strong>{language === 'bn' ? 'শ্রেণি স্তর' : 'Levels'}</strong>
                <span>{schoolInfo.levels[language]}</span>
              </div>
            </div>
            <Link className="primary-button" to="/about">{language === 'bn' ? 'আরও জানুন' : 'Learn More'}</Link>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'একাডেমিক' : 'Academic Excellence'}
            subtitle={language === 'bn' ? 'শিক্ষা, নৈতিকতা ও সাফল্যের সমন্বয়' : 'Balancing rigorous learning with values and growth'}
          />
          <div className="info-grid four-cols">
            <InfoCard
              title={language === 'bn' ? 'গুণগত শিক্ষা' : 'Quality Learning'}
              body={language === 'bn' ? 'গভীর পাঠ্যক্রম ও সৃজনশীল অনুশীলনের মাধ্যমে শিক্ষার্থীদের ভবিষ্যৎ প্রস্তুত করা হয়।' : 'Learners are prepared through academic rigor and creative engagement.'}
            />
            <InfoCard
              title={language === 'bn' ? 'সহ-শিক্ষা' : 'Co-curricular Growth'}
              body={language === 'bn' ? 'ক্লাব, সাংস্কৃতিক কার্যক্রম ও নেতৃত্বমূলক উদ্যোগে অংশগ্রহণের সুযোগ।' : 'Students gain confidence through clubs, culture, and leadership opportunities.'}
            />
            <InfoCard
              title={language === 'bn' ? 'শিক্ষক-প্রণোদনা' : 'Teacher Guidance'}
              body={language === 'bn' ? 'দক্ষ শিক্ষকবৃন্দ প্রতিটি শিক্ষার্থীর ব্যক্তিগত বিকাশে সহায়তা করেন।' : 'Committed teachers guide students through every stage of progression.'}
            />
            <InfoCard
              title={language === 'bn' ? 'শিক্ষার মান' : 'Academic Standards'}
              body={language === 'bn' ? 'উচ্চ মানের শিক্ষা ও মূল্যবোধের মাধ্যমে পুরস্কারপ্রাপ্ত ফলাফল নিশ্চিত করা হয়।' : 'Strong standards for academic achievement and character development.'}
            />
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'প্রশাসন ও নেতৃত্ব' : 'Leadership & Administration'}
            subtitle={language === 'bn' ? 'বিষয়ভিত্তিক ও স্বচ্ছ প্রশাসনের মাধ্যমে প্রতিষ্ঠানটি পরিচালিত হয়' : 'Steered by clear governance and academic leadership'}
          />
          <div className="leadership-grid">
            {leadership.map((person) => (
              <article key={person.name.en} className="profile-card">
                <div className="profile-image">
                  <img src={person.image} alt={language === 'bn' ? person.name.bn : person.name.en} />
                </div>
                <h3>{language === 'bn' ? person.name.bn : person.name.en}</h3>
                <p>{language === 'bn' ? person.role.bn : person.role.en}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'নিউজ ও ইভেন্টস' : 'News & Events'}
            subtitle={language === 'bn' ? 'প্রতিষ্ঠানের সাম্প্রতিক কার্যক্রম ও অনুষ্ঠান' : 'Recent happenings and school activities'}
          />
          <div className="news-grid two-cols">
            {newsEvents.slice(0, 4).map((item) => (
              <article key={item.title.en} className="news-card">
                <span className="news-date">{formatDate(item.date, language)}</span>
                <h3>{language === 'bn' ? item.title.bn : item.title.en}</h3>
                <p>{language === 'bn' ? item.summary.bn : item.summary.en}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'সুবিধা' : 'Facilities'}
            subtitle={language === 'bn' ? 'শিক্ষা ও সামগ্রিক বিকাশে আধুনিক সুযোগ-সুবিধা' : 'Modern amenities for a complete learning environment'}
          />
          <div className="facilities-grid">
            {facilities.slice(0, 6).map((facility) => (
              <article key={facility.name.en} className="facility-card">
                <div className="facility-icon">{facility.icon}</div>
                <h3>{language === 'bn' ? facility.name.bn : facility.name.en}</h3>
                <p>{language === 'bn' ? facility.description.bn : facility.description.en}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'শিক্ষার্থীর সংখ্যা' : 'Academic Statistics'}
            subtitle={language === 'bn' ? 'প্রতিষ্ঠানের সামগ্রিক শিক্ষা কার্যক্রমের পরিসংখ্যান' : 'A snapshot of the institution'}
          />
          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-box" key={stat.label.en}>
                <strong>{stat.value}</strong>
                <span>{language === 'bn' ? stat.label.bn : stat.label.en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <SectionHeader
            title={language === 'bn' ? 'ফটোগ্যালারি' : 'Photo Gallery'}
            subtitle={language === 'bn' ? 'স্কুলের জীবনের কিছু মুহূর্ত' : 'Moments from campus life'}
          />
          <div className="gallery-grid">
            {galleryItems.slice(0, 6).map((item) => (
              <figure key={item.title.en} className="gallery-item">
                <img src={item.image} alt={language === 'bn' ? item.title.bn : item.title.en} />
                <figcaption>{language === 'bn' ? item.title.bn : item.title.en}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block contact-panel">
        <div className="container contact-wrap">
          <div>
            <SectionHeader
              title={language === 'bn' ? 'যোগাযোগ ও লোকেশন' : 'Contact & Location'}
              subtitle={language === 'bn' ? 'সরাসরি যোগাযোগের জন্য আমাদের ঠিকানা' : 'Reach us directly'}
            />
            <ul className="contact-list">
              <li>{schoolInfo.location[language]}</li>
              <li>{schoolInfo.contact.phone}</li>
              <li>{schoolInfo.contact.complaint}</li>
              <li>{schoolInfo.contact.vortiUrl}</li>
            </ul>
          </div>
          <div className="map-box">
            <div className="map-placeholder">Gazipur, Bangladesh</div>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'} />
      <section className="section-block">
        <div className="container two-col-content">
          <div>
            <h3>{language === 'bn' ? 'এক নজরে' : 'At a Glance'}</h3>
            <p>{schoolOverview[language]}</p>
            <ul className="detail-list">
              <li><strong>{language === 'bn' ? 'প্রতিষ্ঠা' : 'Established'}:</strong> {schoolInfo.established}</li>
              <li><strong>EIIN:</strong> {schoolInfo.eiin}</li>
              <li><strong>{language === 'bn' ? 'স্কুল কোড' : 'School Code'}:</strong> {schoolInfo.schoolCode}</li>
              <li><strong>{language === 'bn' ? 'লোকেশন' : 'Location'}:</strong> {schoolInfo.location[language]}</li>
            </ul>
          </div>
          <div className="image-panel stacked-image">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80" alt="School building" />
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <h3>{language === 'bn' ? 'বিদ্যালয়ের ইতিহাস' : 'School History'}</h3>
          <div className="timeline">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <span>{item.year}</span>
                <p>{language === 'bn' ? item.description.bn : item.description.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container grid-2">
          <div className="info-card tall">
            <h3>{language === 'bn' ? 'লক্ষ্য ও দর্শন' : 'Mission & Vision'}</h3>
            <p>{language === 'bn' ? 'শিক্ষার উৎকর্ষ, চরিত্র, সভ্যতা ও নেতৃত্বকে একত্রিত করে শিক্ষার্থীদের মানবিক, দায়িত্বশীল ও সৃজনশীল নাগরিক হিসেবে গড়ে তোলা।' : 'To cultivate principled, capable, and innovative citizens through academic excellence, character, and service.'}</p>
          </div>
          <div className="info-card tall">
            <h3>{language === 'bn' ? 'অবকাঠামো' : 'Infrastructure'}</h3>
            <p>{language === 'bn' ? 'শিক্ষা কার্যক্রমের উন্নতির জন্য পর্যাপ্ত শ্রেণিকক্ষ, পাঠাগার, বিজ্ঞানাগার, কম্পিউটার ল্যাব, ক্যান্টিন, খেলার মাঠ ইত্যাদি রয়েছে।' : 'The school offers classroom spaces, laboratories, library access, a computer lab, canteen, and recreation areas.'}</p>
          </div>
        </div>
      </section>

      <section className="section-block muted">
        <div className="container">
          <h3>{language === 'bn' ? 'অর্জন' : 'Achievements'}</h3>
          <ul className="check-list">
            <li>{language === 'bn' ? 'উচ্চমানের SSC ও অন্যান্য ফলাফল' : 'Strong public-exam outcomes and academic performance'}</li>
            <li>{language === 'bn' ? 'সাংস্কৃতিক ও শিক্ষামূলক কার্যক্রম' : 'Cultural and academic enrichment activities'}</li>
            <li>{language === 'bn' ? 'শিক্ষার্থীর নেতৃত্ব, নৈতিকতা ও সামাজিক দায়িত্ব' : 'Leadership, values, and community participation'}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function AdministrationPage({ language }: { language: Language }) {
  const adminGroups = [
    { title: { bn: 'গভর্নিং বডি', en: 'Governing Body' }, members: ['8 members'] },
    { title: { bn: 'চেয়ারম্যান', en: 'Chairman' }, members: ['Executive leadership'] },
    { title: { bn: 'সহ-চেয়ারম্যান', en: 'Co-Chairman' }, members: ['School oversight'] },
    { title: { bn: 'হেডমাস্টার', en: 'Headmaster' }, members: ['Academic direction'] },
    { title: { bn: 'শিক্ষকবৃন্দ', en: 'Teachers' }, members: ['28 reported teachers'] },
    { title: { bn: 'অফিসার ও স্টাফ', en: 'Officers & Staff' }, members: ['Support functions'] },
  ];

  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'প্রশাসন' : 'Administration'} />
      <section className="section-block">
        <div className="container admin-grid">
          {adminGroups.map((group) => (
            <article key={group.title.en} className="admin-card">
              <h3>{language === 'bn' ? group.title.bn : group.title.en}</h3>
              {group.members.map((member) => (
                <p key={member}>{member}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AcademicsPage({ language }: { language: Language }) {
  const academicItems = [
    { title: { bn: 'একাডেমিক ক্যালেন্ডার', en: 'Academic Calendar' }, text: { bn: 'শিক্ষাবর্ষভিত্তিক কার্যক্রম ও পরীক্ষা সময়সূচি প্রকাশিত হবে।', en: 'Academic year schedule and important milestones will be published here.' } },
    { title: { bn: 'ক্লাস টিচার', en: 'Class Teachers' }, text: { bn: 'প্রতিটি শ্রেণির জন্য দায়িত্বশীল প্রশিক্ষিত শিক্ষকবৃন্দ।', en: 'Responsible, trained educators guiding each class section.' } },
    { title: { bn: 'ক্লাস রুটিন', en: 'Class Routine' }, text: { bn: 'দিন-ভিত্তিক পাঠের সময়সূচি ও বিভাগ অনুযায়ী রুটিন।', en: 'Lesson schedules based on class and subject distribution.' } },
    { title: { bn: 'সিলেবাস', en: 'Syllabus' }, text: { bn: 'প্রতিটি বিষয়ভিত্তিক পাঠ্যক্রম ও মূল্যায়ন কাঠামো।', en: 'Course syllabus and study requirements by subject.' } },
    { title: { bn: 'পরীক্ষার সময়সূচি', en: 'Examination Routine' }, text: { bn: 'পাবলিক ও অভ্যন্তরীণ পরীক্ষা পরিকল্পনা ও রুটিন।', en: 'Internal and public examination planning and schedule.' } },
    { title: { bn: 'শিক্ষার্থী পরিসংখ্যান', en: 'Student Statistics' }, text: { bn: 'ক্লাস, বিভাগ ও শাখাভিত্তিক শিক্ষার্থীর পরিসংখ্যান।', en: 'Enrollment and class-level student distribution overview.' } },
  ];

  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'একাডেমিক' : 'Academics'} />
      <section className="section-block">
        <div className="container info-grid three-cols">
          {academicItems.map((item) => (
            <article key={item.title.en} className="info-card simple-card">
              <h3>{language === 'bn' ? item.title.bn : item.title.en}</h3>
              <p>{language === 'bn' ? item.text.bn : item.text.en}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResultsPage({ language }: { language: Language }) {
  const categories = [
    { title: { bn: 'একাডেমিক ফলাফল', en: 'Academic Results' }, note: { bn: 'ক্লাসভিত্তিক ফলাফল ও প্রগতি নির্ণয়।', en: 'Class-wise results and progression updates.' } },
    { title: { bn: 'ভর্তি পরীক্ষার ফলাফল', en: 'Admission Test Results' }, note: { bn: 'ভর্তি পরীক্ষার ফলাফল ও নির্বাচনের তথ্য।', en: 'Admission test results and selection data.' } },
    { title: { bn: 'পাবলিক exame ফলাফল', en: 'Public Examination Results' }, note: { bn: 'SSC ও অন্যান্য পাবলিক পরীক্ষার ফলাফল উপস্থাপন।', en: 'SSC and other public exam results presentation.' } },
  ];

  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'ফলাফল' : 'Results'} />
      <section className="section-block">
        <div className="container info-grid three-cols">
          {categories.map((item) => (
            <article className="info-card simple-card" key={item.title.en}>
              <h3>{language === 'bn' ? item.title.bn : item.title.en}</h3>
              <p>{language === 'bn' ? item.note.bn : item.note.en}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function FacilitiesPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'সুবিধা' : 'Facilities'} />
      <section className="section-block">
        <div className="container facilities-grid full-width-grid">
          {facilities.map((facility) => (
            <article key={facility.name.en} className="facility-card large">
              <div className="facility-icon">{facility.icon}</div>
              <h3>{language === 'bn' ? facility.name.bn : facility.name.en}</h3>
              <p>{language === 'bn' ? facility.description.bn : facility.description.en}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function NoticeBoardPage({ language }: { language: Language }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return notices.filter((notice) => {
      const matchesQuery =
        (language === 'bn' ? notice.title.bn : notice.title.en).toLowerCase().includes(query.toLowerCase()) ||
        (language === 'bn' ? notice.summary.bn : notice.summary.en).toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'all' ? true : notice.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, language, query]);

  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'নোটিশবোর্ড' : 'Notice Board'} />
      <section className="section-block">
        <div className="container">
          <div className="notice-toolbar">
            <input
              type="search"
              value={query}
              aria-label="Search notices"
              placeholder={language === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Notice category filter">
              <option value="all">{language === 'bn' ? 'সব কোতেগরি' : 'All categories'}</option>
              {noticeCategories.map((item) => (
                <option key={item.value} value={item.value}>{language === 'bn' ? item.label.bn : item.label.en}</option>
              ))}
            </select>
          </div>

          <div className="notice-grid three-cols">
            {filtered.length ? (
              filtered.map((notice) => <NoticeCard key={notice.id} notice={notice} language={language} />)
            ) : (
              <div className="empty-state">
                <p>{language === 'bn' ? 'কোনো নোটিশ খুঁজে পাওয়া যায়নি।' : 'No notices match your search.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function NoticeDetailPage({ language }: { language: Language }) {
  const { noticeId } = useParams();
  const notice = notices.find((item) => item.id === noticeId);

  if (!notice) {
    return <div className="page-shell"><div className="container"><p>Notice not found.</p></div></div>;
  }

  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'নোটিশ বিস্তারিত' : 'Notice Details'} />
      <section className="section-block">
        <div className="container notice-detail">
          <div className="notice-meta">
            <span>{language === 'bn' ? notice.categoryLabel.bn : notice.categoryLabel.en}</span>
            <span>{formatDate(notice.date, language)}</span>
          </div>
          <h2>{language === 'bn' ? notice.title.bn : notice.title.en}</h2>
          <p>{language === 'bn' ? notice.summary.bn : notice.summary.en}</p>
          <a className="primary-button" href={notice.pdfUrl} target="_blank" rel="noreferrer">
            {language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}
          </a>
        </div>
      </section>
    </div>
  );
}

function NewsEventsPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'নিউজ ও ইভেন্টস' : 'News & Events'} />
      <section className="section-block">
        <div className="container news-grid two-cols">
          {newsEvents.map((item) => (
            <article key={item.title.en} className="news-card large">
              <span className="news-date">{formatDate(item.date, language)}</span>
              <h3>{language === 'bn' ? item.title.bn : item.title.en}</h3>
              <p>{language === 'bn' ? item.summary.bn : item.summary.en}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PhotoGalleryPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'ফটোগ্যালারি' : 'Photo Gallery'} />
      <section className="section-block">
        <div className="container gallery-grid">
          {galleryItems.map((item) => (
            <figure key={item.title.en} className="gallery-item">
              <img src={item.image} alt={language === 'bn' ? item.title.bn : item.title.en} />
              <figcaption>{language === 'bn' ? item.title.bn : item.title.en}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'যোগাযোগ' : 'Contact Us'} />
      <section className="section-block">
        <div className="container contact-two-col">
          <div className="contact-card">
            <h3>{language === 'bn' ? 'আমাদের ঠিকানা' : 'Our Address'}</h3>
            <p>{schoolInfo.location[language]}</p>
            <ul className="detail-list">
              <li><strong>{language === 'bn' ? 'টেলিফোন' : 'Telephone'}:</strong> {schoolInfo.contact.phone}</li>
              <li><strong>{language === 'bn' ? 'কমপ্লেইন লাইন' : 'Complaint Line'}:</strong> {schoolInfo.contact.complaint}</li>
              <li><strong>URL:</strong> {schoolInfo.contact.vortiUrl}</li>
            </ul>
          </div>
          <div className="map-box large-map">
            <div className="map-placeholder">Gazipur, Bangladesh</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdmissionPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'অনলাইন ভর্তি' : 'Online Admission'} />
      <section className="section-block">
        <div className="container admission-box">
          <h3>{language === 'bn' ? 'ডেমো ফর্ম' : 'Demo Admission Form'}</h3>
          <p>{language === 'bn' ? 'এই পৃষ্ঠাটি ভার্চুয়াল ফর্মের জন্য প্রস্তুত। সিস্টেমটি এখনও ডেমো মোডে রয়েছে এবং কোনো সত্যিকারের ব্যাকএন্ড সংযুক্ত নেই।' : 'This page is a front-end placeholder for admission workflows. Backend integration is not configured yet.'}</p>
          <div className="demo-form">
            <input type="text" placeholder={language === 'bn' ? 'শিক্ষার্থীর নাম' : 'Student name'} />
            <input type="text" placeholder={language === 'bn' ? 'শ্রেণি' : 'Class'} />
            <input type="text" placeholder={language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile number'} />
            <button type="button" className="primary-button">{language === 'bn' ? 'জমা দিন' : 'Submit'}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StudentInformationPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'শিক্ষার্থী তথ্য' : 'Student Information'} />
      <section className="section-block">
        <div className="container admission-box">
          <h3>{language === 'bn' ? 'ডেমো লগইন' : 'Demo Login'}</h3>
          <p>{language === 'bn' ? 'শিক্ষার্থী লগইন ও তথ্য পোর্টালটি ভবিষ্যতের জন্য প্রস্তুত। এখন এটি ডেমো কনটেন্ট হিসেবে দেখানো হচ্ছে।' : 'Student portal content is prepared for future implementation and is shown here as a demo placeholder only.'}</p>
        </div>
      </section>
    </div>
  );
}

function AdminDashboardPage({ language }: { language: Language }) {
  return (
    <div className="page-shell">
      <PageHeader title={language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'} />
      <section className="section-block">
        <div className="container admin-grid">
          {adminModules.map((module) => (
            <article className="admin-card" key={module.title.en}>
              <h3>{language === 'bn' ? module.title.bn : module.title.en}</h3>
              <p>{language === 'bn' ? module.description.bn : module.description.en}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
      </div>
    </section>
  );
}

function NoticeCard({ notice, language }: { notice: Notice; language: Language }) {
  return (
    <article className="notice-card">
      <span className="tag">{language === 'bn' ? notice.categoryLabel.bn : notice.categoryLabel.en}</span>
      <span className="date">{formatDate(notice.date, language)}</span>
      <h3>{language === 'bn' ? notice.title.bn : notice.title.en}</h3>
      <p>{language === 'bn' ? notice.summary.bn : notice.summary.en}</p>
      <div className="notice-actions">
        <Link to={`/notices/${notice.id}`}>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</Link>
        <a href={notice.pdfUrl} target="_blank" rel="noreferrer">
          {language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}
        </a>
      </div>
    </article>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="info-card">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export default App;
