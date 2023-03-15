const { reset } = require('nodemon');
const db = require('../db/index');

const createAlbum = async (req, res) => {
  const { name, year } = req.body;
  try {
    const { rows: [artist] } = await db.query(
      `SELECT * FROM Artists WHERE id = ${req.params.id}`,
    );
    if (!artist) {
      res.sendStatus(404);
    }

    const { rows: [album] } = await db.query(
      'INSERT INTO Albums (name, year, artistId) VALUES ($1, $2, $3) RETURNING *',
      [name, year, req.params.id],
    );
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const returnedAlbums = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM Albums');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const albumById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM Albums');
    const { rows: [album] } = await db.query('SELECT * FROM Albums WHERE id = $1', [id]);

    if (!album) {
      res.send(404).json({ message: `album ${id} does not exist` });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { createAlbum, returnedAlbums, albumById };
