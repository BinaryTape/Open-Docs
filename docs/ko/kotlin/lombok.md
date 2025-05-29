[//]: # (title: Lombok 컴파일러 플러그인)

> Lombok 컴파일러 플러그인은 [실험적 기능](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin Lombok 컴파일러 플러그인은 동일한 혼합 Java/Kotlin 모듈 내에서 Kotlin 코드로 Java의 Lombok 선언을 생성하고 사용할 수 있도록 합니다.
다른 모듈에서 이러한 선언을 호출하는 경우에는 해당 모듈의 컴파일을 위해 이 플러그인을 사용할 필요가 없습니다.

Lombok 컴파일러 플러그인은 [Lombok](https://projectlombok.org/)을 대체할 수는 없지만, 혼합 Java/Kotlin 모듈에서 Lombok이 작동하도록 돕습니다.
따라서 이 플러그인을 사용할 때에도 평소와 같이 Lombok을 구성해야 합니다.
[Lombok 컴파일러 플러그인을 구성하는 방법](#using-the-lombok-configuration-file)에 대해 자세히 알아보세요.

## 지원되는 어노테이션

플러그인은 다음 어노테이션을 지원합니다:
* `@Getter`, `@Setter`
* `@Builder`, `@SuperBuilder`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

저희는 이 플러그인에 대한 작업을 계속하고 있습니다. 자세한 현재 상태를 확인하려면 [Lombok 컴파일러 플러그인 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)를 방문하세요.

현재로서는 `@Tolerate` 어노테이션을 지원할 계획이 없습니다. 하지만 [YouTrack](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)에서 [@Tolerate 문제](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)에 투표해 주시면 고려할 수 있습니다.

> Kotlin 컴파일러는 Kotlin 코드에서 Lombok 어노테이션을 사용하는 경우 이를 무시합니다.
>
{style="note"}

## Gradle

`build.gradle(.kts)` 파일에 `kotlin-plugin-lombok` Gradle 플러그인을 적용하십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "%lombokVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '%lombokVersion%'
}
```

</tab>
</tabs>

Lombok 컴파일러 플러그인 사용 예시가 있는 이 [테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)를 참조하십시오.

### Lombok 구성 파일 사용

[Lombok 구성 파일](https://projectlombok.org/features/configuration)인 `lombok.config`를 사용하는 경우, 플러그인이 해당 파일을 찾을 수 있도록 파일 경로를 설정해야 합니다.
경로는 모듈 디렉터리에 대해 상대적이어야 합니다.
예를 들어, `build.gradle(.kts)` 파일에 다음 코드를 추가하십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

Lombok 컴파일러 플러그인과 `lombok.config` 사용 예시가 있는 이 [테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)를 참조하십시오.

## Maven

Lombok 컴파일러 플러그인을 사용하려면 `compilerPlugins` 섹션에 `lombok` 플러그인을 추가하고 `dependencies` 섹션에 `kotlin-maven-lombok` 의존성을 추가하십시오.
[Lombok 구성 파일](https://projectlombok.org/features/configuration)인 `lombok.config`를 사용하는 경우, `pluginOptions`에서 플러그인에 해당 파일의 경로를 제공하십시오. `pom.xml` 파일에 다음 줄을 추가하십시오:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
            <plugin>lombok</plugin>
        </compilerPlugins>
        <pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

Lombok 컴파일러 플러그인과 `lombok.config` 사용 예시가 있는 이 [테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)를 참조하십시오.

## kapt와 함께 사용

기본적으로 [kapt](kapt.md) 컴파일러 플러그인은 모든 어노테이션 프로세서를 실행하고 javac에 의한 어노테이션 처리를 비활성화합니다.
[Lombok](https://projectlombok.org/)을 kapt와 함께 실행하려면 javac의 어노테이션 프로세서가 계속 작동하도록 kapt를 설정하십시오.

Gradle을 사용하는 경우, `build.gradle(.kts)` 파일에 다음 옵션을 추가하십시오:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven에서는 Java 컴파일러로 Lombok을 실행하기 위해 다음 설정을 사용하십시오:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>    
```

Lombok 컴파일러 플러그인은 어노테이션 프로세서가 Lombok에 의해 생성된 코드에 의존하지 않는 경우 [kapt](kapt.md)와 함께 올바르게 작동합니다.

kapt 및 Lombok 컴파일러 플러그인 사용 예시가 있는 테스트 프로젝트를 살펴보십시오:
* [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt) 사용
* [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt) 사용

## 명령줄 컴파일러

Lombok 컴파일러 플러그인 JAR는 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다. `Xplugin` kotlinc 옵션을 사용하여 JAR 파일의 경로를 제공함으로써 플러그인을 첨부할 수 있습니다:

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

`lombok.config` 파일을 사용하려면 `<PATH_TO_CONFIG_FILE>`을 `lombok.config` 파일의 경로로 바꾸십시오:

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>