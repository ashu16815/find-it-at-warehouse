-- CreateTable
CREATE TABLE "RedirectEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queryId" TEXT,
    "queryText" TEXT,
    "targetUrl" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT
);

-- CreateTable
CREATE TABLE "QueryLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queryText" TEXT NOT NULL,
    "resultsTWG" INTEGER NOT NULL,
    "resultsExt" INTEGER NOT NULL
);
