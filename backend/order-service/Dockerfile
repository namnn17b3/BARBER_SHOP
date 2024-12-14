FROM openjdk:17-jdk-alpine
EXPOSE 8886
EXPOSE 28886
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh
ARG JAR_FILE=target/*.jar
COPY ./target/order-service-0.0.1-SNAPSHOT.jar order-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/order-service-0.0.1-SNAPSHOT.jar"]
