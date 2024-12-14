import {
  AppResponseSuccessDto,
  PaginationResponseDto,
} from '@common/dto/response.dto';
import {
  objectMapper,
  randomInteger,
  toNonAccentVietnamese,
} from '@common/utils/utils';
import { faker } from '@faker-js/faker';
import {
  DeleteFileInfo,
  DeleteFilesRequest,
  FileRequest,
  UploadFilesRequest,
} from '@grpc/protos/s3/s3';
import { FeedbackGrpcClientService } from '@grpc/services/feedback/feedback.grpc-client.service';
import { OrderGrpcClientService } from '@grpc/services/order/order.grpc-client.service';
import { S3GrpcClientService } from '@grpc/services/s3/s3.grpc-client.service';
import {
  GetListHairStyleRequestDto,
  GetListImageUrlRequestDto,
  SaveHairStyleRequestDto,
} from '@hair-style/hair-style.dto';
import { HairStyle } from '@hair-style/hair-style.model';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Model } from 'mongoose';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class HairStyleService {
  constructor(
    @InjectModel('HairStyle') private readonly hairStyleModel: Model<HairStyle>,
    private readonly configService: ConfigService,
    private readonly orderGrpcClientService: OrderGrpcClientService,
    private readonly feedbackGrpcClientService: FeedbackGrpcClientService,
    private readonly s3GrpcClientService: S3GrpcClientService,
  ) {}

  async getAll(
    getListHairStyleRequestDto: GetListHairStyleRequestDto,
    user: any,
  ) {
    const { name, minPrice, maxPrice, sorting, page, items } =
      getListHairStyleRequestDto;

    let query: any = {};

    if (user?.role?.toLowerCase() !== 'admin') {
      query = { active: { $eq: true } };
    } else if (
      getListHairStyleRequestDto.active === true ||
      getListHairStyleRequestDto.active === false
    ) {
      query = { active: { $eq: getListHairStyleRequestDto.active } };
    }

    // Thêm điều kiện lọc theo name nếu có
    if (name) {
      // query.normalizedName = { $regex: toNonAccentVietnamese(name), $options: 'i' }; // Lọc theo tên không phân biệt hoa thường
      query.normalizedName = {
        $regex: new RegExp(toNonAccentVietnamese(name), 'i'),
      }; // Tìm kiếm tên không phân biệt hoa thường
    }

    // Lọc theo minPrice và maxPrice nếu có
    if (minPrice) {
      query.price = { ...query.price, $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    const hairStyles: any[] = (await this.hairStyleModel.find(query)).map(
      (item) =>
        objectMapper(
          ['id', 'imgs', 'price', 'name', 'active', 'discount'],
          item,
        ),
    );

    if (!hairStyles.length) {
      return {
        data: [],
        meta: {
          items,
          page,
          totalRecords: hairStyles.length,
        },
      } as PaginationResponseDto;
    }

    const [hairStylesFromOrderService, hairStylesFromFeedbackService] =
      await this.makeHairStylesFromOuterService(hairStyles);

    hairStyles.forEach((hairStyle) => {
      hairStyle['booking'] = hairStylesFromOrderService.hairStyles.find(
        (item) => item.id === +hairStyle.id,
      )?.booking;
      hairStyle['rating'] = hairStylesFromFeedbackService.hairStyles.find(
        (item) => item.id === +hairStyle.id,
      )?.rating;
    });

    await this.sortingHairStyles(hairStyles, sorting);

    const data = hairStyles
      .slice((page - 1) * items, (page - 1) * items + items)
      .map((item: any) => ({
        ...item,
        discount: objectMapper(['value', 'unit'], item.discount),
        img: item.imgs.map((img: any) => objectMapper(['url'], img))[0],
        imgs: undefined,
      }));

    return {
      data,
      meta: {
        items,
        page,
        totalRecords: hairStyles.length,
      },
    } as PaginationResponseDto;
  }

  private async sortingHairStyles(hairStyles: any[], sorting: string) {
    if (!sorting) return;

    const sortingObject = this.makeSortingObject(sorting);

    hairStyles.sort(
      this.makeSortingHairStylesByConditionCallback(sortingObject),
    );
  }

  private makeSortingHairStylesByConditionCallback(sortingObject: any) {
    const fields =
      sortingObject['priority'] === 'rating'
        ? ['rating', 'booking']
        : sortingObject['priority'] === 'booking'
          ? ['booking', 'rating']
          : ['rating', 'booking'];
    const callback = (o1: any, o2: any) => {
      return this.conditionReturn(o1, o2, sortingObject, fields, 0);
    };

    return callback;
  }

  private conditionReturn(
    o1: any,
    o2: any,
    sortingObject: any,
    fields: string[],
    idx: number,
  ) {
    const field = fields[idx];
    const condition = sortingObject[field];

    if (condition === 'asc') {
      if (o1[field] < o2[field]) return -1;
      if (o1[field] > o2[field]) return 1;
      if (o1[field] === o2[field]) {
        if (idx === fields.length - 1) return 0;
        return this.conditionReturn(o1, o2, sortingObject, fields, idx + 1);
      }
    } else if (condition === 'desc') {
      if (o2[field] < o1[field]) return -1;
      if (o2[field] > o1[field]) return 1;
      if (o2[field] === o1[field]) {
        if (idx === fields.length - 1) return 0;
        return this.conditionReturn(o1, o2, sortingObject, fields, idx + 1);
      }
    } else {
      if (idx === fields.length - 1) return 0;
      return this.conditionReturn(o1, o2, sortingObject, fields, idx + 1);
    }
  }

  private makeSortingObject(sorting: string) {
    if (!sorting) return null;

    const p1 = sorting.split(',');
    const obj = {};
    for (const p2 of p1) {
      const p3 = p2.split(':');
      obj[p3[0]] = p3[1];
    }
    return obj;
  }

  private async makeHairStylesFromOuterService(hairStyles: any[]) {
    return await Promise.all([
      this.orderGrpcClientService.getListHairStyles({
        ids: hairStyles.map((item) => +item.id),
      }),
      this.feedbackGrpcClientService.getListHairStyles({
        ids: hairStyles.map((item) => +item.id),
      }),
    ]);
  }

  async getDetail(id: number, user: any) {
    let hairStyle = null;

    if (user?.role?.toLowerCase() !== 'admin') {
      hairStyle = await this.hairStyleModel.findOne({ id, active: true });
    } else {
      hairStyle = await this.hairStyleModel.findOne({ id });
    }

    if (!hairStyle) {
      throw new NotFoundException('HairStyle not found');
    }

    const [hairStylesFromOrderService, hairStylesFromFeedbackService] =
      await this.makeHairStylesFromOuterService([hairStyle]);

    hairStyle['booking'] = hairStylesFromOrderService.hairStyles.find(
      (item) => item.id === +hairStyle.id,
    )?.booking;
    hairStyle['rating'] = hairStylesFromFeedbackService.hairStyles.find(
      (item) => item.id === +hairStyle.id,
    )?.rating;

    const hairStyleFromObjectMapper: any = objectMapper(
      [
        'id',
        'name',
        'description',
        'price',
        'active',
        'booking',
        'discount',
        'rating',
      ],
      hairStyle,
    );

    return {
      data: {
        ...hairStyleFromObjectMapper,
        imgs: hairStyle.imgs.map((img: any) =>
          objectMapper(['id', 'url'], img),
        ),
        discount: objectMapper(['value', 'unit'], hairStyle.discount),
      },
    } as AppResponseSuccessDto;
  }

  async getListImageUrl(getListImageUrlRequestDto: GetListImageUrlRequestDto) {
    const { name, page, items } = getListImageUrlRequestDto;
    const query: any = { active: { $eq: true } };
    // Thêm điều kiện lọc theo name nếu có
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Lọc theo tên không phân biệt hoa thường
      // or query.name = { $regex: new RegExp(name, 'i') }; // Tìm kiếm tên không phân biệt hoa thường
    }

    const hairStyles: any[] = (await this.hairStyleModel.find(query)).map(
      (item) => ({
        ...objectMapper(['id', 'name', 'imgs'], item),
        imgs: item.imgs
          .map((img: any) => ({
            ...objectMapper(['id', 'url'], img),
          }))
          .sort((o1: any, o2: any) => o1.id - o2.id),
      }),
    );

    const data = hairStyles.slice(
      (page - 1) * items,
      (page - 1) * items + items,
    );

    return {
      data,
      meta: {
        page,
        items,
        totalRecords: hairStyles.length,
      },
    } as PaginationResponseDto;
  }

  async seed(query: any) {
    const { username, password } = query;
    const usernameCorrect = this.configService.get('MONGO_DB_USERNAME');
    const passwordCorrect = this.configService.get('MONGO_DB_PASSWORD');

    if (username !== usernameCorrect || password !== passwordCorrect) {
      throw new UnauthorizedException('Wrong username or password');
    }

    const names = [
      'High and Tight',
      'French Crop',
      'Classic Fade',
      'Crew Cut',
      'Two-Block Short Haircut for Men',
      'High Fade Haircut',
      'Pompadour Hairstyle for Men',
      'Easy Comb Over',
      'Curly, Medium-Length Hair for Men',
      'Disconnected Undercut',
      'Textured Curly Hair',
      'Side-Parted Wavy Hairstyle for Men',
      'Quiff Hairstyle for Men',
      'Straight and Brushed Back',
      'Long Top',
      'Buzz Cut',
      'Korean Wavy Short Haircut for Men',
      'Curtain Short Haircut for Men',
      'Samurai Bun',
      'Messy Side Part Hairstyle for Men',
    ];

    const units = ['VNĐ', '%', null];
    const valueVND = [10000, 20000, 30000, 40000, 50000];
    const valuePercent = [10, 20, 30, 40, 50];
    const prices = [100000, 150000, 200000, 250000, 300000];

    await this.hairStyleModel.db.dropCollection('hair_style');

    for (let i = 1; i <= 20; i++) {
      const imgs = [];
      const price = prices[randomInteger(0, 4)];
      for (let j = 1; j <= 5; j++) {
        imgs.push({
          id: j,
          url: `https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_style/${i}/${i}_${j}.jpg`,
        });
      }
      const unit = units[randomInteger(0, 2)];
      console.log(i, unit);
      if (unit === units[0]) {
        const value = valueVND[randomInteger(0, 4)];
        await this.hairStyleModel.create({
          name: names[i - 1],
          normalizedName: toNonAccentVietnamese(names[i - 1]),
          description: faker.lorem.paragraph(),
          price,
          active: true,
          imgs,
          discount: {
            value,
            unit,
          },
        });
      } else if (unit === units[1]) {
        const value = valuePercent[randomInteger(0, 4)];
        await this.hairStyleModel.create({
          name: names[i - 1],
          normalizedName: toNonAccentVietnamese(names[i - 1]),
          description: faker.lorem.paragraph(),
          price,
          active: true,
          imgs,
          discount: {
            value,
            unit,
          },
        });
      } else {
        await this.hairStyleModel.create({
          name: names[i - 1],
          normalizedName: toNonAccentVietnamese(names[i - 1]),
          description: faker.lorem.paragraph(),
          price,
          active: true,
          imgs,
        });
      }
    }

    // const documents = await this.hairStyleModel.find({
    //   id: { $gte: 1, $lte: 25 },
    // });
    // for (const doc of documents) {
    //   // Loại bỏ dấu tiếng Việt từ trường 'name'
    //   const normalizedName = toNonAccentVietnamese(doc.name);

    //   // Cập nhật tài liệu với trường 'normalizedName'
    //   await this.hairStyleModel.updateOne(
    //     { _id: doc._id }, // Điều kiện
    //     { $set: { normalizedName } }, // Thêm trường mới
    //   );
    // }
  }

  private async saveHairStyle(
    saveHairStyleRequestDto: SaveHairStyleRequestDto,
    files: Array<Express.Multer.File>,
    action: string,
  ) {
    const oldImgs = saveHairStyleRequestDto.imgs;

    // Các ảnh bị click remove từ giao diện
    let deleteFileInfos = Object.keys(saveHairStyleRequestDto.fileRequire)
      ?.filter((item) => !saveHairStyleRequestDto.fileRequire[item])
      ?.map(
        (item) =>
          ({
            index: +item.split('img')[1],
            url:
              oldImgs?.find((img) => img.id === +item.split('img')[1])?.url ||
              '',
          }) as DeleteFileInfo,
      );
    if (files?.length) {
      const folderName = this.configService.get('AWS_S3_PUBLIC_FOLDER');
      const newImgs = (
        await this.s3GrpcClientService.uploadFiles({
          fileRequest: files.map(
            (file: Express.Multer.File) =>
              ({
                index: +file.fieldname.split('img')[1],
                folderName,
                originalFileName: file.originalname,
                data: file.buffer,
              }) as FileRequest,
          ),
        } as UploadFilesRequest)
      ).results.map((item) => ({
        id: item.index,
        url: item.url,
      }));

      // console.log('>>>> TEST 1', saveHairStyleRequestDto?.imgs);

      // console.log(
      //   '>>>> TEST 2',
      //   saveHairStyleRequestDto?.imgs?.filter(
      //     (item) =>
      //       saveHairStyleRequestDto?.fileRequire?.[`img${item.id}`] &&
      //       !newImgs.find((img) => img.id === item.id),
      //   ),
      // );

      saveHairStyleRequestDto.imgs = [
        ...newImgs,
        // các ảnh có url giữ nguyên không cập nhật url mới (không bị ghi đè)
        ...saveHairStyleRequestDto?.imgs?.filter(
          (item) =>
            saveHairStyleRequestDto?.fileRequire?.[`img${item.id}`] &&
            !newImgs.find((img) => img.id === item.id),
        ),
      ];

      saveHairStyleRequestDto?.imgs?.sort((a, b) => a.id - b.id);

      // console.log('>>>> imgs', newImgs);
      // console.log(
      //   '>>>> saveHairStyleRequestDto.imgs',
      //   saveHairStyleRequestDto.imgs,
      // );

      // Các ảnh bị ảnh mới upload ghi đè
      deleteFileInfos = [
        ...deleteFileInfos,
        ...newImgs.map((item) => ({
          index: item.id,
          url: oldImgs.find((oi) => oi.id === item.id)?.url || '',
        })),
      ];
    } else {
      saveHairStyleRequestDto.imgs = [
        // các ảnh có url giữ nguyên không cập nhật url mới (không bị ghi đè)
        ...saveHairStyleRequestDto?.imgs?.filter(
          (item) => saveHairStyleRequestDto?.fileRequire?.[`img${item.id}`],
        ),
      ];
    }

    // Xóa các ảnh bị click remove từ giao diện và xóa các ảnh bị ảnh mới upload ghi đè
    await this.s3GrpcClientService.deleteFiles({
      deleteFileInfos,
    } as DeleteFilesRequest);

    let hairStyle: any = null;
    if (action === 'create') {
      hairStyle = await this.hairStyleModel.create({
        ...saveHairStyleRequestDto,
        normalizedName: toNonAccentVietnamese(saveHairStyleRequestDto.name),
      });
    } else if (action === 'update') {
      // const hairStyleParam = saveHairStyleRequestDto.isDiscount
      //   ? { ...saveHairStyleRequestDto, imgs }
      //   : {
      //       $set: { ...saveHairStyleRequestDto, imgs },
      //       $unset: { discount: '' },
      //     };

      if (saveHairStyleRequestDto.isDiscount) {
        hairStyle = await this.hairStyleModel.findOneAndUpdate(
          { id: saveHairStyleRequestDto.id },
          {
            ...saveHairStyleRequestDto,
            normalizedName: toNonAccentVietnamese(saveHairStyleRequestDto.name),
          },
          // { new: true } kết quả sẽ là tài liệu sau khi được cập nhật
          // { new: false } kết quả sẽ là tài liệu trước khi cập nhật
          { new: true },
        );
      } else {
        hairStyle = await this.hairStyleModel.findOneAndUpdate(
          { id: saveHairStyleRequestDto.id },
          {
            $set: {
              ...saveHairStyleRequestDto,
              normalizedName: toNonAccentVietnamese(
                saveHairStyleRequestDto.name,
              ),
            },
          },
          { new: true },
        );
        hairStyle = await this.hairStyleModel.findOneAndUpdate(
          { id: saveHairStyleRequestDto.id },
          { $unset: { discount: '' } },
          { new: true },
        );
      }
    }

    return {
      data: {
        ...objectMapper(
          ['id', 'name', 'description', 'price', 'active', 'discount'],
          hairStyle,
        ),
        imgs: hairStyle.imgs.map((item) => objectMapper(['id', 'url'], item)),
      },
    } as AppResponseSuccessDto;
  }

  async createNewHairStyle(
    saveHairStyleRequestDto: SaveHairStyleRequestDto,
    files: Array<Express.Multer.File>,
  ) {
    return this.saveHairStyle(saveHairStyleRequestDto, files, 'create');
  }

  async updateHairStyle(
    saveHairStyleRequestDto: SaveHairStyleRequestDto,
    files: Array<Express.Multer.File>,
  ) {
    const hairStyle = await this.hairStyleModel.findOne({
      id: saveHairStyleRequestDto.id,
    });
    if (!hairStyle) {
      throw new NotFoundException('Hairstyle not found');
    }

    // console.log('>>>> files', files);
    // console.log('>>>> fileRequire', saveHairStyleRequestDto.fileRequire);

    // if (files?.length) {
    // console.log('>>> deleteFileInfos', {
    //   deleteFileInfos: Object.keys(saveHairStyleRequestDto.fileRequire)
    //     ?.filter((item) => !saveHairStyleRequestDto.fileRequire[item])
    //     ?.map(
    //       (item) =>
    //         ({
    //           index: +item.split('img')[1],
    //           url:
    //             hairStyle?.imgs?.find(
    //               (img) => img.id === +item.split('img')[1],
    //             )?.url || '',
    //         }) as DeleteFileInfo,
    //     ),
    // });
    // await this.s3GrpcClientService.deleteFiles({
    //   deleteFileInfos: Object.keys(saveHairStyleRequestDto.fileRequire)
    //     ?.filter((item) => !saveHairStyleRequestDto.fileRequire[item])
    //     ?.map(
    //       (item) =>
    //         ({
    //           index: +item.split('img')[1],
    //           url:
    //             hairStyle?.imgs?.find(
    //               (img) => img.id === +item.split('img')[1],
    //             )?.url || '',
    //         }) as DeleteFileInfo,
    //     ),
    // } as DeleteFilesRequest);
    // }
    return this.saveHairStyle(
      {
        ...saveHairStyleRequestDto,
        imgs: hairStyle?.imgs?.map(
          (item) => objectMapper(['id', 'url'], item) as any,
        ),
      },
      files,
      'update',
    );

    // return { data: {} };
  }
}
