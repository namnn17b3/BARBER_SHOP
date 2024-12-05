import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '@common/constant/pagination.constant';
import { Direction } from '@common/enum/direction.enum';
import { Operators } from '@common/enum/operators.enum';
import { WhereOperator } from '@common/enum/where-operator.enum';
import { toNonAccentVietnamese } from '@common/utils/utils';
import {
  Brackets,
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  private queryBuilder: SelectQueryBuilder<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(
      entity,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  getQueryBuilder() {
    return this.queryBuilder;
  }

  resetQueryBuilder(alias?: string) {
    this.queryBuilder = alias
      ? this.createQueryBuilder(alias)
      : this.createQueryBuilder();
  }

  pagy(pagyOptions) {
    if (!pagyOptions) return this;

    const pageNumber = pagyOptions.page || DEFAULT_PAGE;
    const itemsPerPage = pagyOptions.items || DEFAULT_PER_PAGE;
    this.queryBuilder.offset((pageNumber - 1) * itemsPerPage);
    this.queryBuilder.limit(itemsPerPage);

    return this;
  }

  pagyForRelations(pagyOptions) {
    if (!pagyOptions) return this;

    const pageNumber = pagyOptions.page || DEFAULT_PAGE;
    const itemsPerPage = pagyOptions.items || DEFAULT_PER_PAGE;
    this.queryBuilder.skip((pageNumber - 1) * itemsPerPage);
    this.queryBuilder.take(itemsPerPage);

    return this;
  }

  filterByField(
    field: string,
    value: any,
    operator: Operators,
    parameterName?: string,
    whereOperator = WhereOperator.And,
  ) {
    if (value !== undefined) {
      parameterName = parameterName || `${field}_value`;
      let expression = `${field} ${operator} :${parameterName}`;

      if (operator === Operators.Like) {
        // expression = `lower(${field}) ${operator} :${parameterName} utf8mb4_general_ci`;
        expression = `lower(${field}) ${operator} :${parameterName} COLLATE utf8mb4_unicode_ci`;
      }

      switch (whereOperator) {
        case WhereOperator.And:
          if (operator !== Operators.Like) {
            this.queryBuilder.andWhere(expression, {
              [parameterName]: value,
            });
            break;
          }
          this.queryBuilder.andWhere(
            new Brackets((qb) => {
              if (
                !value.toLowerCase().includes('đ') &&
                !value.toLowerCase().includes('d')
              ) {
                qb.where(expression, {
                  [parameterName]: `%${toNonAccentVietnamese(value.toLowerCase())}%`,
                });
              } else {
                const expression1 = `lower(${field}) ${operator} :${parameterName}_1 COLLATE utf8mb4_unicode_ci`;
                const expression2 = `lower(${field}) ${operator} :${parameterName}_2 COLLATE utf8mb4_unicode_ci`;
                qb.where(expression1, {
                  [parameterName + '_1']: `%${toNonAccentVietnamese(value)}%`,
                }).orWhere(expression2, {
                  [parameterName + '_2']:
                    `%${value.toLowerCase().replaceAll('d', 'đ')}%`,
                });
              }
            }),
          );
          break;
        case WhereOperator.Or:
          this.queryBuilder.orWhere(expression, {
            [parameterName]: value,
          });
          break;
        default:
          throw new Error('Invalid where operator');
      }
    }

    return this;
  }

  filterByInOperator(field: string, value: any, parameterName?: string) {
    if (value.length) {
      this.queryBuilder.andWhere(`${field} IN (:...${parameterName})`, {
        [parameterName]: value,
      });
    }
    return this;
  }

  sortByField(field: string, direction: Direction = Direction.ASC) {
    this.queryBuilder.addOrderBy(field, direction);

    return this;
  }
}
