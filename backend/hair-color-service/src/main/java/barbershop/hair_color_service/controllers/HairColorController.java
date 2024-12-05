package barbershop.hair_color_service.controllers;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
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
    public ResponseEntity<PaginationResponse> getAll(@Valid @ModelAttribute PaginationRequest paginationRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getAll(paginationRequest, false), HttpStatus.OK);
    }

    @GetMapping("/color")
    public ResponseEntity<BaseResponse> getColors() throws Exception {
        return new ResponseEntity<>(hairColorService.getColors(false), HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<PaginationResponse> getAllForAdmin(@Valid @ModelAttribute PaginationRequest paginationRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getAll(paginationRequest, true), HttpStatus.OK);
    }

    @GetMapping("/admin/color")
    public ResponseEntity<BaseResponse> getColorsForAdmin() throws Exception {
        return new ResponseEntity<>(hairColorService.getColors(true), HttpStatus.OK);
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

    @GetMapping("/seed")
    public ResponseEntity<ResponseSuccess> seedDate(@RequestParam(value="username", required=false) String username,
                                                    @RequestParam(value="password", required=false) String password) throws Exception {
        return new ResponseEntity<>(hairColorService.seedData(username, password), HttpStatus.OK);
    }
}
