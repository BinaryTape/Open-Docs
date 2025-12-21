[//]: # (title: Dokka 시작하기)

아래에서 Dokka를 시작하는 데 도움이 되는 간단한 지침을 찾을 수 있습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

**Gradle Dokka 플러그인 적용**

프로젝트의 루트 빌드 스크립트에 Dokka Gradle 플러그인(DGP)을 적용합니다:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**멀티 프로젝트 빌드 문서화**

[멀티 프로젝트 빌드](https://docs.gradle.org/current/userguide/multi_project_builds.html)를 문서화할 때,
문서화하려는 모든 서브프로젝트에 플러그인을 적용합니다. 다음 접근 방식 중 하나를 사용하여 서브프로젝트 간에 Dokka 구성을 공유합니다:

* 컨벤션 플러그인
* 컨벤션 플러그인을 사용하지 않는 경우 각 서브프로젝트에서 직접 구성

멀티 프로젝트 빌드에서 Dokka 구성 공유에 대한 자세한 내용은 [멀티 프로젝트 구성](dokka-gradle.md#multi-project-configuration)을 참조하세요.

**문서 생성**

문서를 생성하려면 다음 Gradle 작업을 실행합니다:

```bash
./gradlew :dokkaGenerate
```

이 작업은 싱글 및 멀티 프로젝트 빌드 모두에 작동합니다.

집계 프로젝트에서 `dokkaGenerate` 작업을 실행할 때는 작업 앞에 프로젝트 경로(`:`)를 접두사로 붙이세요. 예를 들어:

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` 또는 `./gradlew :aggregatingProject:dokkaGenerate` 대신 `./gradlew dokkaGenerate`를 실행하지 마세요.
작업 앞에 프로젝트 경로(`:`)가 없으면 Gradle은 전체 빌드에서 모든 `dokkaGenerate` 작업을 실행하려고 시도하며, 이는 불필요한 작업을 유발할 수 있습니다.

다양한 작업을 사용하여 [HTML](dokka-html.md),
[Javadoc](dokka-javadoc.md) 또는 [HTML 및 Javadoc](dokka-gradle.md#configure-documentation-output-format) 형식으로 출력을 생성할 수 있습니다.

> Gradle과 함께 Dokka를 사용하는 방법에 대해 자세히 알아보려면 [Gradle](dokka-gradle.md)을 참조하세요.
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

**Gradle Dokka 플러그인 적용**

프로젝트의 루트 빌드 스크립트에 Dokka용 Gradle 플러그인을 적용합니다:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**멀티 프로젝트 빌드 문서화**

[멀티 프로젝트 빌드](https://docs.gradle.org/current/userguide/multi_project_builds.html)를 문서화할 때,
문서화하려는 모든 서브프로젝트에 플러그인을 적용해야 합니다. 다음 접근 방식 중 하나를 사용하여 서브프로젝트 간에 Dokka 구성을 공유합니다:

* 컨벤션 플러그인
* 컨벤션 플러그인을 사용하지 않는 경우 각 서브프로젝트에서 직접 구성

멀티 프로젝트 빌드에서 Dokka 구성 공유에 대한 자세한 내용은 [멀티 프로젝트 구성](dokka-gradle.md#multi-project-configuration)을 참조하세요.

**문서 생성**

문서를 생성하려면 다음 Gradle 작업을 실행합니다:

```bash
./gradlew :dokkaGenerate
```

이 작업은 싱글 및 멀티 프로젝트 빌드 모두에 작동합니다.

집계 프로젝트에서 `dokkaGenerate` 작업을 실행할 때는 작업 앞에 프로젝트 경로를 접두사로 붙이세요. 예를 들어:

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

`./gradlew :dokkaGenerate` 또는 `./gradlew :aggregatingProject:dokkaGenerate` 대신 `./gradlew dokkaGenerate`를 실행하지 마세요.
작업 앞에 프로젝트 경로(`:`)가 없으면 Gradle은 전체 빌드에서 모든 `dokkaGenerate` 작업을 실행하려고 시도하며, 이는 불필요한 작업을 유발할 수 있습니다.

다양한 작업을 사용하여 [HTML](dokka-html.md),
[Javadoc](dokka-javadoc.md) 또는 [HTML 및 Javadoc](dokka-gradle.md#configure-documentation-output-format) 형식으로 출력을 생성할 수 있습니다.

> Gradle과 함께 Dokka를 사용하는 방법에 대해 자세히 알아보려면 [Gradle](dokka-gradle.md)을 참조하세요.
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

POM 파일의 `plugins` 섹션에 Dokka용 Maven 플러그인을 추가합니다:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

문서를 생성하려면 `dokka:dokka` 목표를 실행합니다.

기본적으로 출력 디렉터리는 `target/dokka`로 설정됩니다.

Maven과 함께 Dokka를 사용하는 방법에 대해 자세히 알아보려면 [Maven](dokka-maven.md)을 참조하세요.

</tab>
</tabs>