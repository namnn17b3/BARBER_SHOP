import { configValue } from 'datasource';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { MAX_VALUE_40, MIN_VALUE_18 } from '@common/constant/validate.constant';
import { Barber } from '@barber/barber.entity';
import { Gender } from '@barber/barber-gender.enum';
dotenv.config();

const datasource = new DataSource(configValue);

const surname = ['Nguyễn', 'Trần', 'Đặng', 'Lê', 'Đỗ'];
const middleNameMale = ['Văn', 'Mạnh', 'Ngọc', 'Trung', 'Tiến'];
const middleNameFemale = ['Thị', 'Thùy', 'Thanh', 'Phương', 'Như'];
const nameMale = ['Hùng', 'Thành', 'Hiệp', 'Nghĩa', 'Lộc'];
const nameFemale = ['Hoa', 'Thảo', 'Trang', 'My', 'Quỳnh'];
const genders = ['MALE', 'FEMALE'];

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function initializeDatabase() {
  if (!datasource.isInitialized) {
    await datasource.initialize();
  }
}

function randomName(gender: string) {
  switch (gender) {
    case 'MALE':
      return `${surname[randomInteger(0, 4)]} ${middleNameMale[randomInteger(0, 4)]} ${nameMale[randomInteger(0, 4)]}`;
    case 'FEMALE':
      return `${surname[randomInteger(0, 4)]} ${middleNameFemale[randomInteger(0, 4)]} ${nameFemale[randomInteger(0, 4)]}`;
    default:
      throw new Error('Invalid gender');
  }
}

async function seed() {
  await initializeDatabase();

  const queryRunner = datasource.createQueryRunner();

  await queryRunner.startTransaction();

  await queryRunner.query('TRUNCATE TABLE barber');
  try {
    // MALE
    for (let i = 0; i < 15; i++) {
      const gender = Gender[genders[0]];
      const name = randomName(gender);
      const age = randomInteger(MIN_VALUE_18, MAX_VALUE_40);
      const description = faker.person.bio();

      await queryRunner.manager.getRepository(Barber).save({
        name,
        age,
        description,
        gender,
        img: faker.image.avatar(),
      });
    }

    // FEMALE
    for (let i = 0; i < 5; i++) {
      const gender = Gender[genders[1]];
      const name = randomName(gender);
      const age = randomInteger(MIN_VALUE_18, MAX_VALUE_40);
      const description = faker.person.bio();

      await queryRunner.manager.getRepository(Barber).save({
        name,
        age,
        description,
        gender,
        img: faker.image.avatar(),
      });
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }
}

seed();
