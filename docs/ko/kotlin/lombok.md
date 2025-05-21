---
title: "Lombok 컴파일러 플러그인"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Lombok 컴파일러 플러그인은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin Lombok 컴파일러 플러그인을 사용하면 동일한 혼합 Java/Kotlin 모듈에서 Kotlin 코드로 Java의 Lombok 선언을 생성하고 사용할 수 있습니다.
다른 모듈에서 이러한 선언을 호출하는 경우 해당 모듈을 컴파일하는 데 이 플러그인을 사용할 필요가 없습니다.

Lombok 컴파일러 플러그인은 [Lombok](https://projectlombok.org/)을 대체할 수 없지만 혼합 Java/Kotlin 모듈에서 Lombok이 작동하도록 도와줍니다.
따라서 이 플러그인을 사용할 때도 평소와 같이 Lombok을 구성해야 합니다.
[Lombok 컴파일러 플러그인 구성 방법](#using-the-lombok-configuration-file)에 대해 자세히 알아보세요.

## 지원되는 어노테이션

이 플러그인은 다음 어노테이션을 지원합니다.
* `@Getter`, `@Setter`
* `@Builder`, `@SuperBuilder`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

이 플러그인에 대한 작업을 계속 진행하고 있습니다. 자세한 현재 상태를 알아보려면 [Lombok 컴파일러 플러그인의 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)를 방문하십시오.

현재 `@Tolerate` 어노테이션은 지원할 계획이 없습니다. 그러나 YouTrack에서 [@Tolerate issue](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)에 투표하면 고려할 수 있습니다.

Kotlin 컴파일러는 Kotlin 코드에서 Lombok 어노테이션을 사용하는 경우 이를 무시합니다.

:::

## Gradle

`build.gradle(.kts)` 파일에서 `kotlin-plugin-lombok` Gradle 플러그인을 적용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.lombok") version "2.1.20"
    id("io.freefair.lombok") version "8.13"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '2.1.20'
    id 'io.freefair.lombok' version '8.13'
}
```

</TabItem>
</Tabs>

[Lombok 컴파일러 플러그인 사용 예제가 포함된 이 테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)를 참조하십시오.

### Lombok 구성 파일 사용

[Lombok 구성 파일](https://projectlombok.org/features/configuration) `lombok.config`를 사용하는 경우 플러그인이 파일을 찾을 수 있도록 파일의 경로를 설정해야 합니다.
경로는 모듈 디렉토리를 기준으로 상대적이어야 합니다.
예를 들어 `build.gradle(.kts)` 파일에 다음 코드를 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</TabItem>
</Tabs>

[Lombok 컴파일러 플러그인 및 `lombok.config` 사용 예제가 포함된 이 테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)를 참조하십시오.

## Maven

Lombok 컴파일러 플러그인을 사용하려면 `compilerPlugins` 섹션에 플러그인 `lombok`을 추가하고 `dependencies` 섹션에 종속성 `kotlin-maven-lombok`을 추가합니다.
[Lombok 구성 파일](https://projectlombok.org/features/configuration) `lombok.config`를 사용하는 경우
`pluginOptions`에서 플러그인에 대한 경로를 제공합니다. `pom.xml` 파일에 다음 줄을 추가합니다.

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

[Lombok 컴파일러 플러그인 및 `lombok.config` 사용 예제가 포함된 이 테스트 프로젝트](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)를 참조하십시오.

## kapt와 함께 사용

기본적으로 [kapt](kapt) 컴파일러 플러그인은 모든 어노테이션 프로세서를 실행하고 javac에 의한 어노테이션 처리를 비활성화합니다.
[Lombok](https://projectlombok.org/)을 kapt와 함께 실행하려면 javac의 어노테이션 프로세서가 계속 작동하도록 kapt를 설정합니다.

Gradle을 사용하는 경우 `build.gradle(.kts)` 파일에 옵션을 추가합니다.

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven에서는 다음 설정을 사용하여 Lombok을 Java 컴파일러와 함께 실행합니다.

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

어노테이션 프로세서가 Lombok에서 생성된 코드에 의존하지 않는 경우 Lombok 컴파일러 플러그인은 [kapt](kapt)와 함께 올바르게 작동합니다.

kapt 및 Lombok 컴파일러 플러그인 사용 예제 테스트 프로젝트를 살펴보십시오.
* [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt) 사용.
* [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt) 사용

## 명령줄 컴파일러

Lombok 컴파일러 플러그인 JAR은 Kotlin 컴파일러의 바이너리 배포판에서 사용할 수 있습니다. `Xplugin` kotlinc 옵션을 사용하여 JAR 파일 경로를 제공하여 플러그인을 연결할 수 있습니다.

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

`lombok.config` 파일을 사용하려면 `<PATH_TO_CONFIG_FILE>`을 `lombok.config` 경로로 바꿉니다.

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```