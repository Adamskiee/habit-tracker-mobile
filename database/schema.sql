-- SQLite
CREATE TABLE
    IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firestore_id TEXT UNIQUE,
        title TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        completed INTEGER CHECK (completed IN (0, 1)) NOT NULL DEFAULT "0",
        isDeleted INTEGER CHECK (isSync IN (0, 1)) NOT NULL DEFAULT "0",
        isSync INTEGER CHECK (isSync IN (0, 1)) NOT NULL DEFAULT "0",
        updatedAt TEXT DEFAULT (datetime ('now', 'utc'))
    );