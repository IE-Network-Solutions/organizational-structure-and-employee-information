import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PaginationService {
  private readonly defaultLimit = Number.MAX_SAFE_INTEGER; // Or use a specific high number
  private readonly defaultPage = 1;

  // Overload signatures
  async paginate<Entity>(
    repository: Repository<Entity>,
    alias: string,
    options: IPaginationOptions,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC',
    filter?: Partial<Entity>,
  ): Promise<Pagination<Entity>>;

  async paginate<Entity>(
    qb: SelectQueryBuilder<Entity>,
    options: IPaginationOptions,
    filter?: Partial<Entity>,
  ): Promise<Pagination<Entity>>;

  // Single implementation
  async paginate<Entity>(
    repositoryOrQueryBuilder: Repository<Entity> | SelectQueryBuilder<Entity>,
    aliasOrOptions: string | IPaginationOptions,
    options?: IPaginationOptions,
    orderBy = 'createdAt',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    filter?: Partial<Entity>,
  ): Promise<Pagination<Entity>> {
    let qb: SelectQueryBuilder<Entity>;
    let opts: IPaginationOptions;

    if (repositoryOrQueryBuilder instanceof Repository) {
      const alias = aliasOrOptions as string;
      opts = this.applyDefaultPaginationOptions(options as IPaginationOptions);
      qb = repositoryOrQueryBuilder.createQueryBuilder(alias);
      qb.orderBy(`${alias}.${orderBy}`, orderDirection);
    } else {
      qb = repositoryOrQueryBuilder as SelectQueryBuilder<Entity>;
      opts = this.applyDefaultPaginationOptions(
        aliasOrOptions as IPaginationOptions,
      );
    }

    // Ensure page and limit are numbers to prevent type errors
    const page = Number(opts.page);
    const limit = Number(opts.limit);

    // Prevent relations from being paginated
    qb.skip((page - 1) * limit).take(limit);

    // Apply filter if provided
    if (filter) {
      Object.keys(filter).forEach((key) => {
        qb.andWhere(`${qb.alias}.${key} = :${key}`, { [key]: filter[key] });
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  private applyDefaultPaginationOptions(
    options: IPaginationOptions,
  ): IPaginationOptions {
    return {
      limit: options?.limit ?? this.defaultLimit,
      page: options?.page ?? this.defaultPage,
    };
  }
}
