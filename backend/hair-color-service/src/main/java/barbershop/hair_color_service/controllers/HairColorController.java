package barbershop.hair_color_service.controllers;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;
import barbershop.hair_color_service.services.HairColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/hair-colors")
public class HairColorController {

    @Autowired
    private HairColorService hairColorService;

    @GetMapping("")
    public ResponseEntity<PaginationResponse> getAll(@Valid @ModelAttribute PaginationRequest paginationRequest) throws Exception {
        return new ResponseEntity<>(hairColorService.getAll(paginationRequest), HttpStatus.OK);
    }

    @GetMapping("/seed")
    public ResponseEntity<ResponseSuccess> seedDate(@RequestParam(value="username", required=false) String username,
                                                  @RequestParam(value="password", required=false) String password) throws Exception {
        return new ResponseEntity<>(hairColorService.seedData(username, password), HttpStatus.OK);
    }

}
