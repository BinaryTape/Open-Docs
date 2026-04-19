[//]: # (title: Maven 프로젝트에서 저장소 및 의존성 설정하기)

Kotlin Maven 프로젝트의 경우, 기본 Maven Central 저장소 외에 Maven이 아티팩트를 찾을 위치를 구성하고 프로젝트가 의존하는 라이브러리를 정의할 수 있습니다.

## 저장소 선언

기본적으로 `mavenCentral` 저장소는 모든 Maven 프로젝트에서 사용할 수 있습니다. 다른 저장소의 아티팩트에 액세스하려면 `<repositories>` 섹션에 저장소 이름에 대한 사용자 지정 ID와 URL을 지정하세요.

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle 프로젝트에서 `mavenLocal()`을 저장소로 선언하면 Gradle과 Maven 프로젝트 사이를 전환할 때 문제가 발생할 수 있습니다. 자세한 내용은 [저장소 선언](gradle-configure-project.md#declare-repositories)을 참고하세요.
>
{style="note"}

일반적으로 라이브러리에 대한 의존성을 추가하려면 `<dependencies>` 섹션에 새로운 `<dependency>` 항목을 선언해야 합니다.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## 의존성 설정

### 표준 라이브러리 의존성

Kotlin은 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리를 제공합니다. 표준 라이브러리 의존성을 수동으로 추가하거나, `<extensions>` 옵션을 활성화하여 누락된 경우 자동으로 설정되도록 할 수 있습니다.

#### 자동 설정

Kotlin Maven 플러그인에서 제공하는 [`<extensions>` 옵션](maven-configure-project.md#automatic-configuration)을 사용하면 수동 구성을 피할 수 있습니다. 이 옵션은 프로젝트에 `kotlin-stdlib` 의존성이 정의되어 있지 않은 경우 자동으로 추가합니다. 예를 들어, 새로운 Kotlin Maven 프로젝트를 생성하거나 기존 Java Maven 프로젝트에 Kotlin을 도입할 때 유용합니다.

다른 버전의 `kotlin-stdlib` 의존성을 이미 선언한 경우, `<extensions>`가 포함된 Kotlin Maven 플러그인은 이를 덮어쓰지 않습니다.

표준 라이브러리 자동 추가 기능을 사용하지 않도록 선택할 수도 있습니다. 이를 위해 `<properties>` 섹션에 다음 내용을 추가하세요.

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

> 이 속성은 표준 라이브러리의 자동 추가뿐만 아니라 소스 루트 경로의 등록도 비활성화합니다. 다른 `<extensions>` 기능에는 영향을 주지 않습니다.
>
{style="note"}

#### 수동 구성

프로젝트에 Kotlin 표준 라이브러리를 수동으로 추가하려면 `pom.xml` 파일의 `dependencies` 섹션을 다음과 같이 업데이트하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/>에 지정된 kotlin.version을 사용합니다: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 다음보다 낮은 버전의 Kotlin으로 JDK 7 또는 8을 대상으로 하는 경우:
> * 1.8 미만인 경우, 각각 `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 사용하세요.
> * 1.2 미만인 경우, 각각 `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 사용하세요.
>
{style="note"}

### 테스트 라이브러리 의존성

프로젝트에서 [Kotlin 리플렉션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)이나 테스트 프레임워크를 사용하는 경우 관련 의존성을 추가하세요. 리플렉션 라이브러리에는 `kotlin-reflect`를, 테스트 라이브러리에는 `kotlin-test` 및 `kotlin-test-junit5`를 사용하세요.

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

kotlinx 라이브러리의 경우 기본 아티팩트 이름을 추가하거나 `-jvm` 접미사가 붙은 이름을 추가할 수 있습니다. [klibs.io](https://klibs.io/)에 있는 라이브러리의 README 파일을 참고하세요.

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

Kotlin [BOM(Bill of Materials)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)을 사용하려면 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 의존성을 추가하세요.

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

[Kotlin 컴파일러 구성](maven-kotlin-compiler.md)