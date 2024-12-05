package barbershop.hair_color_service.services.impl;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.dtos.request.SaveHairColorRequest;
import barbershop.hair_color_service.dtos.response.BaseResponse;
import barbershop.hair_color_service.dtos.response.FieldErrorsResponse;
import barbershop.hair_color_service.dtos.response.PaginationResponse;
import barbershop.hair_color_service.dtos.response.ResponseSuccess;
import barbershop.hair_color_service.entities.ColorImage;
import barbershop.hair_color_service.entities.HairColor;
import barbershop.hair_color_service.enums.Color;
import barbershop.hair_color_service.exception.HttpException;
import barbershop.hair_color_service.repositories.ColorImageRepository;
import barbershop.hair_color_service.repositories.HairColorRepository;
import barbershop.hair_color_service.services.HairColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
    public BaseResponse getColors(boolean forAdmin) throws Exception {
        List<HairColor> hairColors = hairColorRepository.findAll();
        List<Map<String, Object>> ls = new ArrayList<>();
        for (HairColor hairColor : hairColors) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", hairColor.getId());
            map.put("color", hairColor.getColor());
            map.put("colorCode", hairColor.getColorCode());
            if (!forAdmin && hairColor.isActive()) {
                ls.add(map);
            }
            if (forAdmin) {
                ls.add(map);
            }
        }
        return new BaseResponse(ls);
    }

    @Override
    public PaginationResponse getAll(PaginationRequest paginationRequest, boolean forAdmin) throws Exception {
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
        HairColor hairColor = hairColorRepository.save(
                HairColor.builder()
                        .color(saveHairColorRequest.getColor())
                        .colorCode(saveHairColorRequest.getColorCode())
                .build()
        );
        if (id != 0) {
            hairColor.setId(id);
        }

        return new BaseResponse(
                Map.of(
                        "id", hairColor.getId(),
                        "color", hairColor.getColor(),
                        "colorCode", hairColor.getColorCode()
                )
        );
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

        HairColor hairColor = hairColorRepository.findByColorAndColorCode(saveHairColorRequest.getColor(), saveHairColorRequest.getColorCode())
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
}
