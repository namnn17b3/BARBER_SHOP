package barbershop.hair_color_service.services.impl;

import barbershop.hair_color_service.Utils.Utils;
import barbershop.hair_color_service.dtos.request.GetColorsForAdminRequest;
import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.request.SaveColorImageRequest;
import barbershop.hair_color_service.dtos.request.SaveHairColorRequest;
import barbershop.hair_color_service.dtos.response.BaseResponse;
import barbershop.hair_color_service.dtos.response.FieldErrorsResponse;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;
import barbershop.hair_color_service.entities.ColorImage;
import barbershop.hair_color_service.entities.HairColor;
import barbershop.hair_color_service.enums.Color;
import barbershop.hair_color_service.exception.HttpException;
import barbershop.hair_color_service.exception.ResourceNotFoundException;
import barbershop.hair_color_service.repositories.ColorImageRepository;
import barbershop.hair_color_service.repositories.HairColorRepository;
import barbershop.hair_color_service.services.HairColorService;
import barbershop.hair_color_service.services.S3StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class HairColorServiceImpl implements HairColorService {
    @Autowired
    private HairColorRepository hairColorRepository;

    @Autowired
    private ColorImageRepository colorImageRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${spring.datasource.username}")
    private String mysqlUsername;

    @Value("${spring.datasource.password}")
    private String mysqlPassword;

    @Value("${application.base-url}")
    private String awsBaseUrl;

    @Autowired
    private S3StorageService s3StorageService;

    @Override
    public ResponseSuccess seedData(String username, String password) throws Exception {
        if (username == null || !username.equals(mysqlUsername) ||
            password == null || !password.equals(mysqlPassword)) {
            throw HttpException.builder()
                    .message("UnAuthorize")
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .build();
        }

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
        hairColorRepository.truncate();
        colorImageRepository.truncate();

        for (Color color : Color.values()) {
            HairColor hairColor = new HairColor();
            hairColor.setColor(color.name());
            hairColor.setPrice(20000);
            hairColor.setActive(true);

            hairColor = hairColorRepository.save(hairColor);
            List<ColorImage> colorImages = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                ColorImage colorImage = new ColorImage();
                String folderName = color.name().toLowerCase();
                colorImage.setUrl(awsBaseUrl+"hair_color/"+folderName+"/"+folderName+"_"+i+".jpg");
                colorImage.setHairColor(hairColor);
                colorImages.add(colorImage);
            }
            colorImageRepository.saveAll(colorImages);
        }

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");

        return new ResponseSuccess(HttpStatus.OK, "Seed data success");
    }

    @Override
    public BaseResponse getColors(GetColorsForAdminRequest getColorsForAdminRequest) throws Exception {
        List<HairColor> hairColors = hairColorRepository.findAll();
        List<Map<String, Object>> ls = new ArrayList<>();
        for (HairColor hairColor : hairColors) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", hairColor.getId());
            map.put("color", hairColor.getColor());
            map.put("colorCode", hairColor.getColorCode());
            if (getColorsForAdminRequest == null && hairColor.isActive()) {
                ls.add(map);
            }
            if (getColorsForAdminRequest != null) {
                ls.add(map);
            }
        }

        if (getColorsForAdminRequest == null) {
            return new BaseResponse(ls);
        }

        ls = ls.stream().filter(item -> {
            if (getColorsForAdminRequest.getKeyword() == null || getColorsForAdminRequest.getKeyword().isEmpty()) {
                return true;
            }
            String color = Utils.stripAccents(item.get("color").toString()).toLowerCase();
            String colorCode = Utils.stripAccents(item.get("colorCode").toString()).toLowerCase();
            String keyword = Utils.stripAccents(getColorsForAdminRequest.getKeyword()).toLowerCase();
            return color.contains(keyword) || colorCode.contains(keyword);
        }).toList();

        List<Map<String, Object>> lsReturned = new ArrayList<>();
        int page = Integer.parseInt(getColorsForAdminRequest.getPage());
        int items = Integer.parseInt(getColorsForAdminRequest.getItems());
        int startIdx = (page - 1) * items;
        int endIdx = Math.min(startIdx + items, ls.size());
        for (int i = startIdx; i < endIdx; i++) {
            Map<String, Object> map = ls.get(i);
            map.put("active", hairColors.get(i).isActive());
            map.put("price", hairColors.get(i).getPrice());
            lsReturned.add(map);
        }

        PaginationResponse paginationResponse = PaginationResponse.builder()
                .meta(PaginationResponse.Meta.builder()
                        .page(page)
                        .items(items)
                        .totalRecords(ls.size())
                        .build())
                .build();
        paginationResponse.setData(lsReturned);
        return paginationResponse;
    }

    @Override
    public PaginationResponse getListColorImage(PaginationRequest paginationRequest, boolean forAdmin) throws Exception {
        List<ColorImage> hairColors = colorImageRepository.findByColor(paginationRequest, forAdmin);
        int totalRecords = colorImageRepository.countByColor(paginationRequest, forAdmin);

        PaginationResponse.Meta meta = PaginationResponse.Meta.builder()
                .totalRecords(totalRecords)
                .items(Integer.parseInt(paginationRequest.getItems()))
                .page(Integer.parseInt(paginationRequest.getPage()))
                .build();
        PaginationResponse paginationResponse = new PaginationResponse(meta);
        paginationResponse.setData(hairColors);

        return paginationResponse;
    }

    private BaseResponse saveHairColor(SaveHairColorRequest saveHairColorRequest, int id) throws Exception {
        HairColor hairColor = HairColor.builder()
                .color(saveHairColorRequest.getColor())
                .price(saveHairColorRequest.getPrice())
                .active(saveHairColorRequest.isActive())
                .colorCode(saveHairColorRequest.getColorCode())
                .build();

        if (id != 0) {
            hairColor.setId(id);
        }

        hairColor = hairColorRepository.save(hairColor);

        return new BaseResponse(
            Map.of(
                "id", hairColor.getId(),
                "color", hairColor.getColor(),
                "colorCode", hairColor.getColorCode(),
                "price", hairColor.getPrice(),
                "active", hairColor.isActive()
            )
        );
    }

    @Override
    public BaseResponse getDetailHairColor(String hairColorId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(hairColorId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Hair color id is invalid integer format")
                            .resource("SaveHairColorRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        HairColor hairColor = hairColorRepository.findById(id).orElse(null);
        if (hairColor == null) {
            throw new ResourceNotFoundException("HairColor with id " + id + " not found");
        }

        return new BaseResponse(Map.of(
            "id", hairColor.getId(),
            "color", hairColor.getColor(),
            "colorCode", hairColor.getColorCode(),
            "price", hairColor.getPrice(),
            "active", hairColor.isActive()
        ));
    }

    @Transactional
    @Override
    public BaseResponse createHairColor(SaveHairColorRequest saveHairColorRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        HairColor hairColor = hairColorRepository.findByColorAndColorCode(saveHairColorRequest.getColor(), saveHairColorRequest.getColorCode())
                .orElse(null);
        if (hairColor != null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("color, color code")
                            .message("Color and color code already exists")
                            .resource("SaveHairColorRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        return saveHairColor(saveHairColorRequest, 0);
    }

    @Transactional
    @Override
    public BaseResponse updateHairColor(SaveHairColorRequest saveHairColorRequest, String hairColorId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(hairColorId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Hair color id is invalid integer format")
                            .resource("SaveHairColorRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        HairColor hairColor = hairColorRepository.findById(id).orElse(null);
        if (hairColor == null) {
            throw new ResourceNotFoundException("HairColor with id " + id + " not found");
        }

        hairColor = hairColorRepository.findByColorAndColorCode(saveHairColorRequest.getColor(), saveHairColorRequest.getColorCode())
                .orElse(null);

        if (hairColor != null && hairColor.getId() != id) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Color and Color code is existed")
                            .resource("SaveHairColorRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        return saveHairColor(saveHairColorRequest, id);
    }

    @Transactional
    @Override
    public BaseResponse createColorImage(SaveColorImageRequest saveColorImageRequest) throws Exception {
        return saveColorImage(saveColorImageRequest, 0);
    }

    @Transactional
    @Override
    public BaseResponse updateColorImage(SaveColorImageRequest saveColorImageRequest, String colorImageId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(colorImageId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("id")
                            .message("Color image id is invalid integer format")
                            .resource("SaveColorImageRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        ColorImage colorImage = colorImageRepository.findById(id).orElse(null);
        if (colorImage == null) {
            throw new ResourceNotFoundException("Color image with id " + id + " not found");
        }

        return saveColorImage(saveColorImageRequest, id);
    }

    private BaseResponse saveColorImage(SaveColorImageRequest saveColorImageRequest, int id) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        HairColor hairColor = hairColorRepository.findById(saveColorImageRequest.getHairColorId()).orElse(null);

        if (hairColor == null) {
            throw new ResourceNotFoundException("Hair color with id " + saveColorImageRequest.getHairColorId() + " not found");
        }

        ColorImage colorImage = ColorImage.builder()
                .hairColor(hairColor)
                .build();

        if (id != 0) {
            colorImage.setId(id);
        }

        MultipartFile multipartFile = saveColorImageRequest.getImage();
        if (multipartFile == null || multipartFile.isEmpty()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("File up load")
                            .message("File field is not empty")
                            .resource("Request body")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Utils.checkImageFileType(multipartFile, "File up load", "Request body");

        String url = s3StorageService.uploadFileGrpc(multipartFile);
        colorImage.setUrl(url);
        colorImage = colorImageRepository.save(colorImage);
        return new BaseResponse(Map.of(
            "id", colorImage.getId(),
            "url", colorImage.getUrl(),
            "hairColorId", hairColor.getId()
        ));
    }

    @Transactional
    @Override
    public BaseResponse deleteColorImage(String colorImageId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(colorImageId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Color image id")
                            .message("Color image id is invalid integer format")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        ColorImage colorImage = colorImageRepository.findById(id).orElse(null);
        if (colorImage == null) {
            throw new ResourceNotFoundException("Color image with id " + id + " not found");
        }

        colorImageRepository.deleteById(id);
        s3StorageService.deleteFileGrpc(colorImage.getUrl());

        return new BaseResponse(Map.of("message",  "Delete color image of hair color " + colorImage.getHairColor().getColor()));
    }

    @Override
    public BaseResponse getDetailColorImage(String colorImageId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        int id = 0;
        try {
            id = Integer.parseInt(colorImageId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Color image id")
                            .message("Color image id is invalid integer format")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        ColorImage colorImage = colorImageRepository.findById(id).orElse(null);
        if (colorImage == null) {
            throw new ResourceNotFoundException("Color image with id " + id + " not found");
        }

        return new BaseResponse(Map.of(
            "id", colorImage.getId(),
            "url", colorImage.getUrl(),
            "hairColorId", colorImage.getHairColor().getId()
        ));
    }
}
