[//]: # (title: Maven)

Maven은 모든 자바 기반 프로젝트를 빌드하고 관리하는 데 사용할 수 있는 빌드 시스템입니다.

## 플러그인 구성 및 활성화

`kotlin-maven-plugin`은 Kotlin 소스 및 모듈을 컴파일합니다. 현재 Maven v3만 지원됩니다.

`pom.xml` 파일에서 `kotlin.version` 프로퍼티에 사용할 Kotlin 버전을 정의하세요.

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

`kotlin-maven-plugin`을 활성화하려면 `pom.xml` 파일을 업데이트하세요.

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

JDK 17을 사용하려면 `.mvn/jvm.config` 파일에 다음을 추가하세요.

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 리포지토리 선언

기본적으로 `mavenCentral` 리포지토리는 모든 Maven 프로젝트에서 사용할 수 있습니다. 다른 리포지토리의 아티팩트에 접근하려면 `<repositories>` 요소에 각 리포지토리의 ID와 URL을 지정하세요.

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle 프로젝트에서 `mavenLocal()`을 리포지토리로 선언하면 Gradle 프로젝트와 Maven 프로젝트 간에 전환할 때 문제가 발생할 수 있습니다. 자세한 내용은 [리포지토리 선언](gradle-configure-project.md#declare-repositories)을 참조하세요.
>
{style="note"}

## 의존성 설정

Kotlin은 애플리케이션에서 사용할 수 있는 광범위한 표준 라이브러리를 가지고 있습니다. 프로젝트에서 표준 라이브러리를 사용하려면 `pom.xml` 파일에 다음 의존성을 추가하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> Kotlin 버전이 다음보다 오래된 상태에서 JDK 7 또는 8을 대상으로 하는 경우:
> * 1.8, 각각 `kotlin-stdlib-jdk7` 또는 `kotlin-stdlib-jdk8`을 사용하세요.
> * 1.2, 각각 `kotlin-stdlib-jre7` 또는 `kotlin-stdlib-jre8`을 사용하세요.
>
{style="note"}

프로젝트에서 [Kotlin 리플렉션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html) 또는 테스트 기능을 사용하는 경우 해당 의존성도 추가해야 합니다. 리플렉션 라이브러리의 아티팩트 ID는 `kotlin-reflect`이며, 테스트 라이브러리의 아티팩트 ID는 `kotlin-test`와 `kotlin-test-junit`입니다.

## Kotlin 전용 소스 코드 컴파일

소스 코드를 컴파일하려면 `<build>` 태그에 소스 디렉토리를 지정하세요.

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

소스를 컴파일하려면 Kotlin Maven 플러그인을 참조해야 합니다.

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

Kotlin 1.8.20부터 위 `<executions>` 요소 전체를 `<extensions>true</extensions>`로 대체할 수 있습니다. 확장을 활성화하면 `compile`, `test-compile`, `kapt`, `test-kapt` 실행이 자동으로 빌드에 추가되며, 해당 실행은 적절한 [라이프사이클 단계](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)에 바인딩됩니다. 실행을 구성해야 하는 경우 해당 ID를 지정해야 합니다. 이에 대한 예시는 다음 섹션에서 찾을 수 있습니다.

> 여러 빌드 플러그인이 기본 라이프사이클을 덮어쓰고 `extensions` 옵션도 활성화한 경우, `<build>` 섹션의 마지막 플러그인이 라이프사이클 설정 측면에서 우선권을 가집니다. 라이프사이클 설정에 대한 이전의 모든 변경 사항은 무시됩니다.
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## Kotlin 및 Java 소스 컴파일

Kotlin 및 Java 소스 코드를 포함하는 프로젝트를 컴파일하려면 Java 컴파일러 전에 Kotlin 컴파일러를 호출하세요. Maven 용어로는 다음 방법을 사용하여 `kotlin-maven-plugin`이 `maven-compiler-plugin`보다 먼저 실행되어야 한다는 것을 의미하며, `pom.xml` 파일에서 `kotlin` 플러그인이 `maven-compiler-plugin`보다 먼저 오도록 확인해야 합니다.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- 빌드에 실행을 자동으로 추가하려면 이 옵션을 활성화하세요 -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- 플러그인에 대한 확장을 활성화하면 <goals> 요소를 생략할 수 있습니다 -->
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
                        <goal>test-compile</goal> <!-- 플러그인에 대한 확장을 활성화하면 <goals> 요소를 생략할 수 있습니다 -->
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
                <!-- Maven에 의해 특별히 처리되므로 default-compile을 대체합니다 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Maven에 의해 특별히 처리되므로 default-testCompile을 대체합니다 -->
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

빌드를 더 빠르게 하려면 `kotlin.compiler.incremental` 프로퍼티를 추가하여 증분 컴파일을 활성화할 수 있습니다.

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

또는 `-Dkotlin.compiler.incremental=true` 옵션으로 빌드를 실행하세요.

## 어노테이션 처리 구성

[`kapt` – Maven에서 사용하기](kapt.md#use-in-maven)를 참조하세요.

## JAR 파일 생성

모듈의 코드만 포함하는 작은 JAR 파일을 생성하려면, `main.class`가 프로퍼티로 정의되어 주 Kotlin 또는 Java 클래스를 가리키도록 Maven `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함하세요.

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

모듈의 코드와 해당 의존성을 함께 포함하는 자체 포함 JAR 파일을 생성하려면, `main.class`가 프로퍼티로 정의되어 주 Kotlin 또는 Java 클래스를 가리키도록 Maven `pom.xml` 파일의 `build->plugins` 아래에 다음을 포함하세요.

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

이 자체 포함 JAR 파일은 애플리케이션을 실행하기 위해 JRE에 직접 전달할 수 있습니다.

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 컴파일러 옵션 지정

컴파일러를 위한 추가 옵션 및 인자는 Maven 플러그인 노드의 `<configuration>` 요소 아래에 태그로 지정할 수 있습니다.

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 빌드에 실행을 자동으로 추가하려면 이 옵션을 활성화하세요 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 경고 비활성화 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305 어노테이션에 대한 엄격 모드 활성화 -->
            ...
        </args>
    </configuration>
</plugin>
```

많은 옵션은 프로퍼티를 통해서도 구성할 수 있습니다.

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

다음 속성들이 지원됩니다.

### JVM에 특화된 속성

| Name              | Property name                   | 설명                                                                                         | Possible values                                  | Default value               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 경고를 생성하지 않음                                                                                 | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 지정된 Kotlin 버전과의 소스 호환성 제공                                                              | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 번들된 라이브러리의 지정된 버전에서만 선언 사용 허용                                                       | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | 컴파일할 소스 파일을 포함하는 디렉토리                                                               |                                                  | The project source roots    |
| `compilerPlugins` |                                 | 활성화된 컴파일러 플러그인                                                                           |                                                  | []                          |
| `pluginOptions`   |                                 | 컴파일러 플러그인에 대한 옵션                                                                        |                                                  | []                          |
| `args`            |                                 | 추가 컴파일러 인자                                                                                   |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 생성된 JVM 바이트코드의 대상 버전                                                                    | "1.8", "9", "10", ..., "23"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 기본 JAVA_HOME 대신 지정된 위치의 사용자 지정 JDK를 클래스패스에 포함                                        |                                                  |                             |

## BOM 사용

Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)을 사용하려면 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)에 대한 의존성을 작성하세요.

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

표준 Javadoc 생성 플러그인(`maven-javadoc-plugin`)은 Kotlin 코드를 지원하지 않습니다. Kotlin 프로젝트용 문서를 생성하려면 [Dokka](https://github.com/Kotlin/dokka)를 사용하세요. Dokka는 혼합 언어 프로젝트를 지원하며 표준 Javadoc을 포함한 여러 형식으로 출력을 생성할 수 있습니다. Maven 프로젝트에서 Dokka를 구성하는 방법에 대한 자세한 내용은 [Maven](dokka-maven.md)을 참조하세요.

## OSGi 지원 활성화

[Maven 프로젝트에서 OSGi 지원을 활성화하는 방법](kotlin-osgi.md#maven)을 알아보세요.