package barbershop.block_time_service.controllers;

import barbershop.block_time_service.dtos.request.SaveBlockTimeRequest;
import barbershop.block_time_service.dtos.request.GetAllBlockTimesRequest;
import barbershop.block_time_service.dtos.response.BaseResponse;
import barbershop.block_time_service.dtos.response.PaginationResponse;
import barbershop.block_time_service.services.BlockTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/block-times")
public class BlockTimeController {
    @Autowired
    private BlockTimeService blockTimeService;

    @GetMapping("/admin")
    public ResponseEntity<PaginationResponse> getAllBlockTimes(GetAllBlockTimesRequest getAllBlockTimesRequest) throws Exception {
        return new ResponseEntity<>(blockTimeService.getAllBlockTimes(getAllBlockTimesRequest), HttpStatus.OK);
    }

    @PostMapping("/admin")
    public ResponseEntity<BaseResponse> createNewBlockTime(@RequestBody SaveBlockTimeRequest saveBlockTimeRequest) throws Exception {
        return new ResponseEntity<>(blockTimeService.createNewBlockTime(saveBlockTimeRequest), HttpStatus.OK);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<BaseResponse> getBlockTimeById(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(blockTimeService.getBlockTimeById(id), HttpStatus.OK);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<BaseResponse> updateBlockTime(
            @RequestBody SaveBlockTimeRequest saveBlockTimeRequest,
            @PathVariable(value="id") String id) throws Exception {
        return new ResponseEntity<>(blockTimeService.updateBlockTime(id, saveBlockTimeRequest), HttpStatus.OK);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<BaseResponse> deleteBlockTime(@PathVariable(value="id") String id) throws Exception {
        return new ResponseEntity<>(blockTimeService.deleteBlockTime(id), HttpStatus.OK);
    }
}
