---
title: Maven
---
Maven은 Java 기반 프로젝트를 빌드하고 관리하는 데 사용할 수 있는 빌드 시스템입니다.

## 플러그인 구성 및 활성화

`kotlin-maven-plugin`은 Kotlin 소스 및 모듈을 컴파일합니다. 현재 Maven v3만 지원됩니다.

`pom.xml` 파일에서 `kotlin.version` 속성에 사용할 Kotlin 버전을 정의합니다.

```xml
<properties>
    <kotlin.version>2.1.20</kotlin.version>
</properties>
```

`kotlin-maven-plugin`을 활성화하려면 `pom.xml` 파일을 업데이트합니다.

```xml
<plugins>
<plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>2.1.20</version>
    </plugin>
</plugins>
```

### JDK 17 사용

JDK 17을 사용하려면 `.mvn/jvm.config` 파일에 다음을 추가합니다.

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 저장소 선언

기본적으로 `mavenCentral` 저장소는 모든 Maven 프로젝트에서 사용할 수 있습니다. 다른 저장소의 아티팩트에 액세스하려면
`<repositories>` 요소에 각 저장소의 ID와 URL을 지정합니다.

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

:::note
Gradle 프로젝트에서 `mavenLocal()`을 저장소로 선언하면 Gradle과 Maven 프로젝트 간에 전환할 때 문제가 발생할 수 있습니다. 자세한 내용은 [저장소 선언](gradle-configure-project#declare-repositories)을 참조하세요.

:::

## 종속성 설정

Kotlin에는 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리가 있습니다.
프로젝트에서 표준 라이브러리를 사용하려면 `pom.xml` 파일에 다음 종속성을 추가합니다.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

:::note
Kotlin 버전이 다음보다 오래된 JDK 7 또는 8을 대상으로 하는 경우:
* 1.8, `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 각각 사용합니다.
* 1.2, `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 각각 사용합니다.

::: 

프로젝트에서 [Kotlin reflection](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)
또는 테스트 기능을 사용하는 경우 해당 종속성도 추가해야 합니다.
아티팩트 ID는 reflection 라이브러리의 경우 `kotlin-reflect`이고 테스트 라이브러리의 경우 `kotlin-test` 및 `kotlin-test-junit`입니다.

## Kotlin 전용 소스 코드 컴파일

소스 코드를 컴파일하려면 `<build>` 태그에 소스 디렉토리를 지정합니다.

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

소스를 컴파일하려면 Kotlin Maven Plugin을 참조해야 합니다.

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

Kotlin 1.8.20부터 위의 전체 `<executions>` 요소를 `<extensions>true</extensions>`로 바꿀 수 있습니다. 
확장을 활성화하면 `compile`, `test-compile`, `kapt` 및 `test-kapt` 실행이 빌드에 자동으로 추가되어 해당 [lifecycle phases](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)에 바인딩됩니다. 
실행을 구성해야 하는 경우 해당 ID를 지정해야 합니다. 이에 대한 예는 다음 섹션에서 확인할 수 있습니다.

:::note
여러 빌드 플러그인이 기본 라이프사이클을 덮어쓰고 `extensions` 옵션도 활성화한 경우 `<build>` 섹션의 마지막 플러그인이 라이프사이클 설정 측면에서 우선 순위를 갖습니다. 라이프사이클 설정에 대한 이전의 모든 변경 사항은 무시됩니다.

:::

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## Kotlin 및 Java 소스 컴파일

Kotlin 및 Java 소스 코드를 포함하는 프로젝트를 컴파일하려면 Java 컴파일러 전에 Kotlin 컴파일러를 호출합니다.
Maven 용어로 이는 `pom.xml` 파일에서 `kotlin` 플러그인이 `maven-compiler-plugin` 앞에 오도록 다음 방법을 사용하여 `maven-compiler-plugin` 전에 `kotlin-maven-plugin`을 실행해야 함을 의미합니다.

```xml
<build>
<plugins>
<plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- You can set this option 
            to automatically take information about lifecycles -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- You can skip the <goals> element 
                        if you enable extensions for the plugin -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> 
                        <goal>test-compile</goal> <!-- You can skip the <goals> element 
                    if you enable extensions for the plugin -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
<plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- Replacing default-compile as it is treated specially by Maven -->
                <execution>
                    <id>default-compile</id>
<phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by Maven -->
                <execution>
                    <id>default-testCompile</id>
<phase>none</phase>
                </execution>
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

## 증분 컴파일 활성화

빌드를 더 빠르게 만들려면 `kotlin.compiler.incremental` 속성을 추가하여 증분 컴파일을 활성화할 수 있습니다.

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

또는 `-Dkotlin.compiler.incremental=true` 옵션을 사용하여 빌드를 실행합니다.

## 어노테이션 처리 구성

[`kapt` – Maven에서 사용](kapt#use-in-maven)을 참조하세요.

## JAR 파일 생성

모듈의 코드만 포함하는 작은 JAR 파일을 생성하려면 Maven `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함합니다. 여기서 `main.class`는 속성으로 정의되고 기본 Kotlin 또는 Java 클래스를 가리킵니다.

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

## 자체 포함 JAR 파일 생성

종속성과 함께 모듈의 코드를 포함하는 자체 포함 JAR 파일을 생성하려면 Maven `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함합니다. 여기서 `main.class`는 속성으로 정의되고 기본 Kotlin 또는 Java 클래스를 가리킵니다.

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

이 자체 포함 JAR 파일을 JRE에 직접 전달하여 애플리케이션을 실행할 수 있습니다.

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 컴파일러 옵션 지정

컴파일러에 대한 추가 옵션 및 인수는 Maven 플러그인 노드의 `<configuration>` 요소 아래에 태그로 지정할 수 있습니다.

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- If you want to enable automatic addition of executions to your build -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- Enable strict mode for JSR-305 annotations -->
            ...
        </args>
    </configuration>
</plugin>
```

대부분의 옵션은 속성을 통해 구성할 수도 있습니다.

```xml
<project ...>
<properties>
        <kotlin.compiler.languageVersion>2.1</kotlin.compiler.languageVersion>
    </properties>
</project>
```

다음 속성이 지원됩니다.

### JVM 관련 속성

| 이름              | 속성 이름                   | 설명                                                                                          | 가능한 값                                  | 기본값               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 경고를 생성하지 않음                                                                                 | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 지정된 Kotlin 버전과의 소스 호환성 제공                                                                   | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 지정된 버전의 번들 라이브러리에서만 선언을 사용할 수 있도록 허용                                                       | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | 컴파일할 소스 파일을 포함하는 디렉토리                                                                    |                                                  | 프로젝트 소스 루트    |
| `compilerPlugins` |                                 | 활성화된 컴파일러 플러그인                                                                             |                                                  | []                          |
| `pluginOptions`   |                                 | 컴파일러 플러그인 옵션                                                                         |                                                  | []                          |
| `args`            |                                 | 추가 컴파일러 인수                                                                        |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 생성된 JVM 바이트 코드의 대상 버전                                                         | "1.8", "9", "10", ..., "23"                      | "1.8" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 기본 JAVA_HOME 대신 지정된 위치에서 사용자 정의 JDK를 클래스 경로에 포함합니다. |                                                  |                             |

## BOM 사용

Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)을 사용하려면
[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 종속성을 작성합니다.

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>2.1.20</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 문서 생성

표준 Javadoc 생성 플러그인(`maven-javadoc-plugin`)은 Kotlin 코드를 지원하지 않습니다. Kotlin 프로젝트에 대한 문서를 생성하려면
[Dokka](https://github.com/Kotlin/dokka)를 사용하세요. Dokka는 혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다.
Maven 프로젝트에서 Dokka를 구성하는 방법에 대한 자세한 내용은 [Maven](dokka-maven)을 참조하세요.

## OSGi 지원 활성화

[Maven 프로젝트에서 OSGi 지원을 활성화하는 방법 알아보기](kotlin-osgi#maven).