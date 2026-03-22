[//]: # (title: Maven 프로젝트 구성하기)

Maven으로 Kotlin 프로젝트를 빌드하려면 `pom.xml` 빌드 파일에 Kotlin Maven 플러그인을 추가하고, 저장소(repositories)를 선언하며, 프로젝트의 의존성(dependencies)을 구성해야 합니다.

## 플러그인 활성화 및 구성

`kotlin-maven-plugin`은 Kotlin 소스와 모듈을 컴파일합니다. 현재 Maven v3만 지원됩니다.

Kotlin Maven 플러그인을 적용하려면 `pom.xml` 빌드 파일을 다음과 같이 업데이트하세요.

1. `<properties>` 섹션에서 사용할 Kotlin 버전을 `kotlin.version` 속성에 정의합니다.

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. `<build><plugins>` 섹션에 Kotlin Maven 플러그인을 추가합니다.

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version>
           </plugin>
       </plugins>
   </build>
   ```

3. <p id="extension">(선택 사항) 프로젝트 구성을 간소화하기 위해 <code>extensions</code> 옵션을 활성화할 수도 있습니다. 이를 위해 `pom.xml` 파일의 Kotlin Maven 플러그인 섹션을 다음과 같이 업데이트하세요.</p>

   ```xml
   <plugins>
       <plugin>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-maven-plugin</artifactId>
           <version>${kotlin.version}</version>
           <extensions>true</extensions> <!-- 이 확장을 추가합니다 -->
       </plugin>
   </plugins>
   ```

   Kotlin Maven 플러그인의 `extensions` 옵션은 자동으로 다음 작업을 수행합니다.

   * `src/main/kotlin` 및 `src/test/kotlin` 디렉터리가 이미 존재하지만 플러그인 구성에 지정되지 않은 경우, 이를 소스 루트(source roots)로 등록합니다.
   * 프로젝트에 [`kotlin-stdlib` 의존성](#dependency-on-the-standard-library)이 정의되어 있지 않은 경우 이를 추가합니다.

### JDK 17 사용

JDK 17을 사용하려면 `.mvn/jvm.config` 파일에 다음을 추가하세요.

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 저장소 선언

기본적으로 모든 Maven 프로젝트에서 `mavenCentral` 저장소를 사용할 수 있습니다. 다른 저장소의 아티팩트(artifacts)에 접근하려면, `<repositories>` 섹션에 저장소 이름에 대한 사용자 정의 ID와 URL을 지정하세요.

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle 프로젝트에서 `mavenLocal()`을 저장소로 선언하면, Gradle과 Maven 프로젝트 사이를 전환할 때 문제가 발생할 수 있습니다. 자세한 내용은 [저장소 선언](gradle-configure-project.md#declare-repositories)을 참고하세요.
>
{style="note"}

## 의존성 설정

라이브러리에 대한 의존성을 추가하려면 `<dependencies>` 섹션에 포함하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 표준 라이브러리에 대한 의존성

Kotlin은 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리(standard library)를 제공합니다. 표준 라이브러리 의존성을 수동으로 추가하거나, [`extensions` 옵션](#extension)을 활성화하여 누락된 경우 자동으로 설정되도록 할 수 있습니다.

#### 수동 구성

프로젝트에 Kotlin 표준 라이브러리를 수동으로 추가하려면, `pom.xml` 파일의 `dependencies` 섹션을 다음과 같이 업데이트하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/>에 지정된 
            kotlin.version 속성을 사용합니다: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 다음 버전보다 낮은 버전의 Kotlin으로 JDK 7 또는 8을 타겟팅하는 경우:
> * 1.8 미만인 경우, 각각 `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 사용하세요.
> * 1.2 미만인 경우, 각각 `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 사용하세요.
>
{style="note"}

### 자동 설정

Kotlin Maven 플러그인이 제공하는 [`extensions` 옵션](#extension)을 사용하여 수동 구성을 피할 수 있습니다. 이 옵션은 새 Kotlin Maven 프로젝트를 생성하거나 기존 Java Maven 프로젝트에 Kotlin을 도입할 때와 같이 프로젝트에 `kotlin-stdlib` 의존성이 정의되지 않은 경우 자동으로 추가해 줍니다.

표준 라이브러리의 자동 추가를 비활성화할 수도 있습니다. 그러려면 `<properties>` 섹션에 다음을 추가하세요.

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

이 속성은 소스 루트 경로 등록을 포함하여 모든 간소화된 설정 기능을 비활성화한다는 점에 유의하세요.

### 테스트 라이브러리에 대한 의존성

프로젝트에서 [Kotlin 리플렉션(reflection)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)이나 테스트 프레임워크를 사용하는 경우, 관련 의존성을 추가하세요. 리플렉션 라이브러리에는 `kotlin-reflect`를 사용하고, 테스트 라이브러리에는 `kotlin-test` 및 `kotlin-test-junit5`를 사용하세요.

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

### kotlinx 라이브러리에 대한 의존성

kotlinx 라이브러리의 경우, 기본 아티팩트 이름이나 `-jvm` 접미사가 붙은 이름을 추가할 수 있습니다. [klibs.io](https://klibs.io/)에 있는 라이브러리의 README 파일을 참고하세요.

예를 들어, [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 라이브러리에 대한 의존성을 추가하려면 다음과 같이 합니다.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 라이브러리에 대한 의존성을 추가하려면 다음과 같이 합니다.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### BOM 의존성 매커니즘 사용

Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)을 사용하려면, [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 의존성을 추가하세요.

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

## 다음 단계는?

[Kotlin Maven 프로젝트 컴파일 및 패키징](maven-compile-package.md)