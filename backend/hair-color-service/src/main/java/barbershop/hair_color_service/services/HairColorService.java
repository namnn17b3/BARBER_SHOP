package barbershop.hair_color_service.services;

import barbershop.hair_color_service.dtos.request.GetColorsForAdminRequest;
import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.request.SaveColorImageRequest;
import barbershop.hair_color_service.dtos.request.SaveHairColorRequest;
import barbershop.hair_color_service.dtos.response.BaseResponse;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;

public interface HairColorService {
    ResponseSuccess seedData(String username, String password) throws Exception;
    PaginationResponse getListColorImage(PaginationRequest paginationRequest, boolean forAdmin) throws Exception;
    BaseResponse getColors(GetColorsForAdminRequest getColorsForAdminRequest) throws Exception;
    BaseResponse createHairColor(SaveHairColorRequest saveHairColorRequest) throws Exception;
    BaseResponse updateHairColor(SaveHairColorRequest saveHairColorRequest, String id) throws Exception;
    BaseResponse createColorImage(SaveColorImageRequest saveColorImageRequest) throws Exception;
    BaseResponse updateColorImage(SaveColorImageRequest saveColorImageRequest, String id) throws Exception;
    BaseResponse deleteColorImage(String id) throws Exception;
    BaseResponse getDetailColorImage(String id) throws Exception;
    BaseResponse getDetailHairColor(String id) throws Exception;
}
