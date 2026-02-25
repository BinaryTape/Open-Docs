[//]: # (title: 모듈 문서화)

서브프로젝트 전체 및 해당 서브프로젝트 내 패키지에 대한 문서는 별도의 Markdown 파일로 제공될 수 있습니다.

## 파일 형식

Markdown 파일 내에서 서브프로젝트 전체와 개별 패키지에 대한 문서는 해당하는 1단계 제목(heading)으로 시작합니다. 제목의 텍스트는 서브프로젝트의 경우 **Module `<module name>`**이어야 하며, 패키지의 경우 **Package `<package qualified name>`**이어야 **합니다**.

파일에 서브프로젝트와 패키지 문서가 모두 포함될 필요는 없습니다. 패키지나 서브프로젝트 문서만 포함하는 파일을 만들 수도 있습니다. 심지어 서브프로젝트 또는 패키지당 하나의 Markdown 파일을 가질 수도 있습니다.

[Markdown 문법](https://www.markdownguide.org/basic-syntax/)을 사용하여 다음을 추가할 수 있습니다:
* 최대 6단계까지의 제목
* 굵게 또는 기울임꼴 형식을 사용한 강조
* 링크
* 인라인 코드
* 코드 블록
* 인용구

다음은 서브프로젝트와 패키지 문서가 모두 포함된 예시 파일입니다:

```text
# Module kotlin-demo

이 내용은 서브프로젝트 이름 아래에 표시됩니다.

# Package org.jetbrains.kotlin.demo

이 내용은 패키지 목록의 패키지 이름 아래에 표시됩니다.
또한 패키지 페이지의 1단계 제목 아래에도 표시됩니다.

## org.jetbrains.kotlin.demo 패키지를 위한 2단계 제목

이 제목 뒤의 내용도 `org.jetbrains.kotlin.demo`에 대한 문서의 일부입니다.

# Package org.jetbrains.kotlin.demo2

이 내용은 패키지 목록의 패키지 이름 아래에 표시됩니다.
또한 패키지 페이지의 1단계 제목 아래에도 표시됩니다.

## org.jetbrains.kotlin.demo2 패키지를 위한 2단계 제목

이 제목 뒤의 내용도 `org.jetbrains.kotlin.demo2`에 대한 문서의 일부입니다.
```

Gradle을 사용한 예제 프로젝트를 살펴보려면 [Dokka gradle 예제](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)를 참고하세요.

## Dokka에 파일 전달하기

이 파일들을 Dokka에 전달하려면 Gradle, Maven 또는 CLI에서 관련 **includes** 옵션을 사용해야 합니다.

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

[일반 설정](dokka-gradle-configuration-options.md)의 `includes` 옵션을 사용하세요.

</tab>

<tab title="Maven" group-key="mvn">

[일반 설정](dokka-maven.md#general-configuration)의 `includes` 옵션을 사용하세요.

</tab>

<tab title="CLI" group-key="cli">

커맨드 라인 설정을 사용하는 경우, [소스 세트 옵션](dokka-cli.md#source-set-options)의 `includes` 옵션을 사용하세요.

JSON 설정을 사용하는 경우, [일반 설정](dokka-cli.md#general-configuration)의 `includes` 옵션을 사용하세요.

</tab>
</tabs>