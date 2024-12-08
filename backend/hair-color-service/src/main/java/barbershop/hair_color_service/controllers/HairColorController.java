package barbershop.hair_color_service.controllers;

import barbershop.hair_color_service.dtos.request.GetColorsForAdminRequest;
import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.request.SaveColorImageRequest;
import barbershop.hair_color_service.dtos.request.SaveHairColorRequest;
import barbershop.hair_color_service.dtos.response.BaseResponse;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;
import barbershop.hair_color_service.services.HairColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hair-colors")
@Validated
public class HairColorController {

    @Autowired
    private HairColorService hairColorService;

    @GetMapping("")
    public ResponseEntity<BaseResponse> getColors() throws Exception {
        return new ResponseEntity<>(hairColorService.getColors(null), HttpStatus.OK);
    }

    @GetMapping("/color-image")
    public ResponseEntity<PaginationResponse> getListColorImage(@Valid @ModelAttribute PaginationRequest paginationRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getListColorImage(paginationRequest, false), HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<BaseResponse> getColorsForAdmin(
            @Valid @ModelAttribute GetColorsForAdminRequest getColorsForAdminRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getColors(getColorsForAdminRequest), HttpStatus.OK);
    }

    @GetMapping("/admin/color-image")
    public ResponseEntity<PaginationResponse> getListColorImageAdmin(@Valid @ModelAttribute PaginationRequest paginationRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getListColorImage(paginationRequest, true), HttpStatus.OK);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<BaseResponse> getDetailHairColor(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(hairColorService.getDetailHairColor(id), HttpStatus.OK);
    }

    @PostMapping("/admin")
    public ResponseEntity<BaseResponse> createHairColor(@Valid @RequestBody SaveHairColorRequest saveHairColorRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.createHairColor(saveHairColorRequest), HttpStatus.OK);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<BaseResponse> updateHairColor(
            @Valid @RequestBody SaveHairColorRequest saveHairColorRequest,
            @PathVariable("id") String id) throws Exception {
        return new ResponseEntity<>(hairColorService.updateHairColor(saveHairColorRequest, id), HttpStatus.OK);
    }

    @PostMapping("/admin/color-image")
    public ResponseEntity<BaseResponse> createColorImage(
            @Valid @ModelAttribute SaveColorImageRequest saveColorImageRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.createColorImage(saveColorImageRequest), HttpStatus.OK);
    }

    @GetMapping("/admin/color-image/{id}")
    public ResponseEntity<BaseResponse> getDetailColorImage(@PathVariable("id") String id) throws Exception {
        return new ResponseEntity<>(hairColorService.getDetailColorImage(id), HttpStatus.OK);
    }

    @PutMapping("/admin/color-image/{id}")
    public ResponseEntity<BaseResponse> updateColorImage(
            @Valid @ModelAttribute SaveColorImageRequest saveColorImageRequest,
            @PathVariable("id") String id) throws Exception {
        return new ResponseEntity<>(hairColorService.updateColorImage(saveColorImageRequest, id), HttpStatus.OK);
    }

    @DeleteMapping("/admin/color-image/{id}")
    public ResponseEntity<BaseResponse> deleteColorImage(@PathVariable("id") String id) throws Exception {
        return new ResponseEntity<>(hairColorService.deleteColorImage(id), HttpStatus.OK);
    }

    @GetMapping("/seed")
    public ResponseEntity<ResponseSuccess> seedDate(@RequestParam(value="username", required=false) String username,
                                                    @RequestParam(value="password", required=false) String password) throws Exception {
        return new ResponseEntity<>(hairColorService.seedData(username, password), HttpStatus.OK);
    }
}
