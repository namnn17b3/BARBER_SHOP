package barbershop.hair_color_service.services;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.request.SaveHairColorRequest;
import barbershop.hair_color_service.dtos.response.BaseResponse;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;

public interface HairColorService {
    ResponseSuccess seedData(String username, String password) throws Exception;
    PaginationResponse getAll(PaginationRequest paginationRequest, boolean forAdmin) throws Exception;
    BaseResponse getColors(boolean forAdmin) throws Exception;
    BaseResponse createHairColor(SaveHairColorRequest saveHairColorRequest) throws Exception;
    BaseResponse updateHairColor(SaveHairColorRequest saveHairColorRequest, String id) throws Exception;
}
