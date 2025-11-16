[//]: # (title: 메이븐)

메이븐은 모든 자바 기반 프로젝트를 빌드하고 관리하는 데 사용할 수 있는 빌드 시스템입니다.

## 플러그인 구성 및 활성화

`kotlin-maven-plugin`은 코틀린 소스와 모듈을 컴파일합니다. 현재는 Maven v3만 지원됩니다.

`pom.xml` 파일에서 사용할 코틀린 버전을 `kotlin.version` 프로퍼티에 정의합니다:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

`kotlin-maven-plugin`을 활성화하려면 `pom.xml` 파일을 업데이트합니다:

```xml
<plugins>
    <plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

### JDK 17 사용

JDK 17을 사용하려면 `.mvn/jvm.config` 파일에 다음을 추가합니다:

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 저장소 선언

기본적으로 `mavenCentral` 저장소는 모든 메이븐 프로젝트에서 사용할 수 있습니다. 다른 저장소의 아티팩트에 접근하려면,
`<repositories>` 엘리먼트에 각 저장소의 ID와 URL을 지정합니다:

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle 프로젝트에서 `mavenLocal()`을 저장소로 선언하면 Gradle과 Maven 프로젝트 간에 전환할 때 문제가 발생할 수 있습니다. 자세한 내용은 [저장소 선언](gradle-configure-project.md#declare-repositories)을 참조하세요.
>
{style="note"}

## 의존성 설정

라이브러리에 대한 의존성을 추가하려면, `<dependencies>` 엘리먼트에 포함하세요:

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

코틀린은 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리를 가지고 있습니다.
프로젝트에서 표준 라이브러리를 사용하려면, 다음 의존성을 `pom.xml` 파일에 추가합니다:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/>에 지정된 kotlin.version 프로퍼티를 사용합니다: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 다음과 같은 이전 버전의 코틀린으로 JDK 7 또는 8을 대상으로 하는 경우:
> * 1.8 미만 버전에서는 각각 `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 사용하세요.
> * 1.2 미만 버전에서는 각각 `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 사용하세요.
>
{style="note"}

### 테스트 라이브러리 의존성

프로젝트에서 [코틀린 리플렉션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)
또는 테스트 프레임워크를 사용하는 경우, 해당 의존성도 추가합니다.
리플렉션 라이브러리의 경우 `kotlin-reflect`를 사용하고, 테스트 라이브러리의 경우 `kotlin-test` 및 `kotlin-test-junit`을 사용합니다.

예를 들어:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

### kotlinx 라이브러리 의존성

kotlinx 라이브러리에 따라 기본 아티팩트 이름 또는 `-jvm` 접미사가 붙은 이름을 추가할 수 있습니다.
자세한 내용은 [klibs.io](https://klibs.io/)의 라이브러리 README 파일을 참조하세요.

예를 들어, `kotlinx.coroutines`에 대한 의존성을 추가하려면:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

`kotlinx-datetime`에 대한 의존성을 추가하려면:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

## 코틀린 전용 소스 코드 컴파일

소스 코드를 컴파일하려면, `<build>` 태그에 소스 디렉터리를 지정합니다:

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

소스를 컴파일하려면 코틀린 메이븐 플러그인을 참조해야 합니다:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

코틀린 1.8.20부터 위 `<executions>` 엘리먼트 전체를 `<extensions>true</extensions>`로 대체할 수 있습니다.
확장을 활성화하면 `compile`, `test-compile`, `kapt`, `test-kapt` 실행이 빌드에 자동으로 추가되어
해당 [라이프사이클 단계](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)에 바인딩됩니다.
실행을 구성해야 하는 경우 ID를 지정해야 합니다. 다음 섹션에서 이 예시를 찾을 수 있습니다.

> 여러 빌드 플러그인이 기본 라이프사이클을 덮어쓰고 `extensions` 옵션을 활성화한 경우, `<build>` 섹션의 마지막 플러그인이
> 라이프사이클 설정에 우선권을 가집니다. 이전 라이프사이클 설정에 대한 모든 변경사항은 무시됩니다.
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## 코틀린 및 자바 소스 컴파일

코틀린 및 자바 소스 파일이 모두 포함된 프로젝트를 컴파일하려면, 코틀린 컴파일러가 자바 컴파일러보다 먼저 실행되는지 확인합니다.
자바 컴파일러는 코틀린 선언이 `.class` 파일로 컴파일되기 전까지는 볼 수 없습니다.
자바 코드가 코틀린 클래스를 사용하는 경우, `cannot find symbol` 오류를 피하기 위해 해당 클래스가 먼저 컴파일되어야 합니다.

메이븐은 다음 두 가지 주요 요인에 따라 플러그인 실행 순서를 결정합니다:

*   `pom.xml` 파일의 플러그인 선언 순서.
*   내장된 기본 실행(`default-compile` 및 `default-testCompile` 등)은 `pom.xml` 파일 내 위치와 관계없이 항상 사용자 정의 실행보다 먼저 실행됩니다.

실행 순서를 제어하려면:

*   `maven-compiler-plugin`보다 먼저 `kotlin-maven-plugin`을 선언합니다.
*   자바 컴파일러 플러그인의 기본 실행을 비활성화합니다.
*   컴파일 단계를 명시적으로 제어하기 위해 사용자 지정 실행을 추가합니다.

> 메이븐의 특별한 `none` 단계를 사용하여 기본 실행을 비활성화할 수 있습니다.
>
{style="note"}

`extensions`를 사용하여 혼합 코틀린/자바 컴파일 구성을 간소화할 수 있습니다.
이것은 메이븐 컴파일러 플러그인 구성을 건너뛸 수 있도록 합니다:

<tabs group="kotlin-java-maven">
<tab title="확장 사용" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <phase>compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 코틀린 코드가 자바 코드를 참조할 수 있도록 합니다 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>default-test-compile</id>
                    <phase>test-compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!-- 확장 사용 시 메이븐 컴파일러 플러그인을 구성할 필요 없음 -->
    </plugins>
</build>
```

프로젝트에 이전에 코틀린 전용 구성이 있었다면, `<build>` 섹션에서 다음 줄도 제거해야 합니다:

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

이를 통해 `extensions` 설정을 사용하여 코틀린 코드가 자바 코드를 참조할 수 있고 그 반대도 가능하도록 합니다.

</tab>
<tab title="확장 미사용" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 코틀린 코드가 자바 코드를 참조할 수 있도록 합니다 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Maven compiler plugin configuration -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- 기본 실행 비활성화 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- 사용자 지정 실행 정의 -->
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

이 구성은 다음을 보장합니다:

*   코틀린 코드가 먼저 컴파일됩니다.
*   자바 코드는 코틀린 이후에 컴파일되며 코틀린 클래스를 참조할 수 있습니다.
*   기본 메이븐 동작이 플러그인 순서를 재정의하지 않습니다.

메이븐이 플러그인 실행을 처리하는 방법에 대한 자세한 내용은
공식 메이븐 문서의 [기본 플러그인 실행 ID 가이드](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)를 참조하세요.

## 코틀린 컴파일러 실행 전략 구성

_코틀린 컴파일러 실행 전략_은 코틀린 컴파일러가 실행되는 위치를 정의합니다. 두 가지 전략을 사용할 수 있습니다:

| 전략             | 코틀린 컴파일러가 실행되는 위치 |
|------------------|-----------------------------------|
| 코틀린 데몬 (기본값) | 자체 데몬 프로세스 내부         |
| 인-프로세스      | 메이븐 프로세스 내부            |

기본적으로 [코틀린 데몬](kotlin-daemon.md)이 사용됩니다. `pom.xml` 파일에 다음 프로퍼티를 설정하여 "인-프로세스" 전략으로 전환할 수 있습니다:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

사용하는 컴파일러 실행 전략과 관계없이 증분 컴파일을 명시적으로 구성해야 합니다.

## 증분 컴파일 활성화

빌드를 더 빠르게 만들려면 `kotlin.compiler.incremental` 프로퍼티를 추가하여 증분 컴파일을 활성화할 수 있습니다:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

또는 `-Dkotlin.compiler.incremental=true` 옵션으로 빌드를 실행합니다.

## 어노테이션 처리 구성

[`kapt` – Maven에서 사용하기](kapt.md#use-in-maven)를 참조하세요.

## JAR 파일 생성

모듈의 코드만 포함하는 작은 JAR 파일을 생성하려면, 메이븐 `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함합니다. 여기서 `main.class`는 프로퍼티로 정의되며 메인 코틀린 또는 자바 클래스를 가리킵니다:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 독립 실행형 JAR 파일 생성

모듈의 코드와 의존성을 모두 포함하는 독립 실행형 JAR 파일을 생성하려면, 메이븐 `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함합니다. 여기서 `main.class`는 프로퍼티로 정의되며 메인 코틀린 또는 자바 클래스를 가리킵니다:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

이 독립 실행형 JAR 파일은 애플리케이션을 실행하기 위해 JRE에 직접 전달할 수 있습니다:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 컴파일러 옵션 지정

컴파일러를 위한 추가 옵션과 인자는 메이븐 플러그인 노드의 `<configuration>` 엘리먼트 아래에 태그로 지정할 수 있습니다:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 빌드에 실행을 자동으로 추가하려면 이 옵션을 활성화합니다 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 경고 비활성화 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305 어노테이션에 대한 strict 모드 활성화 -->
            ...
        </args>
    </configuration>
</plugin>
```

많은 옵션은 프로퍼티를 통해서도 구성할 수 있습니다:

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

다음 속성이 지원됩니다:

### JVM 관련 속성

| 이름              | 프로퍼티 이름                   | 설명                                                                                          | 가능한 값                                  | 기본값              |
|-------------------|---------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 경고 생성 안 함                                                                               | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 지정된 코틀린 버전과의 소스 호환성 제공                                                       | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 번들된 라이브러리의 지정된 버전에서만 선언 사용 허용                                          | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | 컴파일할 소스 파일을 포함하는 디렉터리                                                        |                                                  | 프로젝트 소스 루트        |
| `compilerPlugins` |                                 | 활성화된 컴파일러 플러그인                                                                    |                                                  | []                          |
| `pluginOptions`   |                                 | 컴파일러 플러그인 옵션                                                                        |                                                  | []                          |
| `args`            |                                 | 추가 컴파일러 인자                                                                            |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 생성된 JVM 바이트코드의 대상 버전                                                             | "1.8", "9", "10", ..., "24"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 기본 JAVA_HOME 대신 지정된 위치의 사용자 지정 JDK를 클래스패스에 포함                         |                                                  |                             |

## BOM 사용

코틀린 [자재 명세서(BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)를 사용하려면,
[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 의존성을 작성합니다:

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

## 문서 생성

표준 Javadoc 생성 플러그인(`maven-javadoc-plugin`)은 코틀린 코드를 지원하지 않습니다.
코틀린 프로젝트의 문서를 생성하려면 [Dokka](https://github.com/Kotlin/dokka)를 사용하세요.
Dokka는 혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다.
메이븐 프로젝트에서 Dokka를 구성하는 방법에 대한 자세한 내용은 [Maven](dokka-maven.md)을 참조하세요.

## OSGi 지원 활성화

[메이븐 프로젝트에서 OSGi 지원을 활성화하는 방법 알아보기](kotlin-osgi.md#maven).