// File: backend/routes/api.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Import all models
const Book = require('../models/book.model');
const Author = require('../models/author.model');
const Quote = require('../models/quote.model');
const TimelineEvent = require('../models/timelineEvent.model');
const Auliya = require('../models/auliya.model');
const GalleryImage = require('../models/galleryImage.model');
const ResearchRequest = require('../models/researchRequest.model');
const User = require('../models/user.model');
const Setting = require('../models/setting.model');
const Video = require('../models/video.model');

// --- AUTH MIDDLEWARE ---
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// --- PUBLIC ROUTES (for the public website) ---
router.get('/content/all', async (req, res) => {
    try {
        const books = await Book.find().populate('author').limit(8).sort({ createdAt: -1 });
        const quotes = await Quote.find();
        const timelineEvents = await TimelineEvent.find().sort({ sortOrder: 1 });
        const auliyas = await Auliya.find().limit(10);
        const galleryImages = await GalleryImage.find().sort({ createdAt: -1 });
        res.json({ books, quotes, timelineEvents, auliyas, galleryImages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/research-request', async (req, res) => {
    try {
        const newRequest = new ResearchRequest(req.body);
        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- AUTH ROUTES ---
router.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Please provide username and password' });
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Admin user created successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
    const rawUsername = String(req.body?.username || '');
    const username = rawUsername.trim().toLowerCase();
    const password = String(req.body?.password || '');
    const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  router.post('/admin/seed-sample-data', protect, async (req, res) => {
    try {
      const summary = {
        authors: 0,
        books: 0,
        quotes: 0,
        timeline: 0,
        auliyas: 0,
        gallery: 0,
        videos: 0,
        settings: 0,
      };

      let authorDocs = await Author.find().limit(2);
      if (authorDocs.length === 0) {
        authorDocs = await Author.insertMany([
          { name: 'Imam Al-Ghazali', bio: 'Classical Islamic scholar and spiritual thinker.' },
          { name: 'Shah Waliullah', bio: 'Renowned reformer and scholar of the subcontinent.' },
        ]);
        summary.authors = authorDocs.length;
      }

      if ((await Book.countDocuments()) === 0) {
        const sampleAuthor = authorDocs[0]?._id;
        const sampleAuthorTwo = authorDocs[1]?._id || sampleAuthor;
        const books = await Book.insertMany([
          {
            title: 'Ihya Ulum al-Din',
            author: sampleAuthor,
            description: 'A foundational work on Islamic spirituality and ethics.',
                    category: 'Teachings',
            coverImageUrl: 'uploads/sample-islamic-book-cover.avif',
            pdfUrl: 'uploads/sample-shahjalal-biography.pdf',
          },
          {
            title: 'Hujjatullah al-Baligha',
            author: sampleAuthorTwo,
            description: 'A major contribution to Islamic thought and social guidance.',
                    category: 'History',
            coverImageUrl: 'uploads/sample-islamic-book-cover.avif',
            pdfUrl: 'uploads/sample-sufi-order.pdf',
          },
        ]);
        summary.books = books.length;
      }

      if ((await Quote.countDocuments()) === 0) {
        const quotes = await Quote.insertMany([
          { text: 'Knowledge without action is like a tree without fruit.', author: 'Traditional Wisdom' },
          { text: 'Purify the heart and truth will become clear.', author: 'Sufi Teaching' },
        ]);
        summary.quotes = quotes.length;
      }

      if ((await TimelineEvent.countDocuments()) === 0) {
        const timeline = await TimelineEvent.insertMany([
          { year: '1986', title: 'SUST Founded', description: 'Shahjalal University of Science and Technology was established.', sortOrder: 1, imageUrl: 'uploads/sample-central-library.jpg' },
          { year: 'Present', title: 'Islamic Corner Growth', description: 'The Shahjalal Library Corner continues to expand resources.', sortOrder: 2, imageUrl: 'uploads/sample-dargah.jpg' },
        ]);
        summary.timeline = timeline.length;
      }

      if ((await Auliya.countDocuments()) === 0) {
        const auliyas = await Auliya.insertMany([
          {
            name: 'Hazrat Shahjalal (R.)',
            title: 'Saint of Sylhet',
            description: 'One of the most revered Islamic saints in Bengal.',
            imageUrl: 'uploads/sample-dargah.jpg',
            mazarLocation: { address: 'Ambarkhana, Sylhet', lat: 24.9012, lng: 91.8707 },
          },
        ]);
        summary.auliyas = auliyas.length;
      }

      if ((await GalleryImage.countDocuments()) === 0) {
        const gallery = await GalleryImage.insertMany([
                { caption: 'SUST Central Library', category: 'Library', imageUrl: 'uploads/sample-central-library.jpg' },
                { caption: 'Dargah Sharif', category: 'Dargah Sharif', imageUrl: 'uploads/sample-dargah.jpg' },
                { caption: 'Pigeons at Mazar', category: 'Dargah Sharif', imageUrl: 'uploads/sample-pigeons.webp' },
        ]);
        summary.gallery = gallery.length;
      }

      if ((await Video.countDocuments()) === 0) {
        const videos = await Video.insertMany([
          {
            title: 'VC Speech',
            description: 'Vice-Chancellor speech about SUST and values.',
                    category: 'Speeches',
            url: 'https://www.youtube.com/watch?v=HE6Tc_quuK0',
            thumbnail: 'uploads/sample-vc-speech.png',
          },
        ]);
        summary.videos = videos.length;
      }

      if ((await Setting.countDocuments()) === 0) {
        const settings = await Setting.insertMany([
          { key: 'siteTitle', value: 'Shahjalal Library Corner' },
          { key: 'welcomeMessage', value: 'Knowledge, spirituality, and service.' },
        ]);
        summary.settings = settings.length;
      }

      res.json({ message: 'Sample data seeded where missing.', summary });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// --- ADMIN CRUD ROUTES (Generic for simplicity) ---
const createCrudRoutes = (modelName, model) => {
    router.get(`/admin/${modelName}`, protect, async (req, res) => {
        try {
            res.json(await model.find());
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    router.post(`/admin/${modelName}`, protect, async (req, res) => {
        try {
            res.status(201).json(await model.create(req.body));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    router.put(`/admin/${modelName}/:id`, protect, async (req, res) => {
        try {
            res.json(await model.findByIdAndUpdate(req.params.id, req.body, { new: true }));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    router.delete(`/admin/${modelName}/:id`, protect, async (req, res) => {
        try {
            await model.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

// Specific routes for models that need population in GET all (registered BEFORE generic)
router.get('/admin/books', protect, async (req, res) => {
    try {
        const books = await Book.find().populate('author');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

createCrudRoutes('books', Book);
createCrudRoutes('authors', Author);
createCrudRoutes('quotes', Quote);
createCrudRoutes('timeline', TimelineEvent);
createCrudRoutes('auliyas', Auliya);
createCrudRoutes('gallery', GalleryImage);
createCrudRoutes('requests', ResearchRequest);
createCrudRoutes('settings', Setting);
createCrudRoutes('videos', Video);

// Public route for settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await Setting.find();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public route for videos
router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Storage for book PDFs and cover images
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/books/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const bookUpload = multer({ storage: bookStorage });

// Book upload endpoint
router.post('/admin/books/upload', protect, bookUpload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    const pdfUrl = req.files['pdf'] ? req.files['pdf'][0].path : '';
    const coverImageUrl = req.files['coverImage'] ? req.files['coverImage'][0].path : '';
    if (!title || !author || !description || !category || !pdfUrl || !coverImageUrl) {
      return res.status(400).json({ message: 'All fields and files are required.' });
    }
    const book = new Book({ title, author, description, category, pdfUrl, coverImageUrl });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Storage for gallery images
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const galleryUpload = multer({ storage: galleryStorage });

// Gallery image upload endpoint
router.post('/admin/gallery/upload', protect, galleryUpload.single('image'), async (req, res) => {
  try {
    const { caption, category } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    if (!caption || !category || !imageUrl) {
      return res.status(400).json({ message: 'All fields and image are required.' });
    }
    const galleryImage = new GalleryImage({ caption, category, imageUrl });
    await galleryImage.save();
    res.status(201).json(galleryImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Storage for timeline event images
const timelineStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/timeline/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const timelineUpload = multer({ storage: timelineStorage });

// Timeline event image upload endpoint
router.post('/admin/timeline/upload', protect, timelineUpload.single('image'), async (req, res) => {
  try {
    const { year, title, description, sortOrder } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    if (!year || !title || !description || !sortOrder || !imageUrl) {
      return res.status(400).json({ message: 'All fields and image are required.' });
    }
    const timelineEvent = new TimelineEvent({ year, title, description, sortOrder, imageUrl });
    await timelineEvent.save();
    res.status(201).json(timelineEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Storage for auliya images
const auliyaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/auliyas/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const auliyaUpload = multer({ storage: auliyaStorage });

// Auliya image upload endpoint
router.post('/admin/auliyas/upload', protect, auliyaUpload.single('image'), async (req, res) => {
  try {
    const { name, title, description, address, lat, lng } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    if (!name || !title || !description || !address || !lat || !lng || !imageUrl) {
      return res.status(400).json({ message: 'All fields and image are required.' });
    }
    const mazarLocation = { address, lat: parseFloat(lat), lng: parseFloat(lng) };
    const auliya = new Auliya({ name, title, description, imageUrl, mazarLocation });
    await auliya.save();
    res.status(201).json(auliya);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Storage for video files and thumbnails
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') cb(null, 'uploads/videos/');
    else if (file.fieldname === 'thumbnail') cb(null, 'uploads/videos/');
    else cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const videoUpload = multer({ storage: videoStorage });

// Video upload endpoint
router.post('/admin/videos/upload', protect, videoUpload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, url } = req.body;
    let videoUrl = url || '';
    if (req.files['video']) videoUrl = req.files['video'][0].path;
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : '';
    if (!title || !category || (!videoUrl && !thumbnail)) {
      return res.status(400).json({ message: 'Title, category, and either video file or link are required.' });
    }
    const video = new Video({ title, description, category, url: videoUrl, thumbnail });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;