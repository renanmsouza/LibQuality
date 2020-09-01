CREATE TABLE Owners (
  idOwners INTEGER NOT NULL,
  name VARCHAR(200) NULL,
  avatar VARCHAR(250) NULL,
  url VARCHAR(250) NULL,
  type VARCHAR(200) NULL,
  PRIMARY KEY(idOwners)
);

CREATE TABLE Users (
  idUsers INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NULL,
  login VARCHAR(100) NULL,
  password VARCHAR(100) NULL
);

CREATE TABLE Contributors (
  idContributors INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NULL,
  url VARCHAR(250) NULL,
  commits INTEGER NULL
);

CREATE TABLE Projects (
  idProjects INTEGER NOT NULL,
  idOwners INTEGER NOT NULL,
  name VARCHAR(200) NULL,
  description VARCHAR(250) NULL,
  url VARCHAR(250) NULL,
  PRIMARY KEY(idProjects),
  FOREIGN KEY(idOwners)
    REFERENCES Owners(idOwners)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE SearchLog (
  idSearchLog INTEGER PRIMARY KEY AUTOINCREMENT,
  idUsers INTEGER NOT NULL,
  query VARCHAR(200) NULL,
  date DATE NULL,
  time TIME NULL,
  FOREIGN KEY(idUsers)
    REFERENCES Users(idUsers)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE Stars (
  idProjects INTEGER NOT NULL,
  number INTEGER NULL,
  PRIMARY KEY(idProjects),
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE Statistics  (
  idStatistics INTEGER PRIMARY KEY AUTOINCREMENT,
  idProjects INTEGER NOT NULL,
  calculationDate DATETIME NOT NULL,
  openIssues INTEGER NULL,
  closeIssues INTEGER NULL,
  avgAge INTEGER NULL,
  stdAge INTEGER NULL,
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE AccessLog (
  idAccessLog INTEGER PRIMARY KEY AUTOINCREMENT,
  idUsers INTEGER NOT NULL,
  date DATETIME NULL,
  FOREIGN KEY(idUsers)
    REFERENCES Users(idUsers)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE Forks (
  idProjects INTEGER NOT NULL,
  number INTEGER NULL,
  PRIMARY KEY(idProjects),
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE Labels (
  idLabels INTEGER NOT NULL,
  idProjects INTEGER NOT NULL,
  url VARCHAR(250) NULL,
  name VARCHAR(200) NULL,
  color VARCHAR(20) NULL,
  description VARCHAR(250) NULL,
  PRIMARY KEY(idLabels),
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE Issues (
  idIssues INTEGER NOT NULL,
  idProjects INTEGER NOT NULL,
  number INTEGER NULL,
  url VARCHAR(250) NULL,
  title VARCHAR(250) NULL,
  state VARCHAR(20) NULL,
  locked BOOL NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  closed_at DATETIME NULL,
  PRIMARY KEY(idIssues),
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE IssuesLabels (
  idIssues INTEGER NOT NULL,
  idLabels INTEGER NOT NULL,
  PRIMARY KEY(idIssues, idLabels),
  FOREIGN KEY(idIssues)
    REFERENCES Issues(idIssues)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY(idLabels)
    REFERENCES Labels(idLabels)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);

CREATE TABLE ProjectContributors (
  idProjects INTEGER NOT NULL,
  idContributors INTEGER NOT NULL,
  PRIMARY KEY(idProjects, idContributors),
  FOREIGN KEY(idProjects)
    REFERENCES Projects(idProjects)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY(idContributors)
    REFERENCES Contributors(idContributors)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
);


CREATE INDEX Projects_Owner ON Projects(idOwners);
CREATE INDEX SearchLog_Users ON SearchLog(idUsers);
CREATE INDEX Stars_Project ON Stars(idProjects);
CREATE INDEX Statistics_Project ON Statistics(idProjects);
CREATE INDEX AccessLog_User ON AccessLog(idUsers);
CREATE INDEX Forks_Project ON Forks(idProjects);
CREATE INDEX Labels_Project ON Labels(idProjects);
CREATE INDEX Issues_Project ON Issues(idProjects);
CREATE INDEX IssuesLabels_Issue ON IssuesLabels(idIssues);
CREATE INDEX IssuesLabels_Label ON IssuesLabels(idLabels);
CREATE INDEX ProjectContributors_Project ON ProjectContributors(idProjects);
CREATE INDEX ProjectContributors_Contributor ON ProjectContributors(idContributors);

