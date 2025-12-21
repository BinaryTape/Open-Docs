[//]: # (title: Maven 프로젝트 구성하기)

Maven으로 Kotlin 프로젝트를 빌드하려면 `pom.xml` 빌드 파일에 Kotlin Maven 플러그인을 추가하고, 저장소를 선언하며, 프로젝트의 의존성을 구성해야 합니다.

## 플러그인 활성화 및 구성

`kotlin-maven-plugin`은 Kotlin 소스 및 모듈을 컴파일합니다. 현재 Maven v3만 지원됩니다.

Kotlin Maven 플러그인을 적용하려면 `pom.xml` 빌드 파일을 다음과 같이 업데이트하십시오.

1.  `<properties>` 섹션에서 `kotlin.version` 속성에 사용하려는 Kotlin 버전을 정의합니다.

    ```xml
    <properties>
        <kotlin.version>%kotlinVersion%</kotlin.version>
    </properties>
    ```

2.  `<build><plugins>` 섹션에 Kotlin Maven 플러그인을 추가합니다.

    ```xml
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>%kotlinVersion%</version>
        </plugin>
    </plugins>
    ```

### JDK 17 사용하기

JDK 17을 사용하려면 `.mvn/jvm.config` 파일에 다음을 추가하십시오.

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 저장소 선언하기

기본적으로 `mavenCentral` 저장소는 모든 Maven 프로젝트에서 사용할 수 있습니다. 다른 저장소의 아티팩트에 접근하려면 `<repositories>` 섹션에 저장소 이름에 대한 사용자 지정 ID와 해당 URL을 지정하십시오.

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle 프로젝트에서 `mavenLocal()`을 저장소로 선언하면 Gradle 프로젝트와 Maven 프로젝트 간 전환 시 문제가 발생할 수 있습니다. 자세한 내용은 [저장소 선언하기](gradle-configure-project.md#declare-repositories)를 참조하십시오.
>
{style="note"}

## 의존성 설정하기

라이브러리에 대한 의존성을 추가하려면 `<dependencies>` 섹션에 포함하십시오.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 표준 라이브러리 의존성

Kotlin은 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리를 가지고 있습니다. 프로젝트에서 표준 라이브러리를 사용하려면 `pom.xml` 파일에 다음 의존성을 추가하십시오.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/>에 지정된 kotlin.version 속성을 사용합니다: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 다음 버전보다 오래된 Kotlin 버전으로 JDK 7 또는 8을 대상으로 하는 경우:
> * 1.8의 경우, 각각 `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 사용하십시오.
> * 1.2의 경우, 각각 `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 사용하십시오.
>
{style="note"}

### 테스트 라이브러리 의존성

프로젝트에서 [Kotlin 리플렉션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/) 또는 테스트 프레임워크를 사용하는 경우, 관련 의존성을 추가하십시오. 리플렉션 라이브러리에는 `kotlin-reflect`를 사용하고, 테스트 라이브러리에는 `kotlin-test`와 `kotlin-test-junit5`를 사용하십시오.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### kotlinx 라이브러리 의존성

kotlinx 라이브러리의 경우, 기본 아티팩트 이름 또는 `-jvm` 접미사가 붙은 이름을 추가할 수 있습니다. [klibs.io](https://klibs.io/)에서 해당 라이브러리의 README 파일을 참조하십시오.

예를 들어, [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 라이브러리에 대한 의존성을 추가하려면:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 라이브러리에 대한 의존성을 추가하려면:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### BOM 의존성 메커니즘 사용

Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)을 사용하려면 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 의존성을 추가하십시오:

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 다음 단계

[Kotlin Maven 프로젝트 컴파일 및 패키징](maven-compile-package.md)