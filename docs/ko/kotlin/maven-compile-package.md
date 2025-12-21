[//]: # (title: Maven 프로젝트 컴파일 및 패키징)

Maven 프로젝트를 설정하여 Kotlin 전용 소스 또는 Kotlin과 Java 혼합 소스를 컴파일하고, Kotlin 컴파일러를 구성하며, 컴파일러 옵션을 지정하고, 애플리케이션을 JAR로 패키징할 수 있습니다.

## 소스 코드 컴파일 구성

소스 코드가 올바르게 컴파일되도록 하려면 프로젝트 구성을 조정하세요. Maven 프로젝트는 [Kotlin 전용 소스](#compile-kotlin-only-sources)를 컴파일하거나 [Kotlin 및 Java 소스](#compile-kotlin-and-java-sources)를 혼합하여 컴파일하도록 설정할 수 있습니다.

### Kotlin 전용 소스 컴파일

Kotlin 소스 코드를 컴파일하려면:

1. `<build>` 섹션에 소스 디렉토리를 지정합니다:

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. Kotlin Maven 플러그인이 적용되었는지 확인합니다:

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

위의 전체 `<executions>` 섹션을 `<extensions>true</extensions>`로 대체할 수 있습니다. 확장을 활성화하면 `compile`, `test-compile`, `kapt`, `test-kapt` 실행을 빌드에 자동으로 추가하며, 해당 [수명 주기 단계](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)에 바인딩됩니다. 실행을 구성해야 하는 경우 해당 ID를 지정해야 합니다. 다음 섹션에서 이 예시를 찾을 수 있습니다.

> 여러 빌드 플러그인이 기본 수명 주기를 덮어쓰고 `extensions` 옵션을 활성화한 경우, `<build>` 섹션의 마지막 플러그인이 수명 주기 설정 측면에서 우선권을 가집니다. 이전의 모든 수명 주기 설정 변경은 무시됩니다.
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### Kotlin 및 Java 소스 컴파일

Kotlin 및 Java 소스 파일이 모두 포함된 프로젝트를 컴파일하려면 Kotlin 컴파일러가 Java 컴파일러보다 먼저 실행되도록 해야 합니다. Java 컴파일러는 Kotlin 선언이 `.class` 파일로 컴파일될 때까지는 해당 선언을 볼 수 없습니다. Java 코드가 Kotlin 클래스를 사용하는 경우, `cannot find symbol` 오류를 피하려면 해당 클래스를 먼저 컴파일해야 합니다.

Maven은 다음 두 가지 주요 요소에 기반하여 플러그인 실행 순서를 결정합니다:

* `pom.xml` 파일 내의 플러그인 선언 순서.
* `pom.xml` 파일 내 위치에 관계없이 사용자 정의 실행보다 항상 먼저 실행되는 `default-compile` 및 `default-testCompile`과 같은 내장된 기본 실행.

실행 순서를 제어하려면:

* `kotlin-maven-plugin`을 `maven-compiler-plugin`보다 먼저 선언합니다.
* Java 컴파일러 플러그인의 기본 실행을 비활성화합니다.
* 컴파일 단계를 명시적으로 제어하기 위해 사용자 정의 실행을 추가합니다.

> Maven에서 특별한 `none` 단계를 사용하여 기본 실행을 비활성화할 수 있습니다.
>
{style="note"}

`extensions`를 사용하여 Kotlin/Java 혼합 컴파일의 구성을 단순화할 수 있습니다. 이를 통해 Maven 컴파일러 플러그인 구성을 건너뛸 수 있습니다:

<tabs group="kotlin-java-maven">
<tab title="확장 기능을 사용하여" group-key="with-extensions">

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
                            <!-- Ensure Kotlin code can reference Java code -->
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
        <!-- No need to configure Maven compiler plugin with extensions -->
    </plugins>
</build>
```

프로젝트에 이전에 Kotlin 전용 구성이 있었다면, `<build>` 섹션에서 다음 줄도 제거해야 합니다:

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

이는 `extensions` 설정을 통해 Kotlin 코드가 Java 코드를 참조할 수 있고 그 반대도 가능하도록 보장합니다.

</tab>
<tab title="확장 기능 없이" group-key="no-extensions">

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
                            <!-- Ensure Kotlin code can reference Java code -->
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
                <!-- Disable default executions -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- Define custom executions -->
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

* Kotlin 코드가 먼저 컴파일됩니다.
* Java 코드는 Kotlin 이후에 컴파일되며 Kotlin 클래스를 참조할 수 있습니다.
* 기본 Maven 동작이 플러그인 순서를 덮어쓰지 않습니다.

Maven이 플러그인 실행을 처리하는 방법에 대한 자세한 내용은 공식 Maven 문서의 [기본 플러그인 실행 ID 가이드](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)를 참조하세요.

## Kotlin 컴파일러 구성

### 실행 전략 선택

_Kotlin 컴파일러 실행 전략_은 Kotlin 컴파일러가 실행되는 위치를 정의합니다. 두 가지 전략을 사용할 수 있습니다:

| 전략 | Kotlin 컴파일러가 실행되는 위치 |
|---|---|
| Kotlin 데몬 (기본값) | 자체 데몬 프로세스 내부 |
| 인-프로세스 (In process) | Maven 프로세스 내부 |

기본적으로 [Kotlin 데몬](kotlin-daemon.md)이 사용됩니다. `pom.xml` 파일에 다음 속성을 설정하여 "인-프로세스" 전략으로 전환할 수 있습니다:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

사용하는 컴파일러 실행 전략과 관계없이 증분 컴파일을 명시적으로 구성해야 합니다.

### 증분 컴파일 활성화

빌드를 더 빠르게 만들려면 `kotlin.compiler.incremental` 속성을 추가하여 증분 컴파일을 활성화할 수 있습니다:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

또는 `-Dkotlin.compiler.incremental=true` 옵션으로 빌드를 실행합니다.

### 컴파일러 옵션 지정

컴파일러에 대한 추가 옵션 및 인수는 Maven 플러그인 노드의 `<configuration>` 섹션에 요소로 지정할 수 있습니다:

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

많은 옵션은 속성을 통해서도 구성할 수 있습니다:

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

다음 속성이 지원됩니다:

#### JVM에 특정한 속성

| 이름 | 속성 이름 | 설명 | 가능한 값 | 기본값 |
|---|---|---|---|---|
| `nowarn` | | 경고를 생성하지 않음 | `true`, `false` | `false` |
| `languageVersion` | kotlin.compiler.languageVersion | 지정된 Kotlin 버전과의 소스 호환성 제공 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (실험적) | |
| `apiVersion` | kotlin.compiler.apiVersion | 번들 라이브러리의 지정된 버전에서만 선언 사용 허용 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (실험적) | |
| `sourceDirs` | | 컴파일할 소스 파일이 포함된 디렉토리 | | 프로젝트 소스 루트 |
| `compilerPlugins` | | 활성화된 컴파일러 플러그인 | | `[]` |
| `pluginOptions` | | 컴파일러 플러그인 옵션 | | `[]` |
| `args` | | 추가 컴파일러 인수 | | `[]` |
| `jvmTarget` | `kotlin.compiler.jvmTarget` | 생성된 JVM 바이트코드의 대상 버전 | "1.8", "9", "10", ..., "25" | "%defaultJvmTargetVersion%" |
| `jdkHome` | `kotlin.compiler.jdkHome` | 지정된 위치의 사용자 지정 JDK를 기본 JAVA_HOME 대신 클래스패스에 포함 | | |

## 프로젝트 패키징

### JAR 파일 생성

모듈의 코드만 포함하는 작은 JAR 파일을 생성하려면, Maven `pom.xml` 파일의 `<build><plugins>` 아래에 다음 내용을 포함합니다. 여기서 `main.class`는 속성으로 정의되며 주 Kotlin 또는 Java 클래스를 가리킵니다:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
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

### 자체 포함 JAR 파일 생성

모듈의 코드와 해당 의존성(dependencies)을 모두 포함하는 자체 포함 JAR 파일을 생성하려면, Maven `pom.xml` 파일의 `<build><plugins>` 아래에 다음 내용을 포함합니다. 여기서 `main.class`는 속성으로 정의되며 주 Kotlin 또는 Java 클래스를 가리킵니다:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
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

이 자체 포함 JAR 파일은 JRE에 직접 전달하여 애플리케이션을 실행할 수 있습니다:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar