package barbershop.user_service.enums;

public enum TimeZone {
    ASIA_HCM("Asia/Ho_Chi_Minh");

    private String value;
    TimeZone(String value) {
        this.value = value;
    }

    public String value() {
        return this.value;
    }
}
