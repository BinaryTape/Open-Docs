[//]: # (title: 모듈 문서화)

모듈 전체와 해당 모듈 내의 패키지에 대한 문서는 별도의 마크다운 파일로 제공할 수 있습니다.

## 파일 형식

마크다운 파일 내에서 모듈 전체 및 개별 패키지에 대한 문서는 해당 1단계 헤딩으로 시작됩니다. 헤딩 텍스트는 모듈의 경우 **Module `<module name>`**이어야 하며, 패키지의 경우 **Package `<package qualified name>`**여야 합니다.

파일에 모듈 및 패키지 문서가 모두 포함될 필요는 없습니다. 패키지 또는 모듈 문서만 포함하는 파일을 가질 수 있습니다. 심지어 모듈 또는 패키지별로 마크다운 파일을 가질 수도 있습니다.

[마크다운 문법](https://www.markdownguide.org/basic-syntax/)을 사용하여 다음을 추가할 수 있습니다:
* 최대 6단계까지의 헤딩
* 굵게 또는 이탤릭체 서식으로 강조
* 링크
* 인라인 코드
* 코드 블록
* 인용 블록

다음은 모듈 및 패키지 문서를 모두 포함하는 예시 파일입니다:

```text
# Module kotlin-demo

This content appears under your module name.

# Package org.jetbrains.kotlin.demo

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo`

# Package org.jetbrains.kotlin.demo2

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo2

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo2`
```

Gradle을 사용한 예시 프로젝트를 살펴보려면 [Dokka Gradle 예시](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)를 참조하세요.

## Dokka에 파일 전달

이 파일들을 Dokka에 전달하려면 Gradle, Maven 또는 CLI에 해당하는 **includes** 옵션을 사용해야 합니다:

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

[소스 세트 구성](dokka-gradle.md#source-set-configuration)에서 [includes](dokka-gradle.md#includes) 옵션을 사용하세요.

</tab>

<tab title="Maven" group-key="mvn">

[일반 구성](dokka-maven.md#general-configuration)에서 [includes](dokka-maven.md#includes) 옵션을 사용하세요.

</tab>

<tab title="CLI" group-key="cli">

명령줄 구성을 사용 중이라면 [소스 세트 옵션](dokka-cli.md#source-set-options)에서 [includes](dokka-cli.md#includes-cli) 옵션을 사용하세요.

JSON 구성을 사용 중이라면 [일반 구성](dokka-cli.md#general-configuration)에서 [includes](dokka-cli.md#includes-json) 옵션을 사용하세요.

</tab>
</tabs>