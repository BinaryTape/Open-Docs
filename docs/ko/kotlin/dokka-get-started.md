[//]: # (title: Dokka 시작하기)

아래에서 Dokka를 시작하는 데 도움이 되는 간단한 지침을 찾을 수 있습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 이 지침은 Dokka Gradle 플러그인 v1의 구성 및 작업을 반영합니다. Dokka 2.0.0부터는 여러 구성 옵션, Gradle 작업 및 문서 생성 단계가 업데이트되었습니다. 다음이 포함됩니다:
>
> * [구성 옵션 조정](dokka-migration.md#adjust-configuration-options)
> * [멀티 모듈 프로젝트 작업](dokka-migration.md#share-dokka-configuration-across-modules)
> * [업데이트된 작업으로 문서 생성](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [출력 디렉터리 지정](dokka-migration.md#output-directory)
>
> Dokka Gradle 플러그인 v2의 변경 사항에 대한 자세한 내용 및 전체 목록은 [마이그레이션 가이드](dokka-migration.md)를 참조하세요.
>
{style="note"}

프로젝트의 루트 빌드 스크립트에 Dokka용 Gradle 플러그인을 적용합니다:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

[멀티 프로젝트](https://docs.gradle.org/current/userguide/multi_project_builds.html) 빌드를 문서화할 때, 서브프로젝트에도 Gradle 플러그인을 적용해야 합니다:

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

문서를 생성하려면 다음 Gradle 작업을 실행합니다:

* `dokkaHtml` (싱글 프로젝트 빌드용)
* `dokkaHtmlMultiModule` (멀티 프로젝트 빌드용)

기본적으로 출력 디렉터리는 `/build/dokka/html` 및 `/build/dokka/htmlMultiModule`로 설정됩니다.

Gradle과 함께 Dokka를 사용하는 방법에 대해 자세히 알아보려면 [Gradle](dokka-gradle.md)을 참조하세요.

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

프로젝트의 루트 빌드 스크립트에 Dokka용 Gradle 플러그인을 적용합니다:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

[멀티 프로젝트](https://docs.gradle.org/current/userguide/multi_project_builds.html) 빌드를 문서화할 때, 서브프로젝트에도 Gradle 플러그인을 적용해야 합니다:

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

문서를 생성하려면 다음 Gradle 작업을 실행합니다:

* `dokkaHtml` (싱글 프로젝트 빌드용)
* `dokkaHtmlMultiModule` (멀티 프로젝트 빌드용)

기본적으로 출력 디렉터리는 `/build/dokka/html` 및 `/build/dokka/htmlMultiModule`로 설정됩니다.

Gradle과 함께 Dokka를 사용하는 방법에 대해 자세히 알아보려면 [Gradle](dokka-gradle.md)을 참조하세요.

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