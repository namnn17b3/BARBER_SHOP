package barbershop.user_service.exception;

import javax.validation.ConstraintViolationException;

import barbershop.user_service.dtos.request.FieldErrorsResponse;
import barbershop.user_service.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle exception when validate data
     *
     * @param e
     * @param request
     * @return errorResponse
     */
    @ExceptionHandler({ConstraintViolationException.class,
            MissingServletRequestParameterException.class
    })
    @ResponseStatus(BAD_REQUEST)
    public ErrorResponse handleValidationException(Exception e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setStatus(BAD_REQUEST.value());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

        String message = e.getMessage();
        if (e instanceof MethodArgumentNotValidException) {
            int start = message.lastIndexOf("[") + 1;
            int end = message.lastIndexOf("]") - 1;
            message = message.substring(start, end);
            errorResponse.setError("Invalid Payload");
            errorResponse.setMessage(message);
        } else if (e instanceof MissingServletRequestParameterException) {
            errorResponse.setError("Invalid Parameter");
            errorResponse.setMessage(message);
        } else if (e instanceof ConstraintViolationException) {
            errorResponse.setError("Invalid Parameter");
            errorResponse.setMessage(message.substring(message.indexOf(" ") + 1));
        } else if (e instanceof BindException) {
            String[] messages = message.split("\n");
            message = "";
            for (int i = 1; i < messages.length; i++) {
                int start = messages[i].lastIndexOf("default message [") + "default message [".length();
                int end = messages[i].lastIndexOf("]");
                message += messages[i].substring(start, end);
                if (i < messages.length - 1) {
                    message += "; ";
                }
            }
            errorResponse.setError("Invalid Data");
            errorResponse.setMessage(message);
        }
        else {
            errorResponse.setError("Invalid Data");
            errorResponse.setMessage(message);
        }

        return errorResponse;
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(BAD_REQUEST)
    public Map<String, Object> handleMethodArgumentNotValidException(Exception e, WebRequest request) {
        List<FieldErrorsResponse.FieldError> errors = ((MethodArgumentNotValidException) e).getFieldErrors()
                .stream()
                .map(item ->
                        FieldErrorsResponse.FieldError.builder()
                                .field(item.getField())
                                .resource(Utils.capitalize(item.getObjectName()))
                                .message(item.getDefaultMessage())
                                .build()
                )
                .collect(Collectors.toList());
        return Map.of("errors", errors);
    }

    @ExceptionHandler({BindException.class})
    @ResponseStatus(BAD_REQUEST)
    public Map<String, Object> handleBindException(Exception e, WebRequest request) {
        List<FieldError> fieldErrors = ((BindException) e).getFieldErrors();
        List<FieldErrorsResponse.FieldError> errors = new ArrayList<>();
        for (FieldError fieldError : fieldErrors) {
            FieldErrorsResponse.FieldError fe = new FieldErrorsResponse.FieldError();
            fe.setField(fieldError.getField());
            fe.setMessage(fieldError.getDefaultMessage());
            fe.setResource(Utils.capitalize(fieldError.getObjectName()));
            errors.add(fe);
        }
        return Map.of("errors", errors);
    }

    @ExceptionHandler({MaxUploadSizeExceededException.class})
    @ResponseStatus(BAD_REQUEST)
    public Map<String, Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e, WebRequest request) {
        System.out.println("MaxUploadSizeExceededException");
        List<FieldErrorsResponse.FieldError> errors = new ArrayList<>();

        FieldErrorsResponse.FieldError fe = new FieldErrorsResponse.FieldError();
        fe.setField("File up load");
        fe.setMessage("Maximum upload size exceeded, limit: 10MB");
        fe.setResource(Utils.capitalize("Request body"));
        errors.add(fe);

        return Map.of("errors", errors);
    }

    @ExceptionHandler({ImageFileTypeException.class})
    @ResponseStatus(BAD_REQUEST)
    public Map<String, Object> handleImageFileTypeException(ImageFileTypeException e, WebRequest request) {
        System.out.println("ImageFileTypeException");
        List<FieldErrorsResponse.FieldError> errors = new ArrayList<>();

        FieldErrorsResponse.FieldError fe = new FieldErrorsResponse.FieldError();
        fe.setField(e.getField());
        fe.setMessage(e.getMessage()+" at " + e.getField() + " " + e.getResource());
        fe.setResource(Utils.capitalize(e.getResource()));
        errors.add(fe);

        return Map.of("errors", errors);
    }

    @ExceptionHandler({FieldErrorsResponse.class})
    @ResponseStatus(BAD_REQUEST)
    public Map<String, Object> handleFieldErrorsResponseException(Exception e, WebRequest request) {
        List<FieldErrorsResponse.FieldError> fieldErrors = ((FieldErrorsResponse) e).getErrors();
        List<FieldErrorsResponse.FieldError> errors = new ArrayList<>();
        for (FieldErrorsResponse.FieldError fieldError : fieldErrors) {
            FieldErrorsResponse.FieldError fe = new FieldErrorsResponse.FieldError();
            fe.setField(fieldError.getField());
            fe.setMessage(fieldError.getMessage());
            fe.setResource(Utils.capitalize(fieldError.getResource()));
            errors.add(fe);
            System.out.println(fieldError.getField() + " " + fieldError.getMessage() + " " + Utils.capitalize(fieldError.getResource()));
        }
        return Map.of("errors", errors);
    }

    /**
     * Handle exception when the request not found data
     *
     * @param e
     * @param request
     * @return
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        errorResponse.setStatus(NOT_FOUND.value());
        errorResponse.setError(NOT_FOUND.getReasonPhrase());
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }

    /**
     * Handle exception when the data is conflicted
     *
     * @param e
     * @param request
     * @return
     */
    @ExceptionHandler(InvalidDataException.class)
    @ResponseStatus(CONFLICT)
    public ErrorResponse handleDuplicateKeyException(InvalidDataException e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        errorResponse.setStatus(CONFLICT.value());
        errorResponse.setError(CONFLICT.getReasonPhrase());
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }

    @ExceptionHandler(HttpException.class)
    @ResponseStatus(OK)
    public ErrorResponse handleHttpException(HttpException e, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        errorResponse.setStatus(e.getStatus());
        errorResponse.setError(e.getMessage());
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }

    /**
     * Handle exception when internal server error
     *
     * @param e
     * @param request
     * @return error
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception e, WebRequest request) {
        e.printStackTrace();
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        errorResponse.setStatus(INTERNAL_SERVER_ERROR.value());
        errorResponse.setError(INTERNAL_SERVER_ERROR.getReasonPhrase());
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }
}
