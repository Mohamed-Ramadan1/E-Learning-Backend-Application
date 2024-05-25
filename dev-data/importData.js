import mongoose from 'mongoose';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({});

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Course from './../models/coursesModel.js';
// const User = require('./../../models/userModel');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {});

// READ JSON FILE
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8'),
);

//import the data into  the database

const importData = async () => {
  try {
    await Course.create(courses);
    console.log('data add!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data form collections
const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('data deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
