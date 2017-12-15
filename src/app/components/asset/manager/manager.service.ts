import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Result, Brand, Series, Version} from "../../../models";
import { ProxyService } from "../../../proxy.service";

@Injectable()
export class ManagerService {
    constructor(
        private $http: HttpClient,
        private $proxy: ProxyService
    ) {
    }

    /**
     * 查询所有品牌
     */
    public getAllBrand(callback) {
        this.$proxy.post(`/itm/bsm/0`, {}, result => {
            callback(result);
        });
        // this.$http.post(`/itm/bsm/0`, {}).subscribe((result: Result) => {
        //     console.log('bbbbaa', result);
        //     if (result.code === 0) {
        //         callback(result.data);
        //     }
        // });
    }

    /**
     * 分页获取品牌
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param callback
     */
    public getBrandPagination( body , callback) {
        // this.$proxy.get(`/itm/newModel/${pageIndex}/${pageSize}`, result => {
        //     callback(result);
        //请求处理方法
        this.$proxy.post(`/itm/newModel/queryAll`, body ).then(result =>{
            callback(result);
        }, failed => {
            alert("网络请求错误！")
        })
    }

    /**
     * 新增品牌
     * @param {Brand} brand
     * @param callback
     */
    public insertBrand(brand: Brand, callback) {
        this.$proxy.post(`/itm/brand`, brand, callback);
    }

    /**
     * 根据id查询品牌信息
     * @param {number} brandId
     * @param callback
     */
    public getBrandById(brandId: string, callback) {
        this.$proxy.get(`/itm/bsm/${brandId}`, callback);
    }

    /**
     * 模糊查询品牌信息
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param {string} search
     * @param callback
     */
    public getBrandByField(pageIndex: number, pageSize: number, search: { name: string, code: string }, callback) {
        let body = {pageNum: pageIndex, size: pageSize, name: search.name, code: search.code};
        this.$proxy.post(`/itm/brand/like`, body, callback);
    }

    /**
     * 修改品牌信息
     * @param {Brand} brand
     * @param callback
     */
    public modifyBrand(brand: Brand, callback) {
        this.$proxy.put(`/itm/bsm`, brand, callback);
    }

    /**
     * 删除品牌信息
     * @param {number} brandId
     * @param callback
     */
    public deleteBrand(brandId: string, callback) {
        this.$proxy.delete(`/itm/bsm/${brandId}`, callback);
    }


    /** =============================================================================================== */
    /**
     * 分页查询所有系列
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param callback
     */
    public getSeriesPagination(pageIndex: number, pageSize: number, callback) {
        this.$proxy.get(`/itm/series/${pageIndex}/${pageSize}/-1`, callback);
    }

    /**
     * 模糊分页查询所有系列
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param {{name: string; parentId: number}} search
     * @param callback
     */
    public getSeriesByField(pageIndex: number, pageSize: number, search: {name: string, parentId: number}, callback) {
        let body = {pageNum: pageIndex, size: pageSize, name: search.name, parentId: search.parentId};
        this.$proxy.post(`/itm/series/like`, body, callback);
    }

    /**
     * 根据parentId查询系列
     * @param {number} parentId
     * @param {number} size
     * @param {number} pageNum
     */
    public getSeriesByParentId(pageNum: number, size: number, parentId: string, callback) {
        this.$proxy.get(`/itm/series/${pageNum}/${size}/${parentId}`, callback);
    }

    /**
     * 根据id查询系列信息
     * @param {number} seriesId
     */
    public getSeriesById(seriesId: string, callback) {
        this.$proxy.get(`/itm/bsm/${seriesId}`, callback);
    }

    /**
     * 修改系列信息
     * @param {Series} series
     * @param callback
     */
    public modifySeries(series: Series, callback) {
        this.$proxy.put(`/itm/bsm`, series, callback);
    }

    /**
     * 新增系列
     * @param {Series} series
     * @param callback
     */
    public insertSeries(series: Series, callback) {
        this.$proxy.post(`/itm/series`, series, callback);
    }

    /**
     * 删除系列
     * @param {Series} series
     * @param callback
     */
    // public deleteSeries(series: Series, callback) {
    //     this.$proxy.delete(`/itm/bsm/${series.id}`, callback);
    // }

    /** ========================================================================================= */

    /**
     * 新增型号
     * @param {Version} version
     * @param callback
     */
    public insertVersion(version: Version, callback) {
        this.$proxy.post(`/itm/model`, version, callback);
        // this.$http.post(`/itm/model`, version).subscribe((result: Result) => {
        //     callback(result);
        // });
    }

    /**
     * 分页查询所有型号
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param callback
     */
    public getVersionPagination(pageIndex: number, pageSize: number, callback) {
        this.$proxy.get(`/itm/model/${pageIndex}/${pageSize}`, callback);
    }

    /**
     * 模糊分页查询型号
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param {string} name
     * @param {number} parentId
     * @param callback
     */
    public getVersionByField(pageIndex: number, pageSize: number, name: string,assetType, callback) {
        let body = {pageNum: pageIndex, size: pageSize, modelName: name,assetType:assetType};
        this.$proxy.post(`/itm/model/term`, body, callback);
    }

    /**
     * 修改型号
     * @param {Series} series
     * @param callback
     */
    public modifyVersion(series: Series, callback) {
        console.log(series);
        // this.$http.put(`/itm/bsm`, series).subscribe((result: Result) => {
        //     console.log(result);
        //     if (result.code === 0) {
        //         callback(result.data);
        //     }
        // });
    }

    /**
     * 删除version
     * @param {number} versionId
     * @param callback
     */
    public deleteVersion(versionId: string, callback = null) {
        // this.$proxy.delete(`/itm/model/${versionId}`, callback);
        if (typeof callback === 'function') {
            this.$proxy.delete(`/itm/model/${versionId}`, callback);
        } else {
            return new Promise((resolve, reject) => {
                this.$http.delete(`/itom/model/${versionId}`).subscribe((result: Result) => {
                    if (result.code === 0) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                });
            });
        }
    }


    /**
     *  系列===========================================================
     */
    //获取全部tab列表--------------------
    public getSerieslist(body, callback) {
        this.$proxy.post(`/itom/newModel/queryAll`,body).then(success => {
            callback(success)
        }, failed => {
            alert("网络错误，请重试")
        })
    }

    /**
     * 删除series
     * @param {number} versionId
     * @param callback
     */
    public deleteSeries(seriesId: string, callback = null) {
        // this.$proxy.delete(`/itm/model/${versionId}`, callback);
        if (typeof callback === 'function') {
            this.$proxy.delete(`/itom/newModel/${seriesId}`, callback);
        } else {
            return new Promise((resolve, reject) => {
                this.$http.delete(`/itom/newModel/${seriesId}`).subscribe((result: Result) => {
                    if (result.code === 0) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                });
            });
        }
    }



}

