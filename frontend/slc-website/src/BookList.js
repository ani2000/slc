import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, User, Hash } from 'lucide-react';

import cover1 from './assets/book-covers/cover-1.jpeg';
import cover2 from './assets/book-covers/cover-2.jpeg';
import cover3 from './assets/book-covers/cover-3.png';
import cover4 from './assets/book-covers/cover-4.jpeg';

const FIXED_COVERS = [cover1, cover2, cover3, cover4];

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Book categories based on the CSV content
  const categories = [
    { id: 'all', name: 'সব বই', count: 0 },
    { id: 'hadith', name: 'হাদিস ও সুন্নাহ', count: 0 },
    { id: 'tafsir', name: 'তাফসির ও কুরআন', count: 0 },
    { id: 'fiqh', name: 'ফিকহ ও ইসলামী আইন', count: 0 },
    { id: 'sufism', name: 'তাসাউফ ও আধ্যাত্মিকতা', count: 0 },
    { id: 'history', name: 'ইসলামের ইতিহাস', count: 0 },
    { id: 'biography', name: 'জীবনী ও সিরাহ', count: 0 },
    { id: 'philosophy', name: 'ইসলামী দর্শন', count: 0 },
    { id: 'science', name: 'বিজ্ঞান ও আধুনিক বিষয়', count: 0 }
  ];

  const MAX_VISIBLE_BOOKS = 15;

  const loadBooksFromCSV = useCallback(async () => {
    try {
      // For now, we'll use the CSV data directly since it's already available
      // In a real implementation, you'd fetch this from an API
      const csvData = [
        // Hadith Books
        { libraryCode: 'SC80314', bookName: 'বুখারী শরীফ - পঞ্চম খণ্ড', writer: 'ইমাম মুহাম্মদ ইবনে ইসমাইল বোখারী (র)', category: 'hadith' },
        { libraryCode: 'SC80847', bookName: 'মেশকাত শরীফ', writer: 'মাওলানা নূর মোহাম্মদ আজমী রহ.', category: 'hadith' },
        { libraryCode: 'SC80869', bookName: 'রিয়াদুস সালিহীন - প্রথম খণ্ড', writer: 'ইমাম মুহিউদ্দীন ইয়াহইয়া আন-নববী (রহ.)', category: 'hadith' },
        { libraryCode: 'SC80888', bookName: 'সহীহ্‌ মুসলিম শরীফ (সকল খণ্ড একত্রে)', writer: 'ইমাম আবুল হুসাইন মুসলিম বিন আল হাজ্জাজ কুশায়রী (র)', category: 'hadith' },
        { libraryCode: 'SC80837', bookName: 'বোখারী শরীফ (১-১০ খণ্ড একত্রে)', writer: 'ইমাম মুহাম্মদ ইবনে ইসমাইল বোখারী (র)', category: 'hadith' },
        { libraryCode: 'SC80886', bookName: 'শামায়েলে তিরমিযী সকল খন্ড একত্রে', writer: 'ইমাম আবু ঈসা মুহাম্মদ ইবনে ঈসা আত তিরমিযী (রহঃ)', category: 'hadith' },
        { libraryCode: 'SC81080', bookName: 'সুনানে ইবনে মাজাহ (সকল খন্ড একত্রে)', writer: 'আবু আবদুল্লাহ মুহাম্মদ ইবনে ইয়াজিদ ইবনে মাজাহ আল-কাযবীনী (রহ.)', category: 'hadith' },
        { libraryCode: 'SC81260', bookName: 'আল-আদাবুল মুফরাদ', writer: 'ইমাম মুহাম্মদ ইবনে ইসমাইল বোখারী (র)', category: 'hadith' },
        { libraryCode: 'SC80892', bookName: 'প্রিয় নবীর সুন্নাতসমূহ', writer: 'মাওলানা হাকীম মুহাম্মদ আখতার ছাহেব (রহ.)', category: 'hadith' },
        { libraryCode: 'SC80890', bookName: 'বিষয়ভিত্তিক হাদীসে কুদসী সমগ্র', writer: 'আল্লামা মুহাম্মদ নাসীরুদ্দীন আলবানী (রহঃ)', category: 'hadith' },
        
        // Tafsir Books
        { libraryCode: 'SC80823', bookName: 'তাফসীর ইবনে কাছীর', writer: 'আল্লামা ইমাদুদ্দীন ইবনে কাছীর (রহঃ)', category: 'tafsir' },
        { libraryCode: 'SC81274', bookName: 'কুরআন বুঝার প্রথম পাঠ', writer: 'আবদুস শহীদ নাসিম', category: 'tafsir' },
        { libraryCode: 'SC81050', bookName: 'কাসাসুল কুরআন-১ (হযরত আদম, ইদরিস নুহ, হুদ, সালেহ (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81051', bookName: 'কাসাসুল কুরআন-২ (হযরত ইবরাহিম, ইসমাইল, ইসহাক, লুত, ইয়াকুব (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81052', bookName: 'কাসাসুল কুরআন-৩ (হযরত ইউসুফ, শুআইব (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81053', bookName: 'কাসাসুল কুরআন-৪ (হযরত মুসা ও হারুন (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81054', bookName: 'কাসাসুল কুরআন-৫ (হযরত দাউদ, ইউশা বিন নুন, হিযকিল, ইলয়াস, আল-ইয়াসাআ, শামাবিল (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81055', bookName: 'কাসাসুল কুরআন-৬ (হযরত সুলাইমান, আইয়ুব, ইউনুস (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81056', bookName: 'কাসাসুল কুরআন-৭ (হযরত যুলকিফল, উযায়ের, যাকারিয়া, ইয়াহইয়া (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81057', bookName: 'কাসাসুল কুরআন-৮ (হযরত লুকমান (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81058', bookName: 'কাসাসুল কুরআন - ৯ আসহাবুল কাহফ ওয়ার রাকিম এবং সাবা ও সাইলুল আরিম, আসহাবুল উখদুদ বা কওমে তুব্বা ও আসহাবুল ফিল', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81059', bookName: 'কাসাসুল কুরআন-১০ (হযরত ইসা (আ.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        { libraryCode: 'SC81060', bookName: 'কাসাসুল কুরআন-১১ (হযরত মুহাম্মদ (সা.))', writer: 'মাওলানা হিফযুর রহমান সিওহারবী রহ.', category: 'tafsir' },
        
        // Fiqh Books
        { libraryCode: 'SC80814', bookName: 'ফিকহুল বুয়ু', writer: 'শাইখুল ইসলাম মুফতী মুহাম্মাদ তাকী উসমানী', category: 'fiqh' },
        { libraryCode: 'SC81066', bookName: 'ম্যারেজ ইন ইসলাম', writer: 'নায়েক, ডা. জাকির', category: 'fiqh' },
        { libraryCode: 'SC81270', bookName: 'কুরআন-সুন্নাহর আলোকে পোশাক, পর্দা ও দেহ-সজ্জা', writer: 'খোন্দকার আব্দুল্লাহ জাহাঙ্গীর', category: 'fiqh' },
        { libraryCode: 'SC81250', bookName: 'ইসলামের যাকাত বিধান-প্রথম খণ্ড', writer: 'ড. ইউসুফ আল কারজাভি', category: 'fiqh' },
        { libraryCode: 'SC81251', bookName: 'ইসলামের যাকাত বিধান-দ্বিতীয় খণ্ড', writer: 'ড. ইউসুফ আল কারজাভি', category: 'fiqh' },
        { libraryCode: 'SC81086', bookName: 'কিতাবুস সালাত', writer: 'সৈয়দ আহমদ চৌধুরী', category: 'fiqh' },
        { libraryCode: 'SC81517', bookName: 'নামাজের ৫০০ মাসয়ালা', writer: 'মুহাম্মদ ইকবাল কিলানী', category: 'fiqh' },
        { libraryCode: 'SC81511', bookName: 'আল্লাহর রাসুল কিভাবে নামায পড়তেন', writer: 'ইমাম হাফিয ইবনু কায়্যিমিল', category: 'fiqh' },
        
        // Sufism Books
        { libraryCode: 'SC81013', bookName: 'ইমাম গাযালীর চিঠি', writer: 'হুজ্জাতুল ইসলাম ইমাম গাযযালী রহ', category: 'sufism' },
        { libraryCode: 'SC81030', bookName: 'কিমিয়ায়ে সাআদাত', writer: 'হুজ্জাতুল ইসলাম ইমাম গাযযালী রহ.', category: 'sufism' },
        { libraryCode: 'SC81093', bookName: 'দিওয়ান-ই-শামস-ই-তাবরিজ', writer: 'মাওলানা জালাল উদ্দিন রূমী (রহঃ)', category: 'sufism' },
        { libraryCode: 'SC81082', bookName: 'মছনবী শরীফ (সব খণ্ড একত্রে)', writer: 'মাওলানা জালাল উদ্দিন রূমী (রহঃ)', category: 'sufism' },
        { libraryCode: 'SC81063', bookName: 'আল-মুরশিদুল-আমীন', writer: 'হুজ্জাতুল ইসলাম ইমাম গাযযালী রহ.', category: 'sufism' },
        { libraryCode: 'SC81068', bookName: 'হুসনে আখলাক', writer: 'হুজ্জাতুল ইসলাম ইমাম গাযযালী রহ', category: 'sufism' },
        { libraryCode: 'SC81167', bookName: 'তাসাওউফ ও আত্মশুদ্ধি', writer: 'শাইখুল ইসলাম মুফতী মুহাম্মাদ তাকী উসমানী', category: 'sufism' },
        
        // History Books
        { libraryCode: 'SC80702', bookName: 'মুসলিম সভ্যতার ১০০১ আবিষ্কার', writer: 'সেলিম টি এস আল-হাসসানি', category: 'history' },
        { libraryCode: 'SC81161', bookName: 'বাংলার মুসলমানদের ইতিহাস', writer: 'আব্বাস আলী খান', category: 'history' },
        { libraryCode: 'SC81298', bookName: 'সিলেটের শত গুনীজন', writer: 'সৈয়দ কামাল আহমদ বাবু', category: 'history' },
        { libraryCode: 'SC81292', bookName: 'আরাকানের মুসলমানদের ইতিহাস', writer: 'মাহফুজুর রহমান আখন্দ', category: 'history' },
        { libraryCode: 'SC81119', bookName: 'দি ইন্ডিয়ান মুসলমানস', writer: 'ডব্লিউ ডব্লিউ হান্টার', category: 'history' },
        { libraryCode: 'SC81290', bookName: 'খুন রাঙা পথ', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81294', bookName: 'ভেঙ্গে গেল তলোয়ার', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81296', bookName: 'মুহম্মদ ইবন কাসিম', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81479', bookName: 'ইউসুফ বিন তাশফিন', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81481', bookName: 'সীমান্ত ঈগল', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81473', bookName: 'হেজাযের কাফেলা', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81483', bookName: 'আঁধার রাতের মুসাফির', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81475', bookName: 'মরণজয়ী', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81477', bookName: 'শেষ প্রান্তর', writer: 'নসীম হিজাযী', category: 'history' },
        { libraryCode: 'SC81472', bookName: 'কায়সার ও কিসরা', writer: 'নসীম হিজাযী', category: 'history' },
        
        // Biography Books
        { libraryCode: 'SC80877', bookName: 'হযরত শাহজালাল ও হযরত শাহপরান (র.)-এর আশ্চার্য কেরামতসহ জীবনী', writer: 'মোঃ মোস্তফা জামান', category: 'biography' },
        { libraryCode: 'SC81088', bookName: 'সীরাতুন নবী (সা.) - প্রথম খণ্ড', writer: 'মাওলানা হাকীম মুহাম্মদ আখতার ছাহেব (রহ.)', category: 'biography' },
        { libraryCode: 'SC81276', bookName: 'নবীদের সংগ্রামী জীবন', writer: 'মাওলানা আবদুস শহীদ নাসিম', category: 'biography' },
        { libraryCode: 'SC81303', bookName: 'হযরত শাহ্‌ জালাল (রা.)', writer: 'মোঃ জিয়াউল হক', category: 'biography' },
        { libraryCode: 'SC81015', bookName: 'নবীদের ওয়ারিশ', writer: 'মাওলানা আবদুস শহীদ নাসিম', category: 'biography' },
        { libraryCode: 'SC81098', bookName: 'সিরাতে ইবনে হিশাম', writer: '', category: 'biography' },
        { libraryCode: 'SC81487', bookName: 'জান্নাতী ২০ রমণী', writer: 'মুয়াল্লীমা মোরশেদা বেগম', category: 'biography' },
        { libraryCode: 'SC81489', bookName: 'রাসুলুল্লাহ (স.) এর স্ত্রীগণ যেমন ছিলেন', writer: 'মুয়াল্লীমা মোরশেদা বেগম', category: 'biography' },
        { libraryCode: 'SC81513', bookName: 'ওমর ইবনে আবদুল আজীজ (র.)', writer: 'রশীদ আখতার নদভী', category: 'biography' },
        
        // Philosophy Books
        { libraryCode: 'SC81183', bookName: 'আদর্শ মুসলিম', writer: 'ড. মুহাম্মদ আলী আল্‌ হাশেমী', category: 'philosophy' },
        { libraryCode: 'SC81278', bookName: 'ইসলামের রাষ্ট্রব্যবস্থা', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81258', bookName: 'আল-কুরআনে রাষ্ট্র ও সরকার', writer: 'মাওলানা মুহাম্মাদ আবদুর রহীম', category: 'philosophy' },
        { libraryCode: 'SC81286', bookName: 'লা-তাহ্‌যান', writer: 'আইদ আল কারণী', category: 'philosophy' },
        { libraryCode: 'SC81272', bookName: 'ইসলামের নামে জঙ্গীবাদ', writer: 'খোন্দকার আব্দুল্লাহ জাহাঙ্গীর', category: 'philosophy' },
        { libraryCode: 'SC81523', bookName: 'শরিয়ার দৃষ্টিতে রাষ্ট্র', writer: 'মুহাম্মদ ইবনে ইবরাহীম আততুওয়াইজিরী', category: 'philosophy' },
        { libraryCode: 'SC81521', bookName: 'মুসলিম প্যারেন্টিং', writer: 'মুহাম্মাদ আব্দুল বারী', category: 'philosophy' },
        
        // Science Books
        { libraryCode: 'SC81147', bookName: 'মহাবিশ্বে কুরআন ও বিজ্ঞান', writer: 'গোলাম মোহাম্মাদ', category: 'science' },
        { libraryCode: 'SC81044', bookName: 'কুরান ও আধুনিক বিজ্ঞান', writer: 'নায়েক, জাকির', category: 'science' },
        { libraryCode: 'SC81135', bookName: 'সাইন্টিফিক আল কুরআন', writer: 'মোহাম্মদ নাছের উদ্দিন', category: 'science' },
        { libraryCode: 'SC81515', bookName: 'মানুষের আদি উৎস', writer: 'ড. মরিস বুকাইলি', category: 'science' },
        { libraryCode: 'SC81163', bookName: 'বাইবেল, কুরআন ও বিজ্ঞান', writer: 'সৈয়দ কামাল আহমদ বাবু', category: 'science' },
        { libraryCode: 'SC81043', bookName: 'বাইবেল কোরআন ও বিজ্ঞান', writer: 'মরিস বুকাইলি', category: 'science' },
        { libraryCode: 'SC81040', bookName: 'কোরআন ও বিজ্ঞান', writer: 'মোস্তাক আহমদ', category: 'science' },
        
        // Additional Important Books
        { libraryCode: 'SC80704', bookName: 'দুআ বিশ্বকোষ', writer: 'ইমাম মুহিউদ্দীন ইয়াহইয়া আন-নববী (রহ.)', category: 'philosophy' },
        { libraryCode: 'SC81070', bookName: 'মরনের আগে ও পরে', writer: 'হুজ্জাতুল ইসলাম ইমাম গাযযালী রহ.', category: 'philosophy' },
        { libraryCode: 'SC81061', bookName: 'মৃত্যু থেকে কিয়ামাত', writer: 'ইমাম বাইহাকি', category: 'philosophy' },
        { libraryCode: 'SC81073', bookName: 'কবর কি পহেলী রাত বা কবরের প্রথম রজনী', writer: 'মাওলানা মুহাম্মদ শহীদুল ইসলাম', category: 'philosophy' },
        { libraryCode: 'SC81091', bookName: 'কিয়ামতের আলামত বিষয়ে রাসূলুল্লাহ (সা.)-এর ভবিষ্যত বাণী', writer: 'মাওলানা মুহাম্মদ ইকবাল কীলানী', category: 'philosophy' },
        { libraryCode: 'SC81143', bookName: 'নারী অধিকার বিভ্রান্তি ও ইসলাম', writer: 'নঈম সিদ্দিকী', category: 'fiqh' },
        { libraryCode: 'SC81155', bookName: 'পরিবার ও পারিবারিক জীবন', writer: 'মুহাম্মদ আব্দুর রহীম', category: 'philosophy' },
        { libraryCode: 'SC81149', bookName: 'রাসূল (সা.)-এর ২৪ ঘন্টার আমল', writer: 'ইমাম মুহিউদ্দীন ইয়াহইয়া আন-নববী (রহ.)', category: 'biography' },
        { libraryCode: 'SC81075', bookName: 'ক্যারিয়ার গঠন ও দক্ষতা উন্নয়ন', writer: 'আব্দুদ্দাইয়ান মুহাম্মদ ইউনুছ', category: 'philosophy' },
        { libraryCode: 'SC81133', bookName: 'ইসলাম ও অর্থনৈতিক চ্যালেঞ্জ', writer: 'মুহাম্মাদ উমর চাপরা', category: 'philosophy' },
        { libraryCode: 'SC81280', bookName: 'ইসলামী ব্যাংকের ইতিহাস ইসলামী অর্থনীতি ও ব্যাংকিং', writer: 'মুহা. কামরুজ্জামান', category: 'philosophy' },
        { libraryCode: 'SC81129', bookName: 'Science Of DaWah', writer: 'Shaikh Akhlaque-E-Rasul', category: 'philosophy' },
        { libraryCode: 'SC81159', bookName: 'মক্কার পথ', writer: 'আল্লামা মুহাম্মদ আসাদ', category: 'biography' },
        { libraryCode: 'SC81112', bookName: 'মস্তিষ্কের মালিকানা', writer: 'মো: আব্দুল হামিদ', category: 'science' },
        { libraryCode: 'SC81038', bookName: 'প্রতিদিন একটি আয়াত', writer: '', category: 'tafsir' },
        { libraryCode: 'SC81151', bookName: 'লস্ট ইসলামিক হিস্ট্রি', writer: '', category: 'history' },
        { libraryCode: 'SC81096', bookName: 'মুজাররদ', writer: 'মুহাম্মদ সৈয়দুল হক', category: 'philosophy' },
        { libraryCode: 'SC81282', bookName: 'বুক অব ইসলামিক নলেজ', writer: 'ইকবাল কবীর মোহন', category: 'philosophy' },
        { libraryCode: 'SC81266', bookName: 'আল ফিকহুল আকবর', writer: 'মাওলানা হাকীম মুহাম্মদ আখতার ছাহেব (রহ.)', category: 'fiqh' },
        { libraryCode: 'SC81264', bookName: 'হাদীসের নামে জালিয়াতি', writer: '', category: 'hadith' },
        { libraryCode: 'SC81262', bookName: 'আল আযকার', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81288', bookName: 'অহীর আয়নায় পরকাল', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81284', bookName: 'রূহের রহস্য', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81507', bookName: 'একশ বছরের রাজনীতি', writer: 'আবুল আসাদ', category: 'history' },
        { libraryCode: 'SC81485', bookName: 'জান্নাতী ২০ রমণী', writer: 'মুফতি মুহাম্মদ আবুল কাসেম গাজী', category: 'biography' },
        { libraryCode: 'SC81491', bookName: '৩৬৫ দিনের ডায়েরী', writer: 'মো: নিজাম উদ্দিন', category: 'philosophy' },
        { libraryCode: 'SC81496', bookName: 'পবিত্র কুরআনে জেরুজালেম', writer: 'ইমরান নযর হোসেন', category: 'tafsir' },
        { libraryCode: 'SC81497', bookName: 'দাওয়াম', writer: 'ইমরান নযর হোসেন', category: 'philosophy' },
        { libraryCode: 'SC81501', bookName: 'রাসূল (সা.) এর প্র‌্যাকটিক্যাল নামায', writer: 'মুহাম্মদ ইবনে ইবরাহীম আততুওয়াইজিরী', category: 'fiqh' },
        { libraryCode: 'SC81509', bookName: 'জীবনকে উপভোগ করুন', writer: 'মুহাম্মাদ ইবনে আবদুর রহমান আরিফী', category: 'philosophy' },
        { libraryCode: 'SC81553', bookName: 'দ্যা গোল্ডেন ওয়ার্ডস', writer: 'মুহাম্মাদ জাহিদুল ইসলাম', category: 'philosophy' },
        { libraryCode: 'SC81559', bookName: 'পয়গামে মুহাম্মদী', writer: 'সাইয়্যেদ সুলাইমান নদভি (রহ.)', category: 'biography' },
        { libraryCode: 'SC81503', bookName: 'ফিলিস্তিনের বুকে ইজরাইল', writer: 'আসাদ পারভেজ', category: 'history' },
        { libraryCode: 'SC81557', bookName: 'জীবন সায়াহ্নে মানবতার রূপ', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81555', bookName: 'মাআল আইম্মাহ', writer: 'সালমান আল আওদা', category: 'philosophy' },
        { libraryCode: 'SC81539', bookName: 'তাফসীরে সাঈদী সূরা আল - ফাতিহা', writer: 'মাওলানা দেলাওয়ার হোসাইন সাঈদী', category: 'tafsir' },
        { libraryCode: 'SC81541', bookName: 'তাফসীরে সাঈদী সূরা আল - আসর', writer: 'মাওলানা দেলাওয়ার হোসাইন সাঈদী', category: 'tafsir' },
        { libraryCode: 'SC81537', bookName: 'কুরআন দিয়ে কুরআন বুঝুন', writer: 'মাওলানা দেলাওয়ার হোসাইন সাঈদী', category: 'tafsir' },
        { libraryCode: 'SC81543', bookName: 'আলোচিত অভিযোগের কাঙ্ক্ষিত জবাব', writer: 'আসলাম হোসাইন', category: 'philosophy' },
        { libraryCode: 'SC81531', bookName: 'ইসলাম', writer: 'ইয়াহিয়া এমেরিক', category: 'philosophy' },
        { libraryCode: 'SC81547', bookName: 'হাদীসের আলোকে মানব জীবন (১ম খণ্ড)', writer: 'আবুল কালাম মুহাম্মদ ইউসূফ', category: 'hadith' },
        { libraryCode: 'SC81493', bookName: 'ইসলামী অর্থনীতি নির্বাচিত প্রবন্ধ', writer: 'শাহ্ মুহাম্মদ হাবীবুর রহমান', category: 'philosophy' },
        { libraryCode: 'SC81549', bookName: 'হাদীসের আলোকে মানব জীবন (২য় খণ্ড)', writer: 'আবুল কালাম মুহাম্মদ ইউসূফ', category: 'hadith' },
        { libraryCode: 'SC81551', bookName: 'হাদীসের আলোকে মানব জীবন (৩য় ও ৪র্থ খণ্ড)', writer: 'আবুল কালাম মুহাম্মদ ইউসূফ', category: 'hadith' },
        { libraryCode: 'SC81535', bookName: 'কুরআন ও সুন্নাহর আলোকে সগিরা গুনাহ', writer: 'মুহাম্মদ ইস্রাফিল হোসাইন', category: 'fiqh' },
        { libraryCode: 'SC81499', bookName: 'মুসলমানদের পতনে বিশ্ব কী হারালো?', writer: 'মাওলানা সাইয়্যিদ আবুল হাসান আলী নদভী রহ', category: 'history' },
        { libraryCode: 'SC81505', bookName: 'মাইলস্টোন', writer: 'সাইয়িদ কুতুব শহিদ', category: 'philosophy' },
        { libraryCode: 'SC81545', bookName: 'কুরআনের আলোকে মুমিনের জীবন', writer: 'মতিউর রহমান নিজামী', category: 'tafsir' },
        { libraryCode: 'SC81519', bookName: 'শহীদ হাসানুল বান্নার ডায়েরী', writer: 'মাওলানা খলিল আহমদ হামেদী', category: 'biography' },
        { libraryCode: 'SC81301', bookName: 'দুর্বিন শাহ সমগ্র', writer: '', category: 'philosophy' },
        { libraryCode: 'SC81268', bookName: 'কুরআন ও সহীহ হাদীসের আলোকে ফাযায়িলে আমাল', writer: '', category: 'hadith' },
        { libraryCode: 'SC81017', bookName: 'সালাফদের ইলমী শ্রেষ্ঠত্ব', writer: 'ইমাম ইবনে রজব আল হাম্বলী', category: 'history' },
        { libraryCode: 'SC81100', bookName: 'সুদ হারাম', writer: 'মোহাইমিন পাটোয়ারী', category: 'fiqh' },
        { libraryCode: 'SC81018', bookName: 'ফাহমুস সালাফ', writer: 'ইফতেখার সিফাত', category: 'philosophy' },
        { libraryCode: 'SC81079', bookName: 'মুক্তিযুদ্ধের বয়ানে ইসলাম', writer: 'পিনাকী ভট্টাচার্য', category: 'history' },
        { libraryCode: 'SC81012', bookName: 'উত্তরসূরি', writer: 'মো. আরিফুল ইসলাম', category: 'philosophy' },
        { libraryCode: 'SC81029', bookName: 'প্রশ্নোত্তরে রমজানের ত্রিশ শিক্ষা', writer: 'ডা. জাকির নায়েক', category: 'fiqh' },
        { libraryCode: 'SC81028', bookName: 'কবীরা গুনাহ', writer: 'ইমাম ইবনু কায়্যিমিল জাওযিয়্যাহ', category: 'fiqh' },
        { libraryCode: 'SC81026', bookName: 'আমলে নাজাত', writer: 'শাইখ আব্দুল হামীদ আল-ফাইযী আল-মাদানী', category: 'philosophy' },
        { libraryCode: 'SC81025', bookName: 'শুআবুল ঈমান', writer: 'ইমাম বায়হাকী', category: 'philosophy' },
        { libraryCode: 'SC81020', bookName: 'কিতাবুত তাওহীদ', writer: 'মুহাম্মদ বিন আব্দুল ওহাব', category: 'philosophy' },
        { libraryCode: 'SC81019', bookName: 'জ্ঞানের পথে চলার বাঁকে', writer: 'বাক্‌র আবু জাইদ', category: 'philosophy' },
        { libraryCode: 'SC81095', bookName: 'দেওয়ানে শামসে তাবরীয', writer: 'মাওলানা জালাল উদ্দিন রূমী', category: 'sufism' }
      ];

      // Add cover images for each book
      const booksWithCovers = csvData.map(book => ({
        ...book,
        coverImage: getBookCoverImage(book.bookName, book.writer, book.category)
      }));

      setBooks(booksWithCovers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  }, []);

  const getBookCoverImage = (bookName, writer, category) => {
    // Four requested photos used in randomized sequence
    const sessionSeed = new Date().getDate();
    let hash = 0;
    const str = `${bookName || ''}${writer || ''}${category || ''}${sessionSeed}`;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FIXED_COVERS[Math.abs(hash) % FIXED_COVERS.length];
  };

  const filterBooks = useCallback(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.libraryCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered.slice(0, MAX_VISIBLE_BOOKS));
  }, [books, searchTerm, selectedCategory]);

  useEffect(() => {
    loadBooksFromCSV();
  }, [loadBooksFromCSV]);

  useEffect(() => {
    filterBooks();
  }, [filterBooks]);

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return books.length;
    return books.filter(book => book.category === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">বই লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-green-50 pb-12">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 48, 32, 0.82), rgba(15, 48, 32, 0.92)), url('/Books/islamic-book-cover.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/40 bg-white/10 px-4 py-2 text-sm text-amber-100 mb-5">
              <span>হযরত শাহজালাল (রহ.)</span>
              <span>•</span>
              <span>SUST Central Library</span>
              <span>•</span>
              <span>Islamic Corner</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              <BookOpen className="inline-block mr-3 text-amber-300" size={40} />
              শাহজালাল লাইব্রেরি বই সংগ্রহ
            </h1>
            <p className="text-lg text-amber-50/90 max-w-3xl mx-auto">
              ইসলামী সাহিত্য, হাদিস, তাফসির, ফিকহ ও আধ্যাত্মিক বইয়ের সমৃদ্ধ সংগ্রহ ঘুরে দেখুন
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="বইয়ের নাম, লেখক বা লাইব্রেরি কোড দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/95 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category.name} ({getCategoryCount(category.id)})
            </button>
          ))}
        </motion.div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.libraryCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-amber-100"
            >
              {/* Book Cover */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.bookName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 bg-[#235B3F] text-white px-2 py-1 rounded-full text-xs font-medium">
                  <Hash size={12} className="inline mr-1" />
                  {book.libraryCode}
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#235B3F] transition-colors duration-200">
                  {book.bookName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  <User size={14} className="inline mr-1" />
                  {book.writer || 'অজানা লেখক'}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.category === 'hadith' ? 'bg-blue-100 text-blue-800' :
                    book.category === 'tafsir' ? 'bg-green-100 text-green-800' :
                    book.category === 'fiqh' ? 'bg-purple-100 text-purple-800' :
                    book.category === 'sufism' ? 'bg-orange-100 text-orange-800' :
                    book.category === 'history' ? 'bg-red-100 text-red-800' :
                    book.category === 'biography' ? 'bg-indigo-100 text-indigo-800' :
                    book.category === 'philosophy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {categories.find(cat => cat.id === book.category)?.name || book.category}
                  </span>
                  <button className="text-[#235B3F] hover:text-green-700 text-sm font-medium transition-colors duration-200">
                    বিস্তারিত দেখুন →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো বই পাওয়া যায়নি</h3>
            <p className="text-gray-600">সার্চ শব্দ বা ক্যাটাগরি পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </motion.div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.min(books.length, MAX_VISIBLE_BOOKS)}</div>
              <div className="text-sm text-gray-600">প্রদর্শিত বই</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{getCategoryCount('hadith')}</div>
              <div className="text-sm text-gray-600">হাদিসের বই</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{getCategoryCount('tafsir')}</div>
              <div className="text-sm text-gray-600">তাফসিরের বই</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{getCategoryCount('sufism')}</div>
              <div className="text-sm text-gray-600">তাসাউফের বই</div>
            </div>
          </motion.div>
          <p className="mt-6 text-center text-sm text-gray-600">
            Screenshot-friendly view shows the top 15 books only. The complete sample dataset is preserved in the source and admin workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookList; 