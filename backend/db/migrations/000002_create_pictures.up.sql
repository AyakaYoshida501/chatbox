CREATE TABLE IF NOT EXISTS aikon_db.pictures (
    id BIGINT(11) NOT NULL AUTO_INCREMENT,
    pic VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    detail VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
)ENGINE=INNODB DEFAULT CHARSET=utf8mb4;