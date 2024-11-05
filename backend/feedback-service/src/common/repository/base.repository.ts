import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '@common/constant/pagination.constant';
import { Direction } from '@common/enum/direction.enum';
import { Operators } from '@common/enum/operators.enum';
import { WhereOperator } from '@common/enum/where-operator.enum';
import {
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
      switch (whereOperator) {
        case WhereOperator.And:
          this.queryBuilder.andWhere(`${field} ${operator} :${parameterName}`, {
            [parameterName]: value,
          });
          break;
        case WhereOperator.Or:
          this.queryBuilder.orWhere(`${field} ${operator} :${parameterName}`, {
            [parameterName]: value,
          });
          break;
        default:
          throw new Error('Invalid where operator');
      }
    }

    return this;
  }

  filterByInOperator(field: string, value: any, parameterName: string = 'ids') {
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
