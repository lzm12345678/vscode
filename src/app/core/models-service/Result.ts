/**
 * Created by GyjLoveLh on  2017/12/6
 */
export interface Result<T> {
    code: number | string;
    data: T;
    msg?: string;
}

export interface EntitiesResult<T> {
    pageNum: number;
    size: number;
    totalCount: number;
    totalPage: number;
    data: T[];
}
